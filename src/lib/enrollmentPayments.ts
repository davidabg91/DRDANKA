/**
 * Плащане с карта (Stripe Checkout) на заявка от `enrollments` — наръчници,
 * книги, обучения и live курсове — и автоматичното ѝ отключване.
 *
 * Сървърен модул. Цената НЕ се взима от заявката (клиентът я пише сам), а
 * се изчислява тук от каталога: LIBRARY_MATERIALS / LIVE_COURSES + цените,
 * сменени от администратора (`priceOverrides`), или Firestore `trainings`.
 *
 * Отключването прави същото като бутона „Получено плащане" в админ панела:
 * добавя идентификаторите на пакета в `users/{email}.purchasedCourseIds` и
 * маркира заявката `access_granted`. Идемпотентно по id на Stripe сесията.
 */

import { FieldValue } from "firebase-admin/firestore";
import type Stripe from "stripe";
import { adminDb } from "@/lib/firebaseAdmin";
import { stripe } from "@/lib/stripe";
import { sendTelegramNotification } from "@/lib/telegram";
import { SITE_URL } from "@/lib/siteConfig";
import { LIBRARY_MATERIALS } from "@/data/library";
import { resolveBundleIds } from "@/data/library/bundles";
import { findLiveCourse } from "@/data/live-courses";
import { bookingPriceEur, findBookingPackage } from "@/data/consultations";

export const CARD_PAYMENTS_ENABLED = () => !!process.env.STRIPE_SECRET_KEY;

interface EnrollmentDoc {
  id: string;
  trainingId: string;
  trainingTitle: string;
  email: string;
  fullName?: string;
  status?: string;
  trainingType?: string;
  packageKind?: string;
  /** Записът в `bookings` за консултациите от календара. */
  bookingId?: string;
  date?: string;
  time?: string;
}

/** Консултация / присъствено обучение от календара — плащането не отключва нищо, а потвърждава часа. */
function isBooking(enr: EnrollmentDoc): boolean {
  return enr.trainingType === "consultation" || enr.packageKind === "consultation";
}

interface Product {
  title: string;
  priceEur: number;
  /** Идентификаторите, които отключват продукта в профила. */
  grantIds: string[];
  /** Къде да отиде клиентът след плащане. */
  href: string;
}

async function priceOverride(slug: string): Promise<number | undefined> {
  const snap = await adminDb().collection("priceOverrides").doc(slug).get();
  const v = snap.exists ? (snap.data() as { priceEur?: unknown }).priceEur : undefined;
  return typeof v === "number" ? v : undefined;
}

/** Продуктът зад заявката — с цена от каталога, не от заявката. */
export async function productForEnrollment(enr: EnrollmentDoc): Promise<Product | null> {
  const id = enr.trainingId;
  if (isBooking(enr)) {
    const pkg = findBookingPackage(id);
    return pkg ? { title: pkg.name, priceEur: bookingPriceEur(pkg), grantIds: [], href: "/profile" } : null;
  }
  const bundle = resolveBundleIds(id);

  const material = LIBRARY_MATERIALS.find((m) => m.slug === id);
  if (material) {
    return {
      title: material.title,
      priceEur: (await priceOverride(material.slug)) ?? material.priceEur,
      grantIds: [material.slug, ...bundle],
      href: "/profile",
    };
  }

  const live = findLiveCourse(id);
  if (live) {
    return {
      title: live.title,
      priceEur: (await priceOverride(live.slug)) ?? live.priceEur,
      grantIds: [live.slug],
      href: "/profile",
    };
  }

  const db = adminDb();
  let tr = await db.collection("trainings").doc(id).get();
  if (!tr.exists) {
    const bySlug = await db.collection("trainings").where("slug", "==", id).limit(1).get();
    if (!bySlug.empty) tr = bySlug.docs[0];
  }
  if (tr.exists) {
    const t = tr.data() as { id?: string; slug?: string; title?: string; priceEur?: number };
    if (typeof t.priceEur !== "number") return null;
    return {
      title: t.title || enr.trainingTitle,
      priceEur: t.priceEur,
      grantIds: [id, tr.id, t.slug].filter((x): x is string => !!x),
      href: "/profile",
    };
  }

  // Старият каталог /courses/[id] (Firestore `courses`).
  const course = await db.collection("courses").doc(id).get();
  if (course.exists) {
    const c = course.data() as { title?: string; priceEur?: number; published?: boolean };
    if (typeof c.priceEur !== "number" || c.published === false) return null;
    return { title: c.title || enr.trainingTitle, priceEur: c.priceEur, grantIds: [id], href: "/profile" };
  }
  return null;
}

