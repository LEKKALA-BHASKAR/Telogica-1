import bseData from "@/data/bse.json";

export interface BseAnnouncement {
  date: string;
  category: string;
  subcategory: string;
  headline: string;
  pdf: string;
  sizeKb: number | null;
}

export interface BseData {
  scrip: string;
  fetchedAt: string;
  quote: {
    name: string;
    scrip: string;
    category: string;
    bseUrl: string;
    ltp: string | null;
    chg: string | null;
    pcChg: string | null;
    prevClose: string | null;
    open: string | null;
    high: string | null;
    low: string | null;
  };
  company: {
    isin: string | null;
    faceValue: string | null;
    industry: string | null;
    sector: string | null;
    group: string | null;
    eps: string | null;
    pe: string | null;
    pb: string | null;
    roe: string | null;
    npm: string | null;
    opm: string | null;
  };
  announcements: BseAnnouncement[];
}

export const bse = bseData as BseData;

/** Friendly LODR filing groups mapped from BSE category names. */
export const filingGroups: { label: string; match: (c: string) => boolean }[] = [
  { label: "Financial Results", match: (c) => c === "Result" },
  { label: "Board Meetings", match: (c) => c === "Board Meeting" },
  { label: "AGM / EGM", match: (c) => c === "AGM/EGM" },
  { label: "Insider Trading / SAST", match: (c) => c === "Insider Trading / SAST" },
  { label: "Corporate Actions", match: (c) => c.replace(".", "").trim() === "Corp Action" },
  {
    label: "Company Updates",
    match: (c) =>
      c === "Company Update" || c === "Integrated Filing" || c === "Others",
  },
];

export function groupOf(category: string): string {
  const g = filingGroups.find((g) => g.match(category));
  return g ? g.label : "Company Updates";
}
