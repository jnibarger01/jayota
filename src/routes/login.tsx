import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { GROK_PROVIDERS, authEnabled, authClient, signIn } from "@/lib/auth/client";
import { SiteShell } from "@/components/layout/SiteShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Field } from "@/components/forms/IntakeForm";

export const Route = createFileRoute("/login")({ component: Login });

function Login() {
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const onEmail = async (event: FormEvent) => {
    event.preventDefault();
    setBusy(true);
    setError(null);
    try {
      if (mode === "signup") {
        const result = await authClient.signUp.email({ email, password, name });
        if (result.error) throw new Error(result.error.message ?? "Could not create account.");
      } else {
        const result = await authClient.signIn.email({ email, password });
        if (result.error) throw new Error(result.error.message ?? "Could not sign in.");
      }
      window.location.assign("/account");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Sign-in failed.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <SiteShell>
      <section className="mx-auto grid min-h-[60vh] max-w-md place-items-center px-4 py-16">
        <div className="w-full border border-border bg-surface p-8">
          <h1 className="font-display text-3xl tracking-wide">Sign in</h1>
          <p className="mt-2 text-sm text-muted">Save vehicles and builds to your Hendrick Toyota Merriam account.</p>
          {authEnabled ? (
            <div className="mt-6 space-y-3">
              {GROK_PROVIDERS.map((p) => (
                <Button
                  key={p.providerId}
                  type="button"
                  variant="secondary"
                  className="w-full"
                  onClick={() => signIn(p.providerId, { callbackURL: "/account" })}
                >
                  Continue with {p.label}
                </Button>
              ))}
              <div className="relative py-3 text-center text-xs uppercase tracking-[0.18em] text-muted">
                or email
              </div>
              <form className="space-y-4" onSubmit={onEmail}>
                {mode === "signup" ? (
                  <Field id="name" label="Name">
                    <Input id="name" value={name} onChange={(e) => setName(e.target.value)} />
                  </Field>
                ) : null}
                <Field id="email" label="Email">
                  <Input id="email" type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                </Field>
                <Field id="password" label="Password">
                  <Input
                    id="password"
                    type="password"
                    autoComplete={mode === "signup" ? "new-password" : "current-password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </Field>
                {error ? <p className="text-sm text-accent">{error}</p> : null}
                <Button type="submit" className="w-full" disabled={busy}>
                  {busy ? "Please wait…" : mode === "signup" ? "Create account" : "Sign in"}
                </Button>
              </form>
              <button
                type="button"
                className="w-full text-sm text-muted"
                onClick={() => setMode((m) => (m === "signin" ? "signup" : "signin"))}
              >
                {mode === "signin" ? "Need an account? Create one" : "Already have an account? Sign in"}
              </button>
            </div>
          ) : (
            <p className="mt-6 text-sm text-muted">Sign-in is disabled.</p>
          )}
          <p className="mt-6 text-xs text-muted">
            By continuing you agree to the <Link to="/privacy">privacy notice</Link>.
          </p>
        </div>
      </section>
    </SiteShell>
  );
}
