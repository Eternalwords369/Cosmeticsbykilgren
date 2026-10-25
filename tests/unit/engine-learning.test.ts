import { describe, expect, it } from "vitest";
import { buildAffinities } from "@/lib/engine/affinity";
import { forecastDemand, restockAdvice } from "@/lib/engine/forecast";
import { rankProducts } from "@/lib/engine/ranking";

describe("forecastDemand", () => {
  it("falls back to the mean on short history", () => {
    expect(forecastDemand([]).nextWeekUnits).toBe(0);
    expect(forecastDemand([4, 6]).nextWeekUnits).toBe(5);
  });

  it("follows a rising trend", () => {
    const f = forecastDemand([2, 4, 6, 8, 10, 12, 14, 16]);
    expect(f.nextWeekUnits).toBeCloseTo(18, 0);
  });

  it("stays close to a flat, noisy series", () => {
    const noisy = [10, 12, 9, 11, 10, 13, 9, 10, 12, 11, 10, 9, 12, 10, 11, 10];
    const f = forecastDemand(noisy);
    expect(f.nextWeekUnits).toBeGreaterThan(9);
    expect(f.nextWeekUnits).toBeLessThan(12);
    expect(f.maeUnits).toBeLessThan(2);
  });

  it("never forecasts negative demand", () => {
    expect(forecastDemand([10, 6, 3, 1, 0, 0]).nextWeekUnits).toBeGreaterThanOrEqual(0);
  });
});

describe("restockAdvice", () => {
  it("asks for two weeks of cover plus margin", () => {
    const f = { nextWeekUnits: 10, maeUnits: 2, alpha: 0.5, beta: 0, weeksObserved: 8 };
    expect(restockAdvice(6, f)).toEqual({ weeksOfCover: 0.6, suggestedUnits: 16 });
    expect(restockAdvice(40, f).suggestedUnits).toBe(0);
  });
});

describe("rankProducts", () => {
  const signals = [
    { productId: "proven", views: 2000, purchases: 200 },
    { productId: "weak", views: 2000, purchases: 10 },
    { productId: "new", views: 0, purchases: 0 },
  ];

  it("is stable for the same seed", () => {
    expect(rankProducts(signals, "2026-10-24")).toEqual(rankProducts(signals, "2026-10-24"));
  });

  it("puts proven sellers above weak ones every day", () => {
    for (let day = 1; day <= 30; day++) {
      const order = rankProducts(signals, `2026-11-${day}`);
      expect(order.indexOf("proven")).toBeLessThan(order.indexOf("weak"));
    }
  });

  it("still gives a new product the top spot some days", () => {
    let top = 0;
    for (let day = 0; day < 200; day++) {
      if (rankProducts(signals, `day-${day}`)[0] === "new") top++;
    }
    expect(top).toBeGreaterThan(0);
    expect(top).toBeLessThan(200);
  });
});

describe("buildAffinities", () => {
  const producer: Record<string, string> = {
    ost: "gard-a",
    kex: "gard-b",
    mjolk: "gard-a",
    agg: "gard-c",
  };
  const orders = [
    ["ost", "kex"],
    ["ost", "kex", "agg"],
    ["ost", "kex", "mjolk"],
    ["ost", "mjolk"],
    ["ost", "mjolk"],
    ["ost", "mjolk"],
    ["agg"],
    ["agg"],
    ["agg", "mjolk"],
  ];

  it("links products across producers that sell together", () => {
    const a = buildAffinities(orders, (id) => producer[id]);
    expect(a.get("ost")?.map((x) => x.productId)).toEqual(["kex"]);
    expect(a.get("kex")?.[0].together).toBe(3);
  });

  it("skips same-producer pairs and thin evidence", () => {
    const a = buildAffinities(orders, (id) => producer[id]);
    expect(a.get("mjolk")).toBeUndefined();
    expect(a.has("agg")).toBe(false);
  });
});
