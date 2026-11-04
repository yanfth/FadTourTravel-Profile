import { useState, useEffect, useRef } from 'react';
import * as THREE from 'three';
import { JOURNAL_POSTS } from '../data/travelData';

function buildFADLogoTexture() {
  const cv = document.createElement('canvas');
  cv.width = 256;
  cv.height = 256;
  const ctx = cv.getContext('2d');
  ctx.fillStyle = '#FFFFFF';
  ctx.fillRect(0, 0, 256, 256);
  ctx.fillStyle = '#EF3340';
  ctx.font = '900 86px Outfit, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('FAD', 128, 102);
  ctx.font = '800 46px Outfit, sans-serif';
  ctx.fillText('TOUR', 128, 158);
  ctx.fillStyle = '#0B132B';
  ctx.font = '700 28px "Plus Jakarta Sans", sans-serif';
  ctx.fillText('& TRAVEL', 128, 204);
  return new THREE.CanvasTexture(cv);
}

export default function Armada3D() {
  const [modelMode, setModelMode] = useState('bus');
  const canvasRef = useRef(null);
  const wrapRef = useRef(null);

  const busGroupRef = useRef(null);
  const suitcaseGroupRef = useRef(null);
  const modeRef = useRef(modelMode);

  useEffect(() => {
    modeRef.current = modelMode;
    if (busGroupRef.current && suitcaseGroupRef.current) {
      busGroupRef.current.visible = modelMode === 'bus';
      suitcaseGroupRef.current.visible = modelMode === 'suitcase';
    }
  }, [modelMode]);

  useEffect(() => {
    const wrap = wrapRef.current;
    const canvas = canvasRef.current;
    if (!wrap || !canvas) return;

    let scene, camera, renderer, animFrameId;
    let dragging = false;
    let lastX = 0;
    let lastY = 0;
    let rotY = -0.58;
    let rotX = 0.14;
    let inView = true;

    try {
      scene = new THREE.Scene();
      const w = wrap.clientWidth || 600;
      const h = wrap.clientHeight || 350;

      camera = new THREE.PerspectiveCamera(40, w / h, 0.1, 100);
      camera.position.set(0, 0.55, 6.5);

      renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
      renderer.setSize(w, h);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

      // Studio Lighting
      scene.add(new THREE.AmbientLight(0xffffff, 0.88));
      const dirKey = new THREE.DirectionalLight(0xffffff, 1.2);
      dirKey.position.set(5, 8, 6);
      scene.add(dirKey);
      const dirRim = new THREE.DirectionalLight(0x60a5fa, 0.65);
      dirRim.position.set(-6, 3, -5);
      scene.add(dirRim);

      // Materials
      const darkBodyMat = new THREE.MeshStandardMaterial({ color: 0x111c33, roughness: 0.28, metalness: 0.22 });
      const redLiveryMat = new THREE.MeshStandardMaterial({ color: 0xef3340, roughness: 0.25, metalness: 0.14 });
      const pearlRoofMat = new THREE.MeshStandardMaterial({ color: 0xf8fafc, roughness: 0.25, metalness: 0.1 });
      const glassTintMat = new THREE.MeshStandardMaterial({ color: 0x0b192c, roughness: 0.1, metalness: 0.35, transparent: true, opacity: 0.72 });
      const tireMat = new THREE.MeshStandardMaterial({ color: 0x090d16, roughness: 0.75 });
      const rimMat = new THREE.MeshStandardMaterial({ color: 0xe2e8f0, roughness: 0.28, metalness: 0.65 });
      const tvScreenMat = new THREE.MeshBasicMaterial({ color: 0x38bdf8 });
      const lampWarmMat = new THREE.MeshBasicMaterial({ color: 0xfef08a });
      const tailRedMat = new THREE.MeshBasicMaterial({ color: 0xff2a3a });

      // MODEL 1: FAD LUXURY TOUR BUS
      const busGroup = new THREE.Group();
      busGroupRef.current = busGroup;

      const lowerChassis = new THREE.Mesh(new THREE.BoxGeometry(4.15, 0.66, 1.4), darkBodyMat);
      lowerChassis.position.y = -0.30;
      busGroup.add(lowerChassis);

      const redBelt = new THREE.Mesh(new THREE.BoxGeometry(4.19, 0.28, 1.43), redLiveryMat);
      redBelt.position.y = -0.12;
      busGroup.add(redBelt);

      const windowBand = new THREE.Mesh(new THREE.BoxGeometry(4.02, 0.64, 1.34), glassTintMat);
      windowBand.position.y = 0.36;
      busGroup.add(windowBand);

      const roof = new THREE.Mesh(new THREE.BoxGeometry(4.10, 0.20, 1.38), pearlRoofMat);
      roof.position.y = 0.77;
      busGroup.add(roof);

      const acUnit = new THREE.Mesh(new THREE.BoxGeometry(1.85, 0.16, 0.94), redLiveryMat);
      acUnit.position.set(-0.08, 0.92, 0);
      busGroup.add(acUnit);

      // Glowing Dual Cabin TVs
      const tv1 = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.25, 0.46), tvScreenMat);
      tv1.position.set(1.08, 0.45, 0);
      busGroup.add(tv1);

      const tv2 = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.25, 0.46), tvScreenMat);
      tv2.position.set(-0.32, 0.45, 0);
      busGroup.add(tv2);

      // Lights
      [-0.46, 0.46].forEach(zP => {
        const hl = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.14, 0.24), lampWarmMat);
        hl.position.set(2.08, -0.36, zP);
        busGroup.add(hl);

        const tl = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.16, 0.22), tailRedMat);
        tl.position.set(-2.08, -0.32, zP);
        busGroup.add(tl);
      });

      // Wheels
      const wGeo = new THREE.CylinderGeometry(0.32, 0.32, 0.22, 24);
      const rGeo = new THREE.CylinderGeometry(0.16, 0.16, 0.24, 16);
      [1.26, -0.96, -1.54].forEach(xP => {
        [-0.69, 0.69].forEach(zP => {
          const tire = new THREE.Mesh(wGeo, tireMat);
          tire.rotation.x = Math.PI / 2;
          tire.position.set(xP, -0.63, zP);
          busGroup.add(tire);

          const hub = new THREE.Mesh(rGeo, rimMat);
          hub.rotation.x = Math.PI / 2;
          hub.position.set(xP, -0.63, zP);
          busGroup.add(hub);
        });
      });

      scene.add(busGroup);

      // MODEL 2: 3D RED FAD SUITCASE
      const suitcaseGroup = new THREE.Group();
      suitcaseGroupRef.current = suitcaseGroup;

      const sBody = new THREE.Mesh(new THREE.BoxGeometry(1.75, 2.25, 0.82), redLiveryMat);
      suitcaseGroup.add(sBody);

      const logoPlateMat = new THREE.MeshStandardMaterial({ map: buildFADLogoTexture(), roughness: 0.24 });
      const logoPlate = new THREE.Mesh(new THREE.BoxGeometry(1.18, 1.18, 0.86), logoPlateMat);
      logoPlate.position.y = 0.04;
      suitcaseGroup.add(logoPlate);

      [-0.36, 0.36].forEach(xP => {
        const rod = new THREE.Mesh(new THREE.CylinderGeometry(0.045, 0.045, 0.68, 12), rimMat);
        rod.position.set(xP, 1.42, 0);
        suitcaseGroup.add(rod);
      });
      const handleBar = new THREE.Mesh(new THREE.BoxGeometry(0.88, 0.11, 0.14), tireMat);
      handleBar.position.set(0, 1.76, 0);
      suitcaseGroup.add(handleBar);

      [-0.58, 0.58].forEach(xP => {
        [-0.25, 0.25].forEach(zP => {
          const wheel = new THREE.Mesh(new THREE.SphereGeometry(0.13, 14, 14), tireMat);
          wheel.position.set(xP, -1.22, zP);
          suitcaseGroup.add(wheel);
        });
      });

      suitcaseGroup.visible = false;
      scene.add(suitcaseGroup);

      // Mouse & Touch Controls
      const onDown = (cx, cy) => {
        dragging = true;
        lastX = cx;
        lastY = cy;
      };
      const onMove = (cx, cy) => {
        if (!dragging) return;
        rotY += (cx - lastX) * 0.011;
        rotX = Math.max(-0.38, Math.min(0.52, rotX + (cy - lastY) * 0.007));
        lastX = cx;
        lastY = cy;
      };

      const handleMouseDown = (e) => onDown(e.clientX, e.clientY);
      const handleMouseMove = (e) => onMove(e.clientX, e.clientY);
      const handleMouseUp = () => { dragging = false; };

      const handleTouchStart = (e) => {
        if (e.touches.length === 1) onDown(e.touches[0].clientX, e.touches[0].clientY);
      };
      const handleTouchMove = (e) => {
        if (e.touches.length === 1) onMove(e.touches[0].clientX, e.touches[0].clientY);
      };
      const handleTouchEnd = () => { dragging = false; };

      wrap.addEventListener('mousedown', handleMouseDown);
      window.addEventListener('mousemove', handleMouseMove, { passive: true });
      window.addEventListener('mouseup', handleMouseUp);

      wrap.addEventListener('touchstart', handleTouchStart, { passive: true });
      wrap.addEventListener('touchmove', handleTouchMove, { passive: true });
      wrap.addEventListener('touchend', handleTouchEnd, { passive: true });

      // Intersection Observer
      const io = new IntersectionObserver(entries => {
        inView = entries[0].isIntersecting;
      }, { threshold: 0.05 });
      io.observe(wrap);

      // Animation Loop
      const animate = (t) => {
        animFrameId = requestAnimationFrame(animate);
        if (!inView || !renderer || !scene || !camera) return;

        if (!dragging) rotY += 0.0045;
        const targetObj = modeRef.current === 'bus' ? busGroup : suitcaseGroup;
        if (targetObj) {
          targetObj.rotation.y += (rotY - targetObj.rotation.y) * 0.08;
          targetObj.rotation.x += (rotX - targetObj.rotation.x) * 0.08;
          targetObj.position.y = Math.sin(t * 0.0022) * 0.07;
        }

        renderer.render(scene, camera);
      };
      animate(0);

      // Resize
      const handleResize = () => {
        if (!wrap || !camera || !renderer) return;
        const newW = wrap.clientWidth;
        const newH = wrap.clientHeight;
        camera.aspect = newW / newH;
        camera.updateProjectionMatrix();
        renderer.setSize(newW, newH);
      };
      window.addEventListener('resize', handleResize);

      return () => {
        cancelAnimationFrame(animFrameId);
        io.disconnect();
        window.removeEventListener('resize', handleResize);
        wrap.removeEventListener('mousedown', handleMouseDown);
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('mouseup', handleMouseUp);
        wrap.removeEventListener('touchstart', handleTouchStart);
        wrap.removeEventListener('touchmove', handleTouchMove);
        wrap.removeEventListener('touchend', handleTouchEnd);
        renderer.dispose();
      };
    } catch (e) {
      console.error('Three.js failed to initialize', e);
    }
  }, []);

  return (
    <section id="armada" className="relative py-24 sm:py-28 px-4 sm:px-6 lg:px-10 text-white overflow-hidden bg-[#0B132B]">
      {/* Dark Coastal Highway Backdrop */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=1920&q=85"
          alt="Armada Bus Pariwisata FAD Tour & Travel"
          className="w-full h-full object-cover object-center opacity-30"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#070D1D]/96 via-[#0B132B]/90 to-[#0F2042]/85"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-[#0B132B]/60 via-transparent to-[#070D1D]"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto space-y-20">

        {/* Upper Grid: Three.js 3D Interactive Stage + What's Included */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">

          {/* Left 7 Cols: Interactive Three.js 3D Bus & Suitcase Stage */}
          <div className="lg:col-span-7 space-y-6">
            <div className="space-y-3">
              <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 border border-white/20 text-xs font-bold tracking-wider uppercase text-sky-300 font-display">
                <span>Interactive 3D Armada &amp; Identitas FAD</span>
              </span>
              <h2 className="font-display font-extrabold text-3xl sm:text-5xl leading-[1.08] tracking-tight text-white">
                Kabin Nyaman dengan <span className="font-serif italic font-semibold text-sky-300">Dual TV &amp; Hiburan Penuh</span>
              </h2>
              <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-2xl">
                Setiap perpindahan dari titik jemput hingga destinasi akhir terasa menyenangkan berkat kabin sejuk, kursi ergonomis, serta layar TV gantung ganda di dalam bus. Geser panggung 3D di bawah untuk melihat detailnya.
              </p>
            </div>

            {/* 3D Canvas Card */}
            <div className="relative rounded-3xl overflow-hidden border border-white/15 bg-gradient-to-b from-[#13254C]/75 to-[#070D1D]/95 shadow-2xl">
              <div className="absolute top-4 left-4 right-4 z-20 flex flex-wrap items-center justify-between gap-2 pointer-events-none">
                <div className="flex items-center gap-2 pointer-events-auto">
                  <button
                    onClick={() => setModelMode('bus')}
                    className={`px-4 py-2 rounded-full text-xs font-extrabold transition cursor-pointer font-display ${
                      modelMode === 'bus'
                        ? 'bg-[#EF3340] text-white shadow-md'
                        : 'bg-white/10 hover:bg-white/20 text-white border border-white/20 backdrop-blur-md'
                    }`}
                  >
                    🚌 FAD Luxury Bus 3D
                  </button>
                  <button
                    onClick={() => setModelMode('suitcase')}
                    className={`px-4 py-2 rounded-full text-xs font-semibold transition cursor-pointer font-display ${
                      modelMode === 'suitcase'
                        ? 'bg-[#EF3340] text-white shadow-md'
                        : 'bg-white/10 hover:bg-white/20 text-white border border-white/20 backdrop-blur-md'
                    }`}
                  >
                    🧳 Koper Merah FAD 3D
                  </button>
                </div>
                <span className="px-3 py-1 rounded-full bg-slate-950/65 backdrop-blur-md text-[11px] font-semibold text-sky-200 border border-white/10">
                  ↻ Drag / Geser untuk putar 360°
                </span>
              </div>

              <div ref={wrapRef} id="three-stage-wrap" className="w-full h-[310px] sm:h-[360px] cursor-grab active:cursor-grabbing">
                <canvas ref={canvasRef} id="three-stage-canvas" className="w-full h-full block"></canvas>
              </div>

              <div className="grid grid-cols-3 divide-x divide-white/10 border-t border-white/15 bg-slate-950/55 px-4 py-3.5 text-center">
                <div>
                  <p className="font-display font-extrabold text-base sm:text-lg text-white">Dual Cabin TV</p>
                  <p className="text-[11px] text-slate-400">Karaoke &amp; Hiburan Rombongan</p>
                </div>
                <div>
                  <p className="font-display font-extrabold text-base sm:text-lg text-white">30 – 55+ Seat</p>
                  <p className="text-[11px] text-slate-400">Medium &amp; Big Bus Pariwisata</p>
                </div>
                <div>
                  <p className="font-display font-extrabold text-base sm:text-lg text-white">24/7 Kru</p>
                  <p className="text-[11px] text-slate-400">Driver &amp; Tour Leader Ramah</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right 5 Cols: What's Included Glassmorphism Card */}
          <div className="lg:col-span-5">
            <div className="glass-frosted-dark rounded-3xl p-7 sm:p-9 space-y-6">
              <div className="border-b border-white/20 pb-4">
                <p className="text-[11px] font-extrabold uppercase tracking-[0.2em] text-sky-300 font-display">What's Included</p>
                <h3 className="font-display font-extrabold text-2xl text-white mt-1">Fasilitas Standar Rombongan</h3>
              </div>

              <ul className="space-y-4 text-sm text-slate-100">
                <li className="flex items-start gap-3.5">
                  <span className="w-8 h-8 rounded-full bg-[#EF3340]/25 border border-[#EF3340]/40 flex items-center justify-center shrink-0 text-sm">📍</span>
                  <span><strong>Penjemputan Gresik &amp; Sekitarnya:</strong> Jemput tepat di sekolah, kampus, kantor instansi, maupun balai komunitas.</span>
                </li>
                <li className="flex items-start gap-3.5">
                  <span className="w-8 h-8 rounded-full bg-[#EF3340]/25 border border-[#EF3340]/40 flex items-center justify-center shrink-0 text-sm">📺</span>
                  <span><strong>Armada Bus Full AC + Dual TV Karaoke:</strong> Kabin bersih dengan sistem audio-video ganda penghibur suasana perjalanan jauh.</span>
                </li>
                <li className="flex items-start gap-3.5">
                  <span className="w-8 h-8 rounded-full bg-[#EF3340]/25 border border-[#EF3340]/40 flex items-center justify-center shrink-0 text-sm">🕌</span>
                  <span><strong>Singgah Masjid &amp; RM Prasmanan Terjadwal:</strong> Waktu salat nyaman dan makan prasmanan halal tanpa antre panjang.</span>
                </li>
                <li className="flex items-start gap-3.5">
                  <span className="w-8 h-8 rounded-full bg-[#EF3340]/25 border border-[#EF3340]/40 flex items-center justify-center shrink-0 text-sm">🧭</span>
                  <span><strong>Tour Leader Berpengalaman:</strong> Pendampingan penuh pengurusan tiket wisata, hotel, hingga koordinasi kunjungan kampus.</span>
                </li>
                <li className="flex items-start gap-3.5">
                  <span className="w-8 h-8 rounded-full bg-[#EF3340]/25 border border-[#EF3340]/40 flex items-center justify-center shrink-0 text-sm">📸</span>
                  <span><strong>Dokumentasi Live Travel:</strong> Spanduk rombongan eksklusif &amp; liputan momen seru di Instagram <em>@fadtourtravel</em>.</span>
                </li>
              </ul>

              <div className="pt-2">
                <a
                  href="https://wa.me/6282131568710"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full text-center bg-white hover:bg-[#EF3340] text-slate-950 hover:text-white font-extrabold text-xs sm:text-sm py-3.5 px-6 rounded-full transition-colors duration-300 shadow-lg font-display"
                >
                  Konsultasi Armada: 0821-3156-8710
                </a>
              </div>
            </div>
          </div>

        </div>

        {/* Lower Strip: Authentic Live Travel Journal (@fadtourtravel) */}
        <div className="space-y-6">
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
                key={idx}
                className="rounded-3xl overflow-hidden relative group h-[400px] bg-slate-900 border border-white/15 shadow-xl"
              >
                <img
                  src={post.img}
                  alt={post.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#070D1D] via-[#070D1D]/55 to-black/35"></div>

                <div className="absolute top-4 left-4 right-4 flex items-center justify-between gap-2">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EF3340] text-white text-[10px] font-extrabold uppercase tracking-wider shadow font-display">
                    <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse"></span>
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
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {post.desc}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
