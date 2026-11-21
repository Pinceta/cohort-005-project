// Fails when the staged .oxlintrc.json exempts a file from a size rule that
// the base ref does not. The exemption lists only get shorter: a new file,
// or a file at a new path, starts out inside the limits.
// Usage: tsx scripts/check-lint-exemptions.ts [base ref, default HEAD]

import { execFileSync } from "node:child_process";
import { addedExemptions, parseOxlintConfig } from "./lint-exemptions";

const base = process.argv[2] ?? "HEAD";

const show = (spec: string): string | undefined => {
  try {
    return execFileSync("git", ["show", spec], {
      encoding: "utf8",
      stdio: ["ignore", "pipe", "ignore"],
    });
  } catch {
    return undefined;
  }
};

const before = show(`${base}:.oxlintrc.json`);
const after = show(":.oxlintrc.json");

// No base (the first commit) or no config: nothing to compare.
if (before === undefined || after === undefined) process.exit(0);

const added = addedExemptions(
  parseOxlintConfig(before),
  parseOxlintConfig(after)
);

if (added.length > 0) {
  console.error(
    `.oxlintrc.json exempts these files from a size rule, and ${base} does not:\n`
  );
  for (const { rule, file } of added) console.error(`  ${rule}: ${file}`);
  console.error(`
Take these entries out of .oxlintrc.json, then make each file pass the rule:
- max-lines-per-function: extract parts of the long function into smaller,
  named functions.
- max-depth: return early, or extract the inner blocks into functions.
- max-params: pass one object in place of the long parameter list.
- max-lines: split the file. See the help from check-file-tokens.js.

This applies to code you only moved, too. A file at a new path starts out
inside the limits, so a move is the time to pay the debt.

Run \`npm run lint:oxlint\` to see what is left, then commit again.`);
  process.exit(1);
}
