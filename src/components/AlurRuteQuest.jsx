import { useState, useEffect, useRef, useCallback } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { QUEST_PRESETS } from '../data/travelData';

gsap.registerPlugin(ScrollTrigger);

// Helper function to build zone architectural layers
function buildZoneArchitecturalLayers(zoneType, zoneStartX, Z) {
  const cx = zoneStartX + Z * 0.52;
  const spireX = zoneStartX + Z * 0.66;

  let backMarkup = `
    <path d="M ${zoneStartX - 40} 900 L ${zoneStartX - 40} 615 Q ${zoneStartX + Z * 0.28} 555 ${zoneStartX + Z * 0.56} 610 T ${zoneStartX + Z + 40} 595 L ${zoneStartX + Z + 40} 900 Z"
          fill="#0F294A" opacity="0.34"/>
  `;
  let frontMarkup = '';

  if (zoneType === 'sekolah') {
    backMarkup += `
      <g transform="translate(${(cx - 210).toFixed(1)}, 495)">
        <polygon points="-20,58 175,-6 370,58" fill="#B91C1C"/>
        <rect x="0" y="58" width="350" height="145" rx="4" fill="#E2E8F0"/>
        <rect x="28" y="82" width="46" height="54" rx="4" fill="#1E3A8A"/>
        <rect x="96" y="82" width="46" height="54" rx="4" fill="#1E3A8A"/>
        <rect x="206" y="82" width="46" height="54" rx="4" fill="#1E3A8A"/>
        <rect x="274" y="82" width="46" height="54" rx="4" fill="#1E3A8A"/>
        <rect x="148" y="112" width="54" height="90" rx="4" fill="#0F172A"/>
      </g>
    `;
    frontMarkup += `
      <g transform="translate(${spireX.toFixed(1)}, 0)">
        <rect x="-118" y="240" width="5" height="450" fill="#F1F5F9"/>
        <path d="M-113 244 Q-78 236 -48 248 L-48 268 Q-78 258 -113 266 Z" fill="#EF3340"/>
        <path d="M-113 266 Q-78 258 -48 268 L-48 288 Q-78 278 -113 286 Z" fill="#FFFFFF"/>

        <rect x="-3" y="195" width="6" height="48" fill="#0B132B"/>
        <polygon points="0,232 -46,352 46,352" fill="#DC2626"/>
        <rect x="-38" y="352" width="76" height="335" rx="4" fill="#0F1D3A"/>
        <circle cx="0" cy="402" r="21" fill="#F8FAFC"/>
        <path d="M0 389 V402 L10 408" stroke="#0B132B" stroke-width="3" stroke-linecap="round" fill="none"/>

        <g transform="translate(-285, 608)">
          <rect x="0" y="0" width="215" height="68" rx="13" fill="#F8FAFC"/>
          <path d="M12 10 H198 C204 10 208 16 208 24 V34 H12 Z" fill="#0F2647"/>
          <rect x="68" y="14" width="16" height="10" rx="2" fill="#38BDF8"/>
          <rect x="132" y="14" width="16" height="10" rx="2" fill="#38BDF8"/>
          <rect x="0" y="42" width="215" height="12" fill="#EF3340"/>
          <circle cx="46" cy="68" r="13" fill="#070D1D"/>
          <circle cx="46" cy="68" r="5.5" fill="#CBD5E1"/>
          <circle cx="168" cy="68" r="13" fill="#070D1D"/>
          <circle cx="168" cy="68" r="5.5" fill="#CBD5E1"/>
        </g>
      </g>
    `;
  } else if (zoneType === 'masjid') {
    backMarkup += `
      <g transform="translate(${(cx - 195).toFixed(1)}, 425)">
        <rect x="163" y="6" width="4" height="30" fill="#FBBF24"/>
        <circle cx="165" cy="4" r="7" fill="#FBBF24"/>
        <path d="M50 142 C50 48, 280 48, 280 142 Z" fill="#0D9488"/>
        <path d="M82 142 C82 68, 248 68, 248 142 Z" fill="#2DD4BF" opacity="0.38"/>
        <rect x="25" y="142" width="280" height="128" rx="6" fill="#F8FAFC"/>
        <path d="M55 270 V198 C55 180 85 180 85 198 V270 Z" fill="#1E3A5F"/>
        <path d="M115 270 V188 C115 166 150 166 150 188 V270 Z" fill="#1E3A5F"/>
        <path d="M180 270 V188 C180 166 215 166 215 188 V270 Z" fill="#1E3A5F"/>
        <path d="M245 270 V198 C245 180 275 180 275 198 V270 Z" fill="#1E3A5F"/>
      </g>
    `;
    frontMarkup += `
      <g transform="translate(${spireX.toFixed(1)}, 0)">
        <rect x="-2.5" y="168" width="5" height="44" fill="#FBBF24"/>
        <polygon points="0,202 -30,295 30,295" fill="#0F766E"/>
        <rect x="-35" y="295" width="70" height="16" rx="4" fill="#F8FAFC"/>
        <rect x="-25" y="311" width="50" height="142" fill="#0F2040"/>
        <rect x="-39" y="453" width="78" height="18" rx="4" fill="#F8FAFC"/>
        <rect x="-30" y="471" width="60" height="218" fill="#0B132B"/>
        <rect x="-7" y="344" width="14" height="36" rx="7" fill="#FDE68A"/>
        <rect x="-7" y="512" width="14" height="42" rx="7" fill="#FDE68A"/>
      </g>
    `;
  } else if (zoneType === 'rm') {
    backMarkup += `
      <g transform="translate(${(cx - 210).toFixed(1)}, 475)">
        <polygon points="75,0 285,0 345,62 15,62" fill="#9A3412"/>
        <polygon points="-25,62 385,62 415,108 -55,108" fill="#B45309"/>
        <rect x="-15" y="108" width="390" height="112" fill="#1E293B"/>
        <rect x="20" y="126" width="90" height="70" rx="6" fill="#FBBF24" opacity="0.82"/>
        <rect x="135" y="126" width="92" height="70" rx="6" fill="#FBBF24" opacity="0.88"/>
        <rect x="252" y="126" width="90" height="70" rx="6" fill="#FBBF24" opacity="0.82"/>
      </g>
    `;
    frontMarkup += `
      <g transform="translate(${spireX.toFixed(1)}, 0)">
        <polygon points="-38,242 38,242 82,318 -82,318" fill="#9A3412"/>
        <polygon points="-98,318 98,318 124,362 -124,362" fill="#B45309"/>
        <rect x="-64" y="362" width="18" height="325" fill="#0B132B"/>
        <rect x="46" y="362" width="18" height="325" fill="#0B132B"/>
        <rect x="-74" y="388" width="148" height="40" rx="8" fill="#EF3340"/>
        <path d="M128 688 Q136 565 118 492 L130 492 Q148 565 142 688 Z" fill="#0B132B"/>
        <path d="M124 495 Q72 470 52 504 Q88 492 124 500 Z" fill="#0B132B"/>
        <path d="M126 494 Q176 468 198 502 Q162 490 126 499 Z" fill="#0B132B"/>
        <path d="M125 492 Q158 448 188 464 Q152 468 125 495 Z" fill="#0B132B"/>
      </g>
    `;
  } else if (zoneType === 'kampus') {
    backMarkup += `
      <g transform="translate(${(cx - 205).toFixed(1)}, 455)">
        <polygon points="35,72 195,6 355,72" fill="#CBD5E1"/>
        <rect x="40" y="72" width="310" height="158" fill="#E2E8F0"/>
        <rect x="68" y="92" width="18" height="125" fill="#94A3B8"/>
        <rect x="124" y="92" width="18" height="125" fill="#94A3B8"/>
        <rect x="184" y="92" width="22" height="125" fill="#94A3B8"/>
        <rect x="248" y="92" width="18" height="125" fill="#94A3B8"/>
        <rect x="304" y="92" width="18" height="125" fill="#94A3B8"/>
      </g>
    `;
    frontMarkup += `
      <g transform="translate(${spireX.toFixed(1)}, 0)">
        <rect x="-3" y="185" width="6" height="36" fill="#F8FAFC"/>
        <polygon points="0,212 -32,292 32,292" fill="#EF3340"/>
        <rect x="-38" y="292" width="76" height="20" rx="4" fill="#F8FAFC"/>
        <rect x="-28" y="312" width="56" height="376" fill="#0E1D3A"/>
        <rect x="-11" y="346" width="22" height="82" rx="11" fill="#38BDF8" opacity="0.72"/>
        <rect x="-54" y="592" width="108" height="96" rx="6" fill="#0B132B"/>
      </g>
    `;
  } else if (zoneType === 'dest_jakarta') {
    backMarkup += `
      <g fill="#1E293B" opacity="0.65" transform="translate(${(cx - 260).toFixed(1)}, 420)">
        <rect x="20" y="95" width="58" height="185"/>
        <rect x="95" y="45" width="66" height="235"/>
        <rect x="182" y="80" width="54" height="200"/>
        <rect x="340" y="60" width="68" height="220"/>
      </g>
    `;
    frontMarkup += `
      <g transform="translate(${(cx + 85).toFixed(1)}, 0)">
        <path d="M0 192 C18 220, 20 246, 0 264 C-20 246, -18 220, 0 192 Z" fill="#FBBF24"/>
        <rect x="-28" y="264" width="56" height="15" rx="3" fill="#F8FAFC"/>
        <polygon points="-15,279 15,279 32,565 -32,565" fill="#F1F5F9"/>
        <polygon points="-105,565 105,565 72,625 -72,625" fill="#162447"/>
        <rect x="-40" y="625" width="80" height="65" fill="#0B132B"/>
      </g>
    `;
  } else if (zoneType === 'dest_bali') {
    backMarkup += `
      <path d="M ${(cx - 340).toFixed(1)} 685 L ${(cx - 90).toFixed(1)} 445 L ${(cx + 145).toFixed(1)} 685 Z" fill="#312E81" opacity="0.48"/>
    `;
    frontMarkup += `
      <g transform="translate(${(cx + 80).toFixed(1)}, 0)" fill="#0B132B">
        <rect x="-3" y="205" width="6" height="38" fill="#FBBF24"/>
        <polygon points="0,235 -48,274 48,274"/>
        <polygon points="0,274 -66,318 66,318"/>
        <polygon points="0,318 -86,368 86,368"/>
        <polygon points="0,368 -108,425 108,425"/>
        <polygon points="0,425 -128,488 128,488"/>
        <polygon points="0,488 -148,556 148,556"/>
        <rect x="-92" y="556" width="184" height="132"/>
      </g>
    `;
  } else {
    // Default Candi Prambanan & Tugu Jogja
    backMarkup += `
      <path d="M ${(cx - 330).toFixed(1)} 685 L ${(cx - 95).toFixed(1)} 455 L ${(cx + 135).toFixed(1)} 685 Z" fill="#312E81" opacity="0.48"/>
      <g transform="translate(${(cx - 175).toFixed(1)}, 475)">
        <polygon points="0,0 -10,45 10,45" fill="#FBBF24"/>
        <rect x="-14" y="45" width="28" height="165" fill="#F8FAFC"/>
      </g>
    `;
    frontMarkup += `
      <g transform="translate(${(cx + 85).toFixed(1)}, 0)" fill="#0B132B">
        <polygon points="-135,380 -175,535 -95,535"/>
        <rect x="-182" y="535" width="94" height="152"/>
        <circle cx="0" cy="202" r="7" fill="#FBBF24"/>
        <polygon points="0,208 -32,322 32,322"/>
        <polygon points="0,295 -58,445 58,445"/>
        <polygon points="0,412 -84,562 84,562"/>
        <rect x="-94" y="562" width="188" height="126"/>
        <polygon points="135,380 95,535 175,535"/>
        <rect x="88" y="535" width="94" height="152"/>
      </g>
    `;
  }

  return { backMarkup, frontMarkup };
}

