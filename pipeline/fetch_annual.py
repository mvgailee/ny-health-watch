#!/usr/bin/env python3
"""
fetch_annual.py — NYSDOH Annual Communicable Disease Report extractor

Downloads annual report PDFs from NYSDOH (2005–present), uses Gemini to extract
the county x disease case tables, stores multi-year data in the SQLite database,
recomputes real 5-year baselines, and exports the public CSV dataset.

This replaces the estimated values in baselines.json with genuine historical data,
improving the accuracy of all Tier B disease threat computations.

Usage:
    python3 pipeline/fetch_annual.py --year 2023
    python3 pipeline/fetch_annual.py --years 2019-2023
    python3 pipeline/fetch_annual.py --all                    # 2005-2023
    python3 pipeline/fetch_annual.py --all --dry-run          # preview, no DB writes
    python3 pipeline/fetch_annual.py --recompute-baselines    # recompute without re-fetching

Setup:
    pip install google-generativeai requests
    export GEMINI_API_KEY=your_key

Free Gemini API key: https://aistudio.google.com/app/apikey
Free tier: 15 req/min, 1500/day — enough for the full 19-year backfill in one session.
"""

import os
import sys
import json
import time
import sqlite3
import argparse
import datetime
import re
import csv
from pathlib import Path

try:
    import requests
except ImportError:
    print("ERROR: pip install requests"); sys.exit(1)

try:
    from google import genai
    from google.genai import types as genai_types
except ImportError:
    print("ERROR: pip install google-genai"); sys.exit(1)

# ── Paths ─────────────────────────────────────────────────────────────────────

ROOT          = Path(__file__).resolve().parent.parent
DB_PATH       = ROOT / "data" / "db" / "nyhealthwatch.db"
PDF_CACHE     = ROOT / "data" / "db" / "pdf_cache"
GEMINI_CACHE  = ROOT / "data" / "db" / "gemini_cache"
PIPELINE_DIR  = ROOT / "data" / "pipeline"
DOWNLOADS_DIR = ROOT / "public" / "downloads"

BASELINES_FILE = PIPELINE_DIR / "baselines.json"
METADATA_FILE  = PIPELINE_DIR / "metadata.json"

# ── Available years ───────────────────────────────────────────────────────────

# NYSDOH annual reports go back to 2005. 2024 is already in DB (manually seeded).
AVAILABLE_YEARS = list(range(2005, 2024))   # 2005 through 2023 inclusive

PDF_URL_PATTERN = (
    "https://www.health.ny.gov/statistics/diseases/communicable/{year}/docs/cases.pdf"
)

# ── Disease name normalization ────────────────────────────────────────────────
# Maps PDF column headers (exact, from various years) to our disease slugs.
# NYSDOH has renamed diseases over time — this dict is the authoritative crosswalk.

