#!/usr/bin/env python3
"""
import_annual.py — Direct importer for pre-extracted NYS annual disease data

Reads nys_cd_2014_2024.json (extracted from NYSDOH PDFs via pdfplumber),
normalises column names to disease slugs, stores in SQLite, recomputes
baselines.json, and exports the public CSV dataset.

This replaces fetch_annual.py for pre-extracted data — no Gemini API needed.

Usage:
    python3 pipeline/import_annual.py --file data/nys_cd_2014_2024.json
    python3 pipeline/import_annual.py --file data/nys_cd_2014_2024.json --dry-run
    python3 pipeline/import_annual.py --recompute-baselines
"""

import os, sys, json, sqlite3, csv, datetime, argparse, re
from pathlib import Path

ROOT          = Path(__file__).resolve().parent.parent
DB_PATH       = ROOT / "data" / "db" / "nyhealthwatch.db"
PIPELINE_DIR  = ROOT / "data" / "pipeline"
DOWNLOADS_DIR = ROOT / "public" / "downloads"
BASELINES_FILE = PIPELINE_DIR / "baselines.json"
METADATA_FILE  = PIPELINE_DIR / "metadata.json"

# ── Disease name → slug ───────────────────────────────────────────────────────
# Covers all column name variants seen across 2014–2024 NYSDOH annual reports.

