import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ChevronRight } from "lucide-react";
import { SiteShell } from "@/components/layout/SiteShell";
import { Button } from "@/components/ui/button";
import { FavoriteButton } from "@/components/vehicles/FavoriteButton";
import { PaymentChip } from "@/components/vehicles/PaymentChip";
import { TrimMatrix } from "@/components/vehicles/TrimMatrix";
import { JsonLd } from "@/components/seo/JsonLd";
import { CATALOG_DISCLAIMER } from "@/lib/dealer";
import { formatUsd } from "@/lib/utils";
import { breadcrumbJsonLd, pageHead } from "@/lib/seo";
import { getLineupBySlug, lineupConfigure, type LineupModel } from "@/lib/lineup";
import { getVehicleBySlug } from "@/showroom/data/vehicles";
import type { Vehicle } from "@/showroom/types/vehicle";
import { track } from "@/lib/analytics";
import { useEffect } from "react";
import { rememberView, patchWorkspace } from "@/lib/shopper";

type PageData =
  | { kind: "catalog"; vehicle: Vehicle; lineup?: LineupModel }
  | { kind: "lineup"; lineup: LineupModel };

export const Route = createFileRoute("/vehicles/$slug/")({
  loader: ({ params }): PageData => {
    const vehicle = getVehicleBySlug(params.slug);
    const lineup = getLineupBySlug(params.slug);
    if (vehicle) return { kind: "catalog", vehicle, lineup };
    if (lineup) return { kind: "lineup", lineup };
    throw notFound();
  },
  head: ({ loaderData }) => {
    if (!loaderData) return pageHead("Vehicle", "Vehicle catalog");
    if (loaderData.kind === "lineup") {
      return pageHead(
        loaderData.lineup.name,
        `${loaderData.lineup.tagline} Merchandising overview — not a live Toyota quote.`,
      );
    }
    const vehicle = loaderData.vehicle;
    return pageHead(
      `${vehicle.year} ${vehicle.model}`,
      `Catalog overview for the ${vehicle.year} Toyota ${vehicle.model}. Figures are project catalog data, not live Toyota quotes.`,
    );
  },
  component: VehicleDetailPage,
});

function VehicleDetailPage() {
  const data = Route.useLoaderData();
  if (data.kind === "lineup") return <LineupOnlyPage model={data.lineup} />;
  return <CatalogVehiclePage vehicle={data.vehicle} lineup={data.lineup} />;
}

function LineupOnlyPage({ model }: { model: LineupModel }) {
  useEffect(() => {
    track("vehicle_view", { slug: model.slug, source: "lineup" });
    rememberView(model.slug);
    patchWorkspace({ slug: model.slug });
  }, [model.slug]);

  return (
    <SiteShell>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Vehicles", path: "/vehicles" },
          { name: model.name, path: `/vehicles/${model.slug}` },
        ])}
      />
      <section className="mx-auto max-w-7xl px-4 py-8 md:px-6 md:py-12">
        <div className="overflow-hidden rounded-2xl bg-surface-2">
          <img src={model.image.src} alt={model.image.alt} className="max-h-[520px] w-full object-cover" />
        </div>
        <p className="mt-8 text-xs font-medium uppercase tracking-widest text-muted">Toyota</p>
        <div className="mt-1 flex flex-wrap items-start justify-between gap-4">
          <h1 className="text-5xl font-semibold tracking-tight md:text-6xl">{model.name}</h1>
          <FavoriteButton slug={model.slug} />
        </div>
        <p className="mt-3 text-lg text-muted">{model.tagline}</p>
        {model.startingMsrp ? (
          <p className="mt-4 text-fg">
            Starting at {formatUsd(model.startingMsrp)}*
            {model.msrpSource ? <span className="mt-1 block text-xs text-muted">{model.msrpSource}</span> : null}
          </p>
        ) : null}

        <div className="mt-8 flex flex-wrap gap-3">
          {lineupConfigure(model).kind !== "none" ? (
            <Link to="/vehicles/$slug/configure" params={{ slug: model.slug }}>
              <Button>
                {lineupConfigure(model).label} <ChevronRight size={16} />
              </Button>
            </Link>
          ) : (
            <Link to="/shop/test-drive" search={{ vehicle: model.slug }}>
              <Button>
                Request a test drive <ChevronRight size={16} />
              </Button>
            </Link>
          )}
          <Link to="/vehicles/compare" search={{ vehicles: model.slug }}>
            <Button variant="secondary">Compare</Button>
          </Link>
          <Link to="/dealership">
            <Button variant="secondary">Find a dealer</Button>
          </Link>
        </div>
        <p className="price-note mt-8">
          This model is shown as consumer merchandising. Trim lists, horsepower, and live inventory are not
          in this catalog, and the starting figure is a published Toyota.com MSRP — not a quote from Hendrick
          Toyota Merriam.
        </p>
        <p className="price-note mt-3">{CATALOG_DISCLAIMER}</p>
      </section>
    </SiteShell>
  );
}

