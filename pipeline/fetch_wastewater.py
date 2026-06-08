#!/usr/bin/env python3
"""
fetch_wastewater.py — NY Health Watch wastewater surveillance fetcher

Fetches COVID-19 (and optionally RSV, norovirus, flu) wastewater surveillance
data from the CDC National Wastewater Surveillance System (NWSS) API, stores
every observation in a local SQLite database, exports public CSV datasets,
and updates the site's live threat JSON files.

Why CDC NWSS instead of NYSDOH directly:
  The CDC NWSS aggregates all participating NYS plants under one schema.
  health.data.ny.gov requires a Socrata token for reliable access;
  the CDC dataset is openly queryable.

Data source:
  CDC NWSS: https://data.cdc.gov/resource/2ew6-ywp6.json
  Update frequency: 2-3x per week per plant

Usage:
    python3 pipeline/fetch_wastewater.py
    python3 pipeline/fetch_wastewater.py --lookback-days 90   # backfill
    python3 pipeline/fetch_wastewater.py --dry-run            # no writes
    python3 pipeline/fetch_wastewater.py --introspect         # print schema + exit

Setup:
    pip install requests
    export CDC_APP_TOKEN=your_token   # optional but strongly recommended
    # Free token: https://data.cdc.gov/profile/app_tokens
"""

import json
import os
import csv
import sqlite3
import argparse
import datetime
import sys
from pathlib import Path

try:
    import requests
except ImportError:
    print("ERROR: requests not installed. Run: pip install requests")
    sys.exit(1)

# ── Paths ─────────────────────────────────────────────────────────────────────

ROOT          = Path(__file__).resolve().parent.parent
DB_PATH       = ROOT / "data" / "db" / "nyhealthwatch.db"
PIPELINE_DIR  = ROOT / "data" / "pipeline"
DOWNLOADS_DIR = ROOT / "public" / "downloads"

ACTIVITY_FILE       = PIPELINE_DIR / "disease-activity.json"
COUNTY_THREATS_FILE = PIPELINE_DIR / "county-threats.json"
METADATA_FILE       = PIPELINE_DIR / "metadata.json"

# ── API ───────────────────────────────────────────────────────────────────────

# atcp-73re: "CDC Wastewater Viral Activity Level for SARS-CoV-2, Influenza A and RSV"
# Updated weekly — current as of 2026. Covers COVID, flu, RSV in a single dataset.
# Sparse NYS coverage (~2 counties actively reporting via WastewaterSCAN).
CDC_NWSS_URL = "https://data.cdc.gov/resource/atcp-73re.json"

# Alternative: NYSDOH's own wastewater dataset — may have better NYS county coverage.
# Run --introspect with this URL to compare schemas and coverage.
# NYSDOH_URL = "https://health.data.ny.gov/resource/hdxs-icuh.json"
CDC_APP_TOKEN         = os.environ.get("CDC_APP_TOKEN", "")
PAGE_SIZE             = 1000
DEFAULT_LOOKBACK_DAYS = 21  # 3 weeks on a normal run

# ── NWSS field mapping ────────────────────────────────────────────────────────
# atcp-73re schema (verified via --introspect 2026-06-08):
#   counties_served, date_included_in_wval, date_updated, pathogen_target,
#   population_served, site, site_wval, site_wval_category, source,
#   state_territory, week_end

NWSS_FIELDS = {
    "plant_id":        "site",               # e.g. "ID:2377"
    "plant_name":      "site",               # no separate name field — reuse site ID
    "jurisdiction":    "state_territory",    # "New York" — use for API filter
    "county_fips":     None,                 # not in this dataset — map from counties_served
    "county_name":     "counties_served",    # county name string — map to FIPS
    "date_start":      None,                 # not available
    "date_end":        "week_end",           # end of reporting week
    "pathogen":        "pathogen_target",    # "SARS-CoV-2", "Influenza A", "RSV"
    "concentration":   None,                 # not available
    "percentile":      "site_wval",          # WVAL score (0–10+ scale, not 0–100)
    "detect_prop":     None,                 # not available
    "trend_pct":       None,                 # not available
    "reporting_state": "state_territory",
    "first_sample":    "date_included_in_wval",
    "population":      "population_served",
    # New fields specific to atcp-73re:
    "wval_category":   "site_wval_category", # "Very Low"/"Low"/"Moderate"/"High"/"Very High"
}

