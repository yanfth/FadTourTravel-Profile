import React, { useState } from "react";

const FONT_IMPORT_ID = "fadtour-fonts";

function ensureFonts() {
  if (typeof document === "undefined") return;
  if (document.getElementById(FONT_IMPORT_ID)) return;
  const link = document.createElement("link");
  link.id = FONT_IMPORT_ID;
  link.rel = "stylesheet";
  link.href =
    "https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,400;0,9..144,600;1,9..144,500&family=Manrope:wght@400;500;700&display=swap";
  document.head.appendChild(link);
}

const PALETTE = {
  deep: "#0E3B43",
  deep2: "#123F49",
  coral: "#E8734A",
  gold: "#D9A441",
  sand: "#F7F3EA",
  sandDeep: "#EFE7D6",
  ink: "#12242A",
  mute: "#5B6E70",
  line: "#DAD2BE",
  blue: "#2F6FED",
  blueDeep: "#1E4FC4",
  blueTint: "#EAF0FE",
  paper: "#FFFFFF",
  page: "#F6F8FC",
};

function photo(query, w = 800, h = 600) {
  return `https://image.pollinations.ai/prompt/${encodeURIComponent(query)}?width=${w}&height=${h}&nologo=true`;
}

const NAV = [
  { key: "home", label: "Beranda" },
  { key: "about", label: "Tentang Kami" },
  { key: "packages", label: "Paket Wisata" },
  { key: "booking", label: "Booking" },
  { key: "contact", label: "Kontak" },
];

const DESTINATIONS = [
  {
    id: "raja-ampat",
    img: "raja ampat islands",
    name: "Raja Ampat",
    location: "Papua Barat",
    price: "Rp 8.500.000",
    rating: "4.9",
    days: "5 hari 4 malam",
    tag: "Populer",
    blurb:
      "Snorkeling dan diving di gugusan karang paling kaya di dunia, ditutup dengan senja di atas dermaga kayu.",
  },
  {
    id: "labuan-bajo",
    img: "labuan bajo komodo boat",
    name: "Labuan Bajo",
    location: "Nusa Tenggara Timur",
    price: "Rp 6.200.000",
    rating: "4.8",
    days: "4 hari 3 malam",
    tag: "Best Seller",
    blurb:
      "Berlayar menyusuri Taman Nasional Komodo, singgah di Pink Beach dan puncak Padar saat matahari terbit.",
  },
  {
    id: "bromo-ijen",
    img: "mount bromo sunrise",
    name: "Bromo & Ijen",
    location: "Jawa Timur",
    price: "Rp 3.100.000",
    rating: "4.7",
    days: "3 hari 2 malam",
    tag: "Petualangan",
    blurb:
      "Mendaki menembus kabut dini hari untuk menyaksikan blue fire dan lautan pasir Bromo dari kejauhan.",
  },
  {
    id: "toraja",
    img: "toraja traditional village",
    name: "Toraja",
    location: "Sulawesi Selatan",
    price: "Rp 4.700.000",
    rating: "4.8",
    days: "4 hari 3 malam",
    tag: "Budaya",
    blurb:
      "Menyusuri desa adat, tebing pekuburan kuno, dan tradisi yang masih hidup di dataran tinggi Toraja.",
  },
  {
    id: "belitung",
    img: "belitung island beach rocks",
    name: "Belitung",
    location: "Bangka Belitung",
    price: "Rp 3.900.000",
    rating: "4.6",
    days: "3 hari 2 malam",
    tag: "Pantai",
    blurb:
      "Island hopping di antara batu granit raksasa dan air laut sebening kaca di pesisir timur Sumatra.",
  },
  {
    id: "yogyakarta",
    img: "borobudur temple sunrise",
    name: "Yogyakarta",
    location: "DI Yogyakarta",
    price: "Rp 2.400.000",
    rating: "4.7",
    days: "3 hari 2 malam",
    tag: "Warisan",
    blurb:
      "Candi Borobudur saat fajar, Malioboro saat malam, dan kuliner yang menuntun ke setiap sudut kota.",
  },
];

function Icon({ name, size = 18, style }) {
  const common = {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.6,
    strokeLinecap: "round",
    strokeLinejoin: "round",
    style,
  };
  const paths = {
    compass: (
      <>
        <circle cx="12" cy="12" r="9" />
        <path d="M14.5 9.5 10 14l4.5-1.5L15 9z" />
      </>
    ),
    route: (
      <>
        <circle cx="5" cy="6" r="2" />
        <circle cx="19" cy="18" r="2" />
        <path d="M5 8v3a3 3 0 0 0 3 3h8a3 3 0 0 1 3 3" strokeDasharray="3 3" />
      </>
    ),
    star: <path d="M12 3l2.6 5.8 6.2.6-4.7 4.2 1.4 6.1L12 16.9 6.5 19.7l1.4-6.1L3.2 9.4l6.2-.6L12 3z" />,
    calendar: (
      <>
        <rect x="3.5" y="5" width="17" height="16" rx="2" />
        <path d="M3.5 9.5h17M8 3v4M16 3v4" />
      </>
    ),
    users: (
      <>
        <circle cx="9" cy="8" r="3" />
        <path d="M3.5 20c.8-3.4 3-5 5.5-5s4.7 1.6 5.5 5" />
        <circle cx="17" cy="9" r="2.3" />
        <path d="M20.7 19c-.5-2.6-1.9-4-3.7-4.4" />
      </>
    ),
    pin: (
      <>
        <path d="M12 21s7-6.3 7-11.5A7 7 0 0 0 5 9.5C5 14.7 12 21 12 21z" />
        <circle cx="12" cy="9.5" r="2.3" />
      </>
    ),
    check: <path d="M4 12.5l5 5L20 6" />,
    mail: (
      <>
        <rect x="3" y="5" width="18" height="14" rx="2" />
        <path d="M3.5 6.5 12 13l8.5-6.5" />
      </>
    ),
    phone: <path d="M6 3.5h3l1.5 4L8 9.2a12 12 0 0 0 6.8 6.8l1.7-2.5 4 1.5V18a2 2 0 0 1-2.1 2C11.5 19.6 4.4 12.5 4 5.6A2 2 0 0 1 6 3.5z" />,
    arrow: <path d="M4 12h15M13 6l6 6-6 6" />,
    menu: <path d="M4 6h16M4 12h16M4 18h16" />,
    close: <path d="M6 6l12 12M18 6 6 18" />,
    anchor: (
      <>
        <circle cx="12" cy="5" r="1.8" />
        <path d="M12 7v13M7 13H5a7 7 0 0 0 7 7 7 7 0 0 0 7-7h-2M8 13h8" />
      </>
    ),
  };
  return <svg {...common}>{paths[name]}</svg>;
}

