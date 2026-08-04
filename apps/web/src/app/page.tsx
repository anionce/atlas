import type { Metadata } from "next";
import Link from "next/link";
import { House, PiggyBank, Receipt, TrendingUp } from "lucide-react";

import { generateFAQSchema, generateMetadata as buildSeoMetadata } from "@atlas/seo";
import { Card, CardDescription, CardTitle } from "@atlas/design-system";

const TITLE = "Atlas — Toma mejores decisiones financieras";
const DESCRIPTION =
  "Simulaciones interactivas y explicaciones claras para decisiones financieras importantes: comprar una vivienda, ahorrar a largo plazo, y más.";

export const metadata: Metadata = buildSeoMetadata({
  title: TITLE,
  description: DESCRIPTION,
  path: "/",
});

const tools = [
  {
    href: "/comprar-vivienda",
    title: "Comprar una vivienda",
    description: "Cuánto puedes gastar, la cuota estimada y los gastos de compra.",
    icon: House,
  },
  {
    href: "/interes-compuesto",
    title: "Ahorrar con interés compuesto",
    description: "Cuánto podría crecer tu ahorro a largo plazo, y cuánto tardarías en tu objetivo.",
    icon: PiggyBank,
  },
  {
    href: "/fire",
    title: "Independencia financiera (FIRE)",
    description: "Cuánto capital necesitas para vivir de las rentas, y cuántos años te llevaría.",
    icon: TrendingUp,
  },
  {
    href: "/gastos-compra-vivienda",
    title: "Gastos de compra de vivienda",
    description: "Cuánto pagarías en ITP o IVA, notaría, registro y tasación.",
    icon: Receipt,
  },
];

const faqs = [
  {
    question: "¿Esto sustituye el análisis de un banco?",
    answer:
      "No. Es una estimación orientativa para ayudarte a entender tu situación antes de hablar con un banco, no una oferta ni un compromiso de financiación.",
  },
  {
    question: "¿Cómo calculáis los resultados?",
    answer:
      "A partir de las respuestas que nos das, con fórmulas financieras estándar. Nunca recomendamos un producto solo porque pague más.",
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
          Toma mejores decisiones financieras.
        </h1>
        <p className="text-muted-foreground max-w-md text-lg">
          Elige qué quieres decidir. Respondes unas preguntas y te ayudamos a entender qué te
          conviene, sin jerga bancaria.
        </p>
      </main>

      <section className="mt-16 grid w-full max-w-[1100px] grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {tools.map((tool) => (
          <Link
            key={tool.href}
            href={tool.href}
            aria-label={`Empezar: ${tool.title}`}
            className="group"
          >
            <Card className="group-hover:border-primary/30 h-full transition-all duration-200 group-hover:-translate-y-1 group-hover:shadow-lg">
              <div className="bg-primary/10 text-primary mb-4 flex size-11 items-center justify-center rounded-xl">
                <tool.icon className="size-5" strokeWidth={2} />
              </div>
              <CardTitle>{tool.title}</CardTitle>
              <CardDescription>{tool.description}</CardDescription>
              <span className="text-primary mt-4 inline-flex items-center gap-1 text-sm font-medium">
                Empezar
                <span aria-hidden className="transition-transform group-hover:translate-x-0.5">
                  →
                </span>
              </span>
            </Card>
          </Link>
        ))}
      </section>

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
