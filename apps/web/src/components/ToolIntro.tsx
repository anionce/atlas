import { Card, CardDescription, CardTitle } from "@atlas/design-system";
import type { FaqItem } from "@atlas/seo";

/**
 * Texto real, renderizado en el servidor, por encima del wizard de cada
 * herramienta. Sin esto, la carga inicial de una calculadora es casi solo
 * "Paso 1 de N" y la primera pregunta — muy poco contenido como para que
 * un rastreador lo distinga de una página vacía. No cambia la experiencia
 * de quien ya usa el wizard, solo le da contexto a quien aterriza aquí
 * (persona o buscador) antes de interactuar con nada.
 */
export function ToolIntro({ description }: { description: string }) {
  return (
    <p className="text-muted-foreground mx-auto mb-8 w-full max-w-[600px] text-base leading-relaxed">
      {description}
    </p>
  );
}

/** Mismo motivo que ToolIntro: contenido real bajo el wizard, con su FAQPage schema a juego. */
export function ToolFaq({ faqs }: { faqs: FaqItem[] }) {
  return (
    <section className="mx-auto mt-16 flex w-full max-w-[600px] flex-col gap-3">
      <h2 className="text-foreground text-xl font-semibold">Preguntas frecuentes</h2>
      {faqs.map((item) => (
        <Card key={item.question}>
          <CardTitle className="text-base">{item.question}</CardTitle>
          <CardDescription>{item.answer}</CardDescription>
        </Card>
      ))}
    </section>
  );
}
