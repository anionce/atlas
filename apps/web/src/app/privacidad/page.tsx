import type { Metadata } from "next";
import Link from "next/link";

import { generateMetadata as buildSeoMetadata } from "@atlas/seo";

const TITLE = "Política de privacidad";
const DESCRIPTION = "Cómo tratamos tus datos: qué recogemos, para qué, y cuáles son tus derechos.";

export const metadata: Metadata = buildSeoMetadata({
  title: TITLE,
  description: DESCRIPTION,
  path: "/privacidad",
});

const PROSE =
  "[&_h2]:text-foreground [&_h2]:mt-8 [&_h2]:mb-3 [&_h2]:text-xl [&_h2]:font-semibold " +
  "[&_p]:text-foreground [&_p]:mb-4 [&_p]:leading-relaxed " +
  "[&_ul]:mb-4 [&_ul]:list-disc [&_ul]:space-y-1 [&_ul]:pl-6 [&_li]:text-foreground " +
  "[&_a]:text-primary [&_a]:underline [&_a]:underline-offset-2 " +
  "[&_strong]:text-foreground [&_strong]:font-semibold";

export default function PrivacidadPage() {
  return (
    <div className="bg-background flex min-h-screen flex-col items-center px-6 py-24">
      <article className="w-full max-w-[720px]">
        <Link href="/" className="text-muted-foreground text-sm hover:underline">
          ← Inicio
        </Link>
        <h1 className="text-foreground mt-4 mb-8 text-3xl font-semibold tracking-tight">{TITLE}</h1>

        <div className={PROSE}>
          <h2>1. Responsable del tratamiento</h2>
          <ul>
            <li>Titular: [NOMBRE COMPLETO DEL TITULAR]</li>
            <li>NIF: [NIF/DNI]</li>
            <li>Domicilio: [DOMICILIO A EFECTOS DE NOTIFICACIONES]</li>
            <li>
              Email de contacto: <a href="mailto:anionce91@gmail.com">anionce91@gmail.com</a>
            </li>
          </ul>

          <h2>2. Las calculadoras no envían tus datos a ningún servidor</h2>
          <p>
            Los importes, plazos, tipos de interés y demás datos que introduces en las calculadoras
            (compra de vivienda, interés compuesto, FIRE, gastos de compraventa) se procesan{" "}
            <strong>íntegramente en tu navegador</strong>. No se envían a nuestros servidores ni se
            almacenan en ninguna base de datos — cuando cierras o recargas la página, esos datos
            desaparecen.
          </p>

          <h2>3. Qué datos recogemos y para qué</h2>
          <p>
            Si aceptas las cookies analíticas en el banner de consentimiento, usamos{" "}
            <strong>Google Analytics 4</strong> para entender de forma agregada cómo se usa el sitio
            (páginas visitadas, calculadora utilizada, dispositivo, ubicación aproximada por IP). No
            usamos esta información para identificarte personalmente. Puedes rechazar estas cookies
            sin que afecte al funcionamiento del sitio — ver la{" "}
            <Link href="/cookies">Política de Cookies</Link>.
          </p>
          <p>
            Si nos escribes por email, tratamos los datos que nos facilites (tu dirección de correo
            y el contenido del mensaje) únicamente para responder a tu consulta.
          </p>

          <h2>4. Base legal</h2>
          <p>
            El tratamiento de datos analíticos se basa en tu <strong>consentimiento</strong>,
            otorgado a través del banner de cookies y revocable en cualquier momento. El tratamiento
            de los datos que nos envíes por email se basa en tu propia iniciativa de contactar con
            nosotros.
          </p>

          <h2>5. Con quién compartimos los datos</h2>
          <p>
            Los datos analíticos se procesan por <strong>Google Ireland Limited</strong>, como
            encargada del tratamiento, lo que puede implicar una transferencia de datos a servidores
            fuera del Espacio Económico Europeo, amparada por las Cláusulas Contractuales Tipo de la
            Comisión Europea que Google tiene suscritas. No cedemos datos a terceros con fines
            comerciales propios.
          </p>

          <h2>6. Plazo de conservación</h2>
          <p>
            Los datos analíticos se conservan según la configuración por defecto de Google Analytics
            4 (habitualmente 14 meses desde la última interacción). Los emails de contacto se
            conservan mientras sea necesario para atender tu consulta.
          </p>

          <h2>7. Tus derechos</h2>
          <p>
            Puedes ejercer tus derechos de acceso, rectificación, supresión, oposición, limitación
            del tratamiento y portabilidad escribiendo a{" "}
            <a href="mailto:anionce91@gmail.com">anionce91@gmail.com</a>. También tienes derecho a
            presentar una reclamación ante la{" "}
            <a href="https://www.aepd.es" target="_blank" rel="noopener noreferrer">
              Agencia Española de Protección de Datos (AEPD)
            </a>{" "}
            si consideras que el tratamiento no se ajusta a la normativa.
          </p>
        </div>
      </article>
    </div>
  );
}
