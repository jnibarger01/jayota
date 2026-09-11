import { o as __toESM } from "../_runtime.mjs";
import { H as require_jsx_runtime, U as require_react, y as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { o as featuredLineup, p as lineupConfigure, s as filterLineup } from "./lineup-m5PRC25T.mjs";
import { t as cn } from "./utils-DzenR1kc.mjs";
import { i as INVENTORY_UNAVAILABLE, n as DEALER } from "./catalog-0lXXzwn9.mjs";
import { F as ChevronLeft, P as ChevronRight } from "../_libs/lucide-react.mjs";
import { v as Route$25, y as autoDealerJsonLd } from "./router-BebVFJVp.mjs";
import { n as SiteShell } from "./SiteShell-DJTKdcTS.mjs";
import { t as JsonLd } from "./JsonLd-C177FKtR.mjs";
import { a as useCompareSlugs, i as QuickView, n as LineupCard, r as LineupTabs, t as CompareTray } from "./QuickView-C4g42viH.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-DA-MIChL.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function HeroCarousel({ onQuickView }) {
	const slides = featuredLineup();
	const [index, setIndex] = (0, import_react.useState)(0);
	const [paused, setPaused] = (0, import_react.useState)(false);
	const startX = (0, import_react.useRef)(null);
	const current = slides[index] ?? slides[0];
	(0, import_react.useEffect)(() => {
		if (paused || slides.length < 2) return;
		if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
		const id = window.setInterval(() => {
			setIndex((value) => (value + 1) % slides.length);
		}, 7e3);
		return () => window.clearInterval(id);
	}, [paused, slides.length]);
	if (!current) return null;
	const hero = current.hero ?? current.image;
	const configure = lineupConfigure(current);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "relative min-h-[100svh] overflow-hidden md:min-h-[min(32rem,calc(100svh-4rem))]",
		onMouseEnter: () => setPaused(true),
		onMouseLeave: () => setPaused(false),
		onFocusCapture: () => setPaused(true),
		onTouchStart: (event) => {
			startX.current = event.changedTouches[0]?.clientX ?? null;
		},
		onTouchEnd: (event) => {
			if (startX.current == null) return;
			const dx = (event.changedTouches[0]?.clientX ?? startX.current) - startX.current;
			if (dx > 40) setIndex((value) => (value - 1 + slides.length) % slides.length);
			if (dx < -40) setIndex((value) => (value + 1) % slides.length);
			startX.current = null;
		},
		children: [
			hero.mobileSrc ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
				src: hero.mobileSrc,
				alt: hero.alt,
				className: "absolute inset-0 h-full w-full object-cover object-center md:hidden"
			}, `${current.slug}-m`) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
				src: hero.src,
				alt: hero.alt,
				className: "absolute inset-0 h-full w-full object-cover object-center md:hidden"
			}, `${current.slug}-m`),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
				src: hero.src,
				alt: "",
				className: "absolute inset-0 hidden h-full w-full object-cover object-[70%_center] md:block"
			}, `${current.slug}-d`),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute inset-0 bg-gradient-to-b from-ink/55 via-transparent to-ink/80 md:bg-gradient-to-r md:from-ink/75 md:via-ink/30 md:to-transparent" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "relative mx-auto flex min-h-[100svh] max-w-7xl flex-col px-5 pb-[calc(5.5rem+env(safe-area-inset-bottom))] pt-[calc(4.25rem+env(safe-area-inset-top))] md:min-h-[min(32rem,calc(100svh-4rem))] md:justify-center md:px-6 md:pb-16 md:pt-12",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "max-w-xl",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h1", {
							className: "text-balance text-4xl font-light leading-tight tracking-tight text-fg md:text-6xl",
							children: [
								"Move a",
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("br", {}),
								"Better Tomorrow"
							]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-3 max-w-sm text-pretty text-base leading-relaxed text-fg/75",
							children: "Discover a smarter, cleaner way to move forward."
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-auto max-w-xl md:mt-10",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "text-xs font-medium uppercase tracking-widest text-fg/70",
								children: [current.year, " Toyota"]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-1 text-5xl font-semibold tracking-tight text-fg md:text-6xl",
								children: current.name
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-2 text-sm text-fg/75",
								children: current.tagline
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-7 flex flex-wrap gap-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									type: "button",
									className: "inline-flex min-h-12 items-center gap-2 rounded-full bg-pill px-6 text-sm font-medium text-pill-fg hover:opacity-90",
									onClick: () => onQuickView(current),
									children: [
										"Explore ",
										current.name,
										" ",
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, { size: 16 })
									]
								}), configure.kind !== "none" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
									to: "/vehicles/$slug/configure",
									params: { slug: current.slug },
									className: "inline-flex min-h-12 items-center gap-2 rounded-full border border-fg/35 px-6 text-sm font-medium text-fg hover:bg-fg/10",
									children: configure.label
								}) : null]
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-8 flex items-center justify-between gap-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "flex gap-1.5",
							role: "tablist",
							"aria-label": "Featured vehicles",
							children: slides.map((slide, slideIndex) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								role: "tab",
								"aria-selected": slideIndex === index,
								"aria-label": slide.name,
								className: cn("h-1 rounded-full transition-all duration-200", slideIndex === index ? "w-6 bg-fg" : "w-1.5 bg-fg/35"),
								onClick: () => setIndex(slideIndex)
							}, slide.slug))
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "hidden gap-2 md:flex",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								className: "grid h-11 w-11 place-items-center rounded-full border border-fg/25 text-fg",
								"aria-label": "Previous vehicle",
								onClick: () => setIndex((value) => (value - 1 + slides.length) % slides.length),
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronLeft, { size: 18 })
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								className: "grid h-11 w-11 place-items-center rounded-full border border-fg/25 text-fg",
								"aria-label": "Next vehicle",
								onClick: () => setIndex((value) => (value + 1) % slides.length),
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, { size: 18 })
							})]
						})]
					})
				]
			})
		]
	});
}
function InventoryStrip({ status, provider, count }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
		className: "border-t border-border bg-surface px-5 py-10 pb-[calc(7rem+env(safe-area-inset-bottom))] md:px-6 md:pb-16",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto max-w-7xl",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "text-2xl font-semibold tracking-tight",
					children: "Inventory & pricing"
				}),
				status === "unavailable" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-3 max-w-3xl text-sm leading-relaxed text-muted",
					children: INVENTORY_UNAVAILABLE
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "mt-2 text-xs text-muted",
					children: [
						"Provider: ",
						provider,
						". ",
						count,
						" vehicles returned."
					]
				})] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "mt-3 text-sm text-muted",
					children: [
						"Live inventory is connected (",
						count,
						" vehicles). Confirm stock, VIN, and selling price with the dealership before traveling."
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-3 max-w-3xl text-sm text-muted",
					children: "Starting MSRP on this page is a published Toyota.com catalog figure — not a Hendrick advertised price, not an APR, and not a promise the vehicle is on the lot."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-6 flex flex-wrap gap-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
							href: DEALER.website,
							target: "_blank",
							rel: "noreferrer",
							className: "inline-flex min-h-11 items-center rounded-full bg-pill px-5 text-sm font-medium text-pill-fg",
							children: "Check the dealer site"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
							href: `tel:${DEALER.phone.generalTel}`,
							className: "inline-flex min-h-11 items-center rounded-full border border-border px-5 text-sm",
							children: ["Call ", DEALER.phone.general]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/shop/inventory",
							className: "inline-flex min-h-11 items-center px-3 text-sm text-muted",
							children: "Inventory status"
						})
					]
				})
			]
		})
	});
}
function ModelScroller({ models, selected, onOpen }) {
	if (models.length === 0) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
		className: "mt-10 text-sm text-muted",
		children: "No vehicles in this category yet."
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "mt-6 flex gap-4 overflow-x-auto pb-2 snap-x snap-mandatory [scrollbar-width:thin]",
		role: "list",
		"aria-label": "Vehicle lineup",
		children: models.map((model) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			role: "listitem",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LineupCard, {
				model,
				variant: "scroll",
				selected: selected.includes(model.slug),
				onOpen
			})
		}, model.slug))
	});
}
function Home() {
	const inventory = Route$25.useLoaderData();
	const [tab, setTab] = (0, import_react.useState)("all");
	const [quick, setQuick] = (0, import_react.useState)(null);
	const compare = useCompareSlugs();
	const models = filterLineup(tab);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SiteShell, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(JsonLd, { data: autoDealerJsonLd() }),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(HeroCarousel, { onQuickView: setQuick }),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
			className: "bg-bg px-5 py-12 md:px-6 md:py-16",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mx-auto max-w-7xl",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "text-4xl font-semibold tracking-tight",
						children: "Vehicles"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-2 text-muted",
						children: "Find the Toyota that fits your life."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-8",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LineupTabs, {
							value: tab,
							onChange: setTab
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ModelScroller, {
						models,
						selected: compare,
						onOpen: setQuick
					})
				]
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(InventoryStrip, {
			status: inventory.status,
			provider: inventory.provider,
			count: inventory.vehicles.length
		}),
		quick ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(QuickView, {
			model: quick,
			comparing: compare.includes(quick.slug),
			compareCount: compare.length,
			onClose: () => setQuick(null)
		}) : null,
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CompareTray, { slugs: compare })
	] });
}
//#endregion
export { Home as component };
