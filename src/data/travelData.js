export const HERO_ROUTES = [
  {
    num: '01',
    preset: 'jakarta',
    region: 'Gathering & Komunitas Rombongan dari Gresik',
    line1: 'GOES TO',
    line2: 'JAKARTA',
    cardTag: 'Trans-Jawa PP',
    cardName: 'Goes to Jakarta',
    desc: 'Perjalanan lintas kota via Tol Trans-Jawa bersama armada bus Full AC berlayar TV ganda & karaoke, singgah nyaman di masjid dan rumah makan prasmanan pilihan hingga kembali ke Gresik.',
    img: 'https://images.unsplash.com/photo-1555899434-94d1368aa7af?auto=format&fit=crop&w=1920&q=85',
    thumb: 'https://images.unsplash.com/photo-1555899434-94d1368aa7af?auto=format&fit=crop&w=600&q=80'
  },
  {
    num: '02',
    preset: 'bali',
    region: 'Labuan Bajo & Sailing Archipelago',
    line1: 'KOMODO',
    line2: 'ISLAND',
    cardTag: 'Flores • NTT',
    cardName: 'Komodo Island',
    desc: 'Layanan antar-jemput rombongan dari Gresik menuju Bandara Juanda dilanjutkan pelayaran Phinisi eksklusif menjelajahi Pulau Padar, Pink Beach, dan Taman Nasional Komodo.',
    img: 'https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?auto=format&fit=crop&w=1920&q=85',
    thumb: 'https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?auto=format&fit=crop&w=600&q=80'
  },
  {
    num: '03',
    preset: 'studytour',
    region: 'Study Tour Sekolah, Singgah Masjid, RM & Kampus',
    line1: 'YOGYAKARTA',
    line2: '& KAMPUS',
    cardTag: 'Study Tour',
    cardName: 'Yogyakarta & Kampus',
    desc: 'Alur edukasi favorit dari gerbang sekolah di Gresik, singgah ibadah di masjid agung, makan prasmanan pendopo luas, kunjungan kampus impian hingga senja di Candi Prambanan.',
    img: 'https://images.unsplash.com/photo-1584810359583-96fc3448beaa?auto=format&fit=crop&w=1920&q=85',
    thumb: 'https://images.unsplash.com/photo-1584810359583-96fc3448beaa?auto=format&fit=crop&w=600&q=80'
  },
  {
    num: '04',
    preset: 'studytour',
    region: 'Panorama Jawa Timur Adventure',
    line1: 'BROMO &',
    line2: 'MALANG BATU',
    cardTag: 'Jawa Timur',
    cardName: 'Bromo & Malang Batu',
    desc: 'Petualangan Jeep 4x4 menyambut matahari terbit Gunung Bromo dipadukan kesejukan wisata edukasi, kuliner prasmanan, dan sentra oleh-oleh Kota Wisata Batu.',
    img: 'https://images.unsplash.com/photo-1588668214407-6ea9a6d8c272?auto=format&fit=crop&w=1920&q=85',
    thumb: 'https://images.unsplash.com/photo-1588668214407-6ea9a6d8c272?auto=format&fit=crop&w=600&q=80'
  },
  {
    num: '05',
    preset: 'bali',
    region: 'Eksplorasi Budaya & Pantai Dewata',
    line1: 'BALI',
    line2: 'OVERLAND',
    cardTag: 'Pulau Dewata',
    cardName: 'Bali Overland',
    desc: 'Rangkaian perjalanan darat-laut yang nyaman dengan jeda makan tepi pantai Ketapang, wisata Pura Ulun Danu Bedugul, Tanah Lot, hingga jamuan seafood Pantai Jimbaran.',
    img: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=1920&q=85',
    thumb: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=600&q=80'
  }
];

