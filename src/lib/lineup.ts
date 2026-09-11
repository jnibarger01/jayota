/**
 * Consumer US lineup for the showroom.
 * Taglines are original merchandising copy — not licensed Toyota slogans.
 * Starting MSRP is a published Toyota.com catalog figure, never a live dealer quote.
 * Hybrid/electric flags follow how Toyota.com lists the nameplate (available or standard).
 * Do not invent trims, horsepower, VINs, or lot counts here.
 */

export type LineupTab = "all" | "suv" | "car" | "truck" | "minivan" | "hybrid" | "electric";
export type LineupBody = "car" | "suv" | "truck" | "minivan";
export type Electrified = "hybrid" | "phev" | "bev" | "fcev" | null;

export interface LineupImage {
  src: string;
  alt: string;
  mobileSrc?: string;
}

export interface LineupModel {
  slug: string;
  name: string;
  year: number;
  tagline: string;
  body: LineupBody;
  electrified: Electrified;
  tabs: LineupTab[];
  image: LineupImage;
  hero?: LineupImage;
  /** Full Vehicle record exists (trims/options in this project). */
  hasCatalog: boolean;
  /** Packaged GLB is available in the 3D configurator. */
  has3d: boolean;
  startingMsrp?: number;
  msrpSource?: string;
  /** Lower number appears earlier in the homepage hero. */
  featuredRank?: number;
}

const TOYOTA_COM =
  "Toyota.com all-vehicles starting MSRP, observed 2026-09-11. Not a Hendrick Toyota Merriam quote.";
const CAMRY_SRC =
  "Toyota.com cars-under-40000 2026 Camry base MSRP, observed 2026-09-11. Not a Hendrick quote.";

function tabs(body: LineupBody, electrified: Electrified): LineupTab[] {
  const next: LineupTab[] = [body];
  if (electrified === "hybrid" || electrified === "phev") next.push("hybrid");
  if (electrified === "bev" || electrified === "fcev" || electrified === "phev") next.push("electric");
  return next;
}

function model(
  partial: Omit<LineupModel, "tabs" | "hasCatalog" | "has3d"> & {
    tabs?: LineupTab[];
    hasCatalog?: boolean;
    has3d?: boolean;
  },
): LineupModel {
  return {
    hasCatalog: false,
    has3d: false,
    ...partial,
    tabs: partial.tabs ?? tabs(partial.body, partial.electrified),
    msrpSource: partial.startingMsrp ? (partial.msrpSource ?? TOYOTA_COM) : partial.msrpSource,
  };
}