PATHOGEN_SLUGS = {
    # atcp-73re naming:
    "SARS-CoV-2":          "covid-19",
    "Influenza A virus":   "influenza",   # atcp-73re uses full name
    "Influenza A":         "influenza",
    "RSV":                 "rsv",
    # Old 2ew6-ywp6 naming (kept for historical records in DB):
    "Influenza B":         "influenza",
    "RSV A":               "rsv",
    "RSV B":               "rsv",
    "Norovirus GI":        "norovirus",
    "Norovirus GII":       "norovirus",
}

# ── County FIPS lookup ────────────────────────────────────────────────────────

COUNTY_NAME_TO_FIPS = {
    "Albany": "36001",      "Allegany": "36003",    "Bronx": "36005",
    "Broome": "36007",      "Cattaraugus": "36009", "Cayuga": "36011",
    "Chautauqua": "36013",  "Chemung": "36015",     "Chenango": "36017",
    "Clinton": "36019",     "Columbia": "36021",    "Cortland": "36023",
    "Delaware": "36025",    "Dutchess": "36027",    "Erie": "36029",
    "Essex": "36031",       "Franklin": "36033",    "Fulton": "36035",
    "Genesee": "36037",     "Greene": "36039",      "Hamilton": "36041",
    "Herkimer": "36043",    "Jefferson": "36045",   "Kings": "36047",
    "Lewis": "36049",       "Livingston": "36051",  "Madison": "36053",
    "Monroe": "36055",      "Montgomery": "36057",  "Nassau": "36059",
    "New York": "36061",    "Niagara": "36063",     "Oneida": "36065",
    "Onondaga": "36067",    "Ontario": "36069",     "Orange": "36071",
    "Orleans": "36073",     "Oswego": "36075",      "Otsego": "36077",
    "Putnam": "36079",      "Queens": "36081",      "Rensselaer": "36083",
    "Richmond": "36085",    "Rockland": "36087",    "St. Lawrence": "36089",
    "Saratoga": "36091",    "Schenectady": "36093", "Schoharie": "36095",
    "Schuyler": "36097",    "Seneca": "36099",      "Steuben": "36101",
    "Suffolk": "36103",     "Sullivan": "36105",    "Tioga": "36107",
    "Tompkins": "36109",    "Ulster": "36111",      "Warren": "36113",
    "Washington": "36115",  "Wayne": "36117",       "Westchester": "36119",
    "Wyoming": "36121",     "Yates": "36123",
}

NYC_FIPS = ["36005", "36047", "36061", "36081", "36085"]

FIPS_TO_NAME = {v: k for k, v in COUNTY_NAME_TO_FIPS.items()}


def jurisdiction_to_fips(jurisdiction: str) -> list:
    if not jurisdiction:
        return []
    raw = jurisdiction.strip()
    if raw.lower() in {"new york city", "new york city, new york", "nyc"}:
        return NYC_FIPS
    fips_list = []
    parts = [p.strip() for p in raw.split(",")]
    for part in parts:
        name = part.replace(" County", "").replace(" county", "").strip()
        if name == "New York" and len(parts) == 1:
            fips = COUNTY_NAME_TO_FIPS.get("New York")
            if fips:
                fips_list.append(fips)
            continue
        fips = COUNTY_NAME_TO_FIPS.get(name)
        if fips:
            fips_list.append(fips)
        else:
            for county, f in COUNTY_NAME_TO_FIPS.items():
                if county.lower() in name.lower() or name.lower() in county.lower():
                    fips_list.append(f)
                    break
    return list(dict.fromkeys(fips_list))


# ── Level mapping ─────────────────────────────────────────────────────────────

def percentile_to_level(pct):
    """
    For atcp-73re: pct is site_wval (WVAL score, 0-10+ scale).
    For legacy 2ew6-ywp6 data in the DB: pct was a 0-100 percentile.
    Values <= 10 treated as WVAL; values > 10 as percentile.
    CDC WVAL: <=1.5 Very Low | 1.5-3 Low | 3-4.5 Moderate | 4.5-8 High | >8 Very High
    """
    if pct is None:
        return "low"
    if pct <= 10:
        if pct > 8:   return "high"
        if pct > 4.5: return "moderate"
        if pct > 3:   return "watch"
        return "low"
    else:
        # Legacy percentile scale
        if pct >= 90: return "high"
        if pct >= 75: return "moderate"
        if pct >= 50: return "watch"
        return "low"


