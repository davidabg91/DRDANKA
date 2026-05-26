/**
 * Registry of all live/Zoom courses run personally by Dr. Danka Nikolova.
 *
 * To add a new live course:
 *   1. Create src/data/live-courses/<slug>.tsx exporting a LiveCourse.
 *   2. Import it here and append to LIVE_COURSES.
 *
 * Order in this array = order in the /live catalog.
 */
import type { LiveCourse } from "./types";
import { haccpOsnovi } from "./haccp-osnovi";

export const LIVE_COURSES: ReadonlyArray<LiveCourse> = [
  haccpOsnovi,
];

export function findLiveCourse(slug: string): LiveCourse | undefined {
  return LIVE_COURSES.find((c) => c.slug === slug);
}

export type { LiveCourse, LiveCoursePlatform } from "./types";
