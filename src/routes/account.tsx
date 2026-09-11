import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteShell } from "@/components/layout/SiteShell";
import { RedirectToSignIn, UserButton } from "@/lib/auth/gates";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { DEALER } from "@/lib/dealer";
import { pageHead } from "@/lib/seo";

export const Route = createFileRoute("/account")({
  head: () => pageHead("Account", "Saved vehicles, configurations, and account controls."),
  component: AccountPage,
});

function AccountPage() {
  const { user, isPending } = useCurrentUserState();
  if (isPending) {
    return (
      <SiteShell>
        <div className="mx-auto max-w-xl px-4 py-24 text-sm text-muted">Loading account…</div>
      </SiteShell>
    );
  }
  if (!user) return <RedirectToSignIn />;

  return (
    <SiteShell>
      <section className="mx-auto max-w-xl px-4 py-16 md:px-6">
        <h1 className="font-display text-5xl tracking-wide">Account</h1>
        <p className="mt-4 text-sm text-muted">{user.displayName ?? user.primaryEmail ?? "Signed in"}</p>
        <ul className="mt-8 space-y-3 text-sm">
          <li className="border border-border bg-surface p-4">
            <Link to="/owners/saved">Saved vehicles & configurations</Link>
          </li>
          <li className="border border-border bg-surface p-4">
            <Link to="/owners/service">Service requests</Link>
          </li>
          <li className="border border-border bg-surface p-4">
            <Link to="/privacy">Privacy & data</Link>
          </li>
        </ul>
        <p className="mt-8 text-sm text-muted">
          To delete your account and stored requests, sign out is not enough. Call {DEALER.phone.general} or
          write through the <Link to="/dealership" className="underline">contact form</Link> and include the
          email on this account.
        </p>
        <div className="mt-8">
          <UserButton />
        </div>
      </section>
    </SiteShell>
  );
}
