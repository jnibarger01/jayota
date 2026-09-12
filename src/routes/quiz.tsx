import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { SiteShell } from "@/components/layout/SiteShell";
import { Button } from "@/components/ui/button";
import { DEFAULT_QUIZ, rankQuiz, type QuizAnswers } from "@/lib/quiz";
import { formatUsd } from "@/lib/utils";
import { lineupConfigure } from "@/lib/lineup";
import { patchWorkspace } from "@/lib/shopper";
import { pageHead } from "@/lib/seo";
import { toggleCompareSlug } from "@/lib/compare-tray";

export const Route = createFileRoute("/quiz")({
  head: () =>
    pageHead("Find My Toyota", "Answer a few questions. Matches use this showroom’s lineup and catalog — not invented specs."),
  component: QuizPage,
});

function QuizPage() {
  const [answers, setAnswers] = useState<QuizAnswers>(DEFAULT_QUIZ);
  const [submitted, setSubmitted] = useState(false);
  const results = useMemo(() => (submitted ? rankQuiz(answers) : []), [submitted, answers]);

  return (
    <SiteShell>
      <section className="mx-auto max-w-3xl px-4 py-12 md:px-6 md:py-16">
        <p className="text-xs uppercase tracking-[0.22em] text-muted">Matcher</p>
        <h1 className="mt-2 text-4xl font-semibold tracking-tight md:text-5xl">Find My Toyota</h1>
        <p className="mt-3 text-sm text-muted">
          Scores use published starting MSRP, body style, electrified flags, and catalog specs when they exist.
          Missing towing, cargo, or AWD data is labeled — never invented.
        </p>

        <form
          className="mt-8 grid gap-5"
          onSubmit={(e) => {
            e.preventDefault();
            setSubmitted(true);
          }}
        >
          <label className="grid gap-2 text-sm">
            Target budget
            <input
              type="range"
              min={20000}
              max={90000}
              step={1000}
              value={answers.budget}
              onChange={(e) => setAnswers((a) => ({ ...a, budget: Number(e.target.value) }))}
            />
            <span>{formatUsd(answers.budget)}</span>
          </label>
          <label className="grid gap-2 text-sm">
            Monthly payment target (optional)
            <input
              type="range"
              min={0}
              max={1500}
              step={25}
              value={answers.monthly ?? 0}
              onChange={(e) => {
                const value = Number(e.target.value);
                setAnswers((a) => ({ ...a, monthly: value === 0 ? null : value }));
              }}
            />
            <span>
              {answers.monthly
                ? `${formatUsd(answers.monthly)}/mo modeled target — not a dealer offer`
                : "No monthly cap"}
            </span>
          </label>
          <fieldset className="grid gap-2">
            <legend className="text-sm">Passengers</legend>
            <div className="flex flex-wrap gap-2">
              {(["1-2", "3-5", "6+"] as const).map((value) => (
                <button
                  key={value}
                  type="button"
                  className={`min-h-11 rounded-full px-4 text-sm ${answers.passengers === value ? "bg-fg text-bg" : "border border-border"}`}
                  onClick={() => setAnswers((a) => ({ ...a, passengers: value }))}
                >
                  {value}
                </button>
              ))}
            </div>
          </fieldset>
          <fieldset className="grid gap-2">
            <legend className="text-sm">Cargo</legend>
            <div className="flex flex-wrap gap-2">
              {(["light", "medium", "heavy"] as const).map((value) => (
                <button
                  key={value}
                  type="button"
                  className={`min-h-11 rounded-full px-4 text-sm capitalize ${answers.cargo === value ? "bg-fg text-bg" : "border border-border"}`}
                  onClick={() => setAnswers((a) => ({ ...a, cargo: value }))}
                >
                  {value}
                </button>
              ))}
            </div>
          </fieldset>
          <fieldset className="grid gap-2">
            <legend className="text-sm">Commute</legend>
            <div className="flex flex-wrap gap-2">
              {(["short", "medium", "long"] as const).map((value) => (
                <button
                  key={value}
                  type="button"
                  className={`min-h-11 rounded-full px-4 text-sm capitalize ${answers.commute === value ? "bg-fg text-bg" : "border border-border"}`}
                  onClick={() => setAnswers((a) => ({ ...a, commute: value }))}
                >
                  {value}
                </button>
              ))}
            </div>
          </fieldset>
          <fieldset className="grid gap-2">
            <legend className="text-sm">Fuel preference</legend>
            <div className="flex flex-wrap gap-2">
              {(["any", "gas", "hybrid", "electric"] as const).map((value) => (
                <button
                  key={value}
                  type="button"
                  className={`min-h-11 rounded-full px-4 text-sm capitalize ${answers.fuel === value ? "bg-fg text-bg" : "border border-border"}`}
                  onClick={() => setAnswers((a) => ({ ...a, fuel: value }))}
                >
                  {value}
                </button>
              ))}
            </div>
          </fieldset>
          <fieldset className="grid gap-2">
            <legend className="text-sm">AWD / 4WD</legend>
            <div className="flex flex-wrap gap-2">
              {(["any", "yes", "no"] as const).map((value) => (
                <button
                  key={value}
                  type="button"
                  className={`min-h-11 rounded-full px-4 text-sm capitalize ${answers.awd === value ? "bg-fg text-bg" : "border border-border"}`}
                  onClick={() => setAnswers((a) => ({ ...a, awd: value }))}
                >
                  {value}
                </button>
              ))}
            </div>
          </fieldset>
          <fieldset className="grid gap-2">
            <legend className="text-sm">Towing</legend>
            <div className="flex flex-wrap gap-2">
              {(["none", "light", "heavy"] as const).map((value) => (
                <button
                  key={value}
                  type="button"
                  className={`min-h-11 rounded-full px-4 text-sm capitalize ${answers.towing === value ? "bg-fg text-bg" : "border border-border"}`}
                  onClick={() => setAnswers((a) => ({ ...a, towing: value }))}
                >
                  {value}
                </button>
              ))}
            </div>
          </fieldset>
          <fieldset className="grid gap-2">
            <legend className="text-sm">Off-road</legend>
            <div className="flex flex-wrap gap-2">
              {(["none", "some", "serious"] as const).map((value) => (
                <button
                  key={value}
                  type="button"
                  className={`min-h-11 rounded-full px-4 text-sm capitalize ${answers.offroad === value ? "bg-fg text-bg" : "border border-border"}`}
                  onClick={() => setAnswers((a) => ({ ...a, offroad: value }))}
                >
                  {value}
                </button>
              ))}
            </div>
          </fieldset>
          <label className="flex min-h-11 items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={answers.performance}
              onChange={(e) => setAnswers((a) => ({ ...a, performance: e.target.checked }))}
            />
            Prefer GR performance nameplates
          </label>
          <fieldset className="grid gap-2">
            <legend className="text-sm">Technology in this showroom</legend>
            <div className="flex flex-wrap gap-2">
              {(["nice", "important"] as const).map((value) => (
                <button
                  key={value}
                  type="button"
                  className={`min-h-11 rounded-full px-4 text-sm ${answers.tech === value ? "bg-fg text-bg" : "border border-border"}`}
                  onClick={() => setAnswers((a) => ({ ...a, tech: value }))}
                >
                  {value === "nice" ? "Nice to have" : "Prefer 3D / catalog depth"}
                </button>
              ))}
            </div>
          </fieldset>
          <Button type="submit">Show matches</Button>
        </form>

        {submitted ? (
          <ol className="mt-12 grid gap-6">
            {results.map((match, index) => (
              <li key={match.model.slug} className="overflow-hidden rounded-2xl border border-border bg-surface">
                <img src={match.model.image.src} alt={match.model.image.alt} className="aspect-video w-full object-cover" />
                <div className="p-5">
                  <p className="text-xs uppercase tracking-widest text-muted">Rank {index + 1} · score {match.total}</p>
                  <h2 className="mt-1 text-2xl font-semibold">{match.model.name}</h2>
                  <p className="mt-1 text-sm text-muted">{match.model.tagline}</p>
                  <ul className="mt-4 space-y-2 text-sm">
                    {match.factors.slice(0, 5).map((factor) => (
                      <li key={factor.label}>
                        <strong>
                          {factor.label} ({factor.score > 0 ? "+" : ""}
                          {factor.score})
                        </strong>
                        <span className="text-muted"> — {factor.why}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="mt-5 flex flex-wrap gap-2">
                    <Link to="/vehicles/$slug" params={{ slug: match.model.slug }} onClick={() => patchWorkspace({ slug: match.model.slug })}>
                      <Button>Model details</Button>
                    </Link>
                    {lineupConfigure(match.model).kind !== "none" ? (
                      <Link to="/vehicles/$slug/configure" params={{ slug: match.model.slug }}>
                        <Button variant="secondary">{lineupConfigure(match.model).label}</Button>
                      </Link>
                    ) : null}
                    <Link to="/shop/inventory" search={{ model: match.model.name }}>
                      <Button variant="secondary">Inventory status</Button>
                    </Link>
                    <button type="button" className="min-h-11 px-3 text-sm" onClick={() => toggleCompareSlug(match.model.slug)}>
                      Add to compare
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ol>
        ) : null}
      </section>
    </SiteShell>
  );
}
