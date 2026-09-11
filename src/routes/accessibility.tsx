import { createFileRoute } from "@tanstack/react-router";
import { SiteShell } from "@/components/layout/SiteShell";
import { DEALER } from "@/lib/dealer";

export const Route = createFileRoute("/accessibility")({ component: AccessibilityPage });

function AccessibilityPage() {
  return (
    <SiteShell>
      <article className="mx-auto max-w-2xl px-4 py-16 md:px-6">
        <h1 className="font-display text-5xl tracking-wide">Accessibility</h1>
        <p className="mt-6 text-sm leading-relaxed text-muted">
          This digital showroom targets WCAG 2.2 AA: semantic headings, keyboard access, visible focus,
          form error text, skip link, and a 3D fallback poster when WebGL/WebGPU is unavailable.
        </p>
        <p className="mt-4 text-sm leading-relaxed text-muted">
          If you find a barrier, contact {DEALER.name} at {DEALER.phone.general} and describe the page
          and assistive technology you were using.
        </p>
      </article>
    </SiteShell>
  );
}
