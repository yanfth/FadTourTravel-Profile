import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { JOURNAL_POSTS } from '../data/travelData';

gsap.registerPlugin(ScrollTrigger);

/* ---------------------------------------------------------------- utils */
const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
const lerp = (a, b, t) => a + (b - a) * t;
const smooth = (a, b, x) => {
  const t = clamp((x - a) / (b - a), 0, 1);
  return t * t * (3 - 2 * t);
};
const sgn = (v) => (v < 0 ? -1 : 1);

const escapeHTML = (s) =>
  String(s).replace(
    /[&<>"']/g,
    (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c])
  );

// RNG deterministik supaya pemandangan selalu sama
function rng(seed) {
  let a = seed >>> 0;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function ctxRoundRect(g, x, y, w, h, r) {
  g.beginPath();
  g.moveTo(x + r, y);
  g.arcTo(x + w, y, x + w, y + h, r);
  g.arcTo(x + w, y + h, x, y + h, r);
  g.arcTo(x, y + h, x, y, r);
  g.arcTo(x, y, x + w, y, r);
  g.closePath();
}

/* ------------------------------------------------ helper Three.js */
// Di Three.js r152+, ColorManagement.enabled = true otomatis mengonversi hex sRGB ke linear
const C = (hex) => new THREE.Color(hex);
const rgbOf = (hex) => {
  const c = C(hex);
  return [c.r, c.g, c.b];
};
const mixRGB = (a, b, t) => [lerp(a[0], b[0], t), lerp(a[1], b[1], t), lerp(a[2], b[2], t)];
const V3 = (x, y, z) => new THREE.Vector3(x, y, z);

function canvasTex(w, h, draw, srgb = true) {
  const c = document.createElement('canvas');
  c.width = w;
  c.height = h;
  const g = c.getContext('2d');
  draw(g, w, h);
  const tex = new THREE.CanvasTexture(c);
  tex.anisotropy = 4;
  if (srgb) tex.colorSpace = THREE.SRGBColorSpace;
  return {
    tex,
    canvas: c,
    redraw() {
      g.clearRect(0, 0, w, h);
      draw(g, w, h);
      tex.needsUpdate = true;
    },
  };
}

function disposeTree(root) {
  root.traverse((o) => {
    if (o.geometry) o.geometry.dispose();
    if (o.material) {
      (Array.isArray(o.material) ? o.material : [o.material]).forEach((m) => m.dispose());
    }
  });
}

/* ------------------------------------------------------------------------
   LOFT — badan kendaraan yang mulus (bukan kotak).
   Penampang (ring) disapukan sepanjang sumbu X melalui deretan "station".
   ------------------------------------------------------------------------ */
const RR = { mb: 4, k: 7, ms: 36, mt: 14 };
const RR_SIDE_R = RR.mb + RR.k;
const RR_SIDE_L = RR.mb + 2 * RR.k + RR.ms + RR.mt + RR.k;
const RR_TOP = RR.mb + 2 * RR.k + RR.ms;

function ringRR(st) {
  const w = st.w;
  const y0 = st.y0;
  const y1 = st.y1;
  const r = Math.max(0, Math.min(st.r || 0, w, (y1 - y0) / 2));
  const hs = Math.max(0, y1 - y0 - 2 * r);
  const wr = Math.max(0, w - r);
  const P = Math.PI;
  const p = [];
  for (let i = 0; i < RR.mb; i++) p.push([(wr * i) / RR.mb, y0]);
  for (let i = 0; i < RR.k; i++) {
    const a = -P / 2 + (P / 2) * (i / RR.k);
    p.push([wr + r * Math.cos(a), y0 + r + r * Math.sin(a)]);
  }
  for (let i = 0; i < RR.ms; i++) p.push([w, y0 + r + (hs * i) / RR.ms]);
  for (let i = 0; i < RR.k; i++) {
    const a = (P / 2) * (i / RR.k);
    p.push([wr + r * Math.cos(a), y1 - r + r * Math.sin(a)]);
  }
  for (let i = 0; i < RR.mt; i++) p.push([wr - (2 * wr * i) / RR.mt, y1]);
  for (let i = 0; i < RR.k; i++) {
    const a = P / 2 + (P / 2) * (i / RR.k);
    p.push([-wr + r * Math.cos(a), y1 - r + r * Math.sin(a)]);
  }
  for (let i = 0; i < RR.ms; i++) p.push([-w, y1 - r - (hs * i) / RR.ms]);
  for (let i = 0; i < RR.k; i++) {
    const a = P + (P / 2) * (i / RR.k);
    p.push([-wr + r * Math.cos(a), y0 + r + r * Math.sin(a)]);
  }
  for (let i = 0; i <= RR.mb; i++) p.push([-wr + (wr * i) / RR.mb, y0]);
  return p;
}

function ringEll(st) {
  const n = st.n || 2.2;
  const seg = 56;
  const cy = (st.y0 + st.y1) / 2;
  const hh = (st.y1 - st.y0) / 2;
  const p = [];
  for (let j = 0; j <= seg; j++) {
    const a = -Math.PI / 2 + (j / seg) * Math.PI * 2;
    const c = Math.cos(a);
    const s = Math.sin(a);
    p.push([
      sgn(c) * Math.pow(Math.abs(c), 2 / n) * st.w,
      cy + sgn(s) * Math.pow(Math.abs(s), 2 / n) * hh,
    ]);
  }
  return p;
}

function makeStations(x0, x1, count, fn, cap0 = 0, cap1 = 0, xa = x0, xb = x1) {
  const out = [];
  for (let i = 0; i < count; i++) {
    const t = i / (count - 1);
    const x = xa + (xb - xa) * (0.5 - 0.5 * Math.cos(Math.PI * t));
    const s = Object.assign({ x }, fn(x));
    let k = 1;
    if (cap0 && x < x0 + cap0) {
      const u = (x0 + cap0 - x) / cap0;
      k = Math.min(k, Math.sqrt(Math.max(0, 1 - u * u)));
    }
    if (cap1 && x > x1 - cap1) {
      const u = (x - (x1 - cap1)) / cap1;
      k = Math.min(k, Math.sqrt(Math.max(0, 1 - u * u)));
    }
    if (k < 1) {
      const cy = (s.y0 + s.y1) / 2;
      const hh = ((s.y1 - s.y0) / 2) * k;
      s.y0 = cy - hh;
      s.y1 = cy + hh;
      s.w *= k;
      s.r = (s.r || 0) * k;
    }
    out.push(s);
  }
  return out;
}

function loft(stations, ring, opts = {}) {
  const rings = stations.map((s) => ring(s));
  const N = rings[0].length;
  const j0 = opts.j0 != null ? opts.j0 : 0;
  const j1 = opts.j1 != null ? opts.j1 : N - 1;
  const cols = j1 - j0 + 1;
  const pos = [];
  const uv = [];
  const col = [];
  const idx = [];
  const xa = stations[0].x;
  const xb = stations[stations.length - 1].x;

  stations.forEach((st, i) => {
    const cy = (st.y0 + st.y1) / 2;
    for (let j = j0; j <= j1; j++) {
      let z = rings[i][j][0];
      let y = rings[i][j][1];
      if (opts.off) {
        z *= 1 + opts.off;
        y = cy + (y - cy) * (1 + opts.off);
      }
      pos.push(st.x, y, z);
      uv.push((st.x - xa) / (xb - xa || 1), (j - j0) / (cols - 1 || 1));
      if (opts.color) {
        const c = opts.color(st.x, y, z, st, j / (N - 1));
        col.push(c[0], c[1], c[2]);
      }
    }
  });

  for (let i = 0; i < stations.length - 1; i++) {
    for (let j = 0; j < cols - 1; j++) {
      const a = i * cols + j;
      const b = a + 1;
      const c = a + cols;
      const d = c + 1;
      idx.push(a, c, b, b, c, d);
    }
  }

  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  g.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2));
  if (opts.color) g.setAttribute('color', new THREE.Float32BufferAttribute(col, 3));
  g.setIndex(idx);
  g.computeVertexNormals();

  if (opts.j0 == null && opts.j1 == null) {
    const nr = g.attributes.normal;
    for (let i = 0; i < stations.length; i++) {
      const a = i * cols;
      const b = a + cols - 1;
      const nx = (nr.getX(a) + nr.getX(b)) / 2;
      const ny = (nr.getY(a) + nr.getY(b)) / 2;
      const nz = (nr.getZ(a) + nr.getZ(b)) / 2;
      nr.setXYZ(a, nx, ny, nz);
      nr.setXYZ(b, nx, ny, nz);
    }
  }
  return g;
}

function radialTex(stops, size = 256) {
  return canvasTex(size, size, (g, w) => {
    const gr = g.createRadialGradient(w / 2, w / 2, 0, w / 2, w / 2, w / 2);
    stops.forEach(([o, c]) => gr.addColorStop(o, c));
    g.fillStyle = gr;
    g.fillRect(0, 0, w, w);
  }).tex;
}

function noiseTex(size, base, speck, count, seed) {
  const R = rng(seed);
  return canvasTex(size, size, (g, w, h) => {
    g.fillStyle = base;
    g.fillRect(0, 0, w, h);
    for (let i = 0; i < count; i++) {
      const a = 0.05 + R() * 0.18;
      g.fillStyle = (R() > 0.5 ? 'rgba(255,255,255,' : 'rgba(0,0,0,') + a + ')';
      const s = 1 + R() * 2.2;
      g.fillRect(R() * w, R() * h, s, s);
    }
  });
}

/* ------------------------------------------------------------------------
   MATERIAL & ASET BERSAMA UNTUK BUS, KERETA, PESAWAT
   ------------------------------------------------------------------------ */
const PAL = { pearl: 0xe8ecf1, navy: 0x0f1d3a, red: 0xd62839, steel: 0x8a94a3, deep: 0x070d1d };