RAW_NAME_TO_SLUG = {
    # ── Tier A ──
    "LABORATORY CONFIRMED INFLUENZA":               "influenza",
    "LAB-CONFIRMED INFLUENZA":                      "influenza",
    "RESPIRATORY SYNCYTIAL VIRUS":                  "rsv",
    "RSV":                                          "rsv",
    "WEST NILE FEVER":                              "west-nile-fever",
    "WEST NILE VIRUS":                              "west-nile-virus",
    "WNV":                                          "west-nile-virus",
    "WNV (NEUROINVASIVE)":                          "west-nile-virus",
    "EASTERN EQUINE ENCEPHALITIS":                  "eastern-equine-encephalitis",
    # ── Tick-borne ──
    "ANAPLASMOSIS":                                 "anaplasmosis",
    "ANAPLAS-MOSIS":                                "anaplasmosis",   # hyphenated
    "HGE":                                          "anaplasmosis",
    "ANAPLASMOSIS (HGE)":                           "anaplasmosis",
    "HUMAN GRANULOCYTIC EHRLICHIOSIS":              "anaplasmosis",
    "HUMAN GRANULOCYTIC ANAPLASMOSIS":              "anaplasmosis",
    "ANAPLASMA PHAGOCYTOPHILUM":                    "anaplasmosis",
    "BABESIOSIS":                                   "babesiosis",
    "EHRLICHIOSIS":                                 "ehrlichiosis",
    "HME":                                          "ehrlichiosis",
    "HUMAN MONOCYTIC EHRLICHIOSIS":                 "ehrlichiosis",
    "LYME DISEASE":                                 "lyme-disease",
    "LYME DISEASE*":                                "lyme-disease",
    "LYME DISEASE**":                               "lyme-disease",
    "LYME DISEASE***":                              "lyme-disease",
    "LYME":                                         "lyme-disease",
    "ROCKY MOUNTAIN SPOTTED FEVER":                 "rocky-mountain-spotted-fever",
    "ROCKY MTN SPOTTED FEVER":                      "rocky-mountain-spotted-fever",
    "ROCKY MT SPOTTED FEVER":                       "rocky-mountain-spotted-fever",
    "RMSF":                                         "rocky-mountain-spotted-fever",
    # ── GI ──
    "AMEBIASIS":                                    "amebiasis",
    "CAMPYLOBACTERIOSIS":                           "campylobacteriosis",
    "CAMPYLO-BACTERIOSIS":                          "campylobacteriosis",   # hyphenated
    "CRYPTOSPORIDIOSIS":                            "cryptosporidiosis",
    "CRYPTO-SPORIDIOSIS":                           "cryptosporidiosis",    # hyphenated
    "CYCLOSPORIASIS":                               "cyclosporiasis",
    "CYCLOSPORA":                                   "cyclosporiasis",
    "E. COLI (SHIGA TOXIN-PRODUCING)":              "e-coli-stec",
    "E. COLI SHIGA-TOXIN":                          "e-coli-stec",
    "E. COLI SHIGA TOXIN":                          "e-coli-stec",
    "E. COLI O157":                                 "e-coli-stec",
    "E.COLI O157:H7":                               "e-coli-stec",
    "EHEC*":                                        "e-coli-stec",
    "STEC":                                         "e-coli-stec",
    "GIARDIASIS":                                   "giardiasis",
    "GIARDIA":                                      "giardiasis",
    "HEMOLYTIC UREMIC SYNDROME":                    "hemolytic-uremic-syndrome",
    "HUS":                                          "hemolytic-uremic-syndrome",
    "LISTERIOSIS":                                  "listeriosis",
    "LISTERIOSI S":                                 "listeriosis",    # OCR spacing error
    "LISTERIA":                                     "listeriosis",
    "SALMONELLOSIS":                                "salmonellosis",
    "SALMONELLA":                                   "salmonellosis",
    "SHIGELLOSIS":                                  "shigellosis",
    "SHIGELLA":                                     "shigellosis",
    "VIBRIOSIS":                                    "vibriosis",
    "VIBRIO":                                       "vibriosis",
    "YERSINIOSIS":                                  "yersiniosis",
    "YERSINIA":                                     "yersiniosis",
    "YERSINIA ENTEROCOLITICA":                      "yersiniosis",
    # ── STI ──
    "CHLAMYDIA":                                    "chlamydia",
    "CHLAMYDIA TRACHOMATIS":                        "chlamydia",
    "GONORRHEA":                                    "gonorrhea",
    "GONOCOCCAL INFECTION":                         "gonorrhea",
    "SYPHILIS EARLY":                               "syphilis-early",
    "SYPHILIS, EARLY":                              "syphilis-early",
    "SYPHILIS LATE":                                "syphilis-late",
    "SYPHILIS, LATE":                               "syphilis-late",
    "SYPHILIS (LATE AND LATENT)":                   "syphilis-late",
    "MPOX":                                         "mpox",
    "MONKEYPOX":                                    "mpox",
    # ── Bloodborne ──
    "HEPATITIS A":                                  "hepatitis-a",
    "HEPATITIS B ACUTE":                            "hepatitis-b-acute",
    "HEPATITIS B CHRONIC":                          "hepatitis-b-chronic",
    "HEPATITIS B CHRONIC*":                         "hepatitis-b-chronic",
    "HEPATITIS C ACUTE":                            "hepatitis-c-acute",
    "HEPATITIS C CHRONIC":                          "hepatitis-c-chronic",
    "HEPATITIS C CHRONIC*":                         "hepatitis-c-chronic",
    "HEPATITIS C, PAST/PRESENT":                    "hepatitis-c-chronic",   # old name
    "HEPATITIS B":                                  "hepatitis-b-acute",     # pre-split era
    "HEPATITIS C":                                  "hepatitis-c-acute",
    # ── Respiratory ──
    "TUBERCULOSIS":                                 "tuberculosis",
    "TUBERC-ULOSIS":                                "tuberculosis",          # hyphenated
    "TB":                                           "tuberculosis",
    "LEGIONELLOSIS":                                "legionellosis",
    "LEGIONELLO SIS":                               "legionellosis",         # OCR spacing error
    "LEGIONELLA":                                   "legionellosis",
    "PERTUSSIS":                                    "pertussis",
    "WHOOPING COUGH":                               "pertussis",
    "MUMPS":                                        "mumps",
    "VARICELLA":                                    "varicella",
    "CHICKENPOX":                                   "varicella",
    # ── Invasive bacterial ──
    "STREP GROUP A INVASIVE":                       "strep-a-invasive",
    "GROUP A STREP (INVASIVE)":                     "strep-a-invasive",
    "STREPTOCOCCUS GROUP A (INVASIVE)":             "strep-a-invasive",
    "INVASIVE GROUP A STREP":                       "strep-a-invasive",
    "STREP GROUP B INVASIVE":                       "strep-b-invasive",
    "GROUP B STREP (INVASIVE)":                     "strep-b-invasive",
    "STREPTOCOCCUS GROUP B (INVASIVE)":             "strep-b-invasive",
    "STREP PNEUMO INVASIVE":                        "strep-pneumo-invasive",
    "STREP PNEUMO (INVASIVE)":                      "strep-pneumo-invasive",
    "STREPTOCOCCUS PNEUMONIAE (INVASIVE)":          "strep-pneumo-invasive",
    "INVASIVE PNEUMOCOCCAL DISEASE":                "strep-pneumo-invasive",
    "MENINGOCOCCAL":                                "meningococcal",
    "MENINGOCOCCAL DISEASE":                        "meningococcal",
    "MENINGO-COCCAL":                               "meningococcal",         # hyphenated
    "MENINGITIS MENINGO-COCCAL":                    "meningococcal",
    "NEISSERIA MENINGITIDIS (INVASIVE)":            "meningococcal",
    "HAEMOPHILUS INFLUENZAE":                       "haemophilus-influenzae",
    "HAEMOPHILUS INFLUENZAE (INVASIVE)":            "haemophilus-influenzae",
    "H. INFLUENZAE (INVASIVE)":                     "haemophilus-influenzae",
    "MENINGITIS ASEPTIC":                           "meningitis-aseptic",
    "MENINGITIS, ASEPTIC":                          "meningitis-aseptic",
    "ASEPTIC MENINGITIS":                           "meningitis-aseptic",
    "MENINGITIS (BACTERIAL)":                       "meningitis-bacterial",
    "MENINGITIS OTHER BACT. AND UNKNOWN":           "meningitis-bacterial",
    "MENINGITIS OTHER BACT. AND UNK":               "meningitis-bacterial",
    "MENINGITIS, OTHER**":                          "meningitis-bacterial",
    "BACTERIAL MENINGITIS":                         "meningitis-bacterial",
    "ACUTE FLACCID MYELITIS":                       "acute-flaccid-myelitis",
    # ── Other ──
    "Q FEVER":                                      "q-fever",
    "BRUCELLOSIS":                                  "brucellosis",
    "CANDIDA AURIS":                                "candida-auris",
    "BLASTOMYCOSIS":                                "blastomycosis",
    "BLASTO-MYCOSIS":                               "blastomycosis",         # hyphenated
    "BLASTOMY-COSIS":                               "blastomycosis",         # hyphenated variant
    "TYPHOID FEVER":                                "typhoid-fever",
    "TYPHOID":                                      "typhoid-fever",
    "MALARIA":                                      "malaria",
    "DENGUE FEVER":                                 "dengue-fever",
    "DENGUE":                                       "dengue-fever",
    "CHIKUNGUNYA":                                  "chikungunya",
    "CHIKUNGUNYA FEVER":                            "chikungunya",
    "NEONATAL HERPES":                              "neonatal-herpes",
    "HERPES INF, INFANT <60 DAYS":                  "neonatal-herpes",
    "HERPES INF, INFANT <60 DAYS":                  "neonatal-herpes",
    "HERPES, INFANT <60 DAYS":                      "neonatal-herpes",
    "HERPES SIMPLEX (NEONATAL)":                    "neonatal-herpes",
    "TOXIC SHOCK SYNDROME":                         "toxic-shock-syndrome",
    "TSS":                                          "toxic-shock-syndrome",
    "VISA":                                         "visa-staph",
    "VRSA":                                         "visa-staph",
    "VISA/VRSA":                                    "visa-staph",
    "VANCOMYCIN INTERMEDIATE STAPHYLOCOCCUS AUREAUS":   "visa-staph",
    "VANCOMYCIN INTERMEDIATE STAPHLOCOCCUS AUREAUS":    "visa-staph",  # typo
    "VANCOMYCIN INTERMEDIATE STAPHL-OCOCCUS AUREAUS":   "visa-staph",  # hyphenated
    "MEASLES":                                      "measles",
    "BOTULISM":                                     "botulism",
    "BOTULISM (INFANT)":                            "botulism",
    "INFANT BOTULISM":                              "botulism",
    "BOTULISM (FOODBORNE)":                         "botulism",
    "DIPHTHERIA":                                   "diphtheria",
    "TETANUS":                                      "tetanus",
    "TULAREMIA":                                    "tularemia",
    # ── Explicitly skipped (not in our disease registry) ──
    "AIDS*":                                        None,
    "HIV*":                                         None,
    "HIV**":                                        None,
    "ARBO, OTHER NON-INVASIVE":                     None,
    "ARBO,OTHER NON-INVASIVE":                      None,
    "CHOLERA":                                      None,
    "ZIKA VIRUS":                                   None,
    "YELLOW FEVER":                                 None,
    "RUBELLA":                                      None,
    "RUBELLA, CONGENITAL":                          None,
    "HEPATITIS B PERINATAL":                        None,
    "EHRLICH/ANAPLAS UNDETERMINED":                 None,
    "EHRLICH/ANAPLA SMOSIS UNDETERMINED":           None,
    "EHRLICH/ANAPLASMOSIS UNDETERMINED":            None,
    "LYMPHOGRANULOMA VENEREUM":                     None,
    "LYMPHO-GRANULOMA VENEREUM":                    None,
    "ENCEPHALITIS (NONWESTNILE)":                   None,
    "ENCEPHALITIS (NON-WESTNILE)":                  None,
    "ENCEPHALITIS (NON-WNV)":                       None,
    "ENCEPHALITIS (NON EEE AND WNV)":               None,
    "ENCEPHALITIS**":                               None,
    "MENINGITIS (OTHER/BACTERIAL)":                 None,  # duplicate handled above
    "S.PARATYPHI":                                  None,
    "S. PARATYPHI":                                 None,
    "SALMONELLOSIS, PARATYPHI":                     None,
    "MELIOIDOSIS":                                  None,
    "MELIODISIS":                                   None,
    "PSITTACOSIS":                                  None,
    "HANTAVIRUS":                                   None,
    "ANTHRAX":                                      None,
    "CHANCROID":                                    None,
    "SARS":                                         None,
    "SMALLPOX":                                     None,
    "PLAGUE":                                       None,
}

