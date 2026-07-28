import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Обучения за хранителен бизнес — БАБХ готовност",
  description:
    "Подгответе персонала, документацията и обекта си за изискванията на БАБХ. Изберете формата, която пасва на Вашето темпо — четене или живо онлайн обучение.",
  alternates: { canonical: "/training" },
};

export default function TrainingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
