import { z } from "zod";

export const createBookingSchema = z.object({
  courtId: z.string().uuid("Select a court"),
  bookingDate: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Select a valid date"),
  startTime: z
    .string()
    .regex(/^\d{2}:\d{2}(:\d{2})?$/, "Select a valid time slot"),
  customerName: z.string().trim().min(2, "Full name is required").max(120),
  customerMobile: z
    .string()
    .trim()
    .min(7, "Mobile number is required")
    .max(20)
    .regex(/^[0-9+\-\s]+$/, "Enter a valid mobile number"),
  customerEmail: z
    .string()
    .trim()
    .email("Enter a valid email")
    .optional()
    .or(z.literal("")),
});

export const updateBookingStatusSchema = z.object({
  status: z.enum([
    "PENDING_PAYMENT",
    "CONFIRMED",
    "FAILED",
    "CANCELLED",
    "EXPIRED",
  ]),
});
