import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteShell } from "@/components/layout/SiteShell";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/owners/maintenance")({ component: MaintenancePage });

function MaintenancePage() {
  return (
    <SiteShell>
      <section className="mx-auto max-w-3xl px-4 py-16 md:px-6">
        <h1 className="font-display text-5xl tracking-wide">Maintenance</h1>
        <p className="mt-4 text-sm leading-relaxed text-muted">
          This site does not invent maintenance intervals, fluid specifications, or service prices.
          Use Toyota’s official owner tools for your VIN, then request a visit here.
        </p>
        <ul className="mt-8 space-y-4 text-sm">
          <li className="border border-border bg-surface p-5">
            <strong>Toyota Owners</strong>
            <p className="mt-2 text-muted">Manuals, maintenance schedules, and warranty information for your VIN.</p>
            <a className="mt-3 inline-block underline" href="https://www.toyota.com/owners/" target="_blank" rel="noreferrer">
              toyota.com/owners
            </a>
          </li>
          <li className="border border-border bg-surface p-5">
            <strong>Safety recalls</strong>
            <p className="mt-2 text-muted">Look up open campaigns by VIN on NHTSA or Toyota. We will not list recall names we cannot verify against your vehicle.</p>
            <a className="mt-3 inline-block underline" href="https://www.nhtsa.gov/recalls" target="_blank" rel="noreferrer">
              nhtsa.gov/recalls
            </a>
          </li>
        </ul>
        <div className="mt-8">
          <Link to="/owners/service">
            <Button>Request a service visit</Button>
          </Link>
        </div>
      </section>
    </SiteShell>
  );
}