def wval_category_to_level(category):
    """Maps CDC site_wval_category string directly to our 4-tier level."""
    return {
        "Very Low": "low", "Low": "low", "Minimal": "low",
        "Moderate": "watch", "High": "moderate", "Very High": "high",
    }.get(category or "", "low")


def detect_prop_to_level(dp):
    """Fallback for legacy 2ew6-ywp6 data — detect_prop_15d is a 0-100 percentage."""
    if dp is None:
        return "low"
    if dp >= 90: return "high"
    if dp >= 75: return "moderate"
    if dp >= 50: return "watch"
    return "low"


def trend_label(ptc):
    if ptc is None:
        return "stable"
    if ptc >= 15:
        return "rising"
    if ptc <= -15:
        return "declining"
    return "stable"


# ── Database ──────────────────────────────────────────────────────────────────

SCHEMA = """
CREATE TABLE IF NOT EXISTS wastewater_observations (
    id                INTEGER PRIMARY KEY AUTOINCREMENT,
    fetched_at        TEXT    NOT NULL,
    sample_date       TEXT    NOT NULL,
    plant_id          TEXT,
    plant_name        TEXT    NOT NULL,
    county_fips       TEXT,
    county_name       TEXT,
    pathogen_raw      TEXT,
    pathogen_slug     TEXT    NOT NULL,
    concentration     REAL,
    percentile        REAL,
    detect_prop_15d   REAL,
    ptc_15d           REAL,
    population_served INTEGER,
    our_level         TEXT    NOT NULL,
    our_trend         TEXT    NOT NULL,
    source_url        TEXT,
    source_record_id  TEXT,
    UNIQUE(plant_id, sample_date, pathogen_raw) ON CONFLICT IGNORE
);

CREATE TABLE IF NOT EXISTS disease_cases (
    id              INTEGER PRIMARY KEY AUTOINCREMENT,
    fetched_at      TEXT    NOT NULL,
    data_year       INTEGER NOT NULL,
    report_period   TEXT    NOT NULL,
    county_fips     TEXT    NOT NULL,
    county_name     TEXT,
    disease_slug    TEXT    NOT NULL,
    case_count      INTEGER,
    is_suppressed   INTEGER DEFAULT 0,
    is_estimated    INTEGER DEFAULT 0,
    data_source     TEXT    NOT NULL,
    source_url      TEXT,
    notes           TEXT,
    UNIQUE(data_year, report_period, county_fips, disease_slug) ON CONFLICT REPLACE
);

CREATE TABLE IF NOT EXISTS threat_level_history (
    id              INTEGER PRIMARY KEY AUTOINCREMENT,
    computed_at     TEXT    NOT NULL,
    disease_slug    TEXT    NOT NULL,
    county_fips     TEXT,
    level           TEXT    NOT NULL,
    trend           TEXT,
    note            TEXT,
    UNIQUE(computed_at, disease_slug, county_fips) ON CONFLICT REPLACE
);

CREATE TABLE IF NOT EXISTS pipeline_runs (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    run_at      TEXT    NOT NULL,
    script      TEXT    NOT NULL,
    status      TEXT    NOT NULL,
    records_new INTEGER DEFAULT 0,
    records_dup INTEGER DEFAULT 0,
    notes       TEXT
);

CREATE INDEX IF NOT EXISTS idx_ww_sample_date ON wastewater_observations(sample_date);
CREATE INDEX IF NOT EXISTS idx_ww_pathogen    ON wastewater_observations(pathogen_slug);
CREATE INDEX IF NOT EXISTS idx_ww_county      ON wastewater_observations(county_fips);
CREATE INDEX IF NOT EXISTS idx_cases_county   ON disease_cases(county_fips);
CREATE INDEX IF NOT EXISTS idx_cases_slug     ON disease_cases(disease_slug);
CREATE INDEX IF NOT EXISTS idx_cases_year     ON disease_cases(data_year);
"""


def get_db(path):
    path.parent.mkdir(parents=True, exist_ok=True)
    con = sqlite3.connect(str(path))
    con.row_factory = sqlite3.Row
    con.executescript(SCHEMA)
    con.commit()
    return con


# ── API fetching ──────────────────────────────────────────────────────────────

