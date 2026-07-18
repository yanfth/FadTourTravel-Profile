import React, { useState, useEffect, useRef } from "react";

export function useScrollReveal() {
  const ref = useRef(null);
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );
    if (ref.current) {
      observer.observe(ref.current);
    }
    return () => observer.disconnect();
  }, []);
  return ref;
}

export function FadeUp({ children, style, className = "", id }) {
  const ref = useScrollReveal();
  return (
    <div ref={ref} id={id} className={`fade-up ${className}`} style={style}>
      {children}
    </div>
  );
}

const FONT_IMPORT_ID = "fadtour-fonts";

function ensureFonts() {
  if (typeof document === "undefined") return;
  if (document.getElementById(FONT_IMPORT_ID)) return;
  const link = document.createElement("link");
  link.id = FONT_IMPORT_ID;
  link.rel = "stylesheet";
  link.href =
    "https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400;1,600&family=Inter:wght@400;500;600;700&display=swap";
  document.head.appendChild(link);
}

const P = {
  primary: "#294350",
  primaryDark: "#1D313B",
  primaryLight: "#E3E9EC",
  accent: "#F97A32",
  dark: "#090909",
  darkSoft: "#294350",
  text: "#1D313B",
  textLight: "#5A6D77",
  border: "#DCE1E3",
  bg: "#FFFFFF",
  bgSoft: "#EFEFF0",
  bgPage: "#EFEFF0",
  success: "#10B981",
  coral: "#F97A32",
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
    img: "raja ampat islands turquoise water aerial view",
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
    img: "labuan bajo komodo boat sailing",
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
    img: "mount bromo sunrise volcanic landscape",
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
    img: "toraja traditional village tongkonan",
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
    img: "belitung island beach granite rocks crystal water",
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
    img: "borobudur temple sunrise fog",
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

const CATEGORIES = [
  { label: "Gunung", img: "mountain landscape photography" },
  { label: "Pantai", img: "tropical beach crystal water" },
  { label: "Budaya", img: "indonesian cultural temple" },
  { label: "Petualangan", img: "adventure hiking trail" },
  { label: "Kota", img: "modern city skyline night" },
  { label: "Alam", img: "beautiful nature waterfall tropical" },
];

/* ─── Icon ─── */
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
    search: (
      <>
        <circle cx="11" cy="11" r="7" />
        <path d="M21 21l-4.3-4.3" />
      </>
    ),
    quote: <path d="M10 8H6a2 2 0 0 0-2 2v2a2 2 0 0 0 2 2h2l-2 4M20 8h-4a2 2 0 0 0-2 2v2a2 2 0 0 0 2 2h2l-2 4" />,
    car: (
      <>
        <path d="M5 17h14v-5l-2-5H7l-2 5v5z" />
        <circle cx="7.5" cy="17" r="1.5" />
        <circle cx="16.5" cy="17" r="1.5" />
      </>
    ),
    hotel: (
      <>
        <path d="M3 21V7l9-4 9 4v14" />
        <rect x="9" y="13" width="6" height="8" rx="1" />
        <path d="M9 9h6" />
      </>
    ),
  };
  return <svg {...common}>{paths[name]}</svg>;
}

/* ─── Section Title ─── */
function SectionTitle({ children, sub }) {
  return (
    <FadeUp>
      <div style={{ marginBottom: 40 }}>
        <h2
          style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: "clamp(26px, 3.5vw, 36px)",
            fontWeight: 700,
            color: P.dark,
            margin: 0,
            display: "flex",
            alignItems: "center",
            gap: 16,
          }}
        >
          {children}
          <span
            style={{
              flex: 1,
              height: 2,
              background: `linear-gradient(90deg, ${P.primary}, transparent)`,
              display: "inline-block",
              marginTop: 4,
            }}
          />
        </h2>
        {sub && (
          <p
            style={{
              fontSize: 14.5,
              color: P.textLight,
              margin: "10px 0 0",
              maxWidth: 520,
              lineHeight: 1.7,
            }}
          >
            {sub}
          </p>
        )}
      </div>
    </FadeUp>
  );
}

