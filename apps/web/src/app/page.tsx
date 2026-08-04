import Link from "next/link";

import { buttonVariants } from "@atlas/design-system";

export default function Home() {
  return (
    <div className="bg-background flex min-h-screen flex-col items-center justify-center px-6 py-24">
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
    </div>
  );
}
