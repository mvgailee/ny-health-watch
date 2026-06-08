# NY Health Watch — Data Pipeline

These scripts fetch disease surveillance data from government sources and write
JSON files to `data/pipeline/`. On commit, Vercel rebuilds the site automatically.

## Pipeline files written

| File | Updated by | Frequency |
|------|-----------|-----------|
| `data/pipeline/county-threats.json` | `fetch_wastewater.py` + `compute_threats.py` | Daily/Weekly |
| `data/pipeline/disease-activity.json` | All three scripts | Daily/Weekly |
| `data/pipeline/annual-cases.json` | `fetch_annual.py` | Annual |
| `data/pipeline/metadata.json` | All three scripts | Per-run |

## Scripts

### fetch_wastewater.py
Pulls COVID-19 wastewater data from health.data.ny.gov Socrata API.
Dataset ID: `hdxs-icuh`. Maps sewersheds to counties and writes Tier A levels.

### fetch_weekly.py  
Downloads NYSDOH weekly respiratory and arboviral PDFs.
Uses Gemini API to extract flu/RSV/WNV/EEE activity levels.

### fetch_annual.py
Downloads the annual NYSDOH Communicable Disease Report PDF.
Uses Gemini to extract county × disease case table.
Computes Tier B statistical levels vs 5-year baseline.

## Setup

```bash
pip install requests google-generativeai tabula-py pandas
cp .env.example .env
# Fill in GEMINI_API_KEY and SOCRATA_APP_TOKEN
```

## GitHub Actions
See `.github/workflows/` for scheduled cron jobs.
