import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { SiteShell } from "@/components/layout/SiteShell";
import { DEALER, INVENTORY_UNAVAILABLE } from "@/lib/dealer";
import { loadInventoryState } from "@/lib/catalog-data";
import { Button } from "@/components/ui/button";
import { filtersToSearch, rankInventoryMatches, applyInventoryFilters, watchDiff, type InventoryFilters } from "@/lib/inventory-match";
import { saveSearch, useShopper } from "@/lib/shopper";
import { LINEUP } from "@/lib/lineup";
import { z } from "zod";

const searchSchema = z.object({
  model: z.string().optional(),
  body: z.string().optional(),
  trim: z.string().optional(),
  drivetrain: z.string().optional(),
  powertrain: z.string().optional(),
  color: z.string().optional(),
  interior: z.string().optional(),
  status: z.string().optional(),
  minPrice: z.string().optional(),
  maxPrice: z.string().optional(),
  sort: z.enum(["price-asc", "price-desc", "newest", "match"]).optional(),
  build: z.enum(["configure", "buy"]).optional(),
});

export const Route = createFileRoute("/shop/inventory")({
  validateSearch: (s) => searchSchema.parse(s),
  loader: () => loadInventoryState(),
  component: InventoryPage,
});

function InventoryPage() {
  const state = Route.useLoaderData();
  const search = Route.useSearch();
  const shopper = useShopper();
  const [sheet, setSheet] = useState(false);
  const filters: InventoryFilters = {
    model: search.model,
    body: search.body,
    trim: search.trim,
    drivetrain: search.drivetrain,
    powertrain: search.powertrain,
    color: search.color,
    interior: search.interior,
    status: search.status,
    minPrice: search.minPrice ? Number(search.minPrice) : undefined,
    maxPrice: search.maxPrice ? Number(search.maxPrice) : undefined,
    sort: search.sort,
  };
  const filtered = useMemo(() => applyInventoryFilters(state.vehicles, filters), [state.vehicles, filters]);
  const ranked = useMemo(
    () =>
      search.model
        ? rankInventoryMatches(filtered, {
            model: search.model,
            trim: search.trim,
            drivetrain: search.drivetrain,
            color: search.color,
          })
        : filtered.map((vehicle) => ({ vehicle, tier: "none" as const, score: 0, reasons: ["Browse — no model match requested"] })),
    [filtered, search],
  );
  const previous = shopper.searches.find((item) => item.id === snapshotId(filters));
  const diff = previous ? watchDiff(previous.snapshotVins, state.vehicles.map((v) => v.vin)) : null;

  return (
    <SiteShell>
      <section className="mx-auto max-w-5xl px-4 py-16 md:px-6">
        <p className="text-xs uppercase tracking-[0.22em] text-muted">Shop</p>
        <h1 className="mt-2 font-display text-5xl tracking-wide">Inventory</h1>
        <div className="mt-4 flex flex-wrap gap-2">
          <Link
            to="/shop/inventory"
            search={{ ...search, build: "buy" }}
            className={`min-h-11 rounded-full px-4 text-sm ${search.build !== "configure" ? "bg-fg text-bg" : "border border-border"}`}
          >
            Buy from inventory
          </Link>
          <Link
            to="/vehicles"
            className={`min-h-11 rounded-full px-4 text-sm ${search.build === "configure" ? "bg-fg text-bg" : "border border-border"}`}
          >
            Build & configure
          </Link>
        </div>
        <p className="mt-6 text-sm leading-relaxed text-muted">{INVENTORY_UNAVAILABLE}</p>
        <p className="mt-4 text-sm text-muted">
          Provider status: <strong className="text-fg">{state.status}</strong> ({state.provider}).
          {state.vehicles.length === 0 ? " No vehicles returned." : ` ${ranked.length} matching.`}
        </p>

        <button type="button" className="mt-6 min-h-11 rounded-full border border-border px-4 text-sm md:hidden" onClick={() => setSheet(true)}>
          Filters
        </button>
        <FilterForm search={search} className="mt-6 hidden md:grid" />
        {sheet ? (
          <div className="mobile-sheet-layer md:hidden">
            <button type="button" className="absolute inset-0 bg-ink/70" aria-label="Close filters" onClick={() => setSheet(false)} />
            <div className="absolute inset-x-0 bottom-0 rounded-t-3xl bg-surface p-5">
              <h2 className="text-lg font-semibold">Filters</h2>
              <FilterForm search={search} className="mt-4 grid" />
            </div>
          </div>
        ) : null}

        <div className="mt-6 flex flex-wrap gap-3">
          <button
            type="button"
            className="min-h-11 rounded-full border border-border px-4 text-sm"
            onClick={() =>
              saveSearch({
                id: snapshotId(filters),
                name: search.model ? `${search.model} search` : "Inventory search",
                href: `/shop/inventory${window.location.search}`,
                filters: filtersToSearch(filters),
                snapshotVins: state.vehicles.map((v) => v.vin),
              })
            }
          >
            Save this search
          </button>
          <a href={DEALER.website} target="_blank" rel="noreferrer">
            <Button>Check the official dealer site</Button>
          </a>
        </div>
        {previous ? (
          <div className="mt-4 rounded-2xl border border-border bg-surface p-4 text-sm">
            <p className="font-medium">Saved search watch</p>
            <p className="mt-2 text-muted">
              Last snapshot: {previous.snapshotVins.length} VINs. Current feed: {state.vehicles.length}. This app does
              not push notifications.
            </p>
            {diff ? (
              <p className="mt-2 text-muted">
                {diff.added.length} new · {diff.removed.length} no longer listed since you saved this search.
              </p>
            ) : null}
          </div>
        ) : null}
        {ranked.length > 0 ? (
          <ul className="mt-8 grid gap-3">
            {ranked.map((row) => (
              <li key={row.vehicle.vin} className="rounded-2xl border border-border bg-surface p-4">
                <p className="text-xs uppercase tracking-widest text-muted">
                  {row.tier === "none" ? "Listed" : `${row.tier} match`}
                </p>
                <p className="mt-1 font-semibold">
                  {row.vehicle.year} {row.vehicle.model} {row.vehicle.trim}
                </p>
                <p className="text-sm text-muted">{row.reasons.join(" · ")}</p>
              </li>
            ))}
          </ul>
        ) : null}
        <p className="price-note mt-8">
          Required to go live: a documented inventory feed URL, auth token, and VIN-level contract. Until those exist, this
          page stays empty on purpose.
        </p>
      </section>
    </SiteShell>
  );
}

