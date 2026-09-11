import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { SiteShell } from "@/components/layout/SiteShell";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FINANCE_DISCLAIMER, CATALOG_DISCLAIMER } from "@/lib/dealer";
import { estimateMonthlyPayment } from "@/lib/validators/forms";
import { formatUsd, formatUsdExact } from "@/lib/utils";
import { getVehicleBySlug } from "@/showroom/data/vehicles";
import { listAllVehicles } from "@/showroom/api/client";
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
  const defaultPrice = vehicle
    ? Math.min(vehicle.pricing.baseMsrp, ...vehicle.grades.map((g) => g.msrp))
    : 35000;
  const [price, setPrice] = useState(defaultPrice);
  const [down, setDown] = useState(3000);
  const [apr, setApr] = useState(6.9);
  const [term, setTerm] = useState(60);
  const principal = Math.max(0, price - down);
  const monthly = useMemo(() => estimateMonthlyPayment(principal, apr, term), [principal, apr, term]);

  return (
    <SiteShell>
      <section className="mx-auto max-w-3xl px-4 py-16 md:px-6">
        <p className="text-xs uppercase tracking-[0.22em] text-muted">Shop</p>
        <h1 className="mt-2 font-display text-5xl tracking-wide">Payment estimator</h1>
        <p className="mt-4 text-sm text-muted">
          Enter a vehicle price you want to model. This is not a Toyota APR, not dealer-arranged financing, and not a credit decision.
        </p>
        <form
          className="mt-8 grid gap-4 md:grid-cols-2"
          onSubmit={(e) => e.preventDefault()}
          onFocus={() => track("finance_started", { slug: slug ?? "custom" })}
        >
          <div className="md:col-span-2">
            <Label htmlFor="model">Catalog vehicle (optional)</Label>
            <select
              id="model"
              className="mt-2 h-11 w-full border border-border bg-surface px-3 text-sm"
              value={slug ?? ""}
              onChange={(e) => {
                const next = e.target.value;
                const found = next ? getVehicleBySlug(next) : undefined;
                if (found) setPrice(Math.min(found.pricing.baseMsrp, ...found.grades.map((g) => g.msrp)));
                history.replaceState(null, "", next ? `/shop/finance?slug=${next}` : "/shop/finance");
              }}
            >
              <option value="">Custom amount</option>
              {listAllVehicles().map((item) => (
                <option key={item.slug} value={item.slug}>
                  {item.year} {item.model}
                </option>
              ))}
            </select>
          </div>
          <div>
            <Label htmlFor="price">Vehicle price</Label>
            <Input id="price" className="mt-2" type="number" min={0} value={price} onChange={(e) => setPrice(Number(e.target.value))} />
          </div>
          <div>
            <Label htmlFor="down">Down payment</Label>
            <Input id="down" className="mt-2" type="number" min={0} value={down} onChange={(e) => setDown(Number(e.target.value))} />
          </div>
          <div>
            <Label htmlFor="apr">APR you want to model (%)</Label>
            <Input id="apr" className="mt-2" type="number" min={0} step={0.1} value={apr} onChange={(e) => setApr(Number(e.target.value))} />
          </div>
          <div>
            <Label htmlFor="term">Term (months)</Label>
            <Input id="term" className="mt-2" type="number" min={12} max={96} value={term} onChange={(e) => setTerm(Number(e.target.value))} />
          </div>
        </form>
        <div className="mt-8 border border-border bg-surface p-6">
          <p className="text-xs uppercase tracking-[0.18em] text-muted">Estimated monthly payment</p>
          <p className="mt-2 font-display text-5xl">{formatUsdExact(monthly)}</p>
          <p className="mt-3 text-sm text-muted">
            Amount financed {formatUsd(principal)} over {term} months at {apr.toFixed(2)}% APR.
          </p>
        </div>
        <p className="price-note mt-6">{FINANCE_DISCLAIMER}</p>
        <p className="price-note mt-2">{CATALOG_DISCLAIMER}</p>
      </section>
    </SiteShell>
  );
}