export const LINEUP: readonly LineupModel[] = [
  model({
    slug: "corolla",
    name: "Corolla",
    year: 2026,
    tagline: "A smarter tomorrow, today.",
    body: "car",
    electrified: "hybrid",
    image: { src: "/images/campaign/corolla.jpg", alt: "White Toyota Corolla on a mountain highway at dusk" },
    startingMsrp: 23125,
  }),
  model({
    slug: "corolla-hatchback",
    name: "Corolla Hatchback",
    year: 2026,
    tagline: "City-ready. Still a Corolla.",
    body: "car",
    electrified: null,
    image: {
      src: "/images/campaign/corolla-hatchback.jpg",
      alt: "White Toyota Corolla Hatchback on a mountain highway at dusk",
    },
    startingMsrp: 24580,
  }),
  model({
    slug: "camry",
    name: "Camry",
    year: 2026,
    tagline: "Confidence in every drive.",
    body: "car",
    electrified: "hybrid",
    image: { src: "/images/campaign/camry.jpg", alt: "Silver Toyota Camry on a mountain highway at dusk" },
    hasCatalog: true,
    has3d: false,
    startingMsrp: 29600,
    msrpSource: CAMRY_SRC,
    featuredRank: 2,
  }),
  model({
    slug: "prius",
    name: "Prius",
    year: 2026,
    tagline: "Efficiency, sharpened.",
    body: "car",
    electrified: "hybrid",
    image: { src: "/images/campaign/prius.jpg", alt: "White Toyota Prius on a mountain highway at dusk" },
    startingMsrp: 28550,
  }),
  model({
    slug: "crown",
    name: "Crown",
    year: 2026,
    tagline: "Quietly elevated.",
    body: "car",
    electrified: "hybrid",
    image: { src: "/images/campaign/crown.jpg", alt: "Silver Toyota Crown on a mountain highway at dusk" },
    startingMsrp: 41440,
  }),
  model({
    slug: "gr86",
    name: "GR86",
    year: 2026,
    tagline: "Built to be driven.",
    body: "car",
    electrified: null,
    image: { src: "/images/campaign/gr86.jpg", alt: "Red Toyota GR86 on a mountain highway at dusk" },
    startingMsrp: 31400,
  }),
  model({
    slug: "gr-corolla",
    name: "GR Corolla",
    year: 2026,
    tagline: "Rally DNA. Daily usable.",
    body: "car",
    electrified: null,
    image: { src: "/images/campaign/gr-corolla.jpg", alt: "White Toyota GR Corolla on a mountain highway at dusk" },
    startingMsrp: 40520,
  }),
  model({
    slug: "gr-supra",
    name: "GR Supra",
    year: 2026,
    tagline: "Pure GR.",
    body: "car",
    electrified: null,
    image: { src: "/images/campaign/gr-supra.jpg", alt: "Red Toyota GR Supra on a mountain highway at dusk" },
    startingMsrp: 58300,
  }),
  model({
    slug: "mirai",
    name: "Mirai",
    year: 2026,
    tagline: "Hydrogen, made quiet.",
    body: "car",
    electrified: "fcev",
    image: { src: "/images/campaign/mirai.jpg", alt: "White Toyota Mirai on a mountain highway at dusk" },
    startingMsrp: 51795,
  }),
  model({
    slug: "corolla-cross",
    name: "Corolla Cross",
    year: 2026,
    tagline: "Corolla sense. Crossover space.",
    body: "suv",
    electrified: "hybrid",
    image: {
      src: "/images/campaign/corolla-cross.jpg",
      alt: "Silver Toyota Corolla Cross on a mountain highway at dusk",
    },
    startingMsrp: 25335,
  }),
  model({
    slug: "rav4",
    name: "RAV4",
    year: 2026,
    tagline: "Adventure meets innovation.",
    body: "suv",
    electrified: "hybrid",
    image: { src: "/images/campaign/rav4.jpg", alt: "Silver Toyota RAV4 on a mountain highway at dusk" },
    hero: {
      src: "/images/campaign/rav4-hero.jpg",
      mobileSrc: "/images/campaign/rav4-hero-mobile.jpg",
      alt: "Silver Toyota RAV4 under a modern overhang with mountains at dusk",
    },
    hasCatalog: true,
    has3d: true,
    startingMsrp: 31900,
    featuredRank: 1,
  }),
  model({
    slug: "c-hr",
    name: "C-HR",
    year: 2026,
    tagline: "Compact. All electric.",
    body: "suv",
    electrified: "bev",
    image: { src: "/images/campaign/c-hr.jpg", alt: "Silver Toyota C-HR on a mountain highway at dusk" },
    startingMsrp: 37000,
  }),
  model({
    slug: "crown-signia",
    name: "Crown Signia",
    year: 2026,
    tagline: "Wagon grace. SUV stance.",
    body: "suv",
    electrified: "hybrid",
    image: { src: "/images/campaign/crown-signia.jpg", alt: "White Toyota Crown Signia on a mountain highway at dusk" },
    startingMsrp: 44690,
  }),
  model({
    slug: "highlander",
    name: "Highlander",
    year: 2026,
    tagline: "Three rows. Family first.",
    body: "suv",
    electrified: "hybrid",
    image: { src: "/images/campaign/highlander.jpg", alt: "Silver Toyota Highlander on a mountain highway at dusk" },
    startingMsrp: 46270,
  }),
  model({
    slug: "grand-highlander",
    name: "Grand Highlander",
    year: 2026,
    tagline: "Room for the whole crew.",
    body: "suv",
    electrified: "hybrid",
    image: {
      src: "/images/campaign/grand-highlander.jpg",
      alt: "Silver Toyota Grand Highlander on a mountain highway at dusk",
    },
    startingMsrp: 42260,
  }),
  model({
    slug: "4runner",
    name: "4Runner",
    year: 2026,
    tagline: "Go further off the map.",
    body: "suv",
    electrified: "hybrid",
    image: { src: "/images/campaign/4runner.jpg", alt: "Silver Toyota 4Runner on a mountain highway at dusk" },
    hero: {
      src: "/images/campaign/4runner-hero.jpg",
      alt: "Silver Toyota 4Runner under a modern overhang with mountains at dusk",
    },
    hasCatalog: true,
    has3d: true,
    startingMsrp: 42270,
    featuredRank: 4,
  }),
  model({
    slug: "land-cruiser",
    name: "Land Cruiser",
    year: 2027,
    tagline: "The icon, rewritten.",
    body: "suv",
    electrified: null,
    image: { src: "/images/campaign/land-cruiser.jpg", alt: "Khaki Toyota Land Cruiser on a mountain highway at dusk" },
    startingMsrp: 58080,
  }),
  model({
    slug: "sequoia",
    name: "Sequoia",
    year: 2026,
    tagline: "Full-size capability.",
    body: "suv",
    electrified: "hybrid",
    image: { src: "/images/campaign/sequoia.jpg", alt: "Dark gray Toyota Sequoia on a mountain highway at dusk" },
    startingMsrp: 65725,
  }),
  model({
    slug: "bz",
    name: "bZ",
    year: 2026,
    tagline: "All electric. A brighter tomorrow.",
    body: "suv",
    electrified: "bev",
    image: { src: "/images/campaign/bz.jpg", alt: "Silver Toyota bZ electric SUV on a mountain highway at dusk" },
    startingMsrp: 34900,
    featuredRank: 5,
  }),
  model({
    slug: "bz-woodland",
    name: "bZ Woodland",
    year: 2026,
    tagline: "Electric, with dirt under the fenders.",
    body: "suv",
    electrified: "bev",
    image: {
      src: "/images/campaign/bz-woodland.jpg",
      alt: "Matte gray Toyota bZ Woodland on a mountain highway at dusk",
    },
    startingMsrp: 45300,
  }),
  model({
    slug: "tacoma",
    name: "Tacoma",
    year: 2026,
    tagline: "Built for what's next.",
    body: "truck",
    electrified: "hybrid",
    image: { src: "/images/campaign/tacoma.jpg", alt: "Silver Toyota Tacoma on a mountain highway at dusk" },
    hasCatalog: true,
    has3d: false,
    startingMsrp: 32545,
    featuredRank: 3,
  }),
  model({
    slug: "tundra",
    name: "Tundra",
    year: 2026,
    tagline: "Full-size, full workday.",
    body: "truck",
    electrified: "hybrid",
    image: { src: "/images/campaign/tundra.jpg", alt: "Silver Toyota Tundra on a mountain highway at dusk" },
    startingMsrp: 41260,
  }),
  model({
    slug: "sienna",
    name: "Sienna",
    year: 2026,
    tagline: "Family miles, hybrid quiet.",
    body: "minivan",
    electrified: "hybrid",
    image: { src: "/images/campaign/sienna.jpg", alt: "White Toyota Sienna on a mountain highway at dusk" },
    startingMsrp: 41320,
  }),
];

