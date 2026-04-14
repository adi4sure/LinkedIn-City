/**
 * App.jsx — LinkedInCity
 * Root component handling auth flow, routing, SEO, and theme state.
 */

import { useState, useEffect, useMemo } from "react";
import { Helmet } from "react-helmet-async";
import { THEMES, DEFAULT_THEME } from "./constants/themes";
import { useLinkedInData } from "./hooks/useLinkedInData";
import { LinkedInConnect } from "./components/ActivityGraph3D/LinkedInConnect";
import { ActivityGraph3D } from "./components/ActivityGraph3D/ActivityGraph3D";

function parseURL() {
  const path = window.location.pathname.replace(/^\/+|\/+$/g, "");
  const parts = path.split("/");
  if (parts.length >= 1 && parts[0] && parts[0] !== "") {
    const username = parts[0];
    const viewHint = parts[1] || null;
    return { username, viewHint };
  }
  return { username: null, viewHint: null };
}

export default function App() {
  const [themeKey, setThemeKey] = useState(() => {
    try { return localStorage.getItem("li_theme") || DEFAULT_THEME; } catch { return DEFAULT_THEME; }
  });
  const theme = useMemo(() => THEMES[themeKey] || THEMES[DEFAULT_THEME], [themeKey]);

  const { data, loading, error, fetchData } = useLinkedInData();

  const [urlParsed, setUrlParsed] = useState(false);

  // Parse URL for /:username routes
  useEffect(() => {
    const { username } = parseURL();
    if (username) {
      fetchData(username);
    } else {
      // Check localStorage
      try {
        const saved = localStorage.getItem("li_username");
        if (saved) fetchData(saved);
      } catch (_) { }
    }
    setUrlParsed(true);
  }, []);

  function handleConnect(username) {
    window.history.pushState(null, "", `/${username}`);
    fetchData(username);
  }

  function handleLogout() {
    try { localStorage.removeItem("li_username"); } catch (_) { }
    window.history.pushState(null, "", "/");
    window.location.reload();
  }

  function handleThemeChange(key) {
    setThemeKey(key);
    try { localStorage.setItem("li_theme", key); } catch (_) { }
  }

  const showGraph = data && !loading;
  const username = data?.username || "";

  return (
    <>
      <Helmet>
        <title>{username ? `${username}'s LinkedInCity` : "LinkedInCity — Your LinkedIn Activity as a 3D City"}</title>
        <meta name="description" content={username ? `Explore ${username}'s LinkedIn professional activity visualized as a stunning 3D city skyline.` : "Transform your LinkedIn professional activity into a living 3D city with buildings, traffic, and weather."} />
        {username && <link rel="canonical" href={`https://linkedincity.app/${username}`} />}
      </Helmet>

      {!urlParsed ? null : showGraph ? (
        <ActivityGraph3D
          cells={data.cells}
          stats={data.stats}
          profile={data.profile}
          theme={theme}
          themeKey={themeKey}
          onThemeChange={handleThemeChange}
          onLogout={handleLogout}
        />
      ) : (
        <LinkedInConnect
          onConnect={handleConnect}
          loading={loading}
          error={error}
          theme={theme}
        />
      )}
    </>
  );
}
