/**
 * Renders one or more JSON-LD structured-data objects as a
 * <script type="application/ld+json"> tag. Server-component friendly and safe
 * to use inside client components too (it emits static markup only).
 */
export default function JsonLd({ data }: { data: object | object[] }) {
  const json = JSON.stringify(data);
  return (
    <script
      type="application/ld+json"
      // JSON.stringify output is safe here; escape "<" to avoid breaking out
      // of the script element via a literal "</script>" inside string values.
      dangerouslySetInnerHTML={{ __html: json.replace(/</g, "\\u003c") }}
    />
  );
}
