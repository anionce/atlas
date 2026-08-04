import type { Metadata } from "next";

import {
  generateBreadcrumbSchema,
  generateMetadata as buildSeoMetadata,
  generateSchema,
} from "@atlas/seo";

import { CompoundInterestJourneyClient } from "@/features/saving/components/CompoundInterestJourneyClient";

const TITLE = "Calculadora de interés compuesto";
const DESCRIPTION =
  "Descubre cuánto podrías ahorrar a largo plazo aportando cada mes, y cuánto tiempo te llevaría alcanzar tu objetivo de ahorro.";
const PATH = "/interes-compuesto";

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
  { name: "Interés compuesto", path: PATH },
]);

export default function InteresCompuestoPage() {
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
      <CompoundInterestJourneyClient />
    </>
  );
}