def fetch_nwss(lookback_days, app_token=""):
    cutoff = (datetime.date.today() - datetime.timedelta(days=lookback_days)).isoformat()
    headers = {"X-App-Token": app_token} if app_token else {}
    where_clause = f"state_territory='New York' AND week_end >= '{cutoff}'"
    all_records = []
    offset = 0
    print(f"  Fetching NWSS data since {cutoff}...")
    while True:
        params = {
            "$where": where_clause,
            "$limit": PAGE_SIZE,
            "$offset": offset,
            "$order": "week_end DESC",
        }
        if app_token:
            params["$$app_token"] = app_token
        resp = requests.get(CDC_NWSS_URL, params=params, headers=headers, timeout=30)
        resp.raise_for_status()
        batch = resp.json()
        if not batch:
            break
        all_records.extend(batch)
        print(f"  → {len(all_records)} records fetched...")
        if len(batch) < PAGE_SIZE:
            break
        offset += PAGE_SIZE
    print(f"  Total: {len(all_records)} records")
    return all_records


def introspect_schema(app_token=""):
    headers = {"X-App-Token": app_token} if app_token else {}
    print("Fetching one record to inspect schema...\n")

    # Try with NY filter first; if the dataset has different field names, fall back
    # to a plain limit=1 so we can at least see what columns exist
    for params in [
        {"$where": "state_territory='New York'", "$limit": 1, "$order": "week_end DESC"},
        {"$limit": 1},
    ]:
        if app_token:
            params["$$app_token"] = app_token
        resp = requests.get(CDC_NWSS_URL, params=params, headers=headers, timeout=30)
        if resp.status_code == 200:
            break
        print(f"  Query failed ({resp.status_code}), retrying without filters...")
    else:
        resp.raise_for_status()

    records = resp.json()
    if not records:
        print("No records returned.")
        return
    r = records[0]
    print(f"Fields available ({len(r)} total):\n")
    for k, v in sorted(r.items()):
        mapped = next((our for our, nwss in NWSS_FIELDS.items() if nwss == k), "—")
        print(f"  {k:42s} {repr(v)[:50]:52s} → {mapped}")
    print("\nUpdate NWSS_FIELDS in the script if any fields differ from expected.")


# ── Record processing ─────────────────────────────────────────────────────────

def process_record(raw, fetched_at):
    f = NWSS_FIELDS

    plant_id   = raw.get(f["plant_id"], "")
    plant_name = raw.get(f["plant_name"]) or plant_id or "unknown"
    # date_end maps to week_end in atcp-73re
    date_end   = raw.get(f["date_end"]) or raw.get("week_end", "")

    # pathogen_target in atcp-73re; default to SARS-CoV-2 if missing
    pathogen_raw  = raw.get(f["pathogen"]) or "SARS-CoV-2"
    pathogen_slug = PATHOGEN_SLUGS.get(pathogen_raw)
    if not pathogen_slug:
        return []   # skip unknown pathogens

    def safe_float(key):
        if not key:
            return None
        v = raw.get(key)
        try:
            return float(v) if v is not None else None
        except (ValueError, TypeError):
            return None

    # site_wval stored in percentile column; 999 = CDC sentinel for "no data"
    wval       = safe_float(f["percentile"])
    population = safe_float(f["population"])

    if wval is not None and wval >= 999:
        wval = None

    # Use pre-computed site_wval_category when available (more reliable than numeric threshold)
    wval_category = raw.get("site_wval_category", "")
    if wval_category:
        our_level = wval_category_to_level(wval_category)
    else:
        our_level = percentile_to_level(wval)

    our_trend = "stable"   # trend not available in atcp-73re

    # atcp-73re provides counties_served (name string), no county_fips field
    county_name_raw = raw.get(f["county_name"], "")
    fips_list = jurisdiction_to_fips(county_name_raw) if county_name_raw else []

    rows = []
    targets = fips_list if fips_list else [None]
    for fips in targets:
        county_name = FIPS_TO_NAME.get(fips, county_name_raw) if fips else county_name_raw or None
        rows.append({
            "fetched_at":        fetched_at,
            "sample_date":       date_end[:10] if date_end else "",
            "plant_id":          plant_id,
            "plant_name":        plant_name,
            "county_fips":       fips,
            "county_name":       county_name,
            "pathogen_raw":      pathogen_raw,
            "pathogen_slug":     pathogen_slug,
            "concentration":     None,
            "percentile":        wval,
            "detect_prop_15d":   None,
            "ptc_15d":           None,
            "population_served": int(population) if population else None,
            "our_level":         our_level,
            "our_trend":         our_trend,
            "source_url":        CDC_NWSS_URL,
            "source_record_id":  f"{plant_id}|{date_end}|{pathogen_raw}",
        })
    return rows


