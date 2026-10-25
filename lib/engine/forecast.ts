/**
 * Weekly demand forecast per product: Holt's linear smoothing (level + trend).
 * The smoothing weights are refitted from the product's own history on every
 * run, picking the pair that would have predicted past weeks best. More weeks
 * of sales means a better fit, without anyone tuning anything.
 *
 * Annual seasonality (harvest, Christmas) needs two years of data before it can
 * be learned; until then campaigns override the forecast by hand.
 */

const ALPHAS = [0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9];
const BETAS = [0, 0.05, 0.1, 0.2, 0.3];

export type Forecast = {
  nextWeekUnits: number;
  /** Mean absolute one-week-ahead error on history; the forecast's own uncertainty. */
  maeUnits: number;
  alpha: number;
  beta: number;
  weeksObserved: number;
};

/** `weeklyUnits` is oldest first, one entry per week, zeros included. */
export function forecastDemand(weeklyUnits: number[]): Forecast {
  const n = weeklyUnits.length;
  if (n < 3) {
    const mean = n === 0 ? 0 : weeklyUnits.reduce((a, b) => a + b, 0) / n;
    return { nextWeekUnits: mean, maeUnits: mean, alpha: 0, beta: 0, weeksObserved: n };
  }

  let best: Forecast | null = null;
  for (const alpha of ALPHAS) {
    for (const beta of BETAS) {
      const fit = holt(weeklyUnits, alpha, beta);
      if (!best || fit.maeUnits < best.maeUnits) best = fit;
    }
  }
  return best!;
}

function holt(series: number[], alpha: number, beta: number): Forecast {
  let level = series[0];
  let trend = series[1] - series[0];
  let absError = 0;

  for (let t = 1; t < series.length; t++) {
    const predicted = Math.max(level + trend, 0);
    absError += Math.abs(series[t] - predicted);
    const previousLevel = level;
    level = alpha * series[t] + (1 - alpha) * (level + trend);
    trend = beta * (level - previousLevel) + (1 - beta) * trend;
  }

  return {
    nextWeekUnits: Math.max(level + trend, 0),
    maeUnits: absError / (series.length - 1),
    alpha,
    beta,
    weeksObserved: series.length,
  };
}

export type RestockAdvice = {
  weeksOfCover: number | null;
  suggestedUnits: number;
};

/** Units to restock so `stock` covers `targetWeeks` of demand plus one forecast error of margin. */
export function restockAdvice(stock: number, forecast: Forecast, targetWeeks = 2): RestockAdvice {
  const weekly = forecast.nextWeekUnits;
  const needed = Math.ceil(weekly * targetWeeks + forecast.maeUnits);
  return {
    weeksOfCover: weekly > 0 ? stock / weekly : null,
    suggestedUnits: Math.max(needed - stock, 0),
  };
}
