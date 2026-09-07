/**
 * Telegram notification helper.
 * Sends alerts to the admin's Telegram chat via a bot.
 * Requires TELEGRAM_BOT_TOKEN and TELEGRAM_CHAT_ID environment variables.
 */

export async function sendTelegramNotification(htmlMessage: string): Promise<boolean> {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (!token || !chatId) {
    // Graceful fallback when env vars are not yet configured
    console.info("Telegram notification skipped: TELEGRAM_BOT_TOKEN or TELEGRAM_CHAT_ID not configured.");
    return false;
  }

  try {
    const url = `https://api.telegram.org/bot${token}/sendMessage`;
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        text: htmlMessage,
        parse_mode: "HTML",
        disable_web_page_preview: true,
      }),
    });

    if (!res.ok) {
      const errText = await res.text();
      console.error("Telegram API error:", res.status, errText);
      return false;
    }

    return true;
  } catch (err) {
    console.error("Failed to dispatch Telegram message:", err);
    return false;
  }
}
