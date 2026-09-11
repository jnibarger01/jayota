import { useState, type FormEvent, type ReactNode } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

export function Field({
  id,
  label,
  error,
  children,
}: {
  id: string;
  label: string;
  error?: string;
  children: ReactNode;
}) {
  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
      {children}
      {error ? (
        <p id={`${id}-error`} className="text-sm text-accent" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}

export function ContactFields({
  prefix,
  values,
  errors,
  onChange,
}: {
  prefix: string;
  values: { name: string; email: string; phone: string };
  errors: Partial<Record<"name" | "email" | "phone", string>>;
  onChange: (field: "name" | "email" | "phone", value: string) => void;
}) {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Field id={`${prefix}-name`} label="Name *" error={errors.name}>
        <Input
          id={`${prefix}-name`}
          name="name"
          autoComplete="name"
          value={values.name}
          aria-invalid={Boolean(errors.name)}
          onChange={(e) => onChange("name", e.target.value)}
        />
      </Field>
      <Field id={`${prefix}-email`} label="Email *" error={errors.email}>
        <Input
          id={`${prefix}-email`}
          name="email"
          type="email"
          autoComplete="email"
          value={values.email}
          aria-invalid={Boolean(errors.email)}
          onChange={(e) => onChange("email", e.target.value)}
        />
      </Field>
      <Field id={`${prefix}-phone`} label="Phone" error={errors.phone}>
        <Input
          id={`${prefix}-phone`}
          name="phone"
          type="tel"
          autoComplete="tel"
          value={values.phone}
          aria-invalid={Boolean(errors.phone)}
          onChange={(e) => onChange("phone", e.target.value)}
        />
      </Field>
    </div>
  );
}

export function FormStatus({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <div className="border border-border bg-surface p-6" role="status" aria-live="polite">
      <h2 className="font-display text-2xl">{title}</h2>
      <div className="mt-3 space-y-2 text-sm text-muted">{children}</div>
    </div>
  );
}

export function SubmitBar({ busy, label }: { busy: boolean; label: string }) {
  return (
    <Button type="submit" disabled={busy}>
      {busy ? "Sending…" : label}
    </Button>
  );
}

export function preventInvalid(event: FormEvent<HTMLFormElement>, ok: boolean) {
  if (!ok) event.preventDefault();
}
