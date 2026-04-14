/**
 * useDragRotation.js — LinkedInCity
 * Hook for drag-to-rotate interaction (currently reserved for future use).
 */

import { useState, useCallback } from "react";

export function useDragRotation() {
  const [rotation, setRotation] = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);
  const [lastPos, setLastPos] = useState({ x: 0, y: 0 });

  const onMouseDown = useCallback((e) => {
    setDragging(true);
    setLastPos({ x: e.clientX, y: e.clientY });
  }, []);

  const onMouseMove = useCallback((e) => {
    if (!dragging) return;
    setRotation(prev => ({
      x: prev.x + (e.clientY - lastPos.y) * 0.3,
      y: prev.y + (e.clientX - lastPos.x) * 0.3,
    }));
    setLastPos({ x: e.clientX, y: e.clientY });
  }, [dragging, lastPos]);

  const onMouseUp = useCallback(() => {
    setDragging(false);
  }, []);

  return { rotation, onMouseDown, onMouseMove, onMouseUp };
}
