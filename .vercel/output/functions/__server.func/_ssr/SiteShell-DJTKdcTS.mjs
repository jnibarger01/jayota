import { o as __toESM } from "../_runtime.mjs";
import { H as require_jsx_runtime, U as require_react, b as Navigate, f as useRouterState, y as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as cn } from "./utils-DzenR1kc.mjs";
import { c as formatHour, d as searchSite, n as DEALER, s as formatAddress } from "./catalog-0lXXzwn9.mjs";
import { a as hasGateSessionMarker } from "./server-6kxKE-qY.mjs";
import { D as Ellipsis, L as Car, b as MapPin, n as X, u as Search, w as House } from "../_libs/lucide-react.mjs";
import { i as signOut, t as authClient } from "./client-CVqXY6bk.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/SiteShell-DJTKdcTS.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
/**
* Current user + loading state. Same behavior in live preview and when deployed:
*   - Auth enabled -> the real signed-in user; `user` is `null` while
*                            the session resolves (`isPending: true`) and when
*                            signed out (`isPending: false`). Session comes from
*                            Better Auth `useSession()` → `/api/auth/get-session`
*                            (cookie when deployed; bearer in live preview).
*   - Auth disabled (`VITE_AUTH_ENABLED=false`) -> `DEV_USER`, never pending.
*
* Protect a route by waiting out `isPending` before acting on `user` —
* redirecting on `user: null` alone bounces signed-in visitors to sign-in on
* every hard reload:
*
*   import { RedirectToSignIn } from "@/lib/auth/gates";
*   const { user, isPending } = useCurrentUserState();
*   if (isPending) return null;              // still resolving — don't redirect yet
*   if (!user) return <RedirectToSignIn />;  // definitely signed out
*
* `authEnabled` is a module-level constant fixed at load, so the guarded hook
* call keeps a stable hook order across every render of a given component.
*/
function useCurrentUserState() {
	const { data, isPending } = authClient.useSession();
	const user = data?.user;
	return {
		user: user ? {
			id: user.id,
			displayName: user.name ?? null,
			primaryEmail: user.email ?? null,
			profileImageUrl: user.image ?? null,
			isDevFallback: false
		} : null,
		isPending
	};
}
/**
* Convenience view of `useCurrentUserState().user` for display (e.g.
* `user?.displayName ?? "Guest"`). NOTE: `null` means *loading OR signed out* —
* for redirects/guards use `useCurrentUserState()` and check `isPending`.
*/
function useCurrentUser() {
	return useCurrentUserState().user;
}
var subscribeToNothing = () => () => {};
var noGateSessionOnServer = () => false;
/**
* Auth state components — plain wrappers around `useCurrentUserState()`.
*
* With auth on, visitors are signed out until they authenticate — in the sandbox
* live preview too, which does real sign-in. The shared dev user appears only
* when auth is disabled (`VITE_AUTH_ENABLED=false`, the shipped default).
* While the session is still resolving, gates that care about signed-out state
* render nothing so there's no signed-out flash on hard reload.
*/
/** Where `RedirectToSignIn` sends signed-out visitors. Create this route. */
var SIGN_IN_PATH = "/login";
/** Render children only when a user is present (real session, or the disabled-auth dev user). */
function SignedIn({ children }) {
	const { user } = useCurrentUserState();
	return user ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children }) : null;
}
/**
* Render children only once we KNOW the visitor is signed out (`isPending` has
* cleared and there is no user). Hidden while the session is still loading.
*/
function SignedOut({ children }) {
	const { user, isPending } = useCurrentUserState();
	if (isPending || user) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children });
}
/**
* Client-side redirect to the sign-in route (TanStack `<Navigate>` — NOT a full
* `window.location` reload). A hard navigation re-bootstraps the SPA and re-runs
* session loading, which feels like a second "Loading…" on /login.
*
* Guard routes by waiting out `isPending` first (see `use-current-user`), then
* render this.
*/
function RedirectToSignIn({ to = SIGN_IN_PATH }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Navigate, { to });
}
/**
* Minimal signed-in identity chip + sign-out. Restyle freely (see the
* `design-ui` skill). Sign-out is only shown when auth is enabled (the
* disabled-auth dev user has nothing to sign out of) and the session is not
* gate-materialized — behind the gate the next request signs the viewer
* straight back in, so a sign-out control there is a broken loop.
*/
function UserButton() {
	const user = useCurrentUser();
	const [signingOut, setSigningOut] = (0, import_react.useState)(false);
	const gateSession = (0, import_react.useSyncExternalStore)(subscribeToNothing, hasGateSessionMarker, noGateSessionOnServer);
	if (!user) return null;
	const label = user.displayName ?? user.primaryEmail ?? "Account";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex items-center gap-2",
		children: [
			user.profileImageUrl ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
				src: user.profileImageUrl,
				alt: "",
				className: "h-8 w-8 rounded-full object-cover"
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "grid h-8 w-8 place-items-center rounded-full bg-black/10 text-sm font-medium dark:bg-white/20",
				children: label.charAt(0).toUpperCase()
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "text-sm font-medium",
				children: label
			}),
			!gateSession && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				disabled: signingOut,
				onClick: () => {
					setSigningOut(true);
					signOut().catch(() => setSigningOut(false));
				},
				className: "cursor-pointer text-sm underline-offset-4 opacity-70 hover:underline disabled:cursor-wait disabled:no-underline",
				children: signingOut ? "Signing out…" : "Sign out"
			})
		]
	});
}
function ToyotaMark({ className = "toyota-mark" }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
		className,
		viewBox: "0 0 72 48",
		"aria-hidden": "true",
		focusable: "false",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ellipse", {
				cx: "36",
				cy: "28",
				rx: "30",
				ry: "16",
				fill: "none",
				stroke: "currentColor",
				strokeWidth: "2.4"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ellipse", {
				cx: "36",
				cy: "24",
				rx: "16",
				ry: "20",
				fill: "none",
				stroke: "currentColor",
				strokeWidth: "2.4"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ellipse", {
				cx: "36",
				cy: "26",
				rx: "8",
				ry: "12",
				fill: "none",
				stroke: "currentColor",
				strokeWidth: "2.4"
			})
		]
	});
}
var KEY = "htm-consent";
function readConsent() {
	if (typeof window === "undefined") return null;
	const value = window.localStorage.getItem(KEY);
	return value === "all" || value === "necessary" ? value : null;
}
function writeConsent(value) {
	window.localStorage.setItem(KEY, value);
	window.dispatchEvent(new CustomEvent("htm-consent", { detail: value }));
}
/** Analytics is opt-in. Unset consent means necessary-only (no tracking). */
function analyticsAllowed() {
	return readConsent() === "all";
}
/**
* Typed analytics facade. The vendor is swappable; nothing in UI imports a pixel SDK.
* Payloads must never include names, emails, phones, VINs entered by the user, or free-text notes.
* Events are dropped until the visitor allows analytics via the consent banner.
*/
var ConsoleAnalyticsProvider = class {
	track(name, payload = {}) {
		if (typeof window === "undefined") return;
		if (!analyticsAllowed()) return;
		const w = window;
		w.dataLayer = w.dataLayer ?? [];
		w.dataLayer.push({
			event: name,
			...payload,
			ts: Date.now()
		});
	}
};
var provider = new ConsoleAnalyticsProvider();
function track(name, payload = {}) {
	try {
		provider.track(name, payload);
	} catch {}
}
function SearchDialog({ open, onOpenChange }) {
	const titleId = (0, import_react.useId)();
	const [query, setQuery] = (0, import_react.useState)("");
	const [busy, setBusy] = (0, import_react.useState)(false);
	const [vehicles, setVehicles] = (0, import_react.useState)([]);
	const [lineup, setLineup] = (0, import_react.useState)([]);
	const [resources, setResources] = (0, import_react.useState)([]);
	(0, import_react.useEffect)(() => {
		if (!open) return;
		const onKey = (event) => {
			if (event.key === "Escape") onOpenChange(false);
		};
		window.addEventListener("keydown", onKey);
		return () => window.removeEventListener("keydown", onKey);
	}, [open, onOpenChange]);
	(0, import_react.useEffect)(() => {
		if (!open) return;
		const handle = window.setTimeout(() => {
			const q = query.trim();
			if (!q) {
				setVehicles([]);
				setLineup([]);
				setResources([]);
				setBusy(false);
				return;
			}
			setBusy(true);
			searchSite({ data: { q } }).then((result) => {
				setVehicles(result.vehicles);
				setLineup(result.lineup);
				setResources(result.resources);
				track("search_performed", {
					qLength: q.length,
					hits: result.vehicles.length + result.lineup.length + result.resources.length
				});
			}).finally(() => setBusy(false));
		}, 220);
		return () => window.clearTimeout(handle);
	}, [query, open]);
	if (!open) return null;
	const empty = !busy && query.trim() && vehicles.length === 0 && lineup.length === 0 && resources.length === 0;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "fixed inset-0 z-50 flex items-start justify-center bg-ink/60 p-4 pt-[12vh]",
		role: "presentation",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			role: "dialog",
			"aria-modal": "true",
			"aria-labelledby": titleId,
			className: "w-full max-w-xl rounded-2xl border border-border bg-surface p-4 shadow-[var(--shadow-elevated)]",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					id: titleId,
					className: "sr-only",
					children: "Search the showroom"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					autoFocus: true,
					value: query,
					onChange: (event) => setQuery(event.target.value),
					placeholder: "Search models, service, finance…",
					className: "h-12 w-full rounded-xl border border-border bg-bg px-3 text-base text-fg placeholder:text-muted",
					"aria-label": "Search"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-4 max-h-80 overflow-auto",
					children: [
						busy ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm text-muted",
							children: "Searching…"
						}) : null,
						empty ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "text-sm text-muted",
							children: [
								"No matches for “",
								query.trim(),
								"”."
							]
						}) : null,
						vehicles.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
							className: "space-y-1",
							children: vehicles.map((vehicle) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
								to: "/vehicles/$slug",
								params: { slug: vehicle.slug },
								className: "flex min-h-11 items-center justify-between rounded-lg px-2 hover:bg-surface-2",
								onClick: () => onOpenChange(false),
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
									vehicle.year,
									" ",
									vehicle.model
								] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-xs uppercase tracking-widest text-muted",
									children: vehicle.bodyStyle
								})]
							}) }, vehicle.slug))
						}) : null,
						lineup.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
							className: "space-y-1",
							children: lineup.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
								to: "/vehicles/$slug",
								params: { slug: item.slug },
								className: "flex min-h-11 items-center justify-between rounded-lg px-2 hover:bg-surface-2",
								onClick: () => onOpenChange(false),
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: item.name }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-xs text-muted",
									children: item.tagline
								})]
							}) }, item.slug))
						}) : null,
						resources.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
							className: "mt-3 space-y-1 border-t border-border pt-3",
							children: resources.map((resource) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
								href: resource.href,
								className: "block min-h-11 rounded-lg px-2 py-2 hover:bg-surface-2",
								onClick: () => onOpenChange(false),
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
									className: "block text-sm",
									children: resource.title
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-xs text-muted",
									children: resource.blurb
								})]
							}) }, resource.href))
						}) : null
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-3 flex justify-end",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						className: "min-h-11 px-3 text-sm text-muted",
						onClick: () => onOpenChange(false),
						children: "Close"
					})
				})
			]
		})
	});
}
var NAV = [
	{
		href: "/",
		label: "Home"
	},
	{
		href: "/vehicles",
		label: "Vehicles"
	},
	{
		href: "/dealership",
		label: "Find a Dealer"
	}
];
var MORE = [
	{
		href: "/shop",
		label: "Shop"
	},
	{
		href: "/owners",
		label: "Owners"
	},
	{
		href: "/owners/saved",
		label: "Garage"
	},
	{
		href: "/shop/test-drive",
		label: "Test drive"
	},
	{
		href: "/owners/service",
		label: "Service"
	},
	{
		href: "/vehicles/compare",
		label: "Compare"
	},
	{
		href: "/shop/offers",
		label: "Offers"
	}
];
function isActive(pathname, href) {
	if (href === "/") return pathname === "/";
	if (href === "/vehicles") {
		if (pathname === "/vehicles/compare" || pathname.startsWith("/vehicles/compare/")) return false;
		return pathname === "/vehicles" || pathname.startsWith("/vehicles/");
	}
	return pathname === href || pathname.startsWith(`${href}/`);
}
function moreIsActive(pathname) {
	if (pathname === "/" || pathname === "/vehicles" || pathname === "/dealership") return false;
	if (pathname.startsWith("/vehicles/") && pathname !== "/vehicles/compare" && !pathname.startsWith("/vehicles/compare/")) return false;
	return true;
}
function BrandLockup() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
		to: "/",
		className: "flex items-center gap-2.5 text-fg",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ToyotaMark, { className: "h-6 w-9 text-fg" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "text-sm font-semibold tracking-brand",
			children: "TOYOTA"
		})]
	});
}
function SearchButton({ onClick }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
		type: "button",
		className: "inline-flex h-11 w-11 items-center justify-center text-fg",
		"aria-label": "Search",
		onClick,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { size: 20 })
	});
}
function SiteHeader() {
	const pathname = useRouterState({ select: (s) => s.location.pathname });
	const [searchOpen, setSearchOpen] = (0, import_react.useState)(false);
	const [moreOpen, setMoreOpen] = (0, import_react.useState)(false);
	const home = pathname === "/";
	const moreActive = moreIsActive(pathname);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
		home ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("header", {
			className: "absolute inset-x-0 top-0 z-40 md:hidden",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex h-[calc(3.5rem+env(safe-area-inset-top))] items-center justify-between px-4 pt-[env(safe-area-inset-top)]",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(BrandLockup, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SearchButton, { onClick: () => setSearchOpen(true) })]
			})
		}) : null,
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("header", {
			className: "sticky top-0 z-40 hidden border-b border-border bg-bg md:block",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mx-auto grid h-16 max-w-7xl grid-cols-[1fr_auto_1fr] items-center px-6",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(BrandLockup, {}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("nav", {
						className: "flex h-full items-center gap-1",
						"aria-label": "Primary",
						children: [NAV.map((item) => {
							const active = isActive(pathname, item.href);
							return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
								to: item.href,
								"aria-current": active ? "page" : void 0,
								className: cn("relative flex h-full items-center px-4 text-sm text-muted hover:text-fg", active && "text-fg"),
								children: [item.label, active ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "absolute inset-x-4 bottom-0 h-0.5 bg-accent",
									"aria-hidden": "true"
								}) : null]
							}, item.href);
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "relative h-full",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								type: "button",
								className: cn("relative flex h-full items-center px-4 text-sm text-muted hover:text-fg", (moreOpen || moreActive) && "text-fg"),
								"aria-expanded": moreOpen,
								"aria-haspopup": "true",
								onClick: () => setMoreOpen((v) => !v),
								children: ["More", moreActive && !moreOpen ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "absolute inset-x-4 bottom-0 h-0.5 bg-accent",
									"aria-hidden": "true"
								}) : null]
							}), moreOpen ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								className: "fixed inset-0 z-10 cursor-default",
								"aria-label": "Close menu",
								onClick: () => setMoreOpen(false)
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "absolute left-1/2 top-full z-20 min-w-48 -translate-x-1/2 overflow-hidden rounded-xl border border-border bg-surface py-2 shadow-[var(--shadow-elevated)]",
								children: [
									MORE.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
										to: item.href,
										className: "flex min-h-11 items-center px-4 text-sm text-fg hover:bg-surface-2",
										onClick: () => setMoreOpen(false),
										children: item.label
									}, item.href)),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SignedOut, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
										to: "/login",
										className: "flex min-h-11 items-center px-4 text-sm text-fg hover:bg-surface-2",
										onClick: () => setMoreOpen(false),
										children: "Sign in"
									}) }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SignedIn, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
										to: "/account",
										className: "flex min-h-11 items-center px-4 text-sm text-fg hover:bg-surface-2",
										onClick: () => setMoreOpen(false),
										children: "Account"
									}) })
								]
							})] }) : null]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "justify-self-end",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SearchButton, { onClick: () => setSearchOpen(true) })
					})
				]
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SearchDialog, {
			open: searchOpen,
			onOpenChange: setSearchOpen
		})
	] });
}
function SiteFooter() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("footer", {
		className: "mt-auto border-t border-border bg-surface",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto grid max-w-7xl gap-10 px-4 py-12 md:grid-cols-4 md:px-6",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ToyotaMark, { className: "h-7 w-11 text-fg" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
							className: "font-display text-lg tracking-[0.16em]",
							children: "TOYOTA"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-4 text-sm text-muted",
						children: DEALER.name
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 text-sm text-muted",
						children: formatAddress()
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
						className: "mt-3 inline-block text-sm text-fg underline-offset-4 hover:underline",
						href: `tel:${DEALER.phone.generalTel}`,
						children: DEALER.phone.general
					})
				] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "text-xs uppercase tracking-[0.18em] text-muted",
					children: "Shop"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
					className: "mt-4 space-y-2 text-sm",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/vehicles",
							children: "Vehicles"
						}) }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/shop/inventory",
							children: "Inventory"
						}) }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/shop/finance",
							children: "Finance"
						}) }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/shop/trade-in",
							children: "Trade-In"
						}) }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/shop/test-drive",
							children: "Test Drive"
						}) }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/shop/offers",
							children: "Offers"
						}) })
					]
				})] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "text-xs uppercase tracking-[0.18em] text-muted",
					children: "Owners"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
					className: "mt-4 space-y-2 text-sm",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/owners/service",
							children: "Schedule Service"
						}) }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/owners/maintenance",
							children: "Maintenance"
						}) }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/owners/resources",
							children: "Owner resources"
						}) }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/owners/saved",
							children: "Saved vehicles"
						}) }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/account",
							children: "Account"
						}) })
					]
				})] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "text-xs uppercase tracking-[0.18em] text-muted",
						children: "Sales hours"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
						className: "mt-4 space-y-1 text-sm text-muted",
						children: DEALER.hours.sales.map((row) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
							className: "flex justify-between gap-4",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: row.day }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: formatHour(row.opens, row.closes) })]
						}, row.day))
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-3 text-xs text-muted",
						children: DEALER.hoursSource
					})
				] })
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "border-t border-border",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mx-auto flex max-w-7xl flex-col gap-3 px-4 py-5 text-xs text-muted md:flex-row md:items-center md:justify-between md:px-6",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [
					"© ",
					(/* @__PURE__ */ new Date()).getFullYear(),
					" ",
					DEALER.name,
					". Toyota and related marks are trademarks of Toyota Motor Corporation."
				] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("nav", {
					className: "flex flex-wrap gap-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/privacy",
							children: "Privacy"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
							href: "/privacy#cookies",
							children: "Cookies"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/accessibility",
							children: "Accessibility"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/legal/disclosures",
							children: "Disclosures"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/dealership",
							children: "Contact"
						})
					]
				})]
			})
		})]
	});
}
var TABS = [
	{
		href: "/",
		label: "Home",
		icon: House,
		match: (p) => p === "/"
	},
	{
		href: "/vehicles",
		label: "Vehicles",
		icon: Car,
		match: (p) => p === "/vehicles" || p.startsWith("/vehicles/")
	},
	{
		href: "/dealership",
		label: "Find a Dealer",
		icon: MapPin,
		match: (p) => p === "/dealership"
	}
];
var MORE_LINKS = [
	{
		href: "/owners/saved",
		label: "Garage"
	},
	{
		href: "/shop",
		label: "Shop"
	},
	{
		href: "/shop/test-drive",
		label: "Test drive"
	},
	{
		href: "/shop/finance",
		label: "Finance"
	},
	{
		href: "/shop/trade-in",
		label: "Trade-in"
	},
	{
		href: "/owners/service",
		label: "Schedule service"
	},
	{
		href: "/owners",
		label: "Owners"
	},
	{
		href: "/vehicles/compare",
		label: "Compare"
	}
];
function MobileTabBar() {
	const pathname = useRouterState({ select: (s) => s.location.pathname });
	const [moreOpen, setMoreOpen] = (0, import_react.useState)(false);
	const [searchOpen, setSearchOpen] = (0, import_react.useState)(false);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
		moreOpen ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "fixed inset-0 z-50 md:hidden",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				className: "absolute inset-0 bg-ink/70",
				"aria-label": "Close menu",
				onClick: () => setMoreOpen(false)
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "absolute inset-x-0 bottom-0 rounded-t-3xl border-t border-border bg-surface px-5 pb-[calc(5.5rem+env(safe-area-inset-bottom))] pt-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "mx-auto mb-4 h-1 w-10 rounded-full bg-border" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mb-3 flex items-center justify-between",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "text-lg font-semibold",
							children: "More"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							className: "grid h-11 w-11 place-items-center",
							"aria-label": "Close",
							onClick: () => setMoreOpen(false),
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { size: 20 })
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("nav", {
						className: "grid gap-1",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								type: "button",
								className: "flex min-h-12 items-center border-b border-border text-left text-base",
								onClick: () => {
									setMoreOpen(false);
									setSearchOpen(true);
								},
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, {
									size: 16,
									className: "mr-3 text-muted"
								}), "Search"]
							}),
							MORE_LINKS.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: item.href,
								className: "flex min-h-12 items-center border-b border-border text-base",
								onClick: () => setMoreOpen(false),
								children: item.label
							}, item.href)),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SignedOut, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/login",
								className: "flex min-h-12 items-center text-base",
								onClick: () => setMoreOpen(false),
								children: "Sign in"
							}) }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SignedIn, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/account",
								className: "flex min-h-12 items-center text-base",
								onClick: () => setMoreOpen(false),
								children: "Account"
							}) })
						]
					})
				]
			})]
		}) : null,
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", {
			className: "fixed inset-x-0 bottom-0 z-40 border-t border-border bg-bg pb-[env(safe-area-inset-bottom)] md:hidden",
			"aria-label": "Primary",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
				className: "grid h-16 grid-cols-4",
				children: [TABS.map((tab) => {
					const active = tab.match(pathname);
					const Icon = tab.icon;
					return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
						to: tab.href,
						"aria-current": active ? "page" : void 0,
						className: cn("flex h-full flex-col items-center justify-center gap-1 text-xs", active ? "text-accent" : "text-muted"),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, {
							size: 22,
							strokeWidth: active ? 1.4 : 1.7,
							fill: active ? "currentColor" : "none"
						}), tab.label]
					}) }, tab.href);
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "button",
					className: cn("flex h-full w-full flex-col items-center justify-center gap-1 text-xs", moreOpen ? "text-accent" : "text-muted"),
					"aria-expanded": moreOpen,
					onClick: () => setMoreOpen(true),
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Ellipsis, {
						size: 22,
						strokeWidth: 2.2
					}), "More"]
				}) })]
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SearchDialog, {
			open: searchOpen,
			onOpenChange: setSearchOpen
		})
	] });
}
function SiteShell({ children }) {
	const home = useRouterState({ select: (s) => s.location.pathname }) === "/";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "site-shell",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
				href: "#main",
				className: "sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:bg-accent focus:px-3 focus:py-2 focus:text-accent-fg",
				children: "Skip to content"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SiteHeader, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				id: "main",
				className: cn(!home && "pb-[calc(4.25rem+env(safe-area-inset-bottom))] md:pb-0"),
				children
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "hidden md:block",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SiteFooter, {})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MobileTabBar, {})
		]
	});
}
//#endregion
export { useCurrentUserState as a, track as i, SiteShell as n, writeConsent as o, UserButton as r, RedirectToSignIn as t };
