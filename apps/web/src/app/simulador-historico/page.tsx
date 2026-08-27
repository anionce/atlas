import type { Metadata } from "next";

import {
  generateBreadcrumbSchema,
  generateMetadata as buildSeoMetadata,
  generateSchema,
} from "@atlas/seo";

import { HistoricalBacktestJourneyClient } from "@/features/historical-backtest/components/HistoricalBacktestJourneyClient";

const TITLE = "Simulador histórico de jubilación";
const DESCRIPTION =
  "Comprueba tu plan de jubilación contra cada secuencia histórica real de mercado desde 1928, con distintas estrategias de retirada — no una única proyección con una rentabilidad media asumida.";
const PATH = "/simulador-historico";

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
  { name: "Simulador histórico", path: PATH },
]);

export default function HistoricalBacktestPage() {
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
      <HistoricalBacktestJourneyClient />
    </>
  );
}
