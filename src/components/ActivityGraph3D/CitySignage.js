/**
 * CitySignage.js — LinkedInCity
 * Traffic signals, street signs, distance boards, billboards
 */

export function addTrafficSignal(scene, THREE, x, z, state = "red") {
    const group = new THREE.Group();
    const poleMat = new THREE.MeshLambertMaterial({ color: 0x333333 });
    const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.1, 4, 8), poleMat);
    pole.position.y = 2; pole.castShadow = true; group.add(pole);
    const housing = new THREE.Mesh(new THREE.BoxGeometry(0.6, 1.6, 0.2), new THREE.MeshLambertMaterial({ color: 0x1a1a1a }));
    housing.position.y = 3.5; housing.castShadow = true; group.add(housing);
    const states = [
        { pos: 0.4, color: 0xff0000, emissive: new THREE.Color(1, 0, 0) },
        { pos: 0, color: 0xffff00, emissive: new THREE.Color(1, 1, 0) },
        { pos: -0.4, color: 0x00ff00, emissive: new THREE.Color(0, 1, 0) },
    ];
    states.forEach((s, i) => {
        const lightBulb = new THREE.Mesh(
            new THREE.SphereGeometry(0.15, 8, 8),
            new THREE.MeshLambertMaterial({
                color: s.color,
                emissive: state === ["red", "yellow", "green"][i] ? s.emissive : new THREE.Color(0, 0, 0),
            })
        );
        lightBulb.position.set(0, 2.9 + s.pos, 0.12); group.add(lightBulb);
        if (state === ["red", "yellow", "green"][i]) {
            const pl = new THREE.PointLight(s.color, 1.5, 20);
            pl.position.copy(lightBulb.position); group.add(pl);
        }
    });
    group.position.set(x, 0, z); scene.add(group); return group;
}

export function addStreetSign(scene, THREE, x, z, street1 = "LinkedIn Ave", street2 = "Network St") {
    const group = new THREE.Group();
    const poleMat = new THREE.MeshLambertMaterial({ color: 0x444444 });
    const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.08, 3.5, 8), poleMat);
    pole.position.y = 1.75; pole.castShadow = true; group.add(pole);
    const arm = new THREE.Mesh(new THREE.BoxGeometry(2.5, 0.08, 0.15), poleMat);
    arm.position.set(1.2, 3, 0); arm.rotation.z = 0.05; group.add(arm);
    const signMat = new THREE.MeshLambertMaterial({ color: 0x0A66C2 });
    const p1 = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.5, 0.15), signMat);
    p1.position.set(0.2, 3.4, 0.08); p1.castShadow = true; group.add(p1);
    const p2 = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.5, 0.15), signMat);
    p2.position.set(2.2, 3.2, 0.08); p2.castShadow = true; group.add(p2);
    group.userData = { street1, street2 };
    group.position.set(x, 0, z); scene.add(group); return group;
}

export function addDistanceBoard(scene, THREE, x, z, text = "LinkedIn · 5.2 km") {
    const group = new THREE.Group();
    const poleMat = new THREE.MeshLambertMaterial({ color: 0x3a3a3a });
    const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.07, 2.5, 6), poleMat);
    pole.position.y = 1.25; pole.castShadow = true; group.add(pole);
    const board = new THREE.Mesh(new THREE.BoxGeometry(1.8, 0.6, 0.12), new THREE.MeshLambertMaterial({ color: 0x0A66C2 }));
    board.position.y = 2.2; board.castShadow = true; group.add(board);
    group.userData = { text };
    group.position.set(x, 0, z); scene.add(group); return group;
}

export function addBillboard(scene, THREE, x, z, width = 4, height = 2.5) {
    const group = new THREE.Group();
    const poleMat = new THREE.MeshLambertMaterial({ color: 0x333333 });
    const pole1 = new THREE.Mesh(new THREE.CylinderGeometry(0.15, 0.2, 4, 8), poleMat);
    pole1.position.set(-width / 2 + 0.3, 2, 0); pole1.castShadow = true; group.add(pole1);
    const pole2 = pole1.clone(); pole2.position.set(width / 2 - 0.3, 2, 0); group.add(pole2);
    const billboard = new THREE.Mesh(new THREE.BoxGeometry(width, height, 0.15), new THREE.MeshLambertMaterial({ color: 0xeeee99 }));
    billboard.position.y = 2.5 + height / 2; billboard.castShadow = true; group.add(billboard);
    const lightMat = new THREE.MeshLambertMaterial({ color: 0xffffff, emissive: new THREE.Color(0.3, 0.3, 0.3) });
    for (let i = 0; i < 4; i++) {
        const ls = new THREE.Mesh(new THREE.BoxGeometry(width - 0.3, 0.08, 0.05), lightMat);
        ls.position.y = 1.5 + i * (height / 3.5); ls.position.z = 0.1; group.add(ls);
    }
    group.position.set(x, 0, z); scene.add(group); return group;
}
