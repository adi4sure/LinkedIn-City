/**
 * dataUtils.js — LinkedInCity
 * Normalize raw activity data into the grid format used by visualization components.
 */

/**
 * Takes an array of { date, count } and returns a sorted, normalised grid
 * with week/day indices plus computed stats.
 */
export function normaliseContributions(rawDays) {
  if (!rawDays || rawDays.length === 0) {
    return { cells: [], stats: { total: 0, maxCount: 0, maxStreak: 0, curStreak: 0, busiest: null, activeDays: 0 } };
  }

  const sorted = [...rawDays].sort((a, b) => a.date.localeCompare(b.date));

  // Compute week and day indices
  const firstDate = new Date(sorted[0].date + "T12:00:00Z");
  const cells = sorted.map(d => {
    const dt = new Date(d.date + "T12:00:00Z");
    const diffDays = Math.round((dt - firstDate) / 86400000);
    const week = Math.floor(diffDays / 7);
    const day = dt.getUTCDay(); // 0=Sun..6=Sat
    return { ...d, week, day };
  });

  // Stats
  let total = 0, maxCount = 0, maxStreak = 0, curStreak = 0, streak = 0, busiest = null, activeDays = 0;

  sorted.forEach(d => {
    total += d.count;
    if (d.count > maxCount) { maxCount = d.count; busiest = d; }
    if (d.count > 0) { streak++; activeDays++; maxStreak = Math.max(maxStreak, streak); }
    else { streak = 0; }
  });

  // Current streak (from end)
  curStreak = 0;
  for (let i = sorted.length - 1; i >= 0; i--) {
    if (sorted[i].count > 0) curStreak++;
    else break;
  }

  const stats = { total, maxCount, maxStreak, curStreak, busiest, activeDays };

  return { cells, stats };
}

/**
 * Filter cells by time range.
 */
export function filterByRange(cells, range) {
  if (!range || range === "all") return cells;

  const now = new Date();
  let cutoff;

  switch (range) {
    case "1y": cutoff = new Date(now.getFullYear() - 1, now.getMonth(), now.getDate()); break;
    case "6m": cutoff = new Date(now.getFullYear(), now.getMonth() - 6, now.getDate()); break;
    case "3m": cutoff = new Date(now.getFullYear(), now.getMonth() - 3, now.getDate()); break;
    case "1m": cutoff = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate()); break;
    case "1w": cutoff = new Date(now.getTime() - 7 * 86400000); break;
    default: return cells;
  }

  const cutStr = cutoff.toISOString().slice(0, 10);
  const filtered = cells.filter(c => c.date >= cutStr);

  // Recompute week indices for filtered data
  if (filtered.length === 0) return filtered;
  const firstDate = new Date(filtered[0].date + "T12:00:00Z");
  return filtered.map(c => {
    const dt = new Date(c.date + "T12:00:00Z");
    const diffDays = Math.round((dt - firstDate) / 86400000);
    return { ...c, week: Math.floor(diffDays / 7) };
  });
}

/**
 * Compute stats for a set of cells.
 */
export function computeStats(cells) {
  let total = 0, maxCount = 0, maxStreak = 0, curStreak = 0, streak = 0, busiest = null, activeDays = 0;

  const sorted = [...cells].sort((a, b) => a.date.localeCompare(b.date));
  sorted.forEach(d => {
    total += d.count;
    if (d.count > maxCount) { maxCount = d.count; busiest = d; }
    if (d.count > 0) { streak++; activeDays++; maxStreak = Math.max(maxStreak, streak); }
    else { streak = 0; }
  });

  curStreak = 0;
  for (let i = sorted.length - 1; i >= 0; i--) {
    if (sorted[i].count > 0) curStreak++;
    else break;
  }

  return { total, maxCount, maxStreak, curStreak, busiest, activeDays };
}
