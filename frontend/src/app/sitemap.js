const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:8082";
const apiBaseUrl = process.env.INTERNAL_API_URL || "http://127.0.0.1:8083";

export const revalidate = 86400;

const staticPages = [
  { path: "/", changeFrequency: "daily", priority: 1 },
  { path: "/search", changeFrequency: "daily", priority: 0.8 },
  { path: "/about-us", changeFrequency: "yearly", priority: 0.4 },
  { path: "/contact-us", changeFrequency: "yearly", priority: 0.4 },
  { path: "/privacy-policy", changeFrequency: "yearly", priority: 0.3 },
  { path: "/terms-and-conditions", changeFrequency: "yearly", priority: 0.3 },
];

function toDate(value) {
  if (Array.isArray(value) && value.length >= 3) {
    const [year, month, day, hour = 0, minute = 0, second = 0] = value;
    return new Date(year, month - 1, day, hour, minute, second);
  }
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? new Date() : parsed;
}

async function getListingEntries() {
  try {
    const res = await fetch(`${apiBaseUrl}/api/pgs`, { signal: AbortSignal.timeout(15000) });
    if (!res.ok) return [];
    const pgs = await res.json();
    return pgs
      .filter((pg) => pg && pg.slug)
      .map((pg) => ({
        url: `${baseUrl}/pg/${pg.slug}`,
        lastModified: toDate(pg.updatedAt ?? pg.createdAt),
        changeFrequency: "weekly",
        priority: 0.7,
      }));
  } catch {
    return [];
  }
}

export default async function sitemap() {
  const staticEntries = staticPages.map(({ path, changeFrequency, priority }) => ({
    url: `${baseUrl}${path}`,
    lastModified: new Date(),
    changeFrequency,
    priority,
  }));

  const listingEntries = await getListingEntries();

  return [...staticEntries, ...listingEntries];
}
