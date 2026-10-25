import { PRICING_PLANS, type PricingPlan, type PricingPlanId } from "@/lib/engine/plans";

/** Months of history needed before we suggest anything. */
export const ADVISOR_MIN_MONTHS = 3;
/** Ignore savings smaller than this per month, so producers aren't nagged to flip back and forth. */
export const ADVISOR_MIN_SAVING_ORE = 10_000;

export type PlanAdvice = {
  current: PricingPlanId;
  recommended: PricingPlanId;
  monthlySavingOre: number;
};

/** What a plan costs the producer for one month of sales, VAT excluded. */
export function monthlyCostOre(grossOre: number, plan: PricingPlan): number {
  return Math.round((grossOre * plan.commissionBps) / 10_000) + plan.monthlyFeeOre;
}

/**
 * Recommends the cheapest plan for the producer, judged on their recent months.
 * Only every month's cost counts, not the average, so a single harvest-season
 * spike doesn't push a seasonal producer onto a fixed fee.
 */
export function advisePlan(
  current: PricingPlanId,
  monthlyGrossOre: number[],
  plans: PricingPlan[] = Object.values(PRICING_PLANS),
): PlanAdvice | null {
  const recent = monthlyGrossOre.slice(-ADVISOR_MIN_MONTHS);
  if (recent.length < ADVISOR_MIN_MONTHS) return null;

  const cost = (plan: PricingPlan) => recent.reduce((t, g) => t + monthlyCostOre(g, plan), 0);
  const currentPlan = PRICING_PLANS[current];
  const currentCost = cost(currentPlan);

  let best: { plan: PricingPlan; saving: number } | null = null;
  for (const plan of plans) {
    if (plan.id === current) continue;
    const cheaperEveryMonth = recent.every(
      (g) => monthlyCostOre(g, plan) < monthlyCostOre(g, currentPlan),
    );
    const saving = Math.floor((currentCost - cost(plan)) / recent.length);
    if (cheaperEveryMonth && saving >= ADVISOR_MIN_SAVING_ORE && saving > (best?.saving ?? 0)) {
      best = { plan, saving };
    }
  }

  return best ? { current, recommended: best.plan.id, monthlySavingOre: best.saving } : null;
}
