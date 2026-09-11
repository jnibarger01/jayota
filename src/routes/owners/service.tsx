import { createFileRoute } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { SiteShell } from "@/components/layout/SiteShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ContactFields, Field, FormStatus } from "@/components/forms/IntakeForm";
import { submitServiceRequest } from "@/lib/server/intakes";
import { serviceSchema } from "@/lib/validators/forms";
import { DEALER } from "@/lib/dealer";
import { track } from "@/lib/analytics";
import { newRequestId } from "@/lib/utils";

export const Route = createFileRoute("/owners/service")({ component: ServicePage });

function ServicePage() {
  const [values, setValues] = useState({
    name: "",
    email: "",
    phone: "",
    vin: "",
    year: "",
    model: "",
    mileage: "",
    serviceType: "oil_maintenance",
    concern: "",
    preferredDate: "",
    preferredWindow: "morning",
    transportation: "unknown",
    notes: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState<Awaited<ReturnType<typeof submitServiceRequest>> | null>(null);

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault();
    const parsed = serviceSchema.safeParse({ ...values, idempotencyKey: newRequestId() });
    if (!parsed.success) {
      const next: Record<string, string> = {};
      for (const issue of parsed.error.issues) next[String(issue.path[0] ?? "form")] = issue.message;
      setErrors(next);
      return;
    }
    setBusy(true);
    try {
      track("service_started", { type: parsed.data.serviceType });
      const saved = await submitServiceRequest({ data: parsed.data });
      setResult(saved);
      track("service_submitted", { scheduled: saved.scheduled });
    } catch (err) {
      setErrors({ form: err instanceof Error ? err.message : "Could not submit. Please retry." });
    } finally {
      setBusy(false);
    }
  };

  return (
    <SiteShell>
      <section className="mx-auto max-w-3xl px-4 py-16 md:px-6">
        <p className="text-xs uppercase tracking-[0.22em] text-muted">Owners</p>
        <h1 className="mt-2 font-display text-5xl tracking-wide">Schedule service</h1>
        <p className="mt-4 text-sm text-muted">
          Service hours (Toyota.com directory): Monday–Saturday 7 AM–6 PM, Sunday closed. Confirm with the dealer at {DEALER.phone.general}.
        </p>
        {result ? (
          <div className="mt-8">
            <FormStatus title="Request received — not yet scheduled">
              <p>Reference {result.id}.</p>
              <p>{result.confirmationNote}</p>
            </FormStatus>
          </div>
        ) : (
          <form className="mt-8 space-y-5" onSubmit={onSubmit} noValidate>
            <ContactFields
              prefix="svc"
              values={values}
              errors={errors}
              onChange={(field, value) => setValues((c) => ({ ...c, [field]: value }))}
            />
            <div className="grid gap-4 md:grid-cols-3">
              <Field id="year" label="Year">
                <Input id="year" value={values.year} onChange={(e) => setValues((c) => ({ ...c, year: e.target.value }))} />
              </Field>
              <Field id="model" label="Model">
                <Input id="model" value={values.model} onChange={(e) => setValues((c) => ({ ...c, model: e.target.value }))} />
              </Field>
              <Field id="mileage" label="Mileage">
                <Input id="mileage" value={values.mileage} onChange={(e) => setValues((c) => ({ ...c, mileage: e.target.value }))} />
              </Field>
            </div>
            <Field id="vin" label="VIN (optional)">
              <Input id="vin" value={values.vin} onChange={(e) => setValues((c) => ({ ...c, vin: e.target.value }))} />
            </Field>
            <Field id="type" label="Service type">
              <select
                id="type"
                className="h-11 w-full border border-border bg-surface px-3 text-sm"
                value={values.serviceType}
                onChange={(e) => setValues((c) => ({ ...c, serviceType: e.target.value }))}
              >
                <option value="oil_maintenance">Oil / scheduled maintenance</option>
                <option value="tires_brakes">Tires / brakes</option>
                <option value="recall_campaign">Recall campaign</option>
                <option value="diagnostic">Diagnostic / warning light</option>
                <option value="other">Other</option>
              </select>
            </Field>
            <Field id="concern" label="Concern *" error={errors.concern}>
              <Textarea id="concern" value={values.concern} onChange={(e) => setValues((c) => ({ ...c, concern: e.target.value }))} />
            </Field>
            <div className="grid gap-4 md:grid-cols-2">
              <Field id="date" label="Preferred date *" error={errors.preferredDate}>
                <Input id="date" type="date" value={values.preferredDate} onChange={(e) => setValues((c) => ({ ...c, preferredDate: e.target.value }))} />
              </Field>
              <Field id="window" label="Window">
                <select
                  id="window"
                  className="h-11 w-full border border-border bg-surface px-3 text-sm"
                  value={values.preferredWindow}
                  onChange={(e) => setValues((c) => ({ ...c, preferredWindow: e.target.value }))}
                >
                  <option value="morning">Morning</option>
                  <option value="afternoon">Afternoon</option>
                </select>
              </Field>
            </div>
            <Field id="transport" label="Transportation while in service">
              <select
                id="transport"
                className="h-11 w-full border border-border bg-surface px-3 text-sm"
                value={values.transportation}
                onChange={(e) => setValues((c) => ({ ...c, transportation: e.target.value }))}
              >
                <option value="unknown">I’ll confirm with the advisor</option>
                <option value="wait">I can wait</option>
                <option value="none">I will drop off</option>
              </select>
            </Field>
            {errors.form ? <p className="text-sm text-accent">{errors.form}</p> : null}
            <Button type="submit" disabled={busy}>
              {busy ? "Sending…" : "Submit service request"}
            </Button>
          </form>
        )}
      </section>
    </SiteShell>
  );
}