const SLUG_ALIASES: Record<string, string> = {
  bz4x: "bz",
  "bz4x-woodland": "bz-woodland",
};

export const LINEUP_TABS: ReadonlyArray<{ id: LineupTab; label: string }> = [
  { id: "all", label: "All" },
  { id: "suv", label: "SUV" },
  { id: "car", label: "Car" },
  { id: "truck", label: "Truck" },
  { id: "minivan", label: "Minivan" },
  { id: "hybrid", label: "Hybrid" },
  { id: "electric", label: "Electric" },
];

export function getLineupBySlug(slug: string): LineupModel | undefined {
  const canonical = SLUG_ALIASES[slug] ?? slug;
  return LINEUP.find((item) => item.slug === canonical);
}

export function filterLineup(tab: LineupTab): LineupModel[] {
  if (tab === "all") return [...LINEUP];
  return LINEUP.filter((item) => item.tabs.includes(tab));
}

export function featuredLineup(): LineupModel[] {
  return LINEUP.filter((item) => item.featuredRank != null).sort(
    (a, b) => (a.featuredRank ?? 99) - (b.featuredRank ?? 99),
  );
}

export function lineupConfigure(model: LineupModel): {
  kind: "3d" | "build" | "none";
  label: string;
} {
  if (model.has3d) return { kind: "3d", label: "Open 3D showroom" };
  if (model.hasCatalog) return { kind: "build", label: "Build & Price" };
  return { kind: "none", label: "View details" };
}

export function electrifiedLabel(value: Electrified): string | null {
  if (value === "hybrid") return "Hybrid";
  if (value === "phev") return "Plug-in hybrid";
  if (value === "bev") return "Electric";
  if (value === "fcev") return "Hydrogen";
  return null;
}
