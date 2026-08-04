import type { Metadata } from "next";

import {
  generateBreadcrumbSchema,
  generateMetadata as buildSeoMetadata,
  generateSchema,
} from "@atlas/seo";

import { FireJourneyClient } from "@/features/investing/components/FireJourneyClient";

const TITLE = "Calculadora FIRE: independencia financiera";
const DESCRIPTION =
  "Descubre cuánto capital necesitas para vivir de las rentas y cuántos años te llevaría alcanzarlo aportando cada mes.";
const PATH = "/fire";

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
  { name: "FIRE", path: PATH },
]);

export default function FirePage() {
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
      <FireJourneyClient />
    </>
  );
}
