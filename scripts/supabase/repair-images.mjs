/**
 * Repair broken images rows (objects missing from the pg-images bucket).
 *
 * Finds images rows whose URL 404s, re-downloads the source photo from the
 * scraper CSVs, uploads it to storage, and rewrites the row URL with the
 * correct extension. Idempotent and re-runnable.
 *
 * Usage:
 *   node --env-file=../../.env.migrate repair-images.mjs [options]
 *
 * Options:
 *   --csv-dir <dir>   Scraper CSV directory (default: ../../scraper/output)
 *   --dry-run         Report what would be repaired, no writes
 *   --limit <n>       Only repair first n broken rows (testing)
 */
import fs from 'node:fs';
import path from 'node:path';
import { supabase, readCsv, PUBLIC_URL } from './utils.mjs';

const args = process.argv.slice(2);
const flags = {};
for (let i = 0; i < args.length; i++) {
  if (args[i].startsWith('--')) {
    const key = args[i].slice(2);
    const val = args[i + 1] && !args[i + 1].startsWith('--') ? args[++i] : 'true';
    flags[key] = val;
  }
}

const CSV_DIR = flags['csv-dir'] || path.resolve(import.meta.dirname, '../../scraper/output');
const DRY = !!flags['dry-run'];
const LIMIT = flags.limit ? Number(flags.limit) : Infinity;
const CONCURRENCY = 24;
const UA = { 'User-Agent': 'Mozilla/5.0 (compatible; LivioBot/1.0)' };

// ---------------------------------------------------------------------------
// Source photos from scraper CSVs: place_id -> { thumbnail, images[] }
// ---------------------------------------------------------------------------
const csvFiles = fs.readdirSync(CSV_DIR).filter((f) => f.endsWith('.csv'));
const sources = new Map();
for (const f of csvFiles) {
  for (const row of readCsv(path.join(CSV_DIR, f))) {
    const pid = (row.place_id || '').trim();
    if (pid && !sources.has(pid)) {
      let gallery = [];
      try { gallery = row.images ? JSON.parse(row.images) : []; } catch { /* keep [] */ }
      sources.set(pid, { thumbnail: row.thumbnail, gallery: Array.isArray(gallery) ? gallery : [] });
    }
  }
}
console.log(`Loaded ${sources.size} place sources from ${csvFiles.length} CSVs`);

// ---------------------------------------------------------------------------
// Find broken images rows
// ---------------------------------------------------------------------------
async function headStatus(url) {
  const r = await fetch(url, { method: 'HEAD' }).catch(() => ({ status: 0 }));
  return r.status;
}

const all = [];
let from = 0;
for (;;) {
  const { data, error } = await supabase.from('images').select('id, pg_id, url, is_primary').range(from, from + 999);
  if (error) throw error;
  all.push(...data);
  if (data.length < 1000) break;
  from += 1000;
}
console.log(`Checking ${all.length} image URLs (concurrency ${CONCURRENCY})...`);

const broken = [];
{
  let next = 0;
  let done = 0;
  await Promise.all(Array.from({ length: CONCURRENCY }, async () => {
    while (true) {
      const i = next++;
      if (i >= all.length) return;
      const im = all[i];
      let status = await headStatus(im.url);
      if (status === 0) status = await headStatus(im.url);
      if (!(status >= 200 && status < 300)) broken.push({ ...im, status });
      done++;
      if (done % 500 === 0) process.stdout.write(`  scanned ${done}/${all.length}\r`);
    }
  }));
  console.log('');
}
broken.sort((a, b) => a.id - b.id);
console.log(`Broken: ${broken.length} rows across ${new Set(broken.map((b) => b.pg_id)).size} PGs`);
if (!broken.length) process.exit(0);

// ---------------------------------------------------------------------------
// Repair
// ---------------------------------------------------------------------------
function parseName(url) {
  const name = decodeURIComponent(url.split('/').pop());
  const stripped = name.replace(/\.(jpe?g|png|webp)$/i, '');
  const m = stripped.match(/^(.*)_(thumb|\d+)$/);
  if (m) return { base: m[1], suffix: m[2] };
  return { base: stripped, suffix: 'bare' };
}

