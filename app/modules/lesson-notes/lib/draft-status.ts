import { MAX_NOTE_LENGTH } from "~/lib/notes";

export type NoteDraftStatus = {
  /** The draft differs from the note as last saved. */
  dirty: boolean;
  tooLong: boolean;
  /** Save is offered only when it would change something the server accepts. */
  canSave: boolean;
  /** e.g. "120 / 2,000" */
  counter: string;
};

export function describeNoteDraft(
  draft: string,
  savedBody: string
): NoteDraftStatus {
  const dirty = draft !== savedBody;
  const tooLong = draft.length > MAX_NOTE_LENGTH;
  // The save-note action rejects a blank note, so do not offer to send one.
  const blank = draft.trim().length === 0;

  return {
    dirty,
    tooLong,
    canSave: dirty && !tooLong && !blank,
    counter: `${draft.length.toLocaleString("en")} / ${MAX_NOTE_LENGTH.toLocaleString("en")}`,
  };
}
