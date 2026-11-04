import { useState, useRef, useCallback, useEffect } from 'react';
import Lenis from 'lenis';
import 'lenis/dist/lenis.css';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Navbar from './components/Navbar';
import Toast from './components/Toast';
import HeroSlider from './components/HeroSlider';
import AlurRuteQuest from './components/AlurRuteQuest';
import PaketWisata from './components/PaketWisata';
import Armada3D from './components/Armada3D';
import ReviewsAndPlanner from './components/ReviewsAndPlanner';

gsap.registerPlugin(ScrollTrigger);

export default function App() {
  const [toast, setToast] = useState({ show: false, title: '', msg: '' });
  const [activeQuestPreset, setActiveQuestPreset] = useState('studytour');
  const [plannerSelection, setPlannerSelection] = useState(null);

  const toastTimerRef = useRef(null);

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.4,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      wheelMultiplier: 0.78,
      touchMultiplier: 1.25,
      infinite: false,
    });

    window.__lenis = lenis;

    // Sinkronisasi Lenis dengan ScrollTrigger
    lenis.on('scroll', ScrollTrigger.update);

    const updateTicker = (time) => {
      lenis.raf(time * 1000);
    };

    gsap.ticker.add(updateTicker);
    gsap.ticker.lagSmoothing(0);

    const handleAnchorClick = (e) => {
      const anchor = e.target.closest('a[href^="#"]');
      if (!anchor) return;
      const href = anchor.getAttribute('href');
      if (href && href !== '#') {
        const target = document.querySelector(href);
        if (target) {
          e.preventDefault();
          lenis.scrollTo(target, { offset: 0, duration: 1.3 });
        }
      }
    };

    document.addEventListener('click', handleAnchorClick);

    return () => {
      document.removeEventListener('click', handleAnchorClick);
      gsap.ticker.remove(updateTicker);
      lenis.destroy();
      window.__lenis = null;
    };
  }, []);

  const showToast = useCallback((title, msg) => {
    setToast({ show: true, title, msg });
    clearTimeout(toastTimerRef.current);
    toastTimerRef.current = setTimeout(() => {
      setToast(prev => ({ ...prev, show: false }));
    }, 3400);
  }, []);

  const handleSyncQuestPreset = (preset) => {
    setActiveQuestPreset(preset);
  };

  const handleSelectPackageForPlanner = (pkg) => {
    setPlannerSelection(pkg);
    showToast('Dimasukkan ke Planner', `Silakan sesuaikan titik singgahan untuk ${pkg.title}.`);
  };

  return (
    <div className="min-h-screen bg-[#0B132B] text-slate-100 flex flex-col font-sans selection:bg-[#EF3340] selection:text-white">
      {/* Global Toast Notification */}
      <Toast toast={toast} />

      {/* Floating Dark Glass Capsule Navbar */}
      <Navbar />

      <main className="flex-1 w-full overflow-x-clip">
        {/* Section 1: Hero Slider */}
        <HeroSlider onSyncQuestPreset={handleSyncQuestPreset} />

        {/* Section 2: Scroll-Driven Panoramic "Pindah Tempat" Quest (Pinned & Panoramic Horizontal Scroll) */}
        <AlurRuteQuest
          currentPreset={activeQuestPreset}
          onPresetChange={setActiveQuestPreset}
          onToast={showToast}
        />

        {/* Section 3: Kurasi Paket Wisata + Modal */}
        <PaketWisata onSelectPackageForPlanner={handleSelectPackageForPlanner} />

        {/* Section 4: Three.js Interactive 3D Fleet & Live Travel Journal */}
        <Armada3D />

        {/* Section 5: Reviews, Multi-Stop Trip Planner & Editorial Footer */}
        <ReviewsAndPlanner
          key={plannerSelection?.id || 'default-planner'}
          initialPackageSelection={plannerSelection}
          onToast={showToast}
        />
      </main>
    </div>
  );
}
