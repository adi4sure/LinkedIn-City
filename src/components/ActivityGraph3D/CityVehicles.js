/**
 * CityVehicles.js — LinkedInCity
 * Detailed vehicle builders: sedan, suv, sportscar, bus, schoolbus, ambulance, taxi, police, truck
 */

function addBox(p, T, w, h, d, m, px, py, pz, rx=0, ry=0, rz=0) { const o = new T.Mesh(new T.BoxGeometry(w,h,d), m); o.position.set(px,py,pz); o.rotation.set(rx,ry,rz); o.castShadow=true; p.add(o); return o; }
function addWheel(g, T, x, z, dk, ch) {
    const t = new T.Mesh(new T.CylinderGeometry(0.36,0.36,0.22,16), dk); t.rotation.z=Math.PI/2; t.position.set(x,0.28,z); t.castShadow=true; g.add(t);
    const r = new T.Mesh(new T.CylinderGeometry(0.22,0.22,0.24,8), ch); r.rotation.z=Math.PI/2; r.position.set(x>0?x+0.12:x-0.12,0.28,z); g.add(r);
}
function addHeadlights(g, T, zPos) {
    const m = new T.MeshLambertMaterial({ color: 0xfffff0, emissive: new T.Color(0xfffff0).multiplyScalar(0.9) });
    [-0.55,0.55].forEach(x => { const h = new T.Mesh(new T.BoxGeometry(0.38,0.14,0.06), m); h.position.set(x,0.62,zPos); g.add(h); });
}
function addTaillights(g, T, zPos) {
    const m = new T.MeshLambertMaterial({ color: 0xff1100, emissive: new T.Color(0.7,0.05,0) });
    [-0.62,0.62].forEach(x => { const t = new T.Mesh(new T.BoxGeometry(0.32,0.12,0.05), m); t.position.set(x,0.62,zPos); g.add(t); });
}

export function buildSedan(scene, T, color) {
    const g = new T.Group(); const b = new T.MeshLambertMaterial({ color }); const d = new T.MeshLambertMaterial({ color: new T.Color(color).lerp(new T.Color(0,0,0),0.45) }); const gl = new T.MeshLambertMaterial({ color: 0x334466, transparent:true, opacity:0.72 }); const ch = new T.MeshLambertMaterial({ color: 0x999aaa }); const bk = new T.MeshLambertMaterial({ color: 0x111111 });
    addBox(g,T,2.1,0.52,4.2,b,0,0.52,0); addBox(g,T,1.78,0.48,2.15,b,0,0.97,-0.08); addBox(g,T,1.72,0.09,2.0,d,0,1.22,-0.08); addBox(g,T,1.96,0.18,1.0,b,0,0.72,-1.65,0.22,0,0); addBox(g,T,2.08,0.22,0.17,d,0,0.30,-2.13); addBox(g,T,2.08,0.22,0.17,d,0,0.30,2.13);
    addBox(g,T,1.68,0.46,0.07,gl,0,0.98,-1.22,-0.28,0,0); addBox(g,T,1.66,0.38,0.07,gl,0,0.97,1.0,0.28,0,0); [-0.9,0.9].forEach(x=>addBox(g,T,0.06,0.35,1.78,gl,x,0.97,-0.08));
    [[1.1,-1.4],[-1.1,-1.4],[1.1,1.3],[-1.1,1.3]].forEach(([x,z])=>addWheel(g,T,x,z,bk,ch));
    addHeadlights(g,T,-2.14); addTaillights(g,T,2.14);
    const sp = new T.SpotLight(0xffffff,2.2,42,Math.PI/7,0.7); sp.position.set(0,0.78,-2.1); sp.target.position.set(0,0,-22); g.add(sp); g.add(sp.target);
    scene.add(g); return g;
}

