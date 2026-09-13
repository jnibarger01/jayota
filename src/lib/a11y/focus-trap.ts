import { useEffect, type RefObject } from "react";

const FOCUSABLE_SELECTOR = [
  "a[href]",
  "button:not([disabled])",
  "input:not([disabled]):not([type='hidden'])",
  "select:not([disabled])",
  "textarea:not([disabled])",
  "[tabindex]:not([tabindex='-1'])",
].join(",");

export function getFocusableElements(root: ParentNode): HTMLElement[] {
  return Array.from(root.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR)).filter(
    (el) => !el.hasAttribute("disabled") && el.getAttribute("aria-hidden") !== "true",
  );
}

/**
 * Keep Tab / Shift+Tab cycling inside `root` while active.
 * Returns a cleanup function (detach listener + restore prior focus).
 */
export function attachFocusTrap(root: HTMLElement): () => void {
  const previouslyFocused =
    document.activeElement instanceof HTMLElement ? document.activeElement : null;

  const focusables = getFocusableElements(root);
  const initial = focusables[0] ?? root;
  if (!root.hasAttribute("tabindex")) {
    root.tabIndex = -1;
  }
  initial.focus();

  const onKeyDown = (event: KeyboardEvent) => {
    if (event.key !== "Tab") return;
    const items = getFocusableElements(root);
    if (items.length === 0) {
      event.preventDefault();
      root.focus();
      return;
    }
    const first = items[0]!;
    const last = items[items.length - 1]!;
    const active = document.activeElement;
    if (event.shiftKey) {
      if (active === first || active === root) {
        event.preventDefault();
        last.focus();
      }
    } else if (active === last) {
      event.preventDefault();
      first.focus();
    }
  };

  root.addEventListener("keydown", onKeyDown);
  return () => {
    root.removeEventListener("keydown", onKeyDown);
    previouslyFocused?.focus();
  };
}

/** React helper: trap focus while `enabled` and the ref is mounted. */
export function useFocusTrap(
  ref: RefObject<HTMLElement | null>,
  enabled: boolean,
) {
  useEffect(() => {
    if (!enabled) return;
    const node = ref.current;
    if (!node) return;
    return attachFocusTrap(node);
  }, [ref, enabled]);
}
