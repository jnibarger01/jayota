import { Box } from "lucide-react";
import type { LineupModel } from "@/lib/lineup";
import { electrifiedLabel } from "@/lib/lineup";
import { formatUsd, cn } from "@/lib/utils";

export function LineupCard({
  model,
  variant = "overlay",
  selected,
  onOpen,
}: {
  model: LineupModel;
  variant?: "overlay" | "caption" | "scroll";
  selected?: boolean;
  onOpen: (model: LineupModel) => void;
}) {
  const price = model.startingMsrp ? `${formatUsd(model.startingMsrp)}*` : null;
  const eLabel = electrifiedLabel(model.electrified);

  if (variant === "caption" || variant === "scroll") {
    return (
      <button
        type="button"
        onClick={() => onOpen(model)}
        className={cn(
          "group block w-full overflow-hidden rounded-2xl bg-surface text-left",
          variant === "scroll" && "w-64 shrink-0 snap-start",
          selected && "ring-2 ring-accent",
        )}
      >
        <div className="relative">
          <img
            src={model.image.src}
            alt={model.image.alt}
            className="aspect-video w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
          />
          <div className="absolute left-3 top-3 flex flex-wrap gap-1">
            {model.has3d ? (
              <span className="inline-flex items-center gap-1 rounded-full bg-ink/55 px-2 py-1 text-xs text-fg">
                <Box size={12} /> 3D
              </span>
            ) : null}
            {eLabel ? (
              <span className="rounded-full bg-ink/55 px-2 py-1 text-xs text-fg">{eLabel}</span>
            ) : null}
          </div>
        </div>
        <div className="px-4 py-3">
          <h3 className="text-lg font-semibold tracking-tight">{model.name}</h3>
          <p className="mt-0.5 text-sm text-muted">{model.tagline}</p>
          {price ? <p className="mt-2 text-sm text-fg">{price}</p> : null}
        </div>
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={() => onOpen(model)}
      className={cn(
        "group relative block h-28 w-full overflow-hidden rounded-2xl bg-surface-2 text-left",
        selected && "ring-2 ring-accent",
      )}
    >
      <img
        src={model.image.src}
        alt={model.image.alt}
        className="absolute inset-0 h-full w-full object-cover object-[70%_center] transition-transform duration-500 group-hover:scale-[1.03]"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-ink/80 via-ink/35 to-transparent" />
      <div className="absolute inset-0 flex items-center justify-between gap-3 px-5">
        <div className="max-w-[58%]">
          <h3 className="text-xl font-semibold tracking-tight text-fg">{model.name}</h3>
          <p className="mt-0.5 text-sm leading-snug text-fg/75">{model.tagline}</p>
        </div>
        <div className="flex flex-col items-end gap-1 text-right">
          {model.has3d ? (
            <span className="inline-flex items-center gap-1 rounded-full bg-ink/40 px-2 py-1 text-xs text-fg">
              <Box size={12} /> 3D
            </span>
          ) : null}
          {price ? <span className="text-xs text-fg/80">{price}</span> : null}
        </div>
      </div>
    </button>
  );
}