export const QUEST_PRESETS = {
  studytour: {
    label: 'Study Tour & Kampus',
    hasCampusToggle: true,
    stops: [
      {
        short: 'Sekolah',
        time: '06:30 WIB',
        title: 'Jemput Gerbang Sekolah Gresik',
        desc: 'Bus tiba pagi di sekolah Gresik, penataan koper bagasi & doa keberangkatan.',
        zoneType: 'sekolah',
        photo: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=1400&q=80',
        thumb: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=300&q=80',
        skyTop: [37, 99, 235],    // #2563EB Crisp Morning Blue
        skyMid: [96, 165, 250],   // #60A5FA
        skyBot: [186, 230, 253],  // #BAE6FD
        pinY: 420
      },
      {
        short: 'Masjid',
        time: '09:45 WIB',
        title: 'Singgah Ibadah Masjid Agung',
        desc: 'Istirahat salat berjamaah/jamak di masjid agung rest area yang bersih & lega.',
        zoneType: 'masjid',
        photo: 'https://images.unsplash.com/photo-1564769625905-50e93615e769?auto=format&fit=crop&w=1400&q=80',
        thumb: 'https://images.unsplash.com/photo-1564769625905-50e93615e769?auto=format&fit=crop&w=300&q=80',
        skyTop: [29, 78, 216],    // #1D4ED8 Clear Bright Azure
        skyMid: [56, 189, 248],   // #38BDF8
        skyBot: [186, 230, 253],
        pinY: 375
      },
      {
        short: 'Rumah Makan',
        time: '12:30 WIB',
        title: 'Singgah Rumah Makan Prasmanan',
        desc: 'Santap siang hangat prasmanan halal di pendopo Joglo luas tanpa antre panjang.',
        zoneType: 'rm',
        photo: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1400&q=80',
        thumb: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=300&q=80',
        skyTop: [2, 132, 199],    // #0284C7 Warm Tropical Noon
        skyMid: [125, 211, 252],  // #7DD3FC
        skyBot: [224, 242, 254],
        pinY: 430
      },
      {
        isCampus: true,
        short: 'Kampus',
        time: '14:30 WIB',
        title: 'Singgah Kunjungan Kampus Impian',
        desc: 'Sesi pengenalan rektorat universitas tujuan, motivasi studi & foto angkatan.',
        zoneType: 'kampus',
        photo: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=1400&q=80',
        thumb: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=300&q=80',
        skyTop: [59, 130, 246],   // #3B82F6 Breezy Afternoon
        skyMid: [147, 197, 253],  // #93C5FD
        skyBot: [219, 234, 254],
        pinY: 370
      },
      {
        short: 'Tujuan Akhir',
        time: '17:00 WIB',
        title: 'Tiba di Candi Prambanan & Jogja!',
        desc: 'Tiba segar menikmati golden sunset Candi Prambanan & suasana sore Malioboro.',
        zoneType: 'dest_jogja',
        photo: 'https://images.unsplash.com/photo-1584810359583-96fc3448beaa?auto=format&fit=crop&w=1400&q=80',
        thumb: 'https://images.unsplash.com/photo-1584810359583-96fc3448beaa?auto=format&fit=crop&w=300&q=80',
        skyTop: [30, 58, 138],    // #1E3A8A Golden Sunset Sky
        skyMid: [234, 88, 12],    // #EA580C
        skyBot: [253, 186, 116],  // #FDBA74
        pinY: 395
      }
    ]
  },

  jakarta: {
    label: 'Goes to Jakarta',
    hasCampusToggle: true,
    stops: [
      {
        short: 'Start Gresik',
        time: '06:00 WIB',
        title: 'Titik Kumpul Rombongan Gresik',
        desc: 'Keberangkatan pagi dari Gresik dengan hiburan Dual TV Kabin & karaoke seru.',
        zoneType: 'sekolah',
        photo: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=1400&q=80',
        thumb: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=300&q=80',
        skyTop: [37, 99, 235],
        skyMid: [96, 165, 250],
        skyBot: [186, 230, 253],
        pinY: 420
      },
      {
        short: 'Masjid Tol',
        time: '10:15 WIB',
        title: 'Singgah Masjid Agung Rest Area',
        desc: 'Jeda ibadah salat & istirahat nyaman di rest area heritage Tol Trans-Jawa.',
        zoneType: 'masjid',
        photo: 'https://images.unsplash.com/photo-1564769625905-50e93615e769?auto=format&fit=crop&w=1400&q=80',
        thumb: 'https://images.unsplash.com/photo-1564769625905-50e93615e769?auto=format&fit=crop&w=300&q=80',
        skyTop: [29, 78, 216],
        skyMid: [56, 189, 248],
        skyBot: [186, 230, 253],
        pinY: 375
      },
      {
        short: 'Rumah Makan',
        time: '13:00 WIB',
        title: 'Singgah RM Prasmanan Pantura',
        desc: 'Hidangan makan siang prasmanan hangat siap saji khusus rombongan bus.',
        zoneType: 'rm',
        photo: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1400&q=80',
        thumb: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=300&q=80',
        skyTop: [2, 132, 199],
        skyMid: [125, 211, 252],
        skyBot: [224, 242, 254],
        pinY: 430
      },
      {
        isCampus: true,
        short: 'Kampus UI/UNJ',
        time: '15:00 WIB',
        title: 'Singgah Kunjungan Kampus / Instansi',
        desc: 'Agenda opsional studi banding universitas atau silaturahmi kelembagaan.',
        zoneType: 'kampus',
        photo: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=1400&q=80',
        thumb: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=300&q=80',
        skyTop: [59, 130, 246],
        skyMid: [147, 197, 253],
        skyBot: [219, 234, 254],
        pinY: 370
      },
      {
        short: 'Monas Jakarta',
        time: '17:15 WIB',
        title: 'Tiba di Monas & Kawasan PIK 2!',
        desc: 'Sampai di Ibu Kota untuk agenda utama grup, wisata Monas & sunset PIK 2.',
        zoneType: 'dest_jakarta',
        photo: 'https://images.unsplash.com/photo-1555899434-94d1368aa7af?auto=format&fit=crop&w=1400&q=80',
        thumb: 'https://images.unsplash.com/photo-1555899434-94d1368aa7af?auto=format&fit=crop&w=300&q=80',
        skyTop: [30, 58, 138],
        skyMid: [234, 88, 12],
        skyBot: [253, 186, 116],
        pinY: 395
      }
    ]
  },

  bali: {
    label: 'Wisata Bali',
    hasCampusToggle: true,
    stops: [
      {
        short: 'Jemput Gresik',
        time: '06:30 WIB',
        title: 'Titik Jemput Rombongan Gresik',
        desc: 'Bus menjemput di titik kumpul Gresik lengkap bantal, selimut & snack pagi.',
        zoneType: 'sekolah',
        photo: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=1400&q=80',
        thumb: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=300&q=80',
        skyTop: [37, 99, 235],
        skyMid: [96, 165, 250],
        skyBot: [186, 230, 253],
        pinY: 420
      },
      {
        short: 'Masjid Raya',
        time: '10:00 WIB',
        title: 'Singgah Ibadah Masjid Pesisir',
        desc: 'Singgah salat & rehat sejenak menyusuri jalur pesisir timur Jawa Timur.',
        zoneType: 'masjid',
        photo: 'https://images.unsplash.com/photo-1564769625905-50e93615e769?auto=format&fit=crop&w=1400&q=80',
        thumb: 'https://images.unsplash.com/photo-1564769625905-50e93615e769?auto=format&fit=crop&w=300&q=80',
        skyTop: [29, 78, 216],
        skyMid: [56, 189, 248],
        skyBot: [186, 230, 253],
        pinY: 375
      },
      {
        short: 'RM Ketapang',
        time: '13:00 WIB',
        title: 'Singgah RM Pantai & Kapal Ferry',
        desc: 'Santap siang prasmanan tepi Selat Bali sebelum menyeberang ke Gilimanuk.',
        zoneType: 'rm',
        photo: 'https://images.unsplash.com/photo-1559339352-11d035aa65de?auto=format&fit=crop&w=1400&q=80',
        thumb: 'https://images.unsplash.com/photo-1559339352-11d035aa65de?auto=format&fit=crop&w=300&q=80',
        skyTop: [2, 132, 199],
        skyMid: [125, 211, 252],
        skyBot: [224, 242, 254],
        pinY: 430
      },
      {
        isCampus: true,
        short: 'Kampus UNUD',
        time: '15:00 WIB',
        title: 'Singgah Kampus / Studi Budaya',
        desc: 'Kunjungan opsional ke kampus di Bali sebelum lanjut eksplorasi wisata.',
        zoneType: 'kampus',
        photo: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=1400&q=80',
        thumb: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=300&q=80',
        skyTop: [59, 130, 246],
        skyMid: [147, 197, 253],
        skyBot: [219, 234, 254],
        pinY: 370
      },
      {
        short: 'Pura Dewata',
        time: '17:30 WIB',
        title: 'Tiba di Ulun Danu & Tanah Lot Bali!',
        desc: 'Menikmati senja keemasan Pura Ulun Danu Meru & makan malam Pantai Jimbaran.',
        zoneType: 'dest_bali',
        photo: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=1400&q=80',
        thumb: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=300&q=80',
        skyTop: [30, 58, 138],
        skyMid: [234, 88, 12],
        skyBot: [253, 186, 116],
        pinY: 395
      }
    ]
  }
};

