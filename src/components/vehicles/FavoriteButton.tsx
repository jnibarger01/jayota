import { useEffect, useState } from "react";
import { Heart } from "lucide-react";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { listSavedVehicles, toggleSavedVehicle } from "@/lib/server/saved";
import { toggleLocalFavorite, useShopper } from "@/lib/shopper";

export function FavoriteButton({ slug }: { slug: string }) {
  const { user, isPending } = useCurrentUserState();
  const shopper = useShopper();
  const [saved, setSaved] = useState(false);
  const [busy, setBusy] = useState(false);
  const localOn = shopper.favorites.includes(slug);

  useEffect(() => {
    if (!user) {
      setSaved(localOn);
      return;
    }
    let cancelled = false;
    void listSavedVehicles()
      .then((rows) => {
        if (!cancelled) setSaved(rows.some((row) => row.vehicle_slug === slug));
      })
      .catch(() => {
        if (!cancelled) setSaved(localOn);
      });
    return () => {
      cancelled = true;
    };
  }, [user, slug, localOn]);

  if (isPending) {
    return <span className="inline-block h-8 w-8" aria-hidden="true" />;
  }

  const on = user ? saved : localOn;

  return (
    <button
      type="button"
      className="inline-flex h-11 w-11 items-center justify-center text-fg"
      aria-pressed={on}
      aria-label={on ? "Remove from saved vehicles" : "Save vehicle"}
      disabled={busy}
      onClick={() => {
        toggleLocalFavorite(slug);
        if (!user) return;
        setBusy(true);
        void toggleSavedVehicle({ data: { slug } })
          .then((result) => setSaved(result.saved))
          .finally(() => setBusy(false));
      }}
    >
      <Heart size={18} fill={on ? "currentColor" : "none"} className={on ? "text-accent" : ""} />
    </button>
  );
}