function buildQuestCurvePath(stops, Z) {
  const stopPts = stops.map((s, idx) => ({
    x: idx * Z + Z * 0.48,
    y: s.pinY
  }));

  const startX = -60;
  const startY = 445;
  let d = `M ${startX} ${startY} `;

  const p0 = stopPts[0];
  d += `C ${(p0.x * 0.35).toFixed(1)} 390, ${(p0.x * 0.68).toFixed(1)} ${(p0.y + 22).toFixed(1)}, ${p0.x.toFixed(1)} ${p0.y.toFixed(1)} `;

  for (let i = 0; i < stopPts.length - 1; i++) {
    const a = stopPts[i];
    const b = stopPts[i + 1];
    const span = b.x - a.x;

    const loopX = a.x + span * (i % 2 === 0 ? 0.42 : 0.54);
    const R = Math.min(Z * 0.105, 84);
    const loopCy = Math.max(275, Math.min(a.y, b.y) - R * 0.72);

    d += `C ${(a.x + span * 0.19).toFixed(1)} ${(a.y - 6).toFixed(1)}, ${(loopX + R * 1.12).toFixed(1)} ${(loopCy + R * 0.92).toFixed(1)}, ${(loopX + R * 1.02).toFixed(1)} ${loopCy.toFixed(1)} `;
    d += `C ${(loopX + R * 0.92).toFixed(1)} ${(loopCy - R * 1.08).toFixed(1)}, ${(loopX - R * 0.92).toFixed(1)} ${(loopCy - R * 1.08).toFixed(1)}, ${(loopX - R * 1.02).toFixed(1)} ${loopCy.toFixed(1)} `;
    d += `C ${(loopX - R * 1.12).toFixed(1)} ${(loopCy + R * 0.96).toFixed(1)}, ${(b.x - span * 0.20).toFixed(1)} ${(b.y + 24).toFixed(1)}, ${b.x.toFixed(1)} ${b.y.toFixed(1)} `;
  }

  const last = stopPts[stopPts.length - 1];
  const endX = stops.length * Z + 90;
  const endY = 250;
  d += `C ${(last.x + Z * 0.16).toFixed(1)} ${(last.y - 18).toFixed(1)}, ${(last.x + Z * 0.32).toFixed(1)} 295, ${endX.toFixed(1)} ${endY}`;

  return { d, stopPts };
}

