import { LINEUP_TABS, type LineupTab } from "@/lib/lineup";
import { cn } from "@/lib/utils";

export function LineupTabs({
  value,
  onChange,
}: {
  value: LineupTab;
  onChange: (tab: LineupTab) => void;
}) {
  return (
    <div
      className="flex gap-5 overflow-x-auto border-b border-border [scrollbar-width:none] md:gap-6 [&::-webkit-scrollbar]:hidden"
      role="tablist"
      aria-label="Vehicle categories"
    >
      {LINEUP_TABS.map((item) => {
        const selected = value === item.id;
        return (
          <button
            key={item.id}
            type="button"
            role="tab"
            aria-selected={selected}
            className={cn(
              "relative min-h-11 shrink-0 pb-3 text-sm",
              selected ? "text-fg" : "text-muted",
            )}
            onClick={() => onChange(item.id)}
          >
            {item.label}
            {selected ? (
              <span className="absolute bottom-0 left-0 h-0.5 w-5 bg-accent" />
            ) : null}
          </button>
        );
      })}
    </div>
  );
}