# ── County aggregation ────────────────────────────────────────────────────────

def _latest_db_date(con, pathogen_slug=None):
    """
    Returns the most recent sample_date in the DB, optionally filtered by pathogen.
    Falls back to today if DB is empty. Used so aggregations work even on stale datasets.
    """
    q = "SELECT MAX(sample_date) AS d FROM wastewater_observations WHERE county_fips IS NOT NULL"
    params = ()
    if pathogen_slug:
        q += " AND pathogen_slug = ?"
        params = (pathogen_slug,)
    row = con.execute(q, params).fetchone()
    latest = row["d"] if row and row["d"] else None
    return latest or datetime.date.today().isoformat()


def aggregate_to_county(con, as_of_date):
    # Anchor on the most recent date in the DB, not today — handles stale datasets.
    db_latest = _latest_db_date(con)
    ref_date  = min(as_of_date, db_latest)   # don't look beyond today
    cutoff    = (datetime.date.fromisoformat(ref_date) - datetime.timedelta(days=30)).isoformat()

    rows = con.execute("""
        SELECT
            county_fips, pathogen_slug,
            MAX(percentile)       AS max_percentile,
            AVG(detect_prop_15d)  AS avg_detect,
            AVG(ptc_15d)          AS avg_trend,
            MAX(sample_date)      AS latest_date,
            GROUP_CONCAT(DISTINCT plant_name) AS plants
        FROM wastewater_observations
        WHERE county_fips IS NOT NULL
          AND sample_date >= ? AND sample_date <= ?
        GROUP BY county_fips, pathogen_slug
    """, (cutoff, ref_date)).fetchall()

    result = {}
    for row in rows:
        fips = row["county_fips"]
        slug = row["pathogen_slug"]
        if fips not in result:
            result[fips] = {}
        pct   = row["max_percentile"]
        level = percentile_to_level(pct)
        trend = trend_label(row["avg_trend"])
        parts = []
        if pct is not None:
            parts.append(f"Wastewater signal at {pct:.0f}th percentile vs. plant's historical baseline.")
        if row["avg_trend"] is not None:
            direction = "rising" if row["avg_trend"] > 0 else "declining" if row["avg_trend"] < 0 else "stable"
            parts.append(f"Signal is {direction} ({row['avg_trend']:+.0f}% over 15 days).")
        if row["avg_detect"] is not None:
            parts.append(f"Detected in {row['avg_detect']*100:.0f}% of samples over the last 15 days.")
        result[fips][slug] = {
            "level": level, "trend": trend, "percentile": pct,
            "note": " ".join(parts) or "Wastewater monitoring active.",
            "date": row["latest_date"], "plants": row["plants"],
        }
    return result


def compute_statewide_signal(con, pathogen_slug, as_of_date):
    # Anchor on the most recent date in DB for this pathogen, not today.
    db_latest = _latest_db_date(con, pathogen_slug)
    ref_date  = min(as_of_date, db_latest)
    cutoff    = (datetime.date.fromisoformat(ref_date) - datetime.timedelta(days=30)).isoformat()

    # Warn if the data is more than 60 days old
    days_stale = (datetime.date.fromisoformat(as_of_date) - datetime.date.fromisoformat(ref_date)).days
    stale_note = f" (data as of {ref_date} — {days_stale} days old)" if days_stale > 60 else ""

    rows = con.execute("""
        SELECT
            county_fips,
            MAX(percentile)        AS max_pct,
            AVG(ptc_15d)           AS avg_trend,
            AVG(detect_prop_15d)   AS avg_detect,
            MAX(population_served) AS pop,
            MAX(sample_date)       AS latest_date
        FROM wastewater_observations
        WHERE pathogen_slug = ? AND county_fips IS NOT NULL
          AND sample_date >= ? AND sample_date <= ?
        GROUP BY county_fips
        HAVING MAX(sample_date) >= ?
    """, (pathogen_slug, cutoff, ref_date, cutoff)).fetchall()

    if not rows:
        return {"level": "low", "trend": "stable", "note": "No recent wastewater data.", "n_counties": 0}

    total_w = 0.0
    w_sum   = 0.0
    trends  = []
    n_elev  = 0
    latest  = ""

    for row in rows:
        pct = row["max_pct"]
        if pct is None:
            continue
        w = row["pop"] or 100_000
        w_sum   += pct * w
        total_w += w
        if row["avg_trend"] is not None:
            trends.append(row["avg_trend"])
        if pct >= 50:
            n_elev += 1
        if row["latest_date"] and row["latest_date"] > latest:
            latest = row["latest_date"]

    if total_w == 0:
        return {"level": "low", "trend": "stable", "note": "No percentile data available.", "n_counties": len(rows)}

    wpct   = w_sum / total_w
    level  = percentile_to_level(wpct)
    trend  = trend_label(sum(trends) / len(trends) if trends else 0)

    note = (
        f"Statewide wastewater signal at {wpct:.0f}th percentile (population-weighted). "
        f"{n_elev} of {len(rows)} monitored counties reporting above median. "
        + ("Signal is rising across monitored plants." if trend == "rising"
           else "Signal is declining." if trend == "declining" else "")
        + stale_note
    )
    return {
        "level": level, "trend": trend, "percentile": round(wpct, 1),
        "note": note.strip(), "n_counties": len(rows), "latest_date": latest,
    }


