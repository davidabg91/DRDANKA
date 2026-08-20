import type { Metadata } from "next";
import ServicesClient from "./ServicesClient";
import JsonLd from "@/components/JsonLd";
import { breadcrumbSchema, webPageSchema } from "@/lib/schema";

export const metadata: Metadata = {
  title:
    "Услуги по безопасност на храните — разработка и внедряване на HACCP (ХАСЕП) системи",
  description:
    "Разработка и внедряване на HACCP (ХАСЕП) системи, системи за самоконтрол, ДПХП, ISO 22000, IFS Food и GMP. Технологични карти, меню с алергени и пълна документация за БАБХ. Обекти в цяла България, 27 години опит.",
  keywords: [
    "разработка и внедряване на HACCP система",
    "внедряване на ХАСЕП система",
    "ХАСЕП система цена",
    "НАССР система",
    "система за самоконтрол",
    "ДПХП процедури",
    "ISO 22000 внедряване",
    "IFS Food",
    "документация за БАБХ",
    "технологични карти",
    "меню с алергени",
  ],
  alternates: { canonical: "/services" },
};

export default function ServicesPage() {
  return (
    <>
      <JsonLd
        data={[
          webPageSchema({
            name: "Услуги по безопасност на храните",
            description:
              "Пълен каталог на услугите: разработка и внедряване на HACCP (ХАСЕП) системи, ISO 22000, IFS Food, ДПХП/GMP, технологични карти, меню с алергени, документация за БАБХ и одит преди проверка.",
            path: "/services",
            type: "CollectionPage",
          }),
          breadcrumbSchema([
            { name: "Начало", path: "/" },
            { name: "Услуги", path: "/services" },
          ]),
        ]}
      />
      <ServicesClient />
    </>
  );
}