function makeMats() {
  const std = (o) => new THREE.MeshStandardMaterial(o);
  return {
    paint: new THREE.MeshPhysicalMaterial({
      color: 0xffffff,
      vertexColors: true,
      roughness: 0.36,
      metalness: 0.18,
      clearcoat: 1,
      clearcoatRoughness: 0.1,
    }),
    glass: std({ color: C(0x1b2c4a), roughness: 0.1, metalness: 0.7 }),
    alloy: std({ color: C(0x9aa4b0), roughness: 0.3, metalness: 0.7 }),
    dark: std({ color: C(0x0c1018), roughness: 0.72, metalness: 0.25 }),
    rubber: std({ color: C(0x080a0f), roughness: 0.92, metalness: 0 }),
    chrome: std({ color: C(0xdde4ec), roughness: 0.22, metalness: 1 }),
    steel: std({ color: C(PAL.steel), roughness: 0.5, metalness: 0.8 }),
    white: std({ color: C(0xf0f2f5), roughness: 0.42, metalness: 0.05 }),
    navy: std({ color: C(PAL.navy), roughness: 0.4, metalness: 0.2 }),
    red: std({ color: C(PAL.red), roughness: 0.38, metalness: 0.15 }),
    lamp: std({
      color: C(0xfff4d6),
      emissive: C(0xffe2a8),
      emissiveIntensity: 1.1,
      roughness: 0.3,
    }),
    tail: std({
      color: C(0xff2a3a),
      emissive: C(0xff1a2a),
      emissiveIntensity: 0.9,
      roughness: 0.4,
    }),
  };
}

function paneTex(panes, opts = {}) {
  const { w = 1024, h = 128, gap = 14, margin = 10, radius = 14 } = opts;
  return canvasTex(
    w,
    h,
    (g) => {
      g.clearRect(0, 0, w, h);
      const pw = (w - gap * (panes + 1)) / panes;
      for (let i = 0; i < panes; i++) {
        const x = gap + i * (pw + gap);
        const gr = g.createLinearGradient(0, 0, 0, h);
        gr.addColorStop(0, '#16233d');
        gr.addColorStop(0.5, '#0a1224');
        gr.addColorStop(1, '#0d172b');
        g.fillStyle = gr;
        ctxRoundRect(g, x, margin, pw, h - margin * 2, radius);
        g.fill();
        const sh = g.createLinearGradient(x, 0, x + pw, h);
        sh.addColorStop(0, 'rgba(255,255,255,0)');
        sh.addColorStop(0.42, 'rgba(255,255,255,.0)');
        sh.addColorStop(0.5, 'rgba(180,205,255,.10)');
        sh.addColorStop(0.58, 'rgba(255,255,255,0)');
        g.fillStyle = sh;
        ctxRoundRect(g, x, margin, pw, h - margin * 2, radius);
        g.fill();
      }
    },
    true
  );
}

function logoTex() {
  return canvasTex(1024, 220, (g, w, h) => {
    g.clearRect(0, 0, w, h);
    g.textBaseline = 'alphabetic';
    g.fillStyle = '#FFFFFF';
    g.font = '800 150px Outfit, Plus Jakarta Sans, sans-serif';
    g.fillText('FAD', 8, 150);
    g.fillStyle = '#E8ECF1';
    g.font = '800 54px Plus Jakarta Sans, sans-serif';
    g.fillText('TOUR & TRAVEL', 330, 98);
    g.fillStyle = '#EF3340';
    g.fillRect(332, 116, 120, 5);
    g.fillStyle = '#9FB0CA';
    g.font = '600 30px Plus Jakarta Sans, sans-serif';
    g.fillText('Gresik • Jawa Timur', 332, 166);
  });
}

function makeWheel(M, r, width) {
  const pv = new THREE.Group();
  const tire = new THREE.Mesh(new THREE.CylinderGeometry(r, r, width, 40), M.rubber);
  tire.rotation.x = Math.PI / 2;
  pv.add(tire);
  const sw = new THREE.Mesh(new THREE.CylinderGeometry(r * 0.78, r * 0.82, width * 1.02, 40), M.dark);
  sw.rotation.x = Math.PI / 2;
  pv.add(sw);
  [1, -1].forEach((s) => {
    const rim = new THREE.Mesh(new THREE.CircleGeometry(r * 0.66, 36), M.alloy);
    rim.position.z = s * (width / 2 + 0.002);
    if (s < 0) rim.rotation.y = Math.PI;
    pv.add(rim);
    const hub = new THREE.Mesh(new THREE.CircleGeometry(r * 0.26, 24), M.dark);
    hub.position.z = s * (width / 2 + 0.004);
    if (s < 0) hub.rotation.y = Math.PI;
    pv.add(hub);
    for (let k = 0; k < 5; k++) {
      const a = (k / 5) * Math.PI * 2;
      const b = new THREE.Mesh(new THREE.CircleGeometry(r * 0.045, 10), M.steel);
      b.position.set(Math.cos(a) * r * 0.42, Math.sin(a) * r * 0.42, s * (width / 2 + 0.006));
      if (s < 0) b.rotation.y = Math.PI;
      pv.add(b);
    }
  });
  return pv;
}

/* ------------------------------------------------------------------------
   1. BUS PARIWISATA
   ------------------------------------------------------------------------ */
function buildBus(M, logo) {
  const g = new THREE.Group();
  const X0 = -2.5;
  const X1 = 2.5;
  const CAP0 = 0.26;
  const CAP1 = 0.14;
  const WID = 0.53;
  const Y0 = 0.24;
  const PEARL = rgbOf(PAL.pearl);
  const NAVY = rgbOf(PAL.navy);
  const RED = rgbOf(PAL.red);
  const ROOF = rgbOf(0xc4cbd5);

  const f = (x) => {
    const t = clamp((x - 2.08) / 0.42, 0, 1);
    const tr = clamp((-2.05 - x) / 0.45, 0, 1);
    return {
      y0: Y0 + 0.05 * t,
      y1: 1.52 - 0.6 * Math.pow(t, 1.35) - 0.14 * tr * tr,
      w: WID - 0.03 * t - 0.03 * tr,
      r: 0.17 + 0.08 * t,
    };
  };
  const livery = (x, y, z, st) => {
    const ty = (y - st.y0) / (st.y1 - st.y0 || 1);
    const rise = smooth(-0.8, 2.3, x);
    const sk = 0.2 + 0.04 * rise;
    let c = mixRGB(NAVY, PEARL, smooth(sk - 0.012, sk + 0.012, ty));
    const lo = sk + 0.03;
    const hi = lo + 0.045 + 0.02 * rise;
    c = mixRGB(c, RED, smooth(lo - 0.008, lo + 0.008, ty) * (1 - smooth(hi - 0.008, hi + 0.008, ty)));
    return mixRGB(c, ROOF, smooth(0.96, 1.0, ty) * 0.85);
  };

  g.add(new THREE.Mesh(loft(makeStations(X0, X1, 110, f, CAP0, CAP1), ringRR, { color: livery }), M.paint));

  const sub = (xa, xb, n) => makeStations(X0, X1, n, f, CAP0, CAP1, xa, xb);
  const paneM = M.glass.clone();
  paneM.color.set(0xffffff);
  paneM.map = paneTex(9).tex;
  paneM.transparent = true;
  paneM.alphaTest = 0.35;
  const ms = RR.ms;
  const wj0 = Math.round(ms * 0.42);
  g.add(new THREE.Mesh(loft(sub(-2.0, 1.95, 52), ringRR, { j0: RR_SIDE_R + wj0, j1: RR_SIDE_R + ms, off: 0.006 }), paneM));
  g.add(new THREE.Mesh(loft(sub(-2.0, 1.95, 52), ringRR, { j0: RR_SIDE_L, j1: RR_SIDE_L + (ms - wj0), off: 0.006 }), paneM));
  g.add(new THREE.Mesh(loft(sub(2.1, 2.4, 20), ringRR, { j0: RR_TOP - 3, j1: RR_TOP + RR.mt + 3, off: 0.014 }), M.glass));

  const acF = () => ({ y0: 1.5, y1: 1.6, w: 0.26, r: 0.05 });
  g.add(new THREE.Mesh(loft(makeStations(-1.1, 0.35, 30, acF, 0.14, 0.14), ringRR, { color: () => ROOF }), M.paint));

  const dec = new THREE.MeshBasicMaterial({
    map: logo.tex,
    transparent: true,
    depthWrite: false,
    polygonOffset: true,
    polygonOffsetFactor: -2,
  });
  [1, -1].forEach((s) => {
    const d = new THREE.Mesh(new THREE.PlaneGeometry(1.05, 0.225), dec);
    d.position.set(0.2, 0.44, s * (WID + 0.003));
    if (s < 0) d.rotation.y = Math.PI;
    g.add(d);
  });

  const wheels = [];
  const R = 0.2;
  [1.6, -1.15, -1.78].forEach((x) =>
    [1, -1].forEach((s) => {
      const arch = new THREE.Mesh(new THREE.CircleGeometry(R * 1.3, 40), M.dark);
      arch.position.set(x, R, s * (WID + 0.002));
      if (s < 0) arch.rotation.y = Math.PI;
      g.add(arch);
      const well = new THREE.Mesh(new THREE.CylinderGeometry(R * 1.28, R * 1.28, 0.2, 36), M.dark);
      well.rotation.x = Math.PI / 2;
      well.position.set(x, R, s * 0.4);
      g.add(well);
      const pv = makeWheel(M, R, 0.16);
      pv.position.set(x, R, s * 0.445);
      g.add(pv);
      wheels.push({ pivot: pv, r: R });
    })
  );

  [1, -1].forEach((s) => {
    const hl = new THREE.Mesh(new THREE.SphereGeometry(1, 16, 12), M.lamp);
    hl.scale.set(0.03, 0.05, 0.12);
    hl.position.set(2.47, 0.5, s * 0.3);
    g.add(hl);
    const tl = new THREE.Mesh(new THREE.SphereGeometry(1, 14, 10), M.tail);
    tl.scale.set(0.03, 0.09, 0.07);
    tl.position.set(-2.46, 0.6, s * 0.34);
    g.add(tl);
    const arm = new THREE.Mesh(new THREE.CylinderGeometry(0.012, 0.012, 0.16, 8), M.dark);
    arm.rotation.x = Math.PI / 2;
    arm.position.set(2.0, 1.05, s * 0.6);
    g.add(arm);
    const mir = new THREE.Mesh(new THREE.SphereGeometry(1, 14, 10), M.dark);
    mir.scale.set(0.025, 0.1, 0.04);
    mir.position.set(2.0, 1.02, s * 0.69);
    g.add(mir);
  });
  const grille = new THREE.Mesh(new THREE.SphereGeometry(1, 20, 12), M.dark);
  grille.scale.set(0.03, 0.07, 0.22);
  grille.position.set(2.48, 0.46, 0);
  g.add(grille);

  return {
    group: g,
    wheels,
    anchors: [V3(0.55, 1.1, 0.56), V3(2.25, 1.15, 0)],
    length: 5.0,
    height: 1.65,
    ground: 0,
  };
}

