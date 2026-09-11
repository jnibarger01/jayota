import { createFileRoute } from "@tanstack/react-router";
import { SiteShell } from "@/components/layout/SiteShell";
import { DEALER } from "@/lib/dealer";
import { pageHead } from "@/lib/seo";
import { writeConsent } from "@/lib/consent";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/privacy")({
  head: () => pageHead("Privacy", "How Hendrick Toyota Merriam handles contact data, accounts, and analytics consent."),
  component: PrivacyPage,
});

function PrivacyPage() {
  return (
    <SiteShell>
      <article className="mx-auto max-w-2xl px-4 py-16 md:px-6">
        <h1 className="font-display text-5xl tracking-wide">Privacy</h1>
        <p className="mt-6 text-sm leading-relaxed text-muted">
          {DEALER.name} collects only what you submit on this site: contact details, vehicle interest,
          service/test-drive/trade-in requests, and optional account data if you sign in. We do not sell
          that information. Analytics events do not include names, emails, phones, or VINs.
        </p>
        <p className="mt-4 text-sm leading-relaxed text-muted">
          To request deletion of an account or a stored request, email or call the dealership and include
          the reference id from your confirmation.
        </p>
        <p className="mt-4 text-sm text-muted">
          Official dealer privacy practices also apply on{" "}
          <a className="underline" href={DEALER.website} target="_blank" rel="noreferrer">
            {DEALER.website}
          </a>
          .
        </p>
        <div id="cookies" className="mt-10 border border-border bg-surface p-6">
          <h2 className="font-display text-2xl">Analytics cookies</h2>
          <p className="mt-3 text-sm text-muted">
            Optional analytics stay off until you allow them. Essential cookies for sign-in do not require this.
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            <Button
              type="button"
              variant="secondary"
              onClick={() => {
                writeConsent("necessary");
              }}
            >
              Necessary only
            </Button>
            <Button
              type="button"
              onClick={() => {
                writeConsent("all");
              }}
            >
              Allow analytics
            </Button>
          </div>
        </div>
      </article>
    </SiteShell>
  );
}
