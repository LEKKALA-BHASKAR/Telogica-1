#!/usr/bin/env python3
"""Pull Telogica's public BSE (LODR) disclosures into src/data/bse.json.

Scrip code 532975. Uses BSE's open endpoints (the same ones bseindia.com calls):
  - getScripHeaderData  -> live quote
  - ComHeadernew        -> company fundamentals / ISIN
  - AnnSubCategoryGetData -> corporate announcements (Reg 30 / 33 / 31 / 7 etc.)

Static site: run at build time, bundle the JSON, render statically. Re-run to
refresh. Attachment PDFs live on bseindia.com; we link to them directly.
"""
import json, os, sys, time, urllib.request, urllib.parse
from datetime import datetime, timezone

SCRIP = "532975"
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(ROOT, "src", "data", "bse.json")
BASE = "https://api.bseindia.com/BseIndiaAPI/api"
ATTACH = "https://www.bseindia.com/xml-data/corpfiling/AttachLive/"
HEADERS = {
    "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 "
                  "(KHTML, like Gecko) Chrome/124.0 Safari/537.36",
    "Referer": "https://www.bseindia.com/",
    "Origin": "https://www.bseindia.com",
    "Accept": "application/json, text/plain, */*",
}

def get(url):
    req = urllib.request.Request(url, headers=HEADERS)
    with urllib.request.urlopen(req, timeout=40) as r:
        return json.loads(r.read().decode("utf-8", "replace"))

def clean(s):
    return (s or "").replace("''", "'").replace("\r", " ").replace("\n", " ").strip()

def fetch_quote():
    d = get(f"{BASE}/getScripHeaderData/w?Debtflag=&scripcode={SCRIP}&seriesid=")
    c, h = d.get("CurrRate", {}), d.get("Header", {})
    name = d.get("Cmpname", {})
    return {
        "name": name.get("FullN", "Telogica Ltd"),
        "scrip": SCRIP,
        "category": name.get("Category", ""),
        "bseUrl": "https://www.bseindia.com" + (name.get("SEOUrlEQ") or f"/stock-share-price/telogica-ltd/telogica/{SCRIP}/"),
        "ltp": c.get("LTP"), "chg": c.get("Chg"), "pcChg": c.get("PcChg"),
        "prevClose": h.get("PrevClose"), "open": h.get("Open"),
        "high": h.get("High"), "low": h.get("Low"),
    }

def fetch_company():
    d = get(f"{BASE}/ComHeadernew/w?quotetype=EQ&scripcode={SCRIP}&seriesid=")
    return {
        "isin": d.get("ISIN"), "faceValue": d.get("FaceVal"),
        "industry": clean(d.get("Industry")), "sector": d.get("Sector"),
        "group": d.get("Group"), "eps": d.get("EPS"), "pe": d.get("PE"),
        "pb": d.get("PB"), "roe": d.get("ROE"), "npm": d.get("NPM"), "opm": d.get("OPM"),
    }

def fetch_announcements(max_pages=6):
    rows, seen = [], set()
    for page in range(1, max_pages + 1):
        q = urllib.parse.urlencode({
            "pageno": page, "strCat": "-1", "strPrevDate": "20200101",
            "strScrip": SCRIP, "strSearch": "P", "strToDate": "20301231",
            "strType": "C", "subcategory": "-1",
        })
        try:
            d = get(f"{BASE}/AnnSubCategoryGetData/w?{q}")
        except Exception as e:
            print(f"  page {page} error: {e}", file=sys.stderr); break
        table = d.get("Table") if isinstance(d, dict) else None
        if not table:
            break
        for r in table:
            nid = r.get("NEWSID")
            if nid in seen:
                continue
            seen.add(nid)
            att = (r.get("ATTACHMENTNAME") or "").strip()
            rows.append({
                "date": (r.get("NEWS_DT") or "")[:10],
                "category": clean(r.get("CATEGORYNAME")) or "Other",
                "subcategory": clean(r.get("SUBCATNAME")),
                "headline": clean(r.get("HEADLINE")) or clean(r.get("NEWSSUB")),
                "pdf": ATTACH + att if att else "",
                "sizeKb": round(float(r.get("Fld_Attachsize") or 0) / 1024) or None,
            })
        time.sleep(0.4)
    rows.sort(key=lambda x: x["date"], reverse=True)
    return rows

def main():
    print("Fetching BSE data for scrip", SCRIP, "…")
    data = {
        "scrip": SCRIP,
        "fetchedAt": datetime.now(timezone.utc).strftime("%Y-%m-%d %H:%M UTC"),
        "quote": fetch_quote(),
        "company": fetch_company(),
        "announcements": fetch_announcements(),
    }
    json.dump(data, open(OUT, "w"), indent=2)
    print(f"  quote LTP: {data['quote']['ltp']}  ISIN: {data['company']['isin']}")
    print(f"  announcements: {len(data['announcements'])}")
    print("Wrote", OUT)

if __name__ == "__main__":
    main()
