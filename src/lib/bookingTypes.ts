export type BookingStatus = "pending" | "confirmed" | "completed" | "cancelled";

export interface Booking {
  id: string;
  name: string;
  phone: string;
  email: string;
  note?: string;
  packageId: string;
  packageName: string;
  duration: string;
  price: string;
  priceEur: number;
  date: string; // e.g. "2026-08-20"
  time: string; // e.g. "10:30"
  mode: "consultation" | "training";
  status: BookingStatus;
  createdAt: string; // ISO string
}
