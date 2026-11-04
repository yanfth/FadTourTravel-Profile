import { useState } from 'react';

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(prev => !prev);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-75 px-3 sm:px-6 lg:px-10 pt-3 pointer-events-none">
      <div className="max-w-7xl mx-auto rounded-full px-3.5 sm:px-5 py-2 bg-slate-950/80 backdrop-blur-md border border-white/10 shadow-2xl flex items-center justify-between gap-3 pointer-events-auto">

        {/* Official FAD Tour & Travel Red Suitcase Emblem */}
        <a href="#beranda" className="flex items-center gap-3 group shrink-0">
          <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform">
            <svg viewBox="0 0 64 64" className="w-7 h-7" aria-hidden="true">
              {/* Suitcase Handle */}
              <path
                d="M23 15 V9.5 C23 7.6 24.6 6 26.5 6 H37.5 C39.4 6 41 7.6 41 9.5 V15"
                fill="none"
                stroke="#EF3340"
                strokeWidth="3.6"
                strokeLinecap="round"
              />
              {/* Rounded Red Suitcase Body */}
              <rect x="12" y="14" width="40" height="41" rx="8" fill="#EF3340" />
              {/* Stacked Bold Brand Typography: FAD / TOUR / & TRAVEL */}
              <text
                x="32"
                y="29.5"
                textAnchor="middle"
                fill="#FFFFFF"
                fontFamily="Outfit, Plus Jakarta Sans, sans-serif"
                fontWeight="900"
                fontSize="14"
                letterSpacing="-0.3"
              >
                FAD
              </text>
              <text
                x="32"
                y="40"
                textAnchor="middle"
                fill="#FFFFFF"
                fontFamily="Outfit, Plus Jakarta Sans, sans-serif"
                fontWeight="800"
                fontSize="8.6"
                letterSpacing="0.4"
              >
                TOUR
              </text>
              <text
                x="32"
                y="48.5"
                textAnchor="middle"
                fill="#FFFFFF"
                fontFamily="Plus Jakarta Sans, sans-serif"
                fontWeight="700"
                fontSize="5.8"
                letterSpacing="0.3"
              >
                &amp; TRAVEL
              </text>
              {/* Suitcase Wheels */}
              <circle cx="20.5" cy="58.5" r="2.7" fill="#EF3340" />
              <circle cx="43.5" cy="58.5" r="2.7" fill="#EF3340" />
            </svg>
          </div>
          <div className="leading-tight">
            <span className="text-white font-bold text-sm sm:text-[15px] tracking-tight block font-display">
              FAD Tour &amp; Travel
            </span>
            <span className="text-slate-400 text-[10px] font-semibold tracking-wider uppercase block">
              Gresik • Jawa Timur
            </span>
          </div>
        </a>

        {/* Navigation Links */}
        <nav className="hidden lg:flex items-center gap-7 text-xs font-semibold text-slate-200">
          <a href="#beranda" className="hover:text-white transition">Beranda</a>
          <a href="#alur-rute" className="hover:text-white transition flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#EF3340]"></span>
            <span>Alur Rute</span>
          </a>
          <a href="#paket" className="hover:text-white transition">Paket Wisata</a>
          <a href="#armada" className="hover:text-white transition">Armada 3D</a>
          <a href="#ulasan" className="hover:text-white transition">Ulasan</a>
        </nav>

        {/* Right Pill CTA & Mobile Hamburger */}
        <div className="flex items-center gap-2">
          <a
            href="#kontak"
            className="bg-white hover:bg-[#EF3340] text-slate-950 hover:text-white text-xs font-extrabold px-4 sm:px-5 py-2.5 rounded-full transition-colors duration-300 shadow-sm flex items-center gap-1.5 font-display"
          >
            <span>Rencanakan Trip</span>
            <span>→</span>
          </a>
          <button
            onClick={toggleMobileMenu}
            aria-label="Menu Navigasi"
            className="lg:hidden w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition cursor-pointer"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 7h16M4 12h16M4 17h16" />
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Dropdown */}
      {mobileMenuOpen && (
        <div className="lg:hidden max-w-7xl mx-auto mt-2 rounded-3xl bg-slate-950/95 backdrop-blur-xl border border-white/10 p-5 pointer-events-auto flex flex-col gap-3 text-sm font-semibold text-white shadow-2xl">
          <a href="#beranda" onClick={toggleMobileMenu} className="py-1.5 hover:text-[#EF3340] transition">
            Beranda
          </a>
          <a href="#alur-rute" onClick={toggleMobileMenu} className="py-1.5 hover:text-[#EF3340] transition">
            Alur Rute (Pindah Tempat)
          </a>
          <a href="#paket" onClick={toggleMobileMenu} className="py-1.5 hover:text-[#EF3340] transition">
            Paket Wisata
          </a>
          <a href="#armada" onClick={toggleMobileMenu} className="py-1.5 hover:text-[#EF3340] transition">
            Armada 3D &amp; Live Travel
          </a>
          <a href="#ulasan" onClick={toggleMobileMenu} className="py-1.5 hover:text-[#EF3340] transition">
            Ulasan Rombongan
          </a>
          <a
            href="#kontak"
            onClick={toggleMobileMenu}
            className="mt-1 py-2.5 px-4 rounded-full bg-[#EF3340] text-center text-white text-xs font-bold font-display"
          >
            Rencanakan Trip →
          </a>
        </div>
      )}
    </header>
  );
}
