/**
 * useContributionData.js — LinkedInCity
 * Processes raw cells into filtered, sorted arrays with computed stats.
 */

import { useMemo } from "react";
import { filterByRange, computeStats } from "../utils/dataUtils";

export function useContributionData(cells, range) {
  return useMemo(() => {
    if (!cells || cells.length === 0) {
      return {
        sortedCells: [],
        stats: { total: 0, maxCount: 0, maxStreak: 0, curStreak: 0, busiest: null, activeDays: 0 },
        monthLabels: [],
      };
    }

    const filtered = filterByRange(cells, range);
    const sorted = [...filtered].sort((a, b) => a.date.localeCompare(b.date));
    const stats = computeStats(sorted);

    // Build month labels
    const monthLabels = [];
    let lastMonth = -1;
    sorted.forEach(cell => {
      const dt = new Date(cell.date + "T12:00:00Z");
      const m = dt.getUTCMonth();
      if (m !== lastMonth) {
        lastMonth = m;
        monthLabels.push({
          week: cell.week,
          label: dt.toLocaleString("en-US", { month: "short", timeZone: "UTC" }),
        });
      }
    });

    return { sortedCells: sorted, stats, monthLabels };
  }, [cells, range]);
}