function snapshotId(filters: InventoryFilters) {
  return `inv-${JSON.stringify(filtersToSearch(filters))}`;
}

function FilterForm({ search, className }: { search: z.infer<typeof searchSchema>; className?: string }) {
  const valueOf = (name: string) => String((search as Record<string, string | undefined>)[name] ?? "");
  const fields: Array<[string, string, string[]]> = [
    ["model", "Model", LINEUP.map((m) => m.name)],
    ["body", "Body style", ["car", "suv", "truck", "minivan"]],
    ["trim", "Trim", []],
    ["drivetrain", "Drivetrain", ["fwd", "rwd", "awd", "4wd"]],
    ["powertrain", "Powertrain", ["gas", "hybrid", "phev", "bev"]],
    ["color", "Exterior color", []],
    ["status", "Availability", ["in_stock", "in_transit"]],
    ["sort", "Sort", ["price-asc", "price-desc", "newest", "match"]],
  ];

  return (
    <form className={className} method="get">
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {fields.map(([name, label, options]) => (
          <label key={name} className="grid gap-1 text-sm">
            {label}
            {options.length ? (
              <select name={name} defaultValue={valueOf(name)} className="h-11 border border-border bg-surface px-3">
                <option value="">Any</option>
                {options.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
            ) : (
              <input name={name} defaultValue={valueOf(name)} className="h-11 border border-border bg-surface px-3" />
            )}
          </label>
        ))}
        <label className="grid gap-1 text-sm">
          Min price
          <input name="minPrice" defaultValue={search.minPrice ?? ""} inputMode="numeric" className="h-11 border border-border bg-surface px-3" />
        </label>
        <label className="grid gap-1 text-sm">
          Max price
          <input name="maxPrice" defaultValue={search.maxPrice ?? ""} inputMode="numeric" className="h-11 border border-border bg-surface px-3" />
        </label>
      </div>
      <button type="submit" className="mt-4 min-h-11 rounded-full bg-pill px-5 text-sm text-pill-fg">
        Apply filters
      </button>
    </form>
  );
}