/* ------------------------------------------------------------------------
   2. KERETA API (Rangkaian 3 kereta)
   ------------------------------------------------------------------------ */
function buildTrain(M, logo) {
  const g = new THREE.Group();
  const CL = 4.6;
  const W = 0.6;
  const Y0 = 0.3;
  const H = 1.5;
  const PEARL = rgbOf(0xe9edf2);
  const NAVY = rgbOf(PAL.navy);
  const RED = rgbOf(PAL.red);
  const ROOF = rgbOf(0xb9c1cc);

  const livery = (x, y, z, st) => {
    const ty = (y - st.y0) / (st.y1 - st.y0 || 1);
    const sk = 0.24;
    let c = mixRGB(NAVY, PEARL, smooth(sk - 0.012, sk + 0.012, ty));
    const lo = sk + 0.03;
    const hi = lo + 0.05;
    c = mixRGB(c, RED, smooth(lo - 0.008, lo + 0.008, ty) * (1 - smooth(hi - 0.008, hi + 0.008, ty)));
    return mixRGB(c, ROOF, smooth(0.95, 1.0, ty) * 0.9);
  };
  const wheels = [];
  const carFn = (lead) => (x) => {
    const t = lead ? clamp((x - 0.9) / 1.4, 0, 1) : 0;
    return {
      y0: Y0 + 0.1 * t * t,
      y1: Y0 + H - 0.62 * Math.pow(t, 1.6),
      w: W - 0.1 * Math.pow(t, 2.2),
      r: 0.26 + 0.14 * t,
    };
  };

  function addCar(cx, lead, idx) {
    const car = new THREE.Group();
    car.position.x = cx;
    g.add(car);
    const x0 = -CL / 2;
    const x1 = CL / 2;
    const f = carFn(lead);
    const capB = lead ? 0.55 : 0.08;
    car.add(new THREE.Mesh(loft(makeStations(x0, x1, lead ? 110 : 40, f, 0.08, capB), ringRR, { color: livery }), M.paint));
    const sub = (xa, xb, n) => makeStations(x0, x1, n, f, 0.08, capB, xa, xb);
    const ms = RR.ms;
    const wj0 = Math.round(ms * 0.4);
    const pm = M.glass.clone();
    pm.color.set(0xffffff);
    pm.map = paneTex(7, { gap: 26 }).tex;
    pm.transparent = true;
    pm.alphaTest = 0.35;
    const xe = lead ? 1.2 : x1 - 0.2;
    car.add(new THREE.Mesh(loft(sub(x0 + 0.2, xe, 44), ringRR, { j0: RR_SIDE_R + wj0, j1: RR_SIDE_R + ms - 2, off: 0.006 }), pm));
    car.add(new THREE.Mesh(loft(sub(x0 + 0.2, xe, 44), ringRR, { j0: RR_SIDE_L + 2, j1: RR_SIDE_L + (ms - wj0), off: 0.006 }), pm));
    if (lead) {
      car.add(
        new THREE.Mesh(
          loft(sub(1.3, 2.12, 34), ringRR, {
            j0: RR_SIDE_R + Math.round(ms * 0.5),
            j1: RR_SIDE_L + Math.round(ms * 0.5),
            off: 0.012,
          }),
          M.glass
        )
      );
      [1, -1].forEach((s) => {
        const hl = new THREE.Mesh(new THREE.SphereGeometry(1, 16, 12), M.lamp);
        hl.scale.set(0.04, 0.045, 0.1);
        hl.position.set(2.24, 0.52, s * 0.25);
        car.add(hl);
      });
      const lg = new THREE.Mesh(new THREE.SphereGeometry(1, 16, 12), M.dark);
      lg.scale.set(0.03, 0.05, 0.3);
      lg.position.set(2.29, 0.42, 0);
      car.add(lg);
      const d = new THREE.Mesh(
        new THREE.PlaneGeometry(0.9, 0.19),
        new THREE.MeshBasicMaterial({
          map: logo.tex,
          transparent: true,
          depthWrite: false,
          polygonOffset: true,
          polygonOffsetFactor: -2,
        })
      );
      [1, -1].forEach((s) => {
        const dd = d.clone();
        dd.position.set(-0.8, 0.46, s * (W + 0.003));
        if (s < 0) dd.rotation.y = Math.PI;
        car.add(dd);
      });
    }
    const acF = () => ({ y0: Y0 + H - 0.02, y1: Y0 + H + 0.1, w: 0.3, r: 0.05 });
    car.add(new THREE.Mesh(loft(makeStations(-1.7, -0.3, 24, acF, 0.12, 0.12), ringRR, { color: () => ROOF }), M.paint));
    if (idx === 1) {
      const pg = new THREE.Group();
      pg.position.set(0.9, Y0 + H + 0.06, 0);
      const bar = (len, rot, px, py) => {
        const b = new THREE.Mesh(new THREE.CylinderGeometry(0.012, 0.012, len, 8), M.dark);
        b.rotation.z = rot;
        b.position.set(px, py, 0);
        pg.add(b);
      };
      bar(0.62, 0.62, -0.12, 0.26);
      bar(0.62, -0.62, 0.12, 0.26);
      const top = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.015, 0.5), M.dark);
      top.position.y = 0.55;
      pg.add(top);
      const base = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.03, 0.34), M.dark);
      pg.add(base);
      car.add(pg);
    }
    [-1.6, lead ? 0.95 : 1.6].forEach((bx) => {
      const fr = new THREE.Mesh(new THREE.BoxGeometry(0.95, 0.1, 0.6), M.dark);
      fr.position.set(bx, 0.24, 0);
      car.add(fr);
      [-0.28, 0.28].forEach((ax) =>
        [1, -1].forEach((s) => {
          const pv = makeWheel(M, 0.155, 0.05);
          pv.position.set(bx + ax, 0.155, s * 0.25);
          car.add(pv);
          wheels.push({ pivot: pv, r: 0.155 });
        })
      );
    });
    return car;
  }

  addCar(0, true, 0);
  addCar(-(CL + 0.1), false, 1);
  addCar(-2 * (CL + 0.1), false, 2);

  [1, 2].forEach((k) => {
    const gx = -k * (CL + 0.1) + CL / 2 + 0.05;
    const bf = () => ({ y0: Y0 + 0.08, y1: Y0 + H - 0.1, w: W - 0.12, r: 0.12 });
    const bel = new THREE.Mesh(loft(makeStations(gx - 0.1, gx + 0.1, 6, bf), ringRR), M.rubber);
    g.add(bel);
  });

  return {
    group: g,
    wheels,
    anchors: [V3(0.1, 1.1, 0.62), V3(2.05, 1.05, 0)],
    length: 5.2,
    height: 1.9,
    ground: 0,
  };
}

/* ------------------------------------------------------------------------
   3. PESAWAT (Jet lorong tunggal, posisi jelajah)
   ------------------------------------------------------------------------ */
