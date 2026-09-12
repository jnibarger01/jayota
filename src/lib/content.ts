/**
 * Merchandising / CMS content for surfaces that are not live Toyota feeds.
 * Swap copy here (or later via `content_blocks`) without inventing prices or inventory.
 */
import { publicUrl } from "./public-url.ts";

export const HOMEPAGE = {
  heroSlug: "4runner",
  kicker: "Hendrick Toyota Merriam",
  title: "4Runner",
  lede: "The SUV for every journey.",
  primaryCta: { label: "Start your journey", to: "/vehicles/4runner" as const },
  secondaryCta: { label: "Explore vehicles", to: "/vehicles" as const },
  heroImage: {
    src: publicUrl("/images/modsnation_7416_final_hero_tweaked.png"),
    alt: "2024 Toyota 4Runner TRD Pro, front three-quarter view in a dark studio",
  },
} as const;

export const SHOP_TOOLS = [
  {
    to: "/quiz" as const,
    title: "Find My Toyota",
    body: "A transparent matcher against this showroom’s lineup — not invented specs.",
  },
  {
    to: "/vehicles" as const,
    title: "Build & Price",
    body: "Configure a catalog vehicle in 3D. Prices are project catalog figures, not live quotes.",
  },
  {
    to: "/shop/inventory" as const,
    title: "Inventory",
    body: "Live lot inventory is not connected. We will not invent VINs or stock.",
  },
  {
    to: "/shop/finance" as const,
    title: "Payment estimator",
    body: "Model a monthly payment from numbers you enter. Not an offer of credit.",
  },
  {
    to: "/shop/trade-in" as const,
    title: "Trade-in",
    body: "Request an appraisal. No fabricated trade value is shown.",
  },
  {
    to: "/shop/test-drive" as const,
    title: "Test drive",
    body: "Ask for a time. It is a request until the dealer confirms.",
  },
  {
    to: "/shop/offers" as const,
    title: "Offers",
    body: "Current APR, lease, and rebate programs are not loaded without a live feed.",
  },
] as const;

export const OWNER_TOOLS = [
  {
    to: "/owners/service" as const,
    title: "Schedule service",
    body: "Oil, diagnosis, or recall-related visits. Not booked until the dealer confirms.",
  },
  {
    to: "/owners/maintenance" as const,
    title: "Maintenance",
    body: "Official Toyota owner tools for intervals — we do not invent service pricing.",
  },
  {
    to: "/owners/resources" as const,
    title: "Owner resources",
    body: "Manuals, recalls, and connected services via official sources.",
  },
  {
    to: "/workspace" as const,
    title: "Deal workspace",
    body: "Keep your model, build, trade notes, and test-drive request in one jacket.",
  },
  {
    to: "/owners/saved" as const,
    title: "Garage",
    body: "Favorites, builds, and recently viewed models.",
  },
] as const;
