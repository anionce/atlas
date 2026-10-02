import type { Metadata } from "next";

import {
  generateBreadcrumbSchema,
  generateFAQSchema,
  generateMetadata as buildSeoMetadata,
  generateSchema,
} from "@atlas/seo";

import { CompoundInterestJourneyClient } from "@/features/saving/components/CompoundInterestJourneyClient";
import { ToolMethod } from "@/components/ToolIntro";
import { COMPOUND_INTEREST_METHOD } from "@/content/tool-methods";

const TITLE = "Calculadora de interés compuesto";
const DESCRIPTION =
  "Descubre cuánto podrías ahorrar a largo plazo aportando cada mes, y cuánto tiempo te llevaría alcanzar tu objetivo de ahorro.";
const PATH = "/interes-compuesto";

const INTRO =
  "Calcula cuánto podría crecer tu ahorro a largo plazo con aportaciones mensuales constantes y una rentabilidad esperada, y cuánto tardarías en alcanzar un objetivo de ahorro concreto si tienes uno en mente.";

const FAQS = [
  {
    question: "¿Qué rentabilidad anual debería usar?",
    answer:
      "Depende de dónde inviertas. Para un fondo indexado global diversificado a largo plazo, el 5%-7% anual es una referencia razonable históricamente, aunque no hay ninguna garantía de rentabilidad futura.",
  },
  {
    question: "¿Cuenta la inflación?",
    answer:
      "No — el resultado está en euros nominales (de cada año, sin ajustar), no en poder adquisitivo de hoy. Si quieres una cifra más conservadora, puedes restar 2-3 puntos a la rentabilidad esperada para aproximar el efecto de la inflación.",
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
  { name: "Interés compuesto", path: PATH },
]);

const faqSchema = generateFAQSchema(FAQS);

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
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <CompoundInterestJourneyClient intro={INTRO} faqs={FAQS}>
        <ToolMethod
          title="Cómo calculamos tu ahorro a futuro"
          sections={COMPOUND_INTEREST_METHOD}
        />
      </CompoundInterestJourneyClient>
    </>
  );
}
