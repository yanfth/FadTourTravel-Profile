import React, { useState } from 'react';
import { TOUR_PACKAGES } from '../data/travelData';

export default function PaketWisata({ onSelectPackageForPlanner }) {
  const [activeTab, setActiveTab] = useState('all');
  const [selectedModalPkg, setSelectedModalPkg] = useState(null);

  const filteredPackages = activeTab === 'all'
    ? TOUR_PACKAGES
    : TOUR_PACKAGES.filter(p => p.cat === activeTab);

  const openModal = (pkg) => {
    setSelectedModalPkg(pkg);
  };

  const closeModal = () => {
    setSelectedModalPkg(null);
  };

  const handleApplyToPlanner = () => {
    if (selectedModalPkg && onSelectPackageForPlanner) {
      onSelectPackageForPlanner(selectedModalPkg);
      closeModal();
      document.getElementById('kontak')?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="paket" className="relative py-24 sm:py-28 px-4 sm:px-6 lg:px-10 bg-[#F8FAFC] text-slate-900">
      <div className="max-w-7xl mx-auto space-y-12">

        {/* Section Heading & Category Filter Tabs */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
          <div className="max-w-2xl space-y-3">
            <span className="inline-flex items-center gap-2 text-xs font-extrabold uppercase tracking-[0.2em] text-blue-700">
              <span className="w-6 h-[2px] bg-[#EF3340] rounded-full"></span>
              <span>Kurasi Paket Perjalanan Rombongan</span>
            </span>
            <h2 className="font-display font-extrabold text-3xl sm:text-4xl lg:text-[42px] text-slate-950 leading-tight tracking-tight">
              Alur Singgahan Jelas, <span className="font-serif italic font-semibold text-blue-700">Perjalanan Nyaman &amp; Terarah</span>
            </h2>
            <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
              Setiap paket dirancang untuk kenyamanan rombongan dari Gresik dan sekitarnya—lengkap dengan jadwal singgah ibadah masjid, rumah makan prasmanan, hingga opsi kunjungan kampus.
            </p>
          </div>

          {/* Filter Tabs */}
          <div className="flex flex-wrap items-center gap-2">
            {[
              { id: 'all', label: 'Semua Paket' },
              { id: 'studytour', label: 'Study Tour & Kampus' },
              { id: 'gathering', label: 'Gathering & Ziarah' },
              { id: 'bahari', label: 'Eksplorasi Bahari & Bali' },
            ].map(tab => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-4 py-2.5 rounded-full text-xs transition cursor-pointer ${
                    isActive
                      ? 'font-extrabold bg-slate-950 text-white shadow-sm'
                      : 'font-semibold bg-white text-slate-600 hover:text-slate-950 border border-slate-200'
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* 6 Tour Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
          {filteredPackages.map(pkg => {
            const directWa = encodeURIComponent(
              `Halo Admin FAD Tour & Travel (0821-3156-8710), saya ingin menanyakan paket *${pkg.title}* (${pkg.price}/pax) keberangkatan dari Gresik.`
            );

            return (
              <article
                key={pkg.id}
                className="tour-pkg-card bg-white rounded-3xl overflow-hidden border border-slate-200/90 flex flex-col justify-between"
              >
                <div>
                  <div className="relative h-56 overflow-hidden bg-slate-200 group">
                    <img
                      src={pkg.img}
                      alt={pkg.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/75 via-transparent to-black/15"></div>

                    <span className="absolute top-4 left-4 px-3 py-1 rounded-full bg-white/95 text-slate-950 text-[11px] font-extrabold shadow-sm">
                      ⏱ {pkg.duration}
                    </span>
                    <span className="absolute top-4 right-4 px-3 py-1 rounded-full bg-slate-950/75 backdrop-blur-md text-white text-[11px] font-bold">
                      👥 {pkg.capacity}
                    </span>
                  </div>

                  <div className="p-6 pb-4 space-y-4">
                    <h3 className="font-display font-extrabold text-lg text-slate-950 leading-snug">
                      {pkg.title}
                    </h3>

                    {/* Stop Chain Strip */}
                    <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1.5">
                      <span className="text-[10px] font-extrabold uppercase tracking-wider text-blue-700 block">
                        Alur Singgahan:
                      </span>
                      <div className="flex flex-wrap items-center gap-1">
                        {pkg.chain.map((c, idx) => (
                          <React.Fragment key={`${c}-${idx}`}>
                            <span className="px-2 py-0.5 rounded-md bg-white border border-slate-200 text-[10px] font-bold text-slate-700">
                              {c}
                            </span>
                            {idx < pkg.chain.length - 1 && (
                              <span className="text-slate-400 text-[10px] font-bold">→</span>
                            )}
                          </React.Fragment>
                        ))}
                      </div>
                    </div>

                    {/* Inclusions Icons */}
                    <div className="flex flex-wrap gap-1.5">
                      {pkg.icons.map((ic, i) => (
                        <span
                          key={i}
                          className="px-2.5 py-1 rounded-lg bg-slate-100 text-[11px] font-semibold text-slate-600"
                        >
                          {ic}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="px-6 pb-6 pt-2 space-y-4">
                  <div className="flex items-baseline justify-between border-t border-slate-100 pt-3.5">
                    <span className="text-xs font-semibold text-slate-400">Mulai dari</span>
                    <div>
                      <span className="font-extrabold text-xl text-[#EF3340]">{pkg.price}</span>
                      <span className="text-xs text-slate-500"> / pax</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2.5">
                    <button
                      onClick={() => openModal(pkg)}
                      className="py-2.5 px-3 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-900 font-bold text-xs transition cursor-pointer"
                    >
                      Detail Alur &amp; Fasilitas
                    </button>
                    <a
                      href={`https://wa.me/6282131568710?text=${directWa}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="py-2.5 px-3 rounded-full bg-slate-950 hover:bg-[#EF3340] text-white font-extrabold text-xs text-center transition"
                    >
                      Booking WA →
                    </a>
                  </div>
                </div>
              </article>
            );
          })}
        </div>

      </div>

      {/* ITINERARY & FACILITIES MODAL */}
      {selectedModalPkg && (
        <div
          onClick={(e) => {
            if (e.target === e.currentTarget) closeModal();
          }}
          className="fixed inset-0 z-[90] bg-slate-950/75 backdrop-blur-md flex items-center justify-center p-4 sm:p-6"
        >
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[88vh] overflow-hidden shadow-2xl border border-slate-100 flex flex-col">

            <div className="relative h-52 sm:h-60 bg-slate-900 shrink-0 overflow-hidden">
              <img
                src={selectedModalPkg.img}
                alt="Detail Paket FAD Tour"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/92 via-slate-950/35 to-transparent"></div>

              <button
                onClick={closeModal}
                aria-label="Tutup Modal"
                className="absolute top-4 right-4 w-10 h-10 rounded-full bg-black/45 hover:bg-white text-white hover:text-slate-950 backdrop-blur-md flex items-center justify-center transition font-bold cursor-pointer"
              >
                ✕
              </button>

              <div className="absolute bottom-5 left-6 right-6 text-white">
                <span className="inline-block px-3 py-1 rounded-full bg-[#EF3340] text-white text-[10px] font-extrabold uppercase tracking-wider">
                  {selectedModalPkg.duration} • {selectedModalPkg.capacity}
                </span>
                <h3 className="font-display font-extrabold text-2xl sm:text-3xl mt-1.5 leading-tight">
                  {selectedModalPkg.title}
                </h3>
              </div>
            </div>

            <div className="p-6 sm:p-8 overflow-y-auto space-y-6 flex-1 text-slate-900">
              <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-200">
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">Harga Mulai Dari</span>
                  <span className="font-extrabold text-2xl text-[#EF3340]">{selectedModalPkg.price}</span>
                  <span className="text-xs text-slate-500"> / pax</span>
                </div>
                <div className="text-right">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">Kapasitas &amp; Keberangkatan</span>
                  <span className="text-xs sm:text-sm font-bold text-slate-900">{selectedModalPkg.capacity} • Start Gresik</span>
                </div>
              </div>

              {/* Stop Chain Visual */}
              <div className="bg-blue-50/80 border border-blue-100 rounded-2xl p-4">
                <p className="text-[11px] font-extrabold uppercase tracking-wider text-blue-800 mb-2">Rangkaian Alur Singgahan:</p>
                <div className="flex flex-wrap items-center gap-1.5 text-xs font-bold text-slate-900">
                  {selectedModalPkg.chain.map((c, i) => (
                    <React.Fragment key={i}>
                      <span className="px-2.5 py-1 rounded-full bg-white border border-blue-200 shadow-sm">{c}</span>
                      {i < selectedModalPkg.chain.length - 1 && <span className="text-blue-600">→</span>}
                    </React.Fragment>
                  ))}
                </div>
              </div>

              {/* Step-by-Step Itinerary */}
              <div className="space-y-4">
                <h4 className="text-xs font-extrabold uppercase tracking-[0.18em] text-blue-700">Rincian Alur Perjalanan</h4>
                <div className="space-y-3.5">
                  {selectedModalPkg.steps.map((st, i) => (
                    <div key={i} className="flex gap-3.5 items-start">
                      <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-[11px] font-extrabold shrink-0 mt-0.5">{st.tag}</span>
                      <div>
                        <h5 className="font-bold text-sm text-slate-950">{st.head}</h5>
                        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mt-0.5">{st.text}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Inclusions */}
              <div className="bg-slate-50 rounded-2xl p-4 sm:p-5 border border-slate-200/80">
                <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-900 mb-2.5">Fasilitas Rombongan Termasuk:</h4>
                <div className="flex flex-wrap gap-2">
                  {selectedModalPkg.inclusions.map((inc, i) => (
                    <span key={i} className="px-3 py-1.5 rounded-full bg-white border border-slate-200 text-xs font-semibold text-slate-700">✓ {inc}</span>
                  ))}
                </div>
              </div>
            </div>

            <div className="px-6 sm:px-8 py-4 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
              <span className="text-xs text-slate-500">Titik singgah bebas disesuaikan kebutuhan panitia rombongan.</span>
              <div className="flex items-center gap-2.5 w-full sm:w-auto">
                <button
                  onClick={handleApplyToPlanner}
                  className="flex-1 sm:flex-initial px-4 py-2.5 rounded-full border border-slate-300 hover:border-slate-950 text-xs font-bold text-slate-900 transition cursor-pointer"
                >
                  Atur Singgahan
                </button>
                <a
                  href={`https://wa.me/6282131568710?text=${encodeURIComponent(
                    `Halo Admin FAD Tour & Travel (0821-3156-8710), saya tertarik dengan paket *${selectedModalPkg.title}* (${selectedModalPkg.price}/pax, alur: ${selectedModalPkg.chain.join(' -> ')}). Mohon informasi jadwal & penawaran rombongan.`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 sm:flex-initial text-center px-6 py-2.5 rounded-full bg-[#EF3340] hover:bg-[#D42230] text-white text-xs font-extrabold transition shadow-sm"
                >
                  Booking via WhatsApp
                </a>
              </div>
            </div>

          </div>
        </div>
      )}
    </section>
  );
}

