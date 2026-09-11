import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteShell } from "@/components/layout/SiteShell";

export const Route = createFileRoute("/owners/resources")({ component: ResourcesPage });

function ResourcesPage() {
  const links = [
    { href: "https://www.toyota.com/owners/", title: "Toyota Owners portal", blurb: "Manuals, apps, and VIN tools." },
    { href: "https://www.nhtsa.gov/recalls", title: "NHTSA recall lookup", blurb: "Federal safety campaigns by VIN." },
    { href: "https://www.toyota.com/usa/connected-services/", title: "Connected Services", blurb: "Official Toyota connected-services information." },
  ];
  return (
    <SiteShell>
      <section className="mx-auto max-w-3xl px-4 py-16 md:px-6">
        <h1 className="font-display text-5xl tracking-wide">Owner resources</h1>
        <p className="mt-4 text-sm text-muted">Official sources only. Internal copies of manuals or warranty text are not hosted here.</p>
        <ul className="mt-8 space-y-3">
          {links.map((item) => (
            <li key={item.href} className="border border-border bg-surface p-5">
              <a href={item.href} target="_blank" rel="noreferrer" className="font-medium">
                {item.title}
              </a>
              <p className="mt-2 text-sm text-muted">{item.blurb}</p>
            </li>
          ))}
          <li className="border border-border bg-surface p-5">
            <Link to="/owners/saved" className="font-medium">
              Saved vehicles & builds
            </Link>
            <p className="mt-2 text-sm text-muted">Sign in to keep favorites across devices.</p>
          </li>
        </ul>
      </section>
    </SiteShell>
  );
}
