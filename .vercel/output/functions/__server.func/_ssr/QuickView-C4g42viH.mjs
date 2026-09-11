import { o as __toESM } from "../_runtime.mjs";
import { H as require_jsx_runtime, U as require_react, y as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { a as electrifiedLabel, c as getLineupBySlug, n as LINEUP_TABS, p as lineupConfigure } from "./lineup-m5PRC25T.mjs";
import { n as formatUsd, t as cn } from "./utils-DzenR1kc.mjs";
import { n as X, z as Box } from "../_libs/lucide-react.mjs";
import { t as Button } from "./button-BHP5c8oP.mjs";
import { t as FavoriteButton } from "./FavoriteButton-Cr1X6nIl.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/QuickView-C4g42viH.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var KEY = "showroom-compare";
var EMPTY = [];
var listeners = /* @__PURE__ */ new Set();
var cached = EMPTY;
var hydrated = false;
function parse(raw) {
	try {
		const parsed = raw ? JSON.parse(raw) : [];
		if (!Array.isArray(parsed)) return EMPTY;
		const slugs = parsed.filter((item) => typeof item === "string").slice(0, 4);
		return slugs.length === 0 ? EMPTY : slugs;
	} catch {
		return EMPTY;
	}
}
function hydrate() {
	if (hydrated || typeof window === "undefined") return;
	hydrated = true;
	cached = parse(window.localStorage.getItem(KEY));
}
function write(slugs) {
	cached = slugs.length === 0 ? EMPTY : slugs.slice(0, 4);
	window.localStorage.setItem(KEY, JSON.stringify(cached));
	listeners.forEach((listener) => listener());
}
function getCompareSlugs() {
	hydrate();
	return cached;
}
function toggleCompareSlug(slug) {
	hydrate();
	write(cached.includes(slug) ? cached.filter((item) => item !== slug) : cached.length >= 4 ? cached : [...cached, slug]);
	return cached;
}
function clearCompare() {
	write([]);
}
function subscribeCompare(onStoreChange) {
	listeners.add(onStoreChange);
	return () => listeners.delete(onStoreChange);
}
function useCompareSlugs() {
	return (0, import_react.useSyncExternalStore)(subscribeCompare, getCompareSlugs, () => EMPTY);
}
function CompareTray({ slugs }) {
	if (slugs.length === 0) return null;
	const models = slugs.map((slug) => getLineupBySlug(slug)).filter((item) => Boolean(item));
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "fixed inset-x-0 bottom-[calc(4.25rem+env(safe-area-inset-bottom))] z-30 border-t border-border bg-surface/95 px-4 py-3 backdrop-blur-md md:bottom-0",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto flex max-w-7xl flex-wrap items-center gap-3",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "text-sm",
					children: [
						"Compare ",
						slugs.length,
						" of ",
						4
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "flex flex-wrap gap-2",
					children: models.map((model) => model ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						className: "inline-flex min-h-9 items-center gap-1 rounded-full bg-surface-2 px-3 text-xs",
						onClick: () => toggleCompareSlug(model.slug),
						children: [
							model.name,
							" ",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { size: 12 })
						]
					}) }, model.slug) : null)
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "ml-auto flex gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						className: "min-h-11 px-3 text-sm text-muted",
						onClick: () => clearCompare(),
						children: "Clear"
					}), slugs.length >= 2 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/vehicles/compare",
						search: { vehicles: slugs.join(",") },
						className: "inline-flex min-h-11 items-center rounded-full bg-accent px-5 text-sm text-accent-fg",
						children: "Compare"
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "inline-flex min-h-11 items-center text-sm text-muted",
						children: "Add one more"
					})]
				})
			]
		})
	});
}
function LineupTabs({ value, onChange }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex gap-5 overflow-x-auto border-b border-border [scrollbar-width:none] md:gap-6 [&::-webkit-scrollbar]:hidden",
		role: "tablist",
		"aria-label": "Vehicle categories",
		children: LINEUP_TABS.map((item) => {
			const selected = value === item.id;
			return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
				type: "button",
				role: "tab",
				"aria-selected": selected,
				className: cn("relative min-h-11 shrink-0 pb-3 text-sm", selected ? "text-fg" : "text-muted"),
				onClick: () => onChange(item.id),
				children: [item.label, selected ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "absolute bottom-0 left-0 h-0.5 w-5 bg-accent" }) : null]
			}, item.id);
		})
	});
}
function LineupCard({ model, variant = "overlay", selected, onOpen }) {
	const price = model.startingMsrp ? `${formatUsd(model.startingMsrp)}*` : null;
	const eLabel = electrifiedLabel(model.electrified);
	if (variant === "caption" || variant === "scroll") return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
		type: "button",
		onClick: () => onOpen(model),
		className: cn("group block w-full overflow-hidden rounded-2xl bg-surface text-left", variant === "scroll" && "w-64 shrink-0 snap-start", selected && "ring-2 ring-accent"),
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "relative",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
				src: model.image.src,
				alt: model.image.alt,
				className: "aspect-video w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "absolute left-3 top-3 flex flex-wrap gap-1",
				children: [model.has3d ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: "inline-flex items-center gap-1 rounded-full bg-ink/55 px-2 py-1 text-xs text-fg",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Box, { size: 12 }), " 3D"]
				}) : null, eLabel ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "rounded-full bg-ink/55 px-2 py-1 text-xs text-fg",
					children: eLabel
				}) : null]
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "px-4 py-3",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
					className: "text-lg font-semibold tracking-tight",
					children: model.name
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-0.5 text-sm text-muted",
					children: model.tagline
				}),
				price ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-sm text-fg",
					children: price
				}) : null
			]
		})]
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
		type: "button",
		onClick: () => onOpen(model),
		className: cn("group relative block h-28 w-full overflow-hidden rounded-2xl bg-surface-2 text-left", selected && "ring-2 ring-accent"),
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
				src: model.image.src,
				alt: model.image.alt,
				className: "absolute inset-0 h-full w-full object-cover object-[70%_center] transition-transform duration-500 group-hover:scale-[1.03]"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute inset-0 bg-gradient-to-r from-ink/80 via-ink/35 to-transparent" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "absolute inset-0 flex items-center justify-between gap-3 px-5",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "max-w-[58%]",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
						className: "text-xl font-semibold tracking-tight text-fg",
						children: model.name
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-0.5 text-sm leading-snug text-fg/75",
						children: model.tagline
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-col items-end gap-1 text-right",
					children: [model.has3d ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "inline-flex items-center gap-1 rounded-full bg-ink/40 px-2 py-1 text-xs text-fg",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Box, { size: 12 }), " 3D"]
					}) : null, price ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-xs text-fg/80",
						children: price
					}) : null]
				})]
			})
		]
	});
}
function QuickView({ model, comparing, compareCount, onClose }) {
	const configure = lineupConfigure(model);
	const eLabel = electrifiedLabel(model.electrified);
	const compareFull = !comparing && compareCount >= 4;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "fixed inset-0 z-50",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
			type: "button",
			className: "absolute inset-0 bg-ink/70",
			"aria-label": "Close",
			onClick: onClose
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			role: "dialog",
			"aria-modal": "true",
			"aria-labelledby": "quickview-title",
			className: "absolute inset-x-0 bottom-0 max-h-[90svh] overflow-auto rounded-t-3xl border-t border-border bg-surface px-5 pb-[calc(1.5rem+env(safe-area-inset-bottom))] pt-4 md:inset-auto md:left-1/2 md:top-1/2 md:w-full md:max-w-lg md:-translate-x-1/2 md:-translate-y-1/2 md:rounded-3xl md:border md:pb-6",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "mx-auto mb-4 h-1 w-10 rounded-full bg-border md:hidden" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mb-3 flex items-start justify-between gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "text-xs font-medium uppercase tracking-widest text-muted",
						children: [
							model.year,
							" · ",
							model.body
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						id: "quickview-title",
						className: "mt-1 text-2xl font-semibold tracking-tight",
						children: model.name
					})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FavoriteButton, { slug: model.slug }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							className: "grid h-11 w-11 place-items-center",
							"aria-label": "Close",
							onClick: onClose,
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { size: 20 })
						})]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
					src: model.image.src,
					alt: model.image.alt,
					className: "aspect-video w-full rounded-2xl object-cover"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-4 text-muted",
					children: model.tagline
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-3 flex flex-wrap gap-2",
					children: [
						eLabel ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "rounded-full bg-surface-2 px-3 py-1 text-xs",
							children: eLabel
						}) : null,
						model.has3d ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "inline-flex items-center gap-1 rounded-full bg-surface-2 px-3 py-1 text-xs",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Box, { size: 12 }), " 3D showroom"]
						}) : null,
						model.hasCatalog && !model.has3d ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "rounded-full bg-surface-2 px-3 py-1 text-xs",
							children: "Build & Price"
						}) : null
					]
				}),
				model.startingMsrp ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "mt-4",
					children: [
						"Starting at ",
						formatUsd(model.startingMsrp),
						"*",
						model.msrpSource ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "mt-1 block text-xs text-muted",
							children: model.msrpSource
						}) : null
					]
				}) : null,
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-6 grid gap-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/vehicles/$slug",
							params: { slug: model.slug },
							onClick: onClose,
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								className: "w-full",
								children: "View details"
							})
						}),
						configure.kind !== "none" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/vehicles/$slug/configure",
							params: { slug: model.slug },
							onClick: onClose,
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								variant: "secondary",
								className: "w-full",
								children: configure.label
							})
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/shop/test-drive",
							search: { vehicle: model.slug },
							onClick: onClose,
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								variant: "secondary",
								className: "w-full",
								children: "Request a test drive"
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							className: "inline-flex min-h-11 items-center justify-center rounded-md border border-border text-sm disabled:opacity-40",
							disabled: compareFull,
							onClick: () => toggleCompareSlug(model.slug),
							children: comparing ? "Remove from compare" : compareFull ? "Compare list is full" : "Add to compare"
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "price-note mt-4",
					children: "Starting figures are published Toyota.com MSRP, not live inventory or a dealer quote."
				})
			]
		})]
	});
}
//#endregion
export { useCompareSlugs as a, QuickView as i, LineupCard as n, LineupTabs as r, CompareTray as t };
