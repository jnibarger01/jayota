import { o as __toESM } from "./_runtime.mjs";
import { H as require_jsx_runtime, U as require_react, y as Link } from "./_libs/@tanstack/react-router+[...].mjs";
import { p as lineupConfigure } from "./_ssr/lineup-m5PRC25T.mjs";
import { n as formatUsd } from "./_ssr/utils-DzenR1kc.mjs";
import { t as CATALOG_DISCLAIMER } from "./_ssr/catalog-0lXXzwn9.mjs";
import { P as ChevronRight } from "./_libs/lucide-react.mjs";
import { b as breadcrumbJsonLd, f as Route$3 } from "./_ssr/router-BebVFJVp.mjs";
import { i as track, n as SiteShell } from "./_ssr/SiteShell-DJTKdcTS.mjs";
import { t as Button } from "./_ssr/button-BHP5c8oP.mjs";
import { t as JsonLd } from "./_ssr/JsonLd-C177FKtR.mjs";
import { t as FavoriteButton } from "./_ssr/FavoriteButton-Cr1X6nIl.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/_slug-BNmssjpB.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function VehicleDetailPage() {
	const data = Route$3.useLoaderData();
	if (data.kind === "lineup") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LineupOnlyPage, { model: data.lineup });
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CatalogVehiclePage, {
		vehicle: data.vehicle,
		lineup: data.lineup
	});
}
function LineupOnlyPage({ model }) {
	(0, import_react.useEffect)(() => {
		track("vehicle_view", {
			slug: model.slug,
			source: "lineup"
		});
	}, [model.slug]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SiteShell, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(JsonLd, { data: breadcrumbJsonLd([
		{
			name: "Home",
			path: "/"
		},
		{
			name: "Vehicles",
			path: "/vehicles"
		},
		{
			name: model.name,
			path: `/vehicles/${model.slug}`
		}
	]) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "mx-auto max-w-7xl px-4 py-8 md:px-6 md:py-12",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "overflow-hidden rounded-2xl bg-surface-2",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
					src: model.image.src,
					alt: model.image.alt,
					className: "max-h-[520px] w-full object-cover"
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-8 text-xs font-medium uppercase tracking-widest text-muted",
				children: "Toyota"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-1 flex flex-wrap items-start justify-between gap-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "text-5xl font-semibold tracking-tight md:text-6xl",
					children: model.name
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FavoriteButton, { slug: model.slug })]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-3 text-lg text-muted",
				children: model.tagline
			}),
			model.startingMsrp ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "mt-4 text-fg",
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
				className: "mt-8 flex flex-wrap gap-3",
				children: [
					lineupConfigure(model).kind !== "none" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/vehicles/$slug/configure",
						params: { slug: model.slug },
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, { children: [
							lineupConfigure(model).label,
							" ",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, { size: 16 })
						] })
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/shop/test-drive",
						search: { vehicle: model.slug },
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, { children: ["Request a test drive ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, { size: 16 })] })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/vehicles/compare",
						search: { vehicles: model.slug },
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "secondary",
							children: "Compare"
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/dealership",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "secondary",
							children: "Find a dealer"
						})
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "price-note mt-8",
				children: "This model is shown as consumer merchandising. Trim lists, horsepower, and live inventory are not in this catalog, and the starting figure is a published Toyota.com MSRP — not a quote from Hendrick Toyota Merriam."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "price-note mt-3",
				children: CATALOG_DISCLAIMER
			})
		]
	})] });
}
function CatalogVehiclePage({ vehicle, lineup }) {
	(0, import_react.useEffect)(() => {
		track("vehicle_view", { slug: vehicle.slug });
	}, [vehicle.slug]);
	const starting = Math.min(vehicle.pricing.baseMsrp, ...vehicle.grades.map((g) => g.msrp));
	const hero = lineup?.image.src ? {
		url: lineup.image.src,
		alt: lineup.image.alt
	} : vehicle.media.hero;
	const gallery = vehicle.media.gallery.filter((asset) => asset.url);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SiteShell, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(JsonLd, { data: breadcrumbJsonLd([
		{
			name: "Home",
			path: "/"
		},
		{
			name: "Vehicles",
			path: "/vehicles"
		},
		{
			name: `${vehicle.year} ${vehicle.model}`,
			path: `/vehicles/${vehicle.slug}`
		}
	]) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "mx-auto max-w-7xl px-4 py-8 md:px-6 md:py-12",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "text-xs font-medium uppercase tracking-widest text-muted",
				children: [
					vehicle.year,
					" · ",
					vehicle.bodyStyle
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-2 flex flex-wrap items-start justify-between gap-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "text-5xl font-semibold tracking-tight md:text-6xl",
					children: vehicle.model
				}), lineup ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-muted",
					children: lineup.tagline
				}) : null] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FavoriteButton, { slug: vehicle.slug })]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-3 text-muted",
				children: lineup?.startingMsrp ? `Toyota.com starting MSRP ${formatUsd(lineup.startingMsrp)}*` : `Catalog starting figure ${formatUsd(starting)}*`
			}),
			lineup?.msrpSource ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-1 text-xs text-muted",
				children: lineup.msrpSource
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-8 overflow-hidden rounded-2xl bg-surface-2",
				children: hero.url ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
					src: hero.url,
					alt: hero.alt,
					className: "max-h-[520px] w-full object-cover"
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex min-h-[280px] items-end bg-gradient-to-br from-surface-3 to-bg p-8",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-6xl font-semibold tracking-tight",
						children: vehicle.model
					})
				})
			}),
			gallery.length > 1 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "mt-3 grid grid-cols-2 gap-3 md:grid-cols-4",
				children: gallery.map((asset) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
					className: "overflow-hidden rounded-xl border border-border bg-surface-2",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
						src: asset.url,
						alt: asset.alt,
						className: "h-28 w-full object-cover"
					})
				}, asset.url))
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-6 flex flex-wrap gap-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/vehicles/$slug/configure",
						params: { slug: vehicle.slug },
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, { children: vehicle.threeDConfig.hasModel ? "Open 3D showroom" : "Build & Price" })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/shop/test-drive",
						search: { vehicle: vehicle.slug },
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "secondary",
							children: "Request a test drive"
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/shop/finance",
						search: { slug: vehicle.slug },
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "secondary",
							children: "Estimate payment"
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/vehicles/compare",
						search: { vehicles: vehicle.slug },
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "ghost",
							children: "Compare"
						})
					})
				]
			}),
			!vehicle.threeDConfig.hasModel ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "price-note mt-3",
				children: "A packaged 3D model is not available for this vehicle. Build & Price still lets you review trims and catalog options; the canvas uses a labeled procedural stand-in."
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-12 grid gap-10 lg:grid-cols-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "text-2xl font-semibold",
					children: "Trims"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "mt-4 divide-y divide-border overflow-hidden rounded-2xl border border-border",
					children: vehicle.grades.map((grade) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
						className: "flex items-center justify-between gap-4 p-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: grade.name }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "text-sm text-muted",
							children: [
								grade.seating,
								"-passenger · ",
								grade.standardFeatures[0]
							]
						})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "text-sm",
							children: [formatUsd(grade.msrp), "*"]
						})]
					}, grade.id))
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "text-2xl font-semibold",
						children: "Colors"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
						className: "mt-4 flex flex-wrap gap-3",
						children: vehicle.exteriorColors.map((color) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
							className: "flex items-center gap-2 text-sm",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "inline-block h-7 w-7 rounded-full border border-border",
								style: { background: color.hex },
								"aria-hidden": "true"
							}), color.name]
						}, color.code))
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "mt-8 text-2xl font-semibold",
						children: "Highlights"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dl", {
						className: "mt-4 grid grid-cols-2 gap-3 text-sm",
						children: vehicle.specs.slice(0, 8).map((spec) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "rounded-xl border border-border bg-surface p-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
								className: "text-xs uppercase tracking-widest text-muted",
								children: spec.label
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dd", {
								className: "mt-1",
								children: [typeof spec.value === "boolean" ? spec.value ? "Yes" : "No" : spec.value, spec.unit ? ` ${spec.unit}` : ""]
							})]
						}, spec.key))
					})
				] })]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "price-note mt-8",
				children: CATALOG_DISCLAIMER
			})
		]
	})] });
}
//#endregion
export { VehicleDetailPage as component };