export const TOUR_PACKAGES = [
  {
    id: 'pkg-jogja',
    cat: 'studytour',
    duration: '3 Hari 2 Malam',
    capacity: '45–200 Pax',
    title: 'Yogyakarta Heritage & Goes to Campus',
    price: 'Rp 820.000',
    destSelect: 'Yogyakarta & Kunjungan Kampus',
    hasCampus: true,
    chain: ['Sekolah', 'Masjid', 'RM Prasmanan', 'Kampus', 'Prambanan'],
    icons: ['🚌 Bus Dual TV', '🏨 Hotel *3', '🍽️ 7x Makan', '🎓 Izin Kampus'],
    img: 'https://images.unsplash.com/photo-1584810359583-96fc3448beaa?auto=format&fit=crop&w=900&q=80',
    inclusions: [
      'Armada Big Bus Full AC + Dual TV Karaoke',
      'Koordinasi Resmi Universitas Tujuan',
      'Singgah Masjid Agung & RM Prasmanan Halal',
      'Hotel Dekat Malioboro',
      'Tiket Candi Prambanan & HeHa Sky View',
      'Tour Leader & Dokumentasi'
    ],
    steps: [
      { tag: 'Titik 01', head: '06:30 WIB — Jemput di Gerbang Sekolah Gresik', text: 'Penataan bagasi koper siswa, pembagian snack pagi, apel pelepasan, dan doa keberangkatan.' },
      { tag: 'Titik 02 & 03', head: 'Singgah Ibadah Masjid Agung & RM Prasmanan Pendopo', text: 'Salat berjamaah nyaman dilanjutkan santap siang prasmanan hangat bersama seluruh rombongan.' },
      { tag: 'Titik 04', head: 'Kunjungan Kampus Impian (UGM / UNY Yogyakarta)', text: 'Sesi pengenalan akademik universitas, diskusi motivasi studi, dan foto angkatan.' },
      { tag: 'Titik 05', head: 'Candi Prambanan, Malioboro & Pusat Oleh-Oleh Bakpia', text: 'Rekreasi budaya sore hari, makan malam, check-in hotel, dan wisata belanja Malioboro.' }
    ]
  },
  {
    id: 'pkg-jakarta',
    cat: 'gathering',
    duration: '3 Hari 2 Malam',
    capacity: '40–150 Pax',
    title: 'Goes to Jakarta, Monas & PIK 2 Overland',
    price: 'Rp 950.000',
    destSelect: 'Goes to Jakarta & PIK 2 Overland',
    hasCampus: false,
    chain: ['Gresik', 'Masjid Tol', 'RM Pantura', 'Monas & PIK 2'],
    icons: ['🚌 Executive Bus', '🏨 Hotel *3/*4', '🍽️ Prasmanan', '📺 Karaoke'],
    img: 'https://images.unsplash.com/photo-1555899434-94d1368aa7af?auto=format&fit=crop&w=900&q=80',
    inclusions: [
      'Big Bus Pariwisata Dual TV Karaoke',
      'Tol Trans-Jawa PP',
      'Singgah Masjid Rest Area & RM Prasmanan',
      'Hotel Nyaman di Jakarta',
      'Spanduk Rombongan & Liputan Live Travel'
    ],
    steps: [
      { tag: 'Titik 01', head: '06:00 WIB — Keberangkatan Komunitas / Instansi dari Gresik', text: 'Penjemputan di titik kumpul Gresik dengan hiburan karaoke kabin bus yang hangat.' },
      { tag: 'Titik 02 & 03', head: 'Singgah Masjid Rest Area Heritage & RM Prasmanan', text: 'Jeda istirahat salat dan makan siang terjadwal ramah peserta dewasa maupun lansia.' },
      { tag: 'Titik 04', head: 'Acara Utama Jakarta, Masjid Istiqlal, Monas & Pantai PIK 2', text: 'Menghadiri agenda utama rombongan, keliling ikon Ibu Kota, hingga perjalanan pulang nyaman menuju Gresik.' }
    ]
  },
  {
    id: 'pkg-komodo',
    cat: 'bahari',
    duration: '3 Hari 2 Malam',
    capacity: '15–45 Pax',
    title: 'Komodo Island & Labuan Bajo Sailing Trip',
    price: 'Rp 3.450.000',
    destSelect: 'Komodo Island & Labuan Bajo',
    hasCampus: false,
    chain: ['Shuttle Gresik', 'Juanda', 'Kuliner Bajo', 'Kapal Phinisi', 'Pulau Padar'],
    icons: ['🚐 Shuttle Bandara', '⛵ Kapal Phinisi', '🤿 Snorkeling', '📸 Drone Doc'],
    img: 'https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?auto=format&fit=crop&w=900&q=80',
    inclusions: [
      'Antar-Jemput Gresik — Bandara Juanda PP',
      'Kapal Phinisi Kabin AC',
      'Makan Halal Lengkap di Kapal & Resto',
      'Alat Snorkeling & Tiket TN Komodo',
      'Pemandu Lokal & Dokumentasi Drone'
    ],
    steps: [
      { tag: 'Hari 01', head: 'Shuttle Rombongan Gresik ke Juanda — Tiba di Labuan Bajo', text: 'Penjemputan nyaman menuju bandara, tiba di Labuan Bajo, makan siang seafood halal & Bukit Sylvia.' },
      { tag: 'Hari 02', head: 'Sailing Pulau Padar, Pink Beach, Pulau Komodo & Manta Point', text: 'Eksplorasi penuh gugusan kepulauan ikonik Taman Nasional Komodo.' },
      { tag: 'Hari 03', head: 'Belanja Oleh-Oleh Khas NTT & Pengantaran Kembali ke Gresik', text: 'Kembali terbang ke Jawa Timur dan diantar langsung sampai titik awal di Gresik.' }
    ]
  },
  {
    id: 'pkg-malang-kampus',
    cat: 'studytour',
    duration: '1 Hari / 2H1M',
    capacity: '45–160 Pax',
    title: 'Goes to Campus Malang (UB/UM) & Jatim Park Batu',
    price: 'Rp 435.000',
    destSelect: 'Bromo Sunrise & Malang Batu',
    hasCampus: true,
    chain: ['Sekolah', 'Masjid Cheng Hoo', 'Kampus Malang', 'RM Batu', 'Jatim Park'],
    icons: ['🚌 Bus Terbaru', '🎓 Kampus UB/UM', '🍽️ Prasmanan', '🎡 Jatim Park'],
    img: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=900&q=80',
    inclusions: [
      'Armada Bus Pariwisata Full AC',
      'Singgah Masjid Cheng Hoo Pandaan',
      'Izin Kunjungan Kampus Malang',
      'Makan Siang Prasmanan & Snack',
      'Tiket Terusan Jatim Park / Museum Angkut'
    ],
    steps: [
      { tag: 'Pagi', head: 'Start Sekolah Gresik — Singgah Masjid Cheng Hoo Pandaan', text: 'Berangkat pagi, rehat salat dhuha dan foto bersama di Masjid Muhammad Cheng Hoo.' },
      { tag: 'Siang', head: 'Kunjungan Universitas di Malang & RM Prasmanan Kota Batu', text: 'Sesi pengenalan fakultas dilanjutkan makan siang sejuk di Kota Wisata Batu.' },
      { tag: 'Sore', head: 'Wisata Edukasi Jatim Park & Sentra Oleh-Oleh Khas Batu', text: 'Rekreasi sore dan belanja buah tangan sebelum pulang kembali ke Gresik.' }
    ]
  },
  {
    id: 'pkg-bali',
    cat: 'bahari',
    duration: '4 Hari 2 Malam',
    capacity: '35–120 Pax',
    title: 'Bali Overland: Ulun Danu, Tanah Lot & Jimbaran',
    price: 'Rp 1.650.000',
    destSelect: 'Bali Overland & Nusa Penida',
    hasCampus: false,
    chain: ['Gresik', 'Masjid Pesisir', 'RM Ketapang', 'Oleh-Oleh', 'Pantai Bali'],
    icons: ['🚌 Bus + Selimut', '⛴️ Ferry PP', '🏨 Hotel Bali', '🦞 Dinner Pantai'],
    img: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=900&q=80',
    inclusions: [
      'Bus Eksekutif Bantal & Selimut',
      'Tiket Kapal Ferry Ketapang–Gilimanuk PP',
      'Hotel Bintang 3/4 Area Kuta/Legian',
      'Makan Prasmanan Halal & Dinner Seafood Jimbaran',
      'Tour Leader Pendamping'
    ],
    steps: [
      { tag: 'Titik 01 & 02', head: 'Keberangkatan Gresik & Singgah Masjid Raya Pesisir', text: 'Perjalanan nyaman dari Gresik dengan jeda salat dan istirahat terjadwal.' },
      { tag: 'Titik 03', head: 'Makan Siang RM Tepi Pantai Ketapang & Penyebrangan Ferry', text: 'Santap siang menghadap Selat Bali lalu menyeberang menuju Pulau Dewata.' },
      { tag: 'Titik Akhir', head: 'Pura Ulun Danu Bedugul, Tanah Lot, Pantai Pandawa & Jimbaran', text: 'Menikmati panorama terbaik Bali lengkap wisata belanja oleh-oleh khas Dewata.' }
    ]
  },
  {
    id: 'pkg-bromo-ziarah',
    cat: 'gathering',
    duration: '1 Hari / 2H1M',
    capacity: '30–100 Pax',
    title: 'Sunrise Bromo Jeep 4x4 & Gathering Kota Batu',
    price: 'Rp 485.000',
    destSelect: 'Bromo Sunrise & Malang Batu',
    hasCampus: false,
    chain: ['Gresik', 'Transit Jeep', 'Sunrise Bromo', 'Masjid & RM', 'Wisata Batu'],
    icons: ['🚌 Bus PP', '🚙 Jeep 4x4', '🍽️ Makan & Snack', '📸 Foto Grup'],
    img: 'https://images.unsplash.com/photo-1588668214407-6ea9a6d8c272?auto=format&fit=crop&w=900&q=80',
    inclusions: [
      'Transportasi Bus Pariwisata PP dari Gresik',
      'Jeep Hardtop 4x4 Bromo Resmi',
      'Tiket Masuk Kawasan TNBTS',
      'Mushola Singgah & Makan Prasmanan Batu',
      'Dokumentasi Foto Komunitas'
    ],
    steps: [
      { tag: 'Dini Hari', head: 'Jemput Gresik — Transit Jeep 4x4 Menuju Penanjakan Bromo', text: 'Menyaksikan golden sunrise Bromo, salat subuh di mushola kawasan atas, lalu turun ke Kawah Bromo & Pasir Berbisik.' },
      { tag: 'Siang', head: 'Singgah Bersih Diri, Makan Prasmanan & Oleh-Oleh Kota Batu', text: 'Santap siang segar bersama rombongan dilanjutkan wisata belanja oleh-oleh sebelum kembali ke Gresik.' }
    ]
  }
];

