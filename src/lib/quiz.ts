import { LINEUP, type LineupModel } from "./lineup.ts";
import { getCatalogFacts } from "./catalog-facts.ts";
import { breakdown, modeledIllustration } from "./finance-lab.ts";

export interface QuizAnswers {
  budget: number;
  monthly: number | null;
  passengers: "1-2" | "3-5" | "6+";
  cargo: "light" | "medium" | "heavy";
  commute: "short" | "medium" | "long";
  fuel: "any" | "gas" | "hybrid" | "electric";
  awd: "any" | "yes" | "no";
  towing: "none" | "light" | "heavy";
  offroad: "none" | "some" | "serious";
  performance: boolean;
  tech: "nice" | "important";
}

export interface QuizFactor {
  label: string;
  score: number;
  why: string;
}

export interface QuizMatch {
  model: LineupModel;
  total: number;
  factors: QuizFactor[];
}

const OFFROAD = new Set(["4runner", "land-cruiser", "tacoma", "tundra", "rav4", "bz-woodland", "sequoia"]);
const PERFORMANCE = new Set(["gr86", "gr-corolla", "gr-supra"]);

function add(factors: QuizFactor[], label: string, score: number, why: string) {
  factors.push({ label, score, why });
}

export function scoreModel(model: LineupModel, answers: QuizAnswers): QuizMatch {
  const facts = getCatalogFacts(model.slug);
  const factors: QuizFactor[] = [];
  const msrp = facts.startingMsrp;

  if (msrp != null) {
    if (msrp <= answers.budget) add(factors, "Budget", 12, `Starting MSRP ${msrp} is within the budget you entered.`);
    else if (msrp <= answers.budget * 1.1) add(factors, "Budget", 4, `Starting MSRP is slightly over your budget — still listed because catalog figures are not dealer quotes.`);
    else add(factors, "Budget", -8, `Starting MSRP is above the budget you entered.`);
  } else {
    add(factors, "Budget", 0, "No published starting MSRP in this showroom for this nameplate.");
  }

  if (answers.monthly != null && msrp != null) {
    const modeled = breakdown(modeledIllustration(msrp)).monthly;
    if (modeled <= answers.monthly) {
      add(factors, "Monthly", 8, `Modeled ${Math.round(modeled)}/mo is within your monthly target. Illustration only — not a dealer offer.`);
    } else {
      add(factors, "Monthly", -4, `Modeled payment is above the monthly target you entered. Still an estimate, not an APR quote.`);
    }
  }

  if (answers.passengers === "6+") {
    if (model.body === "minivan" || model.slug.includes("highlander") || model.slug === "sequoia" || model.slug === "sienna") {
      add(factors, "Passengers", 10, "Body style is typically used for larger families in this catalog.");
    } else if (facts.seating != null && facts.seating >= 6) {
      add(factors, "Passengers", 12, `Catalog seating: ${facts.seating}.`);
    } else if (facts.seating != null) {
      add(factors, "Passengers", -4, `Catalog seating is ${facts.seating}.`);
    } else {
      add(factors, "Passengers", model.body === "suv" ? 3 : -2, "Passenger capacity is not in this catalog for this nameplate.");
    }
  } else if (answers.passengers === "1-2") {
    add(factors, "Passengers", model.body === "car" ? 6 : 2, "Smaller households often start with cars; this is a body-style hint, not a capacity claim.");
  } else {
    add(factors, "Passengers", 4, "Most Toyota nameplates in this lineup seat a typical household.");
  }

  if (answers.cargo === "heavy") {
    add(factors, "Cargo", model.body === "truck" || model.body === "minivan" ? 8 : model.body === "suv" ? 5 : 0, "Heavy cargo leans truck / van / SUV body styles. Exact cargo volume is listed only when the catalog has it.");
  } else if (answers.cargo === "medium") {
    add(factors, "Cargo", model.body === "suv" || model.body === "minivan" ? 6 : 3, "Medium cargo is a body-style preference, not a cubic-foot quote.");
  } else {
    add(factors, "Cargo", 2, "Light cargo does not exclude any nameplate.");
  }

  if (answers.commute === "long") {
    if (model.electrified === "hybrid" || model.electrified === "phev" || model.electrified === "bev") {
      add(factors, "Commute", 8, "Electrified nameplates in this lineup are a better long-commute starting point.");
    } else {
      add(factors, "Commute", 1, "No electrified flag on this nameplate in the lineup.");
    }
  } else {
    add(factors, "Commute", 2, "Commute length is not a hard filter.");
  }

  if (answers.fuel === "hybrid") {
    add(factors, "Fuel", model.electrified === "hybrid" || model.electrified === "phev" ? 10 : -6, "Matched against the lineup electrified flag, not a guaranteed powertrain on every trim.");
  } else if (answers.fuel === "electric") {
    add(factors, "Fuel", model.electrified === "bev" || model.electrified === "fcev" ? 12 : -8, "Electric preference uses the lineup BEV/FCEV flag.");
  } else if (answers.fuel === "gas") {
    add(factors, "Fuel", model.electrified ? 1 : 6, "Gas preference still allows hybrids — many Toyota nameplates offer both.");
  } else {
    add(factors, "Fuel", 3, "No fuel filter applied.");
  }

  if (answers.awd === "yes") {
    if (facts.drivetrains.includes("awd") || facts.drivetrains.includes("4wd")) {
      add(factors, "AWD", 10, `Catalog lists ${facts.drivetrains.join(" / ").toUpperCase()}.`);
    } else if (facts.hasCatalog) {
      add(factors, "AWD", facts.drivetrains.includes("fwd") || facts.drivetrains.includes("rwd") ? 1 : 0, `Catalog drivetrains: ${facts.drivetrains.join(", ") || "not listed"}.`);
    } else {
      add(factors, "AWD", model.body === "suv" || model.body === "truck" ? 3 : 0, "AWD availability is not in this catalog for this nameplate.");
    }
  }

  if (answers.towing === "heavy") {
    if (facts.towingLbs != null) add(factors, "Towing", facts.towingLbs >= 5000 ? 10 : 2, `Catalog towing capacity up to ${facts.towingLbs} lb.`);
    else add(factors, "Towing", model.body === "truck" ? 5 : -2, "Towing capacity is not in this catalog for this nameplate.");
  } else if (answers.towing === "light") {
    if (facts.towingLbs != null) add(factors, "Towing", facts.towingLbs >= 1000 ? 6 : 1, `Catalog towing capacity up to ${facts.towingLbs} lb.`);
    else add(factors, "Towing", 1, "Light towing — no catalog figure to score.");
  }

  if (answers.offroad === "serious") {
    add(factors, "Off-road", OFFROAD.has(model.slug) ? 10 : -4, OFFROAD.has(model.slug) ? "This nameplate is merchandised for off-road use in this showroom." : "Not in the off-road set used by this matcher.");
  } else if (answers.offroad === "some") {
    add(factors, "Off-road", OFFROAD.has(model.slug) || model.body === "suv" ? 5 : 1, "Light off-road preference.");
  }

  if (answers.performance) {
    add(factors, "Performance", PERFORMANCE.has(model.slug) ? 12 : -3, PERFORMANCE.has(model.slug) ? "GR nameplate in this lineup." : "Not a GR nameplate.");
  }

  if (answers.tech === "important") {
    add(factors, "Showroom depth", facts.has3d ? 6 : facts.hasCatalog ? 4 : 1, facts.has3d ? "This showroom has a 3D configurator for the model." : facts.hasCatalog ? "This showroom has trim/option catalog data." : "Merchandising page only — no deeper catalog in this project.");
  }

  const total = factors.reduce((sum, f) => sum + f.score, 0);
  return { model, total, factors: factors.sort((a, b) => b.score - a.score) };
}

export function rankQuiz(answers: QuizAnswers, limit = 3): QuizMatch[] {
  return LINEUP.map((model) => scoreModel(model, answers))
    .sort((a, b) => b.total - a.total)
    .slice(0, limit);
}

export const DEFAULT_QUIZ: QuizAnswers = {
  budget: 45000,
  monthly: null,
  passengers: "3-5",
  cargo: "medium",
  commute: "medium",
  fuel: "any",
  awd: "any",
  towing: "none",
  offroad: "none",
  performance: false,
  tech: "nice",
};
