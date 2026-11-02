/**
 * Вечерният имейл с напомняне за дневниците: шаблон (HTML + текст),
 * изпращане през Resend и подписан линк за отписване.
 *
 * Сървърен модул — ползва се само от `/api/cron/register-reminders` и
 * `/api/email-reminders/unsubscribe`.
 *
 * Env: RESEND_API_KEY (без него нищо не се праща — само пробно изпълнение),
 * REMINDER_FROM (подател, по подразбиране адрес на домейна),
 * CRON_SECRET (защитава крон адреса и подписва линковете за отписване).
 */

import { createHmac, timingSafeEqual } from "node:crypto";
import { SITE_URL } from "@/lib/siteConfig";
import type { PlanTask } from "@/components/registers/dayTasks";
import type { Deadline } from "@/lib/registerReminders";

const DEFAULT_FROM = "Д-р Данка Николова <napomniane@mail.haccpspokoystvie.bg>";

const esc = (raw: unknown) =>
  String(raw ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

const plural = (n: number, one: string, many: string) => (n === 1 ? one : many);

export interface SiteReminder {
  siteName: string;
  tasks: PlanTask[];
}

export interface ReminderEmailInput {
  firmName: string;
  /** „неделя, 2 ноември". */
  dateLong: string;
  sites: SiteReminder[];
  deadlines: Deadline[];
  /** Фирмата има повече от един обект — тогава се показва и името на обекта. */
  multiSite: boolean;
  /** Обектът на всеки срок (по `Deadline.key`). */
  deadlineSite: Record<string, string>;
  unsubscribeUrl: string;
}

function fmt(iso: string): string {
  return `${iso.slice(8, 10)}.${iso.slice(5, 7)}.${iso.slice(0, 4)}`;
}

/** „ЛЗК на Иван е изтекла" / „Договорът „ДДД с X“ изтича след 7 дни" — без дата. */
function deadlineShort(d: Deadline): string {
  const subject = d.kind === "contract" ? `Договорът „${d.label}“` : d.label;
  if (d.daysLeft < 0) return `${subject} ${d.kind === "contract" ? "е изтекъл" : "е изтекла"}`;
  if (d.daysLeft === 0) return `${subject} изтича днес`;
  return `${subject} изтича след ${d.daysLeft} ${plural(d.daysLeft, "ден", "дни")}`;
}

function deadlineText(d: Deadline): string {
  if (d.daysLeft < 0) {
    return `${deadlineShort(d)} на ${fmt(d.validUntil)} — ${d.kind === "contract" ? "подновете го" : "необходима е нова заверка"}.`;
  }
  return `${deadlineShort(d)} (${fmt(d.validUntil)}).`;
}

export function reminderSubject(taskCount: number, deadlines: Deadline[]): string {
  const expired = deadlines.filter((d) => d.daysLeft < 0).length;
  const dl = deadlines.length;
  const tasksPart = `${taskCount === 1 ? "Остава 1 задача" : `Остават ${taskCount} задачи`} в дневниците за днес`;
  if (taskCount > 0 && dl > 0) {
    return `${tasksPart} · ${expired > 0 ? "има изтекъл срок" : `${dl} ${plural(dl, "срок наближава", "срока наближават")}`}`;
  }
  if (taskCount > 0) return tasksPart;
  if (dl === 1) return deadlineShort(deadlines[0]);
  return expired > 0 ? `Изтекли срокове в дневниците (${dl})` : `${dl} срока в дневниците наближават`;
}

export function buildReminderEmail(input: ReminderEmailInput): { subject: string; html: string; text: string } {
  const taskCount = input.sites.reduce((n, s) => n + s.tasks.length, 0);
  const multiSite = input.multiSite;
  const subject = reminderSubject(taskCount, input.deadlines);
  const profileUrl = `${SITE_URL}/profile`;

  const taskRows = input.sites
    .filter((s) => s.tasks.length > 0)
    .map((s) => {
      const heading = multiSite
        ? `<tr><td style="padding:14px 0 6px;font:700 11px/1.4 Arial,sans-serif;letter-spacing:.12em;text-transform:uppercase;color:#A4855C;">${esc(s.siteName)}</td></tr>`
        : "";
      const rows = s.tasks
        .map(
          (t) => `<tr><td style="padding:0 0 8px;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#FAF6EE;border:1px solid #E9DFCC;border-radius:12px;">
    <tr>
      <td width="34" style="padding:12px 0 12px 14px;vertical-align:top;"><div style="width:18px;height:18px;border:2px solid #C5A880;border-radius:50%;"></div></td>
      <td style="padding:12px 14px 12px 6px;font:14px/1.45 Arial,sans-serif;color:#1B2421;">
        <strong>${esc(t.title)}</strong><br>
        <span style="font-size:12px;color:#6B6F69;">${esc(t.detail)}</span>
      </td>
    </tr>
  </table>
</td></tr>`
        )
        .join("");
      return heading + rows;
    })
    .join("");

  const deadlineRows = input.deadlines
    .map((d) => {
      const urgent = d.daysLeft <= 1;
      const site = multiSite && input.deadlineSite[d.key] ? `<br><span style="font-size:12px;color:#6B6F69;">${esc(input.deadlineSite[d.key])}</span>` : "";
      return `<tr><td style="padding:0 0 8px;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:${urgent ? "#FDF0EE" : "#FBF6EA"};border:1px solid ${urgent ? "#F2C7C0" : "#EBDDB9"};border-radius:12px;">
    <tr><td style="padding:12px 14px;font:14px/1.45 Arial,sans-serif;color:${urgent ? "#8A2219" : "#6B4E12"};"><strong>${esc(deadlineText(d))}</strong>${site}</td></tr>
  </table>
</td></tr>`;
    })
    .join("");

  const intro =
    taskCount > 0
      ? `За днес още ${taskCount === 1 ? "не е попълнена 1 задача" : `не са попълнени ${taskCount} задачи`}. Отнема няколко минути — ако всичко е наред, потвърждавате с по един бутон от „Днешен план“.`
      : "Имате срок в дневниците, за който е добре да се погрижите навреме.";

  const html = `<!doctype html>
<html lang="bg"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${esc(subject)}</title></head>
<body style="margin:0;padding:0;background:#F3EAD9;">
<div style="display:none;max-height:0;overflow:hidden;">${esc(intro)}</div>
<table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#F3EAD9;">
  <tr><td align="center" style="padding:24px 12px;">
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:560px;background:#FFFFFF;border-radius:20px;overflow:hidden;">
      <tr><td style="background:#0F382B;padding:26px 28px;">
        <div style="font:700 11px/1.4 Arial,sans-serif;letter-spacing:.18em;text-transform:uppercase;color:#C5A880;">Дневници · ${esc(input.dateLong)}</div>
        <div style="font:700 24px/1.25 Georgia,'Times New Roman',serif;color:#FAF6EE;margin-top:6px;">${esc(subject)}</div>
        <div style="font:13px/1.4 Arial,sans-serif;color:#B9C7BF;margin-top:6px;">${esc(input.firmName)}</div>
      </td></tr>
      <tr><td style="padding:22px 28px 6px;font:14px/1.6 Arial,sans-serif;color:#1B2421;">${esc(intro)}</td></tr>
      <tr><td style="padding:8px 28px 0;">
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
          ${taskRows}
          ${deadlineRows ? `<tr><td style="padding:${taskRows ? "12px" : "0"} 0 8px;font:700 11px/1.4 Arial,sans-serif;letter-spacing:.12em;text-transform:uppercase;color:#A4855C;">Срокове</td></tr>${deadlineRows}` : ""}
        </table>
      </td></tr>
      <tr><td align="center" style="padding:18px 28px 28px;">
        <a href="${profileUrl}" style="display:inline-block;background:#C5A880;color:#1B2421;font:700 14px/1 Arial,sans-serif;text-decoration:none;padding:15px 30px;border-radius:12px;">Отвори дневниците</a>
      </td></tr>
      <tr><td style="background:#FAF6EE;padding:16px 28px;font:11px/1.6 Arial,sans-serif;color:#7A7F79;">
        Получавате това напомняне, защото водите дневниците си в ${esc(SITE_URL.replace("https://", ""))}. Писмо идва само в дни, в които нещо липсва.
        <a href="${input.unsubscribeUrl}" style="color:#7A7F79;">Спри имейл напомнянията</a>
      </td></tr>
    </table>
  </td></tr>
</table>
</body></html>`;

  const textLines = [
    subject,
    input.firmName,
    "",
    intro,
    "",
    ...input.sites
      .filter((s) => s.tasks.length > 0)
      .flatMap((s) => [...(multiSite ? [`${s.siteName}:`] : []), ...s.tasks.map((t) => `- ${t.title} (${t.detail})`)]),
    ...(input.deadlines.length ? ["", "Срокове:", ...input.deadlines.map((d) => `- ${deadlineText(d)}`)] : []),
    "",
    `Отвори дневниците: ${profileUrl}`,
    "",
    `Спри имейл напомнянията: ${input.unsubscribeUrl}`,
  ];

  return { subject, html, text: textLines.join("\n") };
}

/* ------------------------------------------------------------------ */
/*  Отписване                                                           */
/* ------------------------------------------------------------------ */

/** Подпис на линка за отписване — по id на документа на клиента в /users. */
function unsubscribeSig(userId: string): string {
  const secret = process.env.CRON_SECRET || "";
  return createHmac("sha256", `unsubscribe:${secret}`).update(userId).digest("base64url");
}

export function unsubscribeUrl(userId: string): string {
  return `${SITE_URL}/api/email-reminders/unsubscribe?e=${encodeURIComponent(userId)}&t=${unsubscribeSig(userId)}`;
}

export function verifyUnsubscribe(userId: string, token: string): boolean {
  if (!process.env.CRON_SECRET || !userId || !token) return false;
  const a = Buffer.from(unsubscribeSig(userId));
  const b = Buffer.from(token);
  return a.length === b.length && timingSafeEqual(a, b);
}

/* ------------------------------------------------------------------ */
/*  Изпращане                                                           */
/* ------------------------------------------------------------------ */

export async function sendReminderEmail(opts: {
  to: string;
  subject: string;
  html: string;
  text: string;
  unsubscribeUrl: string;
}): Promise<{ ok: true; id: string } | { ok: false; error: string }> {
  const key = process.env.RESEND_API_KEY;
  if (!key) return { ok: false, error: "RESEND_API_KEY is not set" };
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from: process.env.REMINDER_FROM || DEFAULT_FROM,
      to: [opts.to],
      subject: opts.subject,
      html: opts.html,
      text: opts.text,
      headers: {
        "List-Unsubscribe": `<${opts.unsubscribeUrl}>`,
        "List-Unsubscribe-Post": "List-Unsubscribe=One-Click",
      },
    }),
  });
  const body = (await res.json().catch(() => ({}))) as { id?: string; message?: string };
  if (!res.ok || !body.id) return { ok: false, error: body.message || `HTTP ${res.status}` };
  return { ok: true, id: body.id };
}
