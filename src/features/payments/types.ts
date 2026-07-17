export const paymentStatuses = [
  "PENDING",
  "SUCCESS",
  "FAILED",
  "CANCELLED",
] as const;

export type PaymentStatus = (typeof paymentStatuses)[number];

export type PaymentReference = {
  requestId: string;
  transactionId?: string;
  responseCode?: number;
  status: PaymentStatus;
};
