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
import { adminAuth, adminDb, adminStorage } from "@/lib/firebaseAdmin";
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
  phone?: string;
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
  /**
   * digital — цифрово съдържание с достъп веднага (губи се правото на отказ);
   * service — услуга (live обучение, консултация).
   */
  consentKind: "digital" | "service";
  /** Идентификаторите, които отключват продукта в профила. */
  grantIds: string[];
  /** Къде да отиде клиентът след плащане — направо в купеното, ако е готово. */
  href: string;
  /** Няма какво да се отвори веднага (live курс, консултация, още некачен файл) — какво следва. */
  next?: string;
}

const MY_COURSES = "/profile?tab=courses";

/** Качен ли е поне един файл за материала (PDF/видео в Storage). */
async function hasUploadedFile(...ids: string[]): Promise<boolean> {
  const bucket = adminStorage().bucket();
  for (const id of ids) {
    for (const prefix of [`library/${id}/`, `courses/${id}/`]) {
      const [files] = await bucket.getFiles({ prefix, maxResults: 1 }).catch(() => [[]] as [unknown[]]);
      if (files.length) return true;
    }
  }
  return false;
}

const NOT_UPLOADED_NEXT =
  "Материалът се подготвя за качване. Д-р Николова е уведомена и ще Ви пише в чата на профила, щом е готов — ще го намерите в „Моите обучения“.";

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
    const when = enr.date ? ` за ${enr.date}${enr.time ? ` в ${enr.time}` : ""}` : "";
    return pkg
      ? {
          title: pkg.name,
          priceEur: bookingPriceEur(pkg),
          grantIds: [],
          href: "/profile",
          consentKind: "service",
          next: `Часът${when} е запазен. Д-р Николова ще го потвърди и ще получите линк за срещата на имейла и в чата на профила.`,
        }
      : null;
  }
  const bundle = resolveBundleIds(id);

  const material = LIBRARY_MATERIALS.find((m) => m.slug === id);
  if (material) {
    return {
      title: material.title,
      priceEur: (await priceOverride(material.slug)) ?? material.priceEur,
      grantIds: [material.slug, ...bundle],
      // Същите пътища като бутоните „Отвори“ в „Моите обучения“.
      href:
        (material.items && material.items.length > 1) || material.slug === "video-etiketirane"
          ? `/courses/${material.slug}/viewer`
          : `/library/${material.slug}/viewer`,
      consentKind: "digital",
      ...(bundle.length || material.items?.length || (material.downloadUrl && material.downloadUrl !== "#") || (await hasUploadedFile(material.slug))
        ? {}
        : { next: NOT_UPLOADED_NEXT }),
    };
  }

  const live = findLiveCourse(id);
  if (live) {
    return {
      title: live.title,
      priceEur: (await priceOverride(live.slug)) ?? live.priceEur,
      grantIds: [live.slug],
      href: MY_COURSES,
      consentKind: "service",
      next: `Мястото Ви в групата е запазено. Когато групата се събере, ще получите датата и линк за ${live.platform === "google-meet" ? "Google Meet" : "Zoom"} на имейла и в чата на профила.${live.nextBatch ? ` Следващ поток: ${live.nextBatch}.` : ""}`,
    };
  }

  const db = adminDb();
  let tr = await db.collection("trainings").doc(id).get();
  if (!tr.exists) {
    const bySlug = await db.collection("trainings").where("slug", "==", id).limit(1).get();
    if (!bySlug.empty) tr = bySlug.docs[0];
  }
  if (tr.exists) {
    const t = tr.data() as { id?: string; slug?: string; title?: string; priceEur?: number; type?: string };
    if (typeof t.priceEur !== "number") return null;
    const video = t.type === "video";
    return {
      title: t.title || enr.trainingTitle,
      priceEur: t.priceEur,
      grantIds: [id, tr.id, t.slug].filter((x): x is string => !!x),
      href: video ? `/courses/${t.slug || tr.id}/viewer` : MY_COURSES,
      consentKind: video ? "digital" : "service",
      ...(video
        ? (await hasUploadedFile(t.slug || tr.id, tr.id)) ? {} : { next: NOT_UPLOADED_NEXT }
        : { next: "Мястото Ви е запазено. Д-р Николова ще Ви изпрати датата и линк за обучението на имейла и в чата на профила." }),
    };
  }

  // Старият каталог /courses/[id] (Firestore `courses`).
  const course = await db.collection("courses").doc(id).get();
  if (course.exists) {
    const c = course.data() as { title?: string; priceEur?: number; published?: boolean; slug?: string; items?: unknown[]; filePath?: string; externalUrl?: string };
    if (typeof c.priceEur !== "number" || c.published === false) return null;
    const ready = !!(c.items?.length || c.filePath || c.externalUrl) || (await hasUploadedFile(c.slug || id, id));
    return {
      title: c.title || enr.trainingTitle,
      priceEur: c.priceEur,
      grantIds: [id],
      href: `/courses/${c.slug || id}/viewer`,
      consentKind: "digital",
      ...(ready ? {} : { next: NOT_UPLOADED_NEXT }),
    };
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
  // Доказателство за съгласието, дадено преди плащането (ЗЗП чл. 57).
  const consentAt = new Date().toISOString();
  await snap.ref.set({ consentAt, consentKind: product.consentKind }, { merge: true });
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
    metadata: { kind: "enrollment", enrollmentId: enr.id, consent: product.consentKind, consentAt },
    payment_intent_data: { metadata: { kind: "enrollment", enrollmentId: enr.id, consent: product.consentKind } },
    success_url: `${SITE_URL}/pay/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${SITE_URL}${back}`,
  });
  if (!session.url) throw new Error("no_checkout_url");
  return session.url;
}

