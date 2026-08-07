import type { Metadata } from "next";
import Link from "next/link";

import { generateMetadata as buildSeoMetadata } from "@atlas/seo";

const TITLE = "Aviso legal";
const DESCRIPTION = "Condiciones de uso y aviso legal del sitio.";

export const metadata: Metadata = buildSeoMetadata({
  title: TITLE,
  description: DESCRIPTION,
  path: "/aviso-legal",
});

const PROSE =
  "[&_h2]:text-foreground [&_h2]:mt-8 [&_h2]:mb-3 [&_h2]:text-xl [&_h2]:font-semibold " +
  "[&_p]:text-foreground [&_p]:mb-4 [&_p]:leading-relaxed " +
  "[&_ul]:mb-4 [&_ul]:list-disc [&_ul]:space-y-1 [&_ul]:pl-6 [&_li]:text-foreground " +
  "[&_a]:text-primary [&_a]:underline [&_a]:underline-offset-2 " +
  "[&_strong]:text-foreground [&_strong]:font-semibold";

export default function AvisoLegalPage() {
  return (
    <div className="bg-background flex min-h-screen flex-col items-center px-6 py-24">
      <article className="w-full max-w-[720px]">
        <Link href="/" className="text-muted-foreground text-sm hover:underline">
          ← Inicio
        </Link>
        <h1 className="text-foreground mt-4 mb-8 text-3xl font-semibold tracking-tight">{TITLE}</h1>

        <div className={PROSE}>
          <h2>1. Titular del sitio</h2>
          <p>
            Este sitio web es un proyecto personal e independiente. Para cualquier consulta,
            incidencia o ejercicio de derechos relacionados con el sitio, puedes escribir a:
          </p>
          <ul>
            <li>
              Email de contacto:{" "}
              <a href="mailto:hola@mirumbofinanciero.com">hola@mirumbofinanciero.com</a>
            </li>
            <li>Sitio web: www.mirumbofinanciero.com</li>
          </ul>

          <h2>2. Objeto</h2>
          <p>
            Mi Rumbo Financiero es un sitio web que ofrece calculadoras y simulaciones interactivas
            sobre decisiones financieras personales (compra de vivienda, interés compuesto,
            independencia financiera y gastos de compraventa), junto con contenido educativo en
            forma de artículos de blog.
          </p>

          <h2>3. Carácter informativo — no es asesoramiento financiero, fiscal ni legal</h2>
          <p>
            Los resultados de las calculadoras y el contenido del blog tienen carácter
            exclusivamente informativo y orientativo. Se basan en fórmulas financieras estándar y en
            datos generales (como los tipos de ITP por comunidad autónoma) que pueden cambiar con el
            tiempo. No constituyen asesoramiento financiero, fiscal, legal ni de inversión
            personalizado, y no sustituyen la consulta con un profesional cualificado (asesor
            financiero, gestor, notario, abogado) antes de tomar una decisión económica relevante.
          </p>
          <p>
            El titular no se hace responsable de las decisiones que el usuario adopte basándose en
            la información o los resultados obtenidos en este sitio.
          </p>

          <h2>4. Condiciones de uso</h2>
          <p>
            El acceso y uso de este sitio web es gratuito y no requiere registro. El usuario se
            compromete a hacer un uso adecuado y lícito del sitio, de acuerdo con la legislación
            aplicable, la buena fe y el orden público.
          </p>

          <h2>5. Propiedad intelectual</h2>
          <p>
            Los contenidos del sitio (textos, diseño, código, calculadoras) son propiedad del
            titular o se usan con la correspondiente autorización, y están protegidos por la
            normativa de propiedad intelectual. No está permitida su reproducción total o parcial
            sin autorización expresa, salvo cita con atribución al sitio de origen.
          </p>

          <h2>6. Exclusión de responsabilidad</h2>
          <p>
            El titular no garantiza la ausencia total de errores en los contenidos ni la
            disponibilidad continuada del sitio, y no se responsabiliza de los daños derivados de
            interrupciones, virus u otros elementos ajenos a su control. Los tipos impositivos,
            tipos de interés de ejemplo y demás datos mostrados pueden quedar desactualizados; se
            recomienda verificarlos con fuentes oficiales antes de tomar decisiones.
          </p>

          <h2>7. Legislación aplicable</h2>
          <p>
            Este aviso legal se rige por la legislación española. Para cualquier controversia
            derivada del uso del sitio, las partes se someten a los juzgados y tribunales que
            correspondan conforme a la normativa vigente de protección de consumidores.
          </p>
        </div>
      </article>
    </div>
  );
}
