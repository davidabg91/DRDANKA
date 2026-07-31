import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/siteConfig";
import { BLOG_POSTS } from "@/data/blogPosts";
import { LIBRARY_MATERIALS } from "@/data/library";
import { LIVE_COURSES } from "@/data/live-courses";

// All routes come from in-code data (BLOG_POSTS, LIBRARY_MATERIALS,
// LIVE_COURSES), so the sitemap only ever changes on deploy. Cache it at the
// edge for a day instead of re-running the route on every request — this keeps
// Googlebot off a cold serverless invocation (the source of intermittent
// "timed out fetching" reports). Must be a statically analyzable literal.
export const revalidate = 86400;

type ChangeFreq = MetadataRoute.Sitemap[number]["changeFrequency"];

function entry(
  path: string,
  priority: number,
  changeFrequency: ChangeFreq,
  lastModified: Date = new Date(),
): MetadataRoute.Sitemap[number] {
  return {
    url: `${SITE_URL}${path}`,
    lastModified,
    changeFrequency,
    priority,
  };
}

export default function sitemap(): MetadataRoute.Sitemap {
  // Static, publicly indexable routes. (/bookstore and /trainings are excluded
  // on purpose — they 308-redirect to /library and /live respectively.)
  const staticRoutes: MetadataRoute.Sitemap = [
    entry("", 1.0, "weekly"),
    entry("/services", 0.9, "monthly"),
    entry("/consultations", 0.9, "monthly"),
    entry("/library", 0.9, "weekly"),
    entry("/live", 0.9, "weekly"),
    entry("/training", 0.8, "monthly"),
    entry("/manuals", 0.8, "monthly"),
    entry("/about", 0.7, "yearly"),
    entry("/contact", 0.7, "yearly"),
    entry("/blog", 0.7, "weekly"),
    entry("/privacy", 0.3, "yearly"),
    entry("/terms", 0.3, "yearly"),
  ];

  const blogRoutes = BLOG_POSTS.map((post) =>
    entry(`/blog/${post.id}`, 0.6, "monthly"),
  );

  const libraryRoutes = LIBRARY_MATERIALS.map((m) =>
    entry(`/library/${m.slug}`, 0.8, "monthly"),
  );

  const liveRoutes = LIVE_COURSES.map((c) =>
    entry(`/live/${c.slug}`, 0.8, "monthly"),
  );

  return [...staticRoutes, ...blogRoutes, ...libraryRoutes, ...liveRoutes];
}
