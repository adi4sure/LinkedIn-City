/**
 * useMountAnimation.js — LinkedInCity
 * Triggers a mount animation flag after a short delay.
 */

import { useState, useEffect } from "react";

export function useMountAnimation(deps = [], delay = 80) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(false);
    const t = setTimeout(() => setMounted(true), delay);
    return () => clearTimeout(t);
  }, deps);

  return mounted;
}