function buildPlane(M) {
  const g = new THREE.Group();
  const X0 = -4;
  const X1 = 4;
  const R = 0.43;
  const WHITE = rgbOf(0xeef1f5);
  const BELLY = rgbOf(0xaeb7c2);
  const NAVY = rgbOf(PAL.navy);
  const RED = rgbOf(PAL.red);

  const prof = (x) => {
    const u = clamp((-1.6 - x) / 2.4, 0, 1);
    const t = clamp((x - 2.5) / 1.5, 0, 1);
    const r = R * (1 - 0.86 * Math.pow(u, 1.5)) * (1 - 0.06 * t);
    const cy = 0.36 * Math.pow(u, 1.8) - 0.05 * t * t;
    return { y0: cy - r, y1: cy + r, w: r, n: 2.0 };
  };
  const paint = (x, y, z, st) => {
    const cy = (st.y0 + st.y1) / 2;
    const rr = (st.y1 - st.y0) / 2 || 1;
    const q = (y - cy) / rr;
    let c = mixRGB(BELLY, WHITE, smooth(-0.42, -0.2, q));
    const line = smooth(-0.2, -0.17, q) * (1 - smooth(-0.1, -0.07, q));
    c = mixRGB(c, RED, line * smooth(-3.0, -2.4, x) * (1 - smooth(2.0, 2.4, x)));
    return mixRGB(c, NAVY, smooth(-2.7, -3.5, x));
  };
  g.add(new THREE.Mesh(loft(makeStations(X0, X1, 120, prof, 0.12, 1.5), ringEll, { color: paint }), M.paint));

  const sub = (xa, xb, n) => makeStations(X0, X1, n, prof, 0.12, 1.5, xa, xb);
  g.add(new THREE.Mesh(loft(sub(2.72, 3.22, 14), ringEll, { j0: 21, j1: 35, off: 0.012 }), M.glass));

  const winGeo = new THREE.CircleGeometry(0.04, 14);
  winGeo.scale(0.85, 1.25, 1);
  const xs = [];
  for (let x = -2.2; x <= 2.05; x += 0.19) xs.push(x);
  const inst = new THREE.InstancedMesh(winGeo, M.glass, xs.length * 2);
  const m4 = new THREE.Matrix4();
  const q = new THREE.Quaternion();
  const e = new THREE.Euler();
  let n = 0;
  xs.forEach((x) =>
    [1, -1].forEach((s) => {
      e.set(0, s > 0 ? 0 : Math.PI, 0);
      q.setFromEuler(e);
      m4.compose(V3(x, 0.2 * R, s * R * 0.9805 + s * 0.002), q, V3(1, 1, 1));
      inst.setMatrixAt(n++, m4);
    })
  );
  g.add(inst);

  const wingM = new THREE.MeshPhysicalMaterial({
    color: C(0xdde2e9),
    roughness: 0.42,
    metalness: 0.2,
    clearcoat: 0.6,
    side: THREE.DoubleSide,
  });
  const sweptGeo = (pts, th) => {
    const s = new THREE.Shape();
    pts.forEach((p, i) => (i ? s.lineTo(p[0], p[1]) : s.moveTo(p[0], p[1])));
    const geo = new THREE.ExtrudeGeometry(s, {
      depth: th,
      bevelEnabled: true,
      bevelThickness: th * 0.3,
      bevelSize: th * 0.3,
      bevelSegments: 2,
    });
    geo.rotateX(Math.PI / 2);
    return geo;
  };
  const wGeo = sweptGeo(
    [
      [0.65, 0],
      [-1.55, 3.5],
      [-2.15, 3.5],
      [-1.45, 0.0],
    ],
    0.04
  );
  [1, -1].forEach((s) => {
    const w = new THREE.Mesh(wGeo, wingM);
    w.position.y = -0.2;
    w.scale.z = s;
    w.rotation.x = -s * 0.06;
    g.add(w);
    const wl = new THREE.Mesh(
      sweptGeo(
        [
          [0, 0],
          [-0.28, 0.0],
          [-0.5, 0.4],
          [-0.4, 0.4],
        ],
        0.02
      ),
      wingM
    );
    wl.position.set(-1.62, -0.2 + 3.5 * 0.06, s * 3.5);
    wl.rotation.set(s > 0 ? -Math.PI / 2 : Math.PI / 2, 0, 0);
    g.add(wl);
    const nl = new THREE.Mesh(
      new THREE.SphereGeometry(0.03, 10, 8),
      new THREE.MeshBasicMaterial({ color: C(s > 0 ? 0x3cff7a : 0xff3b3b) })
    );
    nl.position.set(-1.9, -0.2 + 3.5 * 0.06, s * 3.52);
    g.add(nl);
  });

  const lp = [
    [0.17, 0],
    [0.205, 0.05],
    [0.22, 0.22],
    [0.215, 0.6],
    [0.17, 0.95],
    [0.1, 1.08],
    [0.08, 1.1],
    [0.0, 1.1],
  ].map((p) => new THREE.Vector2(p[0], p[1]));
  const nGeo = new THREE.LatheGeometry(lp, 36);
  nGeo.rotateZ(Math.PI / 2);
  [1, -1].forEach((s) => {
    const eng = new THREE.Group();
    eng.position.set(0.55, -0.46, s * 1.22);
    eng.add(new THREE.Mesh(nGeo, M.white));
    const lipR = new THREE.Mesh(new THREE.TorusGeometry(0.19, 0.012, 8, 36), M.chrome);
    lipR.rotation.y = Math.PI / 2;
    eng.add(lipR);
    const inlet = new THREE.Mesh(new THREE.CircleGeometry(0.176, 32), M.dark);
    inlet.rotation.y = Math.PI / 2;
    inlet.position.x = -0.04;
    eng.add(inlet);
    const cone = new THREE.Mesh(new THREE.ConeGeometry(0.05, 0.14, 16), M.chrome);
    cone.rotation.z = -Math.PI / 2;
    eng.add(cone);
    const pyl = new THREE.Mesh(new THREE.BoxGeometry(0.55, 0.2, 0.04), M.white);
    pyl.position.set(-0.35, 0.2, 0);
    eng.add(pyl);
    g.add(eng);
  });

  const fin = new THREE.Mesh(
    sweptGeo(
      [
        [-2.2, 0],
        [-3.4, 1.28],
        [-3.88, 1.28],
        [-3.88, 0],
      ],
      0.05
    ),
    M.navy
  );
  fin.rotation.set(0, 0, 0);
  fin.geometry.rotateX(-Math.PI / 2);
  fin.position.set(0, 0.28, -0.03);
  g.add(fin);

  const stripe = new THREE.Mesh(
    new THREE.ShapeGeometry(
      (() => {
        const s = new THREE.Shape();
        [
          [-2.9, 0.05],
          [-3.2, 0.5],
          [-3.5, 0.5],
          [-3.2, 0.05],
        ].forEach((p, i) => (i ? s.lineTo(p[0], p[1]) : s.moveTo(p[0], p[1])));
        return s;
      })()
    ),
    M.red
  );
  [1, -1].forEach((s) => {
    const st = stripe.clone();
    st.position.set(0, 0.5, s * 0.056);
    if (s < 0) st.rotation.y = Math.PI;
    g.add(st);
  });

  const sGeo = sweptGeo(
    [
      [-3.0, 0],
      [-3.85, 1.2],
      [-4.0, 1.2],
      [-3.85, 0],
    ],
    0.03
  );
  [1, -1].forEach((s) => {
    const st = new THREE.Mesh(sGeo, wingM);
    st.position.set(0, 0.3, 0);
    st.scale.z = s;
    g.add(st);
  });

  const beacon = new THREE.Mesh(
    new THREE.SphereGeometry(0.03, 10, 8),
    new THREE.MeshBasicMaterial({ color: C(0xff4040) })
  );
  beacon.position.set(0.3, R + 0.01, 0);
  g.add(beacon);

  return {
    group: g,
    wheels: [],
    anchors: [V3(0.5, 0.1, 0.43), V3(-0.4, -0.18, 1.7)],
    length: 8.0,
    height: 1.0,
    lift: 1.1,
  };
}

/* ------------------------------------------------------------------------
   DUNIA — langit (shader), lingkungan per moda: jalan raya, rel kereta, awan
   ------------------------------------------------------------------------ */
const SKY = {
  bus: {
    top: 0x24457a,
    mid: 0x7e9cc4,
    hor: 0xf1cfa6,
    sun: [0.62, 0.16, -0.45],
    glow: 0xffd9a8,
    hemiS: 0xbfd2ee,
    hemiG: 0x3a3a30,
    key: 0xffd9ae,
    keyI: 2.3,
  },
  train: {
    top: 0x3b5f8d,
    mid: 0xa8bdd6,
    hor: 0xe6ebf0,
    sun: [0.5, 0.26, -0.5],
    glow: 0xfff1d9,
    hemiS: 0xd6e2f2,
    hemiG: 0x40463a,
    key: 0xfff0d8,
    keyI: 2.0,
  },
  plane: {
    top: 0x174a96,
    mid: 0x5f9ae0,
    hor: 0xa9cbee,
    sun: [-0.4, 0.45, -0.6],
    glow: 0xffffff,
    hemiS: 0xcfe0f5,
    hemiG: 0xbcc8d8,
    key: 0xffffff,
    keyI: 2.4,
  },
};

function makeSky() {
  const u = {
    cTop: { value: new THREE.Color() },
    cMid: { value: new THREE.Color() },
    cHor: { value: new THREE.Color() },
    cGlow: { value: new THREE.Color() },
    sun: { value: new THREE.Vector3(0, 0.2, -1) },
    gamma: { value: 1 },
  };
  const mat = new THREE.ShaderMaterial({
    uniforms: u,
    side: THREE.BackSide,
    depthWrite: false,
    fog: false,
    toneMapped: false,
    vertexShader:
      'varying vec3 vD; void main(){ vD = normalize(position); gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }',
    fragmentShader: [
      'uniform vec3 cTop; uniform vec3 cMid; uniform vec3 cHor; uniform vec3 cGlow; uniform vec3 sun; uniform float gamma; varying vec3 vD;',
      'void main(){',
      '  float h = clamp(vD.y, -0.2, 1.0);',
      '  vec3 c = mix(cHor, cMid, smoothstep(0.0, 0.22, h));',
      '  c = mix(c, cTop, smoothstep(0.18, 0.85, h));',
      '  c = mix(cHor * 0.82, c, smoothstep(-0.2, 0.0, h));',
      '  float s = max(dot(normalize(vD), normalize(sun)), 0.0);',
      '  c += cGlow * (pow(s, 6.0) * 0.28 + pow(s, 90.0) * 0.55 + pow(s, 900.0) * 1.2);',
      '  gl_FragColor = vec4(pow(max(c, 0.0), vec3(gamma)), 1.0);',
      '}',
    ].join('\n'),
  });
  const mesh = new THREE.Mesh(new THREE.SphereGeometry(420, 32, 16), mat);
  mesh.frustumCulled = false;
  mesh.renderOrder = -10;
  return { mesh, u };
}

function makeEnv(renderer, sky) {
  const es = new THREE.Scene();
  const em = sky.mesh.clone();
  em.material = sky.mesh.material.clone();
  em.material.uniforms = {
    cTop: { value: new THREE.Color().setHex(0x2c4f86, THREE.NoColorSpace) },
    cMid: { value: new THREE.Color().setHex(0x9fb6d4, THREE.NoColorSpace) },
    cHor: { value: new THREE.Color().setHex(0xf3e3cc, THREE.NoColorSpace) },
    cGlow: { value: new THREE.Color().setHex(0xfff0d8, THREE.NoColorSpace) },
    sun: { value: new THREE.Vector3(0.5, 0.35, 0.6) },
    gamma: { value: 2.2 },
  };
  es.add(em);
  const box = new THREE.Mesh(
    new THREE.PlaneGeometry(260, 120),
    new THREE.MeshBasicMaterial({ color: new THREE.Color(5, 5, 5), side: THREE.DoubleSide })
  );
  box.position.set(0, 300, 40);
  box.rotation.x = Math.PI / 2;
  es.add(box);
  const pm = new THREE.PMREMGenerator(renderer);
  const tex = pm.fromScene(es, 0.02).texture;
  pm.dispose();
  em.material.dispose();
  return tex;
}