function Header({ page, setPage }) {
  const [open, setOpen] = useState(false);
  return (
    <header
      style={{
        position: "sticky",
        top: 0,
        zIndex: 40,
        background: "rgba(255,255,255,0.92)",
        backdropFilter: "blur(6px)",
        borderBottom: `1px solid ${PALETTE.line}`,
      }}
    >
      <div
        style={{
          maxWidth: 1160,
          margin: "0 auto",
          padding: "16px 28px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <button
          onClick={() => setPage("home")}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            background: "none",
            border: "none",
            cursor: "pointer",
            padding: 0,
          }}
        >
          <span
            style={{
              width: 34,
              height: 34,
              borderRadius: "50%",
              background: PALETTE.blue,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#fff",
            }}
          >
            <Icon name="compass" size={18} />
          </span>
          <span
            style={{
              fontFamily: "'Fraunces', serif",
              fontWeight: 600,
              fontSize: 20,
              color: PALETTE.deep,
              letterSpacing: "-0.01em",
            }}
          >
            FADTOUR
          </span>
        </button>

        <nav
          style={{
            display: "flex",
            gap: 4,
          }}
          className="fd-desktop-nav"
        >
          {NAV.map((n) => (
            <button
              key={n.key}
              onClick={() => setPage(n.key)}
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                padding: "8px 14px",
                fontFamily: "'Manrope', sans-serif",
                fontSize: 14.5,
                color: page === n.key ? PALETTE.coral : PALETTE.ink,
                fontWeight: page === n.key ? 700 : 500,
                borderBottom: page === n.key ? `2px solid ${PALETTE.coral}` : "2px solid transparent",
              }}
            >
              {n.label}
            </button>
          ))}
        </nav>

        <button
          onClick={() => setPage("booking")}
          className="fd-desktop-nav"
          style={{
            background: PALETTE.blue,
            color: "#fff",
            border: "none",
            borderRadius: 999,
            padding: "10px 20px",
            fontFamily: "'Manrope', sans-serif",
            fontWeight: 700,
            fontSize: 14,
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: 6,
          }}
        >
          Mulai Perjalanan <Icon name="arrow" size={15} />
        </button>

        <button
          onClick={() => setOpen(!open)}
          className="fd-mobile-nav"
          style={{
            display: "none",
            background: "none",
            border: `1px solid ${PALETTE.line}`,
            borderRadius: 8,
            padding: 8,
            color: PALETTE.deep,
          }}
        >
          <Icon name={open ? "close" : "menu"} size={20} />
        </button>
      </div>

      {open && (
        <div
          className="fd-mobile-nav"
          style={{
            borderTop: `1px solid ${PALETTE.line}`,
            padding: "10px 28px 18px",
            display: "flex",
            flexDirection: "column",
            gap: 4,
          }}
        >
          {NAV.map((n) => (
            <button
              key={n.key}
              onClick={() => {
                setPage(n.key);
                setOpen(false);
              }}
              style={{
                textAlign: "left",
                background: "none",
                border: "none",
                padding: "10px 4px",
                fontFamily: "'Manrope', sans-serif",
                fontSize: 15,
                color: page === n.key ? PALETTE.coral : PALETTE.ink,
                fontWeight: page === n.key ? 700 : 500,
              }}
            >
              {n.label}
            </button>
          ))}
        </div>
      )}

      <style>{`
        @media (max-width: 800px) {
          .fd-desktop-nav { display: none !important; }
          .fd-mobile-nav { display: flex !important; }
        }
        @media (min-width: 801px) {
          .fd-mobile-nav { display: none !important; }
        }
      `}</style>
    </header>
  );
}

function Eyebrow({ children }) {
  return (
    <div
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 8,
        fontFamily: "'Manrope', sans-serif",
        fontSize: 12.5,
        fontWeight: 700,
        letterSpacing: "0.12em",
        textTransform: "uppercase",
        color: PALETTE.coral,
        marginBottom: 14,
      }}
    >
      <span style={{ width: 22, height: 1.5, background: PALETTE.coral, display: "inline-block" }} />
      {children}
    </div>
  );
}

