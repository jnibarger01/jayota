export function ToyotaMark({ className = "toyota-mark" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 72 48" aria-hidden="true" focusable="false">
      <ellipse cx="36" cy="28" rx="30" ry="16" fill="none" stroke="currentColor" strokeWidth="2.4" />
      <ellipse cx="36" cy="24" rx="16" ry="20" fill="none" stroke="currentColor" strokeWidth="2.4" />
      <ellipse cx="36" cy="26" rx="8" ry="12" fill="none" stroke="currentColor" strokeWidth="2.4" />
    </svg>
  );
}