/** Отключва платения пакет в профила — като бутона „Получено плащане" в админ панела. */
/**
 * `users/{email}` за купувача. Ако записът липсва, но има акаунт за вход
 * (напр. профилът е изтрит от админ панела, а входът е останал), се създава
 * наново — иначе платеното няма къде да се запише. Без акаунт → null: празен
 * профил тук би се сблъскал с регистрацията (тя създава записа сама).
 */
async function ensureUserDoc(email: string, enr?: Pick<EnrollmentDoc, "fullName" | "phone">) {
  const clean = email.trim().toLowerCase();
  const userRef = adminDb().collection("users").doc(clean);
  if ((await userRef.get()).exists) return userRef;
  const account = await adminAuth().getUserByEmail(clean).catch(() => null);
  // Току-що създаден акаунт: регистрацията още пише профила си — не се пречи.
  if (!account || Date.now() - new Date(account.metadata.creationTime).getTime() < 10 * 60_000) return null;
  const name = enr?.fullName?.trim() || account.displayName || "";
  await userRef.create({
    email: clean,
    firmName: "",
    eik: "",
    contact: name,
    phone: enr?.phone?.trim() || "",
    sector: "",
    niche: "",
    desc: "",
    address: "",
    manager: name,
    status: "approved",
    subscriptionStatus: "none",
    role: "user",
    assignedDocs: [],
    messages: [],
    purchasedCourseIds: [],
    createdAt: new Date().toISOString(),
  }).catch(() => null); // създаден междувременно — пак става
  return userRef;
}

async function unlockEnrollment(
  enr: EnrollmentDoc,
  product: Product | null,
  paid: { paidAt: string } & Record<string, unknown>
): Promise<void> {
  const db = adminDb();
  const grantIds = Array.from(new Set([enr.trainingId, ...(product?.grantIds || [])]));
  // Без профил (live курс, заявен като гост) отключването се довършва при
  // регистрацията — `syncPaidAccess`.
  const userRef = await ensureUserDoc(enr.email, enr);
  if (userRef) await userRef.update({ purchasedCourseIds: FieldValue.arrayUnion(...grantIds) });
  await db
    .collection("enrollments")
    .doc(enr.id)
    .set({ status: "access_granted", accessGrantedAt: paid.paidAt, ...paid }, { merge: true });
}

/**
 * Довършва отключването на всичко, платено с карта от този имейл. Нужно е,
 * когато плащането е минало преди профилът да съществува (live курс, платен
 * като гост, или профил, създаден наново) — профилът го вика при вход.
 * Връща колко нови пакета е добавил.
 */
export async function syncPaidAccess(email: string): Promise<number> {
  const db = adminDb();
  const clean = email.trim().toLowerCase();
  const paid = await db.collection("enrollments").where("email", "==", clean).where("paidVia", "==", "card").get();
  if (paid.empty) return 0;
  const userRef = await ensureUserDoc(clean, paid.docs[0].data() as EnrollmentDoc);
  if (!userRef) return 0;
  const owned = new Set<string>((((await userRef.get()).data() as { purchasedCourseIds?: string[] }).purchasedCourseIds) || []);

  const missing = new Set<string>();
  for (const d of paid.docs) {
    const enr = { ...(d.data() as EnrollmentDoc), id: d.id };
    if (isBooking(enr) || enr.status === "refunded") continue;
    const product = await productForEnrollment(enr);
    for (const id of [enr.trainingId, ...(product?.grantIds || [])]) if (!owned.has(id)) missing.add(id);
  }
  if (missing.size) await userRef.update({ purchasedCourseIds: FieldValue.arrayUnion(...missing) });
  return missing.size;
}