RAW_NAME_TO_SLUG = {
    # ── Current names (2018–present) ──
    "ACUTE FLACCID MYELITIS":                       "acute-flaccid-myelitis",
    "AMEBIASIS":                                    "amebiasis",
    "ANAPLASMOSIS":                                 "anaplasmosis",
    "BABESIOSIS":                                   "babesiosis",
    "BLASTOMYCOSIS":                                "blastomycosis",
    "BOTULISM":                                     "botulism",
    "BOTULISM (INFANT)":                            "botulism",
    "BOTULISM (FOODBORNE)":                         "botulism",
    "INFANT BOTULISM":                              "botulism",
    "BRUCELLOSIS":                                  "brucellosis",
    "CAMPYLOBACTERIOSIS":                           "campylobacteriosis",
    "CAMPYLOBACTER":                                "campylobacteriosis",
    "CANDIDA AURIS":                                "candida-auris",
    "CANDIDA AURIS (C. AURIS)":                     "candida-auris",
    "CHIKUNGUNYA":                                  "chikungunya",
    "CHIKUNGUNYA FEVER":                            "chikungunya",
    "CHLAMYDIA":                                    "chlamydia",
    "CHLAMYDIA TRACHOMATIS":                        "chlamydia",
    "CRYPTOSPORIDIOSIS":                            "cryptosporidiosis",
    "CRYPTOSPORIDIUM":                              "cryptosporidiosis",
    "CYCLOSPORIASIS":                               "cyclosporiasis",
    "CYCLOSPORA":                                   "cyclosporiasis",
    "DENGUE":                                       "dengue-fever",
    "DENGUE FEVER":                                 "dengue-fever",
    "DIPHTHERIA":                                   "diphtheria",
    "E. COLI (SHIGA TOXIN-PRODUCING)":              "e-coli-stec",
    "E. COLI SHIGA TOXIN":                          "e-coli-stec",
    "E. COLI STEC":                                 "e-coli-stec",
    "STEC":                                         "e-coli-stec",
    "EHRLICHIOSIS":                                 "ehrlichiosis",
    "HME":                                          "ehrlichiosis",
    "HUMAN MONOCYTIC EHRLICHIOSIS":                 "ehrlichiosis",
    "GIARDIASIS":                                   "giardiasis",
    "GIARDIA":                                      "giardiasis",
    "GONORRHEA":                                    "gonorrhea",
    "GONORRHEA (GONOCOCCAL INFECTION)":             "gonorrhea",
    "GONOCOCCAL INFECTION":                         "gonorrhea",
    "HAEMOPHILUS INFLUENZAE (INVASIVE)":            "haemophilus-influenzae",
    "HAEMOPHILUS INFLUENZAE":                       "haemophilus-influenzae",
    "H. INFLUENZAE (INVASIVE)":                     "haemophilus-influenzae",
    "HEMOLYTIC UREMIC SYNDROME":                    "hemolytic-uremic-syndrome",
    "HUS":                                          "hemolytic-uremic-syndrome",
    "HEPATITIS A":                                  "hepatitis-a",
    "HEPATITIS B (ACUTE)":                          "hepatitis-b-acute",
    "HEPATITIS B ACUTE":                            "hepatitis-b-acute",
    "HEPATITIS B (CHRONIC)":                        "hepatitis-b-chronic",
    "HEPATITIS B CHRONIC":                          "hepatitis-b-chronic",
    "HEPATITIS C (ACUTE)":                          "hepatitis-c-acute",
    "HEPATITIS C ACUTE":                            "hepatitis-c-acute",
    "HEPATITIS C (CHRONIC)":                        "hepatitis-c-chronic",
    "HEPATITIS C CHRONIC":                          "hepatitis-c-chronic",
    "HERPES (INFANT <60 DAYS)":                     "neonatal-herpes",
    "NEONATAL HERPES":                              "neonatal-herpes",
    "HERPES SIMPLEX (NEONATAL)":                    "neonatal-herpes",
    "HERPES SIMPLEX VIRUS (NEONATAL)":              "neonatal-herpes",
    "INFLUENZA":                                    "influenza",
    "LABORATORY CONFIRMED INFLUENZA":               "influenza",
    "LAB-CONFIRMED INFLUENZA":                      "influenza",
    "LEGIONELLOSIS":                                "legionellosis",
    "LEGIONELLA":                                   "legionellosis",
    "LISTERIOSIS":                                  "listeriosis",
    "LISTERIA":                                     "listeriosis",
    "LYME DISEASE":                                 "lyme-disease",
    "LYME":                                         "lyme-disease",
    "MALARIA":                                      "malaria",
    "MEASLES":                                      "measles",
    "MENINGITIS (ASEPTIC)":                         "meningitis-aseptic",
    "ASEPTIC MENINGITIS":                           "meningitis-aseptic",
    "MENINGITIS (BACTERIAL)":                       "meningitis-bacterial",
    "MENINGITIS (OTHER/BACTERIAL)":                 "meningitis-bacterial",
    "BACTERIAL MENINGITIS":                         "meningitis-bacterial",
    "MENINGITIS, BACTERIAL":                        "meningitis-bacterial",
    "MENINGOCOCCAL DISEASE":                        "meningococcal",
    "MENINGOCOCCAL":                                "meningococcal",
    "NEISSERIA MENINGITIDIS (INVASIVE)":            "meningococcal",
    "MPOX":                                         "mpox",
    "MONKEYPOX":                                    "mpox",
    "MUMPS":                                        "mumps",
    "PERTUSSIS":                                    "pertussis",
    "WHOOPING COUGH":                               "pertussis",
    "Q FEVER":                                      "q-fever",
    "RSV":                                          "rsv",
    "RESPIRATORY SYNCYTIAL VIRUS":                  "rsv",
    "ROCKY MOUNTAIN SPOTTED FEVER":                 "rocky-mountain-spotted-fever",
    "RMSF":                                         "rocky-mountain-spotted-fever",
    "ROCKY MTN SPOTTED FEVER":                      "rocky-mountain-spotted-fever",
    "SALMONELLOSIS":                                "salmonellosis",
    "SALMONELLA":                                   "salmonellosis",
    "SHIGELLOSIS":                                  "shigellosis",
    "SHIGELLA":                                     "shigellosis",
    "STREP GROUP A (INVASIVE)":                     "strep-a-invasive",
    "GROUP A STREP (INVASIVE)":                     "strep-a-invasive",
    "STREPTOCOCCUS GROUP A (INVASIVE)":             "strep-a-invasive",
    "INVASIVE GROUP A STREP":                       "strep-a-invasive",
    "STREP GROUP B (INVASIVE)":                     "strep-b-invasive",
    "GROUP B STREP (INVASIVE)":                     "strep-b-invasive",
    "STREPTOCOCCUS GROUP B (INVASIVE)":             "strep-b-invasive",
    "INVASIVE GROUP B STREP":                       "strep-b-invasive",
    "STREPTOCOCCUS PNEUMONIAE (INVASIVE)":          "strep-pneumo-invasive",
    "STREP PNEUMO (INVASIVE)":                      "strep-pneumo-invasive",
    "STREP. PNEUMONIAE (INVASIVE)":                 "strep-pneumo-invasive",
    "INVASIVE PNEUMOCOCCAL DISEASE":                "strep-pneumo-invasive",
    "SYPHILIS (EARLY)":                             "syphilis-early",
    "EARLY SYPHILIS":                               "syphilis-early",
    "SYPHILIS EARLY":                               "syphilis-early",
    "SYPHILIS (LATE)":                              "syphilis-late",
    "LATE SYPHILIS":                                "syphilis-late",
    "SYPHILIS LATE":                                "syphilis-late",
    "SYPHILIS (LATE AND LATENT)":                   "syphilis-late",
    "SYPHILIS, LATE":                               "syphilis-late",
    "TETANUS":                                      "tetanus",
    "TOXIC SHOCK SYNDROME":                         "toxic-shock-syndrome",
    "TSS":                                          "toxic-shock-syndrome",
    "TUBERCULOSIS":                                 "tuberculosis",
    "TB":                                           "tuberculosis",
    "TULAREMIA":                                    "tularemia",
    "TYPHOID FEVER":                                "typhoid-fever",
    "TYPHOID":                                      "typhoid-fever",
    "VARICELLA":                                    "varicella",
    "CHICKENPOX":                                   "varicella",
    "VIBRIOSIS":                                    "vibriosis",
    "VIBRIO":                                       "vibriosis",
    "VISA":                                         "visa-staph",
    "VRSA":                                         "visa-staph",
    "VISA/VRSA":                                    "visa-staph",
    "WEST NILE FEVER":                              "west-nile-fever",
    "WEST NILE VIRUS (NEUROINVASIVE)":              "west-nile-virus",
    "WEST NILE VIRUS":                              "west-nile-virus",
    "WNV":                                          "west-nile-virus",
    "WNV (NEUROINVASIVE)":                          "west-nile-virus",
    "YERSINIA":                                     "yersiniosis",
    "YERSINIOSIS":                                  "yersiniosis",
    # ── Historical names (pre-2010) ──
    "E. COLI O157:H7":                              "e-coli-stec",
    "E.COLI O157:H7":                               "e-coli-stec",
    "ESCHERICHIA COLI O157:H7":                     "e-coli-stec",
    "HGE":                                          "anaplasmosis",
    "ANAPLASMOSIS (HGE)":                           "anaplasmosis",
    "HUMAN GRANULOCYTIC EHRLICHIOSIS":              "anaplasmosis",
    "HUMAN GRANULOCYTIC ANAPLASMOSIS":              "anaplasmosis",
    "ANAPLASMA PHAGOCYTOPHILUM":                    "anaplasmosis",
    "HEPATITIS B":                                  "hepatitis-b-acute",   # pre-split era
    "HEPATITIS C":                                  "hepatitis-c-acute",   # pre-split era
    "RUBELLA":                                      "rubella",             # tracked but not in our registry
    "CONGENITAL RUBELLA":                           "rubella",
    "PLAGUE":                                       None,                  # skip
    "SMALLPOX":                                     None,
    "ANTHRAX":                                      None,
    "POLIOMYELITIS":                                None,
    "HANTAVIRUS":                                   None,
    "SARS":                                         None,
}

