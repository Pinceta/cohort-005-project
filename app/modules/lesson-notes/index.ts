import { describeNoteDraft, type NoteDraftStatus } from "./lib/draft-status";

export type { NoteDraftStatus };

/**
 * What the lesson note editor shows about the text being typed: whether it
 * has unsaved changes, whether Save is allowed, and the length counter.
 */
export function noteDraftStatus(
  draft: string,
  savedBody: string | null | undefined
): NoteDraftStatus {
  return describeNoteDraft(draft, savedBody ?? "");
}
