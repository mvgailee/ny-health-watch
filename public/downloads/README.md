# NY Health Watch — Public Dataset

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