const wrap = (v, span) => (((v % span) + span) % span) - span / 2;

function tileTex(canvasObj, rx, ry) {
  const t = canvasObj.tex;
  t.wrapS = t.wrapT = THREE.RepeatWrapping;
  t.repeat.set(rx, ry);
  t.anisotropy = 8;
  return t;
}

function worldRoad() {
  const g = new THREE.Group();
  const R = rng(11);
  const ro = canvasTex(1024, 256, (c, w, h) => {
    c.fillStyle = '#2b2f38';
    c.fillRect(0, 0, w, h);
    for (let i = 0; i < 9000; i++) {
      c.fillStyle = (R() > 0.5 ? 'rgba(255,255,255,' : 'rgba(0,0,0,') + (0.03 + R() * 0.09) + ')';
      c.fillRect(R() * w, R() * h, 1 + R() * 2, 1 + R() * 2);
    }
    c.fillStyle = 'rgba(255,255,255,.82)';
    c.fillRect(0, h * 0.06, w, 5);
    c.fillRect(0, h * 0.94 - 5, w, 5);
    c.fillStyle = 'rgba(240,200,80,.9)';
    for (let x = 0; x < w; x += 256) c.fillRect(x + 20, h / 2 - 3, 150, 6);
  });
  const roadTex = tileTex(ro, 600 / 12, 1);
  const road = new THREE.Mesh(
    new THREE.PlaneGeometry(600, 3.6),
    new THREE.MeshStandardMaterial({ map: roadTex, roughness: 0.82, metalness: 0 })
  );
  road.rotation.x = -Math.PI / 2;
  road.position.y = 0.002;
  g.add(road);

  const grTex = noiseTex(256, '#3c4a2f', 0, 2600, 5);
  const gt = tileTex(grTex, 150, 40);
  const grass = new THREE.Mesh(
    new THREE.PlaneGeometry(600, 160),
    new THREE.MeshStandardMaterial({ map: gt, roughness: 1 })
  );
  grass.rotation.x = -Math.PI / 2;
  g.add(grass);

  [1, -1].forEach((s) => {
    const sh = new THREE.Mesh(
      new THREE.PlaneGeometry(600, 0.5),
      new THREE.MeshStandardMaterial({ color: C(0x6b665c), roughness: 1 })
    );
    sh.rotation.x = -Math.PI / 2;
    sh.position.set(0, 0.001, s * 2.05);
    g.add(sh);
  });

  const trunkG = new THREE.CylinderGeometry(0.06, 0.1, 1, 6);
  const trunkM = new THREE.MeshStandardMaterial({ color: C(0x4a3a2a), roughness: 1 });
  const crownG = new THREE.SphereGeometry(1, 16, 12);
  {
    const p = crownG.attributes.position;
    for (let i = 0; i < p.count; i++) {
      const x = p.getX(i);
      const y = p.getY(i);
      const z = p.getZ(i);
      const k =
        0.86 +
        0.14 * Math.sin(x * 5.1 + y * 3.7) * Math.cos(z * 4.3 + x * 2.1) +
        0.06 * Math.sin(y * 9 + z * 7);
      p.setXYZ(i, x * k, y * k, z * k);
    }
    crownG.computeVertexNormals();
  }
  const crownMs = [0x2f4a2c, 0x38562f, 0x2a4228].map(
    (h) => new THREE.MeshStandardMaterial({ color: C(h), roughness: 1, flatShading: false })
  );
  const trees = [];
  const SPAN = 240;
  for (let i = 0; i < 70; i++) {
    const t = new THREE.Group();
    const s = 0.8 + R() * 1.1;
    const side = R() > 0.5 ? 1 : -1;
    const tr = new THREE.Mesh(trunkG, trunkM);
    tr.scale.set(s, 1.4 * s, s);
    tr.position.y = 0.7 * s;
    t.add(tr);
    for (let k = 0; k < 3; k++) {
      const cr = new THREE.Mesh(crownG, crownMs[(i + k) % 3]);
      const q = (0.55 + R() * 0.35) * s;
      cr.scale.set(q * 1.1, q * 0.9, q * 1.1);
      cr.position.set((R() - 0.5) * 0.6 * s, 1.5 * s + k * 0.3 * s, (R() - 0.5) * 0.6 * s);
      t.add(cr);
    }
    t.position.z = side > 0 ? 14 + R() * 20 : -(4.5 + R() * 16);
    t.userData.bx = (i / 70) * SPAN;
    g.add(t);
    trees.push(t);
  }

  const poles = [];
  for (let i = 0; i < 12; i++) {
    const p = new THREE.Group();
    const pole = new THREE.Mesh(
      new THREE.CylinderGeometry(0.03, 0.04, 3.2, 8),
      new THREE.MeshStandardMaterial({ color: C(0x9aa4b0), roughness: 0.5, metalness: 0.6 })
    );
    pole.position.y = 1.6;
    p.add(pole);
    const arm = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.04, 0.9), pole.material);
    arm.position.set(0, 3.2, -0.4);
    p.add(arm);
    p.position.z = 2.6;
    p.userData.bx = (i / 12) * SPAN;
    g.add(p);
    poles.push(p);
  }

  return {
    group: g,
    update(s) {
      roadTex.offset.x = -(s / 12) % 1;
      trees.forEach((t) => {
        t.position.x = wrap(t.userData.bx - s, SPAN);
      });
      poles.forEach((t) => {
        t.position.x = wrap(t.userData.bx - s, SPAN);
      });
    },
  };
}

function worldRail() {
  const g = new THREE.Group();
  const R = rng(23);
  const gt = tileTex(noiseTex(256, '#3f4a30', 0, 2400, 9), 150, 40);
  const field = new THREE.Mesh(
    new THREE.PlaneGeometry(600, 160),
    new THREE.MeshStandardMaterial({ map: gt, roughness: 1 })
  );
  field.rotation.x = -Math.PI / 2;
  field.position.y = -0.02;
  g.add(field);

  const bt = tileTex(noiseTex(256, '#6b6a66', 0, 5000, 3), 200, 1);
  const bed = new THREE.Mesh(
    new THREE.PlaneGeometry(600, 2.4),
    new THREE.MeshStandardMaterial({ map: bt, roughness: 1 })
  );
  bed.rotation.x = -Math.PI / 2;
  bed.position.y = 0.01;
  g.add(bed);

  const railM = new THREE.MeshStandardMaterial({ color: C(0xb6bcc6), roughness: 0.35, metalness: 0.9 });
  [1, -1].forEach((s) => {
    const r = new THREE.Mesh(new THREE.BoxGeometry(600, 0.05, 0.035), railM);
    r.position.set(0, 0.075, s * 0.25);
    g.add(r);
  });

  const NS = 220;
  const sl = new THREE.InstancedMesh(
    new THREE.BoxGeometry(0.2, 0.05, 0.95),
    new THREE.MeshStandardMaterial({ color: C(0x4a4038), roughness: 1 }),
    NS
  );
  const m4 = new THREE.Matrix4();
  for (let i = 0; i < NS; i++) {
    m4.makeTranslation((i - NS / 2) * 0.6, 0.045, 0);
    sl.setMatrixAt(i, m4);
  }
  const slG = new THREE.Group();
  slG.add(sl);
  g.add(slG);

  const SPAN = 240;
  const poles = [];
  const pm = new THREE.MeshStandardMaterial({ color: C(0x8c949f), roughness: 0.5, metalness: 0.7 });
  for (let i = 0; i < 18; i++) {
    const p = new THREE.Group();
    const mast = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.05, 3.1, 8), pm);
    mast.position.set(0, 1.55, -1.4);
    p.add(mast);
    const arm = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.04, 1.5), pm);
    arm.position.set(0, 2.9, -0.7);
    p.add(arm);
    const ins = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 0.35, 6), pm);
    ins.position.set(0, 2.72, -0.05);
    p.add(ins);
    p.userData.bx = (i / 18) * SPAN;
    g.add(p);
    poles.push(p);
  }

  const wireM = new THREE.LineBasicMaterial({ color: C(0x2a2f38) });
  [2.45, 2.6].forEach((y) => {
    const geo = new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(-300, y, y > 2.5 ? 0.08 : 0),
      new THREE.Vector3(300, y, y > 2.5 ? 0.08 : 0),
    ]);
    g.add(new THREE.Line(geo, wireM));
  });

  const bushG = new THREE.SphereGeometry(1, 14, 10);
  const bushM = new THREE.MeshStandardMaterial({ color: C(0x2e4a2a), roughness: 1 });
  const bushes = [];
  for (let i = 0; i < 60; i++) {
    const b = new THREE.Mesh(bushG, bushM);
    const s = 0.5 + R() * 1.6;
    b.scale.set(s * 1.4, s * 0.8, s);
    b.position.set(0, s * 0.5, R() > 0.5 ? 14 + R() * 12 : -(3 + R() * 22));
    b.userData.bx = (i / 60) * SPAN;
    g.add(b);
    bushes.push(b);
  }

  return {
    group: g,
    update(s) {
      slG.position.x = -(s % 0.6);
      poles.forEach((t) => {
        t.position.x = wrap(t.userData.bx - s, SPAN);
      });
      bushes.forEach((t) => {
        t.position.x = wrap(t.userData.bx - s, SPAN);
      });
    },
  };
}

