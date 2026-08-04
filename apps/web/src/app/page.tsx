import type { Metadata } from "next";
import Link from "next/link";

import { generateFAQSchema, generateMetadata as buildSeoMetadata } from "@atlas/seo";
import { buttonVariants, Card, CardDescription, CardTitle } from "@atlas/design-system";

const TITLE = "Atlas — Toma mejores decisiones financieras";
const DESCRIPTION =
  "Simulaciones interactivas y explicaciones claras para decisiones financieras importantes, empezando por comprar una vivienda.";

export const metadata: Metadata = buildSeoMetadata({
  title: TITLE,
  description: DESCRIPTION,
  path: "/",
});

const faqs = [
  {
    question: "¿Esto sustituye el análisis de un banco?",
    answer:
      "No. Es una estimación orientativa para ayudarte a entender tu situación antes de hablar con un banco, no una oferta ni un compromiso de financiación.",
  },
  {
    question: "¿Cómo calculáis cuánto puedo gastar?",
    answer:
      "A partir de tus ingresos, tu ahorro y el tipo de interés estimamos la cuota máxima razonable y la entrada que necesitarías, y te devolvemos el precio de vivienda que encaja con ambas.",
  },
  {
    question: "¿Guardáis mis datos?",
    answer:
      "El cálculo se hace en tu navegador. Si guardas el progreso, se almacena localmente en tu dispositivo, no en nuestros servidores.",
  },
];

const faqSchema = generateFAQSchema(faqs);

export default function Home() {
  return (
    <div className="bg-background flex min-h-screen flex-col items-center px-6 py-24">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <main className="flex w-full max-w-[760px] flex-col items-center gap-8 text-center">
        <h1 className="text-foreground text-4xl leading-tight font-semibold tracking-tight text-balance sm:text-5xl">
          Toma mejores decisiones antes de comprar una vivienda.
        </h1>
        <p className="text-muted-foreground max-w-md text-lg">
          Responde unas preguntas y te ayudamos a entender cuánto puedes gastar, cuánto te costaría
          y qué podrías mejorar.
        </p>
        <Link href="/comprar-vivienda" className={buttonVariants({ size: "lg" })}>
          Empieza la simulación
        </Link>
      </main>

      <section className="mt-24 flex w-full max-w-[760px] flex-col gap-4">
        <h2 className="text-foreground text-xl font-semibold">Preguntas frecuentes</h2>
        {faqs.map((faq) => (
          <Card key={faq.question}>
            <CardTitle className="text-base">{faq.question}</CardTitle>
            <CardDescription>{faq.answer}</CardDescription>
          </Card>
        ))}
      </section>
    </div>
  );
}
