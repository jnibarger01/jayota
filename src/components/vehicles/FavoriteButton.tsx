import { useEffect, useState } from "react";
import { Heart } from "lucide-react";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { listSavedVehicles, toggleSavedVehicle } from "@/lib/server/saved";
import { Link } from "@tanstack/react-router";

export function FavoriteButton({ slug }: { slug: string }) {
  const { user, isPending } = useCurrentUserState();
  const [saved, setSaved] = useState(false);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!user) {
      setSaved(false);
      return;
    }
    let cancelled = false;
    void listSavedVehicles()
      .then((rows) => {
        if (!cancelled) setSaved(rows.some((row) => row.vehicle_slug === slug));
      })
      .catch(() => {
        if (!cancelled) setSaved(false);
      });
    return () => {
      cancelled = true;
    };
  }, [user, slug]);

  if (isPending) {
    return <span className="inline-block h-8 w-8" aria-hidden="true" />;
  }

  if (!user) {
    return (
      <Link to="/login" className="inline-flex h-11 w-11 items-center justify-center text-muted" aria-label="Sign in to save">
        <Heart size={18} />
      </Link>
    );
  }

  return (
    <button
      type="button"
      className="inline-flex h-11 w-11 items-center justify-center text-fg"
      aria-pressed={saved}
      aria-label={saved ? "Remove from saved vehicles" : "Save vehicle"}
      disabled={busy}
      onClick={() => {
        setBusy(true);
        void toggleSavedVehicle({ data: { slug } })
          .then((result) => setSaved(result.saved))
          .finally(() => setBusy(false));
      }}
    >
      <Heart size={18} fill={saved ? "currentColor" : "none"} />
    </button>
  );
}
