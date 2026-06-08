#!/usr/bin/env python3
"""
compute_levels.py — NY Health Watch core computation engine

Converts raw annual case data into disease activity levels and county threat
levels. The only script that writes to disease-activity.json and
county-threats.json for Tier B and Tier C diseases.

Tier A diseases (COVID, flu, RSV, WNV, EEE, norovirus) are written by
fetch_wastewater.py and fetch_weekly.py — this script PRESERVES those entries.

Usage:
    python3 pipeline/compute_levels.py
    python3 pipeline/compute_levels.py --month 11    # force a specific month
    python3 pipeline/compute_levels.py --dry-run     # print without writing

Run this:
    - After fetch_annual.py updates annual-cases.json (annual)
    - Monthly via GitHub Actions to keep seasonal signals fresh
"""

import json
import sys
import os
import argparse
import datetime
from pathlib import Path

# ── Paths ─────────────────────────────────────────────────────────────────────

ROOT = Path(__file__).resolve().parent.parent
PIPELINE_DIR = ROOT / "data" / "pipeline"

ANNUAL_CASES_FILE  = PIPELINE_DIR / "annual-cases.json"
BASELINES_FILE     = PIPELINE_DIR / "baselines.json"
ACTIVITY_FILE      = PIPELINE_DIR / "disease-activity.json"
COUNTY_THREATS_FILE = PIPELINE_DIR / "county-threats.json"
METADATA_FILE      = PIPELINE_DIR / "metadata.json"

# ── Disease metadata ──────────────────────────────────────────────────────────
# Tier and seasonality for every tracked disease.
# Tier A: level set by fetch_wastewater.py / fetch_weekly.py — SKIP
# Tier B: statistical comparison vs baseline × seasonality check
# Tier C: zero-tolerance — any confirmed case in county = flag

TIER_A = {
    "covid-19", "influenza", "rsv", "norovirus",
    "west-nile-virus", "eastern-equine-encephalitis",
}

TIER_C = {
    "measles", "botulism", "diphtheria", "tetanus", "tularemia",
}

# Season definitions: set of months (1=Jan … 12=Dec) where disease is active.
# Out-of-season → always "low", regardless of case counts.
YEAR_ROUND = set(range(1, 13))
TICK_SEASON    = {4, 5, 6, 7, 8, 9, 10}          # Apr–Oct
MOSQUITO_SEASON = {6, 7, 8, 9, 10}               # Jun–Oct
SUMMER_SEASON  = {5, 6, 7, 8, 9, 10}             # May–Oct (legionella, foodborne spike)
WINTER_SEASON  = {11, 12, 1, 2, 3, 4}            # Nov–Apr (flu, RSV, norovirus)

