import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo } from "react";
import { SiteShell } from "@/components/layout/SiteShell";
import { CATALOG_DISCLAIMER } from "@/lib/dealer";
import { formatUsd } from "@/lib/utils";
import { electrifiedLabel, getLineupBySlug, LINEUP, lineupConfigure, type LineupModel } from "@/lib/lineup";
import { getVehicleBySlug } from "@/showroom/data/vehicles";
import { MAX_COMPARE, MIN_COMPARE } from "@/showroom/api/client";
import { z } from "zod";

const searchSchema = z.object({
  vehicles: z.string().optional(),
});

export const Route = createFileRoute("/vehicles/compare")({
  validateSearch: (search) => searchSchema.parse(search),
  component: ComparePage,
});

function ComparePage() {
  const { vehicles: raw } = Route.useSearch();
  const selected = useMemo(
    () =>
      Array.from(
        new Set(
          (raw ?? "")
            .split(",")
            .map((s) => s.trim())
            .filter(Boolean),
        ),
      ).slice(0, MAX_COMPARE),
    [raw],
  );
  const models = selected.map((slug) => getLineupBySlug(slug)).filter((item): item is LineupModel => Boolean(item));

  return (
    <SiteShell>
      <section className="mx-auto max-w-7xl px-4 py-12 md:px-6">
        <h1 className="text-4xl font-semibold tracking-tight">Compare</h1>
        <p className="mt-2 text-sm text-muted">
          Choose {MIN_COMPARE}–{MAX_COMPARE} models. Starting MSRP is a Toyota.com catalog figure. Specs only
          appear when this showroom has a catalog record — we do not invent horsepower or trims.
        </p>
        <div className="mt-6 flex flex-wrap gap-2">
          {LINEUP.map((model) => {
            const on = selected.includes(model.slug);
            const next = on
              ? selected.filter((s) => s !== model.slug)
              : [...selected, model.slug].slice(0, MAX_COMPARE);
            return (
              <Link
                key={model.slug}
                to="/vehicles/compare"
                search={{ vehicles: next.join(",") }}
                className={`min-h-11 px-4 text-sm ${on ? "bg-fg text-bg" : "border border-border"}`}
              >
                {model.name}
              </Link>
            );
          })}
        </div>

        {models.length < MIN_COMPARE ? (
          <p className="mt-10 text-sm text-muted">Select at least two vehicles to compare.</p>
        ) : (
          <div className="mt-10 overflow-x-auto">
            <table className="w-full min-w-[640px] text-left text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="p-3 font-medium text-muted"> </th>
                  {models.map((model) => (
                    <th key={model.slug} className="p-3 text-xl font-semibold">
                      <Link to="/vehicles/$slug" params={{ slug: model.slug }}>
                        {model.name}
                      </Link>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-border">
                  <th className="p-3 text-muted">Year</th>
                  {models.map((model) => (
                    <td key={model.slug} className="p-3">
                      {model.year}
                    </td>
                  ))}
                </tr>
                <tr className="border-b border-border">
                  <th className="p-3 text-muted">Body</th>
                  {models.map((model) => (
                    <td key={model.slug} className="p-3 capitalize">
                      {model.body}
                    </td>
                  ))}
                </tr>
                <tr className="border-b border-border">
                  <th className="p-3 text-muted">Electrified</th>
                  {models.map((model) => (
                    <td key={model.slug} className="p-3">
                      {electrifiedLabel(model.electrified) ?? "Gas"}
                    </td>
                  ))}
                </tr>
                <tr className="border-b border-border">
                  <th className="p-3 text-muted">Starting MSRP*</th>
                  {models.map((model) => (
                    <td key={model.slug} className="p-3">
                      {model.startingMsrp ? formatUsd(model.startingMsrp) : "—"}
                    </td>
                  ))}
                </tr>
                <tr className="border-b border-border">
                  <th className="p-3 text-muted">3D / configure</th>
                  {models.map((model) => {
                    const cta = lineupConfigure(model);
                    return (
                      <td key={model.slug} className="p-3">
                        {cta.kind === "none" ? "Merchandising only" : cta.label}
                      </td>
                    );
                  })}
                </tr>
                <tr className="border-b border-border">
                  <th className="p-3 text-muted">Catalog record</th>
                  {models.map((model) => {
                    const vehicle = getVehicleBySlug(model.slug);
                    return (
                      <td key={model.slug} className="p-3">
                        {vehicle ? `${vehicle.year} ${vehicle.model} project catalog` : "Not in this catalog"}
                      </td>
                    );
                  })}
                </tr>
              </tbody>
            </table>
          </div>
        )}
        <p className="price-note mt-8">{CATALOG_DISCLAIMER}</p>
      </section>
    </SiteShell>
  );
}
