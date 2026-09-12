import { createFileRoute } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { SiteShell } from "@/components/layout/SiteShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ContactFields, Field, FormStatus } from "@/components/forms/IntakeForm";
import { submitTradeIn } from "@/lib/server/intakes";
import { tradeInSchema } from "@/lib/validators/forms";
import { decodeVinLocal } from "@/lib/vin";
import { patchWorkspace } from "@/lib/shopper";
import { track } from "@/lib/analytics";
import { newRequestId } from "@/lib/utils";

export const Route = createFileRoute("/shop/trade-in")({ component: TradeInPage });

function TradeInPage() {
  const [values, setValues] = useState({
    name: "",
    email: "",
    phone: "",
    vin: "",
    year: "",
    make: "Toyota",
    model: "",
    mileage: "",
    condition: "good",
    notes: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState<Awaited<ReturnType<typeof submitTradeIn>> | null>(null);

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault();
    const parsed = tradeInSchema.safeParse({ ...values, idempotencyKey: newRequestId() });
    if (!parsed.success) {
      const next: Record<string, string> = {};
      for (const issue of parsed.error.issues) {
        const key = String(issue.path[0] ?? "form");
        next[key] = issue.message;
      }
      setErrors(next);
      return;
    }
    setBusy(true);
    setErrors({});
    try {
      const saved = await submitTradeIn({ data: parsed.data });
      setResult(saved);
      patchWorkspace({ tradeNote: `Request ${saved.id}` });
      track("trade_in_started", { hasVin: Boolean(parsed.data.vin) });
    } catch (err) {
      setErrors({ form: err instanceof Error ? err.message : "Could not submit. Please retry." });
    } finally {
      setBusy(false);
    }
  };

  return (
    <SiteShell>
      <section className="mx-auto max-w-3xl px-4 py-16 md:px-6">
        <h1 className="font-display text-5xl tracking-wide">Trade-in</h1>
        <p className="mt-4 text-sm text-muted">
          Tell us about the vehicle you may trade. We will not invent a value. Appraisal happens with the dealership.
        </p>
        {result ? (
          <div className="mt-8">
            <FormStatus title="Request received">
              <p>Reference {result.id}.</p>
              <p>{result.valuationNote}</p>
            </FormStatus>
          </div>
        ) : (
          <form className="mt-8 space-y-5" onSubmit={onSubmit} noValidate>
            <ContactFields
              prefix="tr"
              values={values}
              errors={errors}
              onChange={(field, value) => setValues((c) => ({ ...c, [field]: value }))}
            />
            <Field id="vin" label="VIN (optional)" error={errors.vin}>
              <Input id="vin" value={values.vin} onChange={(e) => setValues((c) => ({ ...c, vin: e.target.value }))} />
              {values.vin.trim().length >= 8 ? (
                <VinHint raw={values.vin} />
              ) : (
                <p className="mt-1 text-xs text-muted">VIN decode is a format/WMI check only. We will not invent a trade value.</p>
              )}
            </Field>
            <div className="grid gap-4 md:grid-cols-3">
              <Field id="year" label="Year" error={errors.year}>
                <Input id="year" value={values.year} onChange={(e) => setValues((c) => ({ ...c, year: e.target.value }))} />
              </Field>
              <Field id="make" label="Make">
                <Input id="make" value={values.make} onChange={(e) => setValues((c) => ({ ...c, make: e.target.value }))} />
              </Field>
              <Field id="model" label="Model">
                <Input id="model" value={values.model} onChange={(e) => setValues((c) => ({ ...c, model: e.target.value }))} />
              </Field>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <Field id="mileage" label="Mileage">
                <Input id="mileage" value={values.mileage} onChange={(e) => setValues((c) => ({ ...c, mileage: e.target.value }))} />
              </Field>
              <Field id="condition" label="Condition">
                <select
                  id="condition"
                  className="h-11 w-full border border-border bg-surface px-3 text-sm"
                  value={values.condition}
                  onChange={(e) => setValues((c) => ({ ...c, condition: e.target.value }))}
                >
                  <option value="excellent">Excellent</option>
                  <option value="good">Good</option>
                  <option value="fair">Fair</option>
                  <option value="poor">Poor</option>
                </select>
              </Field>
            </div>
            <Field id="notes" label="Notes">
              <Textarea id="notes" value={values.notes} onChange={(e) => setValues((c) => ({ ...c, notes: e.target.value }))} />
            </Field>
            {errors.form ? <p className="text-sm text-accent">{errors.form}</p> : null}
            <Button type="submit" disabled={busy}>
              {busy ? "Sending…" : "Submit appraisal request"}
            </Button>
          </form>
        )}
      </section>
    </SiteShell>
  );
}

function VinHint({ raw }: { raw: string }) {
  const decoded = decodeVinLocal(raw);
  return (
    <p className="mt-2 text-xs text-muted">
      {decoded.valid
        ? `${decoded.manufacturer ?? "Unknown WMI"} · model year ${decoded.modelYear ?? "unknown"}. ${decoded.note}`
        : decoded.note}
    </p>
  );
}