# ── CSV export ────────────────────────────────────────────────────────────────

def export_csvs(con, downloads_dir, dry_run=False):
    downloads_dir.mkdir(parents=True, exist_ok=True)

    # Latest observation per county per pathogen
    latest_rows = con.execute("""
        SELECT w.county_fips, w.county_name, w.pathogen_slug, w.pathogen_raw,
               w.sample_date, w.percentile, w.detect_prop_15d,
               w.ptc_15d AS trend_pct_15d, w.our_level, w.our_trend,
               w.plant_name, w.population_served, w.fetched_at
        FROM wastewater_observations w
        INNER JOIN (
            SELECT county_fips, pathogen_slug, MAX(sample_date) AS max_date
            FROM wastewater_observations WHERE county_fips IS NOT NULL
            GROUP BY county_fips, pathogen_slug
        ) l ON w.county_fips = l.county_fips
           AND w.pathogen_slug = l.pathogen_slug
           AND w.sample_date = l.max_date
        WHERE w.county_fips IS NOT NULL
        ORDER BY w.county_fips, w.pathogen_slug
    """).fetchall()

    history_rows = con.execute("""
        SELECT county_fips, county_name, pathogen_slug, pathogen_raw,
               sample_date, percentile, detect_prop_15d,
               ptc_15d AS trend_pct_15d, concentration,
               our_level, our_trend, plant_id, plant_name,
               population_served, fetched_at
        FROM wastewater_observations
        WHERE county_fips IS NOT NULL
        ORDER BY sample_date DESC, county_fips, pathogen_slug
    """).fetchall()

    case_rows = con.execute("""
        SELECT data_year, report_period, county_fips, county_name,
               disease_slug, case_count, is_suppressed,
               data_source, notes, fetched_at
        FROM disease_cases
        ORDER BY data_year DESC, county_fips, disease_slug
    """).fetchall()

    if dry_run:
        print(f"  [dry] {len(latest_rows)} latest wastewater rows, "
              f"{len(history_rows)} history rows, {len(case_rows)} case rows")
        return

    def write_csv(filename, rows):
        if not rows:
            print(f"  — {filename}: no rows")
            return
        out = downloads_dir / filename
        with open(out, "w", newline="") as f:
            w = csv.DictWriter(f, fieldnames=rows[0].keys())
            w.writeheader()
            w.writerows([dict(r) for r in rows])
        print(f"  ✓ {filename}  ({len(rows)} rows)")

    write_csv("wastewater_by_county_latest.csv", latest_rows)
    write_csv("wastewater_history.csv", history_rows)
    write_csv("disease_cases_annual.csv", case_rows)
    _write_data_dictionary(downloads_dir)


