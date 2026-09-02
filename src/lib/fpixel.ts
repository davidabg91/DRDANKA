export const FB_PIXEL_ID = "2282962182552006";

export const generateEventId = (prefix = "evt") => {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
};

const sendCapi = async (payload: any) => {
  try {
    if (typeof window === "undefined") return;
    fetch("/api/meta-capi", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    }).catch(() => {});
  } catch {}
};

export const pageview = () => {
  const eventId = generateEventId("pv");
  if (typeof window !== "undefined" && (window as any).fbq) {
    (window as any).fbq("track", "PageView", {}, { eventID: eventId });
  }
  sendCapi({
    eventName: "PageView",
    eventId,
    eventSourceUrl: typeof window !== "undefined" ? window.location.href : undefined,
  });
};

export const event = (name: string, options: Record<string, any> = {}, customEventId?: string) => {
  const eventId = customEventId || generateEventId(name.toLowerCase().slice(0, 3));
  if (typeof window !== "undefined" && (window as any).fbq) {
    (window as any).fbq("track", name, options, { eventID: eventId });
  }
  sendCapi({
    eventName: name,
    eventId,
    eventSourceUrl: typeof window !== "undefined" ? window.location.href : undefined,
    customData: options,
  });
};

export const trackViewContent = ({
  content_name,
  content_category,
  content_ids,
  value,
  currency = "EUR",
}: {
  content_name: string;
  content_category?: string;
  content_ids?: string[];
  value?: number;
  currency?: string;
}) => {
  const eventId = generateEventId("vc");
  const data = {
    content_name,
    content_category,
    content_ids,
    value,
    currency,
  };
  if (typeof window !== "undefined" && (window as any).fbq) {
    (window as any).fbq("track", "ViewContent", data, { eventID: eventId });
  }
  sendCapi({
    eventName: "ViewContent",
    eventId,
    eventSourceUrl: typeof window !== "undefined" ? window.location.href : undefined,
    customData: data,
  });
};

export const trackInitiateCheckout = ({
  content_name,
  content_ids,
  value,
  currency = "EUR",
  num_items = 1,
  userData,
}: {
  content_name?: string;
  content_ids?: string[];
  value?: number;
  currency?: string;
  num_items?: number;
  userData?: {
    email?: string;
    phone?: string;
    fullName?: string;
  };
}) => {
  const eventId = generateEventId("ic");
  const data = {
    content_name,
    content_ids,
    value,
    currency,
    num_items,
  };
  if (typeof window !== "undefined" && (window as any).fbq) {
    (window as any).fbq("track", "InitiateCheckout", data, { eventID: eventId });
  }
  sendCapi({
    eventName: "InitiateCheckout",
    eventId,
    eventSourceUrl: typeof window !== "undefined" ? window.location.href : undefined,
    userData,
    customData: data,
  });
};

export const trackPurchase = ({
  content_name,
  content_ids,
  value,
  currency = "EUR",
  num_items = 1,
  userData,
}: {
  content_name?: string;
  content_ids?: string[];
  value: number;
  currency?: string;
  num_items?: number;
  userData?: {
    email?: string;
    phone?: string;
    fullName?: string;
  };
}) => {
  const eventId = generateEventId("pur");
  const data = {
    content_name,
    content_ids,
    value,
    currency,
    num_items,
  };
  if (typeof window !== "undefined" && (window as any).fbq) {
    (window as any).fbq("track", "Purchase", data, { eventID: eventId });
  }
  sendCapi({
    eventName: "Purchase",
    eventId,
    eventSourceUrl: typeof window !== "undefined" ? window.location.href : undefined,
    userData,
    customData: data,
  });
};
