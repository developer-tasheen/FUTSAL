import { z } from "zod";

export const registerSchema = z.object({
  name: z.string().trim().min(2, "Full name is required").max(120),
  mobileNumber: z
    .string()
    .trim()
    .min(7, "Mobile number is required")
    .max(20)
    .regex(/^[0-9+\-\s]+$/, "Enter a valid mobile number"),
  email: z
    .string()
    .trim()
    .email("Enter a valid email")
    .optional()
    .or(z.literal("")),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const loginSchema = z.object({
  identifier: z.string().trim().min(3, "Mobile number or email is required"),
  password: z.string().min(1, "Password is required"),
});