/* ─── Header ─── */
function Header({ page, setPage }) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 50,
        background: scrolled ? "rgba(255,255,255,0.97)" : "rgba(255,255,255,0.6)",
        backdropFilter: "blur(12px)",
        boxShadow: scrolled ? "0 2px 20px rgba(0,0,0,0.06)" : "none",
        transition: "all 0.3s ease",
      }}
    >
      <div
        style={{
          maxWidth: 1200,
          margin: "0 auto",
          padding: "14px 32px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        {/* Logo */}
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
              width: 36,
              height: 36,
              borderRadius: "50%",
              background: `linear-gradient(135deg, ${P.primary}, ${P.primaryDark})`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#fff",
              boxShadow: "0 4px 12px rgba(37,99,235,0.3)",
            }}
          >
            <Icon name="compass" size={18} />
          </span>
          <span
            style={{
              fontFamily: "'Playfair Display', serif",
              fontWeight: 700,
              fontSize: 22,
              color: P.dark,
              letterSpacing: "-0.02em",
            }}
          >
            FADTOUR
          </span>
        </button>

        {/* Desktop Nav */}
        <nav
          style={{
            display: "flex",
            gap: 4,
            alignItems: "center",
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
                padding: "8px 16px",
                fontFamily: "'Inter', sans-serif",
                fontSize: 14,
                color: page === n.key ? P.primary : P.text,
                fontWeight: page === n.key ? 700 : 500,
                borderRadius: 8,
                transition: "all 0.2s ease",
                position: "relative",
              }}
            >
              {n.label}
              {page === n.key && (
                <span
                  style={{
                    position: "absolute",
                    bottom: 2,
                    left: "50%",
                    transform: "translateX(-50%)",
                    width: 20,
                    height: 3,
                    borderRadius: 2,
                    background: P.primary,
                  }}
                />
              )}
            </button>
          ))}
        </nav>

        {/* CTA */}
        <button
          onClick={() => setPage("booking")}
          className="fd-desktop-nav"
          style={{
            background: `linear-gradient(135deg, ${P.primary}, ${P.primaryDark})`,
            color: "#fff",
            border: "none",
            borderRadius: 999,
            padding: "10px 24px",
            fontFamily: "'Inter', sans-serif",
            fontWeight: 600,
            fontSize: 14,
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: 6,
            boxShadow: "0 4px 14px rgba(37,99,235,0.3)",
            transition: "all 0.2s ease",
          }}
        >
          Mulai Perjalanan <Icon name="arrow" size={15} />
        </button>

        {/* Mobile Toggle */}
        <button
          onClick={() => setOpen(!open)}
          className="fd-mobile-nav"
          style={{
            display: "none",
            background: "none",
            border: `1px solid ${P.border}`,
            borderRadius: 10,
            padding: 8,
            color: P.dark,
            cursor: "pointer",
          }}
        >
          <Icon name={open ? "close" : "menu"} size={22} />
        </button>
      </div>

      {/* Mobile Dropdown */}
      {open && (
        <div
          className="fd-mobile-nav"
          style={{
            borderTop: `1px solid ${P.border}`,
            padding: "12px 32px 20px",
            display: "flex",
            flexDirection: "column",
            gap: 4,
            background: "#fff",
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
                background: page === n.key ? P.primaryLight : "none",
                border: "none",
                padding: "12px 14px",
                fontFamily: "'Inter', sans-serif",
                fontSize: 15,
                color: page === n.key ? P.primary : P.text,
                fontWeight: page === n.key ? 700 : 500,
                borderRadius: 10,
                cursor: "pointer",
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

/* ─── Destination Card ─── */
function DestinationCard({ d, onSelect }) {
  return (
    <FadeUp>
      <div
        className="fd-dest-card"
        style={{
          background: "#fff",
          borderRadius: 20,
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
          boxShadow: "0 4px 24px rgba(0,0,0,0.06)",
          transition: "transform 0.3s ease, box-shadow 0.3s ease",
        }}
      >
        <div
          style={{
            height: 180,
            position: "relative",
            backgroundImage: `linear-gradient(180deg, rgba(0,0,0,0) 40%, rgba(0,0,0,0.5) 100%), url(${photo(d.img)})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <span
            style={{
              position: "absolute",
              top: 14,
              left: 14,
              background: P.primary,
              color: "#fff",
              fontSize: 11,
              fontWeight: 700,
              padding: "5px 12px",
              borderRadius: 999,
              fontFamily: "'Inter', sans-serif",
              letterSpacing: "0.03em",
            }}
          >
            {d.tag}
          </span>
          <span
            style={{
              position: "absolute",
              top: 14,
              right: 14,
              width: 32,
              height: 32,
              borderRadius: "50%",
              background: "rgba(255,255,255,0.9)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: P.accent,
              backdropFilter: "blur(4px)",
            }}
          >
            <Icon name="star" size={14} style={{ color: P.accent, fill: P.accent }} />
          </span>
          <span
            style={{
              position: "absolute",
              left: 16,
              bottom: 14,
              color: "#fff",
              fontFamily: "'Playfair Display', serif",
              fontSize: 22,
              fontWeight: 700,
              textShadow: "0 2px 8px rgba(0,0,0,0.3)",
            }}
          >
            {d.name}
          </span>
        </div>
        <div style={{ padding: "18px 20px 20px", display: "flex", flexDirection: "column", gap: 12, flex: 1 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6, color: P.textLight, fontSize: 13, fontFamily: "'Inter', sans-serif" }}>
            <Icon name="pin" size={14} style={{ color: P.primary }} /> {d.location}
            <span style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 4, color: P.accent, fontWeight: 700 }}>
              <Icon name="star" size={13} style={{ color: P.accent }} /> {d.rating}
            </span>
          </div>
          <p style={{ margin: 0, fontSize: 13.5, color: P.textLight, lineHeight: 1.65, fontFamily: "'Inter', sans-serif" }}>{d.blurb}</p>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginTop: "auto",
              paddingTop: 14,
              borderTop: `1px solid ${P.border}`,
            }}
          >
            <div>
              <div style={{ fontSize: 11.5, color: P.textLight, fontFamily: "'Inter', sans-serif" }}>{d.days}</div>
              <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 18, fontWeight: 700, color: P.dark }}>
                {d.price}
              </div>
            </div>
            <button
              onClick={() => onSelect(d)}
              style={{
                background: P.primary,
                color: "#fff",
                border: "none",
                borderRadius: 999,
                padding: "10px 20px",
                fontSize: 13,
                fontWeight: 600,
                cursor: "pointer",
                fontFamily: "'Inter', sans-serif",
                transition: "all 0.2s ease",
                boxShadow: "0 2px 8px rgba(37,99,235,0.25)",
              }}
            >
              Pilih Paket
            </button>
          </div>
        </div>
      </div>
    </FadeUp>
  );
}

/* ─── Search Bar ─── */
function SearchBar({ setPage }) {
  const fieldStyle = {
    display: "flex",
    flexDirection: "column",
    gap: 3,
    padding: "8px 22px",
    flex: 1,
    minWidth: 130,
  };
  return (
    <FadeUp>
      <div
        style={{
          background: "#fff",
          boxShadow: "0 20px 60px rgba(0,0,0,0.1)",
          border: `1px solid ${P.border}`,
          display: "flex",
          alignItems: "stretch",
          padding: "8px",
          gap: 0,
          flexWrap: "wrap",
        }}
        className="fd-search-bar"
      >
        <div style={fieldStyle} className="fd-search-field">
          <span style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 11, fontWeight: 700, color: P.textLight, textTransform: "uppercase", letterSpacing: "0.06em" }}>
            <Icon name="pin" size={13} style={{ color: P.primary }} /> Lokasi
          </span>
          <span style={{ fontSize: 14, color: P.dark, fontWeight: 600 }}>Cari destinasi</span>
        </div>
        <div style={{ width: 1, background: P.border, margin: "10px 0" }} className="fd-search-divider" />
        <div style={fieldStyle} className="fd-search-field">
          <span style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 11, fontWeight: 700, color: P.textLight, textTransform: "uppercase", letterSpacing: "0.06em" }}>
            <Icon name="calendar" size={13} style={{ color: P.primary }} /> Tanggal
          </span>
          <span style={{ fontSize: 14, color: P.dark, fontWeight: 600 }}>Pilih tanggal</span>
        </div>
        <div style={{ width: 1, background: P.border, margin: "10px 0" }} className="fd-search-divider" />
        <div style={fieldStyle} className="fd-search-field">
          <span style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 11, fontWeight: 700, color: P.textLight, textTransform: "uppercase", letterSpacing: "0.06em" }}>
            <Icon name="users" size={13} style={{ color: P.primary }} /> Tamu
          </span>
          <span style={{ fontSize: 14, color: P.dark, fontWeight: 600 }}>2 orang</span>
        </div>
        <button
          onClick={() => setPage("booking")}
          aria-label="Cari"
          style={{
            background: `linear-gradient(135deg, ${P.primary}, ${P.primaryDark})`,
            border: "none",
            borderRadius: 999,
            padding: "12px 28px",
            flexShrink: 0,
            margin: 4,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            color: "#fff",
            gap: 8,
            fontFamily: "'Inter', sans-serif",
            fontWeight: 600,
            fontSize: 14,
            boxShadow: "0 4px 14px rgba(37,99,235,0.3)",
            transition: "all 0.2s ease",
          }}
        >
          <Icon name="search" size={16} /> Search
        </button>
        <style>{`
          .fd-search-bar { border-radius: 999px; }
          @media (max-width: 720px) {
            .fd-search-divider { display: none; }
            .fd-search-bar { border-radius: 24px; justify-content: center; padding: 14px; gap: 12px; }
            .fd-search-field { min-width: 100% !important; padding: 10px 14px !important; }
          }
        `}</style>
      </div>
    </FadeUp>
  );
}

/* ─── Home Page ─── */
function HomePage({ setPage, goToBooking }) {
  return (
    <>
      {/* Hero */}
      <section
        style={{
          position: "relative",
          overflow: "hidden",
          background: P.bgPage,
          padding: "100px 32px 0",
        }}
      >
        <div
          style={{
            maxWidth: 1200,
            margin: "0 auto",
            display: "grid",
            gridTemplateColumns: "1fr 1.1fr",
            gap: 48,
            alignItems: "center",
            minHeight: "80vh",
          }}
          className="fd-hero-grid"
        >
          <FadeUp>
            <div>
              <p
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontSize: 14,
                  fontWeight: 600,
                  color: P.primary,
                  textTransform: "uppercase",
                  letterSpacing: "0.12em",
                  marginBottom: 16,
                }}
              >
                Jelajahi Indonesia
              </p>
              <h1
                style={{
                  fontFamily: "'Playfair Display', serif",
                  fontWeight: 700,
                  fontSize: "clamp(36px, 5vw, 56px)",
                  lineHeight: 1.1,
                  color: P.dark,
                  margin: "0 0 22px",
                }}
              >
                Kunjungi Tempat{" "}
                <span style={{ color: P.primary, fontStyle: "italic" }}>Terindah</span> di
                Indonesia
              </h1>
              <p
                style={{
                  color: P.textLight,
                  fontSize: 16,
                  lineHeight: 1.75,
                  maxWidth: 440,
                  margin: "0 0 32px",
                  fontFamily: "'Inter', sans-serif",
                }}
              >
                Rencanakan perjalanan impianmu bersama pemandu profesional. Temukan destinasi
                terbaik, pengalaman otentik, dan kenangan tak terlupakan.
              </p>
              <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
                <button
                  onClick={() => setPage("packages")}
                  style={{
                    background: `linear-gradient(135deg, ${P.primary}, ${P.primaryDark})`,
                    color: "#fff",
                    border: "none",
                    borderRadius: 999,
                    padding: "14px 32px",
                    fontWeight: 600,
                    fontSize: 15,
                    cursor: "pointer",
                    fontFamily: "'Inter', sans-serif",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 8,
                    boxShadow: "0 4px 14px rgba(37,99,235,0.3)",
                    transition: "all 0.2s ease",
                  }}
                >
                  Mulai Jelajah <Icon name="arrow" size={16} />
                </button>
                <button
                  onClick={() => setPage("about")}
                  style={{
                    background: "none",
                    color: P.dark,
                    border: `2px solid ${P.border}`,
                    borderRadius: 999,
                    padding: "14px 28px",
                    fontWeight: 600,
                    fontSize: 15,
                    cursor: "pointer",
                    fontFamily: "'Inter', sans-serif",
                    transition: "all 0.2s ease",
                  }}
                >
                  Tentang Kami
                </button>
              </div>

              <div style={{ display: "flex", gap: 36, marginTop: 48, flexWrap: "wrap" }}>
                {[
                  ["120+", "Destinasi"],
                  ["8.6k", "Wisatawan"],
                  ["4.8", "Rating"],
                ].map(([n, l]) => (
                  <div key={l}>
                    <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 28, color: P.primary, fontWeight: 700 }}>
                      {n}
                    </div>
                    <div style={{ fontSize: 13, color: P.textLight, fontFamily: "'Inter', sans-serif" }}>{l}</div>
                  </div>
                ))}
              </div>
            </div>
          </FadeUp>

          {/* Image Grid / Mosaic */}
          <FadeUp>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(3, 1fr)",
                gridTemplateRows: "repeat(3, 120px)",
                gap: 12,
              }}
              className="fd-hero-mosaic"
            >
              <div style={{ gridColumn: "1 / 3", gridRow: "1 / 3", borderRadius: 20, overflow: "hidden", backgroundImage: `url(${photo("santorini greek island sunset", 800, 600)})`, backgroundSize: "cover", backgroundPosition: "center" }} />
              <div style={{ borderRadius: 20, overflow: "hidden", backgroundImage: `url(${photo("bali rice terrace indonesia", 400, 400)})`, backgroundSize: "cover", backgroundPosition: "center" }} />
              <div style={{ borderRadius: 20, overflow: "hidden", backgroundImage: `url(${photo("komodo island boat indonesia", 400, 400)})`, backgroundSize: "cover", backgroundPosition: "center" }} />
              <div style={{ borderRadius: 20, overflow: "hidden", backgroundImage: `url(${photo("indonesian beach sunset palm", 400, 300)})`, backgroundSize: "cover", backgroundPosition: "center" }} />
              <div style={{ borderRadius: 20, overflow: "hidden", backgroundImage: `url(${photo("borobudur temple indonesia sunrise", 400, 300)})`, backgroundSize: "cover", backgroundPosition: "center" }} />
              <div style={{ borderRadius: 20, overflow: "hidden", backgroundImage: `url(${photo("lake toba north sumatra", 400, 300)})`, backgroundSize: "cover", backgroundPosition: "center" }} />
            </div>
          </FadeUp>
        </div>

        {/* Search Bar */}
        <div
          style={{
            maxWidth: 1000,
            margin: "-20px auto 0",
            padding: "0 32px 60px",
            position: "relative",
            zIndex: 5,
          }}
        >
          <SearchBar setPage={setPage} />
        </div>

        <style>{`
          @media (max-width: 860px) {
            .fd-hero-grid { grid-template-columns: 1fr !important; }
            .fd-hero-mosaic { grid-template-rows: repeat(3, 100px) !important; }
          }
        `}</style>
      </section>

      {/* Categories */}
      <section style={{ padding: "70px 32px", maxWidth: 1200, margin: "0 auto" }}>
        <SectionTitle sub="Temukan berbagai pilihan destinasi sesuai minat dan gaya petualanganmu.">Kategori</SectionTitle>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(6, 1fr)",
            gap: 24,
          }}
          className="fd-cat-grid"
        >
          {CATEGORIES.map((c) => (
            <FadeUp key={c.label}>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12, cursor: "pointer" }}>
                <div
                  style={{
                    width: 100,
                    height: 100,
                    borderRadius: "50%",
                    backgroundImage: `url(${photo(c.img, 300, 300)})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    border: `3px solid ${P.border}`,
                    transition: "transform 0.3s ease, border-color 0.3s ease",
                    boxShadow: "0 4px 16px rgba(0,0,0,0.06)",
                  }}
                  className="fd-cat-circle"
                />
                <span style={{ fontSize: 13.5, fontWeight: 600, color: P.dark, fontFamily: "'Inter', sans-serif" }}>
                  {c.label}
                </span>
              </div>
            </FadeUp>
          ))}
        </div>
        <style>{`
          .fd-cat-circle:hover { transform: scale(1.08); border-color: ${P.primary} !important; }
          @media (max-width: 700px) {
            .fd-cat-grid { grid-template-columns: repeat(3, 1fr) !important; gap: 16px !important; }
          }
        `}</style>
      </section>

      {/* Popular Destinations */}
      <section style={{ padding: "40px 32px 80px", maxWidth: 1200, margin: "0 auto" }}>
        <SectionTitle sub="Enam destinasi terfavorit pilihan wisatawan FADTOUR sepanjang tahun.">
          Destinasi Populer
        </SectionTitle>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: 24,
          }}
          className="fd-grid-3"
        >
          {DESTINATIONS.slice(0, 3).map((d) => (
            <DestinationCard key={d.id} d={d} onSelect={goToBooking} />
          ))}
        </div>
      </section>

      {/* Services Section */}
      <section style={{ background: P.bgSoft, padding: "80px 32px" }}>
        <div
          style={{
            maxWidth: 1200,
            margin: "0 auto",
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 60,
            alignItems: "center",
          }}
          className="fd-hero-grid-about"
        >
          <FadeUp>
            <div>
              <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(26px, 3.5vw, 36px)", fontWeight: 700, color: P.dark, margin: "0 0 32px" }}>
                Layanan Kami
              </h2>
              {[
                { icon: "car", title: "Sewa Kendaraan", desc: "Transportasi nyaman dan aman ke seluruh destinasi, mulai dari kendaraan pribadi hingga bus wisata." },
                { icon: "hotel", title: "Booking Hotel", desc: "Akomodasi terbaik di setiap destinasi, dari homestay lokal hingga resort bintang lima." },
                { icon: "anchor", title: "Pemandu Lokal", desc: "Pemandu berpengalaman yang lahir dan besar di destinasi tujuanmu, untuk pengalaman yang otentik." },
              ].map((s) => (
                <div
                  key={s.title}
                  style={{
                    display: "flex",
                    gap: 18,
                    marginBottom: 28,
                    alignItems: "flex-start",
                  }}
                >
                  <div
                    style={{
                      width: 48,
                      height: 48,
                      borderRadius: 14,
                      background: P.primaryLight,
                      color: P.primary,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                    }}
                  >
                    <Icon name={s.icon} size={22} />
                  </div>
                  <div>
                    <h3
                      style={{
                        fontFamily: "'Inter', sans-serif",
                        fontSize: 17,
                        fontWeight: 700,
                        color: P.dark,
                        margin: "0 0 6px",
                      }}
                    >
                      {s.title}
                    </h3>
                    <p style={{ fontSize: 13.5, color: P.textLight, lineHeight: 1.65, margin: 0, fontFamily: "'Inter', sans-serif" }}>{s.desc}</p>
                    <button
                      onClick={() => setPage("booking")}
                      style={{
                        background: "none",
                        border: "none",
                        color: P.primary,
                        fontWeight: 600,
                        fontSize: 13,
                        cursor: "pointer",
                        padding: 0,
                        marginTop: 8,
                        fontFamily: "'Inter', sans-serif",
                        display: "flex",
                        alignItems: "center",
                        gap: 4,
                      }}
                    >
                      Explore more <Icon name="arrow" size={13} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </FadeUp>
          <FadeUp>
            <div
              style={{
                borderRadius: 28,
                overflow: "hidden",
                height: 420,
                backgroundImage: `url(${photo("tropical paradise island boat indonesia", 800, 600)})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                boxShadow: "0 20px 60px rgba(0,0,0,0.12)",
              }}
            />
          </FadeUp>
        </div>
        <style>{`
          @media (max-width: 860px) {
            .fd-hero-grid-about { grid-template-columns: 1fr !important; }
          }
        `}</style>
      </section>

      {/* Client Review */}
      <section style={{ padding: "80px 32px", maxWidth: 900, margin: "0 auto" }}>
        <SectionTitle sub="Dengarkan pengalaman langsung dari para wisatawan yang telah menjelajah bersama kami.">
          Ulasan Wisatawan
        </SectionTitle>
        <FadeUp>
          <div
            style={{
              background: "#fff",
              borderRadius: 28,
              padding: "40px 48px",
              textAlign: "center",
              boxShadow: "0 8px 40px rgba(0,0,0,0.06)",
              position: "relative",
            }}
          >
            <div
              style={{
                width: 60,
                height: 60,
                borderRadius: "50%",
                background: P.primaryLight,
                color: P.primary,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 24px",
              }}
            >
              <Icon name="quote" size={28} />
            </div>
            <p
              style={{
                fontFamily: "'Playfair Display', serif",
                fontStyle: "italic",
                fontSize: "clamp(18px, 2.5vw, 24px)",
                color: P.dark,
                lineHeight: 1.6,
                margin: "0 0 28px",
              }}
            >
              "Perjalanan ke Labuan Bajo bersama FADTOUR terasa seperti dipandu teman lama yang
              kebetulan tahu semua tempat terbaik."
            </p>
            <div
              style={{
                width: 56,
                height: 56,
                borderRadius: "50%",
                margin: "0 auto 12px",
                backgroundImage: `url(${photo("smiling indonesian woman portrait", 200, 200)})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                border: `3px solid ${P.primaryLight}`,
              }}
            />
            <div style={{ fontFamily: "'Inter', sans-serif", fontWeight: 700, fontSize: 15, color: P.dark }}>
              Nadia Rahmawati
            </div>
            <div style={{ fontSize: 13, color: P.textLight, fontFamily: "'Inter', sans-serif" }}>
              Wisatawan Jakarta
            </div>
          </div>
        </FadeUp>
      </section>

      <style>{`
        @media (max-width: 860px) {
          .fd-grid-3 { grid-template-columns: 1fr !important; }
        }
        .fd-dest-card:hover {
          transform: translateY(-6px);
          box-shadow: 0 12px 40px rgba(0,0,0,0.12) !important;
        }
      `}</style>
    </>
  );
}

/* ─── About Page ─── */
function AboutPage() {
  return (
    <div style={{ maxWidth: 1200, margin: "0 auto", padding: "120px 32px 90px" }}>
      <FadeUp>
        <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 13, fontWeight: 700, color: P.primary, textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: 12 }}>
          Tentang Kami
        </p>
        <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(30px, 4vw, 44px)", color: P.dark, margin: "0 0 20px", maxWidth: 640, fontWeight: 700 }}>
          Dari kantor kecil di Gresik, menuju setiap sudut nusantara.
        </h1>
        <p style={{ fontSize: 16, color: P.textLight, lineHeight: 1.8, maxWidth: 640, marginBottom: 36, fontFamily: "'Inter', sans-serif" }}>
          FADTOUR berdiri dari kecintaan pada perjalanan darat dan laut Indonesia. Kami percaya setiap daerah punya
          keunikan yang layak dialami langsung, bukan sekadar dilihat dari jauh — karena itu setiap paket kami
          disusun bersama pemandu dan komunitas lokal di destinasi masing-masing.
        </p>
      </FadeUp>

      <FadeUp>
        <div
          style={{
            height: 300,
            borderRadius: 28,
            marginBottom: 48,
            backgroundImage: `url(${photo("indonesia travel guide group adventure", 1200, 500)})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            boxShadow: "0 12px 40px rgba(0,0,0,0.08)",
          }}
        />
      </FadeUp>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20, marginBottom: 56 }} className="fd-grid-3">
        {[
          ["2016", "Tahun berdiri"],
          ["120+", "Destinasi dikelola"],
          ["35", "Pemandu lokal mitra"],
        ].map(([n, l]) => (
          <FadeUp key={l}>
            <div style={{ background: P.primaryLight, borderRadius: 20, padding: "28px 24px" }}>
              <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 32, color: P.primary, fontWeight: 700 }}>{n}</div>
              <div style={{ fontSize: 13.5, color: P.textLight, marginTop: 6, fontFamily: "'Inter', sans-serif" }}>{l}</div>
            </div>
          </FadeUp>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 48 }} className="fd-hero-grid-about">
        <FadeUp>
          <div>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 26, color: P.dark, margin: "0 0 16px", fontWeight: 700 }}>Misi kami</h2>
            <p style={{ fontSize: 15, color: P.textLight, lineHeight: 1.8, fontFamily: "'Inter', sans-serif" }}>
              Membuka akses wisata yang bertanggung jawab ke daerah-daerah yang sering terlewat oleh jalur turis
              biasa, sambil memastikan pendapatan wisata dirasakan langsung oleh komunitas setempat.
            </p>
          </div>
        </FadeUp>
        <FadeUp>
          <div>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 26, color: P.dark, margin: "0 0 16px", fontWeight: 700 }}>Cara kami bekerja</h2>
            <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 14 }}>
              {[
                "Survei langsung setiap rute sebelum dijual ke publik",
                "Kerja sama jangka panjang dengan pemandu dan penginapan lokal",
                "Grup kecil untuk menjaga kualitas dan kenyamanan",
              ].map((t) => (
                <li key={t} style={{ display: "flex", gap: 12, fontSize: 14.5, color: P.text, fontFamily: "'Inter', sans-serif" }}>
                  <span style={{ width: 22, height: 22, borderRadius: "50%", background: P.primaryLight, color: P.primary, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 1 }}>
                    <Icon name="check" size={12} />
                  </span>
                  {t}
                </li>
              ))}
            </ul>
          </div>
        </FadeUp>
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

/* ─── Packages Page ─── */
function PackagesPage({ goToBooking }) {
  return (
    <div style={{ maxWidth: 1200, margin: "0 auto", padding: "120px 32px 90px" }}>
      <SectionTitle sub="Semua harga sudah termasuk akomodasi, transportasi lokal, dan pemandu. Tinggal pilih rute, sesuaikan tanggal di halaman booking.">
        Paket Wisata
      </SectionTitle>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 24 }} className="fd-grid-3">
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

/* ─── Booking Page ─── */
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
    padding: "14px 16px",
    borderRadius: 14,
    border: `1px solid ${P.border}`,
    fontSize: 15,
    fontFamily: "'Inter', sans-serif",
    color: P.dark,
    background: "#fff",
    transition: "border-color 0.2s ease",
    outline: "none",
  };
  const labelStyle = {
    fontSize: 13,
    fontWeight: 700,
    color: P.dark,
    marginBottom: 8,
    display: "block",
    fontFamily: "'Inter', sans-serif",
  };

  return (
    <div style={{ maxWidth: 780, margin: "0 auto", padding: "120px 32px 90px" }}>
      <FadeUp>
        <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 13, fontWeight: 700, color: P.primary, textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: 12 }}>
          Booking
        </p>
        <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(28px, 4vw, 38px)", color: P.dark, margin: "0 0 12px", fontWeight: 700 }}>
          Rencanakan perjalananmu.
        </h1>
        <p style={{ fontSize: 15, color: P.textLight, marginBottom: 36, fontFamily: "'Inter', sans-serif", lineHeight: 1.7 }}>
          Isi detail di bawah, tim kami akan menghubungimu dalam 1x24 jam untuk konfirmasi ketersediaan dan
          pembayaran.
        </p>
      </FadeUp>

      <FadeUp>
        {submitted ? (
          <div
            style={{
              background: P.primaryLight,
              borderRadius: 24,
              padding: 40,
              textAlign: "center",
            }}
          >
            <div style={{ width: 60, height: 60, borderRadius: "50%", background: "#D1FAE5", color: P.success, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
              <Icon name="check" size={28} />
            </div>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 24, color: P.dark, margin: "0 0 10px", fontWeight: 700 }}>
              Permintaan booking terkirim
            </h2>
            <p style={{ fontSize: 14.5, color: P.textLight, margin: "0 0 20px", fontFamily: "'Inter', sans-serif" }}>
              Terima kasih, {form.name || "calon petualang"}. Kami akan menghubungi lewat kontak yang kamu berikan
              untuk paket {form.destination || "pilihanmu"}.
            </p>
            <button
              onClick={() => setSubmitted(false)}
              style={{
                background: "none",
                border: `2px solid ${P.border}`,
                borderRadius: 999,
                padding: "12px 24px",
                fontWeight: 600,
                fontSize: 14,
                color: P.dark,
                cursor: "pointer",
                fontFamily: "'Inter', sans-serif",
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
              gap: 20,
              background: "#fff",
              border: `1px solid ${P.border}`,
              borderRadius: 24,
              padding: 36,
              boxShadow: "0 4px 24px rgba(0,0,0,0.04)",
            }}
          >
            <div>
              <label style={labelStyle}>Destinasi</label>
              <select style={{ ...inputStyle, cursor: "pointer" }} value={form.destination} onChange={set("destination")} required>
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
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18 }} className="fd-form-grid">
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
                style={{ ...inputStyle, minHeight: 100, resize: "vertical" }}
                value={form.notes}
                onChange={set("notes")}
                placeholder="Preferensi kamar, kebutuhan khusus, dll (opsional)"
              />
            </div>
            <button
              type="submit"
              style={{
                background: `linear-gradient(135deg, ${P.primary}, ${P.primaryDark})`,
                color: "#fff",
                border: "none",
                borderRadius: 999,
                padding: "15px 0",
                fontWeight: 700,
                fontSize: 15,
                cursor: "pointer",
                fontFamily: "'Inter', sans-serif",
                boxShadow: "0 4px 14px rgba(37,99,235,0.3)",
                transition: "all 0.2s ease",
              }}
            >
              Kirim Permintaan Booking
            </button>
          </form>
        )}
      </FadeUp>
      <style>{`
        @media (max-width: 560px) {
          .fd-form-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}

/* ─── Contact Page ─── */
function ContactPage() {
  const [sent, setSent] = useState(false);
  const inputStyle = {
    width: "100%",
    boxSizing: "border-box",
    padding: "14px 16px",
    borderRadius: 14,
    border: `1px solid ${P.border}`,
    fontSize: 15,
    fontFamily: "'Inter', sans-serif",
    background: "#fff",
    color: P.dark,
    outline: "none",
    transition: "border-color 0.2s ease",
  };
  const labelStyle = {
    fontSize: 13,
    fontWeight: 700,
    color: P.dark,
    marginBottom: 8,
    display: "block",
    fontFamily: "'Inter', sans-serif",
  };

  return (
    <div style={{ maxWidth: 1200, margin: "0 auto", padding: "120px 32px 90px" }}>
      <SectionTitle sub="Tim FADTOUR siap membantu dari Senin sampai Sabtu, pukul 09.00–18.00 WIB.">
        Kontak
      </SectionTitle>

      <div style={{ display: "grid", gridTemplateColumns: "0.9fr 1.1fr", gap: 48 }} className="fd-hero-grid-about">
        <FadeUp>
          <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
            <div
              style={{
                height: 180,
                borderRadius: 24,
                backgroundImage: `url(${photo("modern travel agency office", 700, 400)})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                boxShadow: "0 8px 30px rgba(0,0,0,0.08)",
              }}
            />
            {[
              ["mail", "Email", "halo@fadtour.id"],
              ["phone", "Telepon / WhatsApp", "+62 812-3456-7890"],
              ["pin", "Kantor", "Jl. Veteran No. 12, Gresik, Jawa Timur"],
            ].map(([icon, label, val]) => (
              <div key={label} style={{ display: "flex", gap: 16, alignItems: "flex-start" }}>
                <div
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: 14,
                    background: P.primaryLight,
                    color: P.primary,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  <Icon name={icon} size={20} />
                </div>
                <div>
                  <div style={{ fontSize: 13, color: P.textLight, fontWeight: 600, fontFamily: "'Inter', sans-serif" }}>{label}</div>
                  <div style={{ fontSize: 15, color: P.dark, fontFamily: "'Inter', sans-serif", fontWeight: 500 }}>{val}</div>
                </div>
              </div>
            ))}
          </div>
        </FadeUp>

        <FadeUp>
          {sent ? (
            <div
              style={{
                background: P.primaryLight,
                borderRadius: 24,
                padding: 40,
                textAlign: "center",
                alignSelf: "start",
              }}
            >
              <div style={{ width: 56, height: 56, borderRadius: "50%", background: "#D1FAE5", color: P.success, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 14px" }}>
                <Icon name="check" size={26} />
              </div>
              <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 22, color: P.dark, margin: "0 0 8px", fontWeight: 700 }}>
                Pesan terkirim
              </h2>
              <p style={{ fontSize: 14, color: P.textLight, margin: 0, fontFamily: "'Inter', sans-serif" }}>Kami akan membalas secepatnya.</p>
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
                gap: 18,
                background: "#fff",
                border: `1px solid ${P.border}`,
                borderRadius: 24,
                padding: 32,
                boxShadow: "0 4px 24px rgba(0,0,0,0.04)",
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
                <textarea style={{ ...inputStyle, minHeight: 120, resize: "vertical" }} placeholder="Tulis pertanyaanmu di sini" required />
              </div>
              <button
                type="submit"
                style={{
                  background: `linear-gradient(135deg, ${P.primary}, ${P.primaryDark})`,
                  color: "#fff",
                  border: "none",
                  borderRadius: 999,
                  padding: "15px 0",
                  fontWeight: 700,
                  fontSize: 15,
                  cursor: "pointer",
                  fontFamily: "'Inter', sans-serif",
                  boxShadow: "0 4px 14px rgba(37,99,235,0.3)",
                  transition: "all 0.2s ease",
                }}
              >
                Kirim Pesan
              </button>
            </form>
          )}
        </FadeUp>
      </div>
      <style>{`
        @media (max-width: 700px) {
          .fd-hero-grid-about { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}

/* ─── Footer ─── */
function Footer({ setPage }) {
  return (
    <footer style={{ background: P.primaryDark, padding: "56px 32px 32px", color: "rgba(255,255,255,0.7)" }}>
      <div
        style={{
          maxWidth: 1200,
          margin: "0 auto",
          display: "flex",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: 36,
        }}
      >
        <div style={{ maxWidth: 320 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
            <span style={{ width: 32, height: 32, borderRadius: "50%", background: "rgba(255,255,255,0.15)", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff" }}>
              <Icon name="compass" size={16} />
            </span>
            <span style={{ fontFamily: "'Playfair Display', serif", fontSize: 20, color: "#fff", fontWeight: 700 }}>
              FADTOUR
            </span>
          </div>
          <p style={{ fontSize: 13.5, lineHeight: 1.7, margin: 0, fontFamily: "'Inter', sans-serif" }}>
            Biro perjalanan wisata yang merancang trip ke seluruh penjuru Indonesia dengan pemandu lokal terpercaya.
          </p>
        </div>
        <div style={{ display: "flex", gap: 60, flexWrap: "wrap" }}>
          <div>
            <div style={{ fontSize: 12.5, fontWeight: 700, color: "#fff", marginBottom: 14, fontFamily: "'Inter', sans-serif", textTransform: "uppercase", letterSpacing: "0.08em" }}>Navigasi</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {NAV.map((n) => (
                <button
                  key={n.key}
                  onClick={() => setPage(n.key)}
                  style={{ background: "none", border: "none", color: "rgba(255,255,255,0.7)", fontSize: 13.5, textAlign: "left", cursor: "pointer", padding: 0, fontFamily: "'Inter', sans-serif", transition: "color 0.2s" }}
                >
                  {n.label}
                </button>
              ))}
            </div>
          </div>
          <div>
            <div style={{ fontSize: 12.5, fontWeight: 700, color: "#fff", marginBottom: 14, fontFamily: "'Inter', sans-serif", textTransform: "uppercase", letterSpacing: "0.08em" }}>Kontak</div>
            <div style={{ fontSize: 13.5, lineHeight: 2.2, fontFamily: "'Inter', sans-serif" }}>
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
          maxWidth: 1200,
          margin: "36px auto 0",
          paddingTop: 22,
          borderTop: "1px solid rgba(255,255,255,0.1)",
          fontSize: 12.5,
          color: "rgba(255,255,255,0.4)",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 12,
          fontFamily: "'Inter', sans-serif",
        }}
      >
        <span>© 2026 FADTOUR. Seluruh hak cipta dilindungi.</span>
        <div style={{ display: "flex", gap: 16 }}>
          <span>Imprint</span>
          <span>Privacy</span>
        </div>
      </div>
    </footer>
  );
}

/* ─── App Root ─── */
export default function FadtourApp() {
  ensureFonts();
  const [page, setPage] = useState("home");
  const [presetDestination, setPresetDestination] = useState("");

  useEffect(() => {
    const handleScroll = () => {
      const sections = ["home", "about", "packages", "booking", "contact"];
      let current = "home";
      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          if (rect.top <= 150) {
            current = section;
          }
        }
      }
      setPage(current);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const goToBooking = (destination) => {
    setPresetDestination(destination ? destination.name : "");
    changePage("booking");
  };

  const changePage = (p) => {
    setPage(p);
    const element = document.getElementById(p);
    if (element) {
      const headerOffset = 80;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth"
      });
    }
  };

  return (
    <div style={{ fontFamily: "'Inter', sans-serif", background: P.bgPage, color: P.text, minHeight: "100vh" }}>
      <Header page={page} setPage={changePage} />
      <style>{`
        html { scroll-behavior: smooth; }
        * { box-sizing: border-box; }
        .fade-up {
          opacity: 0;
          transform: translateY(40px);
          transition: opacity 0.8s ease-out, transform 0.8s ease-out;
        }
        .fade-up.visible {
          opacity: 1;
          transform: translateY(0);
        }
        input:focus, textarea:focus, select:focus {
          border-color: ${P.primary} !important;
          box-shadow: 0 0 0 3px rgba(37,99,235,0.1) !important;
        }
        button:hover {
          filter: brightness(1.05);
        }
      `}</style>
      <FadeUp id="home">
        <HomePage setPage={changePage} goToBooking={goToBooking} />
      </FadeUp>
      <FadeUp id="about">
        <AboutPage />
      </FadeUp>
      <FadeUp id="packages">
        <PackagesPage goToBooking={goToBooking} />
      </FadeUp>
      <FadeUp id="booking">
        <BookingPage presetDestination={presetDestination} />
      </FadeUp>
      <FadeUp id="contact">
        <ContactPage />
      </FadeUp>
      <Footer setPage={changePage} />
    </div>
  );
}