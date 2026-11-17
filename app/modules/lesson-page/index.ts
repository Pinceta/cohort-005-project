import type { loadLessonPage } from "./lib/load.server";

/** What the lesson page loader hands the page: a locked or a full lesson. */
export type LessonPageData = Awaited<ReturnType<typeof loadLessonPage>>;
export type LockedLessonData = Extract<LessonPageData, { view: "locked" }>;
export type FullLessonData = Extract<LessonPageData, { view: "full" }>;
