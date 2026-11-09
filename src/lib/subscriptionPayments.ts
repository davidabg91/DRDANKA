/**
 * Месечният абонамент „БАБХ Спокойствие" с карта — Stripe Subscriptions.
 *
 * Сървърен модул. Клиентът въвежда картата веднъж (Stripe Checkout), после
 * Stripe я таксува всеки месец. Всяко платено месечно плащане (`invoice.paid`)
 * прави същото като бутона „Потвърди плащането" в админ панела: активира
 * плана и удължава `expiresAt` до края на платения период. Отказ от
 * автоматичното плащане спира следващите таксувания; достъпът остава до
 * края на вече платения месец и после изтича както при банковия превод.
 *
 * Сумата НЕ се взима от `subscriptionFeeEur` (клиентът може да я пише), а се
 * смята тук от плана и броя обекти — `planFeeEur`.
 *
 * Полета в `users/{email}`: `stripeCustomerId`, `stripeSubscriptionId`,
 * `autoRenew` (true = следващият месец ще се таксува автоматично).
 */

import { FieldValue } from "firebase-admin/firestore";
import type Stripe from "stripe";
import { adminDb } from "@/lib/firebaseAdmin";
import { stripe } from "@/lib/stripe";
import { sendTelegramNotification } from "@/lib/telegram";
import { SITE_URL } from "@/lib/siteConfig";
import { PLAN_BY_ID, PlanId, effectivePlan, isPlanId, planFeeEur } from "@/lib/plans";
import { siteCountOf } from "@/lib/sites";

interface SubscriberDoc {
  email: string;
  status?: string;
  subscriptionStatus?: string;
  plan?: string;
  requestedPlan?: string;
  expiresAt?: string;
  sites?: unknown[];
  stripeCustomerId?: string;
  stripeSubscriptionId?: string;
  autoRenew?: boolean;
}

const ACTIVE_SUB_STATUSES: Stripe.Subscription.Status[] = ["active", "trialing", "past_due"];

function userRef(email: string) {
  return adminDb().collection("users").doc(email.trim().toLowerCase());
}

async function loadUser(email: string): Promise<SubscriberDoc> {
  const snap = await userRef(email).get();
  if (!snap.exists) throw new Error("user_not_found");
  return { ...(snap.data() as SubscriberDoc), email: snap.id };
}

/** Планът и месечната сума, които трябва да плаща профилът сега. */
function billingFor(u: SubscriberDoc): { plan: PlanId; feeEur: number; name: string } {
  const plan: PlanId = isPlanId(u.requestedPlan) ? u.requestedPlan : effectivePlan(u);
  const sites = siteCountOf(u as Parameters<typeof siteCountOf>[0]);
  return {
    plan,
    feeEur: planFeeEur(plan, sites),
    name: `БАБХ Спокойствие — план „${PLAN_BY_ID[plan].name}“${sites > 1 ? ` (${sites} обекта)` : ""}`,
  };
}

const todayISO = () => new Date().toISOString().slice(0, 10);
const unixToISODate = (t: number) => new Date(t * 1000).toISOString().slice(0, 10);

/** Текущият Stripe абонамент на профила, ако още се таксува. */
async function activeSubscription(u: SubscriberDoc): Promise<Stripe.Subscription | null> {
  if (!u.stripeSubscriptionId) return null;
  try {
    const sub = await stripe().subscriptions.retrieve(u.stripeSubscriptionId);
    if (sub.metadata?.email !== u.email) return null;
    return ACTIVE_SUB_STATUSES.includes(sub.status) ? sub : null;
  } catch {
    return null;
  }
}

/**
 * Checkout за автоматично месечно плащане. Ако профилът вече е платил текущия
 * месец (по банков път) и не сменя плана, първото таксуване е в деня, в който
 * изтича платеното — клиентът не губи дни.
 */
export async function createSubscriptionCheckout(email: string): Promise<string> {
  const u = await loadUser(email);
  if (await activeSubscription(u)) throw new Error("already_subscribed");
  const { plan, feeEur, name } = billingFor(u);

  const paidUntil =
    u.status === "approved" && u.subscriptionStatus === "approved" && u.expiresAt && u.expiresAt >= todayISO()
      ? new Date(`${u.expiresAt}T12:00:00Z`).getTime() / 1000
      : 0;
  const samePlan = !isPlanId(u.requestedPlan) || u.requestedPlan === effectivePlan(u);
  // Stripe приема отложено първо таксуване поне 48 часа напред.
  const firstChargeAt = samePlan && paidUntil > Date.now() / 1000 + 49 * 3600 ? Math.floor(paidUntil) : undefined;

  const metadata = { kind: "subscription", email: u.email, plan };
  const session = await stripe().checkout.sessions.create({
    mode: "subscription",
    locale: "bg",
    ...(u.stripeCustomerId ? { customer: u.stripeCustomerId } : { customer_email: u.email }),
    line_items: [
      {
        quantity: 1,
        price_data: {
          currency: "eur",
          unit_amount: Math.round(feeEur * 100),
          recurring: { interval: "month" },
          product_data: { name },
        },
      },
    ],
    metadata,
    subscription_data: { metadata, ...(firstChargeAt ? { trial_end: firstChargeAt } : {}) },
    success_url: `${SITE_URL}/pay/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${SITE_URL}/profile`,
  });
  if (!session.url) throw new Error("no_checkout_url");
  return session.url;
}

