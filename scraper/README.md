# PG Data Scraper

Google Maps scraper for Livio PG Finder using [gosom/google-maps-scraper](https://github.com/gosom/google-maps-scraper).

## Prerequisites

- Docker installed and running
- No proxies needed (runs slowly but safely)

## Directory Structure

```
scraper/
├── docker-compose.yml      # Docker config
├── queries/                 # Search queries per city
│   ├── mumbai.txt
│   ├── bangalore.txt
│   ├── delhi.txt
│   └── pune.txt
├── output/                  # Scraped CSV files
└── scripts/
    └── scrape-city.sh      # Batch scrape script
```

## Usage

### Scrape a single city

```bash
cd scraper
./scripts/scrape-city.sh mumbai
```

### Scrape all cities (one by one)

```bash
cd scraper
for city in mumbai bangalore delhi pune; do
    ./scripts/scrape-city.sh $city
    echo "Waiting 60 seconds before next city..."
    sleep 60
done
```

### Import scraped data to backend

```bash
# Start the backend server
cd ../backend
mvn spring-boot:run

# Import CSV (in another terminal)
curl -X POST http://localhost:8083/api/admin/import/google-maps \
  -F "file=@../scraper/output/mumbai_20260910_120000.csv" \
  -F "city=Mumbai"
```

The import endpoint needs no auth. Place IDs are used for deduplication, so
re-importing the same CSV skips PGs that already exist.

Verify the import locally:

```bash
curl -s http://localhost:8083/api/pgs | python3 -c "import json,sys; print(len(json.load(sys.stdin)))"
```

Imported PGs land in `backend/data/` (local dev database, git-ignored) and
images are downloaded to `backend/data/images/`. They are **not live yet**.

### Publish new PGs to the live site

The Render deployment serves the git-tracked `data/` snapshot (database +
images), so local imports must be copied into it and pushed:

```bash
# From the repo root
cp backend/data/livio_db.mv.db data/livio_db.mv.db
rsync -a backend/data/images/ data/images/

git add data/
git commit -m "add scraped pgs"
git push
```

Render auto-deploys on push (~5-10 minutes), after which the site at
workers.dev lists the new PGs. Every deploy resets to the last committed
`data/` snapshot, so always commit after importing.


## CSV Output Format

The scraper outputs CSV with these columns:

| Column | Description |
|--------|-------------|
| title | PG/Hostel name |
| address | Full address |
| phone | Phone number |
| website | Website URL |
| totalScore | Google rating (0-5) |
| reviewsCount | Number of reviews |
| latitude | GPS latitude |
| longitude | GPS longitude |
| placeId | Google Place ID (used for deduplication) |
| imageUrl | Primary image URL |
| openingHours | Operating hours |
| categoryName | Business category |

## Rate Limiting

Without proxies, the scraper may get blocked after ~100-300 results. To avoid this:

- Run one city at a time
- Wait 5-10 minutes between cities
- Keep concurrency low (`-c 2`)
- Use browser pool size 1 (`-browser-pool-size 1`)

## Adding New Cities

1. Create a new file in `queries/` named `<city>.txt`
2. Add search queries (one per line):
   ```
   PG in <City>
   Paying Guest in <City>
   Boys Hostel in <City>
   Girls Hostel in <City>
   ```
3. Run: `./scripts/scrape-city.sh <city>`

## Troubleshooting

### Docker not found
Install Docker: https://docs.docker.com/get-docker/

### Scraper stops early
This is normal without proxies. The scraper will output what it can before being rate-limited.

### CSV file is empty
Check if the query file exists and has valid search terms.
