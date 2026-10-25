import { describe, expect, it } from "vitest";
import { commissionOn } from "@/lib/engine/commission";
import { buildPayout } from "@/lib/engine/payout";
import { advisePlan } from "@/lib/engine/plan-advisor";
import { breakEvenGrossOre, PRICING_PLANS } from "@/lib/engine/plans";
import { splitOrder } from "@/lib/engine/split";

const { COMMISSION, MEMBER } = PRICING_PLANS;

describe("commissionOn", () => {
  it("takes the plan rate plus 25 % VAT on the commission", () => {
    expect(commissionOn(10_000, COMMISSION)).toEqual({
      commissionOre: 1500,
      commissionVatOre: 375,
      payoutOre: 8125,
    });
  });
});

describe("splitOrder", () => {
  it("gives each producer their own share and keeps every öre", () => {
    const shares = splitOrder(
      [
        { productId: "ost", producerId: "b", quantity: 2, unitPriceOre: 8900, vatRate: 12 },
        { productId: "honung", producerId: "a", quantity: 1, unitPriceOre: 12900, vatRate: 12 },
        { productId: "kniv", producerId: "a", quantity: 1, unitPriceOre: 25000, vatRate: 25 },
        { productId: "tom", producerId: "c", quantity: 0, unitPriceOre: 100, vatRate: 12 },
      ],
      (id) => (id === "a" ? MEMBER : COMMISSION),
    );

    expect(shares.map((s) => s.producerId)).toEqual(["a", "b"]);
    const [a, b] = shares;
    expect(a.grossOre).toBe(37_900);
    expect(a.vatOre).toBe(1382 + 5000);
    expect(a.commissionOre).toBe(2274);
    expect(b.grossOre).toBe(17_800);
    for (const s of shares) {
      expect(s.payoutOre + s.commissionOre + s.commissionVatOre).toBe(s.grossOre);
    }
  });
});

describe("buildPayout", () => {
  const share = (grossOre: number) => ({ grossOre, ...commissionOn(grossOre, MEMBER) });

  it("deducts the monthly fee with VAT", () => {
    const p = buildPayout([share(100_000)], MEMBER);
    expect(p.netOre).toBe(100_000 - 6000 - 1500 - 49_500 - 12_375);
    expect(p.carryOverOre).toBe(0);
  });

  it("never sends a bill: an uncovered fee rolls into next month", () => {
    const slow = buildPayout([share(20_000)], MEMBER);
    expect(slow.netOre).toBe(0);
    expect(slow.carryOverOre).toBe(49_500 + 12_375 + 1200 + 300 - 20_000);

    const next = buildPayout([share(200_000)], MEMBER, slow.carryOverOre);
    expect(next.netOre).toBe(200_000 - 12_000 - 3000 - 49_500 - 12_375 - slow.carryOverOre);
  });
});

describe("plans", () => {
  it("member plan pays off from 5 500 kr in monthly sales", () => {
    expect(breakEvenGrossOre(COMMISSION, MEMBER)).toBe(550_000);
    expect(breakEvenGrossOre(MEMBER, COMMISSION)).toBeNull();
  });
});

describe("advisePlan", () => {
  it("waits for three months of history", () => {
    expect(advisePlan("COMMISSION", [900_000, 900_000])).toBeNull();
  });

  it("suggests the member plan to a steady seller", () => {
    expect(advisePlan("COMMISSION", [800_000, 900_000, 1_000_000])).toEqual({
      current: "COMMISSION",
      recommended: "MEMBER",
      monthlySavingOre: 31_500,
    });
  });

  it("keeps a seasonal producer on commission despite one big month", () => {
    expect(advisePlan("COMMISSION", [100_000, 2_500_000, 150_000])).toBeNull();
  });

  it("suggests moving back when sales drop", () => {
    expect(advisePlan("MEMBER", [100_000, 150_000, 120_000])?.recommended).toBe("COMMISSION");
  });
});
