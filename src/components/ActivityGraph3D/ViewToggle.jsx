/**
 * ViewToggle.jsx — LinkedInCity
 */

const VIEWS = [
  { key: "isometric", label: "Isometric", icon: "◇" },
  { key: "birdseye", label: "Bird's Eye", icon: "▦" },
  { key: "simulation", label: "Simulation", icon: "▶" },
];

export function ViewToggle({ current, onChange, theme }) {
  return (
    <div style={{ display: "flex", gap: "0.3rem" }}>
      {VIEWS.map(({ key, label, icon }) => {
        const active = current === key;
        return (
          <button key={key} onClick={() => onChange(key)}
            style={{
              background: active ? `${theme.accent}20` : theme.surface,
              border: `1px solid ${active ? theme.accent : theme.border}`,
              borderRadius: 6,
              padding: "0.3rem 0.65rem",
              cursor: "pointer",
              fontFamily: "inherit",
              fontSize: "0.62rem",
              color: active ? theme.accent : theme.muted,
              fontWeight: active ? 700 : 400,
              letterSpacing: "0.08em",
              transition: "all 0.15s",
              boxShadow: active ? `0 0 8px ${theme.glow}30` : "none",
            }}
          >
            {icon} {label}
          </button>
        );
      })}
    </div>
  );
}
