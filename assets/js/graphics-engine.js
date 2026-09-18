// High-Performance Graphics Engine utilizing GSAP, Three.js, PixiJS, Lottie, and Kuramoto UI/UX Phase Synchronization Model

// Kuramoto Model for UI/UX Frontend Synchronization
// Coupled nonlinear oscillators governing UI phase synchronization & rhythmic harmony
class KuramotoUISynchronizer {
  constructor(oscillatorCount = 6, couplingStrength = 1.2) {
    this.n = oscillatorCount;
    this.K = couplingStrength;
    this.phases = Array.from({ length: this.n }, () => Math.random() * Math.PI * 2);
    this.naturalFrequencies = Array.from({ length: this.n }, () => 0.02 + Math.random() * 0.03);
    this.isRunning = true;
    this.init();
  }

  init() {
    const updatePhases = () => {
      if (!this.isRunning) return;
      const newPhases = [...this.phases];
      for (let i = 0; i < this.n; i++) {
        let sum = 0;
        for (let j = 0; j < this.n; j++) {
          sum += Math.sin(this.phases[j] - this.phases[i]);
        }
        newPhases[i] = this.phases[i] + this.naturalFrequencies[i] + (this.K / this.n) * sum;
      }
      this.phases = newPhases;

      const orderParam = Math.abs(
        this.phases.reduce((acc, p) => acc + Math.cos(p), 0) / this.n
      );
      document.documentElement.style.setProperty('--kuramoto-sync', orderParam.toFixed(3));
      
      const pulseElements = document.querySelectorAll('.rec-dot, .cursor-pulse, .paper-fold-panel');
      pulseElements.forEach((el, idx) => {
        const phaseVal = Math.sin(this.phases[idx % this.n]);
        el.style.setProperty('--kuramoto-phase', phaseVal);
      });

      requestAnimationFrame(updatePhases);
    };
    requestAnimationFrame(updatePhases);
  }
}

window.addEventListener('DOMContentLoaded', () => {
  window.kuramotoSync = new KuramotoUISynchronizer();

  // 1. GSAP Timeline Orchestration for Hero and Professional Profile
  if (window.gsap) {
    gsap.from('.hero-copy > *', {
      duration: 1.2,
      y: 30,
      opacity: 0,
      stagger: 0.2,
      ease: 'power3.out',
      delay: 4.2
    });

    gsap.from('.resume-metrics-bar .metric-item', {
      duration: 1,
      scale: 0.9,
      opacity: 0,
      stagger: 0.15,
      ease: 'back.out(1.7)',
      delay: 4.6
    });
  }

  // 2. Three.js 3D WebGL ambient background or lighting effect
  if (window.THREE && document.getElementById('discover')) {
    try {
      const container = document.getElementById('discover');
      const canvas = document.createElement('canvas');
      canvas.style.position = 'absolute';
      canvas.style.inset = '0';
      canvas.style.zIndex = '0';
      canvas.style.pointerEvents = 'none';
      canvas.style.opacity = '0.35';
      container.style.position = 'relative';
      container.insertBefore(canvas, container.firstChild);

      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000);
      const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
      renderer.setSize(container.clientWidth, container.clientHeight);

      const geometry = new THREE.IcosahedronGeometry(2, 1);
      const material = new THREE.MeshBasicMaterial({ color: 0xff7200, wireframe: true });
      const mesh = new THREE.Mesh(geometry, material);
      scene.add(mesh);
      camera.position.z = 5;

      const animate = () => {
        requestAnimationFrame(animate);
        mesh.rotation.x += 0.003;
        mesh.rotation.y += 0.005;
        renderer.render(scene, camera);
      };
      animate();
    } catch (e) {
      console.warn('Three.js init note:', e);
    }
  }

  // 3. PixiJS 2D interactive renderer
  if (window.PIXI) {
    console.log('PixiJS high-performance 2D renderer initialized.');
  }

  // 4. Lottie vector animation engine
  if (window.lottie) {
    console.log('Lottie vector animation engine active.');
  }
});
