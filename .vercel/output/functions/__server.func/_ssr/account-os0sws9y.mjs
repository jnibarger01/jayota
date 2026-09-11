import { H as require_jsx_runtime, y as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as DEALER } from "./catalog-0lXXzwn9.mjs";
import { a as useCurrentUserState, n as SiteShell, r as UserButton, t as RedirectToSignIn } from "./SiteShell-DJTKdcTS.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/account-os0sws9y.js
var import_jsx_runtime = require_jsx_runtime();
function AccountPage() {
	const { user, isPending } = useCurrentUserState();
	if (isPending) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SiteShell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "mx-auto max-w-xl px-4 py-24 text-sm text-muted",
		children: "Loading account…"
	}) });
	if (!user) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RedirectToSignIn, {});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SiteShell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "mx-auto max-w-xl px-4 py-16 md:px-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "font-display text-5xl tracking-wide",
				children: "Account"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-4 text-sm text-muted",
				children: user.displayName ?? user.primaryEmail ?? "Signed in"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
				className: "mt-8 space-y-3 text-sm",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
						className: "border border-border bg-surface p-4",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/owners/saved",
							children: "Saved vehicles & configurations"
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
						className: "border border-border bg-surface p-4",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/owners/service",
							children: "Service requests"
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
						className: "border border-border bg-surface p-4",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/privacy",
							children: "Privacy & data"
						})
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "mt-8 text-sm text-muted",
				children: [
					"To delete your account and stored requests, sign out is not enough. Call ",
					DEALER.phone.general,
					" or write through the ",
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/dealership",
						className: "underline",
						children: "contact form"
					}),
					" and include the email on this account."
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-8",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(UserButton, {})
			})
		]
	}) });
}
//#endregion
export { AccountPage as component };
