import { breakdown, modeledIllustration } from "@/lib/finance-lab";
import { formatUsd } from "@/lib/utils";

export function PaymentChip({ msrp }: { msrp: number }) {
  const monthly = breakdown(modeledIllustration(msrp)).monthly;
  return (
    <p className="text-xs text-muted">
      {formatUsd(monthly)}/mo modeled at 6.9% APR · 60 mo · 10% down — not a dealer offer.
    </p>
  );
}
