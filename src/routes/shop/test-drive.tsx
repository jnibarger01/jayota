import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState, type FormEvent } from "react";
import { SiteShell } from "@/components/layout/SiteShell";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ContactFields, Field, FormStatus } from "@/components/forms/IntakeForm";
import { submitTestDrive } from "@/lib/server/intakes";
import { testDriveSchema } from "@/lib/validators/forms";
import { listAllVehicles } from "@/showroom/api/client";
import { LINEUP } from "@/lib/lineup";
import { upcomingSalesSlots } from "@/lib/test-drive-slots";
import { patchWorkspace, rememberTestDrive } from "@/lib/shopper";
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
  const slots = useMemo(() => upcomingSalesSlots(14), []);
  const [step, setStep] = useState(1);
  const [sentKey, setSentKey] = useState<string | null>(null);
  const [values, setValues] = useState({
    name: "",
    email: "",
    phone: "",
    vehicleSlug: vehicle ?? "rav4",
    preferredDate: "",
    preferredWindow: "morning" as "morning" | "afternoon" | "evening",
    notes: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState<Awaited<ReturnType<typeof submitTestDrive>> | null>(null);

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (sentKey) return;
    const parsed = testDriveSchema.safeParse({ ...values, idempotencyKey: newRequestId() });
    if (!parsed.success) {
      const next: Record<string, string> = {};
      for (const issue of parsed.error.issues) next[String(issue.path[0] ?? "form")] = issue.message;
      setErrors(next);
      setStep(parsed.error.issues.some((i) => String(i.path[0]).includes("name") || String(i.path[0]) === "email") ? 3 : 2);
      return;
    }
    setBusy(true);
    try {
      const saved = await submitTestDrive({ data: parsed.data });
      setResult(saved);
      setSentKey(parsed.data.idempotencyKey ?? saved.id);
      rememberTestDrive({ id: saved.id, slug: parsed.data.vehicleSlug, label: parsed.data.preferredDate });
      patchWorkspace({ slug: parsed.data.vehicleSlug, testDriveHref: "/shop/test-drive" });
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
          Request a time during published sales hours. This is a test-drive request, not a confirmed appointment, until
          Hendrick Toyota Merriam accepts it.
        </p>
        <ol className="mt-6 flex gap-2 text-xs uppercase tracking-widest text-muted">
          {["Vehicle", "Time", "Contact", "Review"].map((label, i) => (
            <li key={label} className={step === i + 1 ? "text-fg" : ""}>
              {i + 1} {label}
            </li>
          ))}
        </ol>
        {result ? (
          <div className="mt-8">
            <FormStatus title="Test-drive request submitted">
              <p>Reference {result.id}.</p>
              <p>{result.confirmationNote}</p>
              <p>This is not a confirmed appointment.</p>
            </FormStatus>
          </div>
        ) : (
          <form className="mt-8 space-y-5" onSubmit={onSubmit} noValidate>
            {step === 1 ? (
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
            ) : null}
            {step === 2 ? (
              <Field id="slot" label="Preferred slot *" error={errors.preferredDate}>
                <select
                  id="slot"
                  className="h-11 w-full border border-border bg-surface px-3 text-sm"
                  value={values.preferredDate ? `${values.preferredDate}` : ""}
                  onChange={(e) => {
                    const slot = slots.find((s) => s.iso === e.target.value);
                    if (!slot) return;
                    setValues((c) => ({
                      ...c,
                      preferredDate: slot.iso.slice(0, 10),
                      preferredWindow: slot.window,
                      notes: `Requested slot: ${slot.label}`,
                    }));
                  }}
                >
                  <option value="">Choose a published sales-hour slot</option>
                  {slots.map((slot) => (
                    <option key={slot.iso} value={slot.iso}>
                      {slot.label}
                    </option>
                  ))}
                </select>
              </Field>
            ) : null}
            {step === 3 ? (
              <ContactFields
                prefix="td"
                values={values}
                errors={errors}
                onChange={(field, value) => setValues((c) => ({ ...c, [field]: value }))}
              />
            ) : null}
            {step === 4 ? (
              <div className="space-y-2 rounded-2xl border border-border bg-surface p-4 text-sm">
                <p>Vehicle: {values.vehicleSlug}</p>
                <p>Date: {values.preferredDate || "—"} ({values.preferredWindow})</p>
                <p>Name: {values.name}</p>
                <p>Email: {values.email}</p>
                <Field id="notes" label="Notes">
                  <Textarea id="notes" value={values.notes} onChange={(e) => setValues((c) => ({ ...c, notes: e.target.value }))} />
                </Field>
              </div>
            ) : null}
            {errors.form ? <p className="text-sm text-accent">{errors.form}</p> : null}
            <div className="flex flex-wrap gap-3">
              {step > 1 ? (
                <Button type="button" variant="secondary" onClick={() => setStep((s) => s - 1)}>
                  Back
                </Button>
              ) : null}
              {step < 4 ? (
                <Button type="button" onClick={() => setStep((s) => s + 1)}>
                  Continue
                </Button>
              ) : (
                <Button type="submit" disabled={busy || Boolean(sentKey)}>
                  {busy ? "Sending…" : "Submit request"}
                </Button>
              )}
            </div>
          </form>
        )}
      </section>
    </SiteShell>
  );
}