function DestinationCard({ d, onSelect }) {
  return (
    <div
      style={{
        background: "#fff",
        borderRadius: 18,
        border: `1px solid ${PALETTE.line}`,
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <div
        style={{
          height: 150,
          position: "relative",
          backgroundImage: `linear-gradient(180deg, rgba(14,59,67,0) 45%, rgba(14,59,67,0.55) 100%), url(${photo(d.img)})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <span
          style={{
            position: "absolute",
            top: 12,
            left: 12,
            background: "rgba(255,255,255,0.95)",
            color: PALETTE.blueDeep,
            fontSize: 11.5,
            fontWeight: 700,
            padding: "4px 10px",
            borderRadius: 999,
            fontFamily: "'Manrope', sans-serif",
          }}
        >
          {d.tag}
        </span>
        <span
          style={{
            position: "absolute",
            top: 10,
            right: 10,
            width: 28,
            height: 28,
            borderRadius: "50%",
            background: "rgba(255,255,255,0.9)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: PALETTE.coral,
          }}
        >
          <Icon name="star" size={14} style={{ color: PALETTE.coral }} />
        </span>
        <span
          style={{
            position: "absolute",
            left: 14,
            bottom: 10,
            color: "#fff",
            fontFamily: "'Fraunces', serif",
            fontSize: 20,
            fontWeight: 600,
            textShadow: "0 1px 4px rgba(0,0,0,0.3)",
          }}
        >
          {d.name}
        </span>
      </div>
      <div style={{ padding: "16px 18px 18px", display: "flex", flexDirection: "column", gap: 10, flex: 1 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 6, color: PALETTE.mute, fontSize: 13 }}>
          <Icon name="pin" size={14} /> {d.location}
          <span style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 4, color: PALETTE.gold, fontWeight: 700 }}>
            <Icon name="star" size={13} style={{ color: PALETTE.gold }} /> {d.rating}
          </span>
        </div>
        <p style={{ margin: 0, fontSize: 13.5, color: PALETTE.mute, lineHeight: 1.6 }}>{d.blurb}</p>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginTop: "auto",
            paddingTop: 12,
            borderTop: `1px solid ${PALETTE.line}`,
          }}
        >
          <div>
            <div style={{ fontSize: 11.5, color: PALETTE.mute }}>{d.days}</div>
            <div style={{ fontFamily: "'Fraunces', serif", fontSize: 17, fontWeight: 600, color: PALETTE.deep }}>
              {d.price}
            </div>
          </div>
          <button
            onClick={() => onSelect(d)}
            style={{
              background: PALETTE.blue,
              color: "#fff",
              border: "none",
              borderRadius: 999,
              padding: "9px 16px",
              fontSize: 13,
              fontWeight: 700,
              cursor: "pointer",
              fontFamily: "'Manrope', sans-serif",
            }}
          >
            Pilih Paket
          </button>
        </div>
      </div>
    </div>
  );
}

function SearchBar({ setPage }) {
  const fieldStyle = {
    display: "flex",
    flexDirection: "column",
    gap: 2,
    padding: "6px 20px",
    flex: 1,
    minWidth: 130,
  };
  const iconWrap = { display: "flex", alignItems: "center", gap: 8 };
  return (
    <div
      style={{
        background: "#fff",
        boxShadow: "0 18px 40px rgba(20,40,90,0.12)",
        border: `1px solid ${PALETTE.line}`,
        display: "flex",
        alignItems: "stretch",
        padding: "6px",
        gap: 0,
        flexWrap: "wrap",
      }}
      className="fd-search-bar"
    >
      <div style={fieldStyle} className="fd-search-field">
        <span style={{ ...iconWrap, fontSize: 11.5, fontWeight: 700, color: PALETTE.mute }}>
          <Icon name="pin" size={13} style={{ color: PALETTE.blue }} /> Mau kemana?
        </span>
        <span style={{ fontSize: 13.5, color: PALETTE.ink, fontWeight: 600 }}>Cari destinasi</span>
      </div>
      <div style={{ width: 1, background: PALETTE.line, margin: "8px 0" }} className="fd-search-divider" />
      <div style={fieldStyle} className="fd-search-field">
        <span style={{ ...iconWrap, fontSize: 11.5, fontWeight: 700, color: PALETTE.mute }}>
          <Icon name="calendar" size={13} style={{ color: PALETTE.blue }} /> Berangkat
        </span>
        <span style={{ fontSize: 13.5, color: PALETTE.ink, fontWeight: 600 }}>Tambah tanggal</span>
      </div>
      <div style={{ width: 1, background: PALETTE.line, margin: "8px 0" }} className="fd-search-divider" />
      <div style={fieldStyle} className="fd-search-field">
        <span style={{ ...iconWrap, fontSize: 11.5, fontWeight: 700, color: PALETTE.mute }}>
          <Icon name="calendar" size={13} style={{ color: PALETTE.blue }} /> Pulang
        </span>
        <span style={{ fontSize: 13.5, color: PALETTE.ink, fontWeight: 600 }}>Tambah tanggal</span>
      </div>
      <div style={{ width: 1, background: PALETTE.line, margin: "8px 0" }} className="fd-search-divider" />
      <div style={fieldStyle} className="fd-search-field">
        <span style={{ ...iconWrap, fontSize: 11.5, fontWeight: 700, color: PALETTE.mute }}>
          <Icon name="users" size={13} style={{ color: PALETTE.blue }} /> Peserta
        </span>
        <span style={{ fontSize: 13.5, color: PALETTE.ink, fontWeight: 600 }}>2 orang</span>
      </div>
      <button
        onClick={() => setPage("booking")}
        aria-label="Cari"
        style={{
          background: PALETTE.blue,
          border: "none",
          borderRadius: "50%",
          width: 46,
          height: 46,
          flexShrink: 0,
          margin: 4,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer",
          color: "#fff",
        }}
      >
        <Icon name="route" size={19} />
      </button>
      <style>{`
        .fd-search-bar { border-radius: 999px; }
        @media (max-width: 720px) {
          .fd-search-divider { display: none; }
          .fd-search-bar { border-radius: 24px; justify-content: center; padding: 12px; gap: 12px; }
          .fd-search-field { min-width: 100% !important; padding: 8px 12px !important; }
        }
      `}</style>
    </div>
  );
}

function HomePage({ setPage, goToBooking }) {
  return (
    <>
      <section
        style={{
          position: "relative",
          overflow: "visible",
          background: PALETTE.page,
          padding: "44px 28px 0",
        }}
      >
        <div
          style={{
            maxWidth: 1160,
            margin: "0 auto",
            background: PALETTE.blueTint,
            borderRadius: 32,
            padding: "48px 40px 90px",
            display: "grid",
            gridTemplateColumns: "1fr 1.05fr",
            gap: 36,
            alignItems: "center",
            position: "relative",
          }}
          className="fd-hero-grid"
        >
          <div>
            <Eyebrow>Jelajahi. Impikan. Rasakan.</Eyebrow>
            <h1
              style={{
                fontFamily: "'Fraunces', serif",
                fontWeight: 600,
                fontSize: "clamp(32px, 4.6vw, 50px)",
                lineHeight: 1.1,
                color: PALETTE.deep,
                margin: "0 0 18px",
              }}
            >
              Dunia ini <span style={{ fontStyle: "italic", color: PALETTE.blue }}>milikmu.</span>
            </h1>
            <p style={{ color: PALETTE.mute, fontSize: 15.5, lineHeight: 1.7, maxWidth: 400, margin: "0 0 28px" }}>
              Temukan destinasi terbaik di nusantara, hal seru untuk dilakukan, dan pengalaman tak terlupakan
              bersama FADTOUR.
            </p>
            <button
              onClick={() => setPage("packages")}
              style={{
                background: PALETTE.blue,
                color: "#fff",
                border: "none",
                borderRadius: 999,
                padding: "13px 26px",
                fontWeight: 700,
                fontSize: 14.5,
                cursor: "pointer",
                fontFamily: "'Manrope', sans-serif",
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
              }}
            >
              Mulai Jelajah <Icon name="arrow" size={16} />
            </button>

            <div style={{ display: "flex", gap: 30, marginTop: 40, flexWrap: "wrap" }}>
              {[
                ["120+", "Destinasi"],
                ["8.6k", "Wisatawan"],
                ["4.8", "Rating"],
              ].map(([n, l]) => (
                <div key={l}>
                  <div style={{ fontFamily: "'Fraunces', serif", fontSize: 24, color: PALETTE.deep, fontWeight: 600 }}>
                    {n}
                  </div>
                  <div style={{ fontSize: 12, color: PALETTE.mute }}>{l}</div>
                </div>
              ))}
            </div>
          </div>

          <div style={{ position: "relative" }}>
            <div
              style={{
                borderRadius: 26,
                overflow: "hidden",
                height: 360,
                backgroundImage: `url(${photo("santorini sunset coast", 900, 700)})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            />
            <div
              style={{
                position: "absolute",
                top: 18,
                right: -14,
                background: "#fff",
                borderRadius: 16,
                padding: "10px 14px",
                boxShadow: "0 12px 28px rgba(20,40,90,0.16)",
                display: "flex",
                alignItems: "center",
                gap: 10,
              }}
              className="fd-hero-badge"
            >
              <div
                style={{
                  width: 34,
                  height: 34,
                  borderRadius: "50%",
                  background: PALETTE.blueTint,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: PALETTE.blue,
                }}
              >
                <Icon name="users" size={16} />
              </div>
              <div>
                <div style={{ fontSize: 12.5, fontWeight: 700, color: PALETTE.deep }}>Wisatawan senang</div>
                <div style={{ fontSize: 11, color: PALETTE.mute }}>+2.1k bulan ini</div>
              </div>
            </div>
          </div>
        </div>

        <div
          style={{
            maxWidth: 980,
            margin: "0 auto",
            padding: "0 28px",
            position: "relative",
            top: -34,
          }}
        >
          <SearchBar setPage={setPage} />
        </div>

        <style>{`
          @media (max-width: 860px) {
            .fd-hero-grid { grid-template-columns: 1fr !important; padding-bottom: 40px !important; }
            .fd-hero-badge { display: none !important; }
          }
        `}</style>
      </section>

      <section style={{ padding: "34px 28px 70px", maxWidth: 1160, margin: "0 auto" }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "0.62fr 1.38fr",
            gap: 22,
            alignItems: "stretch",
          }}
          className="fd-featured-grid"
        >
          <div
            style={{
              borderRadius: 20,
              background: `linear-gradient(150deg, ${PALETTE.blueDeep}, ${PALETTE.blue})`,
              padding: 26,
              color: "#fff",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              minHeight: 220,
            }}
          >
            <div>
              <div style={{ fontSize: 11.5, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", opacity: 0.8 }}>
                Penawaran terbatas
              </div>
              <h3 style={{ fontFamily: "'Fraunces', serif", fontSize: 26, margin: "10px 0 0", lineHeight: 1.2 }}>
                Diskon hingga 30% untuk destinasi pilihan
              </h3>
            </div>
            <button
              onClick={() => setPage("packages")}
              style={{
                marginTop: 20,
                alignSelf: "flex-start",
                background: "#fff",
                color: PALETTE.blueDeep,
                border: "none",
                borderRadius: 999,
                padding: "10px 20px",
                fontWeight: 700,
                fontSize: 13.5,
                cursor: "pointer",
                fontFamily: "'Manrope', sans-serif",
              }}
            >
              Lihat penawaran
            </button>
          </div>

          <div>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
              <h2 style={{ fontFamily: "'Fraunces', serif", fontSize: 22, color: PALETTE.deep, margin: 0 }}>
                Destinasi unggulan
              </h2>
              <button
                onClick={() => setPage("packages")}
                style={{
                  background: "none",
                  border: "none",
                  color: PALETTE.blue,
                  fontWeight: 700,
                  fontSize: 13,
                  cursor: "pointer",
                  fontFamily: "'Manrope', sans-serif",
                }}
              >
                Lihat semua
              </button>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }} className="fd-featured-cards">
              {DESTINATIONS.slice(0, 3).map((d) => (
                <div key={d.id} onClick={() => goToBooking(d)} style={{ cursor: "pointer" }}>
                  <div
                    style={{
                      height: 100,
                      borderRadius: 14,
                      backgroundImage: `url(${photo(d.img, 400, 300)})`,
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                      marginBottom: 8,
                    }}
                  />
                  <div style={{ fontSize: 13.5, fontWeight: 700, color: PALETTE.deep }}>{d.name}</div>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: PALETTE.mute }}>
                    <span>Mulai {d.price}</span>
                    <span style={{ color: PALETTE.gold, fontWeight: 700 }}>★ {d.rating}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <style>{`
          @media (max-width: 860px) {
            .fd-featured-grid { grid-template-columns: 1fr !important; }
            .fd-featured-cards { grid-template-columns: 1fr 1fr !important; }
          }
          @media (max-width: 480px) {
            .fd-featured-cards { grid-template-columns: 1fr !important; }
          }
        `}</style>
      </section>

      <section style={{ background: "#fff", padding: "70px 28px", borderTop: `1px solid ${PALETTE.line}` }}>
        <div style={{ maxWidth: 1160, margin: "0 auto" }}>
          <Eyebrow>Kenapa fadtour</Eyebrow>
          <h2 style={{ fontFamily: "'Fraunces', serif", fontSize: 32, color: PALETTE.deep, margin: "0 0 34px", maxWidth: 520 }}>
            Kami urus logistiknya, kamu nikmati perjalanannya.
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 24 }} className="fd-grid-3">
            {[
              ["anchor", "Pemandu lokal", "Setiap trip didampingi pemandu yang lahir dan besar di destinasi tersebut."],
              ["calendar", "Itinerary fleksibel", "Ubah tanggal atau rute kapan saja hingga H-7 tanpa biaya tambahan."],
              ["users", "Grup kecil", "Maksimal 12 orang per grup supaya perjalanan tetap personal dan nyaman."],
            ].map(([icon, title, desc]) => (
              <div key={title} style={{ background: PALETTE.blueTint, borderRadius: 16, padding: 24 }}>
                <div
                  style={{
                    width: 42,
                    height: 42,
                    borderRadius: 12,
                    background: PALETTE.blue,
                    color: "#fff",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    marginBottom: 16,
                  }}
                >
                  <Icon name={icon} size={20} />
                </div>
                <h3 style={{ fontFamily: "'Fraunces', serif", fontSize: 18, color: PALETTE.deep, margin: "0 0 8px" }}>
                  {title}
                </h3>
                <p style={{ fontSize: 13.5, color: PALETTE.mute, lineHeight: 1.6, margin: 0 }}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section style={{ padding: "70px 28px", maxWidth: 900, margin: "0 auto", textAlign: "center" }}>
        <div
          style={{
            width: 56,
            height: 56,
            borderRadius: "50%",
            margin: "0 auto 18px",
            backgroundImage: `url(${photo("smiling woman portrait", 200, 200)})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            border: `2px solid ${PALETTE.blueTint}`,
          }}
        />
        <h2 style={{ fontFamily: "'Fraunces', serif", fontStyle: "italic", fontSize: 26, color: PALETTE.deep, lineHeight: 1.5, margin: "0 0 20px" }}>
          "Perjalanan ke Labuan Bajo bersama FADTOUR terasa seperti dipandu teman lama yang kebetulan tahu semua
          tempat terbaik."
        </h2>
        <div style={{ fontSize: 13.5, color: PALETTE.mute, fontFamily: "'Manrope', sans-serif", fontWeight: 600 }}>
          — Nadia R., wisatawan Jakarta
        </div>
      </section>

      <style>{`
        @media (max-width: 860px) {
          .fd-grid-3 { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </>
  );
}

function AboutPage() {
  return (
    <div style={{ maxWidth: 1160, margin: "0 auto", padding: "60px 28px 90px" }}>
      <Eyebrow>Tentang kami</Eyebrow>
      <h1 style={{ fontFamily: "'Fraunces', serif", fontSize: "clamp(30px, 4vw, 44px)", color: PALETTE.deep, margin: "0 0 20px", maxWidth: 640 }}>
        Dari kantor kecil di Gresik, menuju setiap sudut nusantara.
      </h1>
      <p style={{ fontSize: 15.5, color: PALETTE.mute, lineHeight: 1.8, maxWidth: 640, marginBottom: 32 }}>
        FADTOUR berdiri dari kecintaan pada perjalanan darat dan laut Indonesia. Kami percaya setiap daerah punya
        keunikan yang layak dialami langsung, bukan sekadar dilihat dari jauh — karena itu setiap paket kami
        disusun bersama pemandu dan komunitas lokal di destinasi masing-masing.
      </p>

      <div
        style={{
          height: 280,
          borderRadius: 24,
          marginBottom: 40,
          backgroundImage: `url(${photo("indonesia travel guide group", 1200, 500)})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />

      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20, marginBottom: 56 }} className="fd-grid-3">
        {[
          ["2016", "Tahun berdiri"],
          ["120+", "Destinasi dikelola"],
          ["35", "Pemandu lokal mitra"],
        ].map(([n, l]) => (
          <div key={l} style={{ background: PALETTE.blueTint, borderRadius: 16, padding: "26px 22px" }}>
            <div style={{ fontFamily: "'Fraunces', serif", fontSize: 30, color: PALETTE.blue, fontWeight: 600 }}>{n}</div>
            <div style={{ fontSize: 13, color: PALETTE.mute, marginTop: 4 }}>{l}</div>
          </div>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 40 }} className="fd-hero-grid-about">
        <div>
          <h2 style={{ fontFamily: "'Fraunces', serif", fontSize: 24, color: PALETTE.deep, margin: "0 0 14px" }}>Misi kami</h2>
          <p style={{ fontSize: 14.5, color: PALETTE.mute, lineHeight: 1.75 }}>
            Membuka akses wisata yang bertanggung jawab ke daerah-daerah yang sering terlewat oleh jalur turis
            biasa, sambil memastikan pendapatan wisata dirasakan langsung oleh komunitas setempat.
          </p>
        </div>
        <div>
          <h2 style={{ fontFamily: "'Fraunces', serif", fontSize: 24, color: PALETTE.deep, margin: "0 0 14px" }}>Cara kami bekerja</h2>
          <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 12 }}>
            {[
              "Survei langsung setiap rute sebelum dijual ke publik",
              "Kerja sama jangka panjang dengan pemandu dan penginapan lokal",
              "Grup kecil untuk menjaga kualitas dan kenyamanan",
            ].map((t) => (
              <li key={t} style={{ display: "flex", gap: 10, fontSize: 14, color: PALETTE.ink }}>
                <Icon name="check" size={16} style={{ color: PALETTE.coral, flexShrink: 0, marginTop: 3 }} />
                {t}
              </li>
            ))}
          </ul>
        </div>
      </div>
      <style>{`
        @media (max-width: 700px) {
          .fd-grid-3 { grid-template-columns: 1fr !important; }
          .fd-hero-grid-about { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}

function PackagesPage({ goToBooking }) {
  return (
    <div style={{ maxWidth: 1160, margin: "0 auto", padding: "60px 28px 90px" }}>
      <Eyebrow>Paket wisata</Eyebrow>
      <h1 style={{ fontFamily: "'Fraunces', serif", fontSize: "clamp(28px, 4vw, 40px)", color: PALETTE.deep, margin: "0 0 12px" }}>
        Enam rute favorit tamu FADTOUR.
      </h1>
      <p style={{ fontSize: 14.5, color: PALETTE.mute, maxWidth: 560, marginBottom: 36 }}>
        Semua harga sudah termasuk akomodasi, transportasi lokal, dan pemandu. Tinggal pilih rute, sesuaikan
        tanggal di halaman booking.
      </p>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 22 }} className="fd-grid-3">
        {DESTINATIONS.map((d) => (
          <DestinationCard key={d.id} d={d} onSelect={goToBooking} />
        ))}
      </div>
      <style>{`
        @media (max-width: 860px) {
          .fd-grid-3 { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}

function BookingPage({ presetDestination }) {
  const [form, setForm] = useState({
    destination: presetDestination || "",
    name: "",
    date: "",
    guests: "2",
    notes: "",
  });
  const [submitted, setSubmitted] = useState(false);

  React.useEffect(() => {
    if (presetDestination) {
      setForm((f) => ({ ...f, destination: presetDestination }));
    }
  }, [presetDestination]);

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const inputStyle = {
    width: "100%",
    boxSizing: "border-box",
    padding: "12px 14px",
    borderRadius: 10,
    border: `1px solid ${PALETTE.line}`,
    fontSize: 14.5,
    fontFamily: "'Manrope', sans-serif",
    color: PALETTE.ink,
    background: "#fff",
  };
  const labelStyle = {
    fontSize: 12.5,
    fontWeight: 700,
    color: PALETTE.deep,
    marginBottom: 6,
    display: "block",
    fontFamily: "'Manrope', sans-serif",
  };

  return (
    <div style={{ maxWidth: 780, margin: "0 auto", padding: "60px 28px 90px" }}>
      <Eyebrow>Booking</Eyebrow>
      <h1 style={{ fontFamily: "'Fraunces', serif", fontSize: "clamp(28px, 4vw, 38px)", color: PALETTE.deep, margin: "0 0 12px" }}>
        Rencanakan perjalananmu.
      </h1>
      <p style={{ fontSize: 14.5, color: PALETTE.mute, marginBottom: 32 }}>
        Isi detail di bawah, tim kami akan menghubungimu dalam 1x24 jam untuk konfirmasi ketersediaan dan
        pembayaran.
      </p>

      {submitted ? (
        <div
          style={{
            background: PALETTE.sandDeep,
            borderRadius: 16,
            padding: 32,
            textAlign: "center",
          }}
        >
          <Icon name="check" size={30} style={{ color: PALETTE.coral, marginBottom: 12 }} />
          <h2 style={{ fontFamily: "'Fraunces', serif", fontSize: 22, color: PALETTE.deep, margin: "0 0 8px" }}>
            Permintaan booking terkirim
          </h2>
          <p style={{ fontSize: 14, color: PALETTE.mute, margin: 0 }}>
            Terima kasih, {form.name || "calon petualang"}. Kami akan menghubungi lewat kontak yang kamu berikan
            untuk paket {form.destination || "pilihanmu"}.
          </p>
          <button
            onClick={() => setSubmitted(false)}
            style={{
              marginTop: 20,
              background: "none",
              border: `1px solid ${PALETTE.line}`,
              borderRadius: 999,
              padding: "10px 20px",
              fontWeight: 700,
              fontSize: 13.5,
              color: PALETTE.deep,
              cursor: "pointer",
              fontFamily: "'Manrope', sans-serif",
            }}
          >
            Ajukan booking lain
          </button>
        </div>
      ) : (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            setSubmitted(true);
          }}
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 18,
            background: "#fff",
            border: `1px solid ${PALETTE.line}`,
            borderRadius: 18,
            padding: 28,
          }}
        >
          <div>
            <label style={labelStyle}>Destinasi</label>
            <select style={inputStyle} value={form.destination} onChange={set("destination")} required>
              <option value="" disabled>
                Pilih destinasi
              </option>
              {DESTINATIONS.map((d) => (
                <option key={d.id} value={d.name}>
                  {d.name} — {d.price}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label style={labelStyle}>Nama lengkap</label>
            <input style={inputStyle} value={form.name} onChange={set("name")} placeholder="Nama sesuai KTP" required />
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }} className="fd-form-grid">
            <div>
              <label style={labelStyle}>Tanggal berangkat</label>
              <input type="date" style={inputStyle} value={form.date} onChange={set("date")} required />
            </div>
            <div>
              <label style={labelStyle}>Jumlah peserta</label>
              <input type="number" min="1" max="12" style={inputStyle} value={form.guests} onChange={set("guests")} />
            </div>
          </div>
          <div>
            <label style={labelStyle}>Catatan tambahan</label>
            <textarea
              style={{ ...inputStyle, minHeight: 90, resize: "vertical" }}
              value={form.notes}
              onChange={set("notes")}
              placeholder="Preferensi kamar, kebutuhan khusus, dll (opsional)"
            />
          </div>
          <button
            type="submit"
            style={{
              background: PALETTE.coral,
              color: "#fff",
              border: "none",
              borderRadius: 999,
              padding: "13px 0",
              fontWeight: 700,
              fontSize: 15,
              cursor: "pointer",
              fontFamily: "'Manrope', sans-serif",
            }}
          >
            Kirim Permintaan Booking
          </button>
        </form>
      )}
      <style>{`
        @media (max-width: 560px) {
          .fd-form-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}

function ContactPage() {
  const [sent, setSent] = useState(false);
  const inputStyle = {
    width: "100%",
    boxSizing: "border-box",
    padding: "12px 14px",
    borderRadius: 10,
    border: `1px solid ${PALETTE.line}`,
    fontSize: 14.5,
    fontFamily: "'Manrope', sans-serif",
    background: "#fff",
    color: PALETTE.ink,
  };
  const labelStyle = {
    fontSize: 12.5,
    fontWeight: 700,
    color: PALETTE.deep,
    marginBottom: 6,
    display: "block",
    fontFamily: "'Manrope', sans-serif",
  };

  return (
    <div style={{ maxWidth: 1160, margin: "0 auto", padding: "60px 28px 90px" }}>
      <Eyebrow>Kontak</Eyebrow>
      <h1 style={{ fontFamily: "'Fraunces', serif", fontSize: "clamp(28px, 4vw, 40px)", color: PALETTE.deep, margin: "0 0 12px" }}>
        Ada pertanyaan sebelum berangkat?
      </h1>
      <p style={{ fontSize: 14.5, color: PALETTE.mute, maxWidth: 560, marginBottom: 40 }}>
        Tim FADTOUR siap membantu dari Senin sampai Sabtu, pukul 09.00–18.00 WIB.
      </p>

      <div style={{ display: "grid", gridTemplateColumns: "0.9fr 1.1fr", gap: 40 }} className="fd-hero-grid-about">
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <div
            style={{
              height: 160,
              borderRadius: 18,
              backgroundImage: `url(${photo("travel agency office desk", 700, 400)})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          />
          {[
            ["mail", "Email", "halo@fadtour.id"],
            ["phone", "Telepon / WhatsApp", "+62 812-3456-7890"],
            ["pin", "Kantor", "Jl. Veteran No. 12, Gresik, Jawa Timur"],
          ].map(([icon, label, val]) => (
            <div key={label} style={{ display: "flex", gap: 14, alignItems: "flex-start" }}>
              <div
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 10,
                  background: PALETTE.blueTint,
                  color: PALETTE.blue,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                <Icon name={icon} size={18} />
              </div>
              <div>
                <div style={{ fontSize: 12.5, color: PALETTE.mute, fontWeight: 600 }}>{label}</div>
                <div style={{ fontSize: 15, color: PALETTE.ink, fontFamily: "'Manrope', sans-serif" }}>{val}</div>
              </div>
            </div>
          ))}
        </div>

        {sent ? (
          <div
            style={{
              background: PALETTE.sandDeep,
              borderRadius: 16,
              padding: 32,
              textAlign: "center",
              alignSelf: "start",
            }}
          >
            <Icon name="check" size={28} style={{ color: PALETTE.coral, marginBottom: 10 }} />
            <h2 style={{ fontFamily: "'Fraunces', serif", fontSize: 20, color: PALETTE.deep, margin: "0 0 6px" }}>
              Pesan terkirim
            </h2>
            <p style={{ fontSize: 13.5, color: PALETTE.mute, margin: 0 }}>Kami akan membalas secepatnya.</p>
          </div>
        ) : (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              setSent(true);
            }}
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 16,
              background: "#fff",
              border: `1px solid ${PALETTE.line}`,
              borderRadius: 18,
              padding: 26,
            }}
          >
            <div>
              <label style={labelStyle}>Nama</label>
              <input style={inputStyle} placeholder="Nama kamu" required />
            </div>
            <div>
              <label style={labelStyle}>Email</label>
              <input type="email" style={inputStyle} placeholder="nama@email.com" required />
            </div>
            <div>
              <label style={labelStyle}>Pesan</label>
              <textarea style={{ ...inputStyle, minHeight: 110, resize: "vertical" }} placeholder="Tulis pertanyaanmu di sini" required />
            </div>
            <button
              type="submit"
              style={{
                background: PALETTE.deep,
                color: PALETTE.sand,
                border: "none",
                borderRadius: 999,
                padding: "13px 0",
                fontWeight: 700,
                fontSize: 15,
                cursor: "pointer",
                fontFamily: "'Manrope', sans-serif",
              }}
            >
              Kirim Pesan
            </button>
          </form>
        )}
      </div>
      <style>{`
        @media (max-width: 700px) {
          .fd-hero-grid-about { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}

function Footer({ setPage }) {
  return (
    <footer style={{ background: PALETTE.deep, padding: "48px 28px 28px", color: "#B7C8C8" }}>
      <div
        style={{
          maxWidth: 1160,
          margin: "0 auto",
          display: "flex",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: 32,
        }}
      >
        <div style={{ maxWidth: 300 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
            <Icon name="compass" size={18} style={{ color: PALETTE.gold }} />
            <span style={{ fontFamily: "'Fraunces', serif", fontSize: 18, color: PALETTE.sand, fontWeight: 600 }}>
              FADTOUR
            </span>
          </div>
          <p style={{ fontSize: 13, lineHeight: 1.7, margin: 0 }}>
            Biro perjalanan wisata yang merancang trip ke seluruh penjuru Indonesia dengan pemandu lokal terpercaya.
          </p>
        </div>
        <div style={{ display: "flex", gap: 56, flexWrap: "wrap" }}>
          <div>
            <div style={{ fontSize: 12.5, fontWeight: 700, color: PALETTE.sand, marginBottom: 12 }}>Navigasi</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {NAV.map((n) => (
                <button
                  key={n.key}
                  onClick={() => setPage(n.key)}
                  style={{ background: "none", border: "none", color: "#B7C8C8", fontSize: 13, textAlign: "left", cursor: "pointer", padding: 0 }}
                >
                  {n.label}
                </button>
              ))}
            </div>
          </div>
          <div>
            <div style={{ fontSize: 12.5, fontWeight: 700, color: PALETTE.sand, marginBottom: 12 }}>Kontak</div>
            <div style={{ fontSize: 13, lineHeight: 2 }}>
              halo@fadtour.id
              <br />
              +62 812-3456-7890
              <br />
              Gresik, Jawa Timur
            </div>
          </div>
        </div>
      </div>
      <div
        style={{
          maxWidth: 1160,
          margin: "32px auto 0",
          paddingTop: 20,
          borderTop: "1px solid rgba(183,200,200,0.15)",
          fontSize: 12,
          color: "#7F9494",
        }}
      >
        © 2026 FADTOUR. Seluruh hak cipta dilindungi.
      </div>
    </footer>
  );
}

export default function FadtourApp() {
  ensureFonts();
  const [page, setPage] = useState("home");
  const [presetDestination, setPresetDestination] = useState("");

  const goToBooking = (destination) => {
    setPresetDestination(destination ? destination.name : "");
    setPage("booking");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const changePage = (p) => {
    setPage(p);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div style={{ fontFamily: "'Manrope', sans-serif", background: PALETTE.page, color: PALETTE.ink, minHeight: "100vh" }}>
      <Header page={page} setPage={changePage} />
      {page === "home" && <HomePage setPage={changePage} goToBooking={goToBooking} />}
      {page === "about" && <AboutPage />}
      {page === "packages" && <PackagesPage goToBooking={goToBooking} />}
      {page === "booking" && <BookingPage presetDestination={presetDestination} />}
      {page === "contact" && <ContactPage />}
      <Footer setPage={changePage} />
    </div>
  );
}