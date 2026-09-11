import { o as __toESM } from "../_runtime.mjs";
import { H as require_jsx_runtime, U as require_react } from "../_libs/@tanstack/react-router+[...].mjs";
import { i as newRequestId } from "./utils-DzenR1kc.mjs";
import { c as formatHour, n as DEALER, s as formatAddress } from "./catalog-0lXXzwn9.mjs";
import { y as autoDealerJsonLd } from "./router-BebVFJVp.mjs";
import { i as track, n as SiteShell } from "./SiteShell-DJTKdcTS.mjs";
import { t as Button } from "./button-BHP5c8oP.mjs";
import { t as JsonLd } from "./JsonLd-C177FKtR.mjs";
import { n as leadSchema } from "./forms-CRxgzuAc.mjs";
import { n as submitLead, t as Textarea } from "./intakes-PHMCk5t9.mjs";
import { n as Field, r as FormStatus, t as ContactFields } from "./IntakeForm-DXrRTFGa.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/dealership-CHVe5vKR.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function DealershipPage() {
	const [values, setValues] = (0, import_react.useState)({
		name: "",
		email: "",
		phone: "",
		message: ""
	});
	const [errors, setErrors] = (0, import_react.useState)({});
	const [busy, setBusy] = (0, import_react.useState)(false);
	const [result, setResult] = (0, import_react.useState)(null);
	const onSubmit = async (event) => {
		event.preventDefault();
		const parsed = leadSchema.safeParse({
			kind: "contact",
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
			const saved = await submitLead({ data: parsed.data });
			setResult(saved);
			track("lead_submitted", { kind: "contact" });
		} catch (err) {
			setErrors({ form: err instanceof Error ? err.message : "Could not submit." });
		} finally {
			setBusy(false);
		}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SiteShell, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(JsonLd, { data: autoDealerJsonLd() }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "mx-auto max-w-7xl px-4 py-16 md:px-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-xs uppercase tracking-[0.22em] text-muted",
				children: "Dealership"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "mt-2 font-display text-5xl tracking-wide",
				children: DEALER.name
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-3 text-sm text-muted",
				children: formatAddress()
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-8 grid gap-10 lg:grid-cols-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
						className: "text-lg",
						href: `tel:${DEALER.phone.generalTel}`,
						children: DEALER.phone.general
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-2 text-sm text-muted",
						children: [
							"Official website:",
							" ",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
								className: "underline",
								href: DEALER.website,
								target: "_blank",
								rel: "noreferrer",
								children: "hendricktoyotamerriam.com"
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-8 grid gap-6 sm:grid-cols-3",
						children: [
							"sales",
							"service",
							"parts"
						].map((dept) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "text-xs uppercase tracking-[0.16em] text-muted",
							children: dept
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
							className: "mt-3 space-y-1 text-sm",
							children: DEALER.hours[dept].map((row) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
								className: "flex justify-between gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: row.day.slice(0, 3) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-muted",
									children: formatHour(row.opens, row.closes)
								})]
							}, row.day))
						})] }, dept))
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "price-note mt-4",
						children: DEALER.hoursSource
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-6 flex flex-wrap gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
							href: DEALER.mapsUrl,
							target: "_blank",
							rel: "noreferrer",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, { children: "Directions" })
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
							href: `tel:${DEALER.phone.generalTel}`,
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								variant: "secondary",
								children: "Call"
							})
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("iframe", {
						title: "Map of Hendrick Toyota Merriam",
						src: DEALER.osmEmbed,
						className: "mt-8 h-72 w-full border border-border grayscale"
					})
				] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "font-display text-2xl",
					children: "Contact"
				}), result ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-6",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(FormStatus, {
						title: "Message received",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [
							"Reference ",
							result.id,
							". An advisor will follow up using the email you provided."
						] }), !result.emailQueued ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "No confirmation email was sent — mail is not configured." }) : null]
					})
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
					className: "mt-6 space-y-4",
					onSubmit,
					noValidate: true,
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ContactFields, {
							prefix: "ct",
							values,
							errors,
							onChange: (field, value) => setValues((c) => ({
								...c,
								[field]: value
							}))
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							id: "message",
							label: "How can we help? *",
							error: errors.message,
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
								id: "message",
								value: values.message,
								onChange: (e) => setValues((c) => ({
									...c,
									message: e.target.value
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
							children: busy ? "Sending…" : "Send message"
						})
					]
				})] })]
			})
		]
	})] });
}
//#endregion
export { DealershipPage as component };
