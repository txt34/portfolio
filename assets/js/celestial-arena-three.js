import * as THREE from 'https://unpkg.com/three@0.160.0/build/three.module.js';

export function initCelestialArena(container) {
  if (!container) return;
  if (container.querySelector('canvas')) return;

  const width = container.clientWidth || 600;
  const height = container.clientHeight || 360;

  const canvas = document.createElement('canvas');
  canvas.className = 'celestial-webgl-canvas';
  container.insertBefore(canvas, container.firstChild);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 1000);
  camera.position.set(0, -3.8, 4.6);
  camera.lookAt(0, 0, 0);

  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: 'high-performance' });
  renderer.setSize(width, height, false);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  // Ultra-bright 3D Lighting for striking luminosity and 3D spherical volume
  const ambientLight = new THREE.AmbientLight(0x5566aa, 0.8);
  scene.add(ambientLight);

  const dirLight = new THREE.DirectionalLight(0xffffff, 4.5);
  dirLight.position.set(4, 4, 6);
  scene.add(dirLight);

  const orangeLight = new THREE.PointLight(0xff8800, 9, 20);
  orangeLight.position.set(3, 2, 2);
  scene.add(orangeLight);

  const maroonLight = new THREE.PointLight(0xcc1144, 9, 20);
  maroonLight.position.set(-3, -2, 2);
  scene.add(maroonLight);

  // Starfield particles
  const starCount = 400;
  const starGeometry = new THREE.BufferGeometry();
  const starPositions = new Float32Array(starCount * 3);
  for (let i = 0; i < starCount * 3; i += 3) {
    starPositions[i] = (Math.random() - 0.5) * 18;
    starPositions[i + 1] = (Math.random() - 0.5) * 18;
    starPositions[i + 2] = (Math.random() - 0.5) * 18;
  }
  starGeometry.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));
  const starMaterial = new THREE.PointsMaterial({ color: 0xffffff, size: 0.05, transparent: true, opacity: 0.95 });
  const starField = new THREE.Points(starGeometry, starMaterial);
  scene.add(starField);

  // Central Core
  const coreGeo = new THREE.IcosahedronGeometry(0.75, 1);
  const coreMat = new THREE.MeshPhongMaterial({
    color: 0x312e81,
    emissive: 0xff7200,
    emissiveIntensity: 0.6,
    specular: 0xffffff,
    shininess: 80,
    wireframe: true
  });
  const coreMesh = new THREE.Mesh(coreGeo, coreMat);
  scene.add(coreMesh);

  // Inner Core Solid
  const innerCoreGeo = new THREE.SphereGeometry(0.52, 32, 32);
  const innerCoreMat = new THREE.MeshPhongMaterial({
    color: 0x0f172a,
    emissive: 0x990033,
    emissiveIntensity: 0.7,
    specular: 0xffffff,
    shininess: 100
  });
  const innerCore = new THREE.Mesh(innerCoreGeo, innerCoreMat);
  scene.add(innerCore);

  // BGSU Orbit & Bright 3D Sphere (Fred Falcon)
  const bgsuGroup = new THREE.Group();
  scene.add(bgsuGroup);

  const bgsuRadiusX = 2.6;
  const bgsuRadiusZ = 1.9;
  const bgsuPoints = [];
  for (let i = 0; i <= 80; i++) {
    const theta = (i / 80) * Math.PI * 2;
    bgsuPoints.push(new THREE.Vector3(Math.cos(theta) * bgsuRadiusX, 0, Math.sin(theta) * bgsuRadiusZ));
  }
  const bgsuOrbitGeo = new THREE.BufferGeometry().setFromPoints(bgsuPoints);
  const bgsuOrbitMat = new THREE.LineDashedMaterial({ color: 0xff8800, dashSize: 0.1, gapSize: 0.05, transparent: true, opacity: 0.85 });
  const bgsuOrbitLine = new THREE.Line(bgsuOrbitGeo, bgsuOrbitMat);
  bgsuOrbitLine.computeLineDistances();
  bgsuGroup.add(bgsuOrbitLine);

  const bgsuSphereGeo = new THREE.SphereGeometry(0.27, 32, 32);
  const bgsuSphereMat = new THREE.MeshPhongMaterial({
    color: 0xff7200,
    emissive: 0xff5500,
    emissiveIntensity: 0.85,
    specular: 0xffffff,
    shininess: 120
  });
  const bgsuMascotMesh = new THREE.Mesh(bgsuSphereGeo, bgsuSphereMat);
  bgsuGroup.add(bgsuMascotMesh);

  const bgsuRingGeo = new THREE.TorusGeometry(0.36, 0.018, 16, 48);
  const bgsuRingMat = new THREE.MeshBasicMaterial({ color: 0xffd166, transparent: true, opacity: 0.95 });
  const bgsuRing = new THREE.Mesh(bgsuRingGeo, bgsuRingMat);
  bgsuRing.rotation.x = Math.PI / 2;
  bgsuMascotMesh.add(bgsuRing);

  // Fordham Orbit & Bright 3D Sphere (Rammy)
  const fordhamGroup = new THREE.Group();
  scene.add(fordhamGroup);

  const fordhamRadiusX = 3.6;
  const fordhamRadiusZ = 2.8;
  const fordhamPoints = [];
  for (let i = 0; i <= 80; i++) {
    const theta = (i / 80) * Math.PI * 2;
    fordhamPoints.push(new THREE.Vector3(Math.cos(theta) * fordhamRadiusX, 0, Math.sin(theta) * fordhamRadiusZ));
  }
  const fordhamOrbitGeo = new THREE.BufferGeometry().setFromPoints(fordhamPoints);
  const fordhamOrbitMat = new THREE.LineDashedMaterial({ color: 0xcc1144, dashSize: 0.12, gapSize: 0.06, transparent: true, opacity: 0.85 });
  const fordhamOrbitLine = new THREE.Line(fordhamOrbitGeo, fordhamOrbitMat);
  fordhamOrbitLine.computeLineDistances();
  fordhamGroup.add(fordhamOrbitLine);

  const fordhamSphereGeo = new THREE.SphereGeometry(0.31, 32, 32);
  const fordhamSphereMat = new THREE.MeshPhongMaterial({
    color: 0xa50021,
    emissive: 0x77001a,
    emissiveIntensity: 0.85,
    specular: 0xffffff,
    shininess: 120
  });
  const fordhamMascotMesh = new THREE.Mesh(fordhamSphereGeo, fordhamSphereMat);
  fordhamGroup.add(fordhamMascotMesh);

  const fordhamRingGeo = new THREE.TorusGeometry(0.42, 0.018, 16, 48);
  const fordhamRingMat = new THREE.MeshBasicMaterial({ color: 0xff8fa3, transparent: true, opacity: 0.95 });
  const fordhamRing = new THREE.Mesh(fordhamRingGeo, fordhamRingMat);
  fordhamRing.rotation.x = Math.PI / 2;
  fordhamMascotMesh.add(fordhamRing);

  // Inclinations for 3D celestial alignment
  bgsuGroup.rotation.x = -Math.PI / 5;
  bgsuGroup.rotation.z = Math.PI / 6;

  fordhamGroup.rotation.x = Math.PI / 4;
  fordhamGroup.rotation.z = -Math.PI / 8;

  const clock = new THREE.Clock();

  function animate() {
    requestAnimationFrame(animate);
    const elapsedTime = clock.getElapsedTime();

    // Rotate core structures
    coreMesh.rotation.x = elapsedTime * 0.25;
    coreMesh.rotation.y = elapsedTime * 0.35;
    innerCore.rotation.y = -elapsedTime * 0.3;

    // Orbit BGSU mascot
    const bgsuAngle = elapsedTime * 0.75;
    bgsuMascotMesh.position.x = Math.cos(bgsuAngle) * bgsuRadiusX;
    bgsuMascotMesh.position.z = Math.sin(bgsuAngle) * bgsuRadiusZ;
    bgsuMascotMesh.rotation.y = elapsedTime * 2;
    bgsuRing.rotation.z = elapsedTime * 1.5;

    // Orbit Fordham mascot (reverse)
    const fordhamAngle = -elapsedTime * 0.5;
    fordhamMascotMesh.position.x = Math.cos(fordhamAngle) * fordhamRadiusX;
    fordhamMascotMesh.position.z = Math.sin(fordhamAngle) * fordhamRadiusZ;
    fordhamMascotMesh.rotation.y = -elapsedTime * 1.5;
    fordhamRing.rotation.z = -elapsedTime * 1.5;

    // Gentle starfield drift
    starField.rotation.y = elapsedTime * 0.025;

    renderer.render(scene, camera);
  }

  animate();

  const resizeObserver = new ResizeObserver(() => {
    if (!container) return;
    const w = container.clientWidth || 600;
    const h = container.clientHeight || 360;
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h, false);
  });
  resizeObserver.observe(container);
}
