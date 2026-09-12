import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { SiteShell } from "@/components/layout/SiteShell";
import { CATALOG_DISCLAIMER } from "@/lib/dealer";
import { formatUsd, formatUsdExact } from "@/lib/utils";
import { getLineupBySlug, LINEUP, type LineupModel } from "@/lib/lineup";
import { MAX_COMPARE, MIN_COMPARE } from "@/showroom/api/client";
import { buildCompareRows, winnerLabel } from "@/lib/compare-intel";
import { rememberComparison } from "@/lib/shopper";
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
  const [diffOnly, setDiffOnly] = useState(false);
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
  const intel = useMemo(() => buildCompareRows(models.map((m) => m.slug)), [models]);

  useEffect(() => {
    if (models.length >= MIN_COMPARE) rememberComparison(models.map((m) => m.slug));
  }, [models]);

  const rows = diffOnly
    ? intel.rows.filter((row) => new Set(row.values.map((v) => String(v))).size > 1)
    : intel.rows;

  return (
    <SiteShell>
      <section className="mx-auto max-w-7xl px-4 py-12 md:px-6">
        <h1 className="text-4xl font-semibold tracking-tight">Compare</h1>
        <p className="mt-2 text-sm text-muted">
          Neutral highlights only (lowest starting price, highest listed towing). Missing catalog fields show as “Not in
          this catalog” — never invented horsepower.
        </p>
        <div className="mt-6 flex flex-wrap gap-2">
          {LINEUP.map((model) => {
            const on = selected.includes(model.slug);
            const next = on ? selected.filter((s) => s !== model.slug) : [...selected, model.slug].slice(0, MAX_COMPARE);
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
        {models.length >= MIN_COMPARE ? (
          <label className="mt-6 flex min-h-11 items-center gap-2 text-sm">
            <input type="checkbox" checked={diffOnly} onChange={(e) => setDiffOnly(e.target.checked)} />
            Show differences only
          </label>
        ) : null}

        {models.length < MIN_COMPARE ? (
          <p className="mt-10 text-sm text-muted">Select at least two vehicles to compare.</p>
        ) : (
          <>
            <div className="mt-8 grid gap-4 md:hidden">
              {models.map((model, index) => (
                <article key={model.slug} className="rounded-2xl border border-border bg-surface p-4">
                  <Link to="/vehicles/$slug" params={{ slug: model.slug }} className="text-xl font-semibold">
                    {model.name}
                  </Link>
                  <dl className="mt-3 space-y-2 text-sm">
                    {rows.map((row) => (
                      <div key={row.id} className="flex justify-between gap-3">
                        <dt className="text-muted">{row.label}</dt>
                        <dd className={row.winnerIndexes.includes(index) ? "text-accent" : ""}>
                          {formatCell(row.values[index], row.kind)}
                          {row.winnerIndexes.includes(index) && winnerLabel(row) ? (
                            <span className="mt-1 block text-xs text-accent">{winnerLabel(row)}</span>
                          ) : null}
                        </dd>
                      </div>
                    ))}
                  </dl>
                </article>
              ))}
            </div>
            <div className="mt-10 hidden overflow-x-auto md:block">
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
                  {rows.map((row) => (
                    <tr key={row.id} className="border-b border-border">
                      <th className="p-3 text-muted">{row.label}</th>
                      {row.values.map((value, index) => (
                        <td key={models[index]?.slug ?? index} className={`p-3 ${row.winnerIndexes.includes(index) ? "text-accent" : ""}`}>
                          {formatCell(value, row.kind)}
                          {row.winnerIndexes.includes(index) && winnerLabel(row) ? (
                            <span className="mt-1 block text-xs">{winnerLabel(row)}</span>
                          ) : null}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
        <p className="price-note mt-8">{CATALOG_DISCLAIMER}</p>
      </section>
    </SiteShell>
  );
}

function formatCell(value: string | number | null | undefined, kind: "text" | "number" | "price") {
  if (value == null || value === "") return "Not in this catalog";
  if (kind === "price" && typeof value === "number") return formatUsdExact(value);
  if (typeof value === "number") return String(value);
  return String(value);
}
