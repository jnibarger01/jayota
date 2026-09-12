import { hotspotsFor, type Hotspot } from "@/lib/hotspots";
import type { VehicleSceneController } from "@/showroom/three/sceneController";

export function FeatureExplorer({
  slug,
  controller,
  onSelect,
}: {
  slug: string;
  controller: VehicleSceneController | null;
  onSelect: (hotspot: Hotspot) => void;
}) {
  const spots = hotspotsFor(slug);
  return (
    <div className="feature-explorer">
      <p className="text-xs uppercase tracking-widest">Feature explorer</p>
      <div className="mt-2 flex flex-wrap gap-2">
        {spots.map((spot) => {
          const present = controller?.hasPart(spot.sceneId) ?? false;
          return (
            <button
              key={spot.id}
              type="button"
              className="min-h-11 rounded-full border border-border px-3 text-xs"
              onClick={() => {
                if (present) controller?.selectPart(spot.sceneId);
                onSelect(spot);
              }}
            >
              {spot.label}
              {present ? "" : " · still"}
            </button>
          );
        })}
      </div>
    </div>
  );
}
