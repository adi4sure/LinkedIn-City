/**
 * Building.jsx — LinkedInCity
 * Isometric 3D building geometry with windows, roof highlights, and antennae.
 */

import { adjustBrightness } from "../../utils/colorUtils";
import { TILE_W, TILE_H, MAX_BUILD_H, MIN_BUILD_H } from "../../constants/graph";

export function Building({ cell, maxCount, theme, hovered }) {
  const { count } = cell;
  const TW = TILE_W, TH = TILE_H;

  const ratio = count === 0 ? 0 : count / Math.max(maxCount, 1);
  const H = count === 0 ? MIN_BUILD_H : Math.max(3, ratio * (MAX_BUILD_H - MIN_BUILD_H));
  const lvl = count === 0 ? 0 : Math.min(4, Math.ceil(ratio * 4));
  const base = theme.levels[lvl];

  const top = adjustBrightness(base, hovered ? 65 : 45);
  const left = adjustBrightness(base, hovered ? 25 : 5);
  const right = adjustBrightness(base, hovered ? -5 : -25);
  const edge = adjustBrightness(base, -45);

  const cx = TW / 2, cy = H;
  const Tx = cx, Ty = 0;
  const Rx = cx + TW / 2, Ry = TH / 2;
  const Bx = cx, By = TH;
  const Lx = cx - TW / 2, Ly = TH / 2;

  if (count === 0) {
    return (
      <polygon
        points={`${Tx},${Ty} ${Rx},${Ry} ${Bx},${By} ${Lx},${Ly}`}
        fill={theme.levels[0]}
        stroke={`${theme.border}55`}
        strokeWidth={0.3}
      />
    );
  }

  const windows = [];
  if (H > 12) {
    const floors = Math.max(1, Math.floor(H / 8));
    const wW = TW * 0.12, wH = TH * 0.55;
    for (let f = 0; f < Math.min(floors, 4); f++) {
      const fy = By + H - (f + 1) * (H / floors) + H / floors * 0.2;
      windows.push(
        <rect key={`wl0-${f}`} x={Lx + (TW / 2) * 0.25 - wW / 2} y={fy} width={wW} height={wH} rx={0.3} fill={theme.accent} opacity={0.35} />,
        <rect key={`wl1-${f}`} x={Lx + (TW / 2) * 0.7 - wW / 2} y={fy} width={wW} height={wH} rx={0.3} fill={theme.accent} opacity={0.25} />
      );
    }
  }

  const antenna = H > 35 ? (
    <line
      x1={cx} y1={-2} x2={cx} y2={-7}
      stroke={theme.accent} strokeWidth={0.5} opacity={0.6}
    />
  ) : null;

  return (
    <g style={{ cursor: "pointer" }}>
      {/* Right face */}
      <polygon
        points={`${Rx},${Ry} ${Bx},${By} ${Bx},${By + H} ${Rx},${Ry + H}`}
        fill={right} stroke={edge} strokeWidth={0.3}
      />
      {/* Left face */}
      <polygon
        points={`${Lx},${Ly} ${Bx},${By} ${Bx},${By + H} ${Lx},${Ly + H}`}
        fill={left} stroke={edge} strokeWidth={0.3}
      />
      {/* Top face */}
      <polygon
        points={`${Tx},${Ty} ${Rx},${Ry} ${Bx},${By} ${Lx},${Ly}`}
        fill={top} stroke={edge} strokeWidth={0.3}
      />
      {/* Roof highlight */}
      <polyline
        points={`${Lx},${Ly} ${Tx},${Ty} ${Rx},${Ry}`}
        fill="none" stroke={adjustBrightness(base, 80)}
        strokeWidth={0.5} opacity={0.6}
      />
      {/* Windows */}
      {windows}
      {/* Antenna */}
      {antenna}
      {/* Hover glow */}
      {hovered && (
        <polygon
          points={`${Tx},${Ty} ${Rx},${Ry} ${Bx},${By} ${Lx},${Ly}`}
          fill={theme.accent} opacity={0.15}
        />
      )}
    </g>
  );
}
