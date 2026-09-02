export const FB_PIXEL_ID = "2282962182552006";

export const pageview = () => {
  if (typeof window !== "undefined" && (window as any).fbq) {
    (window as any).fbq("track", "PageView");
  }
};

export const event = (name: string, options: Record<string, any> = {}) => {
  if (typeof window !== "undefined" && (window as any).fbq) {
    (window as any).fbq("track", name, options);
  }
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
  event("ViewContent", {
    content_name,
    content_category,
    content_ids,
    value,
    currency,
  });
};

export const trackInitiateCheckout = ({
  content_name,
  content_ids,
  value,
  currency = "EUR",
  num_items = 1,
}: {
  content_name?: string;
  content_ids?: string[];
  value?: number;
  currency?: string;
  num_items?: number;
}) => {
  event("InitiateCheckout", {
    content_name,
    content_ids,
    value,
    currency,
    num_items,
  });
};

export const trackPurchase = ({
  content_name,
  content_ids,
  value,
  currency = "EUR",
  num_items = 1,
}: {
  content_name?: string;
  content_ids?: string[];
  value: number;
  currency?: string;
  num_items?: number;
}) => {
  event("Purchase", {
    content_name,
    content_ids,
    value,
    currency,
    num_items,
  });
};
