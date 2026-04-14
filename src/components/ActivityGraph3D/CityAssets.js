/**
 * CityAssets.js — LinkedInCity
 * Decorative city assets: benches, gardens, kiosks, plazas, playgrounds
 */

export function addBench(scene, THREE, x, z) {
    const group = new THREE.Group();
    const woodMat = new THREE.MeshLambertMaterial({ color: 0x8b6f47 });
    const metalMat = new THREE.MeshLambertMaterial({ color: 0x5a5a5a });
    const seat = new THREE.Mesh(new THREE.BoxGeometry(2.4, 0.1, 0.5), woodMat);
    seat.position.y = 0.45; seat.castShadow = true; group.add(seat);
    const back = new THREE.Mesh(new THREE.BoxGeometry(2.4, 0.6, 0.12), woodMat);
    back.position.y = 0.85; back.position.z = -0.25; back.rotation.x = 0.15; back.castShadow = true; group.add(back);
    [[-1.1, -0.2], [-1.1, 0.2], [1.1, -0.2], [1.1, 0.2]].forEach(([lx, lz]) => {
        const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 0.45, 8), metalMat);
        leg.position.set(lx, 0.225, lz); leg.castShadow = true; group.add(leg);
    });
    group.position.set(x, 0, z); scene.add(group); return group;
}

export function addGarden(scene, THREE, x, z, size = 1) {
    const group = new THREE.Group();
    const boxMat = new THREE.MeshLambertMaterial({ color: 0x7a5c3d });
    const box = new THREE.Mesh(new THREE.BoxGeometry(1.2 * size, 0.4 * size, 1.2 * size), boxMat);
    box.position.y = 0.2 * size; box.castShadow = true; group.add(box);
    const soil = new THREE.Mesh(new THREE.BoxGeometry(1.15 * size, 0.38 * size, 1.15 * size), new THREE.MeshLambertMaterial({ color: 0x4a3c2a }));
    soil.position.y = 0.25 * size; group.add(soil);
    const flowerColors = [0xff6b9d, 0xffb347, 0x87ceeb, 0xffff99, 0xb19cd9];
    for (let i = 0; i < 8; i++) {
        const ang = (i / 8) * Math.PI * 2, rad = 0.35 * size;
        const flower = new THREE.Mesh(new THREE.SphereGeometry(0.15 * size, 8, 8), new THREE.MeshLambertMaterial({ color: flowerColors[i % flowerColors.length] }));
        flower.position.set(x + Math.cos(ang) * rad, 0.5 * size, z + Math.sin(ang) * rad);
        flower.castShadow = true; scene.add(flower); group.add(flower);
    }
    group.position.set(x, 0, z); scene.add(group); return group;
}

export function addKiosk(scene, THREE, x, z) {
    const group = new THREE.Group();
    const baseMat = new THREE.MeshLambertMaterial({ color: 0x8b7355 });
    const base = new THREE.Mesh(new THREE.BoxGeometry(1.5, 0.15, 1.5), baseMat);
    base.castShadow = true; group.add(base);
    const wallMat = new THREE.MeshLambertMaterial({ color: 0xffe6cc });
    for (let i = 0; i < 4; i++) {
        const angle = (i / 4) * Math.PI * 2;
        const wall = new THREE.Mesh(new THREE.BoxGeometry(0.15, 1.2, 0.6), wallMat);
        wall.position.set(Math.cos(angle) * 0.7, 0.6, Math.sin(angle) * 0.7);
        wall.rotation.y = angle; wall.castShadow = true; group.add(wall);
    }
    const roof = new THREE.Mesh(new THREE.ConeGeometry(1.1, 0.6, 16), new THREE.MeshLambertMaterial({ color: 0xff6b35 }));
    roof.position.y = 1.35; roof.castShadow = true; group.add(roof);
    group.position.set(x, 0, z); scene.add(group); return group;
}

export function decoratePlaza(scene, THREE, centerX, centerZ, radius, density = 0.15) {
    const assetTypes = [
        (x, z) => addBench(scene, THREE, x, z),
        (x, z) => addGarden(scene, THREE, x, z, 0.8),
        (x, z) => addKiosk(scene, THREE, x, z),
    ];
    const gridSize = 3;
    for (let gx = -gridSize; gx <= gridSize; gx++) {
        for (let gz = -gridSize; gz <= gridSize; gz++) {
            if (Math.random() > density) continue;
            const px = centerX + gx * 2.5, pz = centerZ + gz * 2.5;
            if (Math.sqrt((px - centerX) ** 2 + (pz - centerZ) ** 2) > radius) continue;
            assetTypes[Math.floor(Math.random() * assetTypes.length)](px, pz);
        }
    }
}
