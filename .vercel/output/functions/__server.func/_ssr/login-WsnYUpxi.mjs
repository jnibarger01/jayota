import { o as __toESM } from "../_runtime.mjs";
import { H as require_jsx_runtime, U as require_react, y as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as GROK_PROVIDERS } from "./server-6kxKE-qY.mjs";
import { r as signIn, t as authClient } from "./client-CVqXY6bk.mjs";
import { n as SiteShell } from "./SiteShell-DJTKdcTS.mjs";
import { t as Button } from "./button-BHP5c8oP.mjs";
import { t as Input } from "./label-DMECEQrM.mjs";
import { n as Field } from "./IntakeForm-DXrRTFGa.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/login-WsnYUpxi.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function Login() {
	const [mode, setMode] = (0, import_react.useState)("signin");
	const [email, setEmail] = (0, import_react.useState)("");
	const [password, setPassword] = (0, import_react.useState)("");
	const [name, setName] = (0, import_react.useState)("");
	const [error, setError] = (0, import_react.useState)(null);
	const [busy, setBusy] = (0, import_react.useState)(false);
	const onEmail = async (event) => {
		event.preventDefault();
		setBusy(true);
		setError(null);
		try {
			if (mode === "signup") {
				const result = await authClient.signUp.email({
					email,
					password,
					name
				});
				if (result.error) throw new Error(result.error.message ?? "Could not create account.");
			} else {
				const result = await authClient.signIn.email({
					email,
					password
				});
				if (result.error) throw new Error(result.error.message ?? "Could not sign in.");
			}
			window.location.assign("/account");
		} catch (err) {
			setError(err instanceof Error ? err.message : "Sign-in failed.");
		} finally {
			setBusy(false);
		}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SiteShell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
		className: "mx-auto grid min-h-[60vh] max-w-md place-items-center px-4 py-16",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "w-full border border-border bg-surface p-8",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "font-display text-3xl tracking-wide",
					children: "Sign in"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-sm text-muted",
					children: "Save vehicles and builds to your Hendrick Toyota Merriam account."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-6 space-y-3",
					children: [
						GROK_PROVIDERS.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							type: "button",
							variant: "secondary",
							className: "w-full",
							onClick: () => signIn(p.providerId, { callbackURL: "/account" }),
							children: ["Continue with ", p.label]
						}, p.providerId)),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "relative py-3 text-center text-xs uppercase tracking-[0.18em] text-muted",
							children: "or email"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
							className: "space-y-4",
							onSubmit: onEmail,
							children: [
								mode === "signup" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
									id: "name",
									label: "Name",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										id: "name",
										value: name,
										onChange: (e) => setName(e.target.value)
									})
								}) : null,
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
									id: "email",
									label: "Email",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										id: "email",
										type: "email",
										autoComplete: "email",
										value: email,
										onChange: (e) => setEmail(e.target.value)
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
									id: "password",
									label: "Password",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										id: "password",
										type: "password",
										autoComplete: mode === "signup" ? "new-password" : "current-password",
										value: password,
										onChange: (e) => setPassword(e.target.value)
									})
								}),
								error ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-sm text-accent",
									children: error
								}) : null,
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									type: "submit",
									className: "w-full",
									disabled: busy,
									children: busy ? "Please wait…" : mode === "signup" ? "Create account" : "Sign in"
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							className: "w-full text-sm text-muted",
							onClick: () => setMode((m) => m === "signin" ? "signup" : "signin"),
							children: mode === "signin" ? "Need an account? Create one" : "Already have an account? Sign in"
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "mt-6 text-xs text-muted",
					children: [
						"By continuing you agree to the ",
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/privacy",
							children: "privacy notice"
						}),
						"."
					]
				})
			]
		})
	}) });
}
//#endregion
export { Login as component };
