import crypto from "crypto";

export const FB_PIXEL_IDS = ["2170194070520793", "2282962182552006"];
export const FB_ACCESS_TOKEN = process.env.FB_ACCESS_TOKEN || process.env.META_ACCESS_TOKEN || "";

function sha256(value: string): string {
  return crypto.createHash("sha256").update(value.trim().toLowerCase()).digest("hex");
}

function normalizePhone(phone: string): string {
  const digits = phone.replace(/\D/g, "");
  if (digits.startsWith("0") && digits.length === 10) {
    return "359" + digits.slice(1);
  }
  return digits;
}

export interface MetaServerEventParams {
  eventName: "PageView" | "ViewContent" | "InitiateCheckout" | "Purchase" | "Lead" | string;
  eventId?: string;
  eventSourceUrl?: string;
  testEventCode?: string;
  userData?: {
    email?: string;
    phone?: string;
    fullName?: string;
    clientIp?: string;
    userAgent?: string;
    fbc?: string;
    fbp?: string;
  };
  customData?: {
    value?: number;
    currency?: string;
    content_name?: string;
    content_category?: string;
    content_ids?: string[];
    content_type?: string;
    num_items?: number;
    test_event_code?: string;
  };
}

export async function sendMetaServerEvent(params: MetaServerEventParams) {
  try {
    const { eventName, eventId, eventSourceUrl, userData, customData } = params;

    const formattedUserData: Record<string, any> = {};

    if (userData?.email) {
      formattedUserData.em = [sha256(userData.email)];
    }
    if (userData?.phone) {
      formattedUserData.ph = [sha256(normalizePhone(userData.phone))];
    }
    if (userData?.fullName) {
      const parts = userData.fullName.trim().split(" ");
      formattedUserData.fn = [sha256(parts[0])];
      if (parts.length > 1) {
        formattedUserData.ln = [sha256(parts.slice(1).join(" "))];
      }
    }
    if (userData?.clientIp) {
      formattedUserData.client_ip_address = userData.clientIp;
    }
    if (userData?.userAgent) {
      formattedUserData.client_user_agent = userData.userAgent;
    }
    if (userData?.fbc) {
      formattedUserData.fbc = userData.fbc;
    }
    if (userData?.fbp) {
      formattedUserData.fbp = userData.fbp;
    }

    // Extract test_event_code if present in customData or URL params
    let testCode = params.testEventCode || customData?.test_event_code;
    if (!testCode && eventSourceUrl) {
      try {
        const u = new URL(eventSourceUrl);
        testCode =
          u.searchParams.get("test_event_code") ||
          u.searchParams.get("test_code") ||
          u.searchParams.get("fb_test_events") ||
          undefined;
      } catch {}
    }

    const payload: Record<string, any> = {
      data: [
        {
          event_name: eventName,
          event_time: Math.floor(Date.now() / 1000),
          action_source: "website",
          ...(eventId ? { event_id: eventId } : {}),
          ...(eventSourceUrl ? { event_source_url: eventSourceUrl } : {}),
          user_data: formattedUserData,
          ...(customData ? { custom_data: customData } : {}),
        },
      ],
    };

    if (testCode) {
      payload.test_event_code = testCode;
    }

    const results = await Promise.all(
      FB_PIXEL_IDS.map(async (pixelId) => {
        try {
          const url = `https://graph.facebook.com/v19.0/${pixelId}/events?access_token=${FB_ACCESS_TOKEN}`;
          const res = await fetch(url, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(payload),
          });
          const data = await res.json();
          return { pixelId, ok: res.ok, data };
        } catch (err: any) {
          return { pixelId, ok: false, error: err?.message || err };
        }
      })
    );

    return { success: true, results };
  } catch (err: any) {
    console.error("Meta CAPI Server Error:", err);
    return { success: false, error: err?.message || err };
  }
}