function worldCloud() {
  const g = new THREE.Group();
  const R = rng(41);
  const tex = radialTex([
    [0, 'rgba(255,255,255,.95)'],
    [0.45, 'rgba(255,255,255,.55)'],
    [1, 'rgba(255,255,255,0)'],
  ]);
  const list = [];
  const SPAN = 260;
  const add = (n, yMin, yMax, zMin, zMax, sMin, sMax, op) => {
    for (let i = 0; i < n; i++) {
      const sp = new THREE.Sprite(
        new THREE.SpriteMaterial({
          map: tex,
          transparent: true,
          opacity: op * (0.6 + R() * 0.4),
          depthWrite: false,
          fog: false,
        })
      );
      const s = sMin + R() * (sMax - sMin);
      sp.scale.set(s * (1.4 + R()), s * (0.34 + R() * 0.2), 1);
      sp.position.set(0, yMin + R() * (yMax - yMin), zMin + R() * (zMax - zMin));
      sp.userData.bx = R() * SPAN;
      sp.userData.k = 0.7 + R() * 0.6;
      g.add(sp);
      list.push(sp);
    }
  };
  add(54, -7, -3.5, -90, 80, 18, 38, 0.9);
  add(34, -3, 4, -230, -70, 40, 90, 0.8);
  add(16, -2.5, 0.5, -70, -24, 10, 22, 0.55);
  add(10, 4, 16, -200, -90, 20, 40, 0.3);
  add(10, -4, -2, 8, 40, 6, 12, 0.45);
  return {
    group: g,
    update(s) {
      list.forEach((c) => {
        c.position.x = wrap(c.userData.bx - s * c.userData.k, SPAN);
      });
    },
  };
}

function ridgeLayers(col, tops, dist, opts = {}) {
  const g = new THREE.Group();
  tops.forEach((amp, i) => {
    const ct = canvasTex(2048, 128, (c, w, h) => {
      c.clearRect(0, 0, w, h);
      c.fillStyle = '#fff';
      c.beginPath();
      c.moveTo(0, h);
      for (let x = 0; x <= w; x += 4) {
        const y =
          h *
          (0.55 -
            amp *
              (0.5 * Math.sin(x * 0.0031 + i * 2) +
                0.3 * Math.sin(x * 0.0095 + i) +
                0.2 * Math.sin(x * 0.0235 + i * 4)) -
            0.2 * (opts.low ? 0.8 : 0));
        c.lineTo(x, y);
      }
      c.lineTo(w, h);
      c.closePath();
      c.fill();
    });
    const m = new THREE.MeshBasicMaterial({
      map: ct.tex,
      color: C(col[i]),
      transparent: true,
      fog: false,
      depthWrite: false,
    });
    const d = dist[i];
    const mesh = new THREE.Mesh(new THREE.PlaneGeometry(d * 2.6, d * 0.2), m);
    mesh.position.set(0, d * 0.075 + (opts.y || 0), -d);
    mesh.renderOrder = -5 + i;
    g.add(mesh);
  });
  return g;
}

/* =======================================================================
   3 MODA PERJALANAN (Bus · Kereta · Pesawat)
   ======================================================================= */
const MODES = [
  {
    id: 'bus',
    no: '01',
    name: 'Bus Pariwisata',
    short: 'Bus',
    title: 'Bus pariwisata untuk rombongan, dari 14 hingga 55+ penumpang',
    text: 'Armada utama kami: Full AC, kursi ergonomis, audio-video kabin, dan bagasi lega. Jemput di sekolah, kampus, atau kantor, singgah salat dan makan sesuai jadwal.',
    list: [
      'Hiace Premio · Medium Bus · Big Bus',
      'Driver & tour leader berpengalaman',
      'Jemput & singgah sesuai jadwal rombongan',
    ],
    spots: [
      ['Full AC · kursi ergonomis', 0],
      ['Driver & tour leader', 1],
    ],
    orbit: {
      az0: -0.32,
      az1: 0.92,
      el0: 0.1,
      el1: 0.72,
      dist0: 8.2,
      dist1: 7.8,
      pullIn: 0.6,
      look0: [0.0, 0.82, 0],
      look1: [0.3, 0.78, 0],
    },
    speed: 7,
    wheels: 1,
  },
  {
    id: 'train',
    no: '02',
    name: 'Kereta Api',
    short: 'Kereta',
    title: 'Kereta api untuk perjalanan antarkota yang tepat waktu',
    text: 'Cocok untuk rute panjang di Pulau Jawa. Kami membantu pemesanan tiket kelompok, pengaturan tempat duduk berdekatan, serta penjemputan dari dan ke stasiun.',
    list: [
      'Tiket kelompok & kursi berdekatan',
      'Transfer bus dari dan ke stasiun',
      'Rute Surabaya · Yogyakarta · Jakarta',
    ],
    spots: [
      ['Kursi berdekatan untuk rombongan', 0],
      ['Transfer stasiun terjadwal', 1],
    ],
    orbit: {
      az0: -0.28,
      az1: 0.88,
      el0: 0.1,
      el1: 0.7,
      dist0: 8.6,
      dist1: 8.2,
      pullIn: 0.6,
      look0: [-0.35, 0.82, 0],
      look1: [0.25, 0.78, 0],
    },
    speed: 16,
    wheels: 1,
  },
  {
    id: 'plane',
    no: '03',
    name: 'Pesawat',
    short: 'Pesawat',
    title: 'Pesawat untuk tujuan jauh: Bali, Labuan Bajo, hingga luar Jawa',
    text: 'Untuk tujuan antarpulau yang menghemat waktu. Kami menangani tiket grup, koordinasi bagasi, jadwal kumpul di bandara, dan transportasi darat di kota tujuan.',
    list: [
      'Tiket grup & manifest peserta',
      'Koordinasi bagasi dan jadwal check-in',
      'Transportasi darat di kota tujuan',
    ],
    spots: [
      ['Tiket grup & manifest', 0],
      ['Bagasi terkoordinasi', 1],
    ],
    orbit: {
      az0: -0.34,
      az1: 0.96,
      el0: 0.08,
      el1: 0.76,
      dist0: 11.2,
      dist1: 10.6,
      pullIn: 0.8,
      look0: [-0.15, 1.08, 0],
      look1: [0.2, 1.05, 0],
    },
    speed: 60,
    wheels: 0,
  },
];

