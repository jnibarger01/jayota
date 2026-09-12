import { Jt as number, Kt as literal, Qt as string, Vt as _enum, Yt as object } from "../_libs/@better-auth/core+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/forms-CRxgzuAc.js
var name = string().trim().min(1, "Enter your name.").max(80);
var email = string().trim().email("Use an email address like you@example.com.").max(120);
var phone = string().trim().regex(/^[0-9+().\-\s]{7,20}$/, "Enter a phone number we can call back.").optional().or(literal(""));
var notes = string().trim().max(2e3).optional().or(literal(""));
var leadSchema = object({
	kind: _enum([
		"contact",
		"inventory",
		"model",
		"finance",
		"trade_in",
		"test_drive",
		"service"
	]),
	name,
	email,
	phone,
	vehicleSlug: string().trim().max(40).optional().or(literal("")),
	message: string().trim().min(1, "Tell us how we can help.").max(2e3),
	idempotencyKey: string().trim().min(8).max(80).optional()
});
var testDriveSchema = object({
	name,
	email,
	phone,
	vehicleSlug: string().trim().min(1, "Choose a vehicle."),
	preferredDate: string().trim().min(1, "Choose a preferred date."),
	preferredWindow: _enum([
		"morning",
		"afternoon",
		"evening"
	]),
	notes,
	idempotencyKey: string().trim().min(8).max(80).optional()
});
var tradeInSchema = object({
	name,
	email,
	phone,
	vin: string().trim().toUpperCase().regex(/^[A-HJ-NPR-Z0-9]{17}$/i, "Enter a 17-character VIN, or leave it blank and describe the vehicle.").optional().or(literal("")),
	year: string().trim().max(4).optional().or(literal("")),
	make: string().trim().max(40).optional().or(literal("")),
	model: string().trim().max(40).optional().or(literal("")),
	mileage: string().trim().max(10).optional().or(literal("")),
	condition: _enum([
		"excellent",
		"good",
		"fair",
		"poor"
	]),
	notes,
	idempotencyKey: string().trim().min(8).max(80).optional()
});
var serviceSchema = object({
	name,
	email,
	phone,
	vin: string().trim().max(17).optional().or(literal("")),
	year: string().trim().max(4).optional().or(literal("")),
	model: string().trim().max(40).optional().or(literal("")),
	mileage: string().trim().max(10).optional().or(literal("")),
	serviceType: _enum([
		"oil_maintenance",
		"tires_brakes",
		"recall_campaign",
		"diagnostic",
		"other"
	]),
	concern: string().trim().min(1, "Describe the concern or requested service.").max(2e3),
	preferredDate: string().trim().min(1, "Choose a preferred date."),
	preferredWindow: _enum(["morning", "afternoon"]),
	transportation: _enum([
		"none",
		"wait",
		"unknown"
	]).default("unknown"),
	notes,
	idempotencyKey: string().trim().min(8).max(80).optional()
});
object({
	price: number().positive().max(25e4),
	downPayment: number().min(0).max(25e4),
	aprPercent: number().min(0).max(40),
	termMonths: number().int().min(12).max(96)
});
function estimateMonthlyPayment(principal, aprPercent, termMonths) {
	if (principal <= 0 || termMonths <= 0) return 0;
	if (aprPercent <= 0) return principal / termMonths;
	const monthlyRate = aprPercent / 100 / 12;
	const factor = Math.pow(1 + monthlyRate, termMonths);
	return principal * monthlyRate * factor / (factor - 1);
}
//#endregion
export { tradeInSchema as a, testDriveSchema as i, leadSchema as n, serviceSchema as r, estimateMonthlyPayment as t };
