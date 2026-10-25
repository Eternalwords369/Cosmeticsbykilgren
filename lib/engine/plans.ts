/**
 * Producer pricing plans. Rates are basis points (1 bp = 0.01 %) on the
 * VAT-inclusive sale price; commission is a service and carries 25 % VAT on top.
 * Change the numbers here only — every calculation reads from this table.
 */
export const COMMISSION_VAT_PERCENT = 25;

export type PricingPlanId = "COMMISSION" | "MEMBER";

export type PricingPlan = {
  id: PricingPlanId;
  commissionBps: number;
  monthlyFeeOre: number;
};

export const PRICING_PLANS: Record<PricingPlanId, PricingPlan> = {
  // Default: no fixed cost, the platform earns only when the producer sells.
  COMMISSION: { id: "COMMISSION", commissionBps: 1500, monthlyFeeOre: 0 },
  // For producers who sell steadily: fixed fee, lower commission.
  MEMBER: { id: "MEMBER", commissionBps: 600, monthlyFeeOre: 49500 },
};

/** Monthly sales (öre, incl. VAT) above which `b` becomes cheaper than `a`. */
export function breakEvenGrossOre(a: PricingPlan, b: PricingPlan): number | null {
  const bpsSaved = a.commissionBps - b.commissionBps;
  if (bpsSaved <= 0) return null;
  const extraFee = b.monthlyFeeOre - a.monthlyFeeOre;
  // Fees and commission both carry VAT, so VAT cancels out of the comparison.
  return Math.ceil((extraFee * 10_000) / bpsSaved);
}
