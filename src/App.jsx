import { useState } from 'react';
import Navbar from './components/Navbar';
import Toast from './components/Toast';
import HeroSlider from './components/HeroSlider';
import AlurRuteQuest from './components/AlurRuteQuest';
import PaketWisata from './components/PaketWisata';
import Armada3D from './components/Armada3D';
import ReviewsAndPlanner from './components/ReviewsAndPlanner';

export default function App() {
  const [toast, setToast] = useState({ show: false, title: '', message: '' });
  const [activePresetId, setActivePresetId] = useState('study-tour');
  const [plannerPaket, setPlannerPaket] = useState(null);

  const showToast = (title, message) => {
    setToast({ show: true, title, message });
  };

  const closeToast = () => {
    setToast(prev => ({ ...prev, show: false }));
  };

  const handleSelectPaketFromTour = (pkg) => {
    setPlannerPaket(pkg);
    const plannerEl = document.getElementById('kontak');
    if (plannerEl) {
      plannerEl.scrollIntoView({ behavior: 'smooth' });
    }
    showToast('Paket Dipilih', `Paket "${pkg.title}" telah dimuat ke formulir perencanaan.`);
  };

  return (
    <div className="bg-[#0B132B] text-slate-100 min-h-screen selection:bg-[#EF3340] selection:text-white">
      <Toast toast={toast} onClose={closeToast} />
      <Navbar onRencanakanClick={() => {
        document.getElementById('kontak')?.scrollIntoView({ behavior: 'smooth' });
      }} />

      <main className="overflow-x-clip">
        <section id="beranda">
          <HeroSlider onSelectRoutePreset={(presetId) => {
            setActivePresetId(presetId);
            showToast('Rute Terpilih', `Menampilkan rute ${presetId.replace('-', ' ').toUpperCase()} pada peta alur.`);
          }} />
        </section>

        <AlurRuteQuest
          activePresetId={activePresetId}
          onPresetChange={(newId) => setActivePresetId(newId)}
          onStopChange={() => {}}
        />

        <section id="paket">
          <PaketWisata onPilihPaket={handleSelectPaketFromTour} />
        </section>

        <section id="armada">
          <Armada3D />
        </section>

        <ReviewsAndPlanner
          selectedPackage={plannerPaket}
          onPlanSubmitted={(planData) => {
            showToast('Permintaan Terkirim', `Terima kasih ${planData.name}, tim FAD Tour segera menghubungi Anda.`);
          }}
        />
      </main>
    </div>
  );
}