def _write_data_dictionary(downloads_dir):
    readme = """# NY Health Watch — Public Dataset

Data collected and cleaned by [nyhealthwatch.org](https://nyhealthwatch.org).
Updated automatically from government sources.

## Files

### wastewater_by_county_latest.csv
Most recent wastewater surveillance reading per county per pathogen.

| Field | Description |
|-------|-------------|
| county_fips | 5-digit FIPS code (36001 = Albany County) |
| county_name | County name |
| pathogen_slug | Disease key: covid-19, influenza, rsv, norovirus |
| pathogen_raw | Original CDC NWSS pathogen string |
| sample_date | End date of the sampling period |
| percentile | 0–100; signal vs. this plant's own historical distribution |
| detect_prop_15d | Fraction of samples positive over last 15 days (0–1) |
| trend_pct_15d | Signal % change over 15 days (+= rising) |
| our_level | Derived: low / watch / moderate / high |
| our_trend | Derived: rising / stable / declining |
| plant_name | Wastewater treatment plant name |
| population_served | Approximate population served |
| fetched_at | ISO timestamp when we retrieved this record |

### wastewater_history.csv
Full wastewater time series — same fields plus `concentration` (copies/mL)
and `plant_id` (CDC NWSS identifier).

### disease_cases_annual.csv
Annual communicable disease case counts by county, from NYSDOH annual reports.

| Field | Description |
|-------|-------------|
| data_year | Report year |
| report_period | e.g. "annual-2024" |
| county_fips | 5-digit FIPS code |
| county_name | County name |
| disease_slug | Disease identifier |
| case_count | Confirmed cases (null = suppressed for privacy) |
| is_suppressed | 1 if NYSDOH withheld count (typically < 5 cases) |
| data_source | annual-report-pdf / weekly-respiratory-pdf / etc. |

## Sources
- Wastewater: CDC NWSS (data.cdc.gov), updated 2–3x/week
- Annual cases: NYSDOH Communicable Disease Annual Reports (health.ny.gov)
- Weekly data: NYSDOH weekly surveillance PDFs

## License
Source data from US government agencies is public domain.
Processing code is MIT licensed.
"""
    out = downloads_dir / "README.md"
    with open(out, "w") as f:
        f.write(readme)
    print(f"  ✓ README.md")


# ── JSON update ───────────────────────────────────────────────────────────────

def update_activity_json(statewide_signals, dry_run):
    with open(ACTIVITY_FILE) as f:
        activity = json.load(f)

    today = datetime.date.today().isoformat()
    WASTEWATER_SLUGS = ["covid-19", "influenza", "rsv", "norovirus"]

    for slug in WASTEWATER_SLUGS:
        sw = statewide_signals.get(slug, {})
        if not sw or sw.get("n_counties", 0) == 0:
            continue
        activity[slug] = {
            "level":                  sw["level"],
            "trend":                  sw["trend"],
            "note":                   sw["note"],
            "dataSourceLabel":        f"CDC NWSS wastewater surveillance, updated {today}",
            "wastewaterPercentile":   sw.get("percentile"),
            "wastewaterCounties":     sw.get("n_counties"),
            "lastUpdated":            today,
        }
        if not dry_run:
            print(f"  ✓ {slug}: {sw['level']} ({sw['trend']})")
        else:
            print(f"  [dry] {slug}: {sw['level']} — {sw.get('note','')[:70]}")

    if not dry_run:
        with open(ACTIVITY_FILE, "w") as f:
            json.dump(activity, f, indent=2)


