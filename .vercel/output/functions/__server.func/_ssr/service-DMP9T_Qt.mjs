import { o as __toESM } from "../_runtime.mjs";
import { H as require_jsx_runtime, U as require_react } from "../_libs/@tanstack/react-router+[...].mjs";
import { i as newRequestId } from "./utils-DzenR1kc.mjs";
import { n as DEALER } from "./catalog-0lXXzwn9.mjs";
import { i as track, n as SiteShell } from "./SiteShell-DJTKdcTS.mjs";
import { t as Button } from "./button-BHP5c8oP.mjs";
import { r as serviceSchema } from "./forms-CRxgzuAc.mjs";
import { r as submitServiceRequest, t as Textarea } from "./intakes-PHMCk5t9.mjs";
import { t as Input } from "./label-DMECEQrM.mjs";
import { n as Field, r as FormStatus, t as ContactFields } from "./IntakeForm-DXrRTFGa.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/service-DMP9T_Qt.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function ServicePage() {
	const [values, setValues] = (0, import_react.useState)({
		name: "",
		email: "",
		phone: "",
		vin: "",
		year: "",
		model: "",
		mileage: "",
		serviceType: "oil_maintenance",
		concern: "",
		preferredDate: "",
		preferredWindow: "morning",
		transportation: "unknown",
		notes: ""
	});
	const [errors, setErrors] = (0, import_react.useState)({});
	const [busy, setBusy] = (0, import_react.useState)(false);
	const [result, setResult] = (0, import_react.useState)(null);
	const onSubmit = async (event) => {
		event.preventDefault();
		const parsed = serviceSchema.safeParse({
			...values,
			idempotencyKey: newRequestId()
		});
		if (!parsed.success) {
			const next = {};
			for (const issue of parsed.error.issues) next[String(issue.path[0] ?? "form")] = issue.message;
			setErrors(next);
			return;
		}
		setBusy(true);
		try {
			track("service_started", { type: parsed.data.serviceType });
			const saved = await submitServiceRequest({ data: parsed.data });
			setResult(saved);
			track("service_submitted", { scheduled: saved.scheduled });
		} catch (err) {
			setErrors({ form: err instanceof Error ? err.message : "Could not submit. Please retry." });
		} finally {
			setBusy(false);
		}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SiteShell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "mx-auto max-w-3xl px-4 py-16 md:px-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-xs uppercase tracking-[0.22em] text-muted",
				children: "Owners"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "mt-2 font-display text-5xl tracking-wide",
				children: "Schedule service"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "mt-4 text-sm text-muted",
				children: [
					"Service hours (Toyota.com directory): Monday–Saturday 7 AM–6 PM, Sunday closed. Confirm with the dealer at ",
					DEALER.phone.general,
					"."
				]
			}),
			result ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-8",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(FormStatus, {
					title: "Request received — not yet scheduled",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [
						"Reference ",
						result.id,
						"."
					] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: result.confirmationNote })]
				})
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
				className: "mt-8 space-y-5",
				onSubmit,
				noValidate: true,
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ContactFields, {
						prefix: "svc",
						values,
						errors,
						onChange: (field, value) => setValues((c) => ({
							...c,
							[field]: value
						}))
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid gap-4 md:grid-cols-3",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
								id: "year",
								label: "Year",
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
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
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
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						id: "vin",
						label: "VIN (optional)",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							id: "vin",
							value: values.vin,
							onChange: (e) => setValues((c) => ({
								...c,
								vin: e.target.value
							}))
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						id: "type",
						label: "Service type",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
							id: "type",
							className: "h-11 w-full border border-border bg-surface px-3 text-sm",
							value: values.serviceType,
							onChange: (e) => setValues((c) => ({
								...c,
								serviceType: e.target.value
							})),
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "oil_maintenance",
									children: "Oil / scheduled maintenance"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "tires_brakes",
									children: "Tires / brakes"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "recall_campaign",
									children: "Recall campaign"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "diagnostic",
									children: "Diagnostic / warning light"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "other",
									children: "Other"
								})
							]
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						id: "concern",
						label: "Concern *",
						error: errors.concern,
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
							id: "concern",
							value: values.concern,
							onChange: (e) => setValues((c) => ({
								...c,
								concern: e.target.value
							}))
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid gap-4 md:grid-cols-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							id: "date",
							label: "Preferred date *",
							error: errors.preferredDate,
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								id: "date",
								type: "date",
								value: values.preferredDate,
								onChange: (e) => setValues((c) => ({
									...c,
									preferredDate: e.target.value
								}))
							})
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							id: "window",
							label: "Window",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
								id: "window",
								className: "h-11 w-full border border-border bg-surface px-3 text-sm",
								value: values.preferredWindow,
								onChange: (e) => setValues((c) => ({
									...c,
									preferredWindow: e.target.value
								})),
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "morning",
									children: "Morning"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "afternoon",
									children: "Afternoon"
								})]
							})
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						id: "transport",
						label: "Transportation while in service",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
							id: "transport",
							className: "h-11 w-full border border-border bg-surface px-3 text-sm",
							value: values.transportation,
							onChange: (e) => setValues((c) => ({
								...c,
								transportation: e.target.value
							})),
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "unknown",
									children: "I’ll confirm with the advisor"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "wait",
									children: "I can wait"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "none",
									children: "I will drop off"
								})
							]
						})
					}),
					errors.form ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-accent",
						children: errors.form
					}) : null,
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						type: "submit",
						disabled: busy,
						children: busy ? "Sending…" : "Submit service request"
					})
				]
			})
		]
	}) });
}
//#endregion
export { ServicePage as component };
