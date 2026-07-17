export const bookingStatuses = [
  "PENDING_PAYMENT",
  "CONFIRMED",
  "FAILED",
  "CANCELLED",
  "EXPIRED",
] as const;

export type BookingStatus = (typeof bookingStatuses)[number];

export type BookingSummary = {
  id: string;
  reference: string;
  courtName: string;
  date: string;
  startsAt: string;
  endsAt: string;
  amountFjd: number;
  status: BookingStatus;
};
