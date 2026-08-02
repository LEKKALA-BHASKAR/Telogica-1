# Investor documents

PDFs dropped in this folder are served directly at:

```
https://telogica.com/images/pdf/<filename>.pdf
```

## Publishing a document

1. Copy the PDF here.
2. Register it in [`src/lib/investor-documents.ts`](../../../src/lib/investor-documents.ts)
   under `investorDocuments`, with the exact filename:

   ```ts
   {
     title: "Annual Report",
     section: "annual-reports",
     period: "FY 2025-26",
     file: "AnnualReport_2025-2026.pdf",
     date: "2026-07-31",       // optional, controls ordering
   }
   ```

The Investors page picks it up automatically — link, file size and last-modified
date are all derived from the file itself.

## Filename rules

- **No spaces.** `AR 2025-26.pdf` becomes `AR%202025-26.pdf` in the URL, which
  reads badly in search results, emails and BSE filings.
- Use underscores or hyphens: `AnnualReport_2025-2026.pdf`,
  `ShareholdingPattern_Q1_FY2025-26.pdf`.
- ASCII only. Keep the `.pdf` extension lowercase.
- Filenames are public and permanent — once a link is filed with an exchange or
  emailed to shareholders, renaming it breaks that link.

## Changing the URL path

The path is defined once, as `PDF_BASE` in `src/lib/investor-documents.ts`.
Change it there and move this folder to match; every link on the site follows.

## Notes

- The build fails if a registered `file` is missing from this folder, so a typo
  or a forgotten upload is caught before it reaches production.
- Documents hosted elsewhere (e.g. on BSE) can use `url:` instead of `file:` and
  need nothing in this folder.
- These PDFs are committed to the repository and deployed as static assets.
  Keep an eye on repo size if you are publishing many large scanned reports.
