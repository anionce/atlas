import type { Metadata } from "next";

import {
  generateBreadcrumbSchema,
  generateFAQSchema,
  generateMetadata as buildSeoMetadata,
  generateSchema,
} from "@atlas/seo";

import { PurchaseCostsJourneyClient } from "@/features/housing/components/PurchaseCostsJourneyClient";

const TITLE = "Calculadora de gastos de compra de vivienda (ITP/IVA)";
const DESCRIPTION =
  "Descubre cuánto pagarías en impuestos, notaría, registro y tasación al comprar una vivienda, según sea nueva o de segunda mano.";
const PATH = "/gastos-compra-vivienda";

const INTRO =
  "Calcula cuánto pagarías en impuestos y gastos al comprar una vivienda en España — ITP o IVA según sea de segunda mano o nueva, notaría, registro y tasación — con el tipo real de tu comunidad autónoma, incluidos los tramos progresivos de ITP en las cinco comunidades que los tienen.";

const FAQS = [
  {
    question: "¿Cuál es la diferencia entre ITP e IVA?",
    answer:
      "La vivienda de segunda mano paga ITP (Impuesto de Transmisiones Patrimoniales), que fija cada comunidad autónoma y varía entre el 4% y el 13%. La obra nueva comprada directamente al promotor paga IVA (10% en toda España, salvo Canarias) más el Impuesto de Actos Jurídicos Documentados.",
  },
  {
    question: "¿Por qué me pide la comunidad autónoma?",
    answer:
      "Porque el ITP no es igual en toda España — puede suponer una diferencia de miles de euros en la misma operación según dónde compres. Cinco comunidades (Cataluña, Baleares, Asturias, Extremadura y Comunidad Valenciana) tienen además tramos progresivos según el precio, no un tipo único.",
  },
  {
    question: "¿Incluye tipos reducidos para jóvenes o familias numerosas?",
    answer:
      "No — usa el tipo general de cada comunidad. Muchas autonomías tienen bonificaciones para colectivos concretos que no se reflejan aquí; consulta la normativa autonómica vigente si podrías beneficiarte de alguna.",
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
  { name: "Gastos de compra", path: PATH },
]);

const faqSchema = generateFAQSchema(FAQS);

export default function GastosCompraViviendaPage() {
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
      <PurchaseCostsJourneyClient intro={INTRO} faqs={FAQS} />
    </>
  );
}
