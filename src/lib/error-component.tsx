import type { ErrorComponentProps } from "@tanstack/react-router";
import { Link, useRouter } from "@tanstack/react-router";
import { TriangleAlert } from "lucide-react";
import { displayErrorMessage } from "@/lib/error-message";

export function AppErrorComponent({ error, reset }: ErrorComponentProps) {
  const router = useRouter();
  const retry = () => {
    reset();
    void router.invalidate();
  };
  return (
    <main
      className={
        "flex min-h-screen flex-col items-center justify-center gap-3 px-6 text-center " +
        "bg-bg text-fg"
      }
    >
      <span className="text-accent" aria-hidden="true">
        <TriangleAlert className="size-10" strokeWidth={2} />
      </span>
      <div role="alert" className="flex flex-col items-center gap-3">
        <h1 className="text-lg font-semibold">Something went wrong</h1>
        <p className="max-w-md text-sm break-words text-muted">{displayErrorMessage(error)}</p>
      </div>
      <div className="mt-4 flex items-center gap-4">
        <button type="button" onClick={retry} className="min-h-11 bg-accent px-5 py-3 text-sm text-accent-fg">
          Try again
        </button>
        <Link to="/" className="text-sm underline">
          Return home
        </Link>
      </div>
    </main>
  );
}

export function NotFoundComponent() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-4 bg-bg px-6 text-center text-fg">
      <p className="text-xs uppercase tracking-[0.22em] text-muted">404</p>
      <h1 className="font-display text-5xl tracking-wide">Page not found</h1>
      <p className="max-w-md text-sm text-muted">
        That URL is not part of the Hendrick Toyota Merriam digital showroom.
      </p>
      <Link to="/" className="mt-2 min-h-11 bg-accent px-5 py-3 text-sm text-accent-fg">
        Return home
      </Link>
    </main>
  );
}
