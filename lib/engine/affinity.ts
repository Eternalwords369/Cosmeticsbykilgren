/**
 * "Passar ihop med": products customers buy together, learned from orders.
 * Scored by lift, how much more often the pair shows up than chance would
 * explain, so staples that are in every basket don't drown out real matches.
 * By default only pairs across producers count: that is where the platform
 * links one farm's customers to the next.
 */

/** Orders a pair must share before we trust it. */
export const AFFINITY_MIN_SUPPORT = 3;

export type Affinity = { productId: string; lift: number; together: number };

export function buildAffinities(
  orders: string[][],
  producerOf: (productId: string) => string | undefined,
  { crossProducerOnly = true, limit = 4 } = {},
): Map<string, Affinity[]> {
  const single = new Map<string, number>();
  const pairs = new Map<string, number>();

  for (const order of orders) {
    const unique = [...new Set(order)].sort();
    for (const id of unique) single.set(id, (single.get(id) ?? 0) + 1);
    for (let i = 0; i < unique.length; i++) {
      for (let j = i + 1; j < unique.length; j++) {
        const key = `${unique[i]}|${unique[j]}`;
        pairs.set(key, (pairs.get(key) ?? 0) + 1);
      }
    }
  }

  const n = orders.length;
  const result = new Map<string, Affinity[]>();
  const add = (from: string, to: string, lift: number, together: number) => {
    result.set(from, [...(result.get(from) ?? []), { productId: to, lift, together }]);
  };

  for (const [key, together] of pairs) {
    if (together < AFFINITY_MIN_SUPPORT) continue;
    const [a, b] = key.split("|");
    if (crossProducerOnly && producerOf(a) === producerOf(b)) continue;
    const lift = (together * n) / (single.get(a)! * single.get(b)!);
    if (lift <= 1) continue;
    add(a, b, lift, together);
    add(b, a, lift, together);
  }

  for (const [id, list] of result) {
    list.sort((x, y) => y.lift - x.lift || y.together - x.together);
    result.set(id, list.slice(0, limit));
  }
  return result;
}