/**
 * Изцяло възстановено плащане (напр. при отказ от договора) → заявката става
 * `refunded` и пакетът се заключва отново. Пазят се идентификаторите, които
 * клиентът има и по друга платена/отключена заявка (напр. част от пакет).
 */
export async function revokeRefundedEnrollment(charge: Stripe.Charge): Promise<void> {
  if (!charge.refunded || !charge.payment_intent) return;
  const piId = typeof charge.payment_intent === "string" ? charge.payment_intent : charge.payment_intent.id;
  const pi = await stripe().paymentIntents.retrieve(piId);
  if (pi.metadata?.kind !== "enrollment" || !pi.metadata.enrollmentId) return;

  const db = adminDb();
  const enrRef = db.collection("enrollments").doc(pi.metadata.enrollmentId);
  const enrSnap = await enrRef.get();
  if (!enrSnap.exists || enrSnap.data()?.status === "refunded") return;
  const enr = { ...(enrSnap.data() as EnrollmentDoc), id: enrSnap.id };
  const email = enr.email.trim().toLowerCase();
  await enrRef.set({ status: "refunded", refundedAt: new Date().toISOString() }, { merge: true });
  if (isBooking(enr)) {
    if (enr.bookingId) await db.collection("bookings").doc(enr.bookingId).set({ refundedAt: new Date().toISOString() }, { merge: true });
  } else {
    const product = await productForEnrollment(enr);
    const revoke = new Set([enr.trainingId, ...(product?.grantIds || [])]);
    const others = await db.collection("enrollments").where("email", "==", email).where("status", "==", "access_granted").get();
    for (const d of others.docs) {
      if (d.id === enr.id) continue;
      const other = { ...(d.data() as EnrollmentDoc), id: d.id };
      const p = await productForEnrollment(other);
      for (const id of [other.trainingId, ...(p?.grantIds || [])]) revoke.delete(id);
    }
    const userRef = db.collection("users").doc(email);
    if (revoke.size && (await userRef.get()).exists) {
      await userRef.update({ purchasedCourseIds: FieldValue.arrayRemove(...revoke) });
    }
  }
  await sendTelegramNotification(
    `↩️ <b>Възстановено плащане</b>\n${enr.trainingTitle}\n${email}\n${((charge.amount_refunded || 0) / 100).toFixed(2)} € · достъпът е спрян`
  ).catch(() => false);
}

/**
 * Отключва платената заявка. Вика се от webhook-а и от страницата за успех
 * (която проверява сесията директно в Stripe, ако webhook-ът закъснее).
 */
export async function grantPaidEnrollment(
  session: Stripe.Checkout.Session
): Promise<{ title: string; href: string; next?: string } | null> {
  if (session.metadata?.kind !== "enrollment" || session.payment_status !== "paid") return null;
  const enrollmentId = session.metadata.enrollmentId;
  const db = adminDb();
  const enrRef = db.collection("enrollments").doc(enrollmentId);
  const enrSnap = await enrRef.get();
  if (!enrSnap.exists) throw new Error(`Enrollment not found: ${enrollmentId}`);
  const enr = { ...(enrSnap.data() as EnrollmentDoc), id: enrSnap.id };
  const product = await productForEnrollment(enr);
  const result = { title: product?.title || enr.trainingTitle, href: product?.href || "/profile", next: product?.next };

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
      title: result.title,
      itemKind: isBooking(enr) ? "booking" : enr.packageKind || enr.trainingType || "",
      buyerEmail: email,
      buyerName: enr.fullName || "",
      stripeSessionId: session.id,
      amountPaidEur,
      status: "paid",
      paidAt: now,
      createdAt: now,
      // Новите покупки светят в админ менюто, докато админът не ги отвори.
      seenByAdmin: false,
    });
  } catch {
    return result;
  }

  await sendTelegramNotification(
    `💳 <b>Платено с карта</b>\n${result.title}\n${enr.fullName || ""} — ${email}\n${amountPaidEur.toFixed(2)} € · ` +
      (isBooking(enr)
        ? `час ${enr.date || "?"} ${enr.time || ""} — потвърдете го на клиента`
        : result.next === NOT_UPLOADED_NEXT
          ? "⚠️ файлът още НЕ е качен — качете го и пишете на клиента"
          : "отключено автоматично")
  ).catch(() => false);
  return result;
}