DISEASE_SEASONS: dict[str, set[int]] = {
    # Tier A (for reference — not computed here)
    "covid-19":                   YEAR_ROUND,
    "influenza":                  WINTER_SEASON,
    "rsv":                        WINTER_SEASON,
    "norovirus":                  WINTER_SEASON,
    "west-nile-virus":            MOSQUITO_SEASON,
    "eastern-equine-encephalitis": MOSQUITO_SEASON,
    # Tick-borne
    "lyme-disease":               TICK_SEASON,
    "anaplasmosis":               TICK_SEASON,
    "babesiosis":                 TICK_SEASON,
    "ehrlichiosis":               TICK_SEASON,
    "rocky-mountain-spotted-fever": TICK_SEASON,
    "west-nile-fever":            MOSQUITO_SEASON,
    # Mosquito / travel
    "malaria":                    YEAR_ROUND,
    "dengue-fever":               YEAR_ROUND,
    "chikungunya":                YEAR_ROUND,
    # Foodborne — slight summer peak but year-round
    "campylobacteriosis":         YEAR_ROUND,
    "salmonellosis":              YEAR_ROUND,
    "shigellosis":                YEAR_ROUND,
    "e-coli-stec":                YEAR_ROUND,
    "cryptosporidiosis":          YEAR_ROUND,
    "giardiasis":                 YEAR_ROUND,
    "listeriosis":                YEAR_ROUND,
    "yersiniosis":                YEAR_ROUND,
    "cyclosporiasis":             SUMMER_SEASON,
    "vibriosis":                  SUMMER_SEASON,
    "hemolytic-uremic-syndrome":  YEAR_ROUND,
    "amebiasis":                  YEAR_ROUND,
    # STI
    "chlamydia":                  YEAR_ROUND,
    "gonorrhea":                  YEAR_ROUND,
    "syphilis-early":             YEAR_ROUND,
    "syphilis-late":              YEAR_ROUND,
    "mpox":                       YEAR_ROUND,
    # Bloodborne
    "hepatitis-a":                YEAR_ROUND,
    "hepatitis-b-acute":          YEAR_ROUND,
    "hepatitis-b-chronic":        YEAR_ROUND,
    "hepatitis-c-acute":          YEAR_ROUND,
    "hepatitis-c-chronic":        YEAR_ROUND,
    # Respiratory
    "tuberculosis":               YEAR_ROUND,
    "legionellosis":              SUMMER_SEASON,
    "pertussis":                  YEAR_ROUND,
    "mumps":                      YEAR_ROUND,
    "varicella":                  YEAR_ROUND,
    "influenza":                  WINTER_SEASON,
    "rsv":                        WINTER_SEASON,
    # Invasive bacterial
    "strep-a-invasive":           YEAR_ROUND,
    "strep-b-invasive":           YEAR_ROUND,
    "strep-pneumo-invasive":      WINTER_SEASON,
    "meningococcal":              YEAR_ROUND,
    "haemophilus-influenzae":     YEAR_ROUND,
    "meningitis-aseptic":         SUMMER_SEASON,
    "meningitis-bacterial":       YEAR_ROUND,
    "acute-flaccid-myelitis":     YEAR_ROUND,
    # Zoonotic / other
    "q-fever":                    YEAR_ROUND,
    "brucellosis":                YEAR_ROUND,
    "candida-auris":              YEAR_ROUND,
    "blastomycosis":              YEAR_ROUND,
    "typhoid-fever":              YEAR_ROUND,
    "neonatal-herpes":            YEAR_ROUND,
    "toxic-shock-syndrome":       YEAR_ROUND,
    "visa-staph":                 YEAR_ROUND,
    # Tier C
    "measles":                    YEAR_ROUND,
    "botulism":                   YEAR_ROUND,
    "diphtheria":                 YEAR_ROUND,
    "tetanus":                    YEAR_ROUND,
    "tularemia":                  TICK_SEASON,
}

# ── County data ───────────────────────────────────────────────────────────────

COUNTY_NAMES: dict[str, str] = {
    "36001":"Albany",      "36003":"Allegany",    "36005":"Bronx",
    "36007":"Broome",      "36009":"Cattaraugus", "36011":"Cayuga",
    "36013":"Chautauqua",  "36015":"Chemung",     "36017":"Chenango",
    "36019":"Clinton",     "36021":"Columbia",    "36023":"Cortland",
    "36025":"Delaware",    "36027":"Dutchess",    "36029":"Erie",
    "36031":"Essex",       "36033":"Franklin",    "36035":"Fulton",
    "36037":"Genesee",     "36039":"Greene",      "36041":"Hamilton",
    "36043":"Herkimer",    "36045":"Jefferson",   "36047":"Kings",
    "36049":"Lewis",       "36051":"Livingston",  "36053":"Madison",
    "36055":"Monroe",      "36057":"Montgomery",  "36059":"Nassau",
    "36061":"New York",    "36063":"Niagara",     "36065":"Oneida",
    "36067":"Onondaga",    "36069":"Ontario",     "36071":"Orange",
    "36073":"Orleans",     "36075":"Oswego",      "36077":"Otsego",
    "36079":"Putnam",      "36081":"Queens",      "36083":"Rensselaer",
    "36085":"Richmond",    "36087":"Rockland",    "36089":"St. Lawrence",
    "36091":"Saratoga",    "36093":"Schenectady", "36095":"Schoharie",
    "36097":"Schuyler",    "36099":"Seneca",      "36101":"Steuben",
    "36103":"Suffolk",     "36105":"Sullivan",    "36107":"Tioga",
    "36109":"Tompkins",    "36111":"Ulster",      "36113":"Warren",
    "36115":"Washington",  "36117":"Wayne",       "36119":"Westchester",
    "36121":"Wyoming",     "36123":"Yates",
}