NYC_ROW_VARIANTS = {"NYC*", "NYC**", "NYC", "New York City*", "New York City",
                    "NYC TOTAL", "NEW YORK CITY*", "NEW YORK CITY"}
NYC_FIPS = ["36005", "36047", "36061", "36081", "36085"]
NYC_FIPS_NAMES = {"36005": "Bronx", "36047": "Kings", "36061": "New York",
                  "36081": "Queens", "36085": "Richmond"}

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


def normalize_col(raw: str):
    """Map raw column name to slug. Returns None to explicitly skip. Returns 'UNMAPPED' if unknown."""
    key = raw.strip().upper()
    if key in RAW_NAME_TO_SLUG:
        return RAW_NAME_TO_SLUG[key]
    key2 = re.sub(r'[\*†‡§\d,\.]+$', '', key).strip()
    if key2 in RAW_NAME_TO_SLUG:
        return RAW_NAME_TO_SLUG[key2]
    return "UNMAPPED"


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


def import_data(json_path: Path, dry_run=False):
    with open(json_path) as f:
        all_years = json.load(f)

    con = get_db()
    now = datetime.datetime.now(datetime.timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ")
    total_stored = 0
    all_unmapped = set()

    for yr_str in sorted(all_years.keys()):
        year = int(yr_str)
        obj = all_years[yr_str]
        period = f"annual-{year}"
        source_url = f"https://www.health.ny.gov/statistics/diseases/communicable/{year}/docs/cases.pdf"

        # Build column slug map for this year
        cols = obj["disease_columns"]
        col_to_slug = {}
        for c in cols:
            slug = normalize_col(c)
            col_to_slug[c] = slug
            if slug == "UNMAPPED":
                all_unmapped.add(c)

        rows = []
        stored = suppressed = 0

        for county_name, disease_vals in obj["data"].items():
            # Determine if this is the NYC combined row
            is_nyc = county_name in NYC_ROW_VARIANTS or county_name.upper() in {
                n.upper() for n in NYC_ROW_VARIANTS
            }

            if is_nyc:
                targets = [(fips, NYC_FIPS_NAMES[fips]) for fips in NYC_FIPS]
                note = "NYC combined distributed to boroughs"
            elif county_name in COUNTY_FIPS:
                targets = [(COUNTY_FIPS[county_name], county_name)]
                note = None
            else:
                # Try title-case lookup
                matched = next((k for k in COUNTY_FIPS if k.upper() == county_name.upper()), None)
                if matched:
                    targets = [(COUNTY_FIPS[matched], matched)]
                    note = None
                else:
                    print(f"  ⚠ {year}: unrecognised county '{county_name}' — skipping")
                    continue

            for col, val in disease_vals.items():
                slug = col_to_slug.get(col, "UNMAPPED")
                if slug is None or slug == "UNMAPPED":
                    continue

                is_sup = 0
                count = None
                if val is None:
                    is_sup = 1
                    suppressed += 1
                elif isinstance(val, (int, float)):
                    count = int(val)
                elif isinstance(val, str):
                    v = val.strip()
                    if v in ("", "*", "NR", "N/A", "—", "-"):
                        is_sup = 1; suppressed += 1
                    else:
                        try:
                            count = int(float(v.replace(",", "")))
                        except ValueError:
                            is_sup = 1; suppressed += 1

                for (fips, cname) in targets:
                    rows.append((now, year, period, fips, cname, slug,
                                 count, is_sup, 0, "annual-report-pdf", source_url, note))
                    stored += 1

        if not dry_run and rows:
            con.executemany("""
                INSERT OR REPLACE INTO disease_cases
                (fetched_at,data_year,report_period,county_fips,county_name,disease_slug,
                 case_count,is_suppressed,is_estimated,data_source,source_url,notes)
                VALUES (?,?,?,?,?,?,?,?,?,?,?,?)
            """, rows)
            con.commit()

        total_stored += stored
        print(f"  {year}: {stored} rows stored  ({suppressed} suppressed/null)")

    if all_unmapped:
        print(f"\n⚠  {len(all_unmapped)} unmapped column names (skipped):")
        for c in sorted(all_unmapped):
            print(f"     {c!r}")

    return con, total_stored


def compute_baselines(con, baseline_years=None):
    if baseline_years is None:
        rows = con.execute("""
            SELECT DISTINCT data_year FROM disease_cases
            WHERE data_year < 2024 ORDER BY data_year DESC LIMIT 5
        """).fetchall()
        baseline_years = [r[0] for r in rows]

    if not baseline_years:
        print("  No data in DB"); return {}

    print(f"  Computing baselines from: {sorted(baseline_years)}")
    ph = ",".join("?" * len(baseline_years))
    rows = con.execute(f"""
        SELECT disease_slug, data_year, SUM(case_count) as total
        FROM disease_cases
        WHERE data_year IN ({ph})
          AND is_suppressed=0 AND case_count IS NOT NULL
        GROUP BY disease_slug, data_year
    """, baseline_years).fetchall()

    by_disease = {}
    for r in rows:
        by_disease.setdefault(r[0], []).append(r[2])

    new_baselines = {slug: round(sum(vals) / len(vals))
                     for slug, vals in by_disease.items() if vals}

    existing = {}
    if BASELINES_FILE.exists():
        existing = json.loads(BASELINES_FILE.read_text())
    existing.update(new_baselines)
    BASELINES_FILE.write_text(json.dumps(existing, indent=2, sort_keys=True))
    print(f"  ✓ baselines.json: {len(new_baselines)} diseases from DB, {len(existing)} total")
    return new_baselines


def export_csv(con):
    DOWNLOADS_DIR.mkdir(parents=True, exist_ok=True)
    rows = con.execute("""
        SELECT data_year, county_fips, county_name, disease_slug,
               case_count, is_suppressed, data_source
        FROM disease_cases
        ORDER BY data_year DESC, county_fips, disease_slug
    """).fetchall()
    if not rows:
        print("  No data to export"); return
    out = DOWNLOADS_DIR / "disease_cases_annual.csv"
    with open(out, "w", newline="") as f:
        w = csv.DictWriter(f, fieldnames=rows[0].keys())
        w.writeheader()
        w.writerows([dict(r) for r in rows])
    years = sorted({r["data_year"] for r in rows})
    print(f"  ✓ disease_cases_annual.csv  ({len(rows):,} rows, {min(years)}–{max(years)})")


def main():
    ap = argparse.ArgumentParser(description="Import pre-extracted NYS annual disease data")
    ap.add_argument("--file", type=Path, help="Path to nys_cd_2014_2024.json")
    ap.add_argument("--dry-run", action="store_true")
    ap.add_argument("--recompute-baselines", action="store_true")
    ap.add_argument("--baseline-years", type=str, help="e.g. 2019-2023")
    args = ap.parse_args()

    print(f"=== import_annual.py | dry_run={args.dry_run} ===")
    print(f"Database: {DB_PATH}\n")

    con = None

    if not args.recompute_baselines:
        if not args.file:
            ap.error("--file is required (path to nys_cd_2014_2024.json)")
        if not args.file.exists():
            ap.error(f"File not found: {args.file}")

        print("── Importing disease cases ─────────────────────────────────────")
        con, total = import_data(args.file, dry_run=args.dry_run)
        print(f"\nTotal rows stored: {total:,}\n")

    if not args.dry_run:
        if con is None:
            con = get_db()

        print("── Computing baselines ─────────────────────────────────────────")
        bl_years = None
        if args.baseline_years:
            a, b = args.baseline_years.split("-")
            bl_years = list(range(int(a), int(b)+1))
        compute_baselines(con, bl_years)
        print()

        print("── Exporting CSV ───────────────────────────────────────────────")
        export_csv(con)
        print()

        # Update metadata
        if METADATA_FILE.exists():
            meta = json.loads(METADATA_FILE.read_text())
        else:
            meta = {}
        years_in_db = sorted({r[0] for r in con.execute(
            "SELECT DISTINCT data_year FROM disease_cases").fetchall()})
        meta.setdefault("sources", {})["annual-report-pdf"] = {
            "lastFetched": datetime.datetime.now(datetime.timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ"),
            "yearsInDB": years_in_db,
        }
        METADATA_FILE.write_text(json.dumps(meta, indent=2))
        print(f"  ✓ metadata.json updated (years in DB: {years_in_db})")

    print("\n=== Done. ===")


if __name__ == "__main__":
    main()
