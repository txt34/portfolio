import * as THREE from 'https://unpkg.com/three@0.160.0/build/three.module.js';

function createProceduralPlanetTextures(tintHex = '#9a3412') {
  const canvas = document.createElement('canvas');
  canvas.width = 2048;
  canvas.height = 2048;
  const ctx = canvas.getContext('2d');

  ctx.fillStyle = tintHex;
  ctx.fillRect(0, 0, 2048, 2048);

  for (let i = 0; i < 12000; i++) {
    const x = Math.random() * 2048;
    const y = Math.random() * 2048;
    const r = Math.random() * 18 + 2;
    ctx.fillStyle = Math.random() > 0.45 ? 'rgba(10, 14, 26, 0.5)' : 'rgba(255, 255, 255, 0.35)';
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
  }

  for (let i = 0; i < 160; i++) {
    const cx = Math.random() * 2048;
    const cy = Math.random() * 2048;
    const cr = Math.random() * 70 + 12;

    const craterGrad = ctx.createRadialGradient(cx, cy, cr * 0.15, cx, cy, cr);
    craterGrad.addColorStop(0, 'rgba(5, 8, 15, 0.95)');
    craterGrad.addColorStop(0.65, 'rgba(0, 0, 0, 0.6)');
    craterGrad.addColorStop(1, 'rgba(255, 255, 255, 0.25)');
    ctx.fillStyle = craterGrad;
    ctx.beginPath();
    ctx.arc(cx, cy, cr, 0, Math.PI * 2);
    ctx.fill();
  }

  const sphericalGrad = ctx.createRadialGradient(1024, 1024, 100, 1024, 1024, 1250);
  sphericalGrad.addColorStop(0, 'rgba(255, 255, 255, 0.4)');
  sphericalGrad.addColorStop(0.6, 'rgba(100, 100, 100, 0.05)');
  sphericalGrad.addColorStop(1, 'rgba(0, 0, 0, 0.95)');
  ctx.fillStyle = sphericalGrad;
  ctx.fillRect(0, 0, 2048, 2048);

  const diffuseMap = new THREE.CanvasTexture(canvas);
  diffuseMap.wrapS = THREE.RepeatWrapping;
  diffuseMap.wrapT = THREE.RepeatWrapping;

  const bumpCanvas = document.createElement('canvas');
  bumpCanvas.width = 1024;
  bumpCanvas.height = 1024;
  const bumpCtx = bumpCanvas.getContext('2d');
  bumpCtx.fillStyle = '#808080';
  bumpCtx.fillRect(0, 0, 1024, 1024);

  for (let i = 0; i < 4000; i++) {
    const x = Math.random() * 1024;
    const y = Math.random() * 1024;
    const r = Math.random() * 12 + 2;
    bumpCtx.fillStyle = Math.random() > 0.5 ? '#202020' : '#dfdfdf';
    bumpCtx.beginPath();
    bumpCtx.arc(x, y, r, 0, Math.PI * 2);
    bumpCtx.fill();
  }

  for (let i = 0; i < 90; i++) {
    const cx = Math.random() * 1024;
    const cy = Math.random() * 1024;
    const cr = Math.random() * 40 + 10;
    const bumpGrad = bumpCtx.createRadialGradient(cx, cy, cr * 0.1, cx, cy, cr);
    bumpGrad.addColorStop(0, '#101010');
    bumpGrad.addColorStop(0.7, '#404040');
    bumpGrad.addColorStop(1, '#ffffff');
    bumpCtx.fillStyle = bumpGrad;
    bumpCtx.beginPath();
    bumpCtx.arc(cx, cy, cr, 0, Math.PI * 2);
    bumpCtx.fill();
  }

  const bumpMap = new THREE.CanvasTexture(bumpCanvas);
  bumpMap.wrapS = THREE.RepeatWrapping;
  bumpMap.wrapT = THREE.RepeatWrapping;

  return { diffuseMap, bumpMap };
}

function createProceduralRockTexture(tintHex = '#64748b') {
  return createProceduralPlanetTextures(tintHex).diffuseMap;
}

