import { o as __toESM } from "../_runtime.mjs";
import { H as require_jsx_runtime, U as require_react } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as LINEUP } from "./lineup-m5PRC25T.mjs";
import { i as newRequestId } from "./utils-DzenR1kc.mjs";
import { m as Route$8 } from "./router-BebVFJVp.mjs";
import { i as track, n as SiteShell } from "./SiteShell-DJTKdcTS.mjs";
import { t as Button } from "./button-BHP5c8oP.mjs";
import { n as listAllVehicles } from "./client-BzQaeYA7.mjs";
import { i as testDriveSchema } from "./forms-CRxgzuAc.mjs";
import { i as submitTestDrive, t as Textarea } from "./intakes-PHMCk5t9.mjs";
import { t as Input } from "./label-DMECEQrM.mjs";
import { n as Field, r as FormStatus, t as ContactFields } from "./IntakeForm-DXrRTFGa.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/test-drive-DwgJBPPK.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function TestDrivePage() {
	const { vehicle } = Route$8.useSearch();
	const catalog = listAllVehicles();
	const extras = LINEUP.filter((item) => !catalog.some((v) => v.slug === item.slug));
	const vehicleOptions = [...catalog.map((item) => ({
		slug: item.slug,
		label: `${item.year} ${item.model}`
	})), ...extras.map((item) => ({
		slug: item.slug,
		label: item.name
	}))];
	const [values, setValues] = (0, import_react.useState)({
		name: "",
		email: "",
		phone: "",
		vehicleSlug: vehicle ?? "rav4",
		preferredDate: "",
		preferredWindow: "morning",
		notes: ""
	});
	const [errors, setErrors] = (0, import_react.useState)({});
	const [busy, setBusy] = (0, import_react.useState)(false);
	const [result, setResult] = (0, import_react.useState)(null);
	const onSubmit = async (event) => {
		event.preventDefault();
		const parsed = testDriveSchema.safeParse({
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
			const saved = await submitTestDrive({ data: parsed.data });
			setResult(saved);
			track("test_drive_requested", { slug: parsed.data.vehicleSlug });
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
				children: "Test drive"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-4 text-sm text-muted",
				children: "Request a time. This is not a confirmed appointment until Hendrick Toyota Merriam accepts it."
			}),
			result ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-8",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(FormStatus, {
					title: "Request received",
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
						prefix: "td",
						values,
						errors,
						onChange: (field, value) => setValues((c) => ({
							...c,
							[field]: value
						}))
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						id: "vehicle",
						label: "Vehicle *",
						error: errors.vehicleSlug,
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
							id: "vehicle",
							className: "h-11 w-full border border-border bg-surface px-3 text-sm",
							value: values.vehicleSlug,
							onChange: (e) => setValues((c) => ({
								...c,
								vehicleSlug: e.target.value
							})),
							children: vehicleOptions.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: item.slug,
								children: item.label
							}, item.slug))
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
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: "morning",
										children: "Morning"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: "afternoon",
										children: "Afternoon"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: "evening",
										children: "Evening"
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
						children: busy ? "Sending…" : "Request test drive"
					})
				]
			})
		]
	}) });
}
//#endregion
export { TestDrivePage as component };