export const REVIEWS = [
  {
    initials: 'KS',
    color: 'bg-blue-800',
    name: 'Drs. H. Bambang Sutrisno, M.Pd.',
    role: 'Kepala Sekolah SMA di Gresik',
    quote: '“Alur singgah salat, makan prasmanan & kampus sangat disiplin”',
    text: 'Mulai keberangkatan pagi di halaman sekolah, jadwal singgah ibadah salat di masjid agung, makan siang prasmanan bagi ratusan siswa hingga penerimaan kunjungan kampus dan wisata di Yogyakarta berjalan tertib dan aman.',
    route: 'Sekolah → Masjid → RM → Kampus → Jogja',
    fleet: '4 Big Bus'
  },
  {
    initials: 'LT',
    color: 'bg-[#EF3340]',
    name: 'Bpk. Hendra Wijaya',
    role: 'Panitia Rombongan Ling Tien Kung Indonesia',
    quote: '“Goes to Jakarta HUT ke-21 nyaman sampai pulang ke Gresik!”',
    text: 'Perjalanan tanggal 23–25 Oktober ke Jakarta sangat berkesan. Kru FAD Tour & Travel sangat perhatian mengatur titik istirahat bagi anggota senior kami, dan hiburan layar TV kabin membuat perjalanan pulang menuju Gresik penuh sukacita.',
    route: 'Gresik → Goes to Jakarta PP',
    fleet: '23–25 Oktober'
  },
  {
    initials: 'KK',
    color: 'bg-teal-700',
    name: 'Ibu Nabila Rahmawati, S.Pd.',
    role: 'Koordinator Kunjungan Kampus & BK',
    quote: '“Fleksibel menyusun rute universitas & objek wisata”',
    text: 'Sangat terbantu karena tim FAD mengerti kebutuhan rombongan edukasi. Kami bisa menyesuaikan jam tiba di rektorat kampus tujuan, memilih rumah makan prasmanan bersih, lalu lanjut rekreasi sore tanpa terburu-buru.',
    route: 'Goes to Campus Malang & Jogja',
    fleet: '150 Siswa'
  }
];

