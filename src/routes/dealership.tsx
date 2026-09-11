import { createFileRoute } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { SiteShell } from "@/components/layout/SiteShell";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ContactFields, Field, FormStatus } from "@/components/forms/IntakeForm";
import { JsonLd } from "@/components/seo/JsonLd";
import { DEALER, formatAddress, formatHour } from "@/lib/dealer";
import { submitLead } from "@/lib/server/intakes";
import { leadSchema } from "@/lib/validators/forms";
import { track } from "@/lib/analytics";
import { newRequestId } from "@/lib/utils";
import { autoDealerJsonLd, pageHead } from "@/lib/seo";

export const Route = createFileRoute("/dealership")({
  head: () =>
    pageHead(
      "Find us",
      `Hours, directions, and contact for ${DEALER.name} at ${formatAddress()}.`,
    ),
  component: DealershipPage,
});

function DealershipPage() {
  const [values, setValues] = useState({ name: "", email: "", phone: "", message: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState<Awaited<ReturnType<typeof submitLead>> | null>(null);

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault();
    const parsed = leadSchema.safeParse({
      kind: "contact",
      ...values,
      idempotencyKey: newRequestId(),
    });
    if (!parsed.success) {
      const next: Record<string, string> = {};
      for (const issue of parsed.error.issues) next[String(issue.path[0] ?? "form")] = issue.message;
      setErrors(next);
      return;
    }
    setBusy(true);
    try {
      const saved = await submitLead({ data: parsed.data });
      setResult(saved);
      track("lead_submitted", { kind: "contact" });
    } catch (err) {
      setErrors({ form: err instanceof Error ? err.message : "Could not submit." });
    } finally {
      setBusy(false);
    }
  };

  return (
    <SiteShell>
      <JsonLd data={autoDealerJsonLd()} />
      <section className="mx-auto max-w-7xl px-4 py-16 md:px-6">
        <p className="text-xs uppercase tracking-[0.22em] text-muted">Dealership</p>
        <h1 className="mt-2 font-display text-5xl tracking-wide">{DEALER.name}</h1>
        <p className="mt-3 text-sm text-muted">{formatAddress()}</p>
        <div className="mt-8 grid gap-10 lg:grid-cols-2">
          <div>
            <a className="text-lg" href={`tel:${DEALER.phone.generalTel}`}>
              {DEALER.phone.general}
            </a>
            <p className="mt-2 text-sm text-muted">
              Official website:{" "}
              <a className="underline" href={DEALER.website} target="_blank" rel="noreferrer">
                hendricktoyotamerriam.com
              </a>
            </p>
            <div className="mt-8 grid gap-6 sm:grid-cols-3">
              {(["sales", "service", "parts"] as const).map((dept) => (
                <div key={dept}>
                  <h2 className="text-xs uppercase tracking-[0.16em] text-muted">{dept}</h2>
                  <ul className="mt-3 space-y-1 text-sm">
                    {DEALER.hours[dept].map((row) => (
                      <li key={row.day} className="flex justify-between gap-2">
                        <span>{row.day.slice(0, 3)}</span>
                        <span className="text-muted">{formatHour(row.opens, row.closes)}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
            <p className="price-note mt-4">{DEALER.hoursSource}</p>
            <div className="mt-6 flex flex-wrap gap-3">
              <a href={DEALER.mapsUrl} target="_blank" rel="noreferrer">
                <Button>Directions</Button>
              </a>
              <a href={`tel:${DEALER.phone.generalTel}`}>
                <Button variant="secondary">Call</Button>
              </a>
            </div>
            <iframe title="Map of Hendrick Toyota Merriam" src={DEALER.osmEmbed} className="mt-8 h-72 w-full border border-border grayscale" />
          </div>
          <div>
            <h2 className="font-display text-2xl">Contact</h2>
            {result ? (
              <div className="mt-6">
                <FormStatus title="Message received">
                  <p>Reference {result.id}. An advisor will follow up using the email you provided.</p>
                  {!result.emailQueued ? <p>No confirmation email was sent — mail is not configured.</p> : null}
                </FormStatus>
              </div>
            ) : (
              <form className="mt-6 space-y-4" onSubmit={onSubmit} noValidate>
                <ContactFields
                  prefix="ct"
                  values={values}
                  errors={errors}
                  onChange={(field, value) => setValues((c) => ({ ...c, [field]: value }))}
                />
                <Field id="message" label="How can we help? *" error={errors.message}>
                  <Textarea id="message" value={values.message} onChange={(e) => setValues((c) => ({ ...c, message: e.target.value }))} />
                </Field>
                {errors.form ? <p className="text-sm text-accent">{errors.form}</p> : null}
                <Button type="submit" disabled={busy}>
                  {busy ? "Sending…" : "Send message"}
                </Button>
              </form>
            )}
          </div>
        </div>
      </section>
    </SiteShell>
  );
}
