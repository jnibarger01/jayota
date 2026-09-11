import type { ErrorComponentProps } from "@tanstack/react-router";
import { Link } from "@tanstack/react-router";
import { TriangleAlert } from "lucide-react";

const FALLBACK_MESSAGE = "An unexpected error occurred. Try reloading the page.";

function errorMessage(error: unknown): string {
  if (error instanceof Error && error.message) return error.message;
  if (typeof error === "string" && error) return error;
  return FALLBACK_MESSAGE;
}

export function AppErrorComponent({ error }: ErrorComponentProps) {
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
      <h1 className="text-lg font-semibold">Something went wrong</h1>
      <p className="max-w-md text-sm break-words text-muted">
        {errorMessage(error)}
      </p>
      <Link to="/" className="mt-4 text-sm underline">
        Return home
      </Link>
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
