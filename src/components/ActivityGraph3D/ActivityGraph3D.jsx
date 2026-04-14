/**
 * ActivityGraph3D.jsx — LinkedInCity
 * Main controller managing views, time filters, theme switching, and tooltips.
 */

import { useState, useCallback } from "react";
import { useContributionData } from "../../hooks/useContributionData";
import { useMountAnimation } from "../../hooks/useMountAnimation";
import { useMousePosition } from "../../hooks/useMousePosition";
import { IsometricGrid } from "./IsometricGrid";
import { BirdsEyeGrid } from "./BirdsEyeGrid";
import { CitySimulation } from "./CitySimulation";
import { Tooltip } from "./Tooltip";
import { StatsBar } from "./StatsBar";
import { ThemePicker } from "./ThemePicker";
import { ViewToggle } from "./ViewToggle";
import { GraphLegend } from "./GraphLegend";

const TIME_RANGES = [
  { key: "all", label: "All Time" },
  { key: "1y", label: "1 Year" },
  { key: "6m", label: "6 Months" },
  { key: "3m", label: "3 Months" },
  { key: "1m", label: "1 Month" },
  { key: "1w", label: "1 Week" },
];

export function ActivityGraph3D({ cells, stats: rawStats, profile, theme, themeKey, onThemeChange, onLogout }) {
  const [view, setView] = useState("isometric");
  const [range, setRange] = useState("all");
  const [hoveredCell, setHoveredCell] = useState(null);

  const { sortedCells, stats, monthLabels } = useContributionData(cells, range);
  const mounted = useMountAnimation([sortedCells]);
  const mousePos = useMousePosition();

  const handleHover = useCallback((cell) => {
    setHoveredCell(cell);
  }, []);

  const username = profile?.name || "";

  return (
    <div style={{
      width: "100%", height: "100vh",
      display: "flex", flexDirection: "column",
      background: theme.bg,
      fontFamily: "'Courier New', monospace",
      color: theme.text,
      overflow: "hidden",
    }}>
      {/* HEADER */}
      <div style={{
        padding: "0.75rem 1.25rem",
        borderBottom: `1px solid ${theme.border}`,
        display: "flex", alignItems: "center", gap: "1rem",
        flexWrap: "wrap",
        background: `${theme.surface}80`,
        backdropFilter: "blur(8px)",
        zIndex: 30,
      }}>
        {/* Title area */}
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginRight: "auto" }}>
          <span style={{ fontSize: "1.2rem" }}>🏙️</span>
          <div>
            <div style={{
              fontSize: "0.65rem", color: theme.accent,
              letterSpacing: "0.15em", fontWeight: 700,
            }}>LINKEDINCITY</div>
            {username && (
              <div style={{ fontSize: "0.72rem", color: theme.text, fontWeight: 600 }}>
                <span style={{ color: theme.muted }}>@</span>{username}
              </div>
            )}
          </div>
          <button onClick={onLogout} style={{
            background: "transparent", border: `1px solid ${theme.border}`,
            borderRadius: 4, color: theme.muted, fontSize: "0.55rem",
            fontFamily: "inherit", padding: "0.15rem 0.45rem",
            cursor: "pointer", marginLeft: "0.5rem",
          }}>
            ✕
          </button>
        </div>

        {/* View toggle */}
        <ViewToggle current={view} onChange={setView} theme={theme} />

        {/* Time range filter */}
        <div style={{ display: "flex", gap: "0.2rem", flexWrap: "wrap" }}>
          {TIME_RANGES.map(({ key, label }) => {
            const active = range === key;
            return (
              <button key={key} onClick={() => setRange(key)} style={{
                background: active ? `${theme.accent}20` : "transparent",
                border: `1px solid ${active ? theme.accent : theme.border}`,
                borderRadius: 4, padding: "0.2rem 0.45rem",
                color: active ? theme.accent : theme.muted,
                fontSize: "0.55rem", fontFamily: "inherit",
                cursor: "pointer", fontWeight: active ? 700 : 400,
                transition: "all 0.15s",
              }}>
                {label}
              </button>
            );
          })}
        </div>
      </div>

      {/* STATS BAR */}
      {view !== "simulation" && (
        <div style={{ padding: "0.65rem 1.25rem 0" }}>
          <StatsBar stats={stats} theme={theme} />
        </div>
      )}

      {/* MAIN VIEW */}
      <div style={{ flex: 1, position: "relative", overflow: "hidden" }}>
        {view === "isometric" && (
          <IsometricGrid
            sortedCells={sortedCells}
            stats={stats}
            monthLabels={monthLabels}
            theme={theme}
            mounted={mounted}
            hoveredDate={hoveredCell?.date}
            onHover={handleHover}
          />
        )}
        {view === "birdseye" && (
          <BirdsEyeGrid
            sortedCells={sortedCells}
            stats={stats}
            theme={theme}
            mounted={mounted}
            hoveredDate={hoveredCell?.date}
            onHover={handleHover}
          />
        )}
        {view === "simulation" && (
          <CitySimulation
            cells={sortedCells}
            stats={stats}
            theme={theme}
            profile={profile}
          />
        )}
      </div>

      {/* FOOTER */}
      {view !== "simulation" && (
        <div style={{
          padding: "0.5rem 1.25rem 0.75rem",
          borderTop: `1px solid ${theme.border}`,
          display: "flex", alignItems: "center", justifyContent: "space-between",
          flexWrap: "wrap", gap: "0.5rem",
          background: `${theme.surface}60`,
        }}>
          <ThemePicker current={themeKey} onChange={onThemeChange} theme={theme} />
          <GraphLegend theme={theme} />
        </div>
      )}

      {/* TOOLTIP */}
      {view !== "simulation" && hoveredCell && (
        <Tooltip cell={hoveredCell} x={mousePos.x} y={mousePos.y} theme={theme} />
      )}
    </div>
  );
}
