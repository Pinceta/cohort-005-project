import { describe, it, expect } from "vitest";
import { MAX_NOTE_LENGTH } from "~/lib/notes";
import { noteDraftStatus } from "../index";

describe("noteDraftStatus", () => {
  it("is clean and unsavable when the draft matches the saved note", () => {
    expect(noteDraftStatus("Generics recap", "Generics recap")).toEqual({
      dirty: false,
      tooLong: false,
      canSave: false,
      counter: "14 / 2,000",
    });
  });

  it("offers Save once the draft changes", () => {
    const status = noteDraftStatus("Generics recap!", "Generics recap");
    expect(status.dirty).toBe(true);
    expect(status.canSave).toBe(true);
  });

  it("treats a missing note as an empty one", () => {
    expect(noteDraftStatus("", null)).toMatchObject({
      dirty: false,
      canSave: false,
      counter: "0 / 2,000",
    });
    expect(noteDraftStatus("First thought", undefined).canSave).toBe(true);
  });

  it("does not offer to save a blank draft", () => {
    const status = noteDraftStatus("   \n ", "Old note");
    expect(status.dirty).toBe(true);
    expect(status.canSave).toBe(false);
  });

  it("allows a draft of exactly the maximum length", () => {
    const status = noteDraftStatus("a".repeat(MAX_NOTE_LENGTH), "");
    expect(status.tooLong).toBe(false);
    expect(status.canSave).toBe(true);
  });

  it("flags a draft over the maximum length and refuses to save it", () => {
    const status = noteDraftStatus("a".repeat(MAX_NOTE_LENGTH + 1), "");
    expect(status).toMatchObject({
      tooLong: true,
      canSave: false,
      counter: "2,001 / 2,000",
    });
  });
});
