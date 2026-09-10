/**
 * Video streaming and embed helpers for Bunny.net Stream, YouTube, and Vimeo.
 */

export function isVideoEmbed(url?: string | null): boolean {
  if (!url) return false;
  const lower = url.toLowerCase();
  return (
    lower.includes("mediadelivery.net") ||
    lower.includes("bunnycdn.com") ||
    lower.includes("b-cdn.net") ||
    lower.includes("youtube.com") ||
    lower.includes("youtu.be") ||
    lower.includes("vimeo.com")
  );
}

export function formatVideoEmbedUrl(url?: string | null): string {
  if (!url) return "";
  let clean = url.trim();

  // 1. Bunny.net Stream
  // Handle direct play link: https://player.mediadelivery.net/play/{libId}/{videoId}
  if (clean.includes("player.mediadelivery.net/play/")) {
    clean = clean.replace("player.mediadelivery.net/play/", "iframe.mediadelivery.net/embed/");
  }

  // Handle embed link: https://iframe.mediadelivery.net/embed/{libId}/{videoId}
  if (clean.includes("iframe.mediadelivery.net/embed/")) {
    if (!clean.includes("?")) {
      clean += "?autoplay=true&loop=false&muted=false&preload=true&responsive=true";
    }
    return clean;
  }

  // 2. YouTube
  const ytMatch = clean.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/);
  if (ytMatch && ytMatch[1]) {
    return `https://www.youtube-nocookie.com/embed/${ytMatch[1]}?autoplay=1&rel=0`;
  }

  // 3. Vimeo
  const vimeoMatch = clean.match(/vimeo\.com\/(?:video\/)?(\d+)/);
  if (vimeoMatch && vimeoMatch[1]) {
    return `https://player.vimeo.com/video/${vimeoMatch[1]}?autoplay=1`;
  }

  return clean;
}