/** Stripe Checkout сесия за заявката. Връща URL към платежната страница. */
export async function createEnrollmentCheckout(enrollmentId: string, returnPath: string): Promise<string> {
  const snap = await adminDb().collection("enrollments").doc(enrollmentId).get();
  if (!snap.exists) throw new Error("enrollment_not_found");
  const enr = { ...(snap.data() as EnrollmentDoc), id: snap.id };
  if (enr.status === "access_granted" || (enr as { paidVia?: string }).paidVia === "card") throw new Error("already_paid");

  const product = await productForEnrollment(enr);
  if (!product || !(product.priceEur > 0)) throw new Error("product_not_found");

  const back = returnPath.startsWith("/") && !returnPath.startsWith("//") ? returnPath : "/profile";
  // Без payment_method_types Stripe показва всичко, включено в таблото —
  // карти, Apple Pay, Google Pay, Link.
  const session = await stripe().checkout.sessions.create({
    mode: "payment",
    locale: "bg",
    customer_email: enr.email,
    line_items: [
      {
        quantity: 1,
        price_data: {
          currency: "eur",
          unit_amount: Math.round(product.priceEur * 100),
          product_data: { name: product.title },
        },
      },
    ],
    metadata: { kind: "enrollment", enrollmentId: enr.id },
    payment_intent_data: { metadata: { kind: "enrollment", enrollmentId: enr.id } },
    success_url: `${SITE_URL}/pay/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${SITE_URL}${back}`,
  });
  if (!session.url) throw new Error("no_checkout_url");
  return session.url;
}

/** Отключва платения пакет в профила — като бутона „Получено плащане" в админ панела. */
async function unlockEnrollment(
  enr: EnrollmentDoc,
  product: Product | null,
  paid: { paidAt: string } & Record<string, unknown>
): Promise<void> {
  const db = adminDb();
  const grantIds = Array.from(new Set([enr.trainingId, ...(product?.grantIds || [])]));
  // Профилът се допълва само ако съществува — live курсът може да е заявен без
  // акаунт, а празен профил тук би се презаписал при по-късна регистрация.
  const userRef = db.collection("users").doc(enr.email.trim().toLowerCase());
  if ((await userRef.get()).exists) {
    await userRef.update({ purchasedCourseIds: FieldValue.arrayUnion(...grantIds) });
  }
  await db
    .collection("enrollments")
    .doc(enr.id)
    .set({ status: "access_granted", accessGrantedAt: paid.paidAt, ...paid }, { merge: true });
}

/**
 * Отключва платената заявка. Вика се от webhook-а и от страницата за успех
 * (която проверява сесията директно в Stripe, ако webhook-ът закъснее).
 */
export async function grantPaidEnrollment(session: Stripe.Checkout.Session): Promise<{ title: string; href: string } | null> {
  if (session.metadata?.kind !== "enrollment" || session.payment_status !== "paid") return null;
  const enrollmentId = session.metadata.enrollmentId;
  const db = adminDb();
  const enrRef = db.collection("enrollments").doc(enrollmentId);
  const enrSnap = await enrRef.get();
  if (!enrSnap.exists) throw new Error(`Enrollment not found: ${enrollmentId}`);
  const enr = { ...(enrSnap.data() as EnrollmentDoc), id: enrSnap.id };
  const product = await productForEnrollment(enr);
  const result = { title: product?.title || enr.trainingTitle, href: product?.href || "/profile" };

  const purchaseRef = db.collection("purchases").doc(session.id);
  if ((await purchaseRef.get()).exists) return result; // вече отключено

  const email = enr.email.trim().toLowerCase();
  const amountPaidEur = (session.amount_total || 0) / 100;
  const now = new Date().toISOString();
  const paid = { paidVia: "card", paidAt: now, stripeSessionId: session.id, amountPaidEur };

  if (isBooking(enr)) {
    // Часът още чака потвърждение от д-р Николова — статусът не се пипа,
    // само се отбелязва платено (в заявката и в записа в `bookings`).
    await enrRef.set(paid, { merge: true });
    if (enr.bookingId) await db.collection("bookings").doc(enr.bookingId).set(paid, { merge: true });
  } else {
    await unlockEnrollment(enr, product, paid);
  }

  // Webhook-ът и страницата за успех може да стигнат дотук едновременно —
  // отключването по-горе е безопасно да мине два пъти, а `create` пропуска
  // втория запис, така че известието излиза веднъж.
  try {
    await purchaseRef.create({
      id: session.id,
      kind: "enrollment",
      enrollmentId: enr.id,
      courseId: enr.trainingId,
      buyerEmail: email,
      stripeSessionId: session.id,
      amountPaidEur,
      status: "paid",
      paidAt: now,
      createdAt: now,
    });
  } catch {
    return result;
  }

  await sendTelegramNotification(
    `💳 <b>Платено с карта</b>\n${result.title}\n${enr.fullName || ""} — ${email}\n${amountPaidEur.toFixed(2)} € · ` +
      (isBooking(enr) ? `час ${enr.date || "?"} ${enr.time || ""} — потвърдете го на клиента` : "отключено автоматично")
  ).catch(() => false);
  return result;
}
