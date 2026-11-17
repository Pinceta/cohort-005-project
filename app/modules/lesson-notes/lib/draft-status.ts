import { MAX_NOTE_LENGTH } from "~/lib/notes";

export type NoteDraftStatus = {
  dirty: boolean;
  tooLong: boolean;
  canSave: boolean;
  counter: string;
};

export function describeNoteDraft(
  draft: string,
  savedBody: string
): NoteDraftStatus {
  // The server trims a note before it checks and stores it, so judge the
  // draft by what would be saved, not by what is in the box.
  const body = draft.trim();
  const dirty = body !== savedBody;
  const tooLong = body.length > MAX_NOTE_LENGTH;
  // The save-note action rejects a blank note, so do not offer to send one.
  const blank = body.length === 0;

  return {
    dirty,
    tooLong,
    canSave: dirty && !tooLong && !blank,
    counter: `${body.length.toLocaleString("en")} / ${MAX_NOTE_LENGTH.toLocaleString("en")}`,
  };
}
