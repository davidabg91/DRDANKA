import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/lib/firebaseAdmin";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const ADMIN_EMAIL = "d.nikolova.haccp@gmail.com";

/**
 * POST /api/notify-booking
 * Accepts booking details and guarantees both Firestore persistence (via Admin SDK)
 * and dispatches notification.
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      name,
      phone,
      email,
      note,
      packageId,
      packageName,
      duration,
      price,
      priceEur,
      date,
      time,
      mode,
    } = body || {};

    if (!name || !phone || !email) {
      return NextResponse.json({ error: "missing_fields" }, { status: 400 });
    }

    const cleanEmail = String(email).trim().toLowerCase();
    const bookingId = `booking_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
    const enrollId = `enroll_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
    const nowIso = new Date().toISOString();

    const bookingRecord = {
      id: bookingId,
      name: String(name).trim(),
      phone: String(phone).trim(),
      email: cleanEmail,
      note: String(note || "").trim(),
      packageId: String(packageId || "consultation"),
      packageName: String(packageName || "Онлайн консултация"),
      duration: String(duration || "30 минути"),
      price: String(price || "0 €"),
      priceEur: Number(priceEur || 0),
      date: String(date || ""),
      time: String(time || ""),
      mode: mode || "consultation",
      status: "pending",
      createdAt: nowIso,
    };

    const enrollmentRecord = {
      id: enrollId,
      trainingId: String(packageId || "consultation"),
      trainingTitle: String(packageName || "Онлайн консултация"),
      trainingType: "consultation",
      packageKind: "consultation",
      fullName: String(name).trim(),
      email: cleanEmail,
      phone: String(phone).trim(),
      priceEur: Number(priceEur || 0),
      duration: String(duration || "30 минути"),
      date: String(date || ""),
      time: String(time || ""),
      note: String(note || "").trim(),
      status: "pending",
      createdAt: nowIso,
    };

    // 1. Persist via Admin SDK to Firestore (bypasses all security rules)
    try {
      const db = adminDb();
      await Promise.all([
        db.collection("bookings").doc(bookingId).set(bookingRecord),
        db.collection("enrollments").doc(enrollId).set(enrollmentRecord),
      ]);
    } catch (adminErr) {
      console.error("Firestore Admin save warning (may need service account):", adminErr);
    }

    // 2. Dispatch email notification via free FormSubmit relay to Dr. Danka
    try {
      await fetch("https://formsubmit.co/ajax/" + encodeURIComponent(ADMIN_EMAIL), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          _subject: `🔔 Нова резервация за консултация: ${bookingRecord.name} (${bookingRecord.date} в ${bookingRecord.time} ч.)`,
          "Име на клиент": bookingRecord.name,
          "Телефон за връзка": bookingRecord.phone,
          "Имейл": bookingRecord.email,
          "Избрана услуга": `${bookingRecord.packageName} (${bookingRecord.duration})`,
          "Желана дата и час": `${bookingRecord.date} в ${bookingRecord.time} ч.`,
          "Сума": bookingRecord.price,
          "Въпрос / Бележка": bookingRecord.note || "Няма добавена бележка",
          "Дата на подаване": new Date(nowIso).toLocaleString("bg-BG"),
        }),
      }).catch((e) => console.error("FormSubmit email relay error:", e));
    } catch (emailErr) {
      console.error("Email notification dispatch error:", emailErr);
    }

    return NextResponse.json({
      success: true,
      bookingId,
      enrollId,
    });
  } catch (err: any) {
    console.error("Notify booking API error:", err);
    return NextResponse.json(
      { error: "internal_error", detail: err?.message || String(err) },
      { status: 500 }
    );
  }
}
