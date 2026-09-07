import type { Metadata } from "next";

import {
  generateBreadcrumbSchema,
  generateFAQSchema,
  generateMetadata as buildSeoMetadata,
  generateSchema,
} from "@atlas/seo";

import { FireJourneyClient } from "@/features/investing/components/FireJourneyClient";

const TITLE = "Calculadora FIRE: independencia financiera";
const DESCRIPTION =
  "Descubre cuánto capital necesitas para vivir de las rentas y cuántos años te llevaría alcanzarlo aportando cada mes.";
const PATH = "/fire";

const INTRO =
  "Calcula cuánto capital necesitas para vivir de las rentas y dejar de depender de un sueldo — tu «número FIRE» — y cuántos años te llevaría alcanzarlo a tu ritmo actual de ahorro. El resultado tiene en cuenta el IRPF español sobre las retiradas, tu pensión pública estimada y el efecto Coast FIRE, además de mostrarte tres niveles de gasto (Lean, Pleno y Fat FIRE) para que veas el rango completo.";

const FAQS = [
  {
    question: "¿Qué es FIRE?",
    answer:
      "FIRE son las siglas de Financial Independence, Retire Early (independencia financiera, jubilación anticipada): el movimiento centrado en ahorrar e invertir agresivamente para acumular capital suficiente y vivir de las rentas de tu cartera, sin depender de un sueldo, normalmente mucho antes de la edad de jubilación.",
  },
  {
    question: "¿El número que me da es una garantía?",
    answer:
      "No — es una estimación basada en la regla del 4%, que históricamente funcionó en el 95% de los períodos de 30 años en EE. UU., no en el 100%. Cuanto más largo sea tu horizonte, más margen de seguridad conviene añadir. Nuestro simulador histórico te deja comprobar tu propio caso contra secuencias reales de mercado.",
  },
  {
    question: "¿Tiene en cuenta la fiscalidad española?",
    answer:
      "Sí — aplica los tramos del IRPF sobre la parte de ganancia de cada retirada (19%-30% en 2026), y si nos das una estimación de tu pensión pública, reduce el capital necesario a partir de la edad legal de jubilación.",
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
  { name: "FIRE", path: PATH },
]);

const faqSchema = generateFAQSchema(FAQS);

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
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <FireJourneyClient intro={INTRO} faqs={FAQS} />
    </>
  );
}
