/**
 * Verifies every document registered in `src/lib/investor-documents.ts` with a
 * `file:` actually exists in `public/images/pdf/`, and warns about PDFs sitting
 * in that folder that no page links to.
 *
 * Runs as part of `npm run build`. A dead link on an investor-relations page is
 * a compliance problem, not a cosmetic one, so a missing file fails the build.
 */
import { readFileSync, existsSync, readdirSync } from "node:fs";
import path from "node:path";

const root = process.cwd();
const source = path.join(root, "src/lib/investor-documents.ts");
const src = readFileSync(source, "utf8");

const PDF_BASE = src.match(/export const PDF_BASE = "([^"]+)"/)?.[1];
if (!PDF_BASE) {
  console.error("✖ Could not read PDF_BASE from src/lib/investor-documents.ts");
  process.exit(1);
}
const dir = path.join(root, "public", PDF_BASE.replace(/^\//, ""));

// Only the `investorDocuments` array — `PDF_DIR` and docs in comments are not
// registrations and must not be picked up.
const arrayBody = src.split("export const investorDocuments")[1] ?? "";
const registered = [...arrayBody.matchAll(/^\s*file:\s*"([^"]+)"/gm)].map((m) => m[1]);

const missing = registered.filter((f) => !existsSync(path.join(dir, f)));

const onDisk = existsSync(dir)
  ? readdirSync(dir).filter((f) => f.toLowerCase().endsWith(".pdf"))
  : [];
const orphans = onDisk.filter((f) => !registered.includes(f));

if (missing.length) {
  console.error(`\n✖ Investor documents registered but not found in ${PDF_BASE}/:`);
  for (const f of missing) console.error(`    ${f}`);
  console.error("\n  Upload the file, or remove its entry from investorDocuments.\n");
  process.exit(1);
}

if (orphans.length) {
  console.warn(`\n⚠ PDFs in ${PDF_BASE}/ that no page links to:`);
  for (const f of orphans) console.warn(`    ${f}`);
  console.warn("  Add them to investorDocuments to publish them.\n");
}

console.log(
  `✓ Investor documents: ${registered.length} registered, all present in ${PDF_BASE}/`
);
