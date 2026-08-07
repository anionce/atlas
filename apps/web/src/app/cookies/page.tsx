import type { Metadata } from "next";
import Link from "next/link";

import { generateMetadata as buildSeoMetadata } from "@atlas/seo";

import { ChangeConsentButton } from "./ChangeConsentButton";

const TITLE = "Política de cookies";
const DESCRIPTION = "Qué cookies usamos, para qué, y cómo puedes gestionarlas.";

export const metadata: Metadata = buildSeoMetadata({
  title: TITLE,
  description: DESCRIPTION,
  path: "/cookies",
});

const PROSE =
  "[&_h2]:text-foreground [&_h2]:mt-8 [&_h2]:mb-3 [&_h2]:text-xl [&_h2]:font-semibold " +
  "[&_p]:text-foreground [&_p]:mb-4 [&_p]:leading-relaxed " +
  "[&_table]:mb-4 [&_table]:block [&_table]:w-full [&_table]:overflow-x-auto [&_table]:text-sm " +
  "[&_th]:border-border [&_th]:bg-muted [&_th]:border [&_th]:px-3 [&_th]:py-2 [&_th]:text-left [&_th]:font-medium " +
  "[&_td]:border-border [&_td]:border [&_td]:px-3 [&_td]:py-2 " +
  "[&_a]:text-primary [&_a]:underline [&_a]:underline-offset-2 " +
  "[&_strong]:text-foreground [&_strong]:font-semibold";

export default function CookiesPage() {
  return (
    <div className="bg-background flex min-h-screen flex-col items-center px-6 py-24">
      <article className="w-full max-w-[720px]">
        <Link href="/" className="text-muted-foreground text-sm hover:underline">
          ← Inicio
        </Link>
        <h1 className="text-foreground mt-4 mb-8 text-3xl font-semibold tracking-tight">{TITLE}</h1>

        <div className={PROSE}>
          <h2>1. Qué son las cookies</h2>
          <p>
            Las cookies son pequeños archivos que un sitio web guarda en tu dispositivo para
            recordar información. Aquí usamos tanto cookies propiamente dichas como{" "}
            <strong>almacenamiento local del navegador (localStorage)</strong>, que cumple una
            función equivalente: recordar tu elección sobre las cookies para no volver a preguntarte
            en cada visita.
          </p>

          <h2>2. Qué usamos en este sitio</h2>
          <table>
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Tipo</th>
                <th>Finalidad</th>
                <th>Duración</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>cookie_consent</td>
                <td>Necesaria (localStorage)</td>
                <td>Recordar si aceptaste o rechazaste las cookies analíticas</td>
                <td>Hasta que la borres</td>
              </tr>
              <tr>
                <td>_ga, _ga_*</td>
                <td>Analítica (Google Analytics 4)</td>
                <td>Distinguir usuarios y medir el uso agregado del sitio</td>
                <td>Hasta 14 meses</td>
              </tr>
            </tbody>
          </table>
          <p>
            Las cookies analíticas <strong>solo se activan si las aceptas</strong> en el banner que
            aparece la primera vez que visitas el sitio. Rechazarlas no afecta al funcionamiento de
            las calculadoras ni del blog.
          </p>

          <h2>3. Cómo cambiar tu elección</h2>
          <p>
            Puedes cambiar tu decisión sobre las cookies analíticas en cualquier momento con este
            botón, que hará que vuelva a aparecer el banner de consentimiento:
          </p>
          <ChangeConsentButton />

          <h2 className="mt-8">4. Cómo deshabilitar cookies desde tu navegador</h2>
          <p>
            Además de la opción anterior, puedes bloquear o eliminar cookies desde la configuración
            de tu navegador (Chrome, Firefox, Safari, Edge). Ten en cuenta que esto es una
            configuración general del navegador, no específica de este sitio.
          </p>
        </div>
      </article>
    </div>
  );
}
