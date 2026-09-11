import { o as __toESM } from "../_runtime.mjs";
import { H as require_jsx_runtime, U as require_react, y as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { T as Heart } from "../_libs/lucide-react.mjs";
import { a as useCurrentUserState } from "./SiteShell-DJTKdcTS.mjs";
import { n as listSavedVehicles, r as toggleSavedVehicle } from "./saved-D90NdtMb.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/FavoriteButton-Cr1X6nIl.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function FavoriteButton({ slug }) {
	const { user, isPending } = useCurrentUserState();
	const [saved, setSaved] = (0, import_react.useState)(false);
	const [busy, setBusy] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		if (!user) {
			setSaved(false);
			return;
		}
		let cancelled = false;
		listSavedVehicles().then((rows) => {
			if (!cancelled) setSaved(rows.some((row) => row.vehicle_slug === slug));
		}).catch(() => {
			if (!cancelled) setSaved(false);
		});
		return () => {
			cancelled = true;
		};
	}, [user, slug]);
	if (isPending) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: "inline-block h-8 w-8",
		"aria-hidden": "true"
	});
	if (!user) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
		to: "/login",
		className: "inline-flex h-11 w-11 items-center justify-center text-muted",
		"aria-label": "Sign in to save",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Heart, { size: 18 })
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
		type: "button",
		className: "inline-flex h-11 w-11 items-center justify-center text-fg",
		"aria-pressed": saved,
		"aria-label": saved ? "Remove from saved vehicles" : "Save vehicle",
		disabled: busy,
		onClick: () => {
			setBusy(true);
			toggleSavedVehicle({ data: { slug } }).then((result) => setSaved(result.saved)).finally(() => setBusy(false));
		},
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Heart, {
			size: 18,
			fill: saved ? "currentColor" : "none"
		})
	});
}
//#endregion
export { FavoriteButton as t };
