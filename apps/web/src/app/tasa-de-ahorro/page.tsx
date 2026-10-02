import type { Metadata } from "next";

import {
  generateBreadcrumbSchema,
  generateFAQSchema,
  generateMetadata as buildSeoMetadata,
  generateSchema,
} from "@atlas/seo";

import { SavingsRateJourneyClient } from "@/features/savings-rate/components/SavingsRateJourneyClient";
import { ToolMethod } from "@/components/ToolIntro";
import { SAVINGS_RATE_METHOD } from "@/content/tool-methods";

const TITLE = "Calculadora de tasa de ahorro";
const DESCRIPTION =
  "Calcula tu tasa de ahorro real a partir de tus ingresos y gastos, y cuánto tardarías en alcanzar la independencia financiera a ese ritmo.";
const PATH = "/tasa-de-ahorro";

const INTRO =
  "Calcula qué porcentaje de tus ingresos ahorras — tu tasa de ahorro real — y cuánto tardarías en alcanzar la independencia financiera a ese ritmo. Es, junto con la rentabilidad de tus inversiones, la variable que más determina cuánto tiempo te separa de tu número FIRE.";

const FAQS = [
  {
    question: "¿Qué tasa de ahorro es buena?",
    answer:
      "No hay un número mágico, pero como referencia: por debajo del 10% el camino a la independencia financiera es muy largo; por encima del 50%, se acorta drásticamente frente a la media. Lo importante es la tendencia — subir tu tasa de ahorro, aunque sea poco a poco.",
  },
  {
    question: "¿Por qué importa más que el sueldo?",
    answer:
      "Porque lo que determina cuánto ahorras no es cuánto ganas, sino qué porcentaje guardas. Alguien con un sueldo modesto y una tasa de ahorro alta puede alcanzar la independencia financiera antes que alguien con un sueldo mayor pero que gasta casi todo lo que ingresa.",
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
  { name: "Tasa de ahorro", path: PATH },
]);

const faqSchema = generateFAQSchema(FAQS);

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
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <SavingsRateJourneyClient intro={INTRO} faqs={FAQS}>
        <ToolMethod title="Cómo calculamos tu tasa de ahorro" sections={SAVINGS_RATE_METHOD} />
      </SavingsRateJourneyClient>
    </>
  );
}
