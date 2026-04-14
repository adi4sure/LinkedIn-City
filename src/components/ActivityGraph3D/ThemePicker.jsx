/**
 * ThemePicker.jsx — LinkedInCity
 */
import { THEMES, themeKeys } from "../../constants/themes";

export function ThemePicker({ current, onChange, theme }) {
  return (
    <div style={{
      display: "flex", gap: "0.35rem", flexWrap: "wrap",
    }}>
      {themeKeys.map(key => {
        const t = THEMES[key];
        const active = current === key;
        return (
          <button key={key} onClick={() => onChange(key)}
            style={{
              background: active ? `${t.accent}20` : theme.surface,
              border: `1px solid ${active ? t.accent : theme.border}`,
              borderRadius: 6, padding: "0.25rem 0.55rem",
              cursor: "pointer", fontFamily: "inherit",
              fontSize: "0.6rem", color: active ? t.accent : theme.muted,
              fontWeight: active ? 700 : 400,
              letterSpacing: "0.06em",
              transition: "all 0.15s",
              display: "flex", alignItems: "center", gap: "0.3rem",
            }}
          >
            <span style={{
              width: 8, height: 8, borderRadius: "50%",
              background: t.accent,
              boxShadow: active ? `0 0 6px ${t.accent}` : "none",
            }} />
            {t.label}
          </button>
        );
      })}
    </div>
  );
}
