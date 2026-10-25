import { COMMISSION_VAT_PERCENT, type PricingPlan } from "@/lib/engine/plans";

export type Commission = {
  commissionOre: number;
  commissionVatOre: number;
  payoutOre: number;
};

export function commissionOn(grossOre: number, plan: PricingPlan): Commission {
  const commissionOre = Math.round((grossOre * plan.commissionBps) / 10_000);
  const commissionVatOre = Math.round((commissionOre * COMMISSION_VAT_PERCENT) / 100);
  return {
    commissionOre,
    commissionVatOre,
    payoutOre: grossOre - commissionOre - commissionVatOre,
  };
}
