import { commissionOn } from "@/lib/engine/commission";
import type { PricingPlan } from "@/lib/engine/plans";
import { vatFromInclusive } from "@/lib/money";

export type SplitLine = {
  productId: string;
  producerId: string;
  quantity: number;
  unitPriceOre: number;
  vatRate: number;
};

export type ProducerShare = {
  producerId: string;
  grossOre: number;
  vatOre: number;
  commissionOre: number;
  commissionVatOre: number;
  payoutOre: number;
  lines: SplitLine[];
};

/**
 * Splits one customer order into one share per producer.
 * Shipping and discount codes belong to the platform: the producer is always
 * settled on full list price, so a campaign never comes out of their pocket.
 */
export function splitOrder(
  lines: SplitLine[],
  planFor: (producerId: string) => PricingPlan,
): ProducerShare[] {
  const byProducer = new Map<string, SplitLine[]>();
  for (const line of lines) {
    if (line.quantity <= 0) continue;
    byProducer.set(line.producerId, [...(byProducer.get(line.producerId) ?? []), line]);
  }

  return [...byProducer.entries()]
    .map(([producerId, producerLines]) => {
      let grossOre = 0;
      let vatOre = 0;
      for (const line of producerLines) {
        const lineOre = line.unitPriceOre * line.quantity;
        grossOre += lineOre;
        vatOre += vatFromInclusive(lineOre, line.vatRate);
      }
      return {
        producerId,
        grossOre,
        vatOre,
        ...commissionOn(grossOre, planFor(producerId)),
        lines: producerLines,
      };
    })
    .sort((a, b) => a.producerId.localeCompare(b.producerId));
}
