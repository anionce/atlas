import type { Metadata } from "next";

import {
  generateBreadcrumbSchema,
  generateFAQSchema,
  generateMetadata as buildSeoMetadata,
  generateSchema,
} from "@atlas/seo";

import { BuyHomeJourneyClient } from "@/features/housing/components/BuyHomeJourneyClient";
import { ToolMethod } from "@/components/ToolIntro";
import { BUY_HOME_METHOD } from "@/content/tool-methods";

const TITLE = "Simulador para comprar una vivienda";
const DESCRIPTION =
  "Descubre cuánto puedes gastar en una vivienda, la cuota estimada y los gastos de compra a partir de tus ingresos y tu ahorro.";
const PATH = "/comprar-vivienda";

const INTRO =
  "Calcula cuánto podrías pagar por una vivienda según tus ingresos, tu ahorro y el tipo de interés que manejas — la cuota mensual estimada, la entrada necesaria y si tu ratio de esfuerzo entra dentro del margen que suelen exigir los bancos (35% de tus ingresos).";

const FAQS = [
  {
    question: "¿Esto sustituye el análisis de un banco?",
    answer:
      "No. Es una estimación orientativa para que sepas más o menos en qué rango te mueves antes de hablar con un banco — la aprobación real depende de tu perfil completo (historial crediticio, estabilidad laboral, otras deudas) y de la política de cada entidad.",
  },
  {
    question: "¿Qué ratio de esfuerzo usa la calculadora?",
    answer:
      "Por defecto, el 35% de tus ingresos netos mensuales — el límite que suelen manejar los bancos españoles como referencia de riesgo, aunque cada entidad puede ser algo más flexible o estricta según el resto de tu perfil.",
  },
  {
    question: "¿Por qué me pide cuánto tengo ahorrado, si solo quiero saber la cuota?",
    answer:
      "Porque el resultado final es el más restrictivo entre dos límites: lo que el banco financiaría según tus ingresos, y lo que tu ahorro cubre de entrada más gastos de compra. Sin el dato del ahorro, solo verías la mitad de la foto.",
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
  { name: "Comprar vivienda", path: PATH },
]);

const faqSchema = generateFAQSchema(FAQS);

export default function ComprarViviendaPage() {
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
      <BuyHomeJourneyClient intro={INTRO} faqs={FAQS}>
        <ToolMethod title="Cómo calculamos cuánto puedes comprar" sections={BUY_HOME_METHOD} />
      </BuyHomeJourneyClient>
    </>
  );
}