export function buildSUV(scene, T, color) {
    const g = new T.Group(); const b = new T.MeshLambertMaterial({ color }); const d = new T.MeshLambertMaterial({ color: new T.Color(color).lerp(new T.Color(0,0,0),0.4) }); const gl = new T.MeshLambertMaterial({ color:0x223355, transparent:true, opacity:0.7 }); const ch = new T.MeshLambertMaterial({ color:0x888899 }); const bk = new T.MeshLambertMaterial({ color: 0x111111 });
    addBox(g,T,2.3,0.62,4.6,b,0,0.55,0); addBox(g,T,2.22,0.68,2.9,b,0,1.11,0.12); addBox(g,T,2.0,0.06,2.6,d,0,1.49,0.12); addBox(g,T,2.3,0.28,0.22,d,0,0.35,-2.35);
    addBox(g,T,2.1,0.6,0.07,gl,0,1.1,-1.52,-0.22,0,0); addBox(g,T,2.1,0.6,0.07,gl,0,1.1,1.52,0.22,0,0); [-1.12,1.12].forEach(x=>addBox(g,T,0.06,0.5,2.7,gl,x,1.12,0.12));
    [[1.18,-1.55],[-1.18,-1.55],[1.18,1.45],[-1.18,1.45]].forEach(([x,z])=>addWheel(g,T,x,z,bk,ch));
    addHeadlights(g,T,-2.4); addTaillights(g,T,2.4);
    scene.add(g); return g;
}

export function buildSportsCar(scene, T, color) {
    const g = new T.Group(); const b = new T.MeshLambertMaterial({ color }); const d = new T.MeshLambertMaterial({ color: new T.Color(color).lerp(new T.Color(0,0,0),0.5) }); const gl = new T.MeshLambertMaterial({ color:0x445577, transparent:true, opacity:0.65 }); const ch = new T.MeshLambertMaterial({ color:0xaaaacc }); const bk = new T.MeshLambertMaterial({ color: 0x111111 });
    addBox(g,T,2.2,0.38,4.4,b,0,0.38,0); addBox(g,T,1.82,0.38,1.75,b,0,0.7,-0.15); addBox(g,T,1.76,0.07,1.6,d,0,0.9,-0.15); addBox(g,T,2.1,0.12,1.5,b,0,0.5,-1.7,0.1,0,0); addBox(g,T,1.9,0.1,0.36,d,0,0.64,2.1);
    addBox(g,T,1.78,0.42,0.07,gl,0,0.78,-1.1,-0.48,0,0); [-0.92,0.92].forEach(x=>addBox(g,T,0.05,0.3,1.6,gl,x,0.72,-0.2));
    [[1.12,-1.45],[-1.12,-1.45],[1.12,1.35],[-1.12,1.35]].forEach(([x,z])=>addWheel(g,T,x,z,bk,ch));
    addHeadlights(g,T,-2.22); addTaillights(g,T,2.22);
    scene.add(g); return g;
}

export function buildAmbulance(scene, T) {
    const g = new T.Group(); const wh = new T.MeshLambertMaterial({ color:0xf0f0f0 }); const dk = new T.MeshLambertMaterial({ color:0x1a1a2a }); const ch = new T.MeshLambertMaterial({ color:0x888899 }); const bk = new T.MeshLambertMaterial({ color: 0x111111 });
    addBox(g,T,2.45,1.68,5.8,wh,0,1.08,0); addBox(g,T,2.47,0.22,5.82,new T.MeshLambertMaterial({ color:0xaadd00 }),0,1.28,0);
    const redMat = new T.MeshLambertMaterial({ color:0xcc0000 }); addBox(g,T,2.47,0.12,5.82,redMat,0,0.88,0);
    const crossMat = new T.MeshLambertMaterial({ color:0xdd0000, emissive:new T.Color(0.3,0,0) }); addBox(g,T,0.55,0.14,0.06,crossMat,0,1.1,3.0); addBox(g,T,0.14,0.55,0.06,crossMat,0,1.1,3.0);
    const lbBase = new T.Mesh(new T.BoxGeometry(2.1,0.1,0.65), ch); lbBase.position.set(0,2.02,-1.0); g.add(lbBase);
    const podColors = [0xff0000,0x0044ff,0xff0000,0x0044ff,0xff0000,0x0044ff];
    podColors.forEach((col,i) => { const pm = new T.MeshLambertMaterial({ color:col, emissive:new T.Color(col).multiplyScalar(0.7) }); const pod = new T.Mesh(new T.BoxGeometry(0.28,0.16,0.5), pm); pod.position.set(-0.7+i*0.28,2.11,-1.0); g.add(pod); g.userData.lightPods = g.userData.lightPods || []; g.userData.lightPods.push({ mesh:pod, baseColor:col, index:i }); });
    const rl = new T.PointLight(0xff0000,0,22); const bl = new T.PointLight(0x0044ff,0,22); rl.position.set(-0.55,2.2,-1.0); bl.position.set(0.55,2.2,-1.0); g.add(rl); g.add(bl); g.userData.redLight=rl; g.userData.blueLight=bl; g.userData.flashTimer=0; g.userData.isAmbulance=true;
    [[1.25,-1.85],[-1.25,-1.85],[1.25,1.75],[-1.25,1.75]].forEach(([x,z])=>addWheel(g,T,x,z,bk,ch));
    addHeadlights(g,T,-3.02); addTaillights(g,T,3.02);
    scene.add(g); return g;
}

