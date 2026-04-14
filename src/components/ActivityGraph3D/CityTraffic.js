/**
 * CityTraffic.js — LinkedInCity
 * Traffic system with cars, trucks, buses on road segments.
 */

export function createTrafficSystem(scene, THREE, roadSegs, cityW, cityD) {
    const traffic = [];
    const darkMat = new THREE.MeshLambertMaterial({ color: 0x111111 });
    const trafficColors = [0xff3300, 0x0055ff, 0x33cc44, 0xffaa00, 0xcc22cc, 0x00cccc, 0xff8800, 0x8844ff, 0xffffff, 0x884400];

    function buildCar(color) {
        const g = new THREE.Group();
        const mat = new THREE.MeshLambertMaterial({ color });
        const body = new THREE.Mesh(new THREE.BoxGeometry(1.8, 0.52, 3.4), mat);
        body.position.y = 0.38; body.castShadow = true; g.add(body);
        const cab = new THREE.Mesh(new THREE.BoxGeometry(1.4, 0.44, 1.8), mat);
        cab.position.y = 0.8; cab.castShadow = true; g.add(cab);
        [[0.85, -1.05], [-0.85, -1.05], [0.85, 1.0], [-0.85, 1.0]].forEach(([wx, wz]) => {
            const w = new THREE.Mesh(new THREE.CylinderGeometry(0.28, 0.28, 0.24, 10), darkMat);
            w.rotation.z = Math.PI / 2; w.position.set(wx, 0.22, wz); w.castShadow = true; g.add(w);
        });
        const tl = new THREE.Mesh(new THREE.BoxGeometry(1.5, 0.07, 0.05), new THREE.MeshLambertMaterial({ color: 0xff1100, emissive: new THREE.Color(0.5, 0, 0) }));
        tl.position.set(0, 0.55, 1.72); g.add(tl);
        scene.add(g); return g;
    }

    function buildTruck(color) {
        const g = new THREE.Group();
        const mat = new THREE.MeshLambertMaterial({ color });
        const cab = new THREE.Mesh(new THREE.BoxGeometry(2.2, 1.4, 2.8), mat);
        cab.position.set(0, 0.85, -2.2); cab.castShadow = true; g.add(cab);
        const trailer = new THREE.Mesh(new THREE.BoxGeometry(2.1, 1.6, 6), new THREE.MeshLambertMaterial({ color: 0x888899 }));
        trailer.position.set(0, 1.0, 1.5); trailer.castShadow = true; g.add(trailer);
        [[1.0, -2.8], [-1.0, -2.8], [1.0, 0.5], [-1.0, 0.5], [1.0, 3.5], [-1.0, 3.5]].forEach(([wx, wz]) => {
            const w = new THREE.Mesh(new THREE.CylinderGeometry(0.42, 0.42, 0.32, 10), darkMat);
            w.rotation.z = Math.PI / 2; w.position.set(wx, 0.32, wz); w.castShadow = true; g.add(w);
        });
        scene.add(g); return g;
    }

    function buildBus() {
        const g = new THREE.Group();
        const body = new THREE.Mesh(new THREE.BoxGeometry(2.5, 1.6, 9.5), new THREE.MeshLambertMaterial({ color: 0xffcc00 }));
        body.position.y = 0.95; body.castShadow = true; g.add(body);
        const windows = new THREE.Mesh(new THREE.BoxGeometry(2.52, 0.55, 7.5), new THREE.MeshLambertMaterial({ color: 0x88aacc, transparent: true, opacity: 0.7 }));
        windows.position.y = 1.4; g.add(windows);
        [[1.18, -3.2], [-1.18, -3.2], [1.18, 0], [-1.18, 0], [1.18, 3.2], [-1.18, 3.2]].forEach(([wx, wz]) => {
            const w = new THREE.Mesh(new THREE.CylinderGeometry(0.44, 0.44, 0.34, 12), darkMat);
            w.rotation.z = Math.PI / 2; w.position.set(wx, 0.3, wz); w.castShadow = true; g.add(w);
        });
        scene.add(g); return g;
    }

    function moveOnRoad(vehicle, dt) {
        const seg = roadSegs[vehicle.segIdx]; if (!seg) return;
        vehicle.t += vehicle.speed * dt / seg.len * vehicle.dir;
        if (vehicle.t > 1 || vehicle.t < 0) {
            vehicle.t = vehicle.t > 1 ? 0 : 1;
            let bestIdx = vehicle.segIdx, bestDist = Infinity;
            const endX = vehicle.dir > 0 ? seg.x2 : seg.x1, endZ = vehicle.dir > 0 ? seg.z2 : seg.z1;
            roadSegs.forEach((s, si) => {
                if (si === vehicle.segIdx) return;
                const d = Math.min(Math.sqrt((s.x1 - endX) ** 2 + (s.z1 - endZ) ** 2), Math.sqrt((s.x2 - endX) ** 2 + (s.z2 - endZ) ** 2));
                if (d < bestDist && d < 5) { bestDist = d; bestIdx = si; }
            });
            vehicle.segIdx = bestIdx;
            if (Math.random() > 0.7) vehicle.dir *= -1;
        }
        const cs = roadSegs[vehicle.segIdx];
        const t = Math.max(0, Math.min(1, vehicle.t));
        const px = cs.x1 + cs.dx * cs.len * t, pz = cs.z1 + cs.dz * cs.len * t;
        const laneOffset = vehicle.dir * 1.8;
        vehicle.group.position.set(px - cs.dz * laneOffset, 0, pz + cs.dx * laneOffset);
        vehicle.group.rotation.y = vehicle.dir > 0 ? cs.angle : cs.angle + Math.PI;
    }

    function addVehicle(type = "car") {
        if (roadSegs.length === 0) return null;
        const si = Math.floor(Math.random() * roadSegs.length);
        let group, speed;
        if (type === "truck") { group = buildTruck(trafficColors[Math.floor(Math.random() * trafficColors.length)]); speed = 1.2 + Math.random() * 0.8; }
        else if (type === "bus") { group = buildBus(); speed = 1.4 + Math.random() * 0.5; }
        else { group = buildCar(trafficColors[Math.floor(Math.random() * trafficColors.length)]); speed = 2 + Math.random() * 2.5; }
        const vehicle = { group, type, segIdx: si, t: Math.random(), speed, dir: Math.random() > 0.5 ? 1 : -1 };
        traffic.push(vehicle); return vehicle;
    }

    function addCars(count) {
        for (let i = 0; i < count; i++) {
            const r = Math.random();
            if (r < 0.7) addVehicle("car"); else if (r < 0.85) addVehicle("truck"); else addVehicle("bus");
        }
    }

    function update(dt) { traffic.forEach(v => moveOnRoad(v, dt)); }

    function dispose() {
        traffic.forEach(v => { v.group.children.forEach(c => { if (c.geometry) c.geometry.dispose(); if (c.material) c.material.dispose(); }); scene.remove(v.group); });
        traffic.length = 0;
    }

    return { addVehicle, addCars, update, dispose, getCount: () => traffic.length };
}
