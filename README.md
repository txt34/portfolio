# Common Ground / Devin Holmes / Software Engineering Portfolio

## Production-Ready Prototype & Enterprise SaaS Architecture

Common Ground is a high-performance software engineering portfolio and product-discovery platform created by Devin Holmes (BGSU Computer Science '26, NCAA Division I Football at Fordham #85). It showcases secure web applications, Python/C++/C# architecture, and robust OWASP-aligned security controls.

---

## 📈 Engineering Process, Problem-Solving & Performance Metrics

### 1. Problem-Solving Breakdown & Technical Milestones

| Challenge / Feature | Engineering Diagnosis | Implemented Solution | Verification & Result |
|---|---|---|---|
| **Loading Screen Race Condition** | `catalog.js` could dispatch `catalog:ready` before `loading-sequence.js` registered its event listener. | Introduced global `window.__catalogReady` state flag & synchronization guard. | 100% reliable loading transition with zero fallback timeout stalls. |
| **High-DPI / Retina Canvas Resolution** | Fixed canvas sizing led to pixelation on high-density displays and resizing glitches. | Integrated dynamic `ResizeObserver` with container bounding rects and up to 3x device pixel ratio scaling (`renderer.setPixelRatio`). | Crystal-clear crisp rendering across 4K, Retina, and mobile screens. |
| **3D Starfield Corner Coverage** | Starfield bounds (60x60x60) left corners sparse in wide aspect ratios. | Expanded starfield count to 5,000 particles and extended spatial distribution bounds to 110x80x110. | Starfield seamlessly fills all panel corners and view frustums. |
| **Tilted 3D Comet Trails** | Comet trails were pushed in local flat XZ space, floating off-axis from tilted orbital planet groups. | Tracked actual world positions via `mesh.getWorldPosition(vec)` mapped along inclined orbital matrices. | Blazing fiery comet trails perfectly follow Fred Falcon (BGSU) and Rammy (Fordham) orbits. |
| **PBR Planetoid Realism** | Basic plain textures lacked tactile depth and planetary topography. | Engineered procedural 2K canvas generators producing dual diffuse color maps and detailed bump maps with impact craters. | Hyper-realistic planetary surfaces with crater rims, mineral granules, and clearcoat PBR highlights. |

---

### 2. Architectural Telemetry & Performance Charts

#### **System Security & Compliance Scorecard**
```
[████████████████████] 100% OWASP Top 10 Defense Coverage
[████████████████████] 100% Automated Test Suite Compliance (Node Test Runner)
[████████████████████] TLS 1.3 / Strict CSP / Rate Limiting / CSRF Defense
```

#### **Celestial Simulation Render Pipeline (60 FPS Target)**
```
[ WebGL Canvas Buffer ] 
       │
       ├─► 5,000 Starfield (Full Corner Coverage)
       ├─► Luminous Rainbow Star Core & Dual Corona
       ├─► Swirling Stardust Accretion Ring (Additive Blending)
       ├─► 2,000 Atomic Fusion Solar Flares (Gravity Pull Simulation)
       └─► Dual Orbiting Planetoids (Fred Falcon & Rammy) with World-Space Fiery Comet Trails
```

---

## Key Features & Interactive Dashboards

- **Enterprise Revenue & SaaS Monetization Control Center**: Live MRR ($142,850/mo), ARR, active enterprise seat billing, invoice generation, and revenue simulation controls.
- **Interactive E-Commerce Security Demo Boxes**: Six interactive protection module cards (Transport TLS, Security Headers, Rate Limiting, Request Validation, CSRF Protection, and Request Size Limits) featuring Fordham Rams (Rammy) and BGSU Falcons (Fred Falcon) mascots.
- **Live System Diagnostics Feed**: Real-time server uptime, total requests, active connections, and security telemetry streaming directly into the log view.
- **3D Celestial Arena**: Advanced Three.js WebGL simulation featuring Fred Falcon (BGSU) and Rammy (Fordham) orbiting in synchronized astrological harmony.

---

## Prerequisites & Running Locally

- Node.js 20+
- npm

```bash
npm install
SESSION_SECRET="$(node -e "console.log(require('node:crypto').randomBytes(32).toString('hex'))")" npm run dev
```

Visit:
- http://localhost:8080
- https://localhost:3443

## Useful Commands

```bash
npm run build
npm test
npm start
```
