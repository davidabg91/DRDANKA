import type { Metadata } from "next";
import { findLiveCourse } from "@/data/live-courses";
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
  const course = findLiveCourse(slug);

  if (!course) {
    return { title: "Курсът не е намерен" };
  }

  const description = course.metaDescription ?? course.tagline;
  const image = course.card.cover;

  return {
    title: course.title,
    description,
    alternates: { canonical: `/live/${course.slug}` },
    openGraph: {
      title: course.title,
      description,
      url: `/live/${course.slug}`,
      ...(image ? { images: [{ url: image }] } : {}),
    },
  };
}

export default async function LiveCourseLayout({
  children,
  params,
}: LayoutProps) {
  const { slug } = await params;
  const course = findLiveCourse(slug);

  return (
    <>
      {course && (
        <JsonLd
          data={[
            courseSchema({
              name: course.title,
              description: course.metaDescription ?? course.tagline,
              path: `/live/${course.slug}`,
              image: course.card.cover,
              priceEur: course.priceEur,
              mode: "online",
            }),
            breadcrumbSchema([
              { name: "Начало", path: "/" },
              { name: "Live обучения", path: "/live" },
              { name: course.title, path: `/live/${course.slug}` },
            ]),
          ]}
        />
      )}
      {children}
    </>
  );
}