# 2020 Census county populations (excl. NYC boroughs — those roll into NYC total)
COUNTY_POP: dict[str, int] = {
    "36001":314848, "36003":46456,   "36005":1472654, "36007":190488,
    "36009":76117,  "36011":75647,   "36013":126903,  "36015":83456,
    "36017":46207,  "36019":80485,   "36021":60919,   "36023":44231,
    "36025":44135,  "36027":294218,  "36029":951340,  "36031":36885,
    "36033":50022,  "36035":53383,   "36037":57280,   "36039":47188,
    "36041":4416,   "36043":61319,   "36045":111004,  "36047":2736074,
    "36049":26296,  "36051":62914,   "36053":69441,   "36055":741770,
    "36057":49708,  "36059":1395774, "36061":1694251, "36063":209281,
    "36065":228671, "36067":476516,  "36069":109777,  "36071":384940,
    "36073":40343,  "36075":117124,  "36077":59493,   "36079":99070,
    "36081":2405464,"36083":159429,  "36085":495747,  "36087":338329,
    "36089":107740, "36091":229863,  "36093":155299,  "36095":31582,
    "36097":17807,  "36099":33683,   "36101":95379,   "36103":1525920,
    "36105":75432,  "36107":48203,   "36109":105740,  "36111":177573,
    "36113":64480,  "36115":61828,   "36117":89918,   "36119":1004457,
    "36121":39859,  "36123":25009,
}

NYC_FIPS = {"36005", "36047", "36061", "36081", "36085"}

# ── Thresholds ────────────────────────────────────────────────────────────────

# Statewide ratio thresholds (current year / 5-yr baseline)
RATIO_MODERATE = 2.0   # ≥ 2× baseline → moderate
RATIO_WATCH    = 1.5   # ≥ 1.5× baseline → watch

# For county-level flagging: counties where per-capita rate exceeds this
# multiple of the statewide per-capita rate get flagged.
# 1.0 = above-average counties only; 0.75 = more inclusive
COUNTY_FLAG_THRESHOLD = 0.75

# Minimum statewide case count to trigger any elevated signal.
# Avoids false alarms on diseases with tiny absolute numbers.
MIN_CASES_FOR_WATCH = {
    "default": 20,
    "lyme-disease": 500,
    "campylobacteriosis": 200,
    "gonorrhea": 500,
    "chlamydia": 1000,
}

# ── Core logic ────────────────────────────────────────────────────────────────

def in_season(slug: str, month: int) -> bool:
    season = DISEASE_SEASONS.get(slug, YEAR_ROUND)
    return month in season


def statewide_level(slug: str, cases_2024: int, baseline: int | None, month: int) -> tuple[str, str]:
    """
    Returns (level, note) for a Tier B disease at the statewide level.
    level: 'low' | 'watch' | 'moderate' | 'high'
    note: human-readable explanation
    """
    if not in_season(slug, month):
        season_name = season_label(slug)
        return "low", f"Out of season. {season_name} activity expected."

    if baseline is None or baseline == 0:
        return "low", f"{cases_2024:,} cases reported in 2024. No historical baseline available for comparison."

    ratio = cases_2024 / baseline
    min_cases = MIN_CASES_FOR_WATCH.get(slug, MIN_CASES_FOR_WATCH["default"])

    # Travel-associated diseases: add context even when statistically elevated
    TRAVEL_ASSOCIATED = {"malaria", "dengue-fever", "chikungunya", "typhoid-fever", "amebiasis"}
    travel_note = " All cases in NYS are travel-associated; no local mosquito transmission." if slug in TRAVEL_ASSOCIATED else ""

    if cases_2024 < min_cases:
        return "low", f"{cases_2024:,} cases in 2024 (baseline: ~{baseline:,}). Low absolute count.{travel_note}"

    if ratio >= RATIO_MODERATE:
        return "moderate", (
            f"{cases_2024:,} cases in 2024 — {ratio:.1f}× the 5-year baseline of ~{baseline:,}. "
            f"Significantly elevated.{travel_note}"
        )
    elif ratio >= RATIO_WATCH:
        return "watch", (
            f"{cases_2024:,} cases in 2024 — {ratio:.1f}× the 5-year baseline of ~{baseline:,}. "
            f"Above baseline.{travel_note}"
        )
    else:
        return "low", (
            f"{cases_2024:,} cases in 2024 — near the 5-year baseline of ~{baseline:,}.{travel_note}"
        )


