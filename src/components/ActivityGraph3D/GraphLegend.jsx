/**
 * GraphLegend.jsx — LinkedInCity
 */

export function GraphLegend({ theme }) {
  return (
    <div style={{
      display: "flex", alignItems: "center", gap: "0.4rem",
      fontSize: "0.58rem", color: theme.muted,
    }}>
      <span>Less</span>
      {theme.levels.map((color, i) => (
        <div key={i} style={{
          width: 12, height: 12, borderRadius: 2,
          background: color,
          border: `1px solid ${theme.border}`,
        }} />
      ))}
      <span>More</span>
    </div>
  );
}
