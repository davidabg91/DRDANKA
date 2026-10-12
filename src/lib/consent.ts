/**
 * Cookie / tracking consent.
 *
 * Meta Pixel and the Conversions API (server-side Meta events) are marketing
 * trackers: under ЗЕС чл. 4а and GDPR they may only run after the visitor has
 * actively agreed. Everything else on the site (Firebase sign-in, Vercel's
 * cookieless analytics) is strictly necessary or cookieless and runs regardless.
 *
 * The choice is kept per browser in localStorage. Bump CONSENT_VERSION when the
 * list of trackers changes so everyone is asked again.
 */

const STORAGE_KEY = "danka_cookie_consent";
const CONSENT_VERSION = 1;
export const CONSENT_EVENT = "danka:consentchange";
export const OPEN_SETTINGS_EVENT = "danka:opencookiesettings";

export type ConsentChoice = "granted" | "denied";

export function readConsent(): ConsentChoice | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as { v?: number; marketing?: ConsentChoice };
    if (parsed.v !== CONSENT_VERSION) return null;
    return parsed.marketing === "granted" || parsed.marketing === "denied" ? parsed.marketing : null;
  } catch {
    return null;
  }
}

export function hasMarketingConsent(): boolean {
  return readConsent() === "granted";
}

export function saveConsent(choice: ConsentChoice) {
  try {
    window.localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ v: CONSENT_VERSION, marketing: choice, at: new Date().toISOString() }),
    );
  } catch {}
  window.dispatchEvent(new CustomEvent(CONSENT_EVENT, { detail: choice }));
}

/** Re-opens the cookie banner (used by the "Настройки за бисквитки" links). */
export function openCookieSettings() {
  window.dispatchEvent(new Event(OPEN_SETTINGS_EVENT));
}