export function buildTaxi(scene, T) {
    const g = new T.Group(); const y = new T.MeshLambertMaterial({ color:0xffc107 }); const dk = new T.MeshLambertMaterial({ color:0x111122 }); const gl = new T.MeshLambertMaterial({ color:0x334466, transparent:true, opacity:0.7 }); const ch = new T.MeshLambertMaterial({ color:0x999aaa }); const bk = new T.MeshLambertMaterial({ color: 0x111111 });
    addBox(g,T,2.08,0.5,4.15,y,0,0.5,0); addBox(g,T,1.75,0.46,2.1,y,0,0.94,-0.1); addBox(g,T,1.7,0.08,1.95,dk,0,1.2,-0.1);
    const signMat = new T.MeshLambertMaterial({ color:0xffee44, emissive:new T.Color(0.5,0.45,0) }); addBox(g,T,0.6,0.15,0.1,signMat,0,1.3,-0.1);
    addBox(g,T,1.65,0.44,0.06,gl,0,0.96,-1.2,-0.27,0,0); [-0.88,0.88].forEach(x=>addBox(g,T,0.05,0.34,1.74,gl,x,0.95,-0.1));
    [[1.08,-1.4],[-1.08,-1.4],[1.08,1.3],[-1.08,1.3]].forEach(([x,z])=>addWheel(g,T,x,z,bk,ch));
    addHeadlights(g,T,-2.12); addTaillights(g,T,2.12);
    scene.add(g); return g;
}

export function buildPoliceCar(scene, T) {
    const g = new T.Group(); const wh = new T.MeshLambertMaterial({ color:0xeeeeee }); const dk = new T.MeshLambertMaterial({ color:new T.Color(0xeeeeee).lerp(new T.Color(0,0,0),0.5) }); const gl = new T.MeshLambertMaterial({ color:0x334466, transparent:true, opacity:0.7 }); const ch = new T.MeshLambertMaterial({ color:0x999aaa }); const bk = new T.MeshLambertMaterial({ color: 0x111111 });
    addBox(g,T,2.12,0.52,4.25,wh,0,0.52,0); addBox(g,T,1.8,0.48,2.15,wh,0,0.98,-0.08); addBox(g,T,1.74,0.09,2.0,dk,0,1.23,-0.08);
    addBox(g,T,2.14,0.4,2.2,new T.MeshLambertMaterial({ color:0x111111 }),0,0.42,0.5); addBox(g,T,2.14,0.4,1.8,wh,0,0.42,-1.0);
    const lbBase = new T.Mesh(new T.BoxGeometry(1.9,0.1,0.55), ch); lbBase.position.set(0,1.35,-0.1); g.add(lbBase);
    const rp = new T.MeshLambertMaterial({ color:0xff0000, emissive:new T.Color(0.7,0,0) }); const bp = new T.MeshLambertMaterial({ color:0x0044ff, emissive:new T.Color(0,0.1,0.8) });
    [-0.65,-0.22,0.22,0.65].forEach((x,i) => { const pod = new T.Mesh(new T.BoxGeometry(0.32,0.16,0.44), i%2===0?rp:bp); pod.position.set(x,1.44,-0.1); g.add(pod); g.userData.lightPods = g.userData.lightPods || []; g.userData.lightPods.push({ mesh:pod, index:i }); });
    const rl = new T.PointLight(0xff0000,0,20); const bl = new T.PointLight(0x0044ff,0,20); rl.position.set(-0.55,1.5,-0.1); bl.position.set(0.55,1.5,-0.1); g.add(rl); g.add(bl); g.userData.redLight=rl; g.userData.blueLight=bl; g.userData.flashTimer=0; g.userData.isPolice=true;
    addBox(g,T,1.7,0.46,0.07,gl,0,0.99,-1.23,-0.28,0,0); [-0.9,0.9].forEach(x=>addBox(g,T,0.06,0.35,1.78,gl,x,0.98,-0.08));
    [[1.1,-1.43],[-1.1,-1.43],[1.1,1.32],[-1.1,1.32]].forEach(([x,z])=>addWheel(g,T,x,z,bk,ch));
    addHeadlights(g,T,-2.16); addTaillights(g,T,2.16);
    scene.add(g); return g;
}

