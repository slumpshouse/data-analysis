export function computeQuality(parsed) {
  // parsed: { columns: [], rows: [], stats: [] }
  const rows = parsed?.rows || [];
  const cols = parsed?.columns || [];
  const stats = parsed?.stats || [];

  const totalCells = Math.max(rows.length * cols.length, 1);
  let totalMissing = 0;
  stats.forEach((s) => { totalMissing += s.missing || 0; });

  const completeness = Math.round((1 - totalMissing / totalCells) * 100);

  // Simple consistency measure: percent of columns with >1 unique types (heuristic)
  let typeIssues = 0;
  cols.forEach((c) => {
    const types = new Set();
    rows.forEach((r) => {
      const v = r[c];
      if (v === null || v === undefined || String(v).trim() === "") return;
      types.add(typeof v);
    });
    if (types.size > 1) typeIssues++;
  });
  const consistency = Math.round((1 - typeIssues / Math.max(cols.length, 1)) * 100);

  // Accuracy: heuristic based on outlier-like values (very large ages etc.)
  let outlierCount = 0;
  if (cols.includes('age')) {
    rows.forEach((r) => {
      const v = Number(r['age']);
      if (!Number.isNaN(v) && (v > 120 || v < 0)) outlierCount++;
    });
  }
  const accuracy = Math.max(50, 100 - outlierCount * 5);

  // Aggregate score (weighted)
  const score = Math.round(0.45 * completeness + 0.35 * consistency + 0.2 * accuracy);

  return {
    rowsCount: rows.length,
    colsCount: cols.length,
    completeness,
    consistency,
    accuracy,
    score,
    outlierCount,
    totalMissing,
    stats,
  };
}