export const JOURNAL_POSTS = [
  {
    img: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=900&q=80',
    badge: '23–25 Oktober • LIVE TRAVEL',
    tag: 'Perjalanan Pulang Menuju Gresik',
    title: 'Goes to Jakarta — Ulang Tahun ke-21 Ling Tien Kung Indonesia',
    desc: 'Suasana hangat kabin bus berlayar TV ganda mengiringi rombongan pulang menuju Gresik usai sukses menghadiri perayaan akbar di Jakarta.'
  },
  {
    img: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=900&q=80',
    badge: 'Study Tour & Kampus',
    badgeSecondary: 'Gresik → Jogja',
    tag: 'Rombongan SMA & MA Gresik',
    title: 'Kunjungan Universitas Impian, Singgah Masjid Agung & Prambanan',
    desc: 'Rangkaian alur edukatif dari apel keberangkatan sekolah, salat berjamaah, makan prasmanan pendopo, hingga tur kampus dan wisata budaya.'
  },
  {
    img: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=900&q=80',
    badge: 'Gathering & Overland',
    badgeSecondary: 'Gresik → Bali',
    tag: 'Outing Instansi & Keluarga',
    title: 'Singgah RM Pantai Ketapang, Ulun Danu Bedugul & Sunset Jimbaran',
    desc: 'Jeda istirahat terukur di sepanjang pesisir Jawa Timur memastikan seluruh peserta tiba segar menikmati keindahan Pulau Bali.'
  }
];

