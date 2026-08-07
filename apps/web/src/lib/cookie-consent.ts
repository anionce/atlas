declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

export type ConsentChoice = "granted" | "denied";

const STORAGE_KEY = "cookie_consent";

export function getStoredConsent(): ConsentChoice | null {
  if (typeof window === "undefined") return null;
  const value = window.localStorage.getItem(STORAGE_KEY);
  return value === "granted" || value === "denied" ? value : null;
}

export function storeConsent(choice: ConsentChoice): void {
  window.localStorage.setItem(STORAGE_KEY, choice);
}

/** Actualiza Google Consent Mode con la elección del usuario. */
export function applyConsent(choice: ConsentChoice): void {
  window.gtag?.("consent", "update", {
    analytics_storage: choice,
    ad_storage: choice,
    ad_user_data: choice,
    ad_personalization: choice,
  });
}