/**
 * Привежда автоматичното плащане в съответствие с профила — след смяна на
 * плана или на броя обекти. Разликата за текущия месец се таксува (или
 * кредитира) веднага; новият план се активира от `invoice.paid`.
 * Връща false, ако профилът няма активно автоматично плащане.
 */
export async function syncSubscription(email: string): Promise<boolean> {
  const u = await loadUser(email);
  const sub = await activeSubscription(u);
  if (!sub) return false;
  const { plan, feeEur, name } = billingFor(u);
  const item = sub.items.data[0];
  const sameAmount = item?.price?.unit_amount === Math.round(feeEur * 100);
  if (sameAmount && sub.metadata?.plan === plan) {
    // Заявен е планът, който вече се плаща — заявката е изпълнена.
    if (u.requestedPlan) {
      await userRef(u.email).update({ requestedPlan: FieldValue.delete(), planRequestedAt: FieldValue.delete() });
    }
    return true;
  }
  const productId = typeof item.price.product === "string" ? item.price.product : item.price.product.id;
  await stripe().products.update(productId, { name });
  await stripe().subscriptions.update(sub.id, {
    items: [
      {
        id: item.id,
        price_data: {
          currency: "eur",
          product: productId,
          unit_amount: Math.round(feeEur * 100),
          recurring: { interval: "month" },
        },
      },
    ],
    metadata: { ...sub.metadata, plan },
    // Докато чака първото таксуване (текущият месец е платен по банков път),
    // смяна на плана се таксува веднага, а само друг брой обекти — от следващия месец.
    ...(sub.status === "trialing"
      ? { proration_behavior: "none" as const, ...(sub.metadata?.plan !== plan ? { trial_end: "now" as const } : {}) }
      : { proration_behavior: "always_invoice" as const }),
  });
  return true;
}

/** Спира (или пуска отново) автоматичното таксуване от следващия месец. */
export async function setAutoRenew(email: string, on: boolean): Promise<boolean> {
  const u = await loadUser(email);
  const sub = await activeSubscription(u);
  if (!sub) return false;
  await stripe().subscriptions.update(sub.id, { cancel_at_period_end: !on });
  await userRef(u.email).update({ autoRenew: on });
  return true;
}

/** id на абонамента от фактура — полето е на различно място според версията на API-то. */
function invoiceSubscriptionId(invoice: Stripe.Invoice): string | null {
  const legacy = (invoice as unknown as { subscription?: string | { id: string } | null }).subscription;
  const fromParent = (
    invoice as unknown as { parent?: { subscription_details?: { subscription?: string | { id: string } } } }
  ).parent?.subscription_details?.subscription;
  const s = legacy ?? fromParent;
  return !s ? null : typeof s === "string" ? s : s.id;
}

/**
 * Платено месечно плащане (първото, подновяване или доплащане при смяна на
 * плана) → активира плана и удължава срока. Идемпотентно по id на фактурата.
 */