function CatalogVehiclePage({ vehicle, lineup }: { vehicle: Vehicle; lineup?: LineupModel }) {
  useEffect(() => {
    track("vehicle_view", { slug: vehicle.slug });
    rememberView(vehicle.slug);
    patchWorkspace({ slug: vehicle.slug });
  }, [vehicle.slug]);

  const starting = Math.min(vehicle.pricing.baseMsrp, ...vehicle.grades.map((g) => g.msrp));
  const hero = lineup?.image.src
    ? { url: lineup.image.src, alt: lineup.image.alt }
    : vehicle.media.hero;
  const gallery = vehicle.media.gallery.filter((asset) => asset.url);

  return (
    <SiteShell>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Vehicles", path: "/vehicles" },
          { name: `${vehicle.year} ${vehicle.model}`, path: `/vehicles/${vehicle.slug}` },
        ])}
      />
      <section className="mx-auto max-w-7xl px-4 py-8 md:px-6 md:py-12">
        <p className="text-xs font-medium uppercase tracking-widest text-muted">
          {vehicle.year} · {vehicle.bodyStyle}
        </p>
        <div className="mt-2 flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="text-5xl font-semibold tracking-tight md:text-6xl">{vehicle.model}</h1>
            {lineup ? <p className="mt-2 text-muted">{lineup.tagline}</p> : null}
          </div>
          <FavoriteButton slug={vehicle.slug} />
        </div>
        <p className="mt-3 text-muted">
          {lineup?.startingMsrp
            ? `Toyota.com starting MSRP ${formatUsd(lineup.startingMsrp)}*`
            : `Catalog starting figure ${formatUsd(starting)}*`}
        </p>
        {lineup?.msrpSource ? <p className="mt-1 text-xs text-muted">{lineup.msrpSource}</p> : null}
        {lineup?.startingMsrp ? <div className="mt-2"><PaymentChip msrp={lineup.startingMsrp} /></div> : <div className="mt-2"><PaymentChip msrp={starting} /></div>}

        <div className="mt-8 overflow-hidden rounded-2xl bg-surface-2">
          {hero.url ? (
            <img src={hero.url} alt={hero.alt} className="max-h-[520px] w-full object-cover" />
          ) : (
            <div className="flex min-h-[280px] items-end bg-gradient-to-br from-surface-3 to-bg p-8">
              <p className="text-6xl font-semibold tracking-tight">{vehicle.model}</p>
            </div>
          )}
        </div>
        {gallery.length > 1 ? (
          <ul className="mt-3 grid grid-cols-2 gap-3 md:grid-cols-4">
            {gallery.map((asset) => (
              <li key={asset.url} className="overflow-hidden rounded-xl border border-border bg-surface-2">
                <img src={asset.url} alt={asset.alt} className="h-28 w-full object-cover" />
              </li>
            ))}
          </ul>
        ) : null}

        <div className="mt-6 flex flex-wrap gap-3">
          <Link to="/vehicles/$slug/configure" params={{ slug: vehicle.slug }}>
            <Button>{vehicle.threeDConfig.hasModel ? "Open 3D showroom" : "Build & Price"}</Button>
          </Link>
          <Link to="/shop/test-drive" search={{ vehicle: vehicle.slug }}>
            <Button variant="secondary">Request a test drive</Button>
          </Link>
          <Link to="/shop/finance" search={{ slug: vehicle.slug }}>
            <Button variant="secondary">Estimate payment</Button>
          </Link>
          <Link to="/vehicles/compare" search={{ vehicles: vehicle.slug }}>
            <Button variant="ghost">Compare</Button>
          </Link>
        </div>
        {!vehicle.threeDConfig.hasModel ? (
          <p className="price-note mt-3">
            A packaged 3D model is not available for this vehicle. Build & Price still lets you review trims
            and catalog options; the canvas uses a labeled procedural stand-in.
          </p>
        ) : null}

        <div className="mt-12 grid gap-10 lg:grid-cols-2">
          <div>
            <h2 className="text-2xl font-semibold">Trims</h2>
            <ul className="mt-4 divide-y divide-border overflow-hidden rounded-2xl border border-border">
              {vehicle.grades.map((grade) => (
                <li key={grade.id} className="flex items-center justify-between gap-4 p-4">
                  <div>
                    <strong>{grade.name}</strong>
                    <p className="text-sm text-muted">{grade.seating}-passenger · {grade.standardFeatures[0]}</p>
                  </div>
                  <span className="text-sm">{formatUsd(grade.msrp)}*</span>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h2 className="text-2xl font-semibold">Colors</h2>
            <ul className="mt-4 flex flex-wrap gap-3">
              {vehicle.exteriorColors.map((color) => (
                <li key={color.code} className="flex items-center gap-2 text-sm">
                  <span
                    className="inline-block h-7 w-7 rounded-full border border-border"
                    style={{ background: color.hex }}
                    aria-hidden="true"
                  />
                  {color.name}
                </li>
              ))}
            </ul>
            <h2 className="mt-8 text-2xl font-semibold">Highlights</h2>
            <dl className="mt-4 grid grid-cols-2 gap-3 text-sm">
              {vehicle.specs.slice(0, 8).map((spec) => (
                <div key={spec.key} className="rounded-xl border border-border bg-surface p-3">
                  <dt className="text-xs uppercase tracking-widest text-muted">{spec.label}</dt>
                  <dd className="mt-1">
                    {typeof spec.value === "boolean" ? (spec.value ? "Yes" : "No") : spec.value}
                    {spec.unit ? ` ${spec.unit}` : ""}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
        <TrimMatrix vehicle={vehicle} />
        <p className="price-note mt-8">{CATALOG_DISCLAIMER}</p>
      </section>
    </SiteShell>
  );
}
