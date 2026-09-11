import { createFileRoute } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { SiteShell } from "@/components/layout/SiteShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ContactFields, Field, FormStatus } from "@/components/forms/IntakeForm";
import { submitTestDrive } from "@/lib/server/intakes";
import { testDriveSchema } from "@/lib/validators/forms";
import { listAllVehicles } from "@/showroom/api/client";
import { LINEUP } from "@/lib/lineup";
import { track } from "@/lib/analytics";
import { newRequestId } from "@/lib/utils";
import { z } from "zod";

const searchSchema = z.object({ vehicle: z.string().optional() });

export const Route = createFileRoute("/shop/test-drive")({
  validateSearch: (s) => searchSchema.parse(s),
  component: TestDrivePage,
});

function TestDrivePage() {
  const { vehicle } = Route.useSearch();
  const catalog = listAllVehicles();
  const extras = LINEUP.filter((item) => !catalog.some((v) => v.slug === item.slug));
  const vehicleOptions = [
    ...catalog.map((item) => ({ slug: item.slug, label: `${item.year} ${item.model}` })),
    ...extras.map((item) => ({ slug: item.slug, label: item.name })),
  ];
  const [values, setValues] = useState({
    name: "",
    email: "",
    phone: "",
    vehicleSlug: vehicle ?? "rav4",
    preferredDate: "",
    preferredWindow: "morning",
    notes: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState<Awaited<ReturnType<typeof submitTestDrive>> | null>(null);

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault();
    const parsed = testDriveSchema.safeParse({ ...values, idempotencyKey: newRequestId() });
    if (!parsed.success) {
      const next: Record<string, string> = {};
      for (const issue of parsed.error.issues) next[String(issue.path[0] ?? "form")] = issue.message;
      setErrors(next);
      return;
    }
    setBusy(true);
    try {
      const saved = await submitTestDrive({ data: parsed.data });
      setResult(saved);
      track("test_drive_requested", { slug: parsed.data.vehicleSlug });
    } catch (err) {
      setErrors({ form: err instanceof Error ? err.message : "Could not submit. Please retry." });
    } finally {
      setBusy(false);
    }
  };

  return (
    <SiteShell>
      <section className="mx-auto max-w-3xl px-4 py-16 md:px-6">
        <h1 className="font-display text-5xl tracking-wide">Test drive</h1>
        <p className="mt-4 text-sm text-muted">
          Request a time. This is not a confirmed appointment until Hendrick Toyota Merriam accepts it.
        </p>
        {result ? (
          <div className="mt-8">
            <FormStatus title="Request received">
              <p>Reference {result.id}.</p>
              <p>{result.confirmationNote}</p>
            </FormStatus>
          </div>
        ) : (
          <form className="mt-8 space-y-5" onSubmit={onSubmit} noValidate>
            <ContactFields
              prefix="td"
              values={values}
              errors={errors}
              onChange={(field, value) => setValues((c) => ({ ...c, [field]: value }))}
            />
            <Field id="vehicle" label="Vehicle *" error={errors.vehicleSlug}>
              <select
                id="vehicle"
                className="h-11 w-full border border-border bg-surface px-3 text-sm"
                value={values.vehicleSlug}
                onChange={(e) => setValues((c) => ({ ...c, vehicleSlug: e.target.value }))}
              >
                {vehicleOptions.map((item) => (
                  <option key={item.slug} value={item.slug}>
                    {item.label}
                  </option>
                ))}
              </select>
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
                  <option value="evening">Evening</option>
                </select>
              </Field>
            </div>
            <Field id="notes" label="Notes">
              <Textarea id="notes" value={values.notes} onChange={(e) => setValues((c) => ({ ...c, notes: e.target.value }))} />
            </Field>
            {errors.form ? <p className="text-sm text-accent">{errors.form}</p> : null}
            <Button type="submit" disabled={busy}>
              {busy ? "Sending…" : "Request test drive"}
            </Button>
          </form>
        )}
      </section>
    </SiteShell>
  );
}
