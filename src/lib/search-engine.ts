import { LINEUP, type LineupModel } from "./lineup.ts";
import { getCatalogFacts } from "./catalog-facts.ts";

export interface SearchHit {
  kind: "vehicle" | "destination";
  href: string;
  title: string;
  blurb: string;
  score: number;
  tokens: string[];
}

export const DESTINATIONS: Array<{ href: string; title: string; blurb: string; keywords: string[] }> = [
  { href: "/vehicles", title: "Vehicles", blurb: "Full Toyota lineup", keywords: ["vehicles", "lineup", "catalog", "cars", "suv"] },
  { href: "/quiz", title: "Find My Toyota", blurb: "Lifestyle matcher", keywords: ["quiz", "recommend", "match", "help", "finder"] },
  { href: "/shop/finance", title: "Payment estimator", blurb: "Model monthly payments", keywords: ["finance", "payment", "apr", "loan", "monthly"] },
  { href: "/shop/test-drive", title: "Test drive", blurb: "Request a drive time", keywords: ["test", "drive", "appointment"] },
  { href: "/shop/trade-in", title: "Trade-in", blurb: "Start an appraisal request", keywords: ["trade", "vin", "appraisal"] },
  { href: "/shop/inventory", title: "Inventory", blurb: "Live lot status", keywords: ["inventory", "stock", "vin", "lot"] },
  { href: "/shop/offers", title: "Offers", blurb: "Incentives feed status", keywords: ["offers", "apr", "lease", "rebate"] },
  { href: "/owners/service", title: "Schedule service", blurb: "Service visit request", keywords: ["service", "oil", "repair", "maintenance"] },
  { href: "/owners/saved", title: "Garage", blurb: "Saved vehicles and builds", keywords: ["garage", "saved", "favorites"] },
  { href: "/workspace", title: "Deal workspace", blurb: "Shopping jacket", keywords: ["deal", "workspace", "jacket"] },
  { href: "/dealership", title: "Find a dealer", blurb: "Hours and directions", keywords: ["dealer", "hours", "map", "merriam"] },
  { href: "/vehicles/compare", title: "Compare", blurb: "Side-by-side models", keywords: ["compare"] },
];

function tokens(q: string): string[] {
  return q
    .toLowerCase()
    .split(/[^a-z0-9+]+/)
    .filter((t) => t.length >= 2);
}

function blobFor(model: LineupModel): string {
  const facts = getCatalogFacts(model.slug);
  return [
    model.name,
    model.slug,
    model.tagline,
    model.body,
    model.electrified ?? "",
    ...model.tabs,
    facts.drivetrains.join(" "),
    facts.powertrainTypes.join(" "),
    facts.has3d ? "3d configurator" : "",
    facts.hasCatalog ? "build price trim" : "",
  ]
    .join(" ")
    .toLowerCase();
}

function scoreBlob(blob: string, words: string[]): { score: number; matched: string[] } {
  let score = 0;
  const matched: string[] = [];
  for (const word of words) {
    if (blob.includes(word)) {
      score += blob.startsWith(word) || blob.includes(` ${word}`) ? 6 : 3;
      matched.push(word);
    } else if (word === "awd" && (blob.includes("awd") || blob.includes("4wd"))) {
      score += 6;
      matched.push(word);
    } else if (word === "suv" && (blob.includes("suv") || blob.includes("crossover"))) {
      score += 5;
      matched.push(word);
    }
  }
  if (matched.length === words.length && words.length > 1) score += 8;
  return { score, matched };
}

export function searchShowroom(query: string): { vehicles: SearchHit[]; destinations: SearchHit[] } {
  const words = tokens(query);
  if (!words.length) return { vehicles: [], destinations: [] };

  const vehicles: SearchHit[] = LINEUP.map((model) => {
    const blob = blobFor(model);
    const { score, matched } = scoreBlob(blob, words);
    return {
      kind: "vehicle" as const,
      href: `/vehicles/${model.slug}`,
      title: model.name,
      blurb: model.tagline,
      score,
      tokens: matched,
    };
  })
    .filter((hit) => hit.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 12);

  const destinations: SearchHit[] = DESTINATIONS.map((item) => {
    const blob = `${item.title} ${item.blurb} ${item.keywords.join(" ")}`.toLowerCase();
    const { score, matched } = scoreBlob(blob, words);
    return {
      kind: "destination" as const,
      href: item.href,
      title: item.title,
      blurb: item.blurb,
      score,
      tokens: matched,
    };
  })
    .filter((hit) => hit.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 8);

  return { vehicles, destinations };
}

export function highlightMatch(text: string, query: string): string {
  const words = tokens(query);
  if (!words.length) return text;
  const re = new RegExp(`(${words.map((w) => w.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).join("|")})`, "ig");
  return text.replace(re, "«$1»");
}
