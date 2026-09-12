import { setA11yMode, setLocale, useShopper } from "@/lib/shopper";
import { COPY } from "@/lib/i18n";

export function LocaleControls({ compact = false }: { compact?: boolean }) {
  const shopper = useShopper();
  const t = COPY[shopper.locale];
  return (
    <div className={compact ? "flex flex-col gap-1" : "flex items-center gap-2"}>
      <button
        type="button"
        className="min-h-11 px-3 text-sm"
        onClick={() => setLocale(shopper.locale === "en" ? "es" : "en")}
      >
        {shopper.locale === "en" ? t.spanish : t.english}
      </button>
      <button
        type="button"
        className="min-h-11 px-3 text-sm"
        aria-pressed={shopper.a11yMode}
        onClick={() => setA11yMode(!shopper.a11yMode)}
      >
        {t.a11y}
      </button>
    </div>
  );
}
