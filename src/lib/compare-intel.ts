import { getCatalogFacts, type CatalogFacts } from "./catalog-facts.ts";
import { breakdown, modeledIllustration } from "./finance-lab.ts";
import { lineupConfigure } from "./lineup.ts";

export type CompareRowKind = "text" | "number" | "price";

export interface CompareRow {
  id: string;
  label: string;
  kind: CompareRowKind;
  values: Array<string | number | null>;
  winner: "min" | "max" | null;
  winnerIndexes: number[];
}

function winners(values: Array<number | null>, mode: "min" | "max"): number[] {
  const nums = values.filter((v): v is number => v != null);
  if (!nums.length) return [];
  const target = mode === "min" ? Math.min(...nums) : Math.max(...nums);
  return values.map((v, i) => (v === target ? i : -1)).filter((i) => i >= 0);
}

export function buildCompareRows(slugs: string[]): { facts: CatalogFacts[]; rows: CompareRow[] } {
  const facts = slugs.map(getCatalogFacts);
  const payments = facts.map((f) => (f.startingMsrp ? breakdown(modeledIllustration(f.startingMsrp)).monthly : null));

  const rows: CompareRow[] = [
    { id: "year", label: "Year", kind: "number", values: facts.map((f) => f.year || null), winner: null, winnerIndexes: [] },
    { id: "body", label: "Body", kind: "text", values: facts.map((f) => f.body), winner: null, winnerIndexes: [] },
    { id: "powertrain", label: "Powertrain", kind: "text", values: facts.map((f) => f.electrifiedLabel), winner: null, winnerIndexes: [] },
    {
      id: "msrp",
      label: "Starting MSRP",
      kind: "price",
      values: facts.map((f) => f.startingMsrp),
      winner: "min",
      winnerIndexes: winners(facts.map((f) => f.startingMsrp), "min"),
    },
    {
      id: "payment",
      label: "Modeled monthly (6.9% / 60 / 10% down)",
      kind: "price",
      values: payments,
      winner: "min",
      winnerIndexes: winners(payments, "min"),
    },
    {
      id: "seating",
      label: "Passenger capacity",
      kind: "number",
      values: facts.map((f) => f.seating),
      winner: "max",
      winnerIndexes: winners(facts.map((f) => f.seating), "max"),
    },
    {
      id: "cargo",
      label: "Cargo (cu ft)",
      kind: "number",
      values: facts.map((f) => f.cargoCuFt),
      winner: "max",
      winnerIndexes: winners(facts.map((f) => f.cargoCuFt), "max"),
    },
    {
      id: "towing",
      label: "Towing (lb)",
      kind: "number",
      values: facts.map((f) => f.towingLbs),
      winner: "max",
      winnerIndexes: winners(facts.map((f) => f.towingLbs), "max"),
    },
    {
      id: "mpg",
      label: "Combined MPG / MPGe",
      kind: "number",
      values: facts.map((f) => f.mpgCombined),
      winner: "max",
      winnerIndexes: winners(facts.map((f) => f.mpgCombined), "max"),
    },
    {
      id: "range",
      label: "Electric range (mi)",
      kind: "number",
      values: facts.map((f) => f.electricRangeMi),
      winner: "max",
      winnerIndexes: winners(facts.map((f) => f.electricRangeMi), "max"),
    },
    {
      id: "drive",
      label: "Drivetrain (catalog)",
      kind: "text",
      values: facts.map((f) => (f.drivetrains.length ? f.drivetrains.join(" / ").toUpperCase() : null)),
      winner: null,
      winnerIndexes: [],
    },
    {
      id: "configure",
      label: "Configuration",
      kind: "text",
      values: facts.map((f) => (f.lineup ? lineupConfigure(f.lineup).label : "—")),
      winner: null,
      winnerIndexes: [],
    },
    {
      id: "inventory",
      label: "Inventory match",
      kind: "text",
      values: facts.map(() => "Feed not connected"),
      winner: null,
      winnerIndexes: [],
    },
  ];

  for (const row of rows) {
    if (row.winner) row.winnerIndexes = winners(row.values.map((v) => (typeof v === "number" ? v : null)), row.winner);
  }

  return { facts, rows };
}

export function winnerLabel(row: CompareRow): string | null {
  if (!row.winnerIndexes.length || !row.winner) return null;
  if (row.id === "msrp") return "Lowest starting price";
  if (row.id === "payment") return "Lowest modeled payment";
  if (row.id === "towing") return "Highest towing capacity";
  if (row.id === "mpg") return "Highest listed efficiency";
  if (row.id === "cargo") return "Highest listed cargo";
  if (row.id === "seating") return "Highest listed seating";
  if (row.id === "range") return "Highest listed range";
  return null;
}
