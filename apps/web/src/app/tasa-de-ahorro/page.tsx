import type { Metadata } from "next";

import {
  generateBreadcrumbSchema,
  generateMetadata as buildSeoMetadata,
  generateSchema,
} from "@atlas/seo";

import { SavingsRateJourneyClient } from "@/features/savings-rate/components/SavingsRateJourneyClient";

const TITLE = "Calculadora de tasa de ahorro";
const DESCRIPTION =
  "Calcula tu tasa de ahorro real a partir de tus ingresos y gastos, y cuánto tardarías en alcanzar la independencia financiera a ese ritmo.";
const PATH = "/tasa-de-ahorro";

export const metadata: Metadata = buildSeoMetadata({
  title: TITLE,
  description: DESCRIPTION,
  path: PATH,
});

const toolSchema = generateSchema({
  name: TITLE,
  description: DESCRIPTION,
  path: PATH,
});

const breadcrumbSchema = generateBreadcrumbSchema([
  { name: "Inicio", path: "/" },
  { name: "Tasa de ahorro", path: PATH },
]);

export default function SavingsRatePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(toolSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <SavingsRateJourneyClient />
    </>
  );
}
