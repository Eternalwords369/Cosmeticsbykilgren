/**
 * "Populärt" ordering in the shop, learned from views and purchases with
 * Thompson sampling: each product's conversion rate is a Beta distribution,
 * one draw per product decides the order. Proven products rise, but a new
 * producer's goods still get shown often enough to prove themselves.
 *
 * The draw is seeded (e.g. by date), so the order is stable while the catalog
 * is cached and changes from day to day.
 */

/** Strength of the catalog-wide prior, in pseudo-views. */
const PRIOR_VIEWS = 20;

export type ProductSignal = {
  productId: string;
  views: number;
  /** Orders containing the product, not units. */
  purchases: number;
};

export function rankProducts(signals: ProductSignal[], seed: string): string[] {
  const totalViews = signals.reduce((t, s) => t + s.views, 0);
  const totalPurchases = signals.reduce((t, s) => t + Math.min(s.purchases, s.views), 0);
  const catalogRate = totalViews > 0 ? Math.max(totalPurchases / totalViews, 0.01) : 0.05;
  const priorA = catalogRate * PRIOR_VIEWS;
  const priorB = (1 - catalogRate) * PRIOR_VIEWS;

  return signals
    .map((s) => {
      const purchases = Math.min(s.purchases, s.views);
      const rng = mulberry32(hashString(`${seed}:${s.productId}`));
      return {
        productId: s.productId,
        score: sampleBeta(priorA + purchases, priorB + s.views - purchases, rng),
      };
    })
    .sort((a, b) => b.score - a.score || a.productId.localeCompare(b.productId))
    .map((s) => s.productId);
}

type Rng = () => number;

function sampleBeta(a: number, b: number, rng: Rng): number {
  const x = sampleGamma(a, rng);
  const y = sampleGamma(b, rng);
  return x / (x + y);
}

/** Marsaglia–Tsang; boosts shape < 1 via Gamma(a+1)·U^(1/a). */
function sampleGamma(shape: number, rng: Rng): number {
  if (shape < 1) return sampleGamma(shape + 1, rng) * Math.pow(rng(), 1 / shape);
  const d = shape - 1 / 3;
  const c = 1 / Math.sqrt(9 * d);
  for (;;) {
    let x: number;
    let v: number;
    do {
      x = sampleNormal(rng);
      v = 1 + c * x;
    } while (v <= 0);
    v = v * v * v;
    const u = rng();
    if (u < 1 - 0.0331 * x ** 4) return d * v;
    if (Math.log(u) < 0.5 * x * x + d * (1 - v + Math.log(v))) return d * v;
  }
}

function sampleNormal(rng: Rng): number {
  const u = 1 - rng();
  return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * rng());
}

function mulberry32(seed: number): Rng {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function hashString(value: string): number {
  let h = 2166136261;
  for (let i = 0; i < value.length; i++) {
    h ^= value.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}
