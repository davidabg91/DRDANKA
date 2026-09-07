import { NextRequest, NextResponse } from "next/server";
import { sendTelegramNotification } from "@/lib/telegram";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { type, data } = body || {};

    if (!data) {
      return NextResponse.json({ error: "missing_data" }, { status: 400 });
    }

    const nowStr = new Date().toLocaleString("bg-BG", {
      timeZone: "Europe/Sofia",
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

    let message = "";

    if (type === "enrollment") {
      const isVideo = data.contentType === "video" || data.trainingType === "video";
      const isZoom = data.trainingType === "zoom";
      const kindLabel = isZoom ? "📹 Live обучение (Zoom)" : isVideo ? "🎬 Видео курс" : "📄 PDF Наръчник / Материал";

      message =
        `🔔 <b>НОВО ЗАПИСВАНЕ ЗА ОБУЧЕНИЕ</b>\n\n` +
        `📚 <b>Курс:</b> ${data.trainingTitle || data.courseTitle || "Обучение"}\n` +
        `📦 <b>Тип:</b> ${kindLabel}\n` +
        `👤 <b>Име:</b> ${data.fullName || data.name || "Няма име"}\n` +
        `📧 <b>Имейл:</b> ${data.email}\n` +
        `📞 <b>Телефон:</b> ${data.phone || "Няма"}\n` +
        (data.company ? `🏢 <b>Фирма:</b> ${data.company}\n` : "") +
        `💰 <b>Цена:</b> ${(Number(data.priceEur) || 0).toFixed(2)} €\n` +
        `🕒 <b>Дата:</b> ${nowStr} ч.\n\n` +
        `👉 <a href="https://drdanka.bg/profile">Отвори Админ Панела (Записани)</a>`;
    } else if (type === "booking") {
      message =
        `🔔 <b>НОВА РЕЗЕРВАЦИЯ ЗА КОНСУЛТАЦИЯ</b>\n\n` +
        `📋 <b>Услуга:</b> ${data.packageName || "Онлайн консултация"}\n` +
        `👤 <b>Име:</b> ${data.name || "Няма име"}\n` +
        `📧 <b>Имейл:</b> ${data.email}\n` +
        `📞 <b>Телефон:</b> ${data.phone || "Няма"}\n` +
        (data.date ? `📅 <b>Желана дата/час:</b> ${data.date} в ${data.time || ""} ч.\n` : "") +
        (data.company ? `🏢 <b>Обект:</b> ${data.company}\n` : "") +
        (data.note ? `📝 <b>Бележка:</b> ${data.note}\n` : "") +
        `💰 <b>Сума:</b> ${data.price || "0 €"}\n` +
        `🕒 <b>Дата:</b> ${nowStr} ч.\n\n` +
        `👉 <a href="https://drdanka.bg/profile">Отвори Админ Панела (Консултации)</a>`;
    } else if (type === "message") {
      message =
        `💬 <b>НОВО СЪОБЩЕНИЕ В ЧАТА</b>\n\n` +
        `👤 <b>От:</b> ${data.senderName || data.senderEmail}\n` +
        `📧 <b>Имейл:</b> ${data.senderEmail}\n` +
        `💬 <b>Съобщение:</b>\n<i>${data.text || ""}</i>\n\n` +
        `🕒 <b>Дата:</b> ${nowStr} ч.\n\n` +
        `👉 <a href="https://drdanka.bg/profile">Отвори Чата в Админ Панела</a>`;
    } else if (type === "trial") {
      message =
        `🎁 <b>НОВА ЗАЯВКА ЗА ТЕСТ ПЕРИОД</b>\n\n` +
        `👤 <b>Име:</b> ${data.fullName || data.name}\n` +
        `📧 <b>Имейл:</b> ${data.email}\n` +
        `📞 <b>Телефон:</b> ${data.phone}\n` +
        `🏢 <b>Фирма:</b> ${data.firmName || data.company || "Няма"}\n` +
        `🕒 <b>Дата:</b> ${nowStr} ч.\n\n` +
        `👉 <a href="https://drdanka.bg/profile">Отвори Админ Панела (Кандидати)</a>`;
    } else {
      message = data.text || `🔔 Ново събитие в сайта drdanka.bg (${nowStr})`;
    }

    const sent = await sendTelegramNotification(message);
    return NextResponse.json({ success: sent });
  } catch (err: any) {
    console.error("Telegram notify API error:", err);
    return NextResponse.json({ error: err?.message || String(err) }, { status: 500 });
  }
}
