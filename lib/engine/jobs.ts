import "server-only";
import { db } from "@/lib/db";
import { buildPayout } from "@/lib/engine/payout";
import { PRICING_PLANS } from "@/lib/engine/plans";
import { splitOrder } from "@/lib/engine/split";

/** Shares are paid out only after the return window has passed. */
export const RETURN_WINDOW_DAYS = 14;

/**
 * Called once an order is paid (Stripe webhook, Fas 2). Idempotent: a
 * repeated webhook leaves the existing shares untouched.
 */
export async function recordProducerOrders(orderId: string): Promise<void> {
  const order = await db.order.findUniqueOrThrow({
    where: { id: orderId },
    select: {
      items: {
        select: {
          productId: true,
          quantity: true,
          unitPriceOre: true,
          product: {
            select: {
              vatRate: true,
              producerId: true,
              producer: { select: { pricingPlan: true } },
            },
          },
        },
      },
    },
  });

  const planOf = new Map(
    order.items.map((i) => [i.product.producerId, i.product.producer.pricingPlan]),
  );
  const shares = splitOrder(
    order.items.map((i) => ({
      productId: i.productId,
      producerId: i.product.producerId,
      quantity: i.quantity,
      unitPriceOre: i.unitPriceOre,
      vatRate: i.product.vatRate,
    })),
    (producerId) => PRICING_PLANS[planOf.get(producerId)!],
  );

  await db.producerOrder.createMany({
    data: shares.map((share) => ({
      orderId,
      producerId: share.producerId,
      pricingPlan: planOf.get(share.producerId)!,
      grossOre: share.grossOre,
      vatOre: share.vatOre,
      commissionOre: share.commissionOre,
      commissionVatOre: share.commissionVatOre,
      payoutOre: share.payoutOre,
    })),
    skipDuplicates: true,
  });
}

/**
 * Monthly run: one statement per producer for every handed-over share past the
 * return window. Writes PENDING payouts; the Stripe Connect transfer marks them PAID.
 */
export async function closePayoutPeriod(now = new Date()): Promise<number> {
  const periodStart = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1));
  const settledBefore = new Date(now.getTime() - RETURN_WINDOW_DAYS * 86_400_000);

  const producers = await db.producer.findMany({
    where: { isActive: true },
    select: { id: true, pricingPlan: true, payoutCarryOverOre: true },
  });

  let created = 0;
  for (const producer of producers) {
    await db.$transaction(async (tx) => {
      const exists = await tx.payout.findUnique({
        where: { producerId_periodStart: { producerId: producer.id, periodStart } },
        select: { id: true },
      });
      if (exists) return;

      const shares = await tx.producerOrder.findMany({
        where: {
          producerId: producer.id,
          status: "HANDED_OVER",
          payoutId: null,
          updatedAt: { lt: settledBefore },
        },
        select: { id: true, grossOre: true, commissionOre: true, commissionVatOre: true },
      });
      const plan = PRICING_PLANS[producer.pricingPlan];
      // Fixed-fee producers are billed every month; commission-only producers with no sales get nothing.
      if (shares.length === 0 && plan.monthlyFeeOre === 0) return;

      const statement = buildPayout(shares, plan, producer.payoutCarryOverOre);
      const payout = await tx.payout.create({
        data: { producerId: producer.id, periodStart, periodEnd: now, ...statement },
      });
      await tx.producerOrder.updateMany({
        where: { id: { in: shares.map((s) => s.id) } },
        data: { payoutId: payout.id },
      });
      await tx.producer.update({
        where: { id: producer.id },
        data: { payoutCarryOverOre: statement.carryOverOre },
      });
      created++;
    });
  }
  return created;
}
