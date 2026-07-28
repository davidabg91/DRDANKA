import type { Metadata } from "next";
import { findLibraryMaterial } from "@/data/library";
import JsonLd from "@/components/JsonLd";
import { courseSchema, breadcrumbSchema } from "@/lib/schema";

interface LayoutProps {
  children: React.ReactNode;
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const material = findLibraryMaterial(slug);

  if (!material) {
    return { title: "Материалът не е намерен" };
  }

  const description = material.metaDescription ?? material.tagline;
  const image = material.card.cover;

  return {
    title: material.title,
    description,
    alternates: { canonical: `/library/${material.slug}` },
    openGraph: {
      title: material.title,
      description,
      url: `/library/${material.slug}`,
      ...(image ? { images: [{ url: image }] } : {}),
    },
  };
}

export default async function LibraryMaterialLayout({
  children,
  params,
}: LayoutProps) {
  const { slug } = await params;
  const material = findLibraryMaterial(slug);

  return (
    <>
      {material && (
        <JsonLd
          data={[
            courseSchema({
              name: material.title,
              description: material.metaDescription ?? material.tagline,
              path: `/library/${material.slug}`,
              image: material.card.cover,
              priceEur: material.priceEur,
              mode: "online",
            }),
            breadcrumbSchema([
              { name: "Начало", path: "/" },
              { name: "Обучения", path: "/library" },
              { name: material.title, path: `/library/${material.slug}` },
            ]),
          ]}
        />
      )}
      {children}
    </>
  );
}
