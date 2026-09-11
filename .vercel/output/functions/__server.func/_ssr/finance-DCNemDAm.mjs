import { o as __toESM } from "../_runtime.mjs";
import { H as require_jsx_runtime, U as require_react } from "../_libs/@tanstack/react-router+[...].mjs";
import { d as getVehicleBySlug } from "./lineup-m5PRC25T.mjs";
import { n as formatUsd, r as formatUsdExact } from "./utils-DzenR1kc.mjs";
import { r as FINANCE_DISCLAIMER, t as CATALOG_DISCLAIMER } from "./catalog-0lXXzwn9.mjs";
import { _ as Route$11 } from "./router-BebVFJVp.mjs";
import { i as track, n as SiteShell } from "./SiteShell-DJTKdcTS.mjs";
import { n as listAllVehicles } from "./client-BzQaeYA7.mjs";
import { t as estimateMonthlyPayment } from "./forms-CRxgzuAc.mjs";
import { n as Label, t as Input } from "./label-DMECEQrM.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/finance-DCNemDAm.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function FinancePage() {
	const { slug } = Route$11.useSearch();
	const vehicle = slug ? getVehicleBySlug(slug) : void 0;
	const defaultPrice = vehicle ? Math.min(vehicle.pricing.baseMsrp, ...vehicle.grades.map((g) => g.msrp)) : 35e3;
	const [price, setPrice] = (0, import_react.useState)(defaultPrice);
	const [down, setDown] = (0, import_react.useState)(3e3);
	const [apr, setApr] = (0, import_react.useState)(6.9);
	const [term, setTerm] = (0, import_react.useState)(60);
	const principal = Math.max(0, price - down);
	const monthly = (0, import_react.useMemo)(() => estimateMonthlyPayment(principal, apr, term), [
		principal,
		apr,
		term
	]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SiteShell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "mx-auto max-w-3xl px-4 py-16 md:px-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-xs uppercase tracking-[0.22em] text-muted",
				children: "Shop"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "mt-2 font-display text-5xl tracking-wide",
				children: "Payment estimator"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-4 text-sm text-muted",
				children: "Enter a vehicle price you want to model. This is not a Toyota APR, not dealer-arranged financing, and not a credit decision."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
				className: "mt-8 grid gap-4 md:grid-cols-2",
				onSubmit: (e) => e.preventDefault(),
				onFocus: () => track("finance_started", { slug: slug ?? "custom" }),
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "md:col-span-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
							htmlFor: "model",
							children: "Catalog vehicle (optional)"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
							id: "model",
							className: "mt-2 h-11 w-full border border-border bg-surface px-3 text-sm",
							value: slug ?? "",
							onChange: (e) => {
								const next = e.target.value;
								const found = next ? getVehicleBySlug(next) : void 0;
								if (found) setPrice(Math.min(found.pricing.baseMsrp, ...found.grades.map((g) => g.msrp)));
								history.replaceState(null, "", next ? `/shop/finance?slug=${next}` : "/shop/finance");
							},
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "",
								children: "Custom amount"
							}), listAllVehicles().map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("option", {
								value: item.slug,
								children: [
									item.year,
									" ",
									item.model
								]
							}, item.slug))]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
						htmlFor: "price",
						children: "Vehicle price"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						id: "price",
						className: "mt-2",
						type: "number",
						min: 0,
						value: price,
						onChange: (e) => setPrice(Number(e.target.value))
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
						htmlFor: "down",
						children: "Down payment"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						id: "down",
						className: "mt-2",
						type: "number",
						min: 0,
						value: down,
						onChange: (e) => setDown(Number(e.target.value))
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
						htmlFor: "apr",
						children: "APR you want to model (%)"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						id: "apr",
						className: "mt-2",
						type: "number",
						min: 0,
						step: .1,
						value: apr,
						onChange: (e) => setApr(Number(e.target.value))
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
						htmlFor: "term",
						children: "Term (months)"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						id: "term",
						className: "mt-2",
						type: "number",
						min: 12,
						max: 96,
						value: term,
						onChange: (e) => setTerm(Number(e.target.value))
					})] })
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-8 border border-border bg-surface p-6",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs uppercase tracking-[0.18em] text-muted",
						children: "Estimated monthly payment"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-2 font-display text-5xl",
						children: formatUsdExact(monthly)
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-3 text-sm text-muted",
						children: [
							"Amount financed ",
							formatUsd(principal),
							" over ",
							term,
							" months at ",
							apr.toFixed(2),
							"% APR."
						]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "price-note mt-6",
				children: FINANCE_DISCLAIMER
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "price-note mt-2",
				children: CATALOG_DISCLAIMER
			})
		]
	}) });
}
//#endregion
export { FinancePage as component };
