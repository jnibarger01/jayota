import { Link } from "@tanstack/react-router";
import type { VehicleSummary } from "@/showroom/types/vehicle";
import { formatUsd } from "@/lib/utils";
import { FavoriteButton } from "@/components/vehicles/FavoriteButton";

const BODY: Record<string, string> = {
  suv: "SUV",
  truck: "Truck",
  sedan: "Sedan",
  minivan: "Minivan",
  crossover: "Crossover",
  coupe: "Coupe",
  hatchback: "Hatchback",
};

export function VehicleCard({ vehicle }: { vehicle: VehicleSummary }) {
  const photo = vehicle.thumbnail.url;
  return (
    <article className="group flex flex-col border border-border bg-surface">
      <Link to="/vehicles/$slug" params={{ slug: vehicle.slug }} className="block">
        <div className="relative aspect-[16/10] overflow-hidden bg-surface-2">
          {photo ? (
            <img
              src={photo}
              alt={vehicle.thumbnail.alt}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
            />
          ) : (
            <div className="flex h-full items-end bg-gradient-to-br from-surface-3 to-bg p-6">
              <p className="font-display text-5xl tracking-wide text-fg/80">{vehicle.model}</p>
            </div>
          )}
        </div>
        <div className="flex items-start justify-between gap-3 p-5">
          <div>
            <p className="text-[10px] uppercase tracking-[0.2em] text-muted">
              {BODY[vehicle.bodyStyle] ?? vehicle.bodyStyle}
            </p>
            <h3 className="mt-1 font-display text-2xl tracking-wide">
              {vehicle.year} {vehicle.model}
            </h3>
            <p className="mt-2 text-sm text-muted">Starting at {formatUsd(vehicle.startingMsrp)}*</p>
          </div>
        </div>
      </Link>
      <div className="mt-auto flex items-center justify-between border-t border-border px-5 py-3">
        <Link
          to="/vehicles/$slug"
          params={{ slug: vehicle.slug }}
          className="text-xs uppercase tracking-[0.16em] text-fg"
        >
          View details
        </Link>
        <FavoriteButton slug={vehicle.slug} />
      </div>
    </article>
  );
}