export function buildSchoolBus(scene, T) {
    const g = new T.Group(); const y = new T.MeshLambertMaterial({ color:0xffd700 }); const dk = new T.MeshLambertMaterial({ color:0x1a1a1a }); const bk = new T.MeshLambertMaterial({ color:0x111111 }); const gl = new T.MeshLambertMaterial({ color:0x334455, transparent:true, opacity:0.65 }); const ch = new T.MeshLambertMaterial({ color:0x888899 });
    addBox(g,T,2.55,1.5,8.2,y,0,1.02,0); addBox(g,T,2.5,0.09,8.1,dk,0,1.8,0);
    [[1.3,-3.0],[-1.3,-3.0],[1.3,-1.4],[-1.3,-1.4],[1.3,2.8],[-1.3,2.8]].forEach(([x,z])=>addWheel(g,T,x,z,bk,ch));
    scene.add(g); return g;
}

export const VEHICLE_TYPES = ["sedan","suv","sportscar","bus","schoolbus","ambulance","taxi","police","truck"];
const VEHICLE_COLORS = { sedan:[0x2244aa,0x228844,0x884422,0x663399], suv:[0x222222,0x3a3a5c], sportscar:[0xcc0000,0xff6600,0x0066cc], bus:[0x2255aa,0x224422], schoolbus:null, ambulance:null, taxi:null, police:null, truck:[0xcc4400,0x334455] };

export function buildVehicle(scene, T, type, colorOverride = null) {
    const palette = VEHICLE_COLORS[type];
    const color = colorOverride ?? (palette ? palette[Math.floor(Math.random()*palette.length)] : 0xffffff);
    switch(type) {
        case "sedan": return buildSedan(scene,T,color);
        case "suv": return buildSUV(scene,T,color);
        case "sportscar": return buildSportsCar(scene,T,color);
        case "ambulance": return buildAmbulance(scene,T);
        case "taxi": return buildTaxi(scene,T);
        case "police": return buildPoliceCar(scene,T);
        case "schoolbus": return buildSchoolBus(scene,T);
        default: return buildSedan(scene,T,color);
    }
}

export function updateVehicleLights(vehicle, dt, now) {
    if (!vehicle.userData.redLight) return;
    vehicle.userData.flashTimer = (vehicle.userData.flashTimer || 0) + dt;
    const t = vehicle.userData.flashTimer;
    const fast = Math.sin(t * 8) > 0;
    vehicle.userData.redLight.intensity = fast ? 3.5 : 0;
    vehicle.userData.blueLight.intensity = fast ? 0 : 3.5;
    if (vehicle.userData.lightPods) {
        vehicle.userData.lightPods.forEach(({ mesh, index }) => { mesh.material.emissiveIntensity = ((index % 2 === 0) === fast) ? 1 : 0.08; });
    }
}
