/**
 * Admin-controlled external video links for library materials.
 *
 * For video products the admin can either upload an mp4 to Firebase Storage
 * (protected, but every view = full-file bandwidth cost) OR point the material
 * at an unlisted YouTube / Vimeo link (bandwidth is free, streams better, but
 * less protected). When a videoLink override exists for a slug, the profile
 * embeds it inline instead of loading the Storage blob.
 *
 * Stored at /videoLinks/{slug} as: { url: string, updatedAt: string }.
 * Mirrors src/lib/priceOverrides.ts (one-time getDocs fetch, public read).
 */
import { useEffect, useState } from "react";
import { db } from "./firebase";
import { collection, doc, getDocs, query, setDoc, deleteDoc } from "firebase/firestore";

export interface VideoLink {
  url: string;
  updatedAt: string;
}

export function useVideoLinks() {
  const [links, setLinks] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    getDocs(query(collection(db, "videoLinks")))
      .then((snap) => {
        if (cancelled) return;
        const map: Record<string, string> = {};
        snap.forEach((d) => {
          const data = d.data() as VideoLink;
          if (typeof data.url === "string" && data.url) map[d.id] = data.url;
        });
        setLinks(map);
        setLoading(false);
      })
      .catch((error) => {
        if (cancelled) return;
        console.error("Error fetching video links:", error);
        setLoading(false);
      });

    return () => { cancelled = true; };
  }, []);

  return { links, loading };
}

/** Admin sets the external video link for a slug. Pass null to clear. */
export async function setVideoLink(slug: string, url: string | null): Promise<void> {
  const ref = doc(db, "videoLinks", slug);
  if (!url) {
    await deleteDoc(ref);
  } else {
    await setDoc(ref, { url: url.trim(), updatedAt: new Date().toISOString() }, { merge: true });
  }
}

/**
 * Convert a YouTube / Vimeo watch URL into an embeddable player URL. Returns
 * the original string if the pattern isn't recognised (caller can still try to
 * iframe it). Adds `rel=0` for YouTube so unrelated videos aren't suggested.
 */
export function toEmbedUrl(url: string): string {
  const u = url.trim();
  // youtu.be/<id>
  let m = u.match(/^https?:\/\/youtu\.be\/([\w-]+)/i);
  if (m) return `https://www.youtube.com/embed/${m[1]}?rel=0`;
  // youtube.com/watch?v=<id>
  m = u.match(/[?&]v=([\w-]+)/i);
  if (m && /youtube\.com/i.test(u)) return `https://www.youtube.com/embed/${m[1]}?rel=0`;
  // youtube.com/embed/<id> (already embed)
  if (/youtube\.com\/embed\//i.test(u)) return u;
  // vimeo.com/<id>
  m = u.match(/^https?:\/\/(?:www\.)?vimeo\.com\/(\d+)/i);
  if (m) return `https://player.vimeo.com/video/${m[1]}`;
  // player.vimeo.com/video/<id> (already embed)
  if (/player\.vimeo\.com\/video\//i.test(u)) return u;
  return u;
}
