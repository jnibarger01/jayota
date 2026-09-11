/**
 * OffersProvider — adapter over a regional incentives feed.
 * Fail closed when no documented provider is configured. Never invent APR / lease / rebate figures.
 */
export type OffersStatus = "unavailable" | "configured";

export interface OfferRecord {
  id: string;
  title: string;
  summary: string;
  applicableModels: string[];
  startsOn: string;
  endsOn: string;
  disclosure: string;
  region: string;
}

export interface OffersProvider {
  readonly name: string;
  status(): OffersStatus;
  listActive(asOf: Date): Promise<OfferRecord[]>;
}

class UnconfiguredOffersProvider implements OffersProvider {
  readonly name = "unconfigured";
  status(): OffersStatus {
    return "unavailable";
  }
  async listActive(): Promise<OfferRecord[]> {
    return [];
  }
}

let singleton: OffersProvider | null = null;

export function getOffersProvider(): OffersProvider {
  singleton ??= new UnconfiguredOffersProvider();
  return singleton;
}
