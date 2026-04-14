/**
 * CitySimulation.jsx — LinkedInCity
 * Full WebGL 3D city environment — buildings, roads, footpaths, traffic, pedestrians,
 * weather, day/night, minimap, drivable car, and HUD.
 */

import { useRef, useEffect, useState, useCallback } from "react";
import * as THREE from "three";
import { createTrafficSystem } from "./CityTraffic";
import { buildVehicle, updateVehicleLights, VEHICLE_TYPES } from "./CityVehicles";
import { addBench, addGarden, addKiosk } from "./CityAssets";
import { addTrafficSignal, addStreetSign, addDistanceBoard } from "./CitySignage";
import { createWeatherSystem } from "./WeatherSystem";
import { addTree, createPedestrianSystem } from "./PedestrianSystem";

/* ── helpers ── */
function aabbPushOut(pos, halfW, halfD, boxes) {
  for (const b of boxes) {
    const dx = pos.x - b.cx, dz = pos.z - b.cz;
    const ox = (halfW + b.hw) - Math.abs(dx), oz = (halfD + b.hd) - Math.abs(dz);
    if (ox > 0 && oz > 0) {
      if (ox < oz) pos.x += dx > 0 ? ox : -ox;
      else pos.z += dz > 0 ? oz : -oz;
    }
  }
}