function sourceCandidatesFor(parsed, src) {
  if (!src) return [];
  const gallery = (src.gallery || []).map((e) => e?.image).filter(Boolean);
  const usable = (u) => u && !u.includes('streetviewpixels');
  if (parsed.suffix === 'thumb') return [src.thumbnail, ...gallery].filter(usable);
  if (parsed.suffix === 'bare') return [gallery[1], gallery[0]].filter(usable);
  const idx = Number(parsed.suffix);
  return [gallery[idx]].filter(usable);
}

async function withRetry(fn, attempts = 3, delayMs = 400) {
  let last;
  for (let i = 0; i < attempts; i++) {
    last = await fn();
    if (last.ok) return last;
    if (i < attempts - 1) await new Promise((res) => setTimeout(res, delayMs * (i + 1)));
  }
  return last;
}

async function download(url) {
  return withRetry(async () => {
    const res = await fetch(url, { headers: UA }).catch(() => null);
    if (!res || !res.ok) return { ok: false, status: res ? res.status : 'fetch failed' };
    const buf = Buffer.from(await res.arrayBuffer());
    if (buf.length < 100) return { ok: false, status: 'tiny body' };
    const ext = url.includes('.png') ? 'png' : 'jpg';
    return { ok: true, buf, ext, contentType: ext === 'png' ? 'image/png' : 'image/jpeg' };
  });
}

async function repairOne(im) {
  const parsed = parseName(im.url);
  if (!parsed) return { im, ok: false, reason: 'unparseable filename' };
  const src = sources.get(parsed.base);
  if (!src) return { im, ok: false, reason: 'place not found in CSVs' };

  const candidates = sourceCandidatesFor(parsed, src);
  if (!candidates.length) return { im, ok: false, reason: 'no source photo' };

  let dl = { ok: false, status: 'no candidate' };
  for (const srcUrl of candidates) {
    dl = await download(srcUrl);
    if (dl.ok) break;
  }
  if (!dl.ok) return { im, ok: false, reason: `source download ${dl.status}` };

  const storageName = `${parsed.base}.${dl.ext}`;
  const newUrl = `${PUBLIC_URL}/${storageName}`;

  const up = await withRetry(async () => {
    const { error } = await supabase.storage.from('pg-images').upload(storageName, dl.buf, {
      contentType: dl.contentType,
      upsert: true,
      cacheControl: '31536000',
    });
    return { ok: !error, error };
  });
  if (!up.ok) return { im, ok: false, reason: `upload: ${up.error?.message || 'failed'}` };

  if (im.url !== newUrl) {
    const { error: updErr } = await supabase.from('images').update({ url: newUrl }).eq('id', im.id);
    if (updErr) return { im, ok: false, reason: `db update: ${updErr.message}` };
  }

  const verify = await withRetry(async () => {
    const status = await headStatus(newUrl);
    return { ok: status >= 200 && status < 300, status };
  });
  if (!verify.ok) return { im, ok: false, reason: `verify ${verify.status}` };
  return { im, ok: true, newUrl };
}

if (DRY) {
  const plan = broken.map((im) => {
    const parsed = parseName(im.url);
    const n = parsed ? sourceCandidatesFor(parsed, sources.get(parsed.base)).length : 0;
    return `${im.url} -> ${n} source candidate(s)`;
  });
  console.log(`[DRY RUN] would repair:\n${plan.join('\n')}`);
  process.exit(0);
}

const results = [];
{
  let next = 0;
  await Promise.all(Array.from({ length: CONCURRENCY }, async () => {
    while (true) {
      const i = next++;
      if (i >= Math.min(broken.length, LIMIT)) return;
      results.push(await repairOne(broken[i]));
      process.stdout.write(`  repaired ${results.filter((r) => r.ok).length}/${Math.min(broken.length, LIMIT)}\r`);
    }
  }));
}
console.log('');

const failed = results.filter((r) => !r.ok);
console.log(`\nRepaired: ${results.filter((r) => r.ok).length}/${results.length}`);
if (failed.length) {
  console.log(`Failed: ${failed.length}`);
  console.log(failed.map((f) => `  ! img=${f.im.id} pg=${f.im.pg_id}: ${f.reason}`).join('\n'));
}
process.exit(failed.length ? 1 : 0);
