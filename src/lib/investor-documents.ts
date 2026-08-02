/**
 * Investor document library.
 *
 * ─── How to publish a document ──────────────────────────────────────────────
 * 1. Drop the PDF into `public/images/pdf/`.
 * 2. Add an entry to `investorDocuments` below with its exact `file` name.
 *
 * The public URL is derived, never hand-written:
 *     public/images/pdf/AnnualReport_2025-2026.pdf
 *       → https://telogica.com/images/pdf/AnnualReport_2025-2026.pdf
 *
 * Change `PDF_BASE` alone to move the whole library to a different path; every
 * link on the site follows. Filenames should avoid spaces and non-ASCII
 * characters — those get percent-encoded in the URL and read badly in search
 * results and email clients.
 *
 * A document may instead carry an absolute `url` (a filing hosted on BSE, say),
 * in which case nothing needs to live in `public/`.
 */

/** Public path prefix for locally hosted investor PDFs. */
export const PDF_BASE = "/images/pdf";

/** Filesystem directory backing PDF_BASE, relative to the project root. */
export const PDF_DIR = `public${PDF_BASE}`;

export type DocSectionKey =
  | "annual-reports"
  | "financial-results"
  | "shareholding-pattern"
  | "corporate-governance"
  | "announcements"
  | "board-committees"
  | "policies-codes"
  | "investor-grievance";

export interface DocSection {
  key: DocSectionKey;
  label: string;
  blurb: string;
}

/** The eight libraries SEBI LODR expects a listed company to maintain. */
export const docSections: DocSection[] = [
  {
    key: "annual-reports",
    label: "Annual Reports",
    blurb: "Year-wise archive of the statutory annual report and accounts.",
  },
  {
    key: "financial-results",
    label: "Quarterly Financial Results",
    blurb: "Audited and unaudited results filed under Regulation 33.",
  },
  {
    key: "shareholding-pattern",
    label: "Shareholding Pattern",
    blurb: "Quarterly shareholding disclosures filed under Regulation 31.",
  },
  {
    key: "corporate-governance",
    label: "Corporate Governance Reports",
    blurb: "Quarterly governance reports filed under Regulation 27(2).",
  },
  {
    key: "announcements",
    label: "Stock Exchange Announcements & Intimations",
    blurb: "Regulation 30 intimations and corporate announcements.",
  },
  {
    key: "board-committees",
    label: "Board of Directors & Committees",
    blurb: "Board composition, committee constitution and related disclosures.",
  },
  {
    key: "policies-codes",
    label: "Policies & Codes",
    blurb: "Code of Conduct, Insider Trading, Whistle Blower and allied policies.",
  },
  {
    key: "investor-grievance",
    label: "Investor Grievance / Registrar & Transfer Agent",
    blurb: "Grievance redressal, RTA contact details and shareholder services.",
  },
];

export interface InvestorDocument {
  /** Link text. Keep it scannable — the period is rendered separately. */
  title: string;
  section: DocSectionKey;
  /** Financial year or period label, e.g. "FY 2025-26" or "Q1 FY 2025-26". */
  period?: string;
  /** Filename inside `public/images/pdf`. Ignored when `url` is set. */
  file?: string;
  /** Absolute URL, for filings hosted elsewhere (e.g. on BSE). */
  url?: string;
  /** ISO date (YYYY-MM-DD) of filing or publication. Drives ordering. */
  date?: string;
}

/**
 * Published documents. Newest first within each section — `groupedDocuments()`
 * sorts by `date` where present, so adding a dated entry anywhere is fine.
 */
export const investorDocuments: InvestorDocument[] = [
  {
    title: "Annual Report",
    section: "annual-reports",
    period: "FY 2025-26",
    file: "AnnualReport_2025-2026.pdf",
  },
];

/** Resolves a document to its public href. */
export function documentHref(doc: InvestorDocument): string | null {
  if (doc.url) return doc.url;
  if (doc.file) return `${PDF_BASE}/${doc.file}`;
  return null;
}

/** True when the document is served from our own `public/` directory. */
export function isLocalDocument(doc: InvestorDocument): boolean {
  return !doc.url && Boolean(doc.file);
}

/** Documents bucketed by section, newest first, with empty sections retained. */
export function groupedDocuments(): { section: DocSection; docs: InvestorDocument[] }[] {
  return docSections.map((section) => ({
    section,
    docs: investorDocuments
      .filter((d) => d.section === section.key && documentHref(d))
      .sort((a, b) => (b.date ?? "").localeCompare(a.date ?? "")),
  }));
}