export async function applyPaidInvoice(invoice: Stripe.Invoice): Promise<{ title: string } | null> {
  const subId = invoiceSubscriptionId(invoice);
  if (!subId || !invoice.id) return null;
  const sub = await stripe().subscriptions.retrieve(subId);
  if (sub.metadata?.kind !== "subscription" || !sub.metadata.email) return null;
  const u = await loadUser(sub.metadata.email);
  const plan: PlanId = isPlanId(sub.metadata.plan) ? sub.metadata.plan : effectivePlan(u);
  const title = `План „${PLAN_BY_ID[plan].name}“`;
  const customerId = typeof sub.customer === "string" ? sub.customer : sub.customer.id;

  const link = {
    stripeCustomerId: customerId,
    stripeSubscriptionId: sub.id,
    autoRenew: !sub.cancel_at_period_end,
  };

  // Първата фактура с отложено таксуване е 0 € — само свързваме картата;
  // срокът и планът остават, докато не дойде истинско плащане.
  const deferredStart = invoice.billing_reason === "subscription_create" && (invoice.amount_paid || 0) === 0;
  const periodEnd = Math.max(0, ...invoice.lines.data.map((l) => l.period?.end || 0));
  const paidUntil = periodEnd ? unixToISODate(periodEnd) : undefined;
  const expiresAt = [u.expiresAt, paidUntil].filter((x): x is string => !!x).sort().pop();

  const purchaseRef = adminDb().collection("purchases").doc(invoice.id);
  if ((await purchaseRef.get()).exists) return { title };

  await userRef(u.email).update(
    deferredStart
      ? link
      : {
          ...link,
          status: "approved",
          subscriptionStatus: "approved",
          plan,
          subscriptionPaidAt: new Date().toISOString(),
          ...(expiresAt ? { expiresAt } : {}),
          ...(u.requestedPlan === plan ? { requestedPlan: FieldValue.delete(), planRequestedAt: FieldValue.delete() } : {}),
        }
  );

  // Нов абонамент замества стар (напр. след изтекла карта) — старият не бива да таксува повторно.
  if (u.stripeSubscriptionId && u.stripeSubscriptionId !== sub.id) {
    await stripe()
      .subscriptions.cancel(u.stripeSubscriptionId)
      .catch(() => null);
  }

  const amountPaidEur = (invoice.amount_paid || 0) / 100;
  const now = new Date().toISOString();
  try {
    await purchaseRef.create({
      id: invoice.id,
      kind: "subscription",
      buyerEmail: u.email,
      plan,
      stripeSubscriptionId: sub.id,
      amountPaidEur,
      paidUntil: paidUntil ?? null,
      status: "paid",
      paidAt: now,
      createdAt: now,
    });
  } catch {
    return { title }; // webhook-ът и страницата за успех стигнаха дотук едновременно
  }
  if (deferredStart) {
    await sendTelegramNotification(
      `💳 <b>Автоматично плащане включено</b>\n${title}\n${u.email}\nпърво таксуване на ${u.expiresAt}`
    ).catch(() => false);
    return { title };
  }

  await userRef(u.email).update({
    messages: FieldValue.arrayUnion({
      id: `msg_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
      sender: "admin",
      text: `Здравейте! Плащането с карта (${amountPaidEur.toFixed(2)} €) е получено и абонаментът „${PLAN_BY_ID[plan].name}“ е активен до ${expiresAt}. Благодарим Ви!`,
      sentAt: now,
    }),
  });
  await sendTelegramNotification(
    `💳 <b>Абонамент платен с карта</b>\n${title}\n${u.email}\n${amountPaidEur.toFixed(2)} € · активен до ${expiresAt}`
  ).catch(() => false);
  return { title };
}

/** Върнат от Checkout (страницата за успех) — активира веднага, без да чака webhook-а. */
export async function applySubscriptionCheckout(session: Stripe.Checkout.Session): Promise<{ title: string } | null> {
  if (session.metadata?.kind !== "subscription" || !session.invoice) return null;
  const invoiceId = typeof session.invoice === "string" ? session.invoice : session.invoice.id;
  const invoice = await stripe().invoices.retrieve(invoiceId);
  if (invoice.status !== "paid") return null;
  return applyPaidInvoice(invoice);
}

/** Неуспешно месечно таксуване — Stripe опитва пак; казваме на админа и на клиента. */
export async function notifyFailedInvoice(invoice: Stripe.Invoice): Promise<void> {
  const subId = invoiceSubscriptionId(invoice);
  if (!subId) return;
  const sub = await stripe().subscriptions.retrieve(subId);
  if (sub.metadata?.kind !== "subscription" || !sub.metadata.email) return;
  const email = sub.metadata.email;
  // Само при първия неуспешен опит, не при всеки повторен.
  if ((invoice.attempt_count || 1) > 1) return;
  await userRef(email)
    .update({
      messages: FieldValue.arrayUnion({
        id: `msg_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
        sender: "admin",
        text: "Здравейте! Месечното плащане с карта не мина. Проверете картата си — Stripe ще опита отново в следващите дни. Ако плащането не мине, абонаментът ще изтече в края на платения период.",
        sentAt: new Date().toISOString(),
      }),
    })
    .catch(() => null);
  await sendTelegramNotification(
    `⚠️ <b>Неуспешно таксуване на абонамент</b>\n${email}\n${((invoice.amount_due || 0) / 100).toFixed(2)} €`
  ).catch(() => false);
}

/** Абонаментът е спрян/прекратен в Stripe (от клиента, от таблото или след неуспешни опити). */
export async function syncSubscriptionState(sub: Stripe.Subscription): Promise<void> {
  if (sub.metadata?.kind !== "subscription" || !sub.metadata.email) return;
  const snap = await userRef(sub.metadata.email).get();
  if (!snap.exists || (snap.data() as SubscriberDoc).stripeSubscriptionId !== sub.id) return;
  const running = ACTIVE_SUB_STATUSES.includes(sub.status) && !sub.cancel_at_period_end;
  await snap.ref.update({ autoRenew: running });
}