def county_level_for_disease(
    slug: str,
    statewide_lv: str,
    county_cases: int | None,
    statewide_cases: int,
    statewide_pop: int,
    county_pop: int,
) -> str:
    """
    Given a statewide-elevated disease, decide if a specific county is elevated.
    Returns the county-level threat for this disease.
    """
    if statewide_lv == "low":
        return "low"

    if county_cases is None or county_cases == 0:
        return "low"

    # Per-capita rates per 100k
    if statewide_pop == 0 or county_pop == 0:
        return statewide_lv

    statewide_rate = (statewide_cases / statewide_pop) * 100_000
    county_rate    = (county_cases    / county_pop)    * 100_000

    if county_rate >= statewide_rate * COUNTY_FLAG_THRESHOLD:
        return statewide_lv
    return "low"


def season_label(slug: str) -> str:
    season = DISEASE_SEASONS.get(slug, YEAR_ROUND)
    if season == TICK_SEASON:
        return "Tick season (April–October)."
    if season == MOSQUITO_SEASON:
        return "Mosquito season (June–October)."
    if season == SUMMER_SEASON:
        return "Summer season (May–October)."
    if season == WINTER_SEASON:
        return "Winter respiratory season (November–April)."
    return "Year-round disease."


def action_item_for(slug: str, level: str) -> str:
    """Returns a short actionable recommendation based on disease + level."""
    ACTIONS = {
        "lyme-disease":    "Do a full-body tick check after every outdoor activity.",
        "anaplasmosis":    "Use tick repellent; see a doctor for fever after a tick bite.",
        "babesiosis":      "Use tick repellent; seek care for fever if immunocompromised.",
        "ehrlichiosis":    "Use tick repellent; seek care for fever after a tick bite.",
        "rocky-mountain-spotted-fever": "Use tick repellent; seek urgent care for fever + rash.",
        "west-nile-virus": "Use mosquito repellent; avoid outdoor activity at dusk and dawn.",
        "west-nile-fever": "Use mosquito repellent; eliminate standing water around your home.",
        "campylobacteriosis": "Cook poultry to 165°F; wash hands after handling raw meat.",
        "salmonellosis":   "Cook eggs and poultry thoroughly; refrigerate food promptly.",
        "shigellosis":     "Wash hands thoroughly; avoid sharing food with infected individuals.",
        "e-coli-stec":     "Cook ground beef to 160°F; avoid unpasteurized juices.",
        "cryptosporidiosis":"Avoid swallowing water when swimming; wash hands after animal contact.",
        "giardiasis":      "Drink treated or boiled water when hiking; wash hands after soil contact.",
        "legionellosis":   "Building owners: inspect and maintain water systems per ASHRAE 188.",
        "pertussis":       "Verify Tdap vaccination; isolate if cough develops.",
        "gonorrhea":       "Get tested regularly if sexually active; use condoms.",
        "chlamydia":       "Get tested annually if sexually active under 25.",
        "syphilis-early":  "Get tested regularly if sexually active; notify partners if positive.",
        "tuberculosis":    "Get tested if you are at high risk or have had recent exposure.",
        "measles":         "Verify MMR vaccination status immediately.",
        "botulism":        "Avoid home-canned foods; seek immediate care for muscle weakness.",
        "tularemia":       "Use insect repellent; wear gloves when handling wild animals.",
        "candida-auris":   "Healthcare facilities: follow CDC infection control protocols.",
        "mpox":            "JYNNEOS vaccine available if high-risk; avoid skin-to-skin contact with rash.",
    }
    default = "Stay informed. Follow NYSDOH guidance if you are at elevated risk."
    return ACTIONS.get(slug, default)


# ── Main ──────────────────────────────────────────────────────────────────────

