import { o as __toESM } from "../_runtime.mjs";
import { H as require_jsx_runtime, U as require_react } from "../_libs/@tanstack/react-router+[...].mjs";
import { i as newRequestId } from "./utils-DzenR1kc.mjs";
import { i as track, n as SiteShell } from "./SiteShell-DJTKdcTS.mjs";
import { t as Button } from "./button-BHP5c8oP.mjs";
import { a as tradeInSchema } from "./forms-CRxgzuAc.mjs";
import { a as submitTradeIn, t as Textarea } from "./intakes-PHMCk5t9.mjs";
import { t as Input } from "./label-DMECEQrM.mjs";
import { n as Field, r as FormStatus, t as ContactFields } from "./IntakeForm-DXrRTFGa.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/trade-in-Drk6UwJX.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function TradeInPage() {
	const [values, setValues] = (0, import_react.useState)({
		name: "",
		email: "",
		phone: "",
		vin: "",
		year: "",
		make: "Toyota",
		model: "",
		mileage: "",
		condition: "good",
		notes: ""
	});
	const [errors, setErrors] = (0, import_react.useState)({});
	const [busy, setBusy] = (0, import_react.useState)(false);
	const [result, setResult] = (0, import_react.useState)(null);
	const onSubmit = async (event) => {
		event.preventDefault();
		const parsed = tradeInSchema.safeParse({
			...values,
			idempotencyKey: newRequestId()
		});
		if (!parsed.success) {
			const next = {};
			for (const issue of parsed.error.issues) {
				const key = String(issue.path[0] ?? "form");
				next[key] = issue.message;
			}
			setErrors(next);
			return;
		}
		setBusy(true);
		setErrors({});
		try {
			const saved = await submitTradeIn({ data: parsed.data });
			setResult(saved);
			track("trade_in_started", { hasVin: Boolean(parsed.data.vin) });
		} catch (err) {
			setErrors({ form: err instanceof Error ? err.message : "Could not submit. Please retry." });
		} finally {
			setBusy(false);
		}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SiteShell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "mx-auto max-w-3xl px-4 py-16 md:px-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "font-display text-5xl tracking-wide",
				children: "Trade-in"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-4 text-sm text-muted",
				children: "Tell us about the vehicle you may trade. We will not invent a value. Appraisal happens with the dealership."
			}),
			result ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-8",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(FormStatus, {
					title: "Request received",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [
						"Reference ",
						result.id,
						"."
					] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: result.valuationNote })]
				})
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
				className: "mt-8 space-y-5",
				onSubmit,
				noValidate: true,
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ContactFields, {
						prefix: "tr",
						values,
						errors,
						onChange: (field, value) => setValues((c) => ({
							...c,
							[field]: value
						}))
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						id: "vin",
						label: "VIN (optional)",
						error: errors.vin,
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							id: "vin",
							value: values.vin,
							onChange: (e) => setValues((c) => ({
								...c,
								vin: e.target.value
							}))
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid gap-4 md:grid-cols-3",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
								id: "year",
								label: "Year",
								error: errors.year,
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									id: "year",
									value: values.year,
									onChange: (e) => setValues((c) => ({
										...c,
										year: e.target.value
									}))
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
								id: "make",
								label: "Make",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									id: "make",
									value: values.make,
									onChange: (e) => setValues((c) => ({
										...c,
										make: e.target.value
									}))
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
								id: "model",
								label: "Model",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									id: "model",
									value: values.model,
									onChange: (e) => setValues((c) => ({
										...c,
										model: e.target.value
									}))
								})
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid gap-4 md:grid-cols-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							id: "mileage",
							label: "Mileage",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								id: "mileage",
								value: values.mileage,
								onChange: (e) => setValues((c) => ({
									...c,
									mileage: e.target.value
								}))
							})
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							id: "condition",
							label: "Condition",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
								id: "condition",
								className: "h-11 w-full border border-border bg-surface px-3 text-sm",
								value: values.condition,
								onChange: (e) => setValues((c) => ({
									...c,
									condition: e.target.value
								})),
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: "excellent",
										children: "Excellent"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: "good",
										children: "Good"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: "fair",
										children: "Fair"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: "poor",
										children: "Poor"
									})
								]
							})
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						id: "notes",
						label: "Notes",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
							id: "notes",
							value: values.notes,
							onChange: (e) => setValues((c) => ({
								...c,
								notes: e.target.value
							}))
						})
					}),
					errors.form ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-accent",
						children: errors.form
					}) : null,
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						type: "submit",
						disabled: busy,
						children: busy ? "Sending…" : "Submit appraisal request"
					})
				]
			})
		]
	}) });
}
//#endregion
export { TradeInPage as component };