# County name → FIPS
COUNTY_FIPS = {
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

NYC_ROW_NAMES = {
    "NYC*", "NYC", "New York City*", "New York City",
    "NYC TOTAL", "NEW YORK CITY*", "NEW YORK CITY",
}
NYC_FIPS = ["36005", "36047", "36061", "36081", "36085"]
NYC_FIPS_NAMES = {
    "36005": "Bronx", "36047": "Kings", "36061": "New York",
    "36081": "Queens", "36085": "Richmond",
}

# ── Gemini ────────────────────────────────────────────────────────────────────

GEMINI_API_KEY = os.environ.get("GEMINI_API_KEY", "")
GEMINI_MODEL   = "gemini-2.5-flash"

EXTRACTION_PROMPT = """
You are extracting data from a New York State Department of Health Annual Communicable Disease Report.

The report contains a main table showing the number of confirmed communicable disease cases
reported by county and by disease for a single calendar year.

Extract ALL county x disease case counts from this table.

Return ONLY valid JSON — no markdown, no explanation, just the JSON object:
{
  "report_year": <year as integer>,
  "disease_columns": ["EXACT COLUMN NAME 1", "EXACT COLUMN NAME 2", ...],
  "data": {
    "Albany": {"EXACT COLUMN NAME 1": 123, "EXACT COLUMN NAME 2": null},
    "Allegany": { ... },
    ... all 57 upstate counties ...
    "NYC*": { ... }
  },
  "notes": "any notable format differences, footnotes, or issues"
}

Rules:
1. Use EXACT column names from the PDF header row — do not normalize them
2. Use null for suppressed values (shown as *, blank, NR, or dash)
3. Use 0 for explicitly shown zero counts
4. Include ALL 57 upstate counties plus one NYC combined row
5. The NYC row may be labeled "NYC*", "New York City*", etc. — use the exact label shown
6. Do NOT include state total rows (NYS Total, New York State, etc.)
7. If the table spans multiple pages, combine them
8. Include only the main case-count table — not rates, not age breakdowns
"""

# ── Database ──────────────────────────────────────────────────────────────────

def get_db():
    DB_PATH.parent.mkdir(parents=True, exist_ok=True)
    con = sqlite3.connect(str(DB_PATH))
    con.row_factory = sqlite3.Row
    con.executescript("""
        CREATE TABLE IF NOT EXISTS disease_cases (
            id            INTEGER PRIMARY KEY AUTOINCREMENT,
            fetched_at    TEXT    NOT NULL,
            data_year     INTEGER NOT NULL,
            report_period TEXT    NOT NULL,
            county_fips   TEXT    NOT NULL,
            county_name   TEXT,
            disease_slug  TEXT    NOT NULL,
            case_count    INTEGER,
            is_suppressed INTEGER DEFAULT 0,
            is_estimated  INTEGER DEFAULT 0,
            data_source   TEXT    NOT NULL,
            source_url    TEXT,
            notes         TEXT,
            UNIQUE(data_year, report_period, county_fips, disease_slug) ON CONFLICT REPLACE
        );
        CREATE INDEX IF NOT EXISTS idx_cases_county ON disease_cases(county_fips);
        CREATE INDEX IF NOT EXISTS idx_cases_slug   ON disease_cases(disease_slug);
        CREATE INDEX IF NOT EXISTS idx_cases_year   ON disease_cases(data_year);
    """)
    con.commit()
    return con


def year_in_db(con, year):
    return con.execute(
        "SELECT COUNT(*) FROM disease_cases WHERE data_year=?", (year,)
    ).fetchone()[0] > 0


# ── PDF ───────────────────────────────────────────────────────────────────────

def download_pdf(year):
    PDF_CACHE.mkdir(parents=True, exist_ok=True)
    dest = PDF_CACHE / f"{year}_cases.pdf"

    if dest.exists() and dest.stat().st_size > 10_000:
        print(f"    PDF cached locally")
        return dest

    url = PDF_URL_PATTERN.format(year=year)
    print(f"    Downloading {url}")
    try:
        r = requests.get(url, headers={
            "User-Agent": "Mozilla/5.0 (compatible; NYHealthWatch/1.0)",
            "Referer":    "https://www.health.ny.gov/statistics/diseases/communicable/",
        }, timeout=60, stream=True)
        r.raise_for_status()
        with open(dest, "wb") as f:
            for chunk in r.iter_content(8192):
                f.write(chunk)
        print(f"    Downloaded: {dest.stat().st_size // 1024} KB")
        return dest
    except requests.HTTPError as e:
        print(f"    HTTP {e.response.status_code} — {url}")
    except Exception as e:
        print(f"    Error: {e}")
    return None


# ── Gemini extraction ─────────────────────────────────────────────────────────

def extract_with_gemini(pdf_path, year, delay):
    GEMINI_CACHE.mkdir(parents=True, exist_ok=True)
    cache = GEMINI_CACHE / f"{year}_cases.json"

    if cache.exists():
        print(f"    Gemini response cached")
        return json.loads(cache.read_text())

    if not GEMINI_API_KEY:
        print("    ERROR: GEMINI_API_KEY not set.")
        print("    Get a free key at https://aistudio.google.com/app/apikey")
        print("    Then: set GEMINI_API_KEY=your_key   (Windows)")
        print("    Or:   export GEMINI_API_KEY=your_key (Mac/Linux)")
        return None

    client = genai.Client(api_key=GEMINI_API_KEY)

    print(f"    Uploading PDF to Gemini...")
    pdf_file = None
    try:
        with open(pdf_path, "rb") as f:
            pdf_file = client.files.upload(
                file=f,
                config=genai_types.UploadFileConfig(
                    mime_type="application/pdf",
                    display_name=f"{year}_cases",
                )
            )
    except Exception as e:
        print(f"    Upload error: {e}")
        return None

    # Wait for Gemini to finish processing the file
    for _ in range(30):
        state = getattr(pdf_file.state, "name", str(pdf_file.state))
        if state != "PROCESSING":
            break
        time.sleep(2)
        pdf_file = client.files.get(name=pdf_file.name)

    state = getattr(pdf_file.state, "name", str(pdf_file.state))
    if state == "FAILED":
        print("    ERROR: PDF processing failed in Gemini")
        return None

    print(f"    Extracting table data...")
    resp = None
    for attempt in range(5):
        try:
            resp = client.models.generate_content(
                model=GEMINI_MODEL,
                contents=[
                    genai_types.Part.from_uri(
                        file_uri=pdf_file.uri,
                        mime_type="application/pdf",
                    ),
                    EXTRACTION_PROMPT,
                ],
                config=genai_types.GenerateContentConfig(
                    temperature=0.0,
                    max_output_tokens=32000,
                ),
            )
            break  # success
        except Exception as e:
            msg = str(e)
            if "503" in msg or "UNAVAILABLE" in msg:
                wait = 15 * (attempt + 1)
                print(f"    503 overload (attempt {attempt+1}/5) — retrying in {wait}s...")
                time.sleep(wait)
            else:
                print(f"    Gemini API error: {e}")
                try:
                    client.files.delete(name=pdf_file.name)
                except Exception:
                    pass
                return None

    if resp is None:
        print(f"    All retry attempts failed (503 persistent)")
        try:
            client.files.delete(name=pdf_file.name)
        except Exception:
            pass
        return None

    # Clean up the uploaded file from Gemini
    try:
        client.files.delete(name=pdf_file.name)
    except Exception:
        pass

    raw = resp.text.strip()
    raw = re.sub(r'^```(?:json)?\s*', '', raw)
    raw = re.sub(r'\s*```$', '', raw)
    raw = raw.strip()

    try:
        data = json.loads(raw)
    except json.JSONDecodeError as e:
        print(f"    Invalid JSON from Gemini: {e}")
        (GEMINI_CACHE / f"{year}_raw_error.txt").write_text(raw)
        print(f"    Raw saved to gemini_cache/{year}_raw_error.txt for debugging")
        return None

    cache.write_text(json.dumps(data, indent=2))
    if data.get("notes"):
        print(f"    Note: {str(data['notes'])[:120]}")
    return data


# ── Normalize & store ─────────────────────────────────────────────────────────

def normalize_col(raw):
    """Map a raw PDF column name to a slug. Returns None to skip."""
    key = raw.strip().upper()
    if key in RAW_NAME_TO_SLUG:
        return RAW_NAME_TO_SLUG[key]
    # Strip trailing footnote markers and retry
    key2 = re.sub(r'[\*†‡§\d,\.]+$', '', key).strip()
    if key2 in RAW_NAME_TO_SLUG:
        return RAW_NAME_TO_SLUG[key2]
    return None


def normalize_county(raw):
    """Returns (fips, name) or ('NYC', 'NYC combined') or (None, None)."""
    s = raw.strip()
    if s in NYC_ROW_NAMES or s.upper() in {n.upper() for n in NYC_ROW_NAMES}:
        return "NYC", "New York City (combined)"
    if s in COUNTY_FIPS:
        return COUNTY_FIPS[s], s
    for name, fips in COUNTY_FIPS.items():
        if name.upper() == s.upper():
            return fips, name
    # Partial match for edge cases like "St Lawrence" vs "St. Lawrence"
    for name, fips in COUNTY_FIPS.items():
        if name.upper().replace(".", "") == s.upper().replace(".", ""):
            return fips, name
    return None, None


def store_year(con, year, extracted, dry_run):
    now       = datetime.datetime.now(datetime.timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ")
    period    = f"annual-{year}"
    source    = PDF_URL_PATTERN.format(year=year)
    cols      = extracted.get("disease_columns", [])
    data      = extracted.get("data", {})

    col_map   = {c: normalize_col(c) for c in cols}
    unmapped  = {c for c, s in col_map.items() if s is None and
                 RAW_NAME_TO_SLUG.get(c.strip().upper(), "MISSING") != "MISSING"}
    # unmapped = columns not in our dict at all (excluding explicit None skip entries)
    truly_unmapped = set()
    for c in cols:
        key = c.strip().upper()
        key2 = re.sub(r'[\*†‡§\d,\.]+$', '', key).strip()
        if key not in RAW_NAME_TO_SLUG and key2 not in RAW_NAME_TO_SLUG:
            truly_unmapped.add(c)

    rows = []
    stored = suppressed = skipped = 0

    for county_raw, vals in data.items():
        fips, cname = normalize_county(county_raw)
        if fips is None:
            skipped += 1
            continue

        targets = [(f, NYC_FIPS_NAMES[f]) for f in NYC_FIPS] if fips == "NYC" else [(fips, cname)]

        for col, val in vals.items():
            slug = col_map.get(col)
            if not slug:
                continue   # skip unknown or explicitly-None columns

            is_sup = 0
            count  = None

            if val is None:
                is_sup = 1; suppressed += 1
            elif isinstance(val, (int, float)):
                count = int(val)
            elif isinstance(val, str):
                v = val.strip()
                if v in ("", "*", "NR", "N/A", "—", "-", "0*"):
                    is_sup = 1; suppressed += 1
                else:
                    try:
                        count = int(float(v.replace(",", "")))
                    except ValueError:
                        is_sup = 1; suppressed += 1

            for (tfips, tname) in targets:
                note = "NYC combined distributed to boroughs" if fips == "NYC" else None
                rows.append((now, year, period, tfips, tname, slug,
                             count, is_sup, 0, "annual-report-pdf", source, note))
                stored += 1

    if not dry_run and rows:
        con.executemany("""
            INSERT OR REPLACE INTO disease_cases
            (fetched_at,data_year,report_period,county_fips,county_name,disease_slug,
             case_count,is_suppressed,is_estimated,data_source,source_url,notes)
            VALUES (?,?,?,?,?,?,?,?,?,?,?,?)
        """, rows)
        con.commit()

    return {"stored": stored, "suppressed": suppressed, "unmapped": truly_unmapped}


# ── Baselines ─────────────────────────────────────────────────────────────────

def compute_and_save_baselines(con, baseline_years=None):
    if baseline_years is None:
        rows = con.execute("""
            SELECT DISTINCT data_year FROM disease_cases
            WHERE data_year < 2024 ORDER BY data_year DESC LIMIT 5
        """).fetchall()
        baseline_years = [r[0] for r in rows]

    if not baseline_years:
        print("  No data in DB — skipping baseline update")
        return

    print(f"  Baseline years: {sorted(baseline_years)}")
    ph = ",".join("?" * len(baseline_years))
    rows = con.execute(f"""
        SELECT disease_slug, data_year, SUM(case_count) as total
        FROM disease_cases
        WHERE data_year IN ({ph})
          AND is_suppressed=0 AND case_count IS NOT NULL
        GROUP BY disease_slug, data_year
    """, baseline_years).fetchall()

    by_disease: dict[str, list] = {}
    for r in rows:
        by_disease.setdefault(r[0], []).append(r[2])

    new_baselines = {slug: round(sum(vals) / len(vals))
                     for slug, vals in by_disease.items() if len(vals) >= 3}

    existing = {}
    if BASELINES_FILE.exists():
        existing = json.loads(BASELINES_FILE.read_text())
    existing.update(new_baselines)
    BASELINES_FILE.write_text(json.dumps(existing, indent=2))
    print(f"  ✓ baselines.json updated ({len(new_baselines)} diseases from DB, "
          f"{len(existing)} total)")


# ── CSV export ────────────────────────────────────────────────────────────────

def export_csv(con):
    DOWNLOADS_DIR.mkdir(parents=True, exist_ok=True)
    rows = con.execute("""
        SELECT data_year,county_fips,county_name,disease_slug,
               case_count,is_suppressed,data_source
        FROM disease_cases ORDER BY data_year DESC,county_fips,disease_slug
    """).fetchall()
    if not rows:
        print("  No data to export"); return
    out = DOWNLOADS_DIR / "disease_cases_annual.csv"
    with open(out, "w", newline="") as f:
        w = csv.DictWriter(f, fieldnames=rows[0].keys())
        w.writeheader(); w.writerows([dict(r) for r in rows])
    years = sorted({r["data_year"] for r in rows})
    print(f"  ✓ disease_cases_annual.csv  ({len(rows)} rows, {min(years)}–{max(years)})")


# ── Main ──────────────────────────────────────────────────────────────────────

def main():
    ap = argparse.ArgumentParser()
    grp = ap.add_mutually_exclusive_group()
    grp.add_argument("--year",  type=int)
    grp.add_argument("--years", type=str, help="e.g. 2019-2023")
    grp.add_argument("--all",   action="store_true", help="All years 2005–2023")
    ap.add_argument("--recompute-baselines", action="store_true")
    ap.add_argument("--dry-run", action="store_true")
    ap.add_argument("--force",   action="store_true", help="Re-process years already in DB")
    ap.add_argument("--delay",   type=float, default=5.0,
                    help="Seconds between Gemini calls (default 5 — free tier is 15/min)")
    ap.add_argument("--baseline-years", type=str, help="e.g. 2019-2023")
    args = ap.parse_args()

    # ── Determine target years ─────────────────────────────────────────────
    if args.recompute_baselines:
        years = []
    elif args.year:
        years = [args.year]
    elif args.years:
        a, b = args.years.split("-"); years = list(range(int(a), int(b)+1))
    elif args.all:
        years = AVAILABLE_YEARS
    else:
        ap.print_help()
        print("\nExamples:")
        print("  python3 pipeline/fetch_annual.py --all")
        print("  python3 pipeline/fetch_annual.py --years 2019-2023")
        print("  python3 pipeline/fetch_annual.py --year 2023")
        print("  python3 pipeline/fetch_annual.py --recompute-baselines")
        return

    con = get_db()
    print(f"=== fetch_annual.py | target years: {years or 'baseline-only'} | dry_run={args.dry_run} ===")
    print(f"Database: {DB_PATH}\n")

    if years and not GEMINI_API_KEY and not args.recompute_baselines:
        print("⚠  GEMINI_API_KEY not set.")
        print("   Get a free key at: https://aistudio.google.com/app/apikey")
        print("   Then: export GEMINI_API_KEY=your_key\n")
        sys.exit(1)

    # ── Process each year ──────────────────────────────────────────────────
    all_unmapped: set[str] = set()
    total_stored = 0
    processed = []

    for i, year in enumerate(sorted(years)):
        print(f"── {year}  ({i+1}/{len(years)}) " + "─"*40)

        if not args.force and not args.dry_run and year_in_db(con, year):
            n = con.execute("SELECT COUNT(*) FROM disease_cases WHERE data_year=?",
                            (year,)).fetchone()[0]
            print(f"  Already in DB ({n} rows) — skipping (--force to override)\n")
            processed.append(year)
            continue

        pdf = download_pdf(year)
        if pdf is None:
            print(f"  ✗ PDF unavailable for {year}\n"); continue

        if i > 0:
            time.sleep(args.delay)

        extracted = extract_with_gemini(pdf, year, args.delay)
        if extracted is None:
            print(f"  ✗ Extraction failed for {year}\n"); continue

        stats = store_year(con, year, extracted, args.dry_run)
        total_stored += stats["stored"]
        all_unmapped |= stats["unmapped"]
        processed.append(year)

        print(f"  Stored: {stats['stored']} rows  |  Suppressed: {stats['suppressed']}")
        if stats["unmapped"]:
            display = sorted(stats["unmapped"])[:6]
            print(f"  Unmapped columns (not in RAW_NAME_TO_SLUG): {display}")
        print()

    # ── Baselines ──────────────────────────────────────────────────────────
    print("── Baselines " + "─"*50)
    bl_years = None
    if args.baseline_years:
        a, b = args.baseline_years.split("-")
        bl_years = list(range(int(a), int(b)+1))
    if not args.dry_run:
        compute_and_save_baselines(con, bl_years)
    print()

    # ── Export CSV ─────────────────────────────────────────────────────────
    if not args.dry_run:
        print("── Export " + "─"*54)
        export_csv(con)

        # Update metadata
        if METADATA_FILE.exists():
            meta = json.loads(METADATA_FILE.read_text())
        else:
            meta = {}
        meta.setdefault("sources", {})["annual-report-pdf"] = {
            "lastFetched": datetime.datetime.now(datetime.timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ"),
            "yearsInDB": sorted({r[0] for r in con.execute(
                "SELECT DISTINCT data_year FROM disease_cases").fetchall()}),
        }
        METADATA_FILE.write_text(json.dumps(meta, indent=2))
        print()

    # ── Summary ────────────────────────────────────────────────────────────
    print(f"=== Done. {total_stored} rows stored across {len(processed)} years. ===")

    if all_unmapped:
        print(f"\n⚠  {len(all_unmapped)} disease column name(s) found in PDFs but not in")
        print("   RAW_NAME_TO_SLUG. Add these to fetch_annual.py to capture them:")
        for name in sorted(all_unmapped):
            print(f'    "{name}": "slug-here",')

    con.close()


if __name__ == "__main__":
    main()
