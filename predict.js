// Dummy predictor for "predicted vs actual" curve and a weekly heatmap
export function predictPainSeries(logs /* array sorted by date asc */) {
  // naive: predicted = 0.7 * lastPain + noise
  let last = 5;
  const series = logs.map((l, i) => {
    const pred = Math.max(0, Math.min(10, 0.7 * last + 0.3 * (l.pain ?? 5)));
    last = l.pain ?? pred;
    return { t: i, actual: l.pain, predicted: +pred.toFixed(2) };
  });
  return series;
}

export function weeklyHeatmap(logs) {
  // 7-day bins of average pain
  const bins = Array(7).fill(0).map(() => ({ c: 0, s: 0 }));
  logs.forEach(l => {
    const d = new Date(l.date);
    const idx = d.getDay(); // 0..6
    bins[idx].c++; bins[idx].s += l.pain ?? 0;
  });
  return bins.map((b, i) => ({ day: i, avg: b.c ? +(b.s / b.c).toFixed(2) : 0 }));
}