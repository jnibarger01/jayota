import { o as __toESM } from "../_runtime.mjs";
import { H as require_jsx_runtime, U as require_react, y as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { c as getLineupBySlug, d as getVehicleBySlug } from "./lineup-m5PRC25T.mjs";
import { a as useCurrentUserState, n as SiteShell, t as RedirectToSignIn } from "./SiteShell-DJTKdcTS.mjs";
import { n as listSavedVehicles, t as listSavedConfigurations } from "./saved-D90NdtMb.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/saved-DLtc5ZMc.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function SavedPage() {
	const { user, isPending } = useCurrentUserState();
	const [vehicles, setVehicles] = (0, import_react.useState)([]);
	const [builds, setBuilds] = (0, import_react.useState)([]);
	const [error, setError] = (0, import_react.useState)(null);
	(0, import_react.useEffect)(() => {
		if (!user) return;
		let cancelled = false;
		Promise.all([listSavedVehicles(), listSavedConfigurations()]).then(([v, b]) => {
			if (cancelled) return;
			setVehicles(v);
			setBuilds(b);
		}).catch((err) => {
			if (!cancelled) setError(err instanceof Error ? err.message : "Could not load saved items.");
		});
		return () => {
			cancelled = true;
		};
	}, [user]);
	if (isPending) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SiteShell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "mx-auto max-w-3xl px-4 py-24 text-sm text-muted",
		children: "Loading account…"
	}) });
	if (!user) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RedirectToSignIn, {});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SiteShell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "mx-auto max-w-4xl px-4 py-16 md:px-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "font-display text-5xl tracking-wide",
				children: "Garage"
			}),
			error ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-4 text-sm text-accent",
				children: error
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "mt-10 text-xs uppercase tracking-[0.2em] text-muted",
				children: "Saved vehicles"
			}),
			vehicles.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-4 text-sm text-muted",
				children: "No saved vehicles yet. Heart a model on the lineup to pin it here."
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "mt-4 grid gap-3 sm:grid-cols-2",
				children: vehicles.map((row) => {
					const lineup = getLineupBySlug(row.vehicle_slug);
					const vehicle = getVehicleBySlug(row.vehicle_slug);
					const label = lineup ? lineup.name : vehicle ? `${vehicle.year} ${vehicle.model}` : row.vehicle_slug;
					return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
						className: "overflow-hidden rounded-2xl border border-border bg-surface",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
							to: "/vehicles/$slug",
							params: { slug: lineup?.slug ?? row.vehicle_slug },
							className: "block",
							children: [lineup ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
								src: lineup.image.src,
								alt: lineup.image.alt,
								className: "aspect-video w-full object-cover"
							}) : null, /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "p-4",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "font-semibold",
									children: label
								}), lineup ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-1 text-sm text-muted",
									children: lineup.tagline
								}) : null]
							})]
						})
					}, row.vehicle_slug);
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "mt-10 text-xs uppercase tracking-[0.2em] text-muted",
				children: "Configurations"
			}),
			builds.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-4 text-sm text-muted",
				children: "Saved 3D builds also appear in the Garage inside the configurator. Pin a build there, then it can sync here when you are signed in."
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "mt-4 space-y-2",
				children: builds.map((row) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
					className: "border border-border bg-surface p-4 text-sm",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/vehicles/$slug/configure",
						params: { slug: row.vehicle_slug },
						children: row.label ?? row.configuration_id
					})
				}, row.id))
			})
		]
	}) });
}
//#endregion
export { SavedPage as component };