def main():
    parser = argparse.ArgumentParser(description="Compute NY Health Watch disease threat levels")
    parser.add_argument("--month", type=int, help="Override current month (1-12)")
    parser.add_argument("--dry-run", action="store_true", help="Print results without writing files")
    args = parser.parse_args()

    month = args.month if args.month else datetime.date.today().month
    month_name = datetime.date(2000, month, 1).strftime("%B")
    print(f"\n=== compute_levels.py  |  month={month} ({month_name}) ===\n")

    # ── Load data ──────────────────────────────────────────────────────────────
    with open(ANNUAL_CASES_FILE)   as f: annual   = json.load(f)
    with open(BASELINES_FILE)      as f: baselines = json.load(f)
    with open(ACTIVITY_FILE)       as f: activity  = json.load(f)
    with open(COUNTY_THREATS_FILE) as f: threats   = json.load(f)

    by_county      = annual.get("byCounty", {})
    nys_total      = annual.get("nysTotal", {})
    nys_excl_nyc   = annual.get("nysExclNYC", {})
    nyc_fips_list  = set(annual.get("nycBoroughFips", []))

    # NYC combined population
    nyc_pop = sum(COUNTY_POP.get(f, 0) for f in NYC_FIPS)
    nys_excl_nyc_pop = sum(p for f, p in COUNTY_POP.items() if f not in NYC_FIPS)
    nys_total_pop = nyc_pop + nys_excl_nyc_pop

    # ── Tier B: compute statewide levels first ─────────────────────────────────
    tier_b_slugs = [k for k in baselines if not k.startswith("_") and k not in TIER_A and k not in TIER_C]

    statewide_levels: dict[str, str] = {}
    print("── Tier B statewide signals ──")

    for slug in sorted(tier_b_slugs):
        # Use NYS total for statewide comparison
        cases_2024 = nys_total.get(slug) or nys_excl_nyc.get(slug) or 0
        baseline   = baselines.get(slug)

        level, note = statewide_level(slug, cases_2024, baseline, month)
        statewide_levels[slug] = level

        if level != "low":
            print(f"  {level.upper():8s}  {slug}  ({cases_2024:,} vs baseline ~{baseline:,})")

        # Build the activity entry — preserve Tier A entries
        if slug not in TIER_A:
            existing = activity.get(slug, {})
            activity[slug] = {
                "level":           level,
                "trend":           existing.get("trend", "stable"),
                "note":            note,
                "dataSourceLabel": "NYSDOH Annual Communicable Disease Report 2024 + 5-yr baseline",
                "annualCases2024": cases_2024,
                "baseline5yr":     baseline,
                "inSeason":        in_season(slug, month),
            }

    # ── Tier C: PRESERVE existing entries — do NOT flag from historical annual data ──
    # Annual report data is historical (e.g. 2024 tularemia cases).
    # Tier C alerts come from CURRENT outbreak declarations written by fetch_weekly.py
    # or the operator manually. compute_levels.py carries those entries forward unchanged.
    tier_c_county_flags: dict[str, dict[str, str]] = {slug: {} for slug in TIER_C}
    print("\n── Tier C (preserving existing flags from manual/weekly sources) ──")

    for slug in TIER_C:
        existing = activity.get(slug, {})
        existing_level = existing.get("level", "low")
        cases_2024 = nys_total.get(slug, 0) or 0

        if existing_level != "low":
            # Active outbreak — preserve flags and read county-level data from old threats file
            print(f"  {existing_level.upper():8s}  {slug}  (active — preserved from manual/weekly source)")
            for fips, county_data in threats.items():
                for t in county_data.get("activeThreats", []):
                    if t.get("diseaseSlug") == slug:
                        tier_c_county_flags[slug][fips] = t.get("level", "high")
            # Keep existing activity entry as-is
        else:
            # No active outbreak — write informational low entry
            activity[slug] = {
                "level":           "low",
                "trend":           "stable",
                "note":            (
                    f"No current outbreak declared. {cases_2024} case(s) recorded in 2024 "
                    f"(historical). Zero-tolerance monitoring active — any confirmed case triggers an alert."
                ),
                "dataSourceLabel": "NYSDOH manual monitoring + annual report 2024",
                "annualCases2024": cases_2024,
            }

    # ── Build county-threats.json ──────────────────────────────────────────────
    print("\n── Building county threats ──")

    LEVEL_ORDER = {"high": 3, "moderate": 2, "watch": 1, "low": 0}

    new_threats: dict = {}

    for fips in sorted(COUNTY_NAMES.keys()):
        county_disease_levels: dict[str, str] = {}
        county_cases_row = by_county.get(fips, {})
        is_nyc = fips in NYC_FIPS

        # ── Tier B: flag counties above per-capita threshold ──
        for slug in tier_b_slugs:
            sw_level = statewide_levels.get(slug, "low")
            if sw_level == "low":
                continue
            if not in_season(slug, month):
                continue

            if is_nyc:
                # NYC counties: use the combined NYC per-capita rate
                nyc_cases = annual.get("nycTotal", {}).get(slug, 0) or 0
                lv = county_level_for_disease(
                    slug, sw_level, nyc_cases,
                    nys_excl_nyc.get(slug, 0) or 0,
                    nys_excl_nyc_pop, nyc_pop
                )
            else:
                county_cases_val = county_cases_row.get(slug, 0) or 0
                nys_cases_excl   = nys_excl_nyc.get(slug, 0) or 0
                lv = county_level_for_disease(
                    slug, sw_level, county_cases_val,
                    nys_cases_excl, nys_excl_nyc_pop,
                    COUNTY_POP.get(fips, 1)
                )

            if lv != "low":
                county_disease_levels[slug] = lv

        # ── Tier C: direct county flag ──
        for slug in TIER_C:
            if fips in tier_c_county_flags.get(slug, {}):
                county_disease_levels[slug] = "high"

        # ── Build active threats list ──
        active_threats = []
        for slug, lv in sorted(
            county_disease_levels.items(),
            key=lambda x: (-LEVEL_ORDER.get(x[1], 0), x[0])
        ):
            disease_name = slug.replace("-", " ").title()
            # Try to get a friendly name from the activity data
            act_note = activity.get(slug, {}).get("note", "")
            # Truncate note to first sentence for the overlay
            short_note = act_note.split(".")[0] + "." if act_note else ""

            active_threats.append({
                "diseaseName":  disease_name,
                "diseaseSlug":  slug,
                "level":        lv,
                "note":         short_note,
                "actionItem":   action_item_for(slug, lv),
            })

        # ── County overall threat = highest disease level ──
        if active_threats:
            county_threat = max(active_threats, key=lambda t: LEVEL_ORDER.get(t["level"], 0))["level"]
        else:
            county_threat = "low"

        new_threats[fips] = {
            "threatLevel":  county_threat,
            "activeThreats": active_threats,
            "lastUpdated":  datetime.date.today().isoformat(),
        }

        if county_threat != "low":
            diseases_str = ", ".join(f"{t['diseaseSlug']}({t['level']})" for t in active_threats)
            print(f"  {county_threat.upper():8s}  {COUNTY_NAMES.get(fips, fips):15s} — {diseases_str}")

    # ── Update metadata ────────────────────────────────────────────────────────
    with open(METADATA_FILE) as f:
        metadata = json.load(f)

    now_iso = datetime.datetime.now(datetime.timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ")
    metadata["lastUpdated"]   = now_iso
    metadata["sitewideNote"]  = f"Data updated {datetime.date.today().strftime('%B %-d, %Y')}"
    metadata.setdefault("sources", {})["compute_levels"] = {
        "lastRun": now_iso,
        "month":   month,
    }

    # ── Write outputs ──────────────────────────────────────────────────────────
    if args.dry_run:
        print("\n[dry-run] Skipping file writes.")
    else:
        with open(ACTIVITY_FILE, "w")       as f: json.dump(activity,    f, indent=2)
        with open(COUNTY_THREATS_FILE, "w") as f: json.dump(new_threats, f, indent=2)
        with open(METADATA_FILE, "w")       as f: json.dump(metadata,    f, indent=2)
        print(f"\n✓ Wrote {ACTIVITY_FILE.name}")
        print(f"✓ Wrote {COUNTY_THREATS_FILE.name}")
        print(f"✓ Wrote {METADATA_FILE.name}")

    print(f"\n=== Done. {sum(1 for v in new_threats.values() if v['threatLevel'] != 'low')} counties elevated. ===\n")


if __name__ == "__main__":
    main()
