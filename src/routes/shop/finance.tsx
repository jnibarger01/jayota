import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { SiteShell } from "@/components/layout/SiteShell";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FINANCE_DISCLAIMER, CATALOG_DISCLAIMER } from "@/lib/dealer";
import { breakdown, defaultScenarios, type PaymentScenario } from "@/lib/finance-lab";
import { formatUsd, formatUsdExact } from "@/lib/utils";
import { getVehicleBySlug } from "@/showroom/data/vehicles";
import { listAllVehicles } from "@/showroom/api/client";
import { LINEUP } from "@/lib/lineup";
import { patchWorkspace } from "@/lib/shopper";
import { z } from "zod";
import { track } from "@/lib/analytics";

const searchSchema = z.object({ slug: z.string().optional() });

export const Route = createFileRoute("/shop/finance")({
  validateSearch: (s) => searchSchema.parse(s),
  component: FinancePage,
});

function FinancePage() {
  const { slug } = Route.useSearch();
  const vehicle = slug ? getVehicleBySlug(slug) : undefined;
  const lineup = LINEUP.find((item) => item.slug === slug);
  const defaultPrice = vehicle
    ? Math.min(vehicle.pricing.baseMsrp, ...vehicle.grades.map((g) => g.msrp))
    : lineup?.startingMsrp ?? 35000;
  const [scenarios, setScenarios] = useState<PaymentScenario[]>(() => defaultScenarios(defaultPrice));

  const update = (id: string, patch: Partial<PaymentScenario>) => {
    setScenarios((rows) => rows.map((row) => (row.id === id ? { ...row, ...patch } : row)));
    patchWorkspace({ scenarioId: id, slug: slug ?? null });
  };

  const priced = useMemo(() => scenarios.map((s) => ({ s, b: breakdown(s) })), [scenarios]);

  return (
    <SiteShell>
      <section className="mx-auto max-w-6xl px-4 py-16 md:px-6">
        <p className="text-xs uppercase tracking-[0.22em] text-muted">Shop</p>
        <h1 className="mt-2 font-display text-5xl tracking-wide">Payment scenario lab</h1>
        <p className="mt-4 text-sm text-muted">
          Compare up to three illustrations. These are estimates you control — not an approved offer, not a Toyota APR,
          and not dealer-arranged financing.
        </p>
        <div className="mt-6">
          <Label htmlFor="model">Catalog / lineup vehicle (optional)</Label>
          <select
            id="model"
            className="mt-2 h-11 w-full max-w-lg border border-border bg-surface px-3 text-sm"
            value={slug ?? ""}
            onChange={(e) => {
              const next = e.target.value;
              const found = next ? getVehicleBySlug(next) : undefined;
              const fromLineup = LINEUP.find((item) => item.slug === next);
              const price = found
                ? Math.min(found.pricing.baseMsrp, ...found.grades.map((g) => g.msrp))
                : fromLineup?.startingMsrp ?? defaultPrice;
              setScenarios(defaultScenarios(price));
              history.replaceState(null, "", next ? `/shop/finance?slug=${next}` : "/shop/finance");
            }}
          >
            <option value="">Custom amount</option>
            {listAllVehicles().map((item) => (
              <option key={item.slug} value={item.slug}>
                {item.year} {item.model}
              </option>
            ))}
            {LINEUP.filter((item) => !listAllVehicles().some((v) => v.slug === item.slug)).map((item) => (
              <option key={item.slug} value={item.slug}>
                {item.name} (lineup MSRP)
              </option>
            ))}
          </select>
        </div>

        <div className="mt-8 grid gap-4 lg:grid-cols-3">
          {priced.map(({ s, b }) => (
            <article key={s.id} className="rounded-2xl border border-border bg-surface p-5">
              <h2 className="font-semibold">{s.name}</h2>
              <form
                className="mt-4 grid gap-3"
                onSubmit={(e) => e.preventDefault()}
                onFocus={() => track("finance_started", { slug: slug ?? "custom", scenario: s.id })}
              >
                <Field label="Purchase price" value={s.price} onChange={(n) => update(s.id, { price: n })} />
                <Field label="Down payment" value={s.downPayment} onChange={(n) => update(s.id, { downPayment: n })} />
                <Field label="Trade equity" value={s.tradeEquity} onChange={(n) => update(s.id, { tradeEquity: n })} />
                <Field label="Taxes / fees" value={s.taxesFees} onChange={(n) => update(s.id, { taxesFees: n })} />
                <Field label="APR %" value={s.apr} step={0.1} onChange={(n) => update(s.id, { apr: n })} />
                <Field label="Term (months)" value={s.termMonths} onChange={(n) => update(s.id, { termMonths: n })} />
                <label className="flex min-h-11 items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={s.mode === "cash"}
                    onChange={(e) => update(s.id, { mode: e.target.checked ? "cash" : "finance" })}
                  />
                  Cash instead of finance
                </label>
              </form>
              <dl className="mt-5 space-y-1 text-sm">
                <div className="flex justify-between">
                  <dt className="text-muted">Est. monthly</dt>
                  <dd className="text-xl font-semibold">{formatUsdExact(b.monthly)}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-muted">Amount financed</dt>
                  <dd>{formatUsd(b.amountFinanced)}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-muted">Est. total interest</dt>
                  <dd>{formatUsd(b.totalInterest)}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-muted">Est. total paid</dt>
                  <dd>{formatUsd(b.totalPaid)}</dd>
                </div>
              </dl>
            </article>
          ))}
        </div>
        <p className="price-note mt-6">{FINANCE_DISCLAIMER}</p>
        <p className="price-note mt-2">{CATALOG_DISCLAIMER}</p>
      </section>
    </SiteShell>
  );
}

function Field({
  label,
  value,
  onChange,
  step,
}: {
  label: string;
  value: number;
  onChange: (n: number) => void;
  step?: number;
}) {
  return (
    <div>
      <Label>{label}</Label>
      <Input className="mt-1" type="number" min={0} step={step ?? 1} value={value} onChange={(e) => onChange(Number(e.target.value))} />
    </div>
  );
}
