import Stripe from "stripe";

/**
 * Server-side Stripe client. Do NOT import this from "use client" code.
 *
 * Required env vars:
 *   STRIPE_SECRET_KEY      — sk_test_... or sk_live_...
 *   STRIPE_WEBHOOK_SECRET  — whsec_... (for /api/stripe/webhook signature verification)
 */

let _stripe: Stripe | null = null;

export function stripe(): Stripe {
  if (_stripe) return _stripe;
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) {
    throw new Error("Missing STRIPE_SECRET_KEY env var. See STRIPE_SETUP.md.");
  }
  _stripe = new Stripe(key, {
    apiVersion: "2024-12-18.acacia" as any,
    typescript: true,
  });
  return _stripe;
}

export const STRIPE_WEBHOOK_SECRET = (): string => {
  const s = process.env.STRIPE_WEBHOOK_SECRET;
  if (!s) throw new Error("Missing STRIPE_WEBHOOK_SECRET env var.");
  return s;
};
