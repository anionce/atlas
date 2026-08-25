"use client";

import { useState, useSyncExternalStore } from "react";
import Link from "next/link";

import { Button } from "@atlas/design-system";

import {
  applyConsent,
  getStoredConsent,
  storeConsent,
  type ConsentChoice,
} from "@/lib/cookie-consent";

function subscribe() {
  // El consentimiento solo cambia por una acción del propio usuario en este
  // componente (ver `choose`), nunca desde fuera, así que no hay nada a lo
  // que suscribirse.
  return () => {};
}

function getServerSnapshot() {
  return null;
}

export function CookieConsentBanner() {
  const storedConsent = useSyncExternalStore(subscribe, getStoredConsent, getServerSnapshot);
  const [dismissed, setDismissed] = useState(false);

  if (dismissed || storedConsent !== null) return null;

  function choose(choice: ConsentChoice) {
    storeConsent(choice);
    applyConsent(choice);
    setDismissed(true);
  }

  return (
    <div
      data-nosnippet
      className="border-border bg-background fixed inset-x-0 bottom-0 z-50 border-t px-6 py-4 shadow-lg"
    >
      <div className="mx-auto flex w-full max-w-[900px] flex-col items-center gap-4 sm:flex-row sm:justify-between">
        <p className="text-muted-foreground text-sm">
          Usamos cookies analíticas para entender cómo se usa el sitio y mejorarlo. Puedes
          aceptarlas o rechazarlas — no afecta a que las calculadoras funcionen. Más info en nuestra{" "}
          <Link href="/cookies" className="text-primary underline underline-offset-2">
            Política de Cookies
          </Link>
          .
        </p>
        <div className="flex shrink-0 gap-2">
          <Button variant="secondary" size="md" onClick={() => choose("denied")}>
            Rechazar
          </Button>
          <Button variant="primary" size="md" onClick={() => choose("granted")}>
            Aceptar
          </Button>
        </div>
      </div>
    </div>
  );
}
