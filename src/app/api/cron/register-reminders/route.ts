import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/lib/firebaseAdmin";
import { effectivePlan } from "@/lib/plans";
import { sitesOf } from "@/lib/sites";
import { registerDocKey } from "@/data/storeRegisters";
import type { RegisterDocData } from "@/components/registers/registerPrint";
import {
  docsNeeded,
  dueDeadlines,
  pendingTasks,
  siteContext,
  sofiaDateISO,
  type Deadline,
} from "@/lib/registerReminders";
import { buildReminderEmail, sendReminderEmail, unsubscribeUrl, type SiteReminder } from "@/lib/reminderEmail";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;

/** Кога е пратено какво — по един документ на клиент (само сървърът го пише). */
const LOG_COLLECTION = "emailReminderLog";
const TRIAL_MS = 14 * 24 * 60 * 60 * 1000;

interface UserDoc {
  email?: string;
  role?: string;
  status?: string;
  subscriptionStatus?: string;
  expiresAt?: string;
  trialStartedAt?: string;
  trialStartedAtMs?: number;
  plan?: string;
  extraRegisters?: string[];
  firmName?: string;
  niche?: string;
  emailReminders?: boolean;
  [k: string]: unknown;
}

/** Същото правило като профила: одобрен клиент с активен абонамент или проба. */
function isActive(u: UserDoc, todayISO: string): boolean {
  if (u.role !== "user" || u.status !== "approved") return false;
  if (u.subscriptionStatus === "trial") {
    const start = typeof u.trialStartedAtMs === "number" ? u.trialStartedAtMs : u.trialStartedAt ? Date.parse(u.trialStartedAt) : NaN;
    return !Number.isNaN(start) && Date.now() <= start + TRIAL_MS;
  }
  return (u.subscriptionStatus ?? "approved") === "approved" && (!u.expiresAt || u.expiresAt >= todayISO);
}

/**
 * GET /api/cron/register-reminders — вечерното напомняне за дневниците.
 *
 * Пуска се от Vercel Cron (vercel.json) с `Authorization: Bearer $CRON_SECRET`.
 * За всеки активен клиент и всеки негов обект проверява какво липсва за
 * днес и кои срокове (ЛЗК, договори) наближават, и праща едно писмо — само
 * ако има нещо. Сроковете се пращат по веднъж на праг (30/7/1 дни, изтекъл).
 *
 * ?dry=1 — нищо не се праща и записва, връща какво би било изпратено.
 * ?only=<имейл> — само за един клиент (за проба).
 */
export async function GET(req: NextRequest) {
  const secret = process.env.CRON_SECRET;
  if (!secret) return NextResponse.json({ error: "CRON_SECRET is not configured" }, { status: 500 });
  if (req.headers.get("authorization") !== `Bearer ${secret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const dry = req.nextUrl.searchParams.get("dry") === "1" || !process.env.RESEND_API_KEY;
  const only = req.nextUrl.searchParams.get("only")?.toLowerCase() || null;
  const today = sofiaDateISO();
  const month = today.slice(0, 7);
  const dateLong = new Date(`${today}T12:00:00Z`).toLocaleDateString("bg-BG", {
    weekday: "long",
    day: "numeric",
    month: "long",
    timeZone: "Europe/Sofia",
  });

  const db = adminDb();
  const usersSnap = await db.collection("users").get();
  const results: Record<string, unknown>[] = [];
  let sent = 0;

  for (const userDoc of usersSnap.docs) {
    const u = userDoc.data() as UserDoc;
    const email = String(u.email || userDoc.id).toLowerCase();
    if (only && email !== only) continue;
    if (!isActive(u, today)) continue;
    if (u.emailReminders === false && !only) {
      results.push({ email, status: "opted-out" });
      continue;
    }

    try {
      const logRef = db.collection(LOG_COLLECTION).doc(email);
      const log = (await logRef.get()).data() as { lastEveningDate?: string; sent?: Record<string, string> } | undefined;
      if (log?.lastEveningDate === today && !dry) {
        results.push({ email, status: "already-sent-today" });
        continue;
      }

      const sites = sitesOf(u);
      const plan = effectivePlan(u);
      const siteReminders: SiteReminder[] = [];
      const deadlines: Deadline[] = [];
      const deadlineSite: Record<string, string> = {};

      for (const site of sites) {
        const ctx = siteContext(site, { plan, extraRegisters: u.extraRegisters, fallbackNiche: u.niche });
        const needed = docsNeeded(ctx, month);
        const snaps = await db.getAll(
          ...needed.map(({ id, period }) => db.collection("logs").doc(registerDocKey(email, id, period, site.id)))
        );
        const docs: Record<string, RegisterDocData> = {};
        needed.forEach(({ id }, i) => {
          docs[id] = snaps[i].exists ? (snaps[i].data() as RegisterDocData) : {};
        });

        const tasks = pendingTasks(ctx, docs, today);
        if (tasks.length > 0) siteReminders.push({ siteName: site.name, tasks });
        dueDeadlines(site.id, docs, today)
          .filter((d) => !log?.sent?.[d.key])
          .forEach((d) => {
            deadlines.push(d);
            deadlineSite[d.key] = site.name;
          });
      }

      const taskCount = siteReminders.reduce((n, s) => n + s.tasks.length, 0);
      if (taskCount === 0 && deadlines.length === 0) {
        results.push({ email, status: "nothing-due" });
        continue;
      }

      const unsub = unsubscribeUrl(userDoc.id);
      const mail = buildReminderEmail({
        firmName: String(u.firmName || ""),
        dateLong,
        sites: siteReminders,
        deadlines,
        multiSite: sites.length > 1,
        deadlineSite,
        unsubscribeUrl: unsub,
      });

      if (dry) {
        results.push({
          email,
          status: "dry-run",
          subject: mail.subject,
          tasks: siteReminders.map((s) => ({ site: s.siteName, tasks: s.tasks.map((t) => t.title) })),
          deadlines: deadlines.map((d) => d.key),
        });
        continue;
      }

      const res = await sendReminderEmail({ to: email, ...mail, unsubscribeUrl: unsub });
      if (!res.ok) {
        results.push({ email, status: "send-failed", error: res.error });
        continue;
      }
      sent++;
      const sentKeys = Object.fromEntries(deadlines.map((d) => [d.key, today]));
      await logRef.set({ lastEveningDate: today, sent: sentKeys, updatedAt: new Date().toISOString() }, { merge: true });
      results.push({ email, status: "sent", subject: mail.subject });
    } catch (err) {
      results.push({ email, status: "error", error: String(err) });
    }
  }

  return NextResponse.json({ date: today, dryRun: dry, sent, results });
}
