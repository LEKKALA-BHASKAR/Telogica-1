import { statSync } from "node:fs";
import path from "node:path";
import { Reveal } from "./Reveal";
import {
  PDF_DIR,
  documentHref,
  groupedDocuments,
  isLocalDocument,
  type InvestorDocument,
} from "@/lib/investor-documents";
import { FileText, ArrowUpRight, Warning } from "./Icons";

/**
 * Server component — reads the PDF directory directly, so file size and
 * last-modified date never have to be maintained by hand alongside the upload.
 *
 * The Investors page is statically generated, so these stats run at build time
 * and a missing file is caught before deploy rather than 404-ing a shareholder.
 */

function fileMeta(doc: InvestorDocument): { size: string; modified: string } | null {
  if (!isLocalDocument(doc) || !doc.file) return null;
  try {
    const s = statSync(path.join(process.cwd(), PDF_DIR, doc.file));
    const mb = s.size / 1024 / 1024;
    return {
      size: mb >= 1 ? `${mb.toFixed(1)} MB` : `${Math.max(1, Math.round(s.size / 1024))} KB`,
      modified: s.mtime.toISOString().slice(0, 10),
    };
  } catch {
    // Registered but not uploaded. Surfaced in the UI and failed in the build
    // check below rather than silently rendering a dead link.
    return null;
  }
}

function fmtDate(iso: string) {
  return new Date(`${iso}T00:00:00`).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export function InvestorDocuments() {
  const groups = groupedDocuments();
  const total = groups.reduce((n, g) => n + g.docs.length, 0);

  return (
    <div className="space-y-10">
      <p className="text-sm text-fog">
        {total} document{total === 1 ? "" : "s"} published. Filings are added as they are
        submitted to the exchange.
      </p>

      {groups.map((g, gi) => (
        <Reveal key={g.section.key} delay={(gi % 4) * 0.04}>
          <section aria-labelledby={`docs-${g.section.key}`}>
            <div className="flex flex-wrap items-baseline justify-between gap-2 border-b border-line pb-3">
              <h3
                id={`docs-${g.section.key}`}
                className="font-display text-lg font-bold text-white"
              >
                {g.section.label}
              </h3>
              <span className="text-xs font-semibold uppercase tracking-wider text-fog-dim">
                {g.docs.length || "No"} document{g.docs.length === 1 ? "" : "s"}
              </span>
            </div>
            <p className="mt-2 text-sm text-fog">{g.section.blurb}</p>

            {g.docs.length ? (
              <ul className="mt-5 grid gap-3 sm:grid-cols-2">
                {g.docs.map((doc) => {
                  const href = documentHref(doc)!;
                  const meta = fileMeta(doc);
                  const external = !isLocalDocument(doc);
                  const missing = isLocalDocument(doc) && !meta;
                  return (
                    <li key={`${doc.section}-${doc.title}-${doc.file ?? doc.url}`}>
                      <a
                        href={href}
                        // Local PDFs open in a new tab so the shareholder does
                        // not lose the filings page they were working through.
                        target="_blank"
                        rel={external ? "noopener noreferrer" : "noopener"}
                        className="group flex h-full items-start gap-3.5 rounded-2xl border border-line bg-base-800 p-5 transition-colors hover:border-teal/40"
                      >
                        <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-teal/30 bg-teal/10 text-teal">
                          {missing ? (
                            <Warning className="h-5 w-5 text-amber-400" />
                          ) : (
                            <FileText className="h-5 w-5" />
                          )}
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className="flex items-center gap-1.5 font-semibold text-white">
                            {doc.title}
                            {doc.period && (
                              <span className="text-fog-bright">· {doc.period}</span>
                            )}
                            <ArrowUpRight className="h-3.5 w-3.5 shrink-0 text-fog-dim transition-colors group-hover:text-teal" />
                          </span>
                          <span className="mt-1 block text-xs text-fog-dim">
                            {missing ? (
                              <span className="text-amber-400">File not yet uploaded</span>
                            ) : external ? (
                              "External filing"
                            ) : (
                              <>
                                PDF · {meta!.size}
                                {" · Updated "}
                                {fmtDate(doc.date ?? meta!.modified)}
                              </>
                            )}
                          </span>
                        </span>
                      </a>
                    </li>
                  );
                })}
              </ul>
            ) : (
              <p className="mt-5 rounded-2xl border border-dashed border-line px-5 py-8 text-center text-sm text-fog-dim">
                Documents for this section will be published here.
              </p>
            )}
          </section>
        </Reveal>
      ))}
    </div>
  );
}
