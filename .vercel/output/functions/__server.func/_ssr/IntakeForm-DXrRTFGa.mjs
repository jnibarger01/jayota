import { H as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as Label, t as Input } from "./label-DMECEQrM.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/IntakeForm-DXrRTFGa.js
var import_jsx_runtime = require_jsx_runtime();
function Field({ id, label, error, children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-2",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
				htmlFor: id,
				children: label
			}),
			children,
			error ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				id: `${id}-error`,
				className: "text-sm text-accent",
				role: "alert",
				children: error
			}) : null
		]
	});
}
function ContactFields({ prefix, values, errors, onChange }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "grid gap-4 md:grid-cols-2",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
				id: `${prefix}-name`,
				label: "Name *",
				error: errors.name,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
					id: `${prefix}-name`,
					name: "name",
					autoComplete: "name",
					value: values.name,
					"aria-invalid": Boolean(errors.name),
					onChange: (e) => onChange("name", e.target.value)
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
				id: `${prefix}-email`,
				label: "Email *",
				error: errors.email,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
					id: `${prefix}-email`,
					name: "email",
					type: "email",
					autoComplete: "email",
					value: values.email,
					"aria-invalid": Boolean(errors.email),
					onChange: (e) => onChange("email", e.target.value)
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
				id: `${prefix}-phone`,
				label: "Phone",
				error: errors.phone,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
					id: `${prefix}-phone`,
					name: "phone",
					type: "tel",
					autoComplete: "tel",
					value: values.phone,
					"aria-invalid": Boolean(errors.phone),
					onChange: (e) => onChange("phone", e.target.value)
				})
			})
		]
	});
}
function FormStatus({ title, children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "border border-border bg-surface p-6",
		role: "status",
		"aria-live": "polite",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
			className: "font-display text-2xl",
			children: title
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mt-3 space-y-2 text-sm text-muted",
			children
		})]
	});
}
//#endregion
export { Field as n, FormStatus as r, ContactFields as t };
