import { o as __toESM } from "../_runtime.mjs";
import { _ as paintStudioPriceDelta, f as isHdriPresetId, i as DEFAULT_HDRI_PRESET_ID, n as CUSTOMIZATION_SCHEMA_VERSION, o as PAINT_CUSTOM_OPTION_ID, p as isMultiSelect, t as CATEGORY_APPLY_ORDER, v as selectionGroupOf } from "./paintStudio-DYvbOXnp.mjs";
import { H as require_jsx_runtime, U as require_react, V as notFound, _ as createFileRoute, d as HeadContent, g as lazyRouteComponent, h as Outlet, m as createRouter, u as Scripts, v as createRootRoute, x as useRouter, y as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as __exportAll } from "./rolldown-runtime-D7D4PA-g.mjs";
import { c as getLineupBySlug, d as getVehicleBySlug, f as isOptionAvailableForGrade, i as VEHICLE_SCHEMA_VERSION, l as getOptionById, r as VEHICLES, u as getOptionsForVehicle } from "./lineup-m5PRC25T.mjs";
import { bn as union, gn as object, hn as number, pn as literal, yn as string } from "../_libs/@better-auth/core+[...].mjs";
import { l as getInventoryState, n as DEALER, s as formatAddress, u as getOffersState } from "./catalog-0lXXzwn9.mjs";
import { i as newId, r as getSql } from "./id-B0Z1OARz.mjs";
import { n as auth } from "./server-6kxKE-qY.mjs";
import { a as forbidden, c as revisionConflict, i as enforceLimit, l as toErrorBody, n as LIMITS, o as invalidBody, r as clientKeyFromRequest, s as notFound$1, t as ApiError } from "./rate-limit-Bmx5kPmD.mjs";
import { a as TriangleAlert } from "../_libs/lucide-react.mjs";
import { t as Toaster } from "../_libs/sonner.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/seo-BseIvz2C.js
var SITE_NAME = DEALER.name;
function pageTitle(title) {
	return title === SITE_NAME ? title : `${title} · ${SITE_NAME}`;
}
function pageHead(title, description) {
	return { meta: [{ title: pageTitle(title) }, {
		name: "description",
		content: description
	}] };
}
/** LocalBusiness/AutoDealer structured data — only verified public facts. */
function autoDealerJsonLd() {
	return {
		"@context": "https://schema.org",
		"@type": "AutoDealer",
		name: DEALER.name,
		legalName: DEALER.legalName,
		url: DEALER.website,
		telephone: DEALER.phone.general,
		address: {
			"@type": "PostalAddress",
			streetAddress: DEALER.address.street,
			addressLocality: DEALER.address.city,
			addressRegion: DEALER.address.state,
			postalCode: DEALER.address.zip,
			addressCountry: DEALER.address.country
		},
		geo: {
			"@type": "GeoCoordinates",
			latitude: DEALER.geo.lat,
			longitude: DEALER.geo.lng
		},
		openingHoursSpecification: DEALER.hours.sales.map((row) => ({
			"@type": "OpeningHoursSpecification",
			dayOfWeek: row.day,
			opens: row.opens,
			closes: row.closes
		})),
		description: `${DEALER.name} digital showroom. ${formatAddress()}. Hours sourced from the Toyota.com dealer directory and should be confirmed before visiting.`
	};
}
function breadcrumbJsonLd(items) {
	return {
		"@context": "https://schema.org",
		"@type": "BreadcrumbList",
		itemListElement: items.map((item, index) => ({
			"@type": "ListItem",
			position: index + 1,
			name: item.name,
			item: item.path
		}))
	};
}
//#endregion
//#region node_modules/.nitro/vite/services/ssr/assets/router-BebVFJVp.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var FALLBACK_MESSAGE = "An unexpected error occurred. Try reloading the page.";
function errorMessage(error) {
	if (error instanceof Error && error.message) return error.message;
	if (typeof error === "string" && error) return error;
	return FALLBACK_MESSAGE;
}
function AppErrorComponent({ error }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "flex min-h-screen flex-col items-center justify-center gap-3 px-6 text-center bg-bg text-fg",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "text-accent",
				"aria-hidden": "true",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TriangleAlert, {
					className: "size-10",
					strokeWidth: 2
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "text-lg font-semibold",
				children: "Something went wrong"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "max-w-md text-sm break-words text-muted",
				children: errorMessage(error)
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
				to: "/",
				className: "mt-4 text-sm underline",
				children: "Return home"
			})
		]
	});
}
function NotFoundComponent() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "flex min-h-screen flex-col items-center justify-center gap-4 bg-bg px-6 text-center text-fg",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-xs uppercase tracking-[0.22em] text-muted",
				children: "404"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "font-display text-5xl tracking-wide",
				children: "Page not found"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "max-w-md text-sm text-muted",
				children: "That URL is not part of the Hendrick Toyota Merriam digital showroom."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
				to: "/",
				className: "mt-2 min-h-11 bg-accent px-5 py-3 text-sm text-accent-fg",
				children: "Return home"
			})
		]
	});
}
/**
* App-wide client provider mounted once near the root (in `src/routes/__root.tsx`):
*
*   <AuthProvider><Outlet /></AuthProvider>
*
* Better Auth's React client (`@/lib/auth/client`) needs NO context provider —
* its `useSession()` works standalone — so this is a passthrough today. It's
* kept as the single, stable mount point for any future client-side providers
* (e.g. a toast or theme provider) without churning the root shell.
*/
function AuthProvider({ children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children });
}
var CONNECTOR_TOKEN_READY_EVENT = "grok:connector-token-ready";
function isGrokEmbedderOrigin(origin) {
	try {
		const url = new URL(origin);
		if (url.protocol !== "https:" && url.protocol !== "http:") return false;
		const host = url.hostname.toLowerCase();
		if (host === "grok.com" || host.endsWith(".grok.com")) return true;
		if (host === "localhost" || host === "127.0.0.1" || host === "[::1]") return true;
		return false;
	} catch {
		return false;
	}
}
function isSandboxPreviewGuestHost(hostname) {
	const host = hostname.toLowerCase();
	return host === "grok-sandbox.com" || host.endsWith(".grok-sandbox.com");
}
function isRemintPreviewPair(guestHost, parentHost) {
	const guest = guestHost.toLowerCase();
	const parent = parentHost.toLowerCase();
	const i = guest.indexOf(".preview.");
	if (i <= 0) return false;
	const label = guest.slice(0, i);
	const rest = guest.slice(i + 9);
	if (label.includes(".") || !rest.includes(".")) return false;
	return parent === rest || parent === `grok.${rest}`;
}
function resolveParentEmbedderOrigin(parentIsSelf, referrer, ancestorOrigin, guestHostname = "") {
	if (parentIsSelf) return null;
	for (const candidate of [referrer, ancestorOrigin ?? ""].filter(Boolean)) try {
		const url = new URL(candidate.includes("://") ? candidate : `https://${candidate}`);
		if (url.protocol !== "https:" && url.protocol !== "http:") continue;
		if (isGrokEmbedderOrigin(url.origin)) return url.origin;
		if (isSandboxPreviewGuestHost(guestHostname) || isRemintPreviewPair(guestHostname, url.hostname)) return url.origin;
	} catch {}
	return null;
}
/**
* Guest side of the grok-web ↔ sandbox preview postMessage bridge.
*
* Activates only when this page is framed by an allowlisted Grok embedder.
* Top-level runs (download/export, local `npm run dev`, deployed sites) noop.
*/
var PREVIEW_BRIDGE_CHANNEL = "grok-preview-bridge";
var EnvelopeSchema = object({
	channel: literal(PREVIEW_BRIDGE_CHANNEL),
	version: number().int().positive(),
	type: string().min(1)
});
var HelloSchema = EnvelopeSchema.extend({ type: literal("hello") });
var NavigateSchema = EnvelopeSchema.extend({
	type: literal("navigate"),
	path: string().min(1)
});
var HistorySchema = EnvelopeSchema.extend({
	type: literal("history"),
	delta: union([literal(-1), literal(1)])
});
var ConnectorTokenReadySchema = EnvelopeSchema.extend({ type: literal("connector-token-ready") });
function isSafeBridgePath(path) {
	if (!path.startsWith("/") || path.startsWith("//") || path.includes("\\")) return false;
	try {
		return new URL(path, "https://preview.invalid").origin === "https://preview.invalid";
	} catch {
		return false;
	}
}
/**
* Origin of the Grok embedder framing this page, or null when the page runs
* top-level (download/export, local `npm run dev`, deployed sites) or under a
* non-Grok parent. Client-only; null during SSR.
*/
function resolveCurrentEmbedderOrigin() {
	if (typeof window === "undefined") return null;
	const ancestorOrigin = typeof location.ancestorOrigins !== "undefined" && location.ancestorOrigins.length > 0 ? location.ancestorOrigins[0] : null;
	return resolveParentEmbedderOrigin(window.parent === window, document.referrer, ancestorOrigin, window.location.hostname);
}
/**
* Install host↔guest messaging. Returns a dispose function.
* Noops (returns a no-op dispose) when not embedded under a Grok parent.
*/
function installPreviewHostBridge(options = {}) {
	const parentOrigin = resolveCurrentEmbedderOrigin();
	if (parentOrigin === null) return () => {};
	const ROOT_STATE_KEY = "__grokPreviewBridgeRoot";
	const originalPushState = window.history.pushState.bind(window.history);
	const originalReplaceState = window.history.replaceState.bind(window.history);
	const isAtHistoryRoot = () => {
		const state = window.history.state;
		return Boolean(state && typeof state === "object" && state[ROOT_STATE_KEY] === true);
	};
	try {
		const current = window.history.state;
		if (!(current !== null && typeof current === "object" && Object.prototype.hasOwnProperty.call(current, ROOT_STATE_KEY))) {
			const isRoot = window.history.length <= 1;
			originalReplaceState(current && typeof current === "object" ? {
				...current,
				[ROOT_STATE_KEY]: isRoot
			} : { [ROOT_STATE_KEY]: isRoot }, "", window.location.href);
		}
	} catch {}
	const post = (message) => {
		window.parent.postMessage(message, parentOrigin);
	};
	const reportLocation = () => {
		post({
			channel: PREVIEW_BRIDGE_CHANNEL,
			version: 1,
			type: "location",
			path: window.location.pathname || "/",
			search: window.location.search,
			hash: window.location.hash
		});
	};
	const reportRoutes = () => {
		const paths = options.getRoutePaths?.() ?? [];
		post({
			channel: PREVIEW_BRIDGE_CHANNEL,
			version: 1,
			type: "routes",
			paths
		});
	};
	const defaultNavigate = (path) => {
		if (!isSafeBridgePath(path)) return;
		try {
			const url = new URL(path, window.location.origin);
			if (url.origin !== window.location.origin) return;
			const next = `${url.pathname}${url.search}${url.hash}`;
			window.history.pushState(window.history.state, "", next);
			window.dispatchEvent(new PopStateEvent("popstate", { state: window.history.state }));
		} catch {}
	};
	const navigate = (path) => {
		if (!isSafeBridgePath(path)) return;
		if (options.navigate) {
			options.navigate(path);
			return;
		}
		defaultNavigate(path);
	};
	const announce = () => {
		reportLocation();
		reportRoutes();
		post({
			channel: PREVIEW_BRIDGE_CHANNEL,
			version: 1,
			type: "ready"
		});
	};
	const onHello = (data) => {
		if (!HelloSchema.safeParse(data).success) return;
		announce();
	};
	const onNavigate = (data) => {
		const parsed = NavigateSchema.safeParse(data);
		if (!parsed.success) return;
		navigate(parsed.data.path);
		queueMicrotask(reportLocation);
	};
	const onHistory = (data) => {
		const parsed = HistorySchema.safeParse(data);
		if (!parsed.success) return;
		if (parsed.data.delta === -1 && isAtHistoryRoot()) return;
		window.history.go(parsed.data.delta);
	};
	const onConnectorTokenReady = (data) => {
		if (!ConnectorTokenReadySchema.safeParse(data).success) return;
		window.dispatchEvent(new Event(CONNECTOR_TOKEN_READY_EVENT));
	};
	const hostMessageHandlers = /* @__PURE__ */ new Map([
		["hello", onHello],
		["navigate", onNavigate],
		["history", onHistory],
		["connector-token-ready", onConnectorTokenReady]
	]);
	const onMessage = (event) => {
		if (event.source !== window.parent) return;
		if (event.origin !== parentOrigin) return;
		const envelope = EnvelopeSchema.safeParse(event.data);
		if (!envelope.success || envelope.data.version !== 1) return;
		hostMessageHandlers.get(envelope.data.type)?.(event.data);
	};
	const onPopState = () => {
		reportLocation();
	};
	const onHashChange = () => {
		reportLocation();
	};
	window.history.pushState = (data, unused, url) => {
		const next = data && typeof data === "object" ? {
			...data,
			[ROOT_STATE_KEY]: false
		} : data;
		originalPushState(next, unused, url);
		reportLocation();
	};
	window.history.replaceState = (data, unused, url) => {
		const next = isAtHistoryRoot() ? {
			...data && typeof data === "object" ? data : {},
			[ROOT_STATE_KEY]: true
		} : data;
		originalReplaceState(next, unused, url);
		reportLocation();
	};
	window.addEventListener("message", onMessage);
	window.addEventListener("popstate", onPopState);
	window.addEventListener("hashchange", onHashChange);
	announce();
	return () => {
		window.removeEventListener("message", onMessage);
		window.removeEventListener("popstate", onPopState);
		window.removeEventListener("hashchange", onHashChange);
		window.history.pushState = originalPushState;
		window.history.replaceState = originalReplaceState;
	};
}
/** Collect static path patterns from a TanStack route tree (best-effort). */
function collectRoutePathsFromTree(routeTree) {
	const paths = /* @__PURE__ */ new Set();
	const walk = (node) => {
		if (!node || typeof node !== "object") return;
		const record = node;
		const full = typeof record.fullPath === "string" ? record.fullPath : typeof record.path === "string" ? record.path : null;
		if (full !== null && full !== "") paths.add(full.startsWith("/") ? full : `/${full}`);
		else if (full === "") paths.add("/");
		const children = record.children;
		if (Array.isArray(children)) for (const child of children) walk(child);
		else if (children && typeof children === "object") for (const child of Object.values(children)) walk(child);
	};
	walk(routeTree);
	return [...paths];
}
/**
* Mount once in `__root.tsx` so the Grok preview chrome can drive navigation
* (and later receive registered routes). Noops when the app is not embedded.
*/
function PreviewHostBridge() {
	const router = useRouter();
	(0, import_react.useEffect)(() => {
		return installPreviewHostBridge({
			navigate: (path) => {
				router.history.push(path);
			},
			getRoutePaths: () => collectRoutePathsFromTree(router.routeTree)
		});
	}, [router]);
	return null;
}
var styles_default = "/assets/styles-CH6Bt9ZL.css";
var APP_NAME = "Hendrick Toyota Merriam";
var Route$26 = createRootRoute({
	head: () => ({
		meta: [
			{ charSet: "utf-8" },
			{
				name: "viewport",
				content: "width=device-width, initial-scale=1"
			},
			{ title: APP_NAME },
			{
				name: "description",
				content: "Digital showroom for Hendrick Toyota Merriam — vehicles, 3D configurator, service requests, and dealership information."
			},
			{
				name: "theme-color",
				content: "#0b0d11"
			},
			{
				name: "referrer",
				content: "strict-origin-when-cross-origin"
			}
		],
		links: [
			{
				rel: "icon",
				type: "image/svg+xml",
				href: "/favicon.svg"
			},
			{
				rel: "stylesheet",
				href: styles_default
			},
			{
				rel: "manifest",
				href: "/__grok/manifest.webmanifest"
			},
			{
				rel: "apple-touch-icon",
				href: "/__grok/icon-180.png"
			},
			{
				rel: "preconnect",
				href: "https://fonts.googleapis.com"
			},
			{
				rel: "preconnect",
				href: "https://fonts.gstatic.com",
				crossOrigin: "anonymous"
			},
			{
				rel: "stylesheet",
				href: "https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700&display=swap"
			},
			{
				rel: "canonical",
				href: "/"
			}
		]
	}),
	component: RootComponent
});
function RootComponent() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("html", {
		lang: "en",
		suppressHydrationWarning: true,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("head", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HeadContent, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("body", { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PreviewHostBridge, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AuthProvider, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Outlet, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Toaster, {
				theme: "dark",
				richColors: false
			})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Scripts, {})
		] })]
	});
}
var $$splitComponentImporter$21 = () => import("./routes-DA-MIChL.mjs");
var Route$25 = createFileRoute("/")({
	head: () => pageHead(DEALER.name, "Move a Better Tomorrow. Explore the Toyota lineup at Hendrick Toyota Merriam."),
	loader: () => getInventoryState(),
	component: lazyRouteComponent($$splitComponentImporter$21, "component")
});
var $$splitComponentImporter$20 = () => import("./accessibility-BJ2PUODF.mjs");
var Route$24 = createFileRoute("/accessibility")({ component: lazyRouteComponent($$splitComponentImporter$20, "component") });
var $$splitComponentImporter$19 = () => import("./account-os0sws9y.mjs");
var Route$23 = createFileRoute("/account")({
	head: () => pageHead("Account", "Saved vehicles, configurations, and account controls."),
	component: lazyRouteComponent($$splitComponentImporter$19, "component")
});
var $$splitComponentImporter$18 = () => import("./dealership-CHVe5vKR.mjs");
var Route$22 = createFileRoute("/dealership")({
	head: () => pageHead("Find us", `Hours, directions, and contact for ${DEALER.name} at ${formatAddress()}.`),
	component: lazyRouteComponent($$splitComponentImporter$18, "component")
});
var $$splitComponentImporter$17 = () => import("./login-WsnYUpxi.mjs");
var Route$21 = createFileRoute("/login")({ component: lazyRouteComponent($$splitComponentImporter$17, "component") });
var $$splitComponentImporter$16 = () => import("./privacy-yz6SA_kf.mjs");
var Route$20 = createFileRoute("/privacy")({
	head: () => pageHead("Privacy", "How Hendrick Toyota Merriam handles contact data, accounts, and analytics consent."),
	component: lazyRouteComponent($$splitComponentImporter$16, "component")
});
function jsonResponse(body, init = {}) {
	const headers = new Headers(init.headers);
	if (!headers.has("content-type")) headers.set("content-type", "application/json; charset=utf-8");
	headers.set("X-Content-Type-Options", "nosniff");
	headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
	headers.set("X-Frame-Options", "DENY");
	return new Response(JSON.stringify(body), {
		...init,
		headers
	});
}
function errorResponse(err) {
	if (err instanceof ApiError) {
		const headers = {};
		if (err.status === 429) headers["Retry-After"] = "60";
		return jsonResponse(toErrorBody(err), {
			status: err.status,
			headers
		});
	}
	const requestId = crypto.randomUUID();
	console.error("[api]", requestId, err instanceof Error ? err.message : "unknown_error");
	return jsonResponse({ error: {
		code: "internal_error",
		status: 500,
		message: "Something went wrong. Please retry."
	} }, {
		status: 500,
		headers: { "x-request-id": requestId }
	});
}
var Route$19 = createFileRoute("/api/health")({ server: { handlers: { GET: () => jsonResponse({
	status: "ok",
	schemaVersion: VEHICLE_SCHEMA_VERSION,
	vehicleCount: VEHICLES.length,
	timestamp: (/* @__PURE__ */ new Date()).toISOString()
}) } } });
var $$splitComponentImporter$15 = () => import("./disclosures-lCrwAbJc.mjs");
var Route$18 = createFileRoute("/legal/disclosures")({ component: lazyRouteComponent($$splitComponentImporter$15, "component") });
var $$splitComponentImporter$14 = () => import("./owners-BKgMFEpJ.mjs");
var Route$17 = createFileRoute("/owners/")({
	head: () => pageHead("Owners", "Service scheduling, maintenance resources, and saved vehicles for Toyota owners."),
	component: lazyRouteComponent($$splitComponentImporter$14, "component")
});
var $$splitComponentImporter$13 = () => import("./maintenance-C0Pg4xvM.mjs");
var Route$16 = createFileRoute("/owners/maintenance")({ component: lazyRouteComponent($$splitComponentImporter$13, "component") });
var $$splitComponentImporter$12 = () => import("./resources-BAK5VV5B.mjs");
var Route$15 = createFileRoute("/owners/resources")({ component: lazyRouteComponent($$splitComponentImporter$12, "component") });
var $$splitComponentImporter$11 = () => import("./saved-DLtc5ZMc.mjs");
var Route$14 = createFileRoute("/owners/saved")({ component: lazyRouteComponent($$splitComponentImporter$11, "component") });
var $$splitComponentImporter$10 = () => import("./service-DMP9T_Qt.mjs");
var Route$13 = createFileRoute("/owners/service")({ component: lazyRouteComponent($$splitComponentImporter$10, "component") });
var $$splitComponentImporter$9 = () => import("./shop-BoqA_p9b.mjs");
var Route$12 = createFileRoute("/shop/")({
	head: () => pageHead("Shop", "Inventory, finance, trade-in, test drives, and offers at Hendrick Toyota Merriam."),
	component: lazyRouteComponent($$splitComponentImporter$9, "component")
});
var $$splitComponentImporter$8 = () => import("./finance-DCNemDAm.mjs");
var searchSchema$2 = object({ slug: string().optional() });
var Route$11 = createFileRoute("/shop/finance")({
	validateSearch: (s) => searchSchema$2.parse(s),
	component: lazyRouteComponent($$splitComponentImporter$8, "component")
});
var $$splitComponentImporter$7 = () => import("./inventory-DwKvY4cM.mjs");
var Route$10 = createFileRoute("/shop/inventory")({
	loader: () => getInventoryState(),
	component: lazyRouteComponent($$splitComponentImporter$7, "component")
});
var $$splitComponentImporter$6 = () => import("./offers-BYTOuHa3.mjs");
var Route$9 = createFileRoute("/shop/offers")({
	loader: () => getOffersState(),
	component: lazyRouteComponent($$splitComponentImporter$6, "component")
});
var $$splitComponentImporter$5 = () => import("./test-drive-DwgJBPPK.mjs");
var searchSchema$1 = object({ vehicle: string().optional() });
var Route$8 = createFileRoute("/shop/test-drive")({
	validateSearch: (s) => searchSchema$1.parse(s),
	component: lazyRouteComponent($$splitComponentImporter$5, "component")
});
var $$splitComponentImporter$4 = () => import("./trade-in-Drk6UwJX.mjs");
var Route$7 = createFileRoute("/shop/trade-in")({ component: lazyRouteComponent($$splitComponentImporter$4, "component") });
var $$splitComponentImporter$3 = () => import("./vehicles-DpUxBIzb.mjs");
var Route$6 = createFileRoute("/vehicles/")({
	head: () => pageHead("Vehicles", "Find the Toyota that fits your life — SUVs, cars, trucks, hybrids, and electric."),
	component: lazyRouteComponent($$splitComponentImporter$3, "component")
});
var $$splitComponentImporter$2 = () => import("./compare-ssveVEh1.mjs");
var searchSchema = object({ vehicles: string().optional() });
var Route$5 = createFileRoute("/vehicles/compare")({
	validateSearch: (search) => searchSchema.parse(search),
	component: lazyRouteComponent($$splitComponentImporter$2, "component")
});
var Route$4 = createFileRoute("/api/auth/$")({ server: { handlers: {
	GET: ({ request }) => auth.handler(request),
	POST: ({ request }) => auth.handler(request)
} } });
var $$splitComponentImporter$1 = () => import("../_slug-BNmssjpB.mjs");
var Route$3 = createFileRoute("/vehicles/$slug/")({
	loader: ({ params }) => {
		const vehicle = getVehicleBySlug(params.slug);
		const lineup = getLineupBySlug(params.slug);
		if (vehicle) return {
			kind: "catalog",
			vehicle,
			lineup
		};
		if (lineup) return {
			kind: "lineup",
			lineup
		};
		throw notFound();
	},
	head: ({ loaderData }) => {
		if (!loaderData) return pageHead("Vehicle", "Vehicle catalog");
		if (loaderData.kind === "lineup") return pageHead(loaderData.lineup.name, `${loaderData.lineup.tagline} Merchandising overview — not a live Toyota quote.`);
		const vehicle = loaderData.vehicle;
		return pageHead(`${vehicle.year} ${vehicle.model}`, `Catalog overview for the ${vehicle.year} Toyota ${vehicle.model}. Figures are project catalog data, not live Toyota quotes.`);
	},
	component: lazyRouteComponent($$splitComponentImporter$1, "component")
});
var $$splitComponentImporter = () => import("./configure-BNt4d2b5.mjs");
var Route$2 = createFileRoute("/vehicles/$slug/configure")({
	loader: ({ params }) => {
		const vehicle = getVehicleBySlug(params.slug);
		if (!vehicle) throw notFound();
		return {
			slug: params.slug,
			hasModel: vehicle.threeDConfig.hasModel
		};
	},
	component: lazyRouteComponent($$splitComponentImporter, "component")
});
/**
* Per-configuration capability tokens.
*
* `POST /api/v1/configurations` currently has no notion of who created a record: any client that
* later learns a `configurationId` — which can leak through a shared URL, browser history, or a
* referrer header — can PATCH or DELETE someone else's saved build. There is no user-account system
* to authenticate against, so this implements the minimum that actually closes the gap: the server
* mints a random token at creation time, stores only its hash, and returns the plaintext token to
* the creator exactly once. Every subsequent write must present that token; reads stay open, since
* "read" is what the (separately tracked) sharing feature needs to keep working.
*
* Deliberately per-configuration rather than per-device: a leaked token compromises one saved build,
* not every configuration a browser has ever created, and it needs no separate provisioning step —
* `create` and "get an owner token" are the same call.
*
* `crypto.subtle` and `crypto.getRandomValues` are standard Web Crypto APIs — available in Node 22+,
* the Workers runtime, and every browser — so this has no extra dependency and is imported by both
* sides of the ownership check: `lib/server/configurationRepository.ts` (the real API, in-memory
* today and D1 once Task 7 lands) and `lib/api/localConfigurationTransport.ts` (the browser-only
* fallback used when no request-aware backend exists, which enforces the identical rule against its
* own localStorage-backed store for consistency, even though a same-origin browser tab is already
* its own isolation boundary).
*/
var TOKEN_BYTES = 32;
function toBase64Url(bytes) {
	let binary = "";
	for (const byte of bytes) binary += String.fromCharCode(byte);
	return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}
