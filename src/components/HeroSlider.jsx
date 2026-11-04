import { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import { HERO_ROUTES } from '../data/travelData';

export default function HeroSlider({ onSyncQuestPreset }) {
  const [heroIdx, setHeroIdx] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  const cloneRef = useRef(null);
  const cloneImgRef = useRef(null);
  const bgImgRef = useRef(null);
  const textGroupRef = useRef(null);
  const autoTimerRef = useRef(null);

  const currentRoute = HERO_ROUTES[heroIdx];

  // Upcoming 4 cards
  const upcomingIndices = [];
  for (let k = 1; k < HERO_ROUTES.length; k++) {
    upcomingIndices.push((heroIdx + k) % HERO_ROUTES.length);
  }

  const activateSlide = (targetIdx, clickedEl) => {
    if (isAnimating || targetIdx === heroIdx) return;
    setIsAnimating(true);

    const nextData = HERO_ROUTES[targetIdx];
    const clone = cloneRef.current;
    const cloneImg = cloneImgRef.current;
    const bgImg = bgImgRef.current;

    const fromRect = clickedEl
      ? clickedEl.getBoundingClientRect()
      : { left: window.innerWidth * 0.58, top: window.innerHeight * 0.54, width: 170, height: 210 };

    if (cloneImg) cloneImg.src = nextData.img;
    if (clone) {
      clone.style.display = 'block';
      gsap.set(clone, {
        top: fromRect.top,
        left: fromRect.left,
        width: fromRect.width,
        height: fromRect.height,
        borderRadius: '16px',
        opacity: 1,
      });
    }

    // Fade out old text
    if (textGroupRef.current) {
      gsap.to(textGroupRef.current.children, {
        y: -24,
        opacity: 0,
        duration: 0.24,
        stagger: 0.03,
        ease: 'power2.in',
      });
    }

    // Expand clone to fullscreen
    if (clone) {
      gsap.to(clone, {
        top: 0,
        left: 0,
        width: window.innerWidth,
        height: window.innerHeight,
        borderRadius: '0px',
        duration: 0.82,
        ease: 'power3.inOut',
        onComplete: () => {
          setHeroIdx(targetIdx);

          if (bgImg) {
            bgImg.src = nextData.img;
            gsap.fromTo(bgImg, { scale: 1.0 }, { scale: 1.06, duration: 5.5, ease: 'power1.out' });
          }

          if (textGroupRef.current) {
            gsap.fromTo(
              textGroupRef.current.children,
              { y: 28, opacity: 0 },
              { y: 0, opacity: 1, duration: 0.58, stagger: 0.07, ease: 'power3.out' }
            );
          }

          gsap.to(clone, {
            opacity: 0,
            duration: 0.22,
            onComplete: () => {
              clone.style.display = 'none';
              setIsAnimating(false);
            },
          });
        },
      });
    }
  };

  const stepHero = (delta, e) => {
    e?.preventDefault();
    if (isAnimating) return;
    const target = (heroIdx + delta + HERO_ROUTES.length) % HERO_ROUTES.length;
    const cardEl = document.querySelector(`[data-hero-card="${target}"]`);
    activateSlide(target, cardEl);
  };

  useEffect(() => {
    clearInterval(autoTimerRef.current);
    autoTimerRef.current = setInterval(() => {
      if (!document.hidden && !isAnimating && window.scrollY < window.innerHeight * 0.5) {
        setHeroIdx(prev => {
          const next = (prev + 1) % HERO_ROUTES.length;
          return next;
        });
      }
    }, 7000);

    return () => clearInterval(autoTimerRef.current);
  }, [isAnimating]);

  return (
    <section
      id="beranda"
      className="relative w-full min-h-screen lg:h-screen overflow-hidden bg-[#0B132B] flex flex-col justify-end select-none"
    >
      {/* Active Fullscreen Photography Layer */}
      <div className="absolute inset-0 z-10 overflow-hidden bg-slate-900">
        <img
          ref={bgImgRef}
          src={currentRoute.img}
          alt={`${currentRoute.line1} ${currentRoute.line2} — FAD Tour & Travel`}
          className="w-full h-full object-cover object-center scale-105 will-change-transform duration-700"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#070D1D]/90 via-[#0B132B]/48 to-transparent"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-[#070D1D]/92 via-transparent to-[#070D1D]/35"></div>
      </div>

      {/* Floating Clone Layer for Smooth Card-to-Fullscreen Expansion */}
      <div
        ref={cloneRef}
        id="hero-expand-clone"
        className="fixed pointer-events-none z-[26] overflow-hidden hidden shadow-[0_28px_65px_rgba(0,0,0,0.6)]"
      >
        <img
          ref={cloneImgRef}
          src={currentRoute.img}
          alt="Transisi Rute"
          className="w-full h-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#070D1D]/90 via-[#0B132B]/48 to-transparent"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-[#070D1D]/92 via-transparent to-[#070D1D]/35"></div>
      </div>

      {/* Foreground Content Grid */}
      <div className="relative z-30 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 pt-28 pb-8 lg:pb-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-end">

          {/* Left Column: Accent Bar, Subtitle, Masked Display Title, Description & CTA */}
          <div ref={textGroupRef} className="lg:col-span-5 space-y-4 text-white">
            <div className="w-12 h-1 bg-[#EF3340] rounded-full"></div>

            <div className="overflow-hidden">
              <p className="text-xs sm:text-sm font-bold uppercase tracking-[0.2em] text-sky-300 will-change-transform">
                {currentRoute.region}
              </p>
            </div>

            <h1 className="font-display font-extrabold text-4xl sm:text-5xl xl:text-[54px] leading-[0.98] tracking-tight uppercase text-white">
              <span className="block overflow-hidden pb-1">
                <span className="block will-change-transform">{currentRoute.line1}</span>
              </span>
              <span className="block overflow-hidden pb-1">
                <span className="block text-white will-change-transform">{currentRoute.line2}</span>
              </span>
            </h1>

            <div className="overflow-hidden">
              <p className="text-sm sm:text-[15px] text-slate-200 leading-relaxed max-w-md will-change-transform">
                {currentRoute.desc}
              </p>
            </div>

            <div className="pt-2 flex flex-wrap items-center gap-3">
              <a
                href="#paket"
                className="inline-flex items-center gap-2.5 bg-[#EF3340] hover:bg-white text-white hover:text-slate-950 font-extrabold text-xs sm:text-sm px-6 py-3.5 rounded-full transition-all duration-300 shadow-lg"
              >
                <span>Jelajahi Paket</span>
                <span>→</span>
              </a>
              <a
                href="#alur-rute"
                onClick={() => onSyncQuestPreset && onSyncQuestPreset(currentRoute.preset)}
                className="inline-flex items-center gap-2 px-5 py-3.5 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/25 text-white text-xs sm:text-sm font-semibold transition"
              >
                <span>Simulasi Alur Rute ↓</span>
              </a>
            </div>
          </div>

          {/* Bottom-Right Column: 4 Upcoming Thumbnail Cards + Prev/Next + Progress Bar + 01-05 Counter */}
          <div className="lg:col-span-7 flex flex-col gap-4">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {upcomingIndices.map(idx => {
                const item = HERO_ROUTES[idx];
                return (
                  <div
                    key={item.num}
                    data-hero-card={idx}
                    onClick={e => activateSlide(idx, e.currentTarget)}
                    className="hero-thumb-card group cursor-pointer relative h-36 sm:h-48 lg:h-52 rounded-2xl overflow-hidden border border-white/25 hover:border-white/90 shadow-xl bg-slate-900 transition-colors"
                  >
                    <img
                      src={item.thumb}
                      alt={item.cardName}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#070D1D]/92 via-[#070D1D]/25 to-transparent p-3 flex flex-col justify-end">
                      <span className="text-[9px] sm:text-[10px] font-bold uppercase tracking-wider text-sky-300 truncate">
                        {item.cardTag}
                      </span>
                      <h3 className="font-display font-bold text-xs sm:text-sm text-white leading-tight mt-0.5 line-clamp-2">
                        {item.cardName}
                      </h3>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="flex items-center gap-4 pt-1">
              <div className="flex items-center gap-2.5">
                <button
                  onClick={e => stepHero(-1, e)}
                  aria-label="Destinasi Sebelumnya"
                  className="w-11 h-11 rounded-full border border-white/35 bg-white/10 hover:bg-white text-white hover:text-slate-950 backdrop-blur-md flex items-center justify-center transition cursor-pointer"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.3" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <button
                  onClick={e => stepHero(1, e)}
                  aria-label="Destinasi Berikutnya"
                  className="w-11 h-11 rounded-full border border-white/35 bg-white/10 hover:bg-white text-white hover:text-slate-950 backdrop-blur-md flex items-center justify-center transition cursor-pointer"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.3" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>

              <div className="flex-1 h-[2px] bg-white/25 rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#EF3340] transition-all duration-700 ease-out"
                  style={{ width: `${((heroIdx + 1) / HERO_ROUTES.length) * 100}%` }}
                ></div>
              </div>

              <div className="font-display font-extrabold text-2xl sm:text-3xl text-white tracking-tight tabular-nums">
                <span>{currentRoute.num}</span>
                <span className="text-white/40 text-sm font-sans font-semibold">/ 05</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
