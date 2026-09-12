import { estimateMonthlyPayment } from "./validators/forms.ts";

export const MODELED_APR = 6.9;
export const MODELED_TERM = 60;
export const MODELED_DOWN_RATIO = 0.1;

export interface PaymentScenario {
  id: string;
  name: string;
  price: number;
  downPayment: number;
  tradeEquity: number;
  apr: number;
  termMonths: number;
  taxesFees: number;
  mode: "finance" | "cash";
}

export interface PaymentBreakdown {
  amountFinanced: number;
  monthly: number;
  totalInterest: number;
  totalPaid: number;
}

export function modeledIllustration(msrp: number): PaymentScenario {
  const down = Math.round(msrp * MODELED_DOWN_RATIO);
  return {
    id: "modeled",
    name: "Modeled estimate",
    price: msrp,
    downPayment: down,
    tradeEquity: 0,
    apr: MODELED_APR,
    termMonths: MODELED_TERM,
    taxesFees: 0,
    mode: "finance",
  };
}

export function breakdown(scenario: PaymentScenario): PaymentBreakdown {
  const net = Math.max(0, scenario.price + scenario.taxesFees - scenario.downPayment - scenario.tradeEquity);
  if (scenario.mode === "cash") {
    return { amountFinanced: 0, monthly: 0, totalInterest: 0, totalPaid: scenario.price + scenario.taxesFees };
  }
  const monthly = estimateMonthlyPayment(net, scenario.apr, scenario.termMonths);
  const totalPaid = monthly * scenario.termMonths + scenario.downPayment;
  const totalInterest = Math.max(0, monthly * scenario.termMonths - net);
  return { amountFinanced: net, monthly, totalInterest, totalPaid };
}

export function defaultScenarios(price: number): PaymentScenario[] {
  const base = modeledIllustration(price);
  return [
    { ...base, id: "a", name: "Scenario A" },
    {
      ...base,
      id: "b",
      name: "Scenario B · 36 mo",
      termMonths: 36,
      downPayment: Math.round(price * 0.2),
    },
    {
      ...base,
      id: "c",
      name: "Scenario C · cash",
      mode: "cash",
      downPayment: price,
      apr: 0,
      termMonths: 1,
    },
  ];
}
