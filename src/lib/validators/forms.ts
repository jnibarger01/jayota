import { z } from "zod";

const name = z.string().trim().min(1, "Enter your name.").max(80);
const email = z.string().trim().email("Use an email address like you@example.com.").max(120);
const phone = z
  .string()
  .trim()
  .regex(/^[0-9+().\-\s]{7,20}$/, "Enter a phone number we can call back.")
  .optional()
  .or(z.literal(""));
const notes = z.string().trim().max(2000).optional().or(z.literal(""));

export const leadSchema = z.object({
  kind: z.enum(["contact", "inventory", "model", "finance", "trade_in", "test_drive", "service"]),
  name,
  email,
  phone,
  vehicleSlug: z.string().trim().max(40).optional().or(z.literal("")),
  message: z.string().trim().min(1, "Tell us how we can help.").max(2000),
  idempotencyKey: z.string().trim().min(8).max(80).optional(),
});
export type LeadInput = z.infer<typeof leadSchema>;

export const testDriveSchema = z.object({
  name,
  email,
  phone,
  vehicleSlug: z.string().trim().min(1, "Choose a vehicle."),
  preferredDate: z.string().trim().min(1, "Choose a preferred date."),
  preferredWindow: z.enum(["morning", "afternoon", "evening"]),
  notes,
  idempotencyKey: z.string().trim().min(8).max(80).optional(),
});
export type TestDriveInput = z.infer<typeof testDriveSchema>;

export const tradeInSchema = z.object({
  name,
  email,
  phone,
  vin: z
    .string()
    .trim()
    .toUpperCase()
    .regex(/^[A-HJ-NPR-Z0-9]{17}$/i, "Enter a 17-character VIN, or leave it blank and describe the vehicle.")
    .optional()
    .or(z.literal("")),
  year: z.string().trim().max(4).optional().or(z.literal("")),
  make: z.string().trim().max(40).optional().or(z.literal("")),
  model: z.string().trim().max(40).optional().or(z.literal("")),
  mileage: z.string().trim().max(10).optional().or(z.literal("")),
  condition: z.enum(["excellent", "good", "fair", "poor"]),
  notes,
  idempotencyKey: z.string().trim().min(8).max(80).optional(),
});
export type TradeInInput = z.infer<typeof tradeInSchema>;

export const serviceSchema = z.object({
  name,
  email,
  phone,
  vin: z.string().trim().max(17).optional().or(z.literal("")),
  year: z.string().trim().max(4).optional().or(z.literal("")),
  model: z.string().trim().max(40).optional().or(z.literal("")),
  mileage: z.string().trim().max(10).optional().or(z.literal("")),
  serviceType: z.enum([
    "oil_maintenance",
    "tires_brakes",
    "recall_campaign",
    "diagnostic",
    "other",
  ]),
  concern: z.string().trim().min(1, "Describe the concern or requested service.").max(2000),
  preferredDate: z.string().trim().min(1, "Choose a preferred date."),
  preferredWindow: z.enum(["morning", "afternoon"]),
  transportation: z.enum(["none", "wait", "unknown"]).default("unknown"),
  notes,
  idempotencyKey: z.string().trim().min(8).max(80).optional(),
});
export type ServiceInput = z.infer<typeof serviceSchema>;

export const financeInputSchema = z.object({
  price: z.number().positive().max(250000),
  downPayment: z.number().min(0).max(250000),
  aprPercent: z.number().min(0).max(40),
  termMonths: z.number().int().min(12).max(96),
});
export type FinanceInput = z.infer<typeof financeInputSchema>;

export function estimateMonthlyPayment(principal: number, aprPercent: number, termMonths: number): number {
  if (principal <= 0 || termMonths <= 0) return 0;
  if (aprPercent <= 0) return principal / termMonths;
  const monthlyRate = aprPercent / 100 / 12;
  const factor = Math.pow(1 + monthlyRate, termMonths);
  return (principal * monthlyRate * factor) / (factor - 1);
}
