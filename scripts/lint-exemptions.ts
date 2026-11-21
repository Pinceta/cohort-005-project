import ts from "typescript";
import { z } from "zod";

// The oxlint rules that limit how big code can get. An override that turns
// one off for a file is an exemption.
const SIZE_RULES = [
  "max-lines",
  "max-lines-per-function",
  "max-params",
  "max-depth",
];

const oxlintConfigSchema = z.object({
  overrides: z
    .array(
      z.object({
        files: z.array(z.string()),
        rules: z.record(z.unknown()).default({}),
      })
    )
    .default([]),
});

type OxlintConfig = z.infer<typeof oxlintConfigSchema>;

export type Exemption = { rule: string; file: string };

// .oxlintrc.json has comments, so JSON.parse cannot read it.
export function parseOxlintConfig(text: string): OxlintConfig {
  const { config, error } = ts.parseConfigFileTextToJson(
    ".oxlintrc.json",
    text
  );
  if (error) {
    throw new Error(ts.flattenDiagnosticMessageText(error.messageText, "\n"));
  }
  return oxlintConfigSchema.parse(config);
}

export function listExemptions(config: OxlintConfig): Exemption[] {
  return config.overrides.flatMap(({ files, rules }) =>
    SIZE_RULES.filter((rule) => rules[rule] === "off").flatMap((rule) =>
      files.map((file) => ({ rule, file }))
    )
  );
}

export function addedExemptions(
  before: OxlintConfig,
  after: OxlintConfig
): Exemption[] {
  const key = ({ rule, file }: Exemption) => `${rule} ${file}`;
  const existing = new Set(listExemptions(before).map(key));
  return listExemptions(after).filter(
    (exemption) => !existing.has(key(exemption))
  );
}
