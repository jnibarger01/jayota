import { LineupCard } from "@/components/vehicles/LineupCard";
import type { LineupModel } from "@/lib/lineup";

export function ModelScroller({
  models,
  selected,
  onOpen,
}: {
  models: LineupModel[];
  selected: string[];
  onOpen: (model: LineupModel) => void;
}) {
  if (models.length === 0) {
    return <p className="mt-10 text-sm text-muted">No vehicles in this category yet.</p>;
  }

  return (
    <div
      className="mt-6 flex gap-4 overflow-x-auto pb-2 snap-x snap-mandatory [scrollbar-width:thin]"
      role="list"
      aria-label="Vehicle lineup"
    >
      {models.map((model) => (
        <div key={model.slug} role="listitem">
          <LineupCard
            model={model}
            variant="scroll"
            selected={selected.includes(model.slug)}
            onOpen={onOpen}
          />
        </div>
      ))}
    </div>
  );
}
