/**
 * BirdsEyeGrid.jsx — LinkedInCity
 * Top-down heatmap grid view.
 */

import { useMemo } from "react";
import { TOTAL_WEEKS, TOTAL_DAYS } from "../../constants/graph";

export function BirdsEyeGrid({ sortedCells, stats, theme, mounted, hoveredDate, onHover }) {
  const cellSize = 14, gap = 2;
  const gridW = TOTAL_WEEKS * (cellSize + gap);
  const gridH = TOTAL_DAYS * (cellSize + gap);

  const cellMap = useMemo(() => {
    const map = {};
    sortedCells.forEach(c => { map[`${c.week}_${c.day}`] = c; });
    return map;
  }, [sortedCells]);

  const dayLabels = ["Sun", "", "Tue", "", "Thu", "", "Sat"];

  return (
    <div style={{
      width: "100%", height: "100%",
      display: "flex", alignItems: "center", justifyContent: "center",
      overflow: "auto", padding: "1rem",
    }}>
      <div style={{ display: "flex", gap: "0.35rem" }}>
        {/* Day labels */}
        <div style={{ display: "flex", flexDirection: "column", gap, paddingTop: 0 }}>
          {dayLabels.map((label, i) => (
            <div key={i} style={{
              width: 28, height: cellSize,
              display: "flex", alignItems: "center", justifyContent: "flex-end",
              fontSize: "0.5rem", color: theme.muted, paddingRight: 4,
            }}>
              {label}
            </div>
          ))}
        </div>

        {/* Grid */}
        <div style={{ display: "flex", flexDirection: "column", gap }}>
          {Array.from({ length: TOTAL_DAYS }).map((_, day) => (
            <div key={day} style={{ display: "flex", gap }}>
              {Array.from({ length: TOTAL_WEEKS }).map((_, week) => {
                const cell = cellMap[`${week}_${day}`];
                const count = cell?.count || 0;
                const ratio = count / Math.max(stats.maxCount, 1);
                const lvl = count === 0 ? 0 : Math.min(4, Math.ceil(ratio * 4));
                const isHov = cell && hoveredDate === cell.date;

                return (
                  <div key={week}
                    style={{
                      width: cellSize, height: cellSize,
                      borderRadius: 2,
                      background: theme.levels[lvl],
                      border: isHov ? `1px solid ${theme.accent}` : `1px solid ${theme.border}30`,
                      opacity: mounted ? 1 : 0,
                      transition: `opacity 0.3s ${Math.min(week * 5, 300)}ms`,
                      cursor: cell ? "pointer" : "default",
                      transform: isHov ? "scale(1.3)" : "scale(1)",
                    }}
                    onMouseEnter={() => cell && onHover(cell)}
                    onMouseLeave={() => onHover(null)}
                  />
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
