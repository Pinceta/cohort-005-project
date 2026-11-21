import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import {
  addedExemptions,
  listExemptions,
  parseOxlintConfig,
} from "./lint-exemptions";

const config = (overrides: unknown[]) =>
  parseOxlintConfig(JSON.stringify({ overrides }));

describe("addedExemptions", () => {
  it("reports a file that a size rule newly exempts", () => {
    const before = config([
      { files: ["a.ts"], rules: { "max-lines-per-function": "off" } },
    ]);
    const after = config([
      { files: ["a.ts", "b.ts"], rules: { "max-lines-per-function": "off" } },
    ]);

    expect(addedExemptions(before, after)).toEqual([
      { rule: "max-lines-per-function", file: "b.ts" },
    ]);
  });

  it("allows an exemption to be removed", () => {
    const before = config([
      { files: ["a.ts", "b.ts"], rules: { "max-depth": "off" } },
    ]);
    const after = config([{ files: ["a.ts"], rules: { "max-depth": "off" } }]);

    expect(addedExemptions(before, after)).toEqual([]);
  });

  it("reports a file that moved to a new path, because the new path is new", () => {
    const before = config([
      { files: ["routes/lesson.tsx"], rules: { "max-params": "off" } },
    ]);
    const after = config([
      { files: ["modules/lesson/load.ts"], rules: { "max-params": "off" } },
    ]);

    expect(addedExemptions(before, after)).toEqual([
      { rule: "max-params", file: "modules/lesson/load.ts" },
    ]);
  });

  it("reports an existing file that a second size rule now exempts", () => {
    const before = config([{ files: ["a.ts"], rules: { "max-lines": "off" } }]);
    const after = config([
      { files: ["a.ts"], rules: { "max-lines": "off", "max-depth": "off" } },
    ]);

    expect(addedExemptions(before, after)).toEqual([
      { rule: "max-depth", file: "a.ts" },
    ]);
  });

  it("ignores overrides of rules that do not limit size", () => {
    const after = config([{ files: ["a.ts"], rules: { "no-console": "off" } }]);

    expect(addedExemptions(config([]), after)).toEqual([]);
  });

  it("ignores a size rule that an override turns on", () => {
    const after = config([
      { files: ["a.ts"], rules: { "max-lines": ["error", { max: 400 }] } },
    ]);

    expect(addedExemptions(config([]), after)).toEqual([]);
  });
});

describe("parseOxlintConfig", () => {
  it("reads the repository's .oxlintrc.json, comments and all", () => {
    const text = readFileSync(
      new URL("../.oxlintrc.json", import.meta.url),
      "utf8"
    );

    expect(listExemptions(parseOxlintConfig(text)).length).toBeGreaterThan(0);
  });
});