export function CitySimulation({ cells, stats, theme, profile }) {
  const canvasRef = useRef(null);
  const stateRef = useRef({});
  const [dayNight, setDayNight] = useState("night");
  const [weather, setWeather] = useState("clear");
  const [showMinimap, setShowMinimap] = useState(true);
  const [showHUD, setShowHUD] = useState(true);
  const [speed, setSpeed] = useState(0);

  /* ── INIT ── */
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const W = canvas.clientWidth, H = canvas.clientHeight;
    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: false });
    renderer.setSize(W, H); renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true; renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(theme.bg);
    scene.fog = new THREE.FogExp2(theme.bg, 0.006);

    const camera = new THREE.PerspectiveCamera(55, W / H, 0.5, 1000);
    camera.position.set(0, 30, 60); camera.lookAt(0, 0, 0);

    /* --- Lighting --- */
    const ambient = new THREE.AmbientLight(0x223344, 0.4);
    scene.add(ambient);
    const dirLight = new THREE.DirectionalLight(0xffeedd, 0.8);
    dirLight.position.set(50, 80, 30); dirLight.castShadow = true;
    dirLight.shadow.mapSize.set(1024, 1024);
    dirLight.shadow.camera.left = -120; dirLight.shadow.camera.right = 120;
    dirLight.shadow.camera.top = 120; dirLight.shadow.camera.bottom = -120;
    dirLight.shadow.camera.far = 260;
    scene.add(dirLight);

    const hemiLight = new THREE.HemisphereLight(0x445566, 0x111122, 0.3);
    scene.add(hemiLight);

    /* --- Ground --- */
    const groundGeo = new THREE.PlaneGeometry(600, 600);
    const groundMat = new THREE.MeshLambertMaterial({ color: new THREE.Color(theme.bg).lerp(new THREE.Color(0x1a1a2a), 0.3) });
    const ground = new THREE.Mesh(groundGeo, groundMat);
    ground.rotation.x = -Math.PI / 2; ground.receiveShadow = true;
    scene.add(ground);

    /* --- Build city grid from cells --- */
    const sortedCells = [...cells].sort((a, b) => a.date.localeCompare(b.date));
    const maxCount = stats.maxCount || 1;
    const districtCount = sortedCells.length;
    const cols = Math.ceil(Math.sqrt(districtCount * 1.5));
    const rows = Math.ceil(districtCount / cols);

    const BW = 8, BD = 8, ROAD = 6;
    const totalW = cols * (BW + ROAD) + ROAD;
    const totalD = rows * (BD + ROAD) + ROAD;
    const ox = -totalW / 2, oz = -totalD / 2;

    const buildings = []; // for collision
    const roadSegs = [];
    const footpathPoints = [];

    // Road material
    const roadMat = new THREE.MeshLambertMaterial({ color: 0x2a2a35 });
    const fpMat = new THREE.MeshLambertMaterial({ color: 0x3a3a4a });
    const markingMat = new THREE.MeshLambertMaterial({ color: 0xffffff, transparent: true, opacity: 0.15 });

    // Horizontal roads
    for (let r = 0; r <= rows; r++) {
      const rz = oz + r * (BD + ROAD) + ROAD / 2;
      const rx = ox + ROAD / 2;
      const roadMesh = new THREE.Mesh(new THREE.BoxGeometry(totalW, 0.1, ROAD), roadMat);
      roadMesh.position.set(ox + totalW / 2, 0.05, rz); roadMesh.receiveShadow = true;
      scene.add(roadMesh);
      // Center line
      const line = new THREE.Mesh(new THREE.BoxGeometry(totalW, 0.11, 0.15), markingMat);
      line.position.set(ox + totalW / 2, 0.06, rz); scene.add(line);
      // Footpaths
      const fpTop = new THREE.Mesh(new THREE.BoxGeometry(totalW, 0.2, 1.5), fpMat);
      fpTop.position.set(ox + totalW / 2, 0.1, rz - ROAD / 2 - 0.75); fpTop.receiveShadow = true; scene.add(fpTop);
      const fpBot = new THREE.Mesh(new THREE.BoxGeometry(totalW, 0.2, 1.5), fpMat);
      fpBot.position.set(ox + totalW / 2, 0.1, rz + ROAD / 2 + 0.75); fpBot.receiveShadow = true; scene.add(fpBot);
      footpathPoints.push({ x: ox, z: rz - ROAD / 2 - 0.75 }, { x: ox + totalW, z: rz - ROAD / 2 - 0.75 });
      footpathPoints.push({ x: ox, z: rz + ROAD / 2 + 0.75 }, { x: ox + totalW, z: rz + ROAD / 2 + 0.75 });
      roadSegs.push({
        x1: ox, z1: rz, x2: ox + totalW, z2: rz,
        dx: 1, dz: 0, len: totalW, angle: -Math.PI / 2,
      });
    }
    // Vertical roads
    for (let c = 0; c <= cols; c++) {
      const rx = ox + c * (BW + ROAD) + ROAD / 2;
      const roadMesh = new THREE.Mesh(new THREE.BoxGeometry(ROAD, 0.1, totalD), roadMat);
      roadMesh.position.set(rx, 0.05, oz + totalD / 2); roadMesh.receiveShadow = true;
      scene.add(roadMesh);
      const line = new THREE.Mesh(new THREE.BoxGeometry(0.15, 0.11, totalD), markingMat);
      line.position.set(rx, 0.06, oz + totalD / 2); scene.add(line);
      const fpL = new THREE.Mesh(new THREE.BoxGeometry(1.5, 0.2, totalD), fpMat);
      fpL.position.set(rx - ROAD / 2 - 0.75, 0.1, oz + totalD / 2); scene.add(fpL);
      const fpR = new THREE.Mesh(new THREE.BoxGeometry(1.5, 0.2, totalD), fpMat);
      fpR.position.set(rx + ROAD / 2 + 0.75, 0.1, oz + totalD / 2); scene.add(fpR);
      footpathPoints.push({ x: rx - ROAD / 2 - 0.75, z: oz }, { x: rx - ROAD / 2 - 0.75, z: oz + totalD });
      roadSegs.push({
        x1: rx, z1: oz, x2: rx, z2: oz + totalD,
        dx: 0, dz: 1, len: totalD, angle: 0,
      });
    }

    // Buildings
    const accentColor = new THREE.Color(theme.accent);
    const levelColors = theme.levels.map(c => new THREE.Color(c));
    const districts = [];

    sortedCells.forEach((cell, i) => {
      const col = i % cols, row = Math.floor(i / cols);
      const cx = ox + col * (BW + ROAD) + ROAD + BW / 2;
      const cz = oz + row * (BD + ROAD) + ROAD + BD / 2;
      const ratio = cell.count / maxCount;
      const height = cell.count === 0 ? 0.5 : 1 + ratio * 22;
      const lvl = cell.count === 0 ? 0 : Math.min(4, Math.ceil(ratio * 4));

      const bldgGeo = new THREE.BoxGeometry(BW - 1, height, BD - 1);
      const bldgMat = new THREE.MeshLambertMaterial({ color: levelColors[lvl] });
      const mesh = new THREE.Mesh(bldgGeo, bldgMat);
      mesh.position.set(cx, height / 2, cz);
      mesh.castShadow = true; mesh.receiveShadow = true;
      scene.add(mesh);

      // Window lights for tall buildings
      if (height > 4) {
        const floors = Math.floor(height / 2.5);
        const windowMat = new THREE.MeshLambertMaterial({
          color: accentColor,
          emissive: accentColor.clone().multiplyScalar(0.3),
          transparent: true, opacity: 0.5,
        });
        for (let f = 0; f < Math.min(floors, 6); f++) {
          const wy = 1.5 + f * 2.5;
          if (wy > height - 1) break;
          [-1, 1].forEach(side => {
            const win = new THREE.Mesh(new THREE.BoxGeometry(0.6, 0.8, 0.1), windowMat);
            win.position.set(cx + side * 1.5, wy, cz + (BD - 1) / 2 + 0.06);
            scene.add(win);
          });
        }
      }

      // Roof antenna for tall buildings
      if (height > 16) {
        const antMat = new THREE.MeshLambertMaterial({ color: 0xcccccc });
        const ant = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 2, 4), antMat);
        ant.position.set(cx, height + 1, cz); scene.add(ant);
        const blink = new THREE.Mesh(new THREE.SphereGeometry(0.12, 6, 4), new THREE.MeshLambertMaterial({ color: 0xff0000, emissive: new THREE.Color(0.8, 0, 0) }));
        blink.position.set(cx, height + 2.1, cz); scene.add(blink);
      }

      buildings.push({ cx, cz, hw: (BW - 1) / 2 + 0.5, hd: (BD - 1) / 2 + 0.5 });
      districts.push({ cx, cz, cell });
    });

    // Decorations
    const treeTypes = ["oak", "pine", "palm", "cherry"];
    districts.forEach((d, i) => {
      if (i % 5 === 0) addTree(scene, THREE, d.cx + 5, d.cz + 5, treeTypes[i % treeTypes.length]);
      if (i % 8 === 0) addBench(scene, THREE, d.cx - 5, d.cz + 3);
      if (i % 12 === 0) addGarden(scene, THREE, d.cx + 4, d.cz - 4);
      if (i % 15 === 0) addKiosk(scene, THREE, d.cx - 4, d.cz - 5);
    });
    // Signs at intersections
    for (let r = 0; r <= Math.min(rows, 3); r++) {
      for (let c = 0; c <= Math.min(cols, 3); c++) {
        const ix = ox + c * (BW + ROAD) + ROAD / 2;
        const iz = oz + r * (BD + ROAD) + ROAD / 2;
        if (r % 2 === 0 && c % 2 === 0) addTrafficSignal(scene, THREE, ix + 3, iz + 3, ["red", "yellow", "green"][Math.floor(Math.random() * 3)]);
        if (r === 0 && c % 3 === 0) addStreetSign(scene, THREE, ix - 3, iz - 3);
      }
    }

    /* --- Player car --- */
    const playerCar = buildVehicle(scene, THREE, "sedan", parseInt(theme.accent.slice(1), 16));
    playerCar.position.set(ox + ROAD / 2, 0, oz + ROAD / 2);
    const playerState = { speed: 0, angle: Math.PI, maxSpeed: 25, accel: 12, decel: 20, turn: 2.2 };
    const thirdPerson = { dist: 12, height: 6, smoothing: 5 };

    /* --- Traffic --- */
    const trafficSys = createTrafficSystem(scene, THREE, roadSegs, totalW, totalD);
    trafficSys.addCars(Math.min(20, districts.length));

    /* --- Pedestrians --- */
    const pedSys = createPedestrianSystem(scene, THREE, districts, cols, ox, oz, BW, BD, ROAD, footpathPoints, roadSegs);

    /* --- Weather --- */
    const weatherSys = createWeatherSystem(scene, THREE, totalW, totalD);

    /* --- Minimap --- */
    const minimapSize = 180;
    const minimapRenderer = new THREE.WebGLRenderer({ alpha: true, antialias: false });
    minimapRenderer.setSize(minimapSize, minimapSize);
    minimapRenderer.domElement.style.cssText = `position:absolute;bottom:14px;right:14px;border-radius:8px;border:1px solid ${theme.border};pointer-events:none;z-index:20;`;
    canvas.parentElement.appendChild(minimapRenderer.domElement);
    const minimapCam = new THREE.OrthographicCamera(-totalW / 2, totalW / 2, totalD / 2, -totalD / 2, 1, 500);
    minimapCam.position.set(0, 200, 0); minimapCam.lookAt(0, 0, 0);
    const minimapDot = new THREE.Mesh(new THREE.SphereGeometry(2, 6, 4), new THREE.MeshBasicMaterial({ color: 0xff4444 }));
    minimapDot.position.y = 150; scene.add(minimapDot);

    /* --- Input --- */
    const keys = {};
    const onKeyDown = (e) => { keys[e.key.toLowerCase()] = true; };
    const onKeyUp = (e) => { keys[e.key.toLowerCase()] = false; };
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);

    /* --- Resize --- */
    const onResize = () => {
      const w = canvas.parentElement.clientWidth, h = canvas.parentElement.clientHeight;
      renderer.setSize(w, h); camera.aspect = w / h; camera.updateProjectionMatrix();
    };
    window.addEventListener("resize", onResize);

    /* --- Animation loop --- */
    let prevTime = performance.now(), rafId = 0;
    const clock = new THREE.Clock();

    function animate() {
      rafId = requestAnimationFrame(animate);
      const now = performance.now();
      const dt = Math.min((now - prevTime) / 1000, 0.1);
      prevTime = now;

      // Player input
      if (keys["w"] || keys["arrowup"]) playerState.speed = Math.min(playerState.maxSpeed, playerState.speed + playerState.accel * dt);
      else if (keys["s"] || keys["arrowdown"]) playerState.speed = Math.max(-playerState.maxSpeed * 0.4, playerState.speed - playerState.decel * dt);
      else playerState.speed *= Math.max(0, 1 - 3 * dt);
      if (Math.abs(playerState.speed) < 0.05) playerState.speed = 0;

      if (keys["a"] || keys["arrowleft"]) playerState.angle += playerState.turn * dt * (playerState.speed > 0 ? 1 : -1);
      if (keys["d"] || keys["arrowright"]) playerState.angle -= playerState.turn * dt * (playerState.speed > 0 ? 1 : -1);

      // Move car
      const dx = Math.sin(playerState.angle) * playerState.speed * dt;
      const dz = Math.cos(playerState.angle) * playerState.speed * dt;
      playerCar.position.x -= dx;
      playerCar.position.z -= dz;
      playerCar.rotation.y = playerState.angle;

      // Collision
      aabbPushOut(playerCar.position, 1.2, 2, buildings);

      // Boundary clamp
      const boundary = totalW;
      playerCar.position.x = Math.max(-boundary, Math.min(boundary, playerCar.position.x));
      playerCar.position.z = Math.max(-boundary, Math.min(boundary, playerCar.position.z));

      // Camera follow
      const idealX = playerCar.position.x + Math.sin(playerState.angle) * thirdPerson.dist;
      const idealZ = playerCar.position.z + Math.cos(playerState.angle) * thirdPerson.dist;
      const idealY = thirdPerson.height;
      camera.position.x += (idealX - camera.position.x) * thirdPerson.smoothing * dt;
      camera.position.z += (idealZ - camera.position.z) * thirdPerson.smoothing * dt;
      camera.position.y += (idealY - camera.position.y) * thirdPerson.smoothing * dt;
      camera.lookAt(playerCar.position.x, 2, playerCar.position.z);

      // Speed for HUD
      stateRef.current.speed = Math.abs(playerState.speed);

      // Systems
      trafficSys.update(dt);
      pedSys.update(dt);
      weatherSys.update(dt, now);

      // Emergency vehicle lights
      scene.traverse(obj => {
        if (obj.userData && (obj.userData.isAmbulance || obj.userData.isPolice)) {
          updateVehicleLights(obj, dt, now);
        }
      });

      // Minimap dot
      minimapDot.position.x = playerCar.position.x;
      minimapDot.position.z = playerCar.position.z;

      // Render
      renderer.render(scene, camera);
      if (stateRef.current.showMinimap) minimapRenderer.render(scene, minimapCam);
    }

    animate();

    stateRef.current = {
      renderer, scene, camera, trafficSys, pedSys, weatherSys,
      playerCar, playerState, minimapRenderer, showMinimap: true,
      speed: 0, dirLight, ambient, hemiLight, ground,
    };

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup", onKeyUp);
      window.removeEventListener("resize", onResize);
      trafficSys.dispose();
      pedSys.dispose();
      weatherSys.dispose();
      minimapRenderer.dispose();
      minimapRenderer.domElement.remove();
      renderer.dispose();
    };
  }, [cells, stats, theme]);

  /* ── Day/Night toggle ── */
  useEffect(() => {
    const s = stateRef.current; if (!s.dirLight) return;
    if (dayNight === "day") {
      s.ambient.intensity = 1.0; s.dirLight.intensity = 2.0; s.hemiLight.intensity = 0.8;
      s.scene.background.set(0x87ceeb); s.scene.fog.color.set(0x87ceeb);
      s.ground.material.color.set(0x4a6a4a);
    } else {
      s.ambient.intensity = 0.4; s.dirLight.intensity = 0.8; s.hemiLight.intensity = 0.3;
      s.scene.background.set(theme.bg); s.scene.fog.color.set(theme.bg);
      s.ground.material.color.set(new THREE.Color(theme.bg).lerp(new THREE.Color(0x1a1a2a), 0.3));
    }
  }, [dayNight, theme]);

  /* ── Weather toggle ── */
  useEffect(() => {
    const s = stateRef.current; if (!s.weatherSys) return;
    s.weatherSys.setMode(weather);
  }, [weather]);

  /* ── Minimap toggle ── */
  useEffect(() => {
    stateRef.current.showMinimap = showMinimap;
    const el = stateRef.current.minimapRenderer?.domElement;
    if (el) el.style.display = showMinimap ? "block" : "none";
  }, [showMinimap]);

  /* ── Speed HUD ── */
  useEffect(() => {
    const interval = setInterval(() => {
      setSpeed(Math.round(stateRef.current.speed || 0));
    }, 100);
    return () => clearInterval(interval);
  }, []);

  const btnStyle = (active) => ({
    background: active ? `${theme.accent}30` : `${theme.surface}cc`,
    border: `1px solid ${active ? theme.accent : theme.border}`,
    borderRadius: 6, padding: "0.3rem 0.6rem", cursor: "pointer",
    fontFamily: "inherit", fontSize: "0.58rem", fontWeight: active ? 700 : 400,
    color: active ? theme.accent : theme.muted, transition: "all 0.15s",
    letterSpacing: "0.06em",
  });

  return (
    <div style={{ width: "100%", height: "100%", position: "relative" }}>
      <canvas ref={canvasRef} style={{ width: "100%", height: "100%", display: "block" }} />

      {/* HUD Overlay */}
      {showHUD && (
        <>
          {/* Speed */}
          <div style={{
            position: "absolute", bottom: 16, left: 16,
            background: `${theme.surface}dd`, border: `1px solid ${theme.border}`,
            borderRadius: 10, padding: "0.6rem 1rem", zIndex: 20,
            backdropFilter: "blur(8px)",
          }}>
            <div style={{ fontSize: "0.55rem", color: theme.muted, letterSpacing: "0.12em", marginBottom: "0.2rem" }}>SPEED</div>
            <div style={{ fontSize: "1.8rem", fontWeight: 900, color: theme.accent, lineHeight: 1, textShadow: `0 0 10px ${theme.glow}60` }}>
              {speed}
            </div>
            <div style={{ fontSize: "0.5rem", color: theme.muted }}>km/h</div>
          </div>

          {/* Controls hint */}
          <div style={{
            position: "absolute", bottom: 16, left: "50%", transform: "translateX(-50%)",
            background: `${theme.surface}cc`, border: `1px solid ${theme.border}`,
            borderRadius: 8, padding: "0.35rem 0.8rem", zIndex: 20,
            fontSize: "0.55rem", color: theme.muted, letterSpacing: "0.08em",
          }}>
            W/S to drive · A/D to steer
          </div>

          {/* Profile badge */}
          <div style={{
            position: "absolute", top: 14, left: 14,
            background: `${theme.surface}dd`, border: `1px solid ${theme.border}`,
            borderRadius: 8, padding: "0.4rem 0.7rem", zIndex: 20,
            display: "flex", alignItems: "center", gap: "0.5rem",
            backdropFilter: "blur(8px)",
          }}>
            <span style={{ fontSize: "1rem" }}>🏙️</span>
            <div>
              <div style={{ fontSize: "0.6rem", color: theme.accent, fontWeight: 700 }}>@{profile?.name}</div>
              <div style={{ fontSize: "0.5rem", color: theme.muted }}>{profile?.title}</div>
            </div>
          </div>

          {/* Controls */}
          <div style={{
            position: "absolute", top: 14, right: 14,
            display: "flex", flexDirection: "column", gap: "0.35rem", zIndex: 20,
          }}>
            <div style={{ display: "flex", gap: "0.3rem" }}>
              <button onClick={() => setDayNight(d => d === "day" ? "night" : "day")} style={btnStyle(dayNight === "day")}>
                {dayNight === "day" ? "☀ Day" : "🌙 Night"}
              </button>
              <button onClick={() => setShowMinimap(m => !m)} style={btnStyle(showMinimap)}>
                {showMinimap ? "🗺 Map" : "🗺 Map"}
              </button>
            </div>
            <div style={{ display: "flex", gap: "0.3rem", flexWrap: "wrap" }}>
              {["clear", "storm", "snow", "spring"].map(w => (
                <button key={w} onClick={() => setWeather(w)} style={btnStyle(weather === w)}>
                  {{ clear: "☀", storm: "⛈", snow: "❄", spring: "🍂" }[w]} {w}
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
