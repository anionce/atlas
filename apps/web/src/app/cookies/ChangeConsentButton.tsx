"use client";

import { Button } from "@atlas/design-system";

export function ChangeConsentButton() {
  return (
    <Button
      variant="secondary"
      size="md"
      onClick={() => {
        window.localStorage.removeItem("cookie_consent");
        window.location.reload();
      }}
    >
      Cambiar mis preferencias de cookies
    </Button>
  );
}
