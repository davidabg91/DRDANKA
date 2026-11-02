import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/lib/firebaseAdmin";
import { SITE_URL } from "@/lib/siteConfig";
import { verifyUnsubscribe } from "@/lib/reminderEmail";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Отписване от имейл напомнянията за дневниците.
 *
 * GET показва страница с бутон (програмите, които проверяват линковете в
 * пощата, не бива да отписват сами), POST изключва напомнянията — от бутона
 * или директно от пощенския клиент (List-Unsubscribe-Post: One-Click).
 * Линкът е подписан (HMAC), така че никой не може да отпише чужд имейл.
 */

function page(title: string, body: string, status = 200) {
  const html = `<!doctype html><html lang="bg"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${title}</title></head>
<body style="margin:0;background:#F3EAD9;font-family:Arial,sans-serif;color:#1B2421;">
<div style="max-width:480px;margin:48px auto;padding:0 16px;">
<div style="background:#fff;border-radius:20px;overflow:hidden;">
<div style="background:#0F382B;color:#FAF6EE;padding:22px 26px;font:700 20px/1.3 Georgia,serif;">${title}</div>
<div style="padding:22px 26px;font-size:14px;line-height:1.6;">${body}</div>
</div></div></body></html>`;
  return new NextResponse(html, { status, headers: { "Content-Type": "text/html; charset=utf-8" } });
}

function params(req: NextRequest) {
  return {
    email: req.nextUrl.searchParams.get("e") || "",
    token: req.nextUrl.searchParams.get("t") || "",
  };
}

export async function GET(req: NextRequest) {
  const { email, token } = params(req);
  if (!verifyUnsubscribe(email, token)) {
    return page("Невалиден линк", "Линкът за отписване не е валиден или е непълен.", 400);
  }
  const action = `${SITE_URL}/api/email-reminders/unsubscribe?e=${encodeURIComponent(email)}&t=${encodeURIComponent(token)}`;
  return page(
    "Спиране на напомнянията",
    `<p>Да спрем ли вечерните имейл напомняния за дневниците на <strong>${email.replace(/</g, "&lt;")}</strong>?</p>
<form method="post" action="${action}"><button type="submit" style="background:#0F382B;color:#fff;border:0;border-radius:12px;padding:13px 24px;font-weight:700;font-size:14px;cursor:pointer;">Спри напомнянията</button></form>
<p style="color:#6B6F69;font-size:12px;margin-top:18px;">Можете да ги включите отново по всяко време от „Днешен план“ в дневниците.</p>`
  );
}

export async function POST(req: NextRequest) {
  const { email, token } = params(req);
  if (!verifyUnsubscribe(email, token)) {
    return page("Невалиден линк", "Линкът за отписване не е валиден или е непълен.", 400);
  }
  const ref = adminDb().collection("users").doc(email);
  if (!(await ref.get()).exists) return page("Няма такъв профил", "Не намерихме профил с този имейл.", 404);
  await ref.update({ emailReminders: false });
  return page(
    "Напомнянията са спрени",
    `<p>Повече няма да получавате вечерни имейл напомняния.</p>
<p>Ако размислите, включете ги от „Днешен план“ в <a href="${SITE_URL}/profile" style="color:#0F382B;">дневниците</a>.</p>`
  );
}
