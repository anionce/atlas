import type { Metadata } from "next";

import {
  generateBreadcrumbSchema,
  generateFAQSchema,
  generateMetadata as buildSeoMetadata,
  generateSchema,
} from "@atlas/seo";

import { HistoricalBacktestJourneyClient } from "@/features/historical-backtest/components/HistoricalBacktestJourneyClient";
import { ToolMethod } from "@/components/ToolIntro";
import { HISTORICAL_BACKTEST_METHOD } from "@/content/tool-methods";

const TITLE = "Simulador histórico de jubilación";
const DESCRIPTION =
  "Comprueba tu plan de jubilación contra cada secuencia histórica real de mercado desde 1928, con distintas estrategias de retirada — no una única proyección con una rentabilidad media asumida.";
const PATH = "/simulador-historico";

const INTRO =
  "Prueba tu plan de jubilación contra cada secuencia histórica real de mercado desde 1928 (no una única proyección con una rentabilidad media asumida), con distintas estrategias de retirada — desde la regla clásica del 4% hasta estrategias dinámicas como Guyton-Klinger — y descubre qué porcentaje de esas secuencias habría aguantado.";

const FAQS = [
  {
    question: "¿Por qué usa datos de EE. UU. y no de España?",
    answer:
      "Porque no existe un dataset de mercado español o europeo igual de largo y limpio disponible públicamente. Es la misma limitación de cualquier simulador de este tipo (FI Calc, FIRECalc, cFIREsim), no un descuido — se indica siempre en el resultado.",
  },
  {
    question: "¿Qué significa que una secuencia 'no aguantó'?",
    answer:
      "Que, con ese precio de cartera, ese gasto y esa estrategia de retirada, el dinero se habría agotado antes de completar los años de jubilación que pediste — simulando exactamente lo que habría pasado con las rentabilidades reales de ese período histórico concreto.",
  },
  {
    question: "¿Una tasa de éxito del 100% es una garantía de que a mí me funcionará?",
    answer:
      "No — es una forma de estresar tu plan contra escenarios que ya ocurrieron, no una predicción del futuro. El mercado futuro puede comportarse de forma distinta a cualquier secuencia histórica.",
  },
];

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

const faqSchema = generateFAQSchema(FAQS);

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
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <HistoricalBacktestJourneyClient intro={INTRO} faqs={FAQS}>
        <ToolMethod title="Cómo funciona el simulador" sections={HISTORICAL_BACKTEST_METHOD} />
      </HistoricalBacktestJourneyClient>
    </>
  );
}