function createRockGeometry(radius, detail) {
  const geo = new THREE.DodecahedronGeometry(radius, detail);
  const position = geo.attributes.position;
  for (let i = 0; i < position.count; i++) {
    const x = position.getX(i);
    const y = position.getY(i);
    const z = position.getZ(i);
    const noise = (Math.sin(x * 12) * Math.cos(y * 12) * Math.sin(z * 12)) * 0.16 + (Math.random() - 0.5) * 0.14;
    position.setXYZ(i, x * (1 + noise), y * (1 + noise), z * (1 + noise));
  }
  geo.computeVertexNormals();
  return geo;
}

export function initCelestialArena(container) {
  if (!container) return;
  if (container.querySelector('canvas')) return;

  try {
    const testCanvas = document.createElement('canvas');
    const gl = testCanvas.getContext('webgl2') || testCanvas.getContext('webgl') || testCanvas.getContext('experimental-webgl');
    if (!gl) {
      container.innerHTML = '<div style="padding: 2rem; color: #fca5a5; font-family: var(--mono); font-size: 0.8rem; text-align: center;">WebGL context unavailable. Astrological simulation operating in fallback mode.</div>';
      return;
    }

    const rect = container.getBoundingClientRect();
    const width = container.clientWidth || rect.width || 900;
    const height = container.clientHeight || rect.height || 480;

    const canvas = document.createElement('canvas');
    canvas.className = 'celestial-webgl-canvas';
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    container.insertBefore(canvas, container.firstChild);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 1000);
    camera.position.set(0, -3.2, 4.2);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: 'high-performance' });
    renderer.setSize(width, height, true);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 4));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.9;

    // Cinematic Lighting & Star Core Light
    const ambientLight = new THREE.AmbientLight(0x475569, 1.5);
    scene.add(ambientLight);

    const starCoreLight = new THREE.PointLight(0xffaa00, 30, 45);
    starCoreLight.position.set(0, 0, 0);
    scene.add(starCoreLight);

    const bgsuFireLight = new THREE.PointLight(0xff7200, 22, 35);
    bgsuFireLight.position.set(3, 2, 2);
    scene.add(bgsuFireLight);

    const fordhamFireLight = new THREE.PointLight(0x7b001c, 22, 35);
    fordhamFireLight.position.set(-3, -2, 2);
    scene.add(fordhamFireLight);

    // 8,000 Starfield Background filling all corners
    const starCount = 8000;
    const starGeometry = new THREE.BufferGeometry();
    const starPositions = new Float32Array(starCount * 3);
    const starColors = new Float32Array(starCount * 3);
    for (let i = 0; i < starCount * 3; i += 3) {
      starPositions[i] = (Math.random() - 0.5) * 110;
      starPositions[i + 1] = (Math.random() - 0.5) * 80;
      starPositions[i + 2] = (Math.random() - 0.5) * 110;

      const shade = 0.65 + Math.random() * 0.35;
      starColors[i] = shade;
      starColors[i + 1] = shade * (0.8 + Math.random() * 0.2);
      starColors[i + 2] = shade;
    }
    starGeometry.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));
    starGeometry.setAttribute('color', new THREE.BufferAttribute(starColors, 3));
    const starMaterial = new THREE.PointsMaterial({ size: 0.055, vertexColors: true, transparent: true, opacity: 0.95 });
    const starField = new THREE.Points(starGeometry, starMaterial);
    scene.add(starField);

    // Central 3D Luminous Rainbow Star
    const starCoreGeo = new THREE.IcosahedronGeometry(0.75, 3);
    const starCoreMat = new THREE.MeshPhysicalMaterial({
      color: 0xffffff,
      emissive: 0xffaa00,
      emissiveIntensity: 5.0,
      roughness: 0.05,
      metalness: 0.9,
      clearcoat: 1.0,
      clearcoatRoughness: 0.05
    });
    const centralStar = new THREE.Mesh(starCoreGeo, starCoreMat);
    scene.add(centralStar);

    const coronaGeo = new THREE.IcosahedronGeometry(1.0, 2);
    const coronaMat = new THREE.MeshPhysicalMaterial({
      color: 0xffffff,
      emissive: 0xff7200,
      emissiveIntensity: 3.0,
      transparent: true,
      opacity: 0.75,
      wireframe: true,
      blending: THREE.AdditiveBlending
    });
    const corona = new THREE.Mesh(coronaGeo, coronaMat);
    scene.add(corona);

    // Massive Luminous Atomic Fusion Stardust & Burning Solar Flares
    const flareCount = 2000;
    const flareGeo = new THREE.BufferGeometry();
    const flarePositions = new Float32Array(flareCount * 3);
    const flareVelocities = new Float32Array(flareCount * 3);
    const flareOrigins = new Float32Array(flareCount * 3);
    const flareColors = new Float32Array(flareCount * 3);

    for (let i = 0; i < flareCount * 3; i += 3) {
      const u = Math.random();
      const v = Math.random();
      const theta = u * 2.0 * Math.PI;
      const phi = Math.acos(2.0 * v - 1.0);
      const r = 0.1 + Math.random() * 0.4;

      const px = r * Math.sin(phi) * Math.cos(theta);
      const py = r * Math.sin(phi) * Math.sin(theta);
      const pz = r * Math.cos(phi);

      flarePositions[i] = px;
      flarePositions[i + 1] = py;
      flarePositions[i + 2] = pz;

      flareOrigins[i] = px;
      flareOrigins[i + 1] = py;
      flareOrigins[i + 2] = pz;

      const speed = 0.015 + Math.random() * 0.035;
      flareVelocities[i] = (px / r) * speed;
      flareVelocities[i + 1] = (py / r) * speed;
      flareVelocities[i + 2] = (pz / r) * speed;

      flareColors[i] = 1.0;
      flareColors[i + 1] = 0.6 + Math.random() * 0.4;
      flareColors[i + 2] = 0.1;
    }

    flareGeo.setAttribute('position', new THREE.BufferAttribute(flarePositions, 3));
    flareGeo.setAttribute('color', new THREE.BufferAttribute(flareColors, 3));
    const flareMat = new THREE.PointsMaterial({
      size: 0.14,
      vertexColors: true,
      transparent: true,
      opacity: 0.95,
      blending: THREE.AdditiveBlending
    });
    const solarFlares = new THREE.Points(flareGeo, flareMat);
    scene.add(solarFlares);

    // Swirling Stardust Accretion Ring
    const dustCount = 5000;
    const dustGeo = new THREE.BufferGeometry();
    const dustPos = new Float32Array(dustCount * 3);
    const dustCols = new Float32Array(dustCount * 3);
    for (let i = 0; i < dustCount * 3; i += 3) {
      const radius = 1.0 + Math.random() * 2.5;
      const angle = Math.random() * Math.PI * 2;
      dustPos[i] = Math.cos(angle) * radius;
      dustPos[i + 1] = (Math.random() - 0.5) * 0.25;
      dustPos[i + 2] = Math.sin(angle) * radius;

      dustCols[i] = 1.0;
      dustCols[i + 1] = 0.65 + Math.random() * 0.35;
      dustCols[i + 2] = 0.15;
    }
    dustGeo.setAttribute('position', new THREE.BufferAttribute(dustPos, 3));
    dustGeo.setAttribute('color', new THREE.BufferAttribute(dustCols, 3));
    const dustMat = new THREE.PointsMaterial({
      size: 0.075,
      vertexColors: true,
      transparent: true,
      opacity: 0.92,
      blending: THREE.AdditiveBlending
    });
    const stardustRing = new THREE.Points(dustGeo, dustMat);
    scene.add(stardustRing);

    // BGSU Rocky Planetoid (Fred Falcon)
    const bgsuGroup = new THREE.Group();
    scene.add(bgsuGroup);

    const bgsuRadiusX = 2.7;
    const bgsuRadiusZ = 2.0;
    const bgsuRockGeo = createRockGeometry(0.32, 3);
    const bgsuTextures = createProceduralPlanetTextures('#9a3412');
    const bgsuRockMat = new THREE.MeshPhysicalMaterial({
      map: bgsuTextures.diffuseMap,
      bumpMap: bgsuTextures.bumpMap,
      bumpScale: 0.12,
      emissive: 0xff5500,
      emissiveIntensity: 0.45,
      roughness: 0.55,
      metalness: 0.35,
      clearcoat: 0.8,
      clearcoatRoughness: 0.1
    });
    const bgsuMascotMesh = new THREE.Mesh(bgsuRockGeo, bgsuRockMat);
    bgsuGroup.add(bgsuMascotMesh);

    // Fordham Rocky Planetoid (Rammy)
    const fordhamGroup = new THREE.Group();
    scene.add(fordhamGroup);

    const fordhamRadiusX = 3.7;
    const fordhamRadiusZ = 2.9;
    const fordhamRockGeo = createRockGeometry(0.38, 3);
    const fordhamTextures = createProceduralPlanetTextures('#7f1d1d');
    const fordhamRockMat = new THREE.MeshPhysicalMaterial({
      map: fordhamTextures.diffuseMap,
      bumpMap: fordhamTextures.bumpMap,
      bumpScale: 0.12,
      emissive: 0xa50021,
      emissiveIntensity: 0.45,
      roughness: 0.55,
      metalness: 0.35,
      clearcoat: 0.8,
      clearcoatRoughness: 0.1
    });
    const fordhamMascotMesh = new THREE.Mesh(fordhamRockGeo, fordhamRockMat);
    fordhamGroup.add(fordhamMascotMesh);

    // Blazing School-Colored Fiery Comet Trails for Orbiting Rocks
    const cometHistoryLen = 100;
    const bgsuTrailHistory = [];
    const fordhamTrailHistory = [];

    const bgsuCometGeo = new THREE.BufferGeometry();
    const bgsuCometPos = new Float32Array(cometHistoryLen * 3);
    bgsuCometGeo.setAttribute('position', new THREE.BufferAttribute(bgsuCometPos, 3));
    const bgsuCometMat = new THREE.PointsMaterial({ color: 0xff7200, size: 0.42, transparent: true, opacity: 0.98, blending: THREE.AdditiveBlending });
    const bgsuCometParticles = new THREE.Points(bgsuCometGeo, bgsuCometMat);
    scene.add(bgsuCometParticles);

    const fordhamCometGeo = new THREE.BufferGeometry();
    const fordhamCometPos = new Float32Array(cometHistoryLen * 3);
    fordhamCometGeo.setAttribute('position', new THREE.BufferAttribute(fordhamCometPos, 3));
    const fordhamCometMat = new THREE.PointsMaterial({ color: 0xff2244, size: 0.48, transparent: true, opacity: 0.98, blending: THREE.AdditiveBlending });
    const fordhamCometParticles = new THREE.Points(fordhamCometGeo, fordhamCometMat);
    scene.add(fordhamCometParticles);

    // Orbital Inclinations
    bgsuGroup.rotation.x = -Math.PI / 5;
    bgsuGroup.rotation.z = Math.PI / 6;

    fordhamGroup.rotation.x = Math.PI / 4;
    fordhamGroup.rotation.z = -Math.PI / 8;

    const clock = new THREE.Clock();

    function animate() {
      requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Rainbow color cycle for 3D luminous star
      const hue = (elapsedTime * 0.05) % 1;
      starCoreMat.color.setHSL(hue, 1.0, 0.7);
      starCoreMat.emissive.setHSL(hue, 1.0, 0.6);
      coronaMat.color.setHSL((hue + 0.12) % 1, 1.0, 0.6);
      starCoreLight.color.setHSL(hue, 1.0, 0.5);

      const pulse = 1 + Math.sin(elapsedTime * 5) * 0.07;
      centralStar.scale.set(pulse, pulse, pulse);
      corona.scale.set(pulse * 1.15, pulse * 1.15, pulse * 1.15);

      centralStar.rotation.x = elapsedTime * 0.25;
      centralStar.rotation.y = elapsedTime * 0.35;
      corona.rotation.y = -elapsedTime * 0.3;

      // Animate Atomic Fusion Stardust subject to Gravitational Pull
      const posArr = solarFlares.geometry.attributes.position.array;
      for (let i = 0; i < flareCount * 3; i += 3) {
        const px = posArr[i];
        const py = posArr[i + 1];
        const pz = posArr[i + 2];

        const distSq = px*px + py*py + pz*pz + 0.02;
        const gravityForce = 0.0018 / distSq;
        
        flareVelocities[i] -= (px / Math.sqrt(distSq)) * gravityForce;
        flareVelocities[i + 1] -= (py / Math.sqrt(distSq)) * gravityForce;
        flareVelocities[i + 2] -= (pz / Math.sqrt(distSq)) * gravityForce;

        posArr[i] += flareVelocities[i];
        posArr[i + 1] += flareVelocities[i + 1];
        posArr[i + 2] += flareVelocities[i + 2];

        const dist = Math.sqrt(px*px + py*py + pz*pz);
        if (dist > 1.8 || dist < 0.08) {
          posArr[i] = flareOrigins[i];
          posArr[i + 1] = flareOrigins[i + 1];
          posArr[i + 2] = flareOrigins[i + 2];
          const speed = 0.015 + Math.random() * 0.035;
          const r = 0.1 + Math.random() * 0.4;
          const u = Math.random();
          const v = Math.random();
          const theta = u * 2.0 * Math.PI;
          const phi = Math.acos(2.0 * v - 1.0);
          flareVelocities[i] = (r * Math.sin(phi) * Math.cos(theta) / r) * speed;
          flareVelocities[i + 1] = (r * Math.sin(phi) * Math.sin(theta) / r) * speed;
          flareVelocities[i + 2] = (r * Math.cos(phi) / r) * speed;
        }
      }
      solarFlares.geometry.attributes.position.needsUpdate = true;
      solarFlares.rotation.y = elapsedTime * 0.1;
      stardustRing.rotation.y = elapsedTime * 0.35;

      // Orbit BGSU rock & blazing fiery comet trail
      const bgsuAngle = elapsedTime * 0.75;
      const bgsuX = Math.cos(bgsuAngle) * bgsuRadiusX;
      const bgsuZ = Math.sin(bgsuAngle) * bgsuRadiusZ;
      bgsuMascotMesh.position.set(bgsuX, 0, bgsuZ);
      bgsuMascotMesh.rotation.x = elapsedTime * 1.2;
      bgsuMascotMesh.rotation.y = elapsedTime * 1.5;

      const bgsuWorldPos = new THREE.Vector3();
      bgsuMascotMesh.getWorldPosition(bgsuWorldPos);
      bgsuTrailHistory.unshift(bgsuWorldPos);
      if (bgsuTrailHistory.length > cometHistoryLen) bgsuTrailHistory.pop();
      const bgsuArr = bgsuCometParticles.geometry.attributes.position.array;
      bgsuTrailHistory.forEach((pos, idx) => {
        bgsuArr[idx * 3] = pos.x;
        bgsuArr[idx * 3 + 1] = pos.y;
        bgsuArr[idx * 3 + 2] = pos.z;
      });
      bgsuCometParticles.geometry.attributes.position.needsUpdate = true;

      // Orbit Fordham rock & blazing fiery comet trail
      const fordhamAngle = -elapsedTime * 0.5;
      const fordhamX = Math.cos(fordhamAngle) * fordhamRadiusX;
      const fordhamZ = Math.sin(fordhamAngle) * fordhamRadiusZ;
      fordhamMascotMesh.position.set(fordhamX, 0, fordhamZ);
      fordhamMascotMesh.rotation.x = -elapsedTime * 1.0;
      fordhamMascotMesh.rotation.y = -elapsedTime * 1.3;

      const fordhamWorldPos = new THREE.Vector3();
      fordhamMascotMesh.getWorldPosition(fordhamWorldPos);
      fordhamTrailHistory.unshift(fordhamWorldPos);
      if (fordhamTrailHistory.length > cometHistoryLen) fordhamTrailHistory.pop();
      const fordhamArr = fordhamCometParticles.geometry.attributes.position.array;
      fordhamTrailHistory.forEach((pos, idx) => {
        fordhamArr[idx * 3] = pos.x;
        fordhamArr[idx * 3 + 1] = pos.y;
        fordhamArr[idx * 3 + 2] = pos.z;
      });
      fordhamCometParticles.geometry.attributes.position.needsUpdate = true;

      starField.rotation.y = elapsedTime * 0.015;
      stardustRing.rotation.y = elapsedTime * 0.25;
      camera.position.x = Math.sin(elapsedTime * 0.05) * 0.35;
      camera.position.y = -3.2 + Math.cos(elapsedTime * 0.08) * 0.2;
      camera.lookAt(0, 0, 0);

      renderer.render(scene, camera);
    }

    animate();

    const resizeObserver = new ResizeObserver((entries) => {
      if (!container) return;
      for (const entry of entries) {
        const r = container.getBoundingClientRect();
        const w = entry.contentRect.width || container.clientWidth || r.width || 900;
        const h = entry.contentRect.height || container.clientHeight || r.height || 480;
        if (w > 0 && h > 0) {
          camera.aspect = w / h;
          camera.updateProjectionMatrix();
          renderer.setSize(w, h, true);
          renderer.setPixelRatio(Math.min(window.devicePixelRatio, 4));
        }
      }
    });
    resizeObserver.observe(container);
  } catch (err) {
    console.warn('Celestial arena fallback active:', err);
  }
}