function sampleArcLengthsAtStops(pathEl, stopPts) {
  const total = pathEl.getTotalLength();
  const samples = 520;
  const table = [];
  for (let i = 0; i <= samples; i++) {
    const len = (i / samples) * total;
    const p = pathEl.getPointAtLength(len);
    table.push({ len, x: p.x, y: p.y });
  }
  return stopPts.map(sp => {
    let bestL = 0;
    let minD = Infinity;
    for (let j = 0; j < table.length; j++) {
      const dx = table[j].x - sp.x;
      const dy = table[j].y - sp.y;
      const d2 = dx * dx + dy * dy;
      if (d2 < minD) {
        minD = d2;
        bestL = table[j].len;
      }
    }
    return bestL;
  });
}

function lerpColor(a, b, t) {
  const r = Math.round(a[0] + (b[0] - a[0]) * t);
  const g = Math.round(a[1] + (b[1] - a[1]) * t);
  const bl = Math.round(a[2] + (b[2] - a[2]) * t);
  return `rgb(${r}, ${g}, ${bl})`;
}

export default function AlurRuteQuest({ currentPreset = 'studytour', onPresetChange, onToast }) {
  const [campusEnabled, setCampusEnabled] = useState(true);
  const [activeIdx, setActiveIdx] = useState(0);

  const containerRef = useRef(null);
  const cameraRigRef = useRef(null);
  const cloudsRigRef = useRef(null);
  const skyLayerRef = useRef(null);

  const backSvgRef = useRef(null);
  const routeSvgRef = useRef(null);
  const frontSvgRef = useRef(null);
  const markersSvgRef = useRef(null);
  const pinsLayerRef = useRef(null);
  const guideDashedRef = useRef(null);
  const solidPathRef = useRef(null);
  const redArrowRef = useRef(null);

  const scrollTriggerRef = useRef(null);
  const activeStopsRef = useRef([]);
  const stopLengthsRef = useRef([]);
  const totalLengthRef = useRef(1);

  const getFilteredStops = useCallback(() => {
    const base = QUEST_PRESETS[currentPreset]?.stops || QUEST_PRESETS.studytour.stops;
    return campusEnabled ? base.slice() : base.filter(s => !s.isCampus);
  }, [currentPreset, campusEnabled]);

  const scrollToStop = useCallback((idx) => {
    const stops = getFilteredStops();
    const N = stops.length;
    if (idx < 0 || idx >= N) return;
    const st = scrollTriggerRef.current;
    if (!st) return;

    const targetP = N > 1 ? idx / (N - 1) : 0;
    const targetY = st.start + targetP * (st.end - st.start);

    if (window.__lenis) {
      window.__lenis.scrollTo(targetY, { duration: 1.2 });
    } else {
      window.scrollTo({ top: targetY, behavior: 'smooth' });
    }
  }, [getFilteredStops]);

  const renderPins = useCallback((stopLengths, activeIndex, stops) => {
    if (!pinsLayerRef.current || !solidPathRef.current) return;
    const solidEl = solidPathRef.current;

    pinsLayerRef.current.innerHTML = stopLengths.map((len, idx) => {
      const pt = solidEl.getPointAtLength(len);
      const stop = stops[idx];
      const isCurrent = idx === activeIndex;
      const isPassed = idx < activeIndex;
      const numStr = `0${idx + 1}`;

      const pillLabel = isCurrent ? `
        <g transform="translate(26, -6)">
          <rect x="0" y="-13" width="138" height="26" rx="13" fill="rgba(2, 6, 23, 0.90)" stroke="rgba(255,255,255,0.22)" stroke-width="1"/>
          <text x="69" y="4" text-anchor="middle" fill="#FFFFFF" font-family="Plus Jakarta Sans, sans-serif" font-weight="800" font-size="11">
            ${numStr} • ${stop?.short || ''}
          </text>
        </g>
      ` : '';

      return `
        <g class="cursor-pointer" transform="translate(${pt.x.toFixed(1)}, ${pt.y.toFixed(1)})" data-quest-pin="${idx}">
          ${isCurrent ? `<circle cx="0" cy="0" r="24" fill="rgba(255,255,255,0.45)" class="pin-pulse-ring"/>` : ''}
          <circle cx="0" cy="0" r="18" fill="#FFFFFF" filter="url(#badgeGlow)"/>
          <circle cx="0" cy="0" r="13.5" fill="${isCurrent ? '#EF3340' : isPassed ? '#1D4ED8' : '#334155'}"/>
          <text x="0" y="4" text-anchor="middle" fill="#FFFFFF" font-family="Plus Jakarta Sans, sans-serif" font-weight="800" font-size="10.5">
            ${numStr}
          </text>
          ${pillLabel}
        </g>
      `;
    }).join('');

    pinsLayerRef.current.querySelectorAll('[data-quest-pin]').forEach(el => {
      el.addEventListener('click', () => {
        const pinIdx = parseInt(el.getAttribute('data-quest-pin'), 10);
        scrollToStop(pinIdx);
      });
    });
  }, [scrollToStop]);

  const renderAtProgress = useCallback((rawP) => {
    const p = Math.max(0, Math.min(1, rawP));
    const stops = activeStopsRef.current;
    const N = stops.length;
    if (N === 0) return;

    const vp = containerRef.current;
    if (!vp) return;
    const vw = vp.clientWidth || window.innerWidth;
    const rigW = cameraRigRef.current?.offsetWidth || (N * vw);
    const maxPan = Math.max(0, rigW - vw);

    // Pan camera & clouds horizontally across the zones
    const panX = -p * maxPan;
    if (cameraRigRef.current) {
      cameraRigRef.current.style.transform = `translate3d(${panX.toFixed(1)}px, 0, 0)`;
    }
    if (cloudsRigRef.current) {
      cloudsRigRef.current.style.transform = `translate3d(${(panX * 0.28).toFixed(1)}px, 0, 0)`;
    }

    // Sky gradient interpolation
    const exactStop = p * (N - 1);
    const seg = Math.min(N - 2, Math.max(0, Math.floor(exactStop)));
    const localT = N > 1 ? (exactStop - seg) : 0;

    const s1 = stops[seg];
    const s2 = stops[Math.min(N - 1, seg + 1)];
    if (s1 && s2 && skyLayerRef.current) {
      const cTop = lerpColor(s1.skyTop, s2.skyTop, localT);
      const cMid = lerpColor(s1.skyMid, s2.skyMid, localT);
      const cBot = lerpColor(s1.skyBot, s2.skyBot, localT);
      skyLayerRef.current.style.background = `linear-gradient(180deg, ${cTop} 0%, ${cMid} 62%, ${cBot} 100%)`;
    }

    // SVG path offset & red arrow tangent rotation
    const l1 = stopLengthsRef.current[seg] || 0;
    const l2 = stopLengthsRef.current[Math.min(N - 1, seg + 1)] || totalLengthRef.current;
    const curLen = l1 + (l2 - l1) * localT;

    const solidEl = solidPathRef.current;
    if (solidEl) {
      const tailExtra = p > 0.96 ? ((p - 0.96) / 0.04) * (totalLengthRef.current - curLen) * 0.55 : 0;
      const drawn = Math.min(totalLengthRef.current, curLen + tailExtra);
      solidEl.style.strokeDashoffset = `${Math.max(0, totalLengthRef.current - drawn)}`;

      const pt = solidEl.getPointAtLength(curLen);
      const pPrev = solidEl.getPointAtLength(Math.max(0, curLen - 3.5));
      const pNext = solidEl.getPointAtLength(Math.min(totalLengthRef.current, curLen + 3.5));
      const deg = Math.atan2(pNext.y - pPrev.y, pNext.x - pPrev.x) * (180 / Math.PI);

      if (redArrowRef.current) {
        redArrowRef.current.setAttribute(
          'transform',
          `translate(${pt.x.toFixed(1)}, ${pt.y.toFixed(1)}) rotate(${deg.toFixed(1)})`
        );
      }
    }

    const nearest = Math.round(exactStop);
    setActiveIdx(prev => {
      if (prev !== nearest) {
        renderPins(stopLengthsRef.current, nearest, stops);
        return nearest;
      }
      return prev;
    });
  }, [renderPins]);

  const rebuildStage = useCallback(() => {
    const stops = getFilteredStops();
    activeStopsRef.current = stops;
    const N = stops.length;

    const vp = containerRef.current;
    if (!vp) return;
    const vw = vp.clientWidth || window.innerWidth;
    const vh = vp.clientHeight || window.innerHeight;

    const questZoneSvgW = Math.max(540, Math.round(900 * (vw / vh)));
    const totalSvgW = N * questZoneSvgW;
    const zonePxW = Math.round((questZoneSvgW / 900) * vh);
    const totalPxW = N * zonePxW;

    if (cameraRigRef.current) {
      cameraRigRef.current.style.width = `${totalPxW}px`;
      cameraRigRef.current.style.height = `${vh}px`;
    }

    [backSvgRef.current, routeSvgRef.current, frontSvgRef.current, markersSvgRef.current].forEach(svg => {
      if (svg) svg.setAttribute('viewBox', `0 0 ${totalSvgW} 900`);
    });

    let allBack = '';
    let allFront = '';
    stops.forEach((s, i) => {
      const layers = buildZoneArchitecturalLayers(s.zoneType, i * questZoneSvgW, questZoneSvgW);
      allBack += layers.backMarkup;
      allFront += layers.frontMarkup;
    });

    // Dark ground base
    let groundPath = `M -80 682 `;
    for (let i = 0; i < N; i++) {
      const zx = i * questZoneSvgW;
      groundPath += `Q ${zx + questZoneSvgW * 0.28} 664, ${zx + questZoneSvgW * 0.55} 680 T ${zx + questZoneSvgW} 676 `;
    }
    groundPath += `L ${totalSvgW + 80} 676 L ${totalSvgW + 80} 920 L -80 920 Z`;
    allFront += `<path d="${groundPath}" fill="#0B132B"/>`;

    if (backSvgRef.current) backSvgRef.current.innerHTML = allBack;
    if (frontSvgRef.current) frontSvgRef.current.innerHTML = allFront;

    // Route curve
    const { d, stopPts } = buildQuestCurvePath(stops, questZoneSvgW);
    if (guideDashedRef.current) guideDashedRef.current.setAttribute('d', d);
    if (solidPathRef.current) {
      solidPathRef.current.setAttribute('d', d);
      const totalLen = solidPathRef.current.getTotalLength();
      totalLengthRef.current = totalLen;
      solidPathRef.current.style.strokeDasharray = `${totalLen}`;
      stopLengthsRef.current = sampleArcLengthsAtStops(solidPathRef.current, stopPts);
    }

    renderPins(stopLengthsRef.current, activeIdx, stops);
  }, [getFilteredStops, activeIdx, renderPins]);

  // Setup ScrollTrigger with PIN: TRUE (Section remains locked on screen while horizontal route pans)
  useEffect(() => {
    rebuildStage();

    if (scrollTriggerRef.current) {
      scrollTriggerRef.current.kill();
    }

    scrollTriggerRef.current = ScrollTrigger.create({
      trigger: containerRef.current,
      start: 'top top',
      end: 'bottom bottom',
      scrub: 0.8,
      onUpdate: self => {
        renderAtProgress(self.progress);
      }
    });

    ScrollTrigger.refresh();
    renderAtProgress(0);

    const handleResize = () => {
      rebuildStage();
      ScrollTrigger.refresh();
      if (scrollTriggerRef.current) {
        renderAtProgress(scrollTriggerRef.current.progress || 0);
      }
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (scrollTriggerRef.current) scrollTriggerRef.current.kill();
    };
  }, [currentPreset, campusEnabled, rebuildStage, renderAtProgress]);

  const handleStepStop = (delta) => {
    const stops = getFilteredStops();
    const next = activeIdx + delta;
    if (next >= stops.length) {
      const paketEl = document.getElementById('paket');
      if (window.__lenis && paketEl) {
        window.__lenis.scrollTo(paketEl, { duration: 1.3 });
      } else {
        paketEl?.scrollIntoView({ behavior: 'smooth' });
      }
      return;
    }
    if (next >= 0) scrollToStop(next);
  };

  const handleSwitchPreset = (pKey) => {
    if (!QUEST_PRESETS[pKey]) return;
    if (onPresetChange) {
      onPresetChange(pKey);
    }
    setActiveIdx(0);
    if (scrollTriggerRef.current) {
      const targetY = scrollTriggerRef.current.start;
      if (window.__lenis) {
        window.__lenis.scrollTo(targetY, { duration: 1.0 });
      } else {
        window.scrollTo({ top: targetY, behavior: 'smooth' });
      }
    }
    if (onToast) {
      onToast('Rute Diperbarui', `Menampilkan alur perjalanan: ${QUEST_PRESETS[pKey].label}.`);
    }
  };

  const handleToggleCampus = () => {
    const nextState = !campusEnabled;
    setCampusEnabled(nextState);
    if (onToast) {
      onToast(
        nextState ? 'Singgah Kampus: ON' : 'Singgah Kampus: OFF',
        nextState
          ? 'Titik 04 Kunjungan Kampus ditambahkan ke alur perjalanan.'
          : 'Kunjungan Kampus dilewati—alur langsung menuju Tujuan Akhir.'
      );
    }
  };

  const stops = getFilteredStops();
  const currentStop = stops[activeIdx] || stops[0];

  return (
    <section
      ref={containerRef}
      id="alur-rute"
      className="relative w-full h-[400vh] select-none bg-[#0B132B]"
    >
      <div className="sticky top-0 h-screen overflow-hidden">
      {/* LAYER 1: Dynamic Time-of-Day Sky Gradient */}
      <div
        ref={skyLayerRef}
        id="quest-sky-layer"
        className="absolute inset-0 z-[1] transition-colors duration-500"
        style={{ background: 'linear-gradient(180deg, #2563EB 0%, #60A5FA 64%, #BAE6FD 100%)' }}
      ></div>

      {/* LAYER 2: High Clouds & Sun */}
      <div
        ref={cloudsRigRef}
        id="quest-clouds-rig"
        className="absolute top-0 left-0 h-full w-[280vw] z-[3] pointer-events-none will-change-transform opacity-55"
      >
        <svg viewBox="0 0 4000 900" preserveAspectRatio="none" className="w-full h-full">
          <circle cx="520" cy="185" r="88" fill="#FFFFFF" opacity="0.22" />
          <circle cx="1950" cy="150" r="105" fill="#FFFBEB" opacity="0.18" />
          <circle cx="3520" cy="245" r="135" fill="#FDE68A" opacity="0.34" />
          <g fill="#FFFFFF" opacity="0.32">
            <ellipse cx="360" cy="155" rx="185" ry="30" />
            <ellipse cx="470" cy="168" rx="125" ry="22" />
            <ellipse cx="1140" cy="128" rx="215" ry="34" />
            <ellipse cx="1265" cy="144" rx="140" ry="24" />
            <ellipse cx="1880" cy="175" rx="195" ry="28" />
            <ellipse cx="2580" cy="132" rx="230" ry="36" />
            <ellipse cx="3280" cy="160" rx="205" ry="30" />
          </g>
        </svg>
      </div>

      {/* LAYER 3: Horizontal Panoramic Camera Rig */}
      <div
        ref={cameraRigRef}
        id="quest-camera-rig"
        className="absolute top-0 left-0 h-full z-[10] will-change-transform"
      >
        {/* Real Location Photo Vignettes */}
        <div className="absolute inset-0 flex h-full z-[4] pointer-events-none">
          {stops.map((s, idx) => (
            <div
              key={`${s.title}-${idx}`}
              className="h-full shrink-0 relative overflow-hidden zone-photo-vignette"
              style={{ width: `${100 / stops.length}%` }}
            >
              <img
                src={s.photo}
                alt={s.title}
                className="w-full h-full object-cover object-center opacity-40"
              />
            </div>
          ))}
        </div>

        {/* Back SVG Architecture */}
        <svg ref={backSvgRef} id="quest-back-svg" className="absolute inset-0 w-full h-full z-[10] pointer-events-none"></svg>

        {/* Route SVG Curve Path */}
        <svg ref={routeSvgRef} id="quest-route-svg" className="absolute inset-0 w-full h-full z-[16] pointer-events-none overflow-visible">
          <defs>
            <filter id="routeDropShadow" x="-5%" y="-15%" width="110%" height="140%">
              <feDropShadow dx="0" dy="8" stdDeviation="8" floodColor="#071024" floodOpacity="0.28" />
            </filter>
          </defs>
          <path
            ref={guideDashedRef}
            id="quest-guide-dashed"
            d=""
            fill="none"
            stroke="rgba(255,255,255,0.30)"
            strokeWidth="12"
            strokeDasharray="10 14"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            ref={solidPathRef}
            id="quest-solid-path"
            d=""
            fill="none"
            stroke="#FFFFFF"
            strokeWidth="14"
            strokeLinecap="round"
            strokeLinejoin="round"
            filter="url(#routeDropShadow)"
          />
        </svg>

        {/* Foreground Architectural Spire Layer */}
        <svg ref={frontSvgRef} id="quest-front-svg" className="absolute inset-0 w-full h-full z-[22] pointer-events-none"></svg>

        {/* Markers & Red Arrow SVG */}
        <svg ref={markersSvgRef} id="quest-markers-svg" className="absolute inset-0 w-full h-full z-[26] pointer-events-none overflow-visible">
          <defs>
            <filter id="badgeGlow" x="-45%" y="-45%" width="190%" height="190%">
              <feDropShadow dx="0" dy="5" stdDeviation="6" floodColor="#070D1D" floodOpacity="0.42" />
            </filter>
          </defs>
          <g ref={pinsLayerRef} id="quest-pins-layer" className="pointer-events-auto"></g>
          <g ref={redArrowRef} id="quest-red-arrow" filter="url(#badgeGlow)" transform="translate(300, 360) rotate(0)">
            <circle cx="0" cy="0" r="22" fill="#FFFFFF" />
            <circle cx="0" cy="0" r="16" fill="#EF3340" />
            <path d="M-5.5 0 H5.5 M1.2 -4.8 L6.2 0 L1.2 4.8" fill="none" stroke="#FFFFFF" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
          </g>
        </svg>
      </div>

      {/* LAYER 4: Compact Bottom HUD Dock */}
      <div className="absolute bottom-3 sm:bottom-4 left-3 sm:left-6 right-3 sm:right-6 z-30 pointer-events-none">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-stretch lg:items-end justify-between gap-2.5 sm:gap-4">

          {/* Bottom-Left Stop Card */}
          <div className="pointer-events-auto w-full lg:max-w-md bg-slate-950/88 backdrop-blur-xl border border-white/15 text-white rounded-2xl p-3 sm:p-3.5 flex items-center gap-3 sm:gap-3.5 shadow-2xl">
            <img
              src={currentStop?.thumb}
              alt={currentStop?.title}
              className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl object-cover shrink-0 border border-white/15 bg-slate-800"
            />
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-sky-300">
                  TITIK 0{activeIdx + 1}/0{stops.length} • {currentStop?.time}
                </span>
              </div>
              <h3 className="font-bold text-sm sm:text-[15px] text-white truncate mt-0.5">
                {currentStop?.title}
              </h3>
              <p className="text-[11px] text-slate-300 truncate mt-0.5">
                {currentStop?.desc}
              </p>
            </div>

            <button
              onClick={() => handleStepStop(1)}
              className="shrink-0 bg-[#EF3340] hover:bg-white text-white hover:text-slate-950 font-extrabold text-xs px-3.5 py-2.5 rounded-xl transition-colors shadow-md flex items-center gap-1 cursor-pointer"
            >
              <span>{activeIdx < stops.length - 1 ? 'Lanjut' : 'Paket'}</span>
              <span>→</span>
            </button>
          </div>

          {/* Bottom-Right Presets & Breadcrumbs Dock */}
          <div className="pointer-events-auto bg-slate-950/88 backdrop-blur-xl border border-white/15 rounded-2xl p-2.5 sm:p-3 flex flex-col gap-2 shadow-2xl overflow-hidden">
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
              <button
                onClick={() => handleSwitchPreset('studytour')}
                className={`shrink-0 px-3 py-1.5 rounded-xl text-[11px] font-extrabold transition cursor-pointer ${
                  currentPreset === 'studytour' ? 'bg-white text-slate-950' : 'bg-white/10 hover:bg-white/20 text-slate-200'
                }`}
              >
                🏫 Study Tour
              </button>
              <button
                onClick={() => handleSwitchPreset('jakarta')}
                className={`shrink-0 px-3 py-1.5 rounded-xl text-[11px] font-extrabold transition cursor-pointer ${
                  currentPreset === 'jakarta' ? 'bg-white text-slate-950' : 'bg-white/10 hover:bg-white/20 text-slate-200'
                }`}
              >
                🚌 Goes to Jakarta
              </button>
              <button
                onClick={() => handleSwitchPreset('bali')}
                className={`shrink-0 px-3 py-1.5 rounded-xl text-[11px] font-extrabold transition cursor-pointer ${
                  currentPreset === 'bali' ? 'bg-white text-slate-950' : 'bg-white/10 hover:bg-white/20 text-slate-200'
                }`}
              >
                🏝️ Wisata Bali
              </button>

              <button
                onClick={handleToggleCampus}
                className="shrink-0 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[11px] font-bold bg-sky-500/20 hover:bg-sky-500/30 border border-sky-400/35 text-sky-100 transition cursor-pointer"
              >
                <span>🎓 Singgah Kampus:</span>
                <span className={campusEnabled ? 'text-emerald-300 font-extrabold' : 'text-slate-400 font-extrabold'}>
                  {campusEnabled ? 'ON' : 'OFF'}
                </span>
              </button>
            </div>

            {/* Sequential Breadcrumbs */}
            <div className="flex items-center gap-1 overflow-x-auto no-scrollbar">
              {stops.map((stop, idx) => {
                const isActive = idx === activeIdx;
                const isPassed = idx < activeIdx;
                const cls = isActive
                  ? 'bg-[#EF3340] text-white font-extrabold shadow-sm'
                  : isPassed
                    ? 'bg-white/15 text-white font-bold hover:bg-white/25'
                    : 'bg-white/5 text-slate-300 font-semibold hover:bg-white/15 hover:text-white';

                return (
                  <span key={`${stop.short}-${idx}`} className="flex items-center">
                    <button
                      onClick={() => scrollToStop(idx)}
                      className={`shrink-0 px-2.5 py-1 rounded-lg text-[11px] transition cursor-pointer ${cls}`}
                    >
                      0{idx + 1} {stop.short}
                    </button>
                    {idx < stops.length - 1 && (
                      <span className="text-slate-500 text-[10px] px-0.5 shrink-0">→</span>
                    )}
                  </span>
                );
              })}
            </div>
          </div>

        </div>
      </div>
    </div>
  </section>
);
}