export default function Armada3D() {
  const secRef = useRef(null);
  const stageRef = useRef(null);
  const canvasRef = useRef(null);
  const veilRef = useRef(null);
  const hsBoxRef = useRef(null);
  const noRef = useRef(null);
  const nameRef = useRef(null);
  const titleRef = useRef(null);
  const textRef = useRef(null);
  const listRef = useRef(null);
  const bodyRef = useRef(null);
  const barRef = useRef(null);
  const h2Ref = useRef(null);
  const modesNavRef = useRef(null);
  const stRef = useRef(null);

  useEffect(() => {
    const sec = secRef.current;
    const stage = stageRef.current;
    const canvas = canvasRef.current;
    if (!sec || !stage || !canvas) return;

    const veil = veilRef.current;
    const hsBox = hsBoxRef.current;
    const ui = {
      no: noRef.current,
      name: nameRef.current,
      title: titleRef.current,
      text: textRef.current,
      list: listRef.current,
      body: bodyRef.current,
      bar: barRef.current,
      h2: h2Ref.current,
    };
    const navBtns = modesNavRef.current
      ? Array.from(modesNavRef.current.querySelectorAll('[data-mode]'))
      : [];
    const reduceMotion = !!(
      window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches
    );

    let renderer;
    let roots = null;
    let envTex = null;
    let animFrameId = null;

    let uiMode = -1;
    let sceneMode = 0;
    let P = 0;
    let smoothP = 0;
    let lastSmoothP = 0;
    const modeS = [0, 0, 0];
    const travels = [0, 0, 0];
    let speedBoost = 0;
    let snapCamera = true;
    let vw = 1;
    let vh = 1;

    const damp = (a, b, lambda, dt) => a + (b - a) * (1 - Math.exp(-lambda * dt));

    function applyPalette(i, sky, scene, hemi, key) {
      const s = SKY[MODES[i].id];
      sky.u.cTop.value.setHex(s.top, THREE.NoColorSpace);
      sky.u.cMid.value.setHex(s.mid, THREE.NoColorSpace);
      sky.u.cHor.value.setHex(s.hor, THREE.NoColorSpace);
      sky.u.cGlow.value.setHex(s.glow, THREE.NoColorSpace);
      sky.u.sun.value.set(s.sun[0], s.sun[1], s.sun[2]);
      scene.fog.color.setHex(s.hor);
      scene.fog.near = MODES[i].id === 'plane' ? 60 : 28;
      scene.fog.far = MODES[i].id === 'plane' ? 400 : 190;
      hemi.color.setHex(s.hemiS);
      hemi.groundColor.setHex(s.hemiG);
      key.color.setHex(s.key);
      key.intensity = s.keyI * Math.PI;
    }

    function setMode(i, instant, sky, scene, hemi, key) {
      if (i === uiMode) return;
      uiMode = i;
      const m = MODES[i];
      navBtns.forEach((b) => {
        const on = +b.dataset.mode === i;
        b.classList.toggle('is-active', on);
        b.setAttribute('aria-selected', on ? 'true' : 'false');
      });
      const swap = () => {
        sceneMode = i;
        modeS[i] = clamp(P * MODES.length - i, 0, 1);
        snapCamera = true;
        if (ui.no) ui.no.textContent = m.no;
        if (ui.name) ui.name.textContent = m.name;
        if (ui.title) ui.title.textContent = m.title;
        if (ui.text) ui.text.textContent = m.text;
        if (ui.list) {
          ui.list.innerHTML = m.list.map((t) => '<li>' + escapeHTML(t) + '</li>').join('');
        }
        if (roots && sky && scene && hemi && key) {
          roots.forEach((r, k) => {
            r.visible = k === i;
          });
          applyPalette(i, sky, scene, hemi, key);
        }
      };
      if (instant || reduceMotion || !veil || !ui.body) {
        swap();
        return;
      }
      gsap.killTweensOf(veil);
      gsap.killTweensOf(ui.body);
      gsap
        .timeline()
        .to(veil, { opacity: 1, duration: 0.22, ease: 'sine.inOut' })
        .add(swap)
        .to(veil, { opacity: 0, duration: 0.52, ease: 'sine.out' }, '+=0.03')
        .fromTo(
          ui.body,
          { y: 14, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.52, ease: 'power3.out' },
          '<0.06'
        );
    }

    try {
      renderer = new THREE.WebGLRenderer({
        canvas,
        antialias: true,
        powerPreference: 'high-performance',
      });
    } catch {
      sec.classList.add('is-static');
      setMode(0, true);
      return undefined;
    }

    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.0;

    const scene = new THREE.Scene();
    const cam = new THREE.PerspectiveCamera(30, 1, 0.1, 900);
    const sky = makeSky();
    scene.add(sky.mesh);
    envTex = makeEnv(renderer, sky);
    scene.environment = envTex;
    scene.fog = new THREE.Fog(0xcfd8e4, 28, 190);

    const hemi = new THREE.HemisphereLight(0xffffff, 0x444444, 0.55 * Math.PI);
    scene.add(hemi);
    const key = new THREE.DirectionalLight(0xffffff, 2 * Math.PI);
    key.position.set(-6, 8, 10);
    scene.add(key);

    const M = makeMats();
    const logo = logoTex();
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(() => logo.redraw());
    }

    const vehicles = [buildBus(M, logo), buildTrain(M, logo), buildPlane(M)];
    vehicles[1].group.position.x = -0.6;
    vehicles[2].group.position.y = vehicles[2].lift || 0;

    // Bayangan kontak lembut di bawah bus & kereta
    const shTex = radialTex([
      [0, 'rgba(0,0,0,.55)'],
      [0.6, 'rgba(0,0,0,.25)'],
      [1, 'rgba(0,0,0,0)'],
    ]);
    const blob = (w, d) => {
      const m = new THREE.Mesh(
        new THREE.PlaneGeometry(w, d),
        new THREE.MeshBasicMaterial({ map: shTex, transparent: true, depthWrite: false })
      );
      m.rotation.x = -Math.PI / 2;
      m.position.y = 0.012;
      return m;
    };
    vehicles[0].group.add(blob(6.4, 1.9));
    const tb = blob(15.5, 1.6);
    tb.position.x = -4.6;
    vehicles[1].group.add(tb);

    const worlds = [worldRoad(), worldRail(), worldCloud()];
    const ridges = [
      ridgeLayers([0x8b9bb0, 0x6f8099, 0x55678a], [0.55, 0.7, 0.9], [210, 160, 120]),
      ridgeLayers([0xaebccb, 0x93a6bb, 0x7c91ab], [0.35, 0.5, 0.7], [210, 160, 120]),
      new THREE.Group(),
    ];

    roots = vehicles.map((v, i) => {
      const r = new THREE.Group();
      r.add(worlds[i].group, ridges[i], v.group);
      scene.add(r);
      return r;
    });

    /* --- hotspot --- */
    if (hsBox) hsBox.innerHTML = '';
    const spots = [];
    MODES.forEach((m, mi) =>
      m.spots.forEach((sp) => {
        const el = document.createElement('div');
        el.className = 'fx-hs';
        el.dataset.mode = String(mi);
        el.innerHTML = '<i></i><span>' + escapeHTML(sp[0]) + '</span>';
        if (hsBox) hsBox.appendChild(el);
        spots.push({ el, mi, v: vehicles[mi].anchors[sp[1]], on: 0 });
      })
    );

    /* --- variabel bantu kamera orbit --- */
    const targetCamPos = V3(0, 0, 0);
    const targetCamLook = V3(0, 1, 0);
    const curCamPos = V3(0, 0, 0);
    const curCamLook = V3(0, 1, 0);
    const mouse = { x: 0, y: 0, tx: 0, ty: 0 };

    setMode(0, true, sky, scene, hemi, key);
    roots.forEach((r, k) => {
      r.visible = k === 0;
    });
    applyPalette(0, sky, scene, hemi, key);

    /* --- ScrollTrigger Pin --- */
    const st = ScrollTrigger.create({
      trigger: stage,
      start: 'top top',
      end: () => `+=${window.innerHeight * 4.2}`,
      pin: true,
      pinSpacing: true,
      anticipatePin: 1,
      invalidateOnRefresh: true,
      refreshPriority: -1,
      onUpdate: (self) => {
        P = clamp(self.progress, 0, 0.9999);
      },
    });
    stRef.current = st;

    const clickHandlers = navBtns.map((b) => {
      const handler = () => {
        const i = +b.dataset.mode;
        if (stRef.current) {
          const trigger = stRef.current;
          const targetY =
            trigger.start + (trigger.end - trigger.start) * ((i + 0.08) / MODES.length);
          if (window.__lenis) {
            window.__lenis.scrollTo(targetY, { duration: 1.25 });
          } else {
            window.scrollTo({ top: targetY, behavior: reduceMotion ? 'auto' : 'smooth' });
          }
        }
      };
      b.addEventListener('click', handler);
      return { btn: b, handler };
    });

    /* --- ukuran --- */
    function resize() {
      const w = stage.clientWidth;
      const h = stage.clientHeight;
      if (!w || !h) return;
      vw = w;
      vh = h;
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.75));
      renderer.setSize(w, h, false);
      cam.aspect = w / h;
      cam.fov = w / h < 0.8 ? 40 : 30;
      const portrait = w / h < 0.9;
      cam.setViewOffset(w, h, portrait ? 0 : -w * 0.1, portrait ? h * 0.1 : 0, w, h);
      cam.updateProjectionMatrix();
    }
    resize();
    window.addEventListener('resize', resize);

    let inView = true;
    let io = null;
    if ('IntersectionObserver' in window) {
      io = new IntersectionObserver(
        (en) => {
          inView = en[0].isIntersecting;
        },
        { rootMargin: '15% 0px' }
      );
      io.observe(sec);
    }

    const onPointerMove = (e) => {
      mouse.tx = (e.clientX / window.innerWidth - 0.5) * 2;
      mouse.ty = (e.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener('pointermove', onPointerMove, { passive: true });

    const sv = V3(0, 0, 0);
    let last = performance.now();

    function frame(now) {
      animFrameId = requestAnimationFrame(frame);
      const dt = Math.min(0.05, Math.max(0.001, (now - last) / 1000));
      last = now;
      if (!inView) return;

      const n = MODES.length;
      smoothP = damp(smoothP, P, 8.5, dt);
      const c = clamp(Math.floor(P * n), 0, n - 1);
      if (c !== uiMode) setMode(c, false, sky, scene, hemi, key);

      for (let k = 0; k < n; k++) {
        const targetLocal = clamp(smoothP * n - k, 0, 1);
        modeS[k] = damp(modeS[k], targetLocal, 6.5, dt);
      }

      const scrollVel = Math.abs(smoothP - lastSmoothP) / dt;
      lastSmoothP = smoothP;
      speedBoost = damp(speedBoost, scrollVel * 1.6, 5.0, dt);

      const activeMode = sceneMode;
      const localP = clamp(smoothP * n - activeMode, 0, 1);
      const m = MODES[activeMode];
      const v = vehicles[activeMode];
      const t = now / 1000;

      // Gerak dunia & putaran roda yang halus
      const step = dt * m.speed * (1 + Math.min(speedBoost, 2.2) * 0.55);
      travels[activeMode] += step;
      worlds[activeMode].update(travels[activeMode], t);

      if (ridges[activeMode] && ridges[activeMode].children.length) {
        ridges[activeMode].children.forEach((layer, idx) => {
          layer.position.x = -Math.sin(travels[activeMode] * (0.0012 + idx * 0.0006)) * (4 + idx * 2);
        });
      }

      if (v.wheels && v.wheels.length) {
        const wheelDelta = step / (v.wheels[0].r || 0.25);
        v.wheels.forEach((w) => {
          w.pivot.rotation.z -= step / w.r;
        });
        void wheelDelta;
      }

      if (!reduceMotion) {
        if (m.id === 'bus') {
          v.group.position.y = Math.sin(t * 2.4) * 0.005 + Math.sin(t * 4.1) * 0.0018;
          v.group.rotation.z = Math.sin(t * 1.7) * 0.0022;
          v.group.rotation.x = Math.cos(t * 2.1) * 0.0015;
        } else if (m.id === 'train') {
          v.group.position.y = Math.sin(t * 2.8) * 0.0022;
          v.group.rotation.z = Math.sin(t * 1.9) * 0.0012;
        } else if (m.id === 'plane') {
          v.group.position.y =
            (v.lift || 0) + Math.sin(t * 1.05) * 0.045 + Math.cos(t * 0.65) * 0.018;
          v.group.rotation.z = Math.sin(t * 0.7) * 0.016;
          v.group.rotation.x = Math.sin(t * 0.5 + 1) * 0.012;
          v.group.rotation.y = Math.cos(t * 0.45) * 0.008;
        }
      }

      // Kamera orbit mulus: menyapu satu arah dari samping (eye-level) naik menuju atas (top 3/4)
      const u = clamp(modeS[activeMode], 0, 1);
      const eu = clamp(u * u * (3 - 2 * u) * 0.35 + u * 0.65, 0, 1);
      const orb = m.orbit;
      const az = lerp(orb.az0, orb.az1, eu);
      const el = lerp(orb.el0, orb.el1, Math.pow(eu, 1.2));
      const portrait = vw / vh < 0.9;
      const baseDist = lerp(orb.dist0, orb.dist1, eu) - Math.sin(eu * Math.PI) * orb.pullIn;
      const r = baseDist * (portrait ? 1.55 : 1.0);

      mouse.x = damp(mouse.x, mouse.tx, 4.5, dt);
      mouse.y = damp(mouse.y, mouse.ty, 4.5, dt);

      const gx = v.group.position.x;
      const gz = v.group.position.z;
      const lx = lerp(orb.look0[0], orb.look1[0], eu) + gx;
      const ly = lerp(orb.look0[1], orb.look1[1], eu);
      const lz = lerp(orb.look0[2], orb.look1[2], eu) + gz;
      const cosEl = Math.cos(el);

      targetCamPos.set(
        lx + r * cosEl * Math.sin(az) + mouse.x * 0.35,
        ly + r * Math.sin(el) - mouse.y * 0.14,
        lz + r * cosEl * Math.cos(az)
      );
      targetCamLook.set(lx, ly, lz);

      if (snapCamera) {
        curCamPos.copy(targetCamPos);
        curCamLook.copy(targetCamLook);
        snapCamera = false;
      } else {
        curCamPos.x = damp(curCamPos.x, targetCamPos.x, 10.0, dt);
        curCamPos.y = damp(curCamPos.y, targetCamPos.y, 10.0, dt);
        curCamPos.z = damp(curCamPos.z, targetCamPos.z, 10.0, dt);
        curCamLook.x = damp(curCamLook.x, targetCamLook.x, 12.0, dt);
        curCamLook.y = damp(curCamLook.y, targetCamLook.y, 12.0, dt);
        curCamLook.z = damp(curCamLook.z, targetCamLook.z, 12.0, dt);
      }

      cam.position.copy(curCamPos);
      cam.lookAt(curCamLook);
      cam.updateMatrixWorld();
      v.group.updateMatrixWorld();
      sky.mesh.position.copy(cam.position);

      // Hotspot (sinkron matriks pada frame yang sama + GPU translate3d)
      spots.forEach((s) => {
        const act =
          s.mi === activeMode && uiMode === activeMode
            ? smooth(0.1, 0.22, localP) * (1 - smooth(0.88, 0.98, localP))
            : 0;
        s.on = damp(s.on, act, 8.5, dt);
        if (s.on < 0.015) {
          s.el.style.opacity = '0';
          return;
        }
        sv.copy(s.v);
        v.group.localToWorld(sv);
        sv.project(cam);
        const x = (sv.x * 0.5 + 0.5) * vw;
        const y = (-sv.y * 0.5 + 0.5) * vh;
        s.el.style.transform = 'translate3d(' + x.toFixed(2) + 'px,' + y.toFixed(2) + 'px,0)';
        s.el.classList.toggle('is-left', x > vw * 0.66);
        const clear = smooth(vw * 0.36, vw * 0.5, x);
        s.el.style.opacity = (s.on * clear).toFixed(3);
      });

      if (ui.bar) ui.bar.style.transform = 'scaleX(' + smoothP.toFixed(4) + ')';
      if (ui.h2) ui.h2.style.opacity = (1 - smooth(0.012, 0.05, smoothP)).toFixed(3);
      renderer.render(scene, cam);
    }

    animFrameId = requestAnimationFrame(frame);

    return () => {
      if (animFrameId) cancelAnimationFrame(animFrameId);
      if (stRef.current) stRef.current.kill();
      if (io) io.disconnect();
      window.removeEventListener('resize', resize);
      window.removeEventListener('pointermove', onPointerMove);
      clickHandlers.forEach(({ btn, handler }) => btn.removeEventListener('click', handler));
      if (veil) gsap.killTweensOf(veil);
      if (ui.body) gsap.killTweensOf(ui.body);
      if (hsBox) hsBox.innerHTML = '';
      disposeTree(scene);
      if (envTex) envTex.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <>
      {/* ================================================================
           1. #armada — ARMADA & MODA (bus · kereta · pesawat), Three.js digerakkan scroll
      ================================================================= */}
      <section
        id="armada"
        ref={secRef}
        className="fx fx-armada"
        aria-label="Armada dan moda perjalanan FAD Tour & Travel"
      >
        <div ref={stageRef} className="fx-armada-stage">
          <canvas
            ref={canvasRef}
            id="fx-fleet-canvas"
            role="img"
            aria-label="Model 3D armada FAD Tour & Travel: bus, kereta api, dan pesawat"
          ></canvas>
          <div className="fx-shade" aria-hidden="true"></div>
          <div ref={hsBoxRef} className="fx-hotspots" id="fx-hotspots" aria-hidden="true"></div>

          <div className="fx-armada-ui">
            <header className="fx-a-head">
              <p className="fx-kicker">
                <span></span>Armada &amp; Moda
              </p>
              <h2 ref={h2Ref} className="fx-h2" id="fx-armada-h2">
                Satu biro, <em>tiga moda perjalanan.</em>
              </h2>
            </header>

            <div className="fx-a-copy">
              <div ref={bodyRef} className="fx-a-body" id="fx-m-body">
                <p className="fx-a-no">
                  <b ref={noRef} id="fx-m-no">
                    01
                  </b>
                  <span>/ 03</span>
                  <i></i>
                  <span ref={nameRef} id="fx-m-name">
                    Bus Pariwisata
                  </span>
                </p>
                <h3 ref={titleRef} className="fx-a-title" id="fx-m-title">
                  Bus pariwisata untuk rombongan, dari 14 hingga 55+ penumpang
                </h3>
                <p ref={textRef} className="fx-a-text" id="fx-m-text">
                  Armada utama kami: Full AC, kursi ergonomis, audio-video kabin, dan bagasi lega.
                  Jemput di sekolah, kampus, atau kantor, singgah salat dan makan sesuai jadwal.
                </p>
                <ul ref={listRef} className="fx-a-list" id="fx-m-list">
                  <li>Hiace Premio · Medium Bus · Big Bus</li>
                  <li>Driver &amp; tour leader berpengalaman</li>
                  <li>Jemput &amp; singgah sesuai jadwal rombongan</li>
                </ul>
              </div>
              <a
                className="fx-link"
                href="https://wa.me/6282131568710"
                target="_blank"
                rel="noopener noreferrer"
              >
                Konsultasi armada · 0821-3156-8710
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M5 12h14M13 6l6 6-6 6" />
                </svg>
              </a>
            </div>

            <nav
              ref={modesNavRef}
              className="fx-modes"
              id="fx-modes"
              aria-label="Pilih moda perjalanan"
              role="tablist"
            >
              <button
                type="button"
                role="tab"
                className="is-active"
                data-mode="0"
                aria-selected="true"
              >
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <rect x="4" y="3" width="16" height="14" rx="3" />
                  <path d="M4 11h16M8 21v-4M16 21v-4" />
                  <circle cx="8" cy="14" r=".6" />
                  <circle cx="16" cy="14" r=".6" />
                </svg>
                <span>Bus</span>
              </button>
              <button type="button" role="tab" data-mode="1" aria-selected="false">
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <rect x="5" y="3" width="14" height="14" rx="4" />
                  <path d="M5 11h14M9 21l2-4M15 21l-2-4" />
                  <circle cx="9" cy="14" r=".6" />
                  <circle cx="15" cy="14" r=".6" />
                </svg>
                <span>Kereta</span>
              </button>
              <button type="button" role="tab" data-mode="2" aria-selected="false">
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M21 16v-2l-8-5V3.5a1.5 1.5 0 0 0-3 0V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5z" />
                </svg>
                <span>Pesawat</span>
              </button>
              <i className="fx-m-bar" aria-hidden="true">
                <b ref={barRef} id="fx-m-bar"></b>
              </i>
            </nav>
          </div>

          <div ref={veilRef} className="fx-veil" id="fx-veil" aria-hidden="true"></div>
          <div className="fx-fallback">
            <p>
              Tampilan 3D tidak tersedia di browser ini. Hubungi kami di WhatsApp 0821-3156-8710
              untuk informasi armada bus, kereta, dan pesawat.
            </p>
          </div>
        </div>
      </section>

      {/* ================================================================
           2. Dokumentasi Live Travel Bersama Rombongan (@fadtourtravel)
      ================================================================= */}
      <section className="relative py-20 sm:py-24 px-4 sm:px-6 lg:px-10 text-white overflow-hidden bg-[#0B132B]">
        <div className="relative z-10 max-w-7xl mx-auto space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 text-xs font-extrabold uppercase tracking-widest text-[#EF3340] font-display">
                <span className="w-2.5 h-2.5 rounded-full bg-[#EF3340] animate-ping"></span>
                <span>Jurnal Perjalanan Nyata • @fadtourtravel</span>
              </div>
              <h3 className="font-display font-extrabold text-2xl sm:text-3xl text-white mt-1">
                Dokumentasi Live Travel Bersama Rombongan
              </h3>
            </div>

            <a
              href="https://instagram.com/fadtourtravel"
              target="_blank"
              rel="noopener noreferrer"
              className="self-start sm:self-auto px-5 py-2.5 rounded-full bg-white/10 hover:bg-white hover:text-slate-950 border border-white/20 text-xs font-extrabold transition font-display"
            >
              Lihat Instagram @fadtourtravel ↗
            </a>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {JOURNAL_POSTS.map((post, idx) => (
              <article
                key={`journal-post-${idx}`}
                className="rounded-3xl overflow-hidden relative group h-100 bg-slate-900 border border-white/15 shadow-xl"
              >
                <img
                  src={post.img}
                  alt={post.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-linear-to-t from-[#070D1D] via-[#070D1D]/55 to-black/35" />

                <div className="absolute top-4 left-4 right-4 flex items-center justify-between gap-2">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EF3340] text-white text-[10px] font-extrabold uppercase tracking-wider shadow font-display">
                    <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                    {post.badge}
                  </span>
                  {post.badgeSecondary ? (
                    <span className="px-2.5 py-1 rounded-full bg-slate-950/70 backdrop-blur-md text-[10px] font-semibold text-sky-200">
                      {post.badgeSecondary}
                    </span>
                  ) : (
                    <span className="px-2.5 py-1 rounded-full bg-slate-950/75 backdrop-blur-md text-[10px] font-bold text-white border border-white/15">
                      0821-3156-8710
                    </span>
                  )}
                </div>

                <div className="absolute bottom-5 left-5 right-5 space-y-2">
                  <span className="inline-block px-2.5 py-0.5 rounded-md bg-white/15 backdrop-blur-md text-[10px] font-extrabold uppercase tracking-wider text-sky-300 font-display">
                    {post.tag}
                  </span>
                  <h4 className="font-display font-extrabold text-lg text-white leading-snug">
                    {post.title}
                  </h4>
                  <p className="text-xs text-slate-300 leading-relaxed">{post.desc}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