/** A new plaintext capability token. Return it to the caller once; never store it as given. */
function generateOwnerToken() {
	const bytes = new Uint8Array(TOKEN_BYTES);
	crypto.getRandomValues(bytes);
	return toBase64Url(bytes);
}
/** SHA-256 of a token, base64url-encoded. This is what repositories persist, never the plaintext. */
async function hashOwnerToken(token) {
	const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(token));
	return toBase64Url(new Uint8Array(digest));
}
/**
* Constant-time equality for the two hash strings. The hash itself already makes guessing
* infeasible; this only removes the (much weaker, but free to close) timing side-channel a naive
* `===` comparison leaves on how many leading bytes matched.
*/
function timingSafeEqual(a, b) {
	if (a.length !== b.length) return false;
	let diff = 0;
	for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
	return diff === 0;
}
/** Verifies a presented plaintext token against a stored hash. */
async function verifyOwnerToken(token, storedHash) {
	if (!token) return false;
	return timingSafeEqual(await hashOwnerToken(token), storedHash);
}
function parseJson(raw, fallback) {
	if (!raw) return fallback;
	try {
		return JSON.parse(raw);
	} catch {
		return fallback;
	}
}
function toConfiguration(row) {
	return {
		configurationId: row.id,
		vehicleId: row.vehicle_id,
		modelYear: Number(row.model_year),
		model: row.model,
		gradeId: row.grade_id,
		selections: parseJson(row.selections, {}),
		cameraState: parseJson(row.camera_state, void 0),
		paintStudio: parseJson(row.paint_studio, void 0),
		revision: Number(row.revision),
		schemaVersion: row.schema_version,
		createdAt: typeof row.created_at === "string" ? row.created_at : new Date(row.created_at).toISOString(),
		updatedAt: typeof row.updated_at === "string" ? row.updated_at : new Date(row.updated_at).toISOString()
	};
}
var PostgresConfigurationRepository = class {
	async create(input) {
		const sql = await getSql();
		const id = newId("cfg");
		const now = (/* @__PURE__ */ new Date()).toISOString();
		const ownerToken = generateOwnerToken();
		const ownerTokenHash = await hashOwnerToken(ownerToken);
		const configuration = {
			configurationId: id,
			vehicleId: input.vehicleId,
			modelYear: input.modelYear,
			model: input.model,
			gradeId: input.gradeId,
			selections: input.selections,
			cameraState: input.cameraState,
			paintStudio: input.paintStudio,
			revision: 1,
			schemaVersion: CUSTOMIZATION_SCHEMA_VERSION,
			createdAt: now,
			updatedAt: now
		};
		await sql`
      insert into configurations (
        id, vehicle_id, model_year, model, grade_id, owner_token_hash,
        selections, camera_state, paint_studio, revision, schema_version, created_at, updated_at
      ) values (
        ${id}, ${input.vehicleId}, ${input.modelYear}, ${input.model}, ${input.gradeId}, ${ownerTokenHash},
        ${JSON.stringify(input.selections)}, ${input.cameraState ? JSON.stringify(input.cameraState) : null},
        ${input.paintStudio ? JSON.stringify(input.paintStudio) : null},
        ${1}, ${CUSTOMIZATION_SCHEMA_VERSION}, ${now}, ${now}
      )
    `;
		await sql`
      insert into configuration_revisions (id, configuration_id, revision, selections, camera_state, paint_studio, created_at)
      values (${newId("rev")}, ${id}, ${1}, ${JSON.stringify(input.selections)},
        ${input.cameraState ? JSON.stringify(input.cameraState) : null},
        ${input.paintStudio ? JSON.stringify(input.paintStudio) : null}, ${now})
    `;
		return {
			configuration,
			ownerToken
		};
	}
	async get(configurationId) {
		const rows = await (await getSql())`select * from configurations where id = ${configurationId} limit 1`;
		return rows[0] ? toConfiguration(rows[0]) : null;
	}
	async requireOwner(configurationId, ownerToken) {
		const rows = await (await getSql())`
      select owner_token_hash from configurations where id = ${configurationId} limit 1
    `;
		if (!rows[0]) throw notFound$1(`No configuration found with id "${configurationId}".`);
		if (!await verifyOwnerToken(ownerToken, rows[0].owner_token_hash)) throw forbidden(`Owner token missing or does not match for configuration "${configurationId}".`);
	}
	async update(configurationId, patch, ownerToken) {
		await this.requireOwner(configurationId, ownerToken);
		const existing = await this.get(configurationId);
		if (!existing) throw notFound$1(`No configuration found with id "${configurationId}".`);
		if (patch.expectedRevision !== void 0 && patch.expectedRevision !== existing.revision) throw revisionConflict(`Configuration "${configurationId}" is at revision ${existing.revision}, not ${patch.expectedRevision}. Reload before retrying.`);
		const next = {
			...existing,
			selections: patch.selections ?? existing.selections,
			cameraState: patch.cameraState ?? existing.cameraState,
			paintStudio: patch.paintStudio ?? existing.paintStudio,
			revision: existing.revision + 1,
			updatedAt: (/* @__PURE__ */ new Date()).toISOString()
		};
		const sql = await getSql();
		await sql`
      update configurations set
        selections = ${JSON.stringify(next.selections)},
        camera_state = ${next.cameraState ? JSON.stringify(next.cameraState) : null},
        paint_studio = ${next.paintStudio ? JSON.stringify(next.paintStudio) : null},
        revision = ${next.revision},
        updated_at = ${next.updatedAt}
      where id = ${configurationId}
    `;
		await sql`
      insert into configuration_revisions (id, configuration_id, revision, selections, camera_state, paint_studio, created_at)
      values (${newId("rev")}, ${configurationId}, ${next.revision}, ${JSON.stringify(next.selections)},
        ${next.cameraState ? JSON.stringify(next.cameraState) : null},
        ${next.paintStudio ? JSON.stringify(next.paintStudio) : null}, ${next.updatedAt})
    `;
		return next;
	}
	async delete(configurationId, ownerToken) {
		if (!await this.get(configurationId)) return false;
		await this.requireOwner(configurationId, ownerToken);
		const sql = await getSql();
		await sql`delete from configuration_revisions where configuration_id = ${configurationId}`;
		await sql`delete from configurations where id = ${configurationId}`;
		return true;
	}
	async listRevisions(configurationId) {
		const current = await this.get(configurationId);
		if (!current) return [];
		return (await (await getSql())`
      select revision, selections, camera_state, paint_studio, created_at
      from configuration_revisions
      where configuration_id = ${configurationId}
      order by revision asc
    `).map((row) => ({
			...current,
			selections: parseJson(row.selections, {}),
			cameraState: parseJson(row.camera_state, void 0),
			paintStudio: parseJson(row.paint_studio, void 0),
			revision: Number(row.revision),
			updatedAt: typeof row.created_at === "string" ? row.created_at : new Date(row.created_at).toISOString()
		}));
	}
};
var pgSingleton = null;
function getPostgresConfigurationRepository() {
	pgSingleton ??= new PostgresConfigurationRepository();
	return pgSingleton;
}
function getConfigurationRepository() {
	return resolveConfigurationRepository();
}
/**
* Tests may swap in the in-memory implementation. Production API routes use Postgres.
*/
var override = null;
function resolveConfigurationRepository() {
	return override ?? getPostgresConfigurationRepository();
}
/**
* Server-side validation and trusted asset resolution.
*
* The browser sends option ids and nothing else. Node names, material names, and GLB paths are
* attached here, from the server's own catalog — so a crafted request cannot point the loader at
* an arbitrary URL or rewrite a material the catalog does not expose.
*/
var CATEGORIES = new Set(CATEGORY_APPLY_ORDER);
function asString(value, field) {
	if (typeof value !== "string" || value.trim() === "") throw invalidBody(`"${field}" must be a non-empty string.`);
	return value;
}
/**
* Validates vehicle / grade / model-year coherence against the catalog.
*
* The year is checked against the vehicle record rather than accepted as given, which is what
* rejects an otherwise well-formed request for a 2019 TRD Pro 4Runner with 2024 options.
*/
function validateVehicleIdentity(vehicleId, modelYear, gradeId) {
	const vehicle = getVehicleBySlug(vehicleId);
	if (!vehicle) throw notFound$1(`No vehicle found for id "${vehicleId}".`);
	if (!Number.isInteger(modelYear)) throw invalidBody(`"modelYear" must be an integer.`);
	if (modelYear !== vehicle.year) throw invalidBody(`Model year ${modelYear} is not available for "${vehicleId}" (catalog year ${vehicle.year}).`);
	const grade = vehicle.grades.find((candidate) => candidate.id === gradeId);
	if (!grade) {
		const available = vehicle.grades.map((candidate) => candidate.id).join(", ");
		throw invalidBody(`Grade "${gradeId}" is not offered on the ${vehicle.year} ${vehicle.model}. Available: ${available}.`);
	}
	return {
		vehicle,
		grade
	};
}
/**
* Validates a selection map: every id must exist in the vehicle's catalog, sit in the category it
* claims, be offered on the chosen grade, and respect single- versus multi-select cardinality.
*/
function validateSelections(vehicleId, gradeId, raw) {
	if (raw === void 0 || raw === null) return {};
	if (typeof raw !== "object" || Array.isArray(raw)) throw invalidBody(`"selections" must be an object keyed by category.`);
	const result = {};
	const seenCategories = /* @__PURE__ */ new Set();
	for (const [category, value] of Object.entries(raw)) {
		if (!CATEGORIES.has(category)) throw invalidBody(`Unknown customization category "${category}".`);
		if (!Array.isArray(value) || value.some((id) => typeof id !== "string")) throw invalidBody(`"selections.${category}" must be an array of option ids.`);
		const typed = category;
		seenCategories.add(typed);
		const ids = value;
		if (new Set(ids).size !== ids.length) throw invalidBody(`Category "${category}" contains duplicate option ids.`);
		for (const id of ids) {
			const option = getOptionById(vehicleId, id);
			if (!option) throw invalidBody(`Unknown option id "${id}" for vehicle "${vehicleId}".`);
			if (option.category !== typed) throw invalidBody(`Option "${id}" belongs to category "${option.category}", not "${category}".`);
			if (!option.compatibleVehicleIds.includes(vehicleId)) throw invalidBody(`Option "${id}" is not compatible with vehicle "${vehicleId}".`);
			if (!isOptionAvailableForGrade(option, gradeId)) throw invalidBody(`Option "${id}" is not available on grade "${gradeId}".`);
		}
		if (!isMultiSelect(typed)) {
			const seenGroups = /* @__PURE__ */ new Map();
			for (const id of ids) {
				const group = selectionGroupOf(getOptionById(vehicleId, id));
				const clash = seenGroups.get(group);
				if (clash) throw invalidBody(`Selection group "${group}" accepts a single option; received both "${clash}" and "${id}".`);
				seenGroups.set(group, id);
			}
		}
		result[typed] = ids;
	}
	return result;
}
var VECTOR_LENGTH = 3;
function validateCameraState(raw) {
	if (raw === void 0 || raw === null) return void 0;
	if (typeof raw !== "object") throw invalidBody(`"cameraState" must be an object.`);
	const candidate = raw;
	const readVector = (key) => {
		const value = candidate[key];
		if (!Array.isArray(value) || value.length !== VECTOR_LENGTH || value.some((n) => typeof n !== "number" || !Number.isFinite(n))) throw invalidBody(`"cameraState.${key}" must be an array of three finite numbers.`);
		return value;
	};
	const presetId = candidate.presetId;
	if (presetId !== void 0 && typeof presetId !== "string") throw invalidBody(`"cameraState.presetId" must be a string when present.`);
	return {
		presetId,
		position: readVector("position"),
		target: readVector("target")
	};
}
var HEX_COLOR = /^#([0-9a-fA-F]{6})$/;
function clampUnit(value, field) {
	if (typeof value !== "number" || !Number.isFinite(value)) throw invalidBody(`"paintStudio.${field}" must be a finite number.`);
	if (value < 0 || value > 1) throw invalidBody(`"paintStudio.${field}" must be between 0 and 1.`);
	return value;
}
function validatePaintStudioMaterial(raw) {
	if (typeof raw !== "object" || raw === null || Array.isArray(raw)) throw invalidBody(`"paintStudio.material" must be an object.`);
	const candidate = raw;
	if (typeof candidate.color !== "string" || !HEX_COLOR.test(candidate.color)) throw invalidBody(`"paintStudio.material.color" must be a #rrggbb hex string.`);
	return {
		color: candidate.color.toLowerCase(),
		metalness: clampUnit(candidate.metalness, "material.metalness"),
		roughness: clampUnit(candidate.roughness, "material.roughness"),
		clearcoat: clampUnit(candidate.clearcoat, "material.clearcoat"),
		clearcoatRoughness: clampUnit(candidate.clearcoatRoughness, "material.clearcoatRoughness")
	};
}
/**
* Validates paint-studio state: OEM vs custom modes, HDRI preset ids, and numeric material params.
* Never accepts GLB node or material names — those stay in the server catalog.
*/
function validatePaintStudio(raw, selections = {}) {
	if (raw === void 0 || raw === null) return void 0;
	if (typeof raw !== "object" || Array.isArray(raw)) throw invalidBody(`"paintStudio" must be an object.`);
	const candidate = raw;
	const mode = candidate.mode;
	if (mode !== "oem" && mode !== "custom") throw invalidBody(`"paintStudio.mode" must be "oem" or "custom".`);
	let hdriPresetId;
	if (candidate.hdriPresetId !== void 0 && candidate.hdriPresetId !== null) {
		if (typeof candidate.hdriPresetId !== "string" || !isHdriPresetId(candidate.hdriPresetId)) throw invalidBody(`Unknown HDRI preset id "${String(candidate.hdriPresetId)}".`);
		hdriPresetId = candidate.hdriPresetId;
	}
	const paintIds = selections.paint ?? [];
	const hasCustomPaint = paintIds.includes(PAINT_CUSTOM_OPTION_ID);
	if (mode === "oem") {
		if (hasCustomPaint) throw invalidBody(`OEM paint mode cannot select "${PAINT_CUSTOM_OPTION_ID}"; use a catalog OEM paint option id.`);
		if (candidate.material !== void 0 && candidate.material !== null) throw invalidBody(`"paintStudio.material" is only valid in custom mode.`);
		return {
			mode: "oem",
			...hdriPresetId ? { hdriPresetId } : { hdriPresetId: DEFAULT_HDRI_PRESET_ID }
		};
	}
	if (!hasCustomPaint) throw invalidBody(`Custom paint mode requires selections.paint to include "${PAINT_CUSTOM_OPTION_ID}".`);
	if (paintIds.length !== 1 || paintIds[0] !== "paint-custom") throw invalidBody(`Custom paint mode accepts only "${PAINT_CUSTOM_OPTION_ID}" in selections.paint.`);
	if (candidate.material === void 0 || candidate.material === null) throw invalidBody(`"paintStudio.material" is required in custom mode.`);
	return {
		mode: "custom",
		hdriPresetId: hdriPresetId ?? "hdri-studio",
		material: validatePaintStudioMaterial(candidate.material)
	};
}
/** Full body validation for `POST /api/v1/configurations`. */
function validateCreateConfiguration(body) {
	if (typeof body !== "object" || body === null) throw invalidBody("Request body must be a JSON object.");
	const raw = body;
	const vehicleId = asString(raw.vehicleId, "vehicleId");
	const gradeId = asString(raw.gradeId, "gradeId");
	const modelYear = typeof raw.modelYear === "number" ? raw.modelYear : NaN;
	const { vehicle } = validateVehicleIdentity(vehicleId, modelYear, gradeId);
	const selections = validateSelections(vehicleId, gradeId, raw.selections);
	return {
		vehicleId,
		modelYear,
		model: vehicle.model,
		gradeId,
		selections,
		cameraState: validateCameraState(raw.cameraState),
		paintStudio: validatePaintStudio(raw.paintStudio, selections)
	};
}
/** Partial body validation for `PATCH /api/v1/configurations/:id`. */
function validatePatchConfiguration(body, existing) {
	if (typeof body !== "object" || body === null) throw invalidBody("Request body must be a JSON object.");
	const raw = body;
	const patch = {};
	if ("selections" in raw && raw.selections !== void 0) patch.selections = validateSelections(existing.vehicleId, existing.gradeId, raw.selections);
	if ("cameraState" in raw && raw.cameraState !== void 0) patch.cameraState = validateCameraState(raw.cameraState);
	if ("paintStudio" in raw && raw.paintStudio !== void 0) {
		const effectiveSelections = patch.selections ?? existing.selections ?? {};
		patch.paintStudio = validatePaintStudio(raw.paintStudio, effectiveSelections);
	}
	if (raw.expectedRevision !== void 0) {
		if (!Number.isInteger(raw.expectedRevision)) throw invalidBody(`"expectedRevision" must be an integer when present.`);
		patch.expectedRevision = raw.expectedRevision;
	}
	return patch;
}
/**
* Resolves option ids to the full, trusted records the viewer needs.
*
* This is the boundary the requirement "avoid accepting arbitrary GLB paths, material names, or
* node names from the browser" is enforced at: ids go in, catalog-owned records come out.
*/
function resolveOptions(vehicleId, selections) {
	const catalog = getOptionsForVehicle(vehicleId);
	const byId = new Map(catalog.map((option) => [option.id, option]));
	return CATEGORY_APPLY_ORDER.flatMap((category) => (selections[category] ?? []).map((id) => byId.get(id)).filter((option) => option !== void 0));
}
/** Sum of `priceDelta` across a validated selection map. */
function priceSelections(vehicleId, selections) {
	return resolveOptions(vehicleId, selections).reduce((total, option) => total + (option.priceDelta ?? 0), 0);
}
/**
* Catalog option deltas plus paint-studio extras (HDRI presets).
* `paint-custom` already carries the custom studio fee in its catalog `priceDelta`.
*/
function priceConfiguration(vehicleId, selections, paintStudio) {
	return priceSelections(vehicleId, selections) + (paintStudio ? paintStudioPriceDelta({
		...paintStudio,
		mode: "oem"
	}) : 0);
}
async function enforceConfigWriteRateLimit(request) {
	enforceLimit(`cfg-write:${clientKeyFromRequest(request)}`, LIMITS.configWrite, "Too many configuration writes from this client. Please slow down and retry shortly.");
}
async function readJson$1(request) {
	try {
		return await request.json();
	} catch {
		throw invalidBody("Request body must be valid JSON.");
	}
}
var Route$1 = createFileRoute("/api/v1/configurations/")({ server: { handlers: { POST: async ({ request }) => {
	try {
		await enforceConfigWriteRateLimit(request);
		const input = validateCreateConfiguration(await readJson$1(request));
		const { configuration, ownerToken } = await getConfigurationRepository().create(input);
		return jsonResponse({
			schemaVersion: CUSTOMIZATION_SCHEMA_VERSION,
			data: configuration,
			ownerToken,
			pricing: { optionsTotal: priceConfiguration(configuration.vehicleId, configuration.selections, configuration.paintStudio) }
		}, {
			status: 201,
			headers: {
				Location: `/api/v1/configurations/${configuration.configurationId}`,
				"Cache-Control": "no-store"
			}
		});
	} catch (err) {
		return errorResponse(err);
	}
} } } });
var OWNER_HEADER = "x-owner-token";
async function readJson(request) {
	try {
		return await request.json();
	} catch {
		throw invalidBody("Request body must be valid JSON.");
	}
}
var Route = createFileRoute("/api/v1/configurations/$configurationId")({ server: { handlers: {
	GET: async ({ params }) => {
		try {
			const configuration = await getConfigurationRepository().get(params.configurationId);
			if (!configuration) throw notFound$1(`No configuration found with id "${params.configurationId}".`);
			return jsonResponse({
				schemaVersion: CUSTOMIZATION_SCHEMA_VERSION,
				data: configuration,
				pricing: { optionsTotal: priceConfiguration(configuration.vehicleId, configuration.selections, configuration.paintStudio) }
			}, { headers: { "Cache-Control": "no-store" } });
		} catch (err) {
			return errorResponse(err);
		}
	},
	PATCH: async ({ request, params }) => {
		try {
			await enforceConfigWriteRateLimit(request);
			const token = request.headers.get(OWNER_HEADER);
			if (!token) throw forbidden("Owner token required.");
			const existing = await getConfigurationRepository().get(params.configurationId);
			if (!existing) throw notFound$1(`No configuration found with id "${params.configurationId}".`);
			const patch = validatePatchConfiguration(await readJson(request), {
				vehicleId: existing.vehicleId,
				gradeId: existing.gradeId,
				selections: existing.selections
			});
			const configuration = await getConfigurationRepository().update(params.configurationId, patch, token);
			return jsonResponse({
				schemaVersion: CUSTOMIZATION_SCHEMA_VERSION,
				data: configuration
			}, { headers: { "Cache-Control": "no-store" } });
		} catch (err) {
			return errorResponse(err);
		}
	},
	DELETE: async ({ request, params }) => {
		try {
			await enforceConfigWriteRateLimit(request);
			const token = request.headers.get(OWNER_HEADER);
			if (!token) throw forbidden("Owner token required.");
			if (!await getConfigurationRepository().delete(params.configurationId, token)) throw notFound$1(`No configuration found with id "${params.configurationId}".`);
			return new Response(null, { status: 204 });
		} catch (err) {
			return errorResponse(err);
		}
	}
} } });
var IndexRoute = Route$25.update({
	id: "/",
	path: "/",
	getParentRoute: () => Route$26
});
var AccessibilityRoute = Route$24.update({
	id: "/accessibility",
	path: "/accessibility",
	getParentRoute: () => Route$26
});
var AccountRoute = Route$23.update({
	id: "/account",
	path: "/account",
	getParentRoute: () => Route$26
});
var DealershipRoute = Route$22.update({
	id: "/dealership",
	path: "/dealership",
	getParentRoute: () => Route$26
});
var LoginRoute = Route$21.update({
	id: "/login",
	path: "/login",
	getParentRoute: () => Route$26
});
var PrivacyRoute = Route$20.update({
	id: "/privacy",
	path: "/privacy",
	getParentRoute: () => Route$26
});
var ApiHealthRoute = Route$19.update({
	id: "/api/health",
	path: "/api/health",
	getParentRoute: () => Route$26
});
var LegalDisclosuresRoute = Route$18.update({
	id: "/legal/disclosures",
	path: "/legal/disclosures",
	getParentRoute: () => Route$26
});
var OwnersIndexRoute = Route$17.update({
	id: "/owners/",
	path: "/owners/",
	getParentRoute: () => Route$26
});
var OwnersMaintenanceRoute = Route$16.update({
	id: "/owners/maintenance",
	path: "/owners/maintenance",
	getParentRoute: () => Route$26
});
var OwnersResourcesRoute = Route$15.update({
	id: "/owners/resources",
	path: "/owners/resources",
	getParentRoute: () => Route$26
});
var OwnersSavedRoute = Route$14.update({
	id: "/owners/saved",
	path: "/owners/saved",
	getParentRoute: () => Route$26
});
var OwnersServiceRoute = Route$13.update({
	id: "/owners/service",
	path: "/owners/service",
	getParentRoute: () => Route$26
});
var ShopIndexRoute = Route$12.update({
	id: "/shop/",
	path: "/shop/",
	getParentRoute: () => Route$26
});
var ShopFinanceRoute = Route$11.update({
	id: "/shop/finance",
	path: "/shop/finance",
	getParentRoute: () => Route$26
});
var ShopInventoryRoute = Route$10.update({
	id: "/shop/inventory",
	path: "/shop/inventory",
	getParentRoute: () => Route$26
});
var ShopOffersRoute = Route$9.update({
	id: "/shop/offers",
	path: "/shop/offers",
	getParentRoute: () => Route$26
});
var ShopTestDriveRoute = Route$8.update({
	id: "/shop/test-drive",
	path: "/shop/test-drive",
	getParentRoute: () => Route$26
});
var ShopTradeInRoute = Route$7.update({
	id: "/shop/trade-in",
	path: "/shop/trade-in",
	getParentRoute: () => Route$26
});
var VehiclesIndexRoute = Route$6.update({
	id: "/vehicles/",
	path: "/vehicles/",
	getParentRoute: () => Route$26
});
var VehiclesCompareRoute = Route$5.update({
	id: "/vehicles/compare",
	path: "/vehicles/compare",
	getParentRoute: () => Route$26
});
var ApiAuthSplatRoute = Route$4.update({
	id: "/api/auth/$",
	path: "/api/auth/$",
	getParentRoute: () => Route$26
});
var VehiclesSlugIndexRoute = Route$3.update({
	id: "/vehicles/$slug/",
	path: "/vehicles/$slug/",
	getParentRoute: () => Route$26
});
var VehiclesSlugConfigureRoute = Route$2.update({
	id: "/vehicles/$slug/configure",
	path: "/vehicles/$slug/configure",
	getParentRoute: () => Route$26
});
var ApiV1ConfigurationsIndexRoute = Route$1.update({
	id: "/api/v1/configurations/",
	path: "/api/v1/configurations/",
	getParentRoute: () => Route$26
});
var rootRouteChildren = {
	IndexRoute,
	AccessibilityRoute,
	AccountRoute,
	DealershipRoute,
	LoginRoute,
	PrivacyRoute,
	ApiHealthRoute,
	LegalDisclosuresRoute,
	OwnersMaintenanceRoute,
	OwnersResourcesRoute,
	OwnersSavedRoute,
	OwnersServiceRoute,
	ShopFinanceRoute,
	ShopInventoryRoute,
	ShopOffersRoute,
	ShopTestDriveRoute,
	ShopTradeInRoute,
	VehiclesCompareRoute,
	OwnersIndexRoute,
	ShopIndexRoute,
	VehiclesIndexRoute,
	ApiAuthSplatRoute,
	VehiclesSlugConfigureRoute,
	VehiclesSlugIndexRoute,
	ApiV1ConfigurationsConfigurationIdRoute: Route.update({
		id: "/api/v1/configurations/$configurationId",
		path: "/api/v1/configurations/$configurationId",
		getParentRoute: () => Route$26
	}),
	ApiV1ConfigurationsIndexRoute
};
var routeTree = Route$26._addFileChildren(rootRouteChildren)._addFileTypes();
var router_exports = /* @__PURE__ */ __exportAll({ getRouter: () => getRouter });
function getRouter() {
	return createRouter({
		routeTree,
		defaultErrorComponent: AppErrorComponent,
		defaultNotFoundComponent: NotFoundComponent
	});
}
//#endregion
export { Route$11 as _, validatePatchConfiguration as a, breadcrumbJsonLd as b, generateOwnerToken as c, Route$2 as d, Route$3 as f, Route$10 as g, Route$9 as h, validatePaintStudio as i, hashOwnerToken as l, Route$8 as m, validateCameraState as n, validateSelections as o, Route$5 as p, validateCreateConfiguration as r, validateVehicleIdentity as s, router_exports as t, verifyOwnerToken as u, Route$25 as v, autoDealerJsonLd as y };