def update_metadata(records_new):
    with open(METADATA_FILE) as f:
        meta = json.load(f)
    now = datetime.datetime.now(datetime.timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ")
    meta["lastUpdated"]  = now
    today = datetime.date.today()
    meta["sitewideNote"] = f"Data updated {today.strftime('%B')} {today.day}, {today.year}"
    meta.setdefault("sources", {})["wastewater"] = {
        "lastFetched": now,
        "recordsAdded": records_new,
        "updateFrequency": "daily",
    }
    with open(METADATA_FILE, "w") as f:
        json.dump(meta, f, indent=2)


# ── Main ──────────────────────────────────────────────────────────────────────

def main():
    parser = argparse.ArgumentParser(description="Fetch and store wastewater surveillance data")
    parser.add_argument("--lookback-days", type=int, default=DEFAULT_LOOKBACK_DAYS)
    parser.add_argument("--dry-run",    action="store_true", help="Fetch but don't write files")
    parser.add_argument("--introspect", action="store_true", help="Print API schema and exit")
    parser.add_argument("--skip-export", action="store_true", help="Skip CSV export")
    args = parser.parse_args()

    app_token = CDC_APP_TOKEN

    if args.introspect:
        introspect_schema(app_token)
        return

    print(f"\n=== fetch_wastewater.py  |  lookback={args.lookback_days}d  |  dry_run={args.dry_run} ===\n")

    con = get_db(DB_PATH)
    print(f"Database: {DB_PATH}\n")

    # One-time cleanup: CDC uses 999 as a sentinel meaning "insufficient data".
    # Any rows stored before this fix was applied will have percentile=999 — null them out.
    sentinel_count = con.execute(
        "SELECT COUNT(*) FROM wastewater_observations WHERE percentile >= 999"
    ).fetchone()[0]
    if sentinel_count:
        con.execute("UPDATE wastewater_observations SET percentile = NULL WHERE percentile >= 999")
        con.commit()
        print(f"  Fixed {sentinel_count} sentinel percentile values (999 → NULL)\n")

    run_at = datetime.datetime.now(datetime.timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ")

    # Fetch
    try:
        raw_records = fetch_nwss(args.lookback_days, app_token)
    except Exception as e:
        print(f"\nFATAL: Could not fetch NWSS data: {e}")
        if hasattr(e, "response") and e.response.status_code == 403:
            print("  → 403 Forbidden. Try setting CDC_APP_TOKEN.")
        con.execute(
            "INSERT INTO pipeline_runs(run_at,script,status,notes) VALUES(?,?,?,?)",
            (run_at, "fetch_wastewater.py", "error", str(e))
        )
        con.commit()
        sys.exit(1)

    # Process
    print("\nProcessing records...")
    processed, unmapped, skipped = [], set(), 0
    for raw in raw_records:
        rows = process_record(raw, run_at)
        for row in rows:
            if row["county_fips"] is None:
                unmapped.add(raw.get(NWSS_FIELDS["plant_name"], "?"))
        processed.extend(rows)
        if not rows:
            skipped += 1

    print(f"  Processed: {len(processed)} rows  |  Skipped (unknown pathogen): {skipped}")
    if unmapped:
        sample = ", ".join(sorted(unmapped)[:4])
        more   = f" +{len(unmapped)-4} more" if len(unmapped) > 4 else ""
        print(f"  Unmapped plants: {sample}{more}")
        print("  → To fix: update jurisdiction_to_fips() or NWSS_FIELDS in the script")

    # Insert
    records_new, records_dup = 0, 0
    if not args.dry_run:
        for row in processed:
            cur = con.execute("""
                INSERT OR IGNORE INTO wastewater_observations
                (fetched_at,sample_date,plant_id,plant_name,county_fips,county_name,
                 pathogen_raw,pathogen_slug,concentration,percentile,detect_prop_15d,
                 ptc_15d,population_served,our_level,our_trend,source_url,source_record_id)
                VALUES
                (:fetched_at,:sample_date,:plant_id,:plant_name,:county_fips,:county_name,
                 :pathogen_raw,:pathogen_slug,:concentration,:percentile,:detect_prop_15d,
                 :ptc_15d,:population_served,:our_level,:our_trend,:source_url,:source_record_id)
            """, row)
            if cur.rowcount:
                records_new += 1
            else:
                records_dup += 1
        con.commit()
        print(f"  New DB rows: {records_new}  |  Duplicates skipped: {records_dup}")

    # Aggregate
    today = datetime.date.today().isoformat()
    print("\nComputing statewide signals...")
    statewide_signals = {}
    for slug in ["covid-19", "influenza", "rsv", "norovirus"]:
        sig = compute_statewide_signal(con, slug, today)
        statewide_signals[slug] = sig
        if sig.get("n_counties", 0) > 0:
            print(f"  {slug:20s} level={sig['level']:8s} trend={sig['trend']:9s} "
                  f"pct={sig.get('percentile','?')} counties={sig['n_counties']}")
        else:
            print(f"  {slug:20s} no data in DB yet")

    # Update JSON
    print("\nUpdating JSON files...")
    update_activity_json(statewide_signals, args.dry_run)
    if not args.dry_run:
        update_metadata(records_new)

    # Export CSVs
    if not args.skip_export:
        print("\nExporting public datasets...")
        export_csvs(con, DOWNLOADS_DIR, args.dry_run)

    # Log
    if not args.dry_run:
        con.execute(
            "INSERT INTO pipeline_runs(run_at,script,status,records_new,records_dup) VALUES(?,?,?,?,?)",
            (run_at, "fetch_wastewater.py", "success", records_new, records_dup)
        )
        con.commit()

    con.close()
    print(f"\n=== Done. {records_new} new observations added. ===\n")


if __name__ == "__main__":
    main()
