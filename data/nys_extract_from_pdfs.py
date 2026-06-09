#!/usr/bin/env python3
"""NYS Communicable Disease annual reports (2014-2024) -> JSON.
Usage:  pip install pdfplumber
        python3 nys_extract_from_pdfs.py [folder_with_YYYY_pdfs]   (default: current dir)
Numbers are read by column x-position (immune to the text-flattening digit-merges);
column names are read from the header rows with wrap-hyphens kept (e.g. CAMPYLO-BACTERIOSIS).
Each year is validated to 58 rows (57 counties + the merged NYC row); state-total rows excluded.
"""
import sys, os, json, statistics, re
import pdfplumber
PDFDIR = sys.argv[1] if len(sys.argv)>1 else "."
import pdfplumber, re
from collections import Counter

COUNTIES = ["ALBANY","ALLEGANY","BROOME","CATTARAUGUS","CAYUGA","CHAUTAUQUA","CHEMUNG","CHENANGO",
"CLINTON","COLUMBIA","CORTLAND","DELAWARE","DUTCHESS","ERIE","ESSEX","FRANKLIN","FULTON","GENESEE",
"GREENE","HAMILTON","HERKIMER","JEFFERSON","LEWIS","LIVINGSTON","MADISON","MONROE","MONTGOMERY",
"NASSAU","NIAGARA","ONEIDA","ONONDAGA","ONTARIO","ORANGE","ORLEANS","OSWEGO","OTSEGO","PUTNAM",
"RENSSELAER","ROCKLAND","ST LAWRENCE","SARATOGA","SCHENECTADY","SCHOHARIE","SCHUYLER",
"SENECA","STEUBEN","SUFFOLK","SULLIVAN","TIOGA","TOMPKINS","ULSTER","WARREN","WASHINGTON","WAYNE",
"WESTCHESTER","WYOMING","YATES"]
CSET=set(COUNTIES)
def norm(n): return re.sub(r'\s+',' ',n.upper().replace('.','')).strip()

NUM=re.compile(r'\d+')
def classify(t):
    s=t.rstrip('*')                      # strip footnote markers
    if re.fullmatch(r'\d+',s): return ('num', int(s))
    if t in ('NA','N/A') or re.fullmatch(r'N/?A',t): return ('null', None)
    return ('text', None)

def page_rows(page):
    words=list(page.extract_words(use_text_flow=False, keep_blank_chars=False))
    words.sort(key=lambda w:(w['top'], w['x0']))
    clusters=[]; cur=[]; cy=None
    for w in words:
        if cy is None or abs(w['top']-cy)<=5:
            cur.append(w); cy=w['top'] if cy is None else cy
        else:
            clusters.append(cur); cur=[w]; cy=w['top']
    if cur: clusters.append(cur)
    rows=[]
    for cl in clusters:
        cl.sort(key=lambda w:w['x0'])
        name=[]; vals=[]; started=False
        for w in cl:
            kind,val=classify(w['text'])
            if not started:
                if kind in ('num','null'):
                    started=True; vals.append((w['x0'],val))
                else:
                    name.append(w['text'])
            else:
                if kind in ('num','null'):
                    vals.append((w['x0'],val))
                else:
                    break  # legend text
        rows.append((' '.join(name).strip(), [v for _,v in vals], [x for x,_ in vals]))
    return rows

def get_data_rows(page):
    out=[]
    for nm,vals,xs in page_rows(page):
        n=norm(nm)
        if n in CSET or re.fullmatch(r'NYC\*+',n):
            label = n if n in CSET else 'NYC'+'*'*(len(n)-3)
            out.append((n if n in CSET else nm.strip(), vals, xs))
    return out

import statistics, re
TITLEKEYS={'COMMUNICABLE','REPORTED','STATE'}
DISP={c:c.title() for c in COUNTIES}
DISP['ST LAWRENCE']='St. Lawrence'

def join_tokens(toks):
    s=''
    for t in toks:
        if not s: s=t
        elif s.endswith('-'): s=s+t          # wrap hyphen kept: CAMPYLO-BACTERIOSIS
        else: s=s+' '+t
    return s

def page_headers(pg, centers):
    words=list(pg.extract_words())
    dtop=min(w['top'] for w in words if w['text']=='ALBANY')
    words=[w for w in words if w['top']<dtop-1]
    words.sort(key=lambda w:w['top'])
    clusters=[];cur=[];cy=None
    for w in words:
        if cy is None or abs(w['top']-cy)<=4: cur.append(w)
        else: clusters.append(cur);cur=[w]
        cy=w['top']
    if cur:clusters.append(cur)
    keep=[w for cl in clusters if not any(t['text'] in TITLEKEYS for t in cl) for w in cl]
    buckets={i:[] for i in range(len(centers))}
    for w in keep:
        xc=(w['x0']+w['x1'])/2
        i=min(range(len(centers)),key=lambda k:abs(centers[k]-xc))
        if abs(centers[i]-xc)<55: buckets[i].append((round(w['top']),w['x0'],w['text']))
    return [join_tokens([t for _,_,t in sorted(b)]) for b in (buckets[i] for i in range(len(centers)))]

def extract_year_path(path):
    pdf=pdfplumber.open(path)
    columns=[]; data={}; nyc_label=None
    for pg in pdf.pages:
        dr=get_data_rows(pg)
        if not dr: continue
        centers=[statistics.median(c) for c in zip(*[xs for _,_,xs in dr])]
        hdrs=page_headers(pg,centers)
        columns+=hdrs
        for name,vals,xs in dr:
            up=name.upper()
            if up in DISP: key=DISP[up]
            elif up.startswith('NYC'):
                if nyc_label is None: nyc_label=name.strip()
                key=nyc_label
            else: continue
            d=data.setdefault(key,{})
            for h,v in zip(hdrs,vals): d[h]=v
    return columns,data


DISP={c:c.title() for c in COUNTIES}; DISP["ST LAWRENCE"]="St. Lawrence"
if __name__=="__main__":
    blocks=[]; combined={}
    for yr in range(2014,2025):
        path=os.path.join(PDFDIR,f"{yr}.pdf")
        if not os.path.exists(path):
            print("skip (not found):",path); continue
        cols,data=extract_year_path(path)
        assert len(data)==58, f"{yr}: {len(data)} rows"
        obj={"report_year":yr,"disease_columns":cols,"data":data,
             "notes":"Numbers extracted positionally from the PDF; NYC row merged across pages; null = N/A/suppressed or not collected."}
        combined[str(yr)]=obj
        blocks.append(f"=== {yr} ===\n"+json.dumps(obj,separators=(",",":")))
        print(f"{yr}: {len(cols)} cols, {len(data)} rows OK")
    open("nys_cd_blocks.txt","w").write("\n\n".join(blocks)+"\n")
    json.dump(combined,open("nys_cd.json","w"),separators=(",",":"))
    print("wrote nys_cd_blocks.txt and nys_cd.json")
