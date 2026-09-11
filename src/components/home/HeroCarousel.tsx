import { useEffect, useRef, useState } from "react";
import { Link } from "@tanstack/react-router";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { featuredLineup, lineupConfigure, type LineupModel } from "@/lib/lineup";
import { cn } from "@/lib/utils";

export function HeroCarousel({
  onQuickView,
}: {
  onQuickView: (model: LineupModel) => void;
}) {
  const slides = featuredLineup();
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const startX = useRef<number | null>(null);
  const current = slides[index] ?? slides[0];

  useEffect(() => {
    if (paused || slides.length < 2) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;
    const id = window.setInterval(() => {
      setIndex((value) => (value + 1) % slides.length);
    }, 7000);
    return () => window.clearInterval(id);
  }, [paused, slides.length]);

  if (!current) return null;

  const hero = current.hero ?? current.image;
  const configure = lineupConfigure(current);

  return (
    <section
      className="relative min-h-[100svh] overflow-hidden md:min-h-[min(32rem,calc(100svh-4rem))]"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onTouchStart={(event) => {
        startX.current = event.changedTouches[0]?.clientX ?? null;
      }}
      onTouchEnd={(event) => {
        if (startX.current == null) return;
        const dx = (event.changedTouches[0]?.clientX ?? startX.current) - startX.current;
        if (dx > 40) setIndex((value) => (value - 1 + slides.length) % slides.length);
        if (dx < -40) setIndex((value) => (value + 1) % slides.length);
        startX.current = null;
      }}
    >
      {hero.mobileSrc ? (
        <img
          key={`${current.slug}-m`}
          src={hero.mobileSrc}
          alt={hero.alt}
          className="absolute inset-0 h-full w-full object-cover object-center md:hidden"
        />
      ) : (
        <img
          key={`${current.slug}-m`}
          src={hero.src}
          alt={hero.alt}
          className="absolute inset-0 h-full w-full object-cover object-center md:hidden"
        />
      )}
      <img
        key={`${current.slug}-d`}
        src={hero.src}
        alt=""
        className="absolute inset-0 hidden h-full w-full object-cover object-[70%_center] md:block"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-ink/55 via-transparent to-ink/80 md:bg-gradient-to-r md:from-ink/75 md:via-ink/30 md:to-transparent" />

      <div className="relative mx-auto flex min-h-[100svh] max-w-7xl flex-col px-5 pb-[calc(5.5rem+env(safe-area-inset-bottom))] pt-[calc(4.25rem+env(safe-area-inset-top))] md:min-h-[min(32rem,calc(100svh-4rem))] md:justify-center md:px-6 md:pb-16 md:pt-12">
        <div className="max-w-xl">
          <h1 className="text-balance text-4xl font-light leading-tight tracking-tight text-fg md:text-6xl">
            Move a
            <br />
            Better Tomorrow
          </h1>
          <p className="mt-3 max-w-sm text-pretty text-base leading-relaxed text-fg/75">
            Discover a smarter, cleaner way to move forward.
          </p>
        </div>

        <div className="mt-auto max-w-xl md:mt-10">
          <p className="text-xs font-medium uppercase tracking-widest text-fg/70">
            {current.year} Toyota
          </p>
          <p className="mt-1 text-5xl font-semibold tracking-tight text-fg md:text-6xl">{current.name}</p>
          <p className="mt-2 text-sm text-fg/75">{current.tagline}</p>
          <div className="mt-7 flex flex-wrap gap-3">
            <button
              type="button"
              className="inline-flex min-h-12 items-center gap-2 rounded-full bg-pill px-6 text-sm font-medium text-pill-fg hover:opacity-90"
              onClick={() => onQuickView(current)}
            >
              Explore {current.name} <ChevronRight size={16} />
            </button>
            {configure.kind !== "none" ? (
              <Link
                to="/vehicles/$slug/configure"
                params={{ slug: current.slug }}
                className="inline-flex min-h-12 items-center gap-2 rounded-full border border-fg/35 px-6 text-sm font-medium text-fg hover:bg-fg/10"
              >
                {configure.label}
              </Link>
            ) : null}
          </div>
        </div>

        <div className="mt-8 flex items-center justify-between gap-4">
          <div className="flex gap-1.5" role="tablist" aria-label="Featured vehicles">
            {slides.map((slide, slideIndex) => (
              <button
                key={slide.slug}
                type="button"
                role="tab"
                aria-selected={slideIndex === index}
                aria-label={slide.name}
                className={cn(
                  "h-1 rounded-full transition-all duration-200",
                  slideIndex === index ? "w-6 bg-fg" : "w-1.5 bg-fg/35",
                )}
                onClick={() => setIndex(slideIndex)}
              />
            ))}
          </div>
          <div className="hidden gap-2 md:flex">
            <button
              type="button"
              className="grid h-11 w-11 place-items-center rounded-full border border-fg/25 text-fg"
              aria-label="Previous vehicle"
              onClick={() => setIndex((value) => (value - 1 + slides.length) % slides.length)}
            >
              <ChevronLeft size={18} />
            </button>
            <button
              type="button"
              className="grid h-11 w-11 place-items-center rounded-full border border-fg/25 text-fg"
              aria-label="Next vehicle"
              onClick={() => setIndex((value) => (value + 1) % slides.length)}
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
