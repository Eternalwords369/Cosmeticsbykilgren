import { COMMISSION_VAT_PERCENT, type PricingPlan } from "@/lib/engine/plans";

export type SettledShare = {
  grossOre: number;
  commissionOre: number;
  commissionVatOre: number;
};

export type PayoutStatement = {
  grossOre: number;
  commissionOre: number;
  commissionVatOre: number;
  monthlyFeeOre: number;
  monthlyFeeVatOre: number;
  /** Amount transferred to the producer. Never negative. */
  netOre: number;
  /** Fee the period could not cover; deducted from the next payout. */
  carryOverOre: number;
};

/**
 * Builds a producer's monthly statement from shares that are completed and
 * past the return window. A slow month never sends the producer a bill:
 * an uncovered fee rolls forward instead.
 */
export function buildPayout(
  shares: SettledShare[],
  plan: PricingPlan,
  previousCarryOverOre = 0,
): PayoutStatement {
  const grossOre = sum(shares, (s) => s.grossOre);
  const commissionOre = sum(shares, (s) => s.commissionOre);
  const commissionVatOre = sum(shares, (s) => s.commissionVatOre);
  const monthlyFeeOre = plan.monthlyFeeOre;
  const monthlyFeeVatOre = Math.round((monthlyFeeOre * COMMISSION_VAT_PERCENT) / 100);

  const due =
    grossOre -
    commissionOre -
    commissionVatOre -
    monthlyFeeOre -
    monthlyFeeVatOre -
    previousCarryOverOre;

  return {
    grossOre,
    commissionOre,
    commissionVatOre,
    monthlyFeeOre,
    monthlyFeeVatOre,
    netOre: Math.max(due, 0),
    carryOverOre: Math.max(-due, 0),
  };
}

function sum<T>(items: T[], pick: (item: T) => number): number {
  return items.reduce((total, item) => total + pick(item), 0);
}
