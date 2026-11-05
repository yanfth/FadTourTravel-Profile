import { useState } from 'react';
import { REVIEWS } from '../data/travelData';

export default function ReviewsAndPlanner({ initialPackageSelection, onToast }) {
  const [origin, setOrigin] = useState('Gresik (Kota / Kebomas / Manyar)');
  const [dest, setDest] = useState(
    initialPackageSelection?.destSelect || 'Yogyakarta & Kunjungan Kampus'
  );
  const [pax, setPax] = useState('45 - 55 Peserta (1 Big Bus Pariwisata)');
  const [chkSekolah, setChkSekolah] = useState(true);
  const [chkMasjid, setChkMasjid] = useState(true);
  const [chkRm, setChkRm] = useState(true);
  const [chkKampus, setChkKampus] = useState(
    typeof initialPackageSelection?.hasCampus === 'boolean'
      ? initialPackageSelection.hasCampus
      : true
  );

  const getSelectedIntermediateStops = () => {
    const list = [];
    if (chkSekolah) list.push('🏫 Jemput di Sekolah/Instansi');
    if (chkMasjid) list.push('🕌 Singgah Masjid Pilihan');
    if (chkRm) list.push('🍽️ Rumah Makan Prasmanan');
    if (chkKampus) list.push('🎓 Kunjungan Kampus');
    return list;
  };

  const intermediateStops = getSelectedIntermediateStops();
  const fullChain = [origin, ...intermediateStops, dest];

  const buildWhatsAppInquiryText = () => {
    const stopsStr = intermediateStops.length ? intermediateStops.join(' → ') : 'Langsung ke tujuan utama';
    return (
      `Halo Admin *FAD Tour & Travel* (0821-3156-8710) 👋\n` +
      `Saya ingin merencanakan perjalanan rombongan dengan detail alur berikut:\n\n` +
      `• *Asal Keberangkatan:* ${origin}\n` +
      `• *Titik Singgahan:* ${stopsStr}\n` +
      `• *Tujuan Akhir:* ${dest}\n` +
      `• *Kapasitas Peserta:* ${pax}\n\n` +
      `Mohon info rekomendasi jadwal, armada bus, dan penawaran biayanya. Terima kasih!`
    );
  };

  const handleSendToWhatsApp = (e) => {
    e.preventDefault();
    const text = buildWhatsAppInquiryText();
    if (onToast) {
      onToast('Membuka WhatsApp', 'Menghubungkan rencana rute Anda ke WhatsApp 0821-3156-8710...');
    }
    window.open(`https://wa.me/6282131568710?text=${encodeURIComponent(text)}`, '_blank', 'noopener,noreferrer');
  };

  const handleCopySummary = () => {
    const text = buildWhatsAppInquiryText();
    navigator.clipboard?.writeText(text).then(
      () => {
        if (onToast) {
          onToast('Berhasil Disalin', 'Rencana alur perjalanan telah disalin ke papan klip.');
        }
      },
      () => {
        if (onToast) {
          onToast('Siap Dikirim', 'Klik tombol Kirim ke WhatsApp untuk langsung berkonsultasi.');
        }
      }
    );
  };

  return (
    <div className="relative overflow-hidden bg-[#070D1D] text-white">

      {/* Aerial Ocean Wave Backdrop */}
      <div className="absolute inset-x-0 top-0 h-[980px] z-0 pointer-events-none">
        <img
          src="https://images.unsplash.com/photo-1505118380757-91f5f5632de0?auto=format&fit=crop&w=1920&q=85"
          alt="Gelombang Laut Pirus Nusantara"
          className="w-full h-full object-cover object-center opacity-55"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#070D1D] via-[#0D3554]/55 to-[#070D1D]"></div>
      </div>

      {/* REVIEWS (#ulasan) */}
      <section id="ulasan" className="relative z-10 pt-24 pb-16 px-4 sm:px-6 lg:px-10">
        <div className="max-w-7xl mx-auto space-y-12">

          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div className="space-y-2">
              <span className="text-xs font-extrabold uppercase tracking-[0.2em] text-sky-300 block">
                Kepercayaan Penyelenggara Rombongan
              </span>
              <h2 className="font-display font-extrabold text-3xl sm:text-5xl text-white tracking-tight">
                Ulasan <span className="font-serif italic font-semibold text-sky-200">Mitra &amp; Panitia Tur</span>
              </h2>
            </div>
            <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-slate-950/60 backdrop-blur-md border border-white/20 text-xs font-bold text-white self-start">
              <span className="text-amber-300">★★★★★</span>
              <span>4.9 / 5.0 Kepuasan Rombongan Gresik &amp; Jatim</span>
            </div>
          </div>

          {/* 3 Review Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-7">
            {REVIEWS.map((rev, idx) => (
              <div
                key={idx}
                className="glass-light-card rounded-3xl p-7 text-slate-900 flex flex-col justify-between hover:-translate-y-1 transition-transform duration-300"
              >
                <div className="space-y-4">
                  <div className="flex items-center gap-3.5">
                    <div className={`w-12 h-12 rounded-full ${rev.color} text-white font-extrabold text-sm flex items-center justify-center shrink-0`}>
                      {rev.initials}
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-slate-950">{rev.name}</h4>
                      <p className="text-xs text-slate-500">{rev.role}</p>
                      <div className="text-amber-400 text-xs tracking-wider mt-0.5">★★★★★</div>
                    </div>
                  </div>
                  <p className="font-bold text-base text-slate-950">{rev.quote}</p>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    {rev.text}
                  </p>
                </div>
                <div className="pt-4 mt-6 border-t border-slate-200 flex items-center justify-between text-[11px] font-bold text-blue-800">
                  <span>{rev.route}</span>
                  <span>{rev.fleet}</span>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* CUSTOM MULTI-STOP TRIP PLANNER & FOOTER (#kontak) */}
      <footer id="kontak" className="relative z-10 pt-10 pb-14 px-4 sm:px-6 lg:px-10">
        <div className="max-w-7xl mx-auto space-y-16">

          {/* Interactive Multi-Stop Trip Builder Card */}
          <div className="glass-frosted-dark rounded-[32px] p-6 sm:p-9 lg:p-10">
            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-7">
              <div className="space-y-1.5">
                <span className="text-xs font-extrabold uppercase tracking-[0.2em] text-sky-300 block">
                  Custom Multi-Stop Trip Planner
                </span>
                <h3 className="font-display font-extrabold text-2xl sm:text-3xl text-white tracking-tight">
                  Rancang Sendiri Rute &amp; Tempat Singgahan Rombongan Anda
                </h3>
                <p className="text-xs sm:text-sm text-slate-300">
                  Pilih kota asal penjemputan, tujuan utama, kapasitas peserta, serta centang titik singgahan yang dibutuhkan—lalu kirimkan langsung ke WhatsApp resmi kami.
                </p>
              </div>
              <button
                type="button"
                onClick={handleCopySummary}
                className="self-start lg:self-auto px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 border border-white/25 text-xs font-bold text-white transition cursor-pointer font-display"
              >
                📋 Salin Rencana Rute
              </button>
            </div>

            <form onSubmit={handleSendToWhatsApp} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label htmlFor="builder-origin" className="block text-[11px] font-extrabold uppercase tracking-wider text-sky-200 mb-2">
                    1. Lokasi Jemput Awal
                  </label>
                  <select
                    id="builder-origin"
                    value={origin}
                    onChange={(e) => setOrigin(e.target.value)}
                    className="w-full rounded-2xl bg-slate-950/85 border border-white/20 focus:border-sky-400 px-4 py-3.5 text-sm text-white outline-none transition"
                  >
                    <option value="Gresik (Kota / Kebomas / Manyar)">📍 Gresik (Kota / Kebomas / Manyar)</option>
                    <option value="Gresik Selatan (Menganti / Driyorejo)">📍 Gresik Selatan (Menganti / Driyorejo)</option>
                    <option value="Surabaya & Sidoarjo">📍 Surabaya &amp; Sidoarjo</option>
                    <option value="Lamongan & Tuban">📍 Lamongan &amp; Tuban</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="builder-dest" className="block text-[11px] font-extrabold uppercase tracking-wider text-sky-200 mb-2">
                    2. Destinasi Tujuan Akhir
                  </label>
                  <select
                    id="builder-dest"
                    value={dest}
                    onChange={(e) => setDest(e.target.value)}
                    className="w-full rounded-2xl bg-slate-950/85 border border-white/20 focus:border-sky-400 px-4 py-3.5 text-sm text-white outline-none transition"
                  >
                    <option value="Yogyakarta & Kunjungan Kampus">🏛️ Yogyakarta &amp; Kunjungan Kampus</option>
                    <option value="Goes to Jakarta & PIK 2 Overland">🗼 Goes to Jakarta &amp; PIK 2 Overland</option>
                    <option value="Bali Overland & Nusa Penida">🏝️ Bali Overland &amp; Nusa Penida</option>
                    <option value="Bromo Sunrise & Malang Batu">⛰️ Bromo Sunrise &amp; Malang Batu</option>
                    <option value="Komodo Island & Labuan Bajo">⛵ Komodo Island &amp; Labuan Bajo</option>
                    <option value="Ziarah Wali Jatirogo / Jawa-Madura">🕌 Wisata Religi &amp; Ziarah Wali</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="builder-pax" className="block text-[11px] font-extrabold uppercase tracking-wider text-sky-200 mb-2">
                    3. Jumlah Peserta / Armada
                  </label>
                  <select
                    id="builder-pax"
                    value={pax}
                    onChange={(e) => setPax(e.target.value)}
                    className="w-full rounded-2xl bg-slate-950/85 border border-white/20 focus:border-sky-400 px-4 py-3.5 text-sm text-white outline-none transition"
                  >
                    <option value="45 - 55 Peserta (1 Big Bus Pariwisata)">45–55 Peserta (1 Big Bus)</option>
                    <option value="100 - 200 Peserta (2-4 Big Bus Sekolah/Komunitas)">100–200 Peserta (Multi-Bus)</option>
                    <option value="30 - 35 Peserta (Medium Bus)">30–35 Peserta (Medium Bus)</option>
                    <option value="14 - 18 Peserta (Hiace Premio)">14–18 Peserta (Hiace Premio)</option>
                  </select>
                </div>
              </div>

              {/* Checkboxes */}
              <div className="space-y-2.5">
                <span className="block text-[11px] font-extrabold uppercase tracking-wider text-sky-200">
                  4. Centang Titik Singgahan yang Diinginkan:
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                  <label className="flex items-center gap-3 p-3.5 rounded-2xl bg-slate-950/70 hover:bg-slate-950 border border-white/15 cursor-pointer transition">
                    <input
                      type="checkbox"
                      checked={chkSekolah}
                      onChange={(e) => setChkSekolah(e.target.checked)}
                      className="w-4 h-4 accent-[#EF3340] rounded"
                    />
                    <span className="text-xs font-bold text-white">🏫 Jemput di Sekolah/Instansi</span>
                  </label>

                  <label className="flex items-center gap-3 p-3.5 rounded-2xl bg-slate-950/70 hover:bg-slate-950 border border-white/15 cursor-pointer transition">
                    <input
                      type="checkbox"
                      checked={chkMasjid}
                      onChange={(e) => setChkMasjid(e.target.checked)}
                      className="w-4 h-4 accent-[#EF3340] rounded"
                    />
                    <span className="text-xs font-bold text-white">🕌 Singgah Masjid Pilihan</span>
                  </label>

                  <label className="flex items-center gap-3 p-3.5 rounded-2xl bg-slate-950/70 hover:bg-slate-950 border border-white/15 cursor-pointer transition">
                    <input
                      type="checkbox"
                      checked={chkRm}
                      onChange={(e) => setChkRm(e.target.checked)}
                      className="w-4 h-4 accent-[#EF3340] rounded"
                    />
                    <span className="text-xs font-bold text-white">🍽️ Rumah Makan Prasmanan</span>
                  </label>

                  <label className="flex items-center gap-3 p-3.5 rounded-2xl bg-slate-950/70 hover:bg-slate-950 border border-white/15 cursor-pointer transition">
                    <input
                      type="checkbox"
                      checked={chkKampus}
                      onChange={(e) => setChkKampus(e.target.checked)}
                      className="w-4 h-4 accent-[#EF3340] rounded"
                    />
                    <span className="text-xs font-bold text-white">🎓 Kunjungan Kampus</span>
                  </label>
                </div>
              </div>

              {/* Live Route Preview + Direct WhatsApp CTA */}
              <div className="p-4 rounded-2xl bg-slate-950/75 border border-white/15 flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
                <div className="space-y-1.5">
                  <span className="text-[10px] font-extrabold uppercase tracking-widest text-sky-300 block">
                    Alur Perjalanan Terpilih:
                  </span>
                  <div className="flex flex-wrap items-center gap-1.5 text-xs font-bold text-white">
                    {fullChain.map((label, i) => (
                      <span key={i} className="flex items-center gap-1.5">
                        <span
                          className={`px-2.5 py-1 rounded-full ${
                            i === 0 || i === fullChain.length - 1
                              ? 'bg-white text-slate-950'
                              : 'bg-white/15 border border-white/20 text-white'
                          } text-[11px] font-bold`}
                        >
                          {label}
                        </span>
                        {i < fullChain.length - 1 && <span className="text-sky-300 font-bold">→</span>}
                      </span>
                    ))}
                  </div>
                </div>

                <button
                  type="submit"
                  className="shrink-0 rounded-full bg-[#EF3340] hover:bg-white text-white hover:text-slate-950 font-extrabold text-xs sm:text-sm px-7 py-4 transition-colors duration-300 shadow-xl flex items-center justify-center gap-2 cursor-pointer font-display"
                >
                  <span>Kirim ke WhatsApp 0821-3156-8710</span>
                  <span>→</span>
                </button>
              </div>
            </form>
          </div>

          {/* Editorial Footer Columns */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 pt-4 border-t border-white/10">
            <div className="lg:col-span-5 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-full bg-white flex items-center justify-center shrink-0">
                  <svg viewBox="0 0 64 64" className="w-7 h-7" aria-hidden="true">
                    <path d="M23 15 V9.5 C23 7.6 24.6 6 26.5 6 H37.5 C39.4 6 41 7.6 41 9.5 V15" fill="none" stroke="#EF3340" strokeWidth="3.6" strokeLinecap="round" />
                    <rect x="12" y="14" width="40" height="41" rx="8" fill="#EF3340" />
                    <text x="32" y="29.5" textAnchor="middle" fill="#FFFFFF" fontFamily="Outfit, Plus Jakarta Sans, sans-serif" fontWeight="900" fontSize="14" letterSpacing="-0.3">FAD</text>
                    <text x="32" y="40" textAnchor="middle" fill="#FFFFFF" fontFamily="Outfit, Plus Jakarta Sans, sans-serif" fontWeight="800" fontSize="8.6" letterSpacing="0.4">TOUR</text>
                    <text x="32" y="48.5" textAnchor="middle" fill="#FFFFFF" fontFamily="Plus Jakarta Sans, sans-serif" fontWeight="700" fontSize="5.8" letterSpacing="0.3">&amp; TRAVEL</text>
                    <circle cx="20.5" cy="58.5" r="2.7" fill="#EF3340" />
                    <circle cx="43.5" cy="58.5" r="2.7" fill="#EF3340" />
                  </svg>
                </div>
                <div>
                  <h4 className="font-display font-extrabold text-lg text-white">FAD Tour &amp; Travel</h4>
                  <p className="text-xs text-sky-300">Gresik • Jawa Timur • Indonesia</p>
                </div>
              </div>
              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed max-w-md">
                Biro perjalanan wisata rombongan sekolah, kunjungan kampus, komunitas, ziarah religi, hingga tur keluarga lintas kota dan kepulauan dengan layanan hangat dan armada prima.
              </p>
            </div>

            <div className="lg:col-span-2 space-y-3">
              <h5 className="text-xs font-extrabold uppercase tracking-wider text-sky-300 font-display">Navigasi</h5>
              <ul className="space-y-2.5 text-xs sm:text-sm text-slate-300">
                <li><a href="#beranda" className="hover:text-white transition">Beranda</a></li>
                <li><a href="#alur-rute" className="hover:text-white transition">Alur Rute</a></li>
                <li><a href="#paket" className="hover:text-white transition">Paket Wisata</a></li>
                <li><a href="#armada" className="hover:text-white transition">Armada 3D</a></li>
                <li><a href="#ulasan" className="hover:text-white transition">Ulasan</a></li>
              </ul>
            </div>

            <div className="lg:col-span-2 space-y-3">
              <h5 className="text-xs font-extrabold uppercase tracking-wider text-sky-300 font-display">Rute Favorit</h5>
              <ul className="space-y-2.5 text-xs sm:text-sm text-slate-300">
                <li><a href="#paket" className="hover:text-white transition">Goes to Jakarta</a></li>
                <li><a href="#paket" className="hover:text-white transition">Komodo Island</a></li>
                <li><a href="#paket" className="hover:text-white transition">Yogyakarta &amp; Kampus</a></li>
                <li><a href="#paket" className="hover:text-white transition">Bromo &amp; Malang Batu</a></li>
                <li><a href="#paket" className="hover:text-white transition">Bali Overland</a></li>
              </ul>
            </div>

            <div className="lg:col-span-3 space-y-3">
              <h5 className="text-xs font-extrabold uppercase tracking-wider text-sky-300 font-display">Info &amp; Reservasi</h5>
              <ul className="space-y-3 text-xs sm:text-sm text-slate-300">
                <li className="flex items-start gap-2.5">
                  <span className="text-[#EF3340] mt-0.5">📍</span>
                  <span>Kabupaten Gresik, Jawa Timur<br /><span className="text-slate-500 text-xs">Layanan jemput Gresik, Surabaya, Sidoarjo, Lamongan</span></span>
                </li>
                <li>
                  <a
                    href="https://wa.me/6282131568710"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-white hover:text-[#EF3340] font-bold transition"
                  >
                    <span>📞</span>
                    <span>0821-3156-8710 (WhatsApp)</span>
                  </a>
                </li>
                <li>
                  <a
                    href="https://instagram.com/fadtourtravel"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-white hover:text-[#EF3340] font-bold transition"
                  >
                    <span>📸</span>
                    <span>@fadtourtravel</span>
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
            <p>© 2026 FAD Tour &amp; Travel Gresik. Seluruh hak cipta dilindungi.</p>
            <p>Perjalanan nyaman • Singgah terarah • Kenangan tak terlupakan.</p>
          </div>

        </div>
      </footer>
    </div>
  );
}
