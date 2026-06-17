import { useState, useEffect, useCallback, useRef } from "react";
import { createClient } from "@supabase/supabase-js";

// ─── Supabase (credentials from .env) ───────────────────────────────────────
const supabase = createClient(
  process.env.REACT_APP_SUPABASE_URL,
  process.env.REACT_APP_SUPABASE_ANON_KEY
);

// ─── Design Tokens ───────────────────────────────────────────────────────────
const C = {
  bg: "#0A0806",
  section: "#12110D",
  card: "#161310",
  input: "#241F1A",
  gold: "#C59B4E",
  goldHover: "#DFB564",
  text: "#F6F0E5",
  muted: "#8E806A",
  border: "rgba(197,155,78,0.18)",
  success: "#4CAF50",
  danger: "#E53935",
};

// ─── Menu Data ────────────────────────────────────────────────────────────────
const MENU = [
  // Starters
  { id: 1, cat: "Starters", name: "Paneer Tikka", price: 249, img: "https://ibb.co/b54twxDX", veg: true, spicy: 2, desc: "Succulent cubes of cottage cheese marinated in yogurt and aromatic spices, grilled to perfection in a tandoor oven.", ingredients: "Paneer, Yogurt, Tandoori Masala, Capsicum, Onion, Lemon, Chaat Masala" },
  { id: 2, cat: "Starters", name: "Chicken Leg Piece", price: 139, img: "https://ibb.co/ch9cnYcY", veg: false, spicy: 3, desc: "Juicy chicken leg marinated overnight in smoky spices and slow-roasted for a deep, satisfying flavour.", ingredients: "Chicken Leg, Ginger-Garlic Paste, Red Chilli, Garam Masala, Mustard Oil" },
  { id: 3, cat: "Starters", name: "Samosa", price: 25, img: "https://ibb.co/tTPZwQYJ", veg: true, spicy: 1, desc: "Crispy golden pastry filled with spiced potatoes and peas — India's most beloved street snack.", ingredients: "Maida, Potato, Green Peas, Cumin, Coriander, Amchur" },
  { id: 4, cat: "Starters", name: "Chicken Kabab", price: 229, img: "https://ibb.co/Gfw3KxcF", veg: false, spicy: 3, desc: "Minced chicken blended with herbs, spices and roasted on skewers — smoky, tender and irresistible.", ingredients: "Chicken Mince, Onion, Green Chilli, Garam Masala, Coriander, Mint" },
  { id: 5, cat: "Starters", name: "Momos", price: 99, img: "https://ibb.co/VYNHL7z7", veg: true, spicy: 1, desc: "Soft steamed dumplings filled with spiced vegetables, served with our signature red chutney.", ingredients: "Maida, Cabbage, Carrot, Ginger, Garlic, Soy Sauce, Sesame Oil" },
  { id: 6, cat: "Starters", name: "Red Chilli Momos", price: 129, img: "https://ibb.co/M5SY8tb5", veg: true, spicy: 4, desc: "Pan-fried momos tossed in a fiery red chilli sauce — for the brave souls who like it hot!", ingredients: "Maida, Cabbage, Carrot, Red Chilli Sauce, Garlic, Sesame" },
  // Main Course
  { id: 7, cat: "Main Course", name: "Butter Chicken", price: 329, img: "https://ibb.co/nsxvHTtk", veg: false, spicy: 2, desc: "Tender chicken in a rich, velvety tomato-butter sauce — the dish that conquered the world. A timeless classic.", ingredients: "Chicken, Tomato Puree, Cream, Butter, Fenugreek, Cashew, Garam Masala" },
  { id: 8, cat: "Main Course", name: "Butter Paneer Masala", price: 269, img: "https://ibb.co/8gL6VrRt", veg: true, spicy: 2, desc: "Pillowy paneer cubes swimming in a golden, buttery tomato gravy. Pure comfort in every bite.", ingredients: "Paneer, Tomato, Onion, Cream, Butter, Kasuri Methi, Spices" },
  { id: 9, cat: "Main Course", name: "Dal Makhni", price: 219, img: "https://ibb.co/SwTd1X3g", veg: true, spicy: 1, desc: "Slow-cooked black lentils simmered overnight in butter and cream — a royal dish from Punjab's heart.", ingredients: "Black Urad Dal, Kidney Beans, Butter, Cream, Tomato, Ginger" },
  { id: 10, cat: "Main Course", name: "Chicken Curry", price: 299, img: "https://ibb.co/8gSqjWKt", veg: false, spicy: 3, desc: "A robust, aromatic home-style chicken curry with whole spices — the kind that brings you back to your roots.", ingredients: "Chicken, Onion, Tomato, Whole Spices, Coriander, Turmeric" },
  { id: 11, cat: "Main Course", name: "Palak Paneer", price: 249, img: "https://ibb.co/1G3Db1zD", veg: true, spicy: 1, desc: "Fresh cottage cheese in a silky pureed spinach gravy — healthy, vibrant and deeply flavorful.", ingredients: "Paneer, Spinach, Onion, Tomato, Cream, Ginger-Garlic, Garam Masala" },
  { id: 12, cat: "Main Course", name: "Handi Chicken", price: 349, img: "https://ibb.co/23FJ3MLC", veg: false, spicy: 3, desc: "Chicken slow-cooked in a sealed clay pot with whole spices, locking in every drop of flavour.", ingredients: "Chicken, Yogurt, Whole Spices, Onion, Tomato, Saffron, Dum Masala" },
  // Biryani & Rice
  { id: 13, cat: "Biryani & Rice", name: "Chicken Biryani", price: 249, img: "https://ibb.co/PGY7mjYG", veg: false, spicy: 2, desc: "Fragrant basmati rice layered with spiced chicken and slow-cooked on dum — every grain tells a story.", ingredients: "Basmati Rice, Chicken, Saffron, Fried Onion, Yogurt, Whole Spices, Ghee" },
  { id: 14, cat: "Biryani & Rice", name: "Veg Biryani", price: 189, img: "https://ibb.co/YFZNVPfX", veg: true, spicy: 1, desc: "Aromatic basmati rice cooked with seasonal vegetables and whole spices — vegetarian luxury.", ingredients: "Basmati Rice, Mixed Vegetables, Saffron, Fried Onion, Ghee, Whole Spices" },
  { id: 15, cat: "Biryani & Rice", name: "Mutton Biryani", price: 349, img: "https://ibb.co/zVHkyZ4T", veg: false, spicy: 3, desc: "Tender slow-cooked mutton with aged basmati rice — the king of all biryanis.", ingredients: "Basmati Rice, Mutton, Saffron, Fried Onion, Yogurt, Whole Spices, Kewra" },
  { id: 16, cat: "Biryani & Rice", name: "Chicken Fried Rice", price: 199, img: "https://ibb.co/6cjF3ZGP", veg: false, spicy: 2, desc: "Indo-Chinese style fried rice with juicy chicken, crisp vegetables and aromatic soy sauce.", ingredients: "Rice, Chicken, Egg, Capsicum, Carrot, Spring Onion, Soy Sauce" },
  // Breads & Snacks
  { id: 17, cat: "Breads & Snacks", name: "Tandoori Roti", price: 20, img: "https://ibb.co/BVhLcSm7", veg: true, spicy: 0, desc: "Whole wheat flatbread baked fresh in a clay tandoor — the perfect companion to any curry.", ingredients: "Whole Wheat Flour, Water, Salt" },
  { id: 18, cat: "Breads & Snacks", name: "Chhole Bhature", price: 99, img: "https://ibb.co/BHWdLXzJ", veg: true, spicy: 2, desc: "Pillowy deep-fried bread served with tangy, spiced chickpeas — Delhi's most iconic breakfast.", ingredients: "Maida, Chickpeas, Onion, Tomato, Tamarind, Chole Masala" },
  { id: 19, cat: "Breads & Snacks", name: "Chhole Kulche", price: 89, img: "https://ibb.co/Tqd7sQNt", veg: true, spicy: 2, desc: "Soft leavened bread with spiced white chickpeas — a Punjab street food classic.", ingredients: "Maida, Chickpeas, Butter, Onion, Green Chilli, Chole Masala" },
  { id: 20, cat: "Breads & Snacks", name: "Idli Sambar", price: 79, img: "https://ibb.co/R10hKdP", veg: true, spicy: 1, desc: "Soft, fluffy steamed rice cakes with lentil vegetable soup — South India's gift to breakfast.", ingredients: "Rice, Urad Dal, Toor Dal, Vegetables, Tamarind, Sambar Masala" },
  { id: 21, cat: "Breads & Snacks", name: "Masala Dosa", price: 119, img: "https://ibb.co/MD9GcDqJ", veg: true, spicy: 2, desc: "Crispy fermented rice crepe filled with spiced potato masala, served with coconut chutney.", ingredients: "Rice, Urad Dal, Potato, Onion, Mustard Seeds, Curry Leaves, Coconut" },
  { id: 22, cat: "Breads & Snacks", name: "Dahi Bhalla", price: 89, img: "https://ibb.co/8nSqF6Pt", veg: true, spicy: 1, desc: "Melt-in-mouth lentil dumplings soaked in chilled yogurt, topped with tamarind and mint chutney.", ingredients: "Urad Dal, Yogurt, Tamarind, Mint Chutney, Roasted Cumin, Pomegranate" },
  // Desserts
  { id: 23, cat: "Desserts", name: "Malai Kulfi", price: 69, img: "https://ibb.co/fdSrdLbV", veg: true, spicy: 0, desc: "India's answer to ice cream — dense, creamy and laced with cardamom and saffron.", ingredients: "Full Cream Milk, Sugar, Cardamom, Saffron, Pistachio" },
  { id: 24, cat: "Desserts", name: "Rasmalai", price: 79, img: "https://ibb.co/r8TTqBJ", veg: true, spicy: 0, desc: "Soft cottage cheese patties soaked in chilled saffron-infused milk — a Bengal dessert masterpiece.", ingredients: "Paneer, Sugar Syrup, Saffron Milk, Cardamom, Rose Water, Pistachio" },
  { id: 25, cat: "Desserts", name: "Gulab Jamun (2 pcs)", price: 59, img: "https://ibb.co/TB9pB4Nf", veg: true, spicy: 0, desc: "Deep-fried milk dough balls soaked in rose-scented sugar syrup — a celebration in every bite.", ingredients: "Khoya, Maida, Sugar Syrup, Rose Water, Cardamom" },
  { id: 26, cat: "Desserts", name: "Rabri Kheer", price: 89, img: "https://ibb.co/pj3mm3Bp", veg: true, spicy: 0, desc: "Rich slow-reduced milk pudding with rice, layered with malai and garnished with dry fruits.", ingredients: "Full Cream Milk, Rice, Sugar, Cardamom, Saffron, Dry Fruits" },
  // Beverages
  { id: 27, cat: "Beverages", name: "Masala Chai", price: 25, img: "https://ibb.co/fY9dHhyg", veg: true, spicy: 0, desc: "Brewed with ginger, cardamom and whole spices — the chai that makes everything better.", ingredients: "Tea Leaves, Milk, Ginger, Cardamom, Cinnamon, Sugar" },
  { id: 28, cat: "Beverages", name: "Thandai", price: 69, img: "https://ibb.co/wrwgrj0K", veg: true, spicy: 0, desc: "A chilled festive drink made with milk, nuts, rose petals and aromatic spices — Holi in a glass.", ingredients: "Milk, Almonds, Fennel, Rose Petals, Cardamom, Saffron, Sugar" },
  { id: 29, cat: "Beverages", name: "Aam Pana", price: 59, img: "https://ibb.co/d4bwNCFy", veg: true, spicy: 0, desc: "Raw mango cooler with black salt and roasted cumin — the ultimate summer refresher.", ingredients: "Raw Mango, Black Salt, Roasted Cumin, Mint, Sugar" },
  // Fast Food
  { id: 30, cat: "Fast Food", name: "Veg Burger", price: 99, img: "https://ibb.co/1JKsG0QB", veg: true, spicy: 1, desc: "A hearty veggie patty with crisp lettuce, tomato and our special desi sauce in a toasted bun.", ingredients: "Bun, Veggie Patty, Lettuce, Tomato, Onion, Cheese, Desi Sauce" },
];

const CATEGORIES = ["All", ...Array.from(new Set(MENU.map((i) => i.cat)))];

const ORDER_STATUSES = ["Order Placed", "Confirmed", "Preparing", "Out for Delivery", "Delivered"];

// ─── Utility ─────────────────────────────────────────────────────────────────
const spicyLabel = (n) => ["", "Mild 🌶", "Medium 🌶🌶", "Spicy 🌶🌶🌶", "Extra Hot 🌶🌶🌶🌶"][n] || "";

// ─── Styles ──────────────────────────────────────────────────────────────────
const S = {
  app: { background: C.bg, minHeight: "100vh", color: C.text, fontFamily: "'Inter', sans-serif" },
  nav: {
    position: "sticky", top: 0, zIndex: 100,
    background: "rgba(10,8,6,0.95)", backdropFilter: "blur(12px)",
    borderBottom: `1px solid ${C.border}`,
    display: "flex", alignItems: "center", justifyContent: "space-between",
    padding: "0 24px", height: 64,
  },
  logo: { fontFamily: "'Playfair Display', serif", fontSize: "1.5rem", color: C.gold, cursor: "pointer", letterSpacing: 1 },
  navLinks: { display: "flex", gap: 8, alignItems: "center" },
  navBtn: (active) => ({
    background: active ? C.gold : "transparent",
    color: active ? C.bg : C.muted,
    border: `1px solid ${active ? C.gold : "transparent"}`,
    borderRadius: 6, padding: "6px 14px", cursor: "pointer",
    fontSize: "0.82rem", fontFamily: "'Inter', sans-serif",
    fontWeight: 500, transition: "all 0.2s",
  }),
  cartBadge: {
    background: C.gold, color: C.bg, borderRadius: "50%",
    width: 20, height: 20, display: "flex", alignItems: "center", justifyContent: "center",
    fontSize: "0.7rem", fontWeight: 700, marginLeft: 4,
  },
  heroSection: {
    background: `linear-gradient(135deg, ${C.bg} 0%, #1a1208 50%, ${C.bg} 100%)`,
    minHeight: "88vh", display: "flex", flexDirection: "column",
    alignItems: "center", justifyContent: "center", textAlign: "center",
    padding: "60px 24px", position: "relative", overflow: "hidden",
  },
  heroTitle: {
    fontFamily: "'Playfair Display', serif",
    fontSize: "clamp(2.8rem, 8vw, 5.5rem)", fontWeight: 700,
    color: C.text, lineHeight: 1.1, marginBottom: 16,
  },
  heroGold: { color: C.gold, display: "block" },
  heroSub: {
    fontFamily: "'Cormorant Garamond', serif",
    fontSize: "clamp(1rem, 2.5vw, 1.4rem)", color: C.muted,
    maxWidth: 520, marginBottom: 40, lineHeight: 1.7,
  },
  btnPrimary: {
    background: `linear-gradient(135deg, ${C.gold}, ${C.goldHover})`,
    color: C.bg, border: "none", borderRadius: 8,
    padding: "14px 36px", fontSize: "1rem", fontWeight: 700,
    cursor: "pointer", fontFamily: "'Inter', sans-serif",
    letterSpacing: 0.5, transition: "transform 0.2s, box-shadow 0.2s",
    boxShadow: `0 4px 20px rgba(197,155,78,0.3)`,
  },
  btnSecondary: {
    background: "transparent", color: C.gold,
    border: `1px solid ${C.gold}`, borderRadius: 8,
    padding: "13px 32px", fontSize: "0.95rem", fontWeight: 600,
    cursor: "pointer", fontFamily: "'Inter', sans-serif", transition: "all 0.2s",
  },
  sectionTitle: {
    fontFamily: "'Playfair Display', serif",
    fontSize: "clamp(1.8rem, 4vw, 2.8rem)", color: C.text,
    marginBottom: 8, textAlign: "center",
  },
  goldLine: {
    width: 60, height: 2,
    background: `linear-gradient(90deg, transparent, ${C.gold}, transparent)`,
    margin: "12px auto 40px",
  },
  cardGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
    gap: 20, padding: "0 24px 40px",
  },
  foodCard: {
    background: C.card, borderRadius: 14,
    border: `1px solid ${C.border}`, overflow: "hidden",
    cursor: "pointer", transition: "transform 0.2s, box-shadow 0.2s",
  },
  foodImg: { width: "100%", height: 190, objectFit: "cover", display: "block" },
  cardBody: { padding: "14px 16px" },
  cardName: { fontSize: "1rem", fontWeight: 600, color: C.text, marginBottom: 4 },
  cardPrice: { color: C.gold, fontSize: "1.1rem", fontWeight: 700 },
  vegDot: (v) => ({
    width: 10, height: 10, borderRadius: "50%",
    background: v ? C.success : C.danger,
    display: "inline-block", marginRight: 6,
  }),
  input: {
    background: C.input, color: C.text, border: `1px solid ${C.border}`,
    borderRadius: 8, padding: "12px 16px", fontSize: "0.95rem",
    fontFamily: "'Inter', sans-serif", width: "100%", outline: "none",
  },
  modal: {
    position: "fixed", inset: 0, background: "rgba(0,0,0,0.85)",
    zIndex: 200, display: "flex", alignItems: "center", justifyContent: "center",
    padding: 16, backdropFilter: "blur(4px)",
  },
  modalBox: {
    background: C.card, borderRadius: 16,
    border: `1px solid ${C.border}`, maxWidth: 520, width: "100%",
    maxHeight: "90vh", overflowY: "auto", padding: 28,
  },
  floatBack: {
    position: "fixed", bottom: 28, left: 20, zIndex: 150,
    background: C.card, border: `1px solid ${C.border}`,
    color: C.gold, borderRadius: "50%", width: 48, height: 48,
    display: "flex", alignItems: "center", justifyContent: "center",
    cursor: "pointer", fontSize: "1.2rem", boxShadow: "0 4px 20px rgba(0,0,0,0.4)",
    transition: "all 0.2s",
  },
};

// ─── Components ──────────────────────────────────────────────────────────────

function StarRating({ value, onChange }) {
  return (
    <div style={{ display: "flex", gap: 4 }}>
      {[1, 2, 3, 4, 5].map((s) => (
        <span
          key={s}
          onClick={() => onChange && onChange(s)}
          style={{ fontSize: "1.4rem", cursor: onChange ? "pointer" : "default",
            color: s <= value ? C.gold : C.muted }}
        >★</span>
      ))}
    </div>
  );
}

function FloatBack({ page, setPage, history, setHistory }) {
  if (history.length === 0) return null;
  return (
    <button
      style={S.floatBack}
      onClick={() => {
        const prev = history[history.length - 1];
        setHistory((h) => h.slice(0, -1));
        setPage(prev);
      }}
      title="Go Back"
    >←</button>
  );
}

// ─── LOGO SVG ─────────────────────────────────────────────────────────────────
function Logo({ size = 40 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ marginRight: 8, verticalAlign: "middle" }}>
      <circle cx="50" cy="50" r="48" stroke="#C59B4E" strokeWidth="2" fill="#0A0806" />
      <circle cx="50" cy="50" r="40" stroke="#C59B4E" strokeWidth="0.5" strokeDasharray="4 3" fill="none" />
      {/* Plate */}
      <ellipse cx="50" cy="58" rx="26" ry="6" fill="#1a1208" stroke="#C59B4E" strokeWidth="1" />
      {/* Food dome */}
      <path d="M24 58 Q24 36 50 36 Q76 36 76 58Z" fill="#1a1208" stroke="#C59B4E" strokeWidth="1.2" />
      {/* Steam lines */}
      <path d="M38 32 Q40 26 38 20" stroke="#DFB564" strokeWidth="1.5" strokeLinecap="round" fill="none" />
      <path d="M50 30 Q52 24 50 18" stroke="#DFB564" strokeWidth="1.5" strokeLinecap="round" fill="none" />
      <path d="M62 32 Q64 26 62 20" stroke="#DFB564" strokeWidth="1.5" strokeLinecap="round" fill="none" />
      {/* Star accent */}
      <text x="50" y="62" textAnchor="middle" fontSize="10" fill="#C59B4E" fontFamily="serif">✦</text>
    </svg>
  );
}

// ─── NAV ─────────────────────────────────────────────────────────────────────
function Nav({ page, setPage, cart, pushPage }) {
  const cartCount = cart.reduce((a, i) => a + i.qty, 0);
  const pages = ["Home", "Menu", "Reserve", "Track", "Reviews"];
  return (
    <nav style={S.nav}>
      <div style={{ display: "flex", alignItems: "center", cursor: "pointer" }} onClick={() => pushPage("Home")}>
        <Logo size={36} />
        <span style={S.logo}>Desi Delight</span>
      </div>
      <div style={S.navLinks}>
        {pages.map((p) => (
          <button key={p} style={S.navBtn(page === p)} onClick={() => pushPage(p)}>{p}</button>
        ))}
        <button
          style={{ ...S.navBtn(page === "Cart"), display: "flex", alignItems: "center" }}
          onClick={() => pushPage("Cart")}
        >
          🛒 {cartCount > 0 && <span style={S.cartBadge}>{cartCount}</span>}
        </button>
        <button style={S.navBtn(page === "Admin")} onClick={() => pushPage("Admin")}>Admin</button>
      </div>
    </nav>
  );
}

// ─── HOME ────────────────────────────────────────────────────────────────────
function Home({ pushPage }) {
  const stats = [
    { n: "50+", l: "Authentic Dishes" },
    { n: "10K+", l: "Happy Customers" },
    { n: "8 Yrs", l: "Of Excellence" },
    { n: "4.9★", l: "Average Rating" },
  ];
  return (
    <div>
      {/* Hero */}
      <section style={S.heroSection}>
        <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse at center, rgba(197,155,78,0.07) 0%, transparent 70%)", pointerEvents: "none" }} />
        <p style={{ fontFamily: "'Cormorant Garamond', serif", color: C.gold, fontSize: "1rem", letterSpacing: 6, textTransform: "uppercase", marginBottom: 16 }}>✦ Welcome to ✦</p>
        <h1 style={S.heroTitle}>
          Desi Delight
          <span style={S.heroGold}>Premium Indian Cuisine</span>
        </h1>
        <p style={S.heroSub}>
          Where every dish is a love letter to India's rich culinary heritage. Crafted with passion, served with pride.
        </p>
        <div style={{ display: "flex", gap: 16, flexWrap: "wrap", justifyContent: "center" }}>
          <button style={S.btnPrimary} onClick={() => pushPage("Menu")}>Explore Menu</button>
          <button style={S.btnSecondary} onClick={() => pushPage("Reserve")}>Reserve a Table</button>
        </div>
      </section>

      {/* Stats */}
      <section style={{ background: C.section, padding: "40px 24px", display: "flex", justifyContent: "center", gap: 48, flexWrap: "wrap", borderTop: `1px solid ${C.border}`, borderBottom: `1px solid ${C.border}` }}>
        {stats.map((s) => (
          <div key={s.n} style={{ textAlign: "center" }}>
            <div style={{ fontFamily: "'Playfair Display', serif", fontSize: "2.2rem", color: C.gold, fontWeight: 700 }}>{s.n}</div>
            <div style={{ color: C.muted, fontSize: "0.85rem", letterSpacing: 1 }}>{s.l}</div>
          </div>
        ))}
      </section>

      {/* Chef's Picks */}
      <section style={{ padding: "60px 24px 40px" }}>
        <h2 style={S.sectionTitle}>Chef's Picks</h2>
        <div style={S.goldLine} />
        <div style={S.cardGrid}>
          {MENU.filter((i) => [7, 13, 1, 12].includes(i.id)).map((item) => (
            <MiniCard key={item.id} item={item} onClick={() => pushPage("Detail", item)} />
          ))}
        </div>
      </section>

      {/* Our Story */}
      <section style={{ background: C.section, padding: "60px 32px", borderTop: `1px solid ${C.border}`, borderBottom: `1px solid ${C.border}` }}>
        <h2 style={S.sectionTitle}>Our Story</h2>
        <div style={S.goldLine} />
        <div style={{ maxWidth: 720, margin: "0 auto", textAlign: "center" }}>
          <p style={{ color: C.muted, lineHeight: 1.9, fontSize: "1.02rem", marginBottom: 20 }}>
            It began in 2018 with a dream and a single tandoor. Vivek Kumar, a passionate food lover from the heartland of Bihar, wanted to bring the soul of Indian cooking to every table — not just the recipe, but the emotion, the warmth, the story behind every spice.
          </p>
          <p style={{ color: C.muted, lineHeight: 1.9, fontSize: "1.02rem", marginBottom: 20 }}>
            Desi Delight started as a humble cloud kitchen in Chhapra. Within months, the aroma of our slow-cooked biryanis and crackling tandoori spreads had created a loyal family of thousands. We expanded — but never compromised. Every dish is still hand-crafted using recipes passed down through generations.
          </p>
          <p style={{ color: C.gold, lineHeight: 1.9, fontSize: "1.05rem", fontFamily: "'Cormorant Garamond', serif", fontStyle: "italic" }}>
            "Khana sirf pet nahi bharta — yeh dil bhi bharta hai." — Vivek Kumar, Founder
          </p>
        </div>
      </section>

      {/* Contact */}
      <section style={{ padding: "60px 24px", textAlign: "center" }}>
        <h2 style={S.sectionTitle}>Get In Touch</h2>
        <div style={S.goldLine} />
        <div style={{ display: "flex", gap: 24, justifyContent: "center", flexWrap: "wrap" }}>
          {[
            { icon: "📞", label: "Call Us", val: "8540868095", href: "tel:8540868095" },
            { icon: "💬", label: "WhatsApp", val: "8540868095", href: "https://wa.me/918540868095" },
            { icon: "✉️", label: "Email", val: "vivekkumarg28samelan@gmail.com", href: "mailto:vivekkumarg28samelan@gmail.com" },
          ].map((c) => (
            <a key={c.label} href={c.href} target="_blank" rel="noreferrer"
              style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, padding: "20px 28px", textDecoration: "none", minWidth: 180 }}>
              <div style={{ fontSize: "2rem", marginBottom: 6 }}>{c.icon}</div>
              <div style={{ color: C.gold, fontWeight: 600, marginBottom: 4 }}>{c.label}</div>
              <div style={{ color: C.muted, fontSize: "0.82rem" }}>{c.val}</div>
            </a>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer style={{ background: C.section, padding: "24px", textAlign: "center", borderTop: `1px solid ${C.border}` }}>
        <div style={{ color: C.gold, fontFamily: "'Playfair Display', serif", fontSize: "1.1rem", marginBottom: 6 }}>🍽 Desi Delight</div>
        <div style={{ color: C.muted, fontSize: "0.8rem" }}>Chhapra, Bihar • Delivery within 10km • © 2024 Desi Delight. All rights reserved.</div>
      </footer>
    </div>
  );
}

function MiniCard({ item, onClick }) {
  const [hov, setHov] = useState(false);
  return (
    <div
      style={{ ...S.foodCard, transform: hov ? "translateY(-4px)" : "none", boxShadow: hov ? `0 12px 40px rgba(197,155,78,0.15)` : "none" }}
      onClick={onClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
    >
      <img src={item.img} alt={item.name} style={S.foodImg} loading="lazy" />
      <div style={S.cardBody}>
        <div style={{ display: "flex", alignItems: "center", marginBottom: 4 }}>
          <span style={S.vegDot(item.veg)} />
          <span style={{ ...S.cardName, flex: 1 }}>{item.name}</span>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={S.cardPrice}>₹{item.price}</span>
          <span style={{ color: C.muted, fontSize: "0.75rem" }}>{spicyLabel(item.spicy)}</span>
        </div>
      </div>
    </div>
  );
}

// ─── MENU PAGE ───────────────────────────────────────────────────────────────
function MenuPage({ pushPage, cart, addToCart }) {
  const [search, setSearch] = useState("");
  const [cat, setCat] = useState("All");
  const [vegOnly, setVegOnly] = useState(false);

  const filtered = MENU.filter((i) => {
    const matchSearch = i.name.toLowerCase().includes(search.toLowerCase());
    const matchCat = cat === "All" || i.cat === cat;
    const matchVeg = !vegOnly || i.veg;
    return matchSearch && matchCat && matchVeg;
  });

  return (
    <div style={{ minHeight: "100vh" }}>
      {/* Header */}
      <div style={{ background: C.section, padding: "32px 24px 20px", borderBottom: `1px solid ${C.border}` }}>
        <h2 style={{ ...S.sectionTitle, marginBottom: 4 }}>Our Menu</h2>
        <div style={S.goldLine} />
        {/* Search */}
        <div style={{ maxWidth: 520, margin: "0 auto 16px", position: "relative" }}>
          <span style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: C.muted }}>🔍</span>
          <input
            style={{ ...S.input, paddingLeft: 40 }}
            placeholder="Search dishes..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        {/* Veg toggle */}
        <div style={{ display: "flex", justifyContent: "center", marginBottom: 16 }}>
          <label style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer", color: C.muted, fontSize: "0.9rem" }}>
            <div
              onClick={() => setVegOnly(!vegOnly)}
              style={{
                width: 44, height: 24, borderRadius: 12,
                background: vegOnly ? C.success : C.input,
                border: `1px solid ${C.border}`,
                position: "relative", transition: "background 0.2s", cursor: "pointer",
              }}
            >
              <div style={{
                position: "absolute", top: 2, left: vegOnly ? 22 : 2,
                width: 18, height: 18, borderRadius: "50%",
                background: C.text, transition: "left 0.2s",
              }} />
            </div>
            Veg Only
          </label>
        </div>
        {/* Category Pills */}
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", justifyContent: "center" }}>
          {CATEGORIES.map((c) => (
            <button key={c} onClick={() => setCat(c)} style={{
              background: cat === c ? C.gold : C.input,
              color: cat === c ? C.bg : C.muted,
              border: `1px solid ${cat === c ? C.gold : C.border}`,
              borderRadius: 20, padding: "6px 16px", cursor: "pointer",
              fontSize: "0.82rem", fontFamily: "'Inter', sans-serif", fontWeight: 500,
              transition: "all 0.2s",
            }}>{c}</button>
          ))}
        </div>
      </div>

      {/* Grid */}
      <div style={{ ...S.cardGrid, paddingTop: 28 }}>
        {filtered.length === 0 && (
          <div style={{ gridColumn: "1/-1", textAlign: "center", color: C.muted, padding: 40 }}>
            No dishes found. Try a different search.
          </div>
        )}
        {filtered.map((item) => (
          <div
            key={item.id}
            style={S.foodCard}
            onClick={() => pushPage("Detail", item)}
            onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-4px)"; e.currentTarget.style.boxShadow = `0 12px 40px rgba(197,155,78,0.15)`; }}
            onMouseLeave={(e) => { e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = "none"; }}
          >
            <img src={item.img} alt={item.name} style={S.foodImg} loading="lazy" />
            <div style={S.cardBody}>
              <div style={{ display: "flex", alignItems: "center", marginBottom: 4 }}>
                <span style={S.vegDot(item.veg)} />
                <span style={S.cardName}>{item.name}</span>
              </div>
              <p style={{ color: C.muted, fontSize: "0.8rem", marginBottom: 10, lineHeight: 1.5 }}>{item.desc.slice(0, 70)}…</p>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={S.cardPrice}>₹{item.price}</span>
                <button
                  style={{ ...S.btnPrimary, padding: "7px 16px", fontSize: "0.82rem" }}
                  onClick={(e) => { e.stopPropagation(); addToCart(item); }}
                >+ Add</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── PRODUCT DETAIL ──────────────────────────────────────────────────────────
function DetailPage({ item, addToCart }) {
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  if (!item) return <div style={{ padding: 40, color: C.muted }}>Item not found.</div>;

  const handleAdd = () => {
    for (let i = 0; i < qty; i++) addToCart(item);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div style={{ maxWidth: 700, margin: "0 auto", padding: "40px 24px" }}>
      <img src={item.img} alt={item.name} style={{ width: "100%", borderRadius: 16, height: 320, objectFit: "cover", marginBottom: 28, display: "block" }} />
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
        <span style={S.vegDot(item.veg)} />
        <span style={{ color: item.veg ? C.success : C.danger, fontSize: "0.85rem", fontWeight: 600 }}>{item.veg ? "Pure Veg" : "Non-Veg"}</span>
        <span style={{ color: C.muted, fontSize: "0.85rem" }}>• {item.cat}</span>
      </div>
      <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: "2rem", color: C.text, marginBottom: 4 }}>{item.name}</h1>
      <div style={{ color: C.gold, fontSize: "1.6rem", fontWeight: 700, marginBottom: 16 }}>₹{item.price}</div>
      {item.spicy > 0 && <div style={{ color: C.muted, marginBottom: 12, fontSize: "0.9rem" }}>Spice Level: <span style={{ color: C.goldHover }}>{spicyLabel(item.spicy)}</span></div>}
      <p style={{ color: C.muted, lineHeight: 1.8, marginBottom: 20, fontSize: "1rem" }}>{item.desc}</p>

      <div style={{ background: C.card, borderRadius: 10, padding: "16px 20px", marginBottom: 24, border: `1px solid ${C.border}` }}>
        <div style={{ color: C.gold, fontSize: "0.85rem", fontWeight: 600, marginBottom: 6, letterSpacing: 1 }}>INGREDIENTS</div>
        <div style={{ color: C.muted, fontSize: "0.9rem", lineHeight: 1.7 }}>{item.ingredients}</div>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 0, background: C.input, borderRadius: 8, border: `1px solid ${C.border}` }}>
          <button onClick={() => setQty(Math.max(1, qty - 1))} style={{ background: "none", border: "none", color: C.gold, fontSize: "1.3rem", cursor: "pointer", padding: "8px 16px" }}>−</button>
          <span style={{ color: C.text, fontWeight: 700, minWidth: 32, textAlign: "center" }}>{qty}</span>
          <button onClick={() => setQty(qty + 1)} style={{ background: "none", border: "none", color: C.gold, fontSize: "1.3rem", cursor: "pointer", padding: "8px 16px" }}>+</button>
        </div>
        <div style={{ color: C.muted, fontSize: "0.9rem" }}>Total: <span style={{ color: C.gold, fontWeight: 700 }}>₹{item.price * qty}</span></div>
        <button style={S.btnPrimary} onClick={handleAdd}>
          {added ? "✓ Added to Cart!" : `Add ${qty} to Cart`}
        </button>
      </div>
    </div>
  );
}

// ─── CART ────────────────────────────────────────────────────────────────────
function CartPage({ cart, setCart, pushPage }) {
  const total = cart.reduce((a, i) => a + i.price * i.qty, 0);
  const gst = Math.round(total * 0.05);
  const delivery = total > 0 ? 40 : 0;
  const grand = total + gst + delivery;

  const updateQty = (id, delta) => {
    setCart((prev) => {
      const idx = prev.findIndex((i) => i.id === id);
      if (idx === -1) return prev;
      const updated = [...prev];
      const newQty = updated[idx].qty + delta;
      if (newQty <= 0) {
        updated.splice(idx, 1);
      } else {
        updated[idx] = { ...updated[idx], qty: newQty };
      }
      return updated;
    });
  };

  if (cart.length === 0) return (
    <div style={{ textAlign: "center", padding: "80px 24px", color: C.muted }}>
      <div style={{ fontSize: "4rem", marginBottom: 16 }}>🛒</div>
      <div style={{ fontSize: "1.2rem", marginBottom: 24 }}>Your cart is empty</div>
      <button style={S.btnPrimary} onClick={() => pushPage("Menu")}>Browse Menu</button>
    </div>
  );

  return (
    <div style={{ maxWidth: 640, margin: "0 auto", padding: "32px 24px" }}>
      <h2 style={{ ...S.sectionTitle, textAlign: "left", marginBottom: 24 }}>Your Cart</h2>
      <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 24 }}>
        {cart.map((item) => (
          <div key={item.id} style={{ background: C.card, borderRadius: 10, padding: "14px 16px", border: `1px solid ${C.border}`, display: "flex", alignItems: "center", gap: 12 }}>
            <img src={item.img} alt={item.name} style={{ width: 60, height: 60, borderRadius: 8, objectFit: "cover" }} />
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 600, color: C.text, marginBottom: 2 }}>{item.name}</div>
              <div style={{ color: C.gold, fontSize: "0.9rem" }}>₹{item.price} each</div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 8, background: C.input, borderRadius: 6, padding: "4px 8px" }}>
              <button onClick={() => updateQty(item.id, -1)} style={{ background: "none", border: "none", color: C.gold, cursor: "pointer", fontSize: "1.1rem", padding: "0 4px" }}>−</button>
              <span style={{ color: C.text, fontWeight: 700, minWidth: 20, textAlign: "center" }}>{item.qty}</span>
              <button onClick={() => updateQty(item.id, 1)} style={{ background: "none", border: "none", color: C.gold, cursor: "pointer", fontSize: "1.1rem", padding: "0 4px" }}>+</button>
            </div>
            <span style={{ color: C.gold, fontWeight: 700, minWidth: 64, textAlign: "right" }}>₹{item.price * item.qty}</span>
          </div>
        ))}
      </div>

      {/* Bill Summary */}
      <div style={{ background: C.card, borderRadius: 12, padding: "20px", border: `1px solid ${C.border}`, marginBottom: 20 }}>
        <div style={{ color: C.gold, fontWeight: 700, marginBottom: 12, fontSize: "0.9rem", letterSpacing: 1 }}>BILL SUMMARY</div>
        {[["Subtotal", `₹${total}`], ["GST (5%)", `₹${gst}`], ["Delivery", `₹${delivery}`]].map(([l, v]) => (
          <div key={l} style={{ display: "flex", justifyContent: "space-between", color: C.muted, fontSize: "0.9rem", marginBottom: 8 }}>
            <span>{l}</span><span>{v}</span>
          </div>
        ))}
        <div style={{ borderTop: `1px solid ${C.border}`, paddingTop: 12, display: "flex", justifyContent: "space-between", fontWeight: 700, color: C.text, fontSize: "1.05rem" }}>
          <span>Grand Total</span><span style={{ color: C.gold }}>₹{grand}</span>
        </div>
      </div>

      <button style={{ ...S.btnPrimary, width: "100%", padding: "15px" }} onClick={() => pushPage("Checkout", { grand })}>
        Proceed to Checkout →
      </button>
    </div>
  );
}

// ─── CHECKOUT ────────────────────────────────────────────────────────────────
function CheckoutPage({ cart, setCart, data, pushPage }) {
  const [form, setForm] = useState({ name: "", phone: "", address: "", pincode: "", notes: "" });
  const [payMethod, setPayMethod] = useState("upi");
  const [step, setStep] = useState(1); // 1=details, 2=payment, 3=success
  const [loading, setLoading] = useState(false);
  const [orderId, setOrderId] = useState(null);
  const [errors, setErrors] = useState({});
  const [upiDone, setUpiDone] = useState(false);

  const VALID_PINCODES = ["841301", "841302", "841303", "841304", "841305"];
  const grand = data?.grand || 0;

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = "Name is required";
    if (!/^[6-9]\d{9}$/.test(form.phone)) e.phone = "Valid 10-digit mobile number required";
    if (!form.address.trim() || form.address.length < 10) e.address = "Full address required (min 10 chars)";
    if (!VALID_PINCODES.includes(form.pincode)) e.pincode = "Delivery only in Chhapra (841301–841305)";
    return e;
  };

  const handleDetailsNext = () => {
    const e = validate();
    if (Object.keys(e).length > 0) { setErrors(e); return; }
    setErrors({});
    setStep(2);
  };

  const handlePlaceOrder = async () => {
    if (payMethod === "upi" && !upiDone) {
      alert("Please complete UPI payment first, then confirm.");
      return;
    }
    setLoading(true);
    const items = cart.map((i) => `${i.name} x${i.qty}`).join(", ");
    const { data: row, error } = await supabase.from("orders").insert([{
      customer_name: form.name,
      phone: form.phone,
      address: form.address + ", PIN: " + form.pincode,
      items,
      total: grand,
      payment_method: payMethod,
      payment_status: payMethod === "upi" ? "paid" : "cod",
      status: "Order Placed",
      notes: form.notes,
    }]).select().single();

    if (error) { alert("Order failed. Please try again."); setLoading(false); return; }
    setOrderId(row.id);
    setCart([]);
    localStorage.removeItem("dd_cart");
    // Save order history
    const hist = JSON.parse(localStorage.getItem("dd_orders") || "[]");
    hist.unshift({ id: row.id, items, total: grand, status: "Order Placed", date: new Date().toLocaleString() });
    localStorage.setItem("dd_orders", JSON.stringify(hist.slice(0, 20)));
    setStep(3);
    setLoading(false);
  };

  if (step === 3) return (
    <div style={{ textAlign: "center", padding: "80px 24px", maxWidth: 480, margin: "0 auto" }}>
      <div style={{ fontSize: "4rem", marginBottom: 16 }}>🎉</div>
      <h2 style={{ fontFamily: "'Playfair Display', serif", color: C.gold, marginBottom: 8 }}>Order Placed!</h2>
      <p style={{ color: C.muted, marginBottom: 8 }}>Order ID: <span style={{ color: C.gold }}>#{orderId}</span></p>
      <p style={{ color: C.muted, marginBottom: 24 }}>Thank you, {form.name}! We'll prepare your food with love. 🍽</p>
      <a
        href={`https://wa.me/918540868095?text=New%20Order%20%23${orderId}%20from%20${encodeURIComponent(form.name)}%20(${form.phone})%3A%20${encodeURIComponent(cart.map ? "" : "")}%20Total%3A%20%E2%82%B9${grand}`}
        target="_blank" rel="noreferrer"
        style={{ ...S.btnPrimary, display: "inline-block", textDecoration: "none", marginBottom: 16 }}
      >Send Order on WhatsApp</a>
      <br />
      <button style={{ ...S.btnSecondary, marginTop: 8 }} onClick={() => pushPage("Track")}>Track My Order</button>
    </div>
  );

  return (
    <div style={{ maxWidth: 540, margin: "0 auto", padding: "32px 24px" }}>
      <h2 style={{ ...S.sectionTitle, textAlign: "left", marginBottom: 24 }}>
        {step === 1 ? "Delivery Details" : "Payment"}
      </h2>

      {step === 1 && (
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {[
            { key: "name", label: "Full Name", placeholder: "Your name", type: "text" },
            { key: "phone", label: "Mobile Number *", placeholder: "10-digit mobile number", type: "tel" },
            { key: "address", label: "Full Delivery Address *", placeholder: "House No, Street, Area...", type: "text" },
            { key: "pincode", label: "Pincode * (Chhapra only)", placeholder: "841301–841305", type: "text" },
            { key: "notes", label: "Special Instructions (optional)", placeholder: "Less spicy, extra sauce...", type: "text" },
          ].map(({ key, label, placeholder, type }) => (
            <div key={key}>
              <label style={{ color: C.muted, fontSize: "0.82rem", display: "block", marginBottom: 4 }}>{label}</label>
              <input
                style={{ ...S.input, borderColor: errors[key] ? C.danger : C.border }}
                type={type} placeholder={placeholder}
                value={form[key]}
                onChange={(e) => setForm({ ...form, [key]: e.target.value })}
              />
              {errors[key] && <div style={{ color: C.danger, fontSize: "0.78rem", marginTop: 3 }}>{errors[key]}</div>}
            </div>
          ))}
          <button style={{ ...S.btnPrimary, marginTop: 8 }} onClick={handleDetailsNext}>Continue to Payment →</button>
        </div>
      )}

      {step === 2 && (
        <div>
          <div style={{ background: C.card, borderRadius: 10, padding: 16, border: `1px solid ${C.border}`, marginBottom: 20 }}>
            <div style={{ color: C.muted, fontSize: "0.85rem", marginBottom: 4 }}>Grand Total</div>
            <div style={{ color: C.gold, fontSize: "1.8rem", fontWeight: 700 }}>₹{grand}</div>
          </div>

          {/* Payment Method */}
          <div style={{ marginBottom: 20 }}>
            {["upi", "cod"].map((m) => (
              <div key={m} onClick={() => setPayMethod(m)} style={{
                background: payMethod === m ? "rgba(197,155,78,0.1)" : C.input,
                border: `1px solid ${payMethod === m ? C.gold : C.border}`,
                borderRadius: 10, padding: "14px 18px", cursor: "pointer",
                display: "flex", alignItems: "center", gap: 12, marginBottom: 10,
              }}>
                <div style={{ width: 18, height: 18, borderRadius: "50%", border: `2px solid ${payMethod === m ? C.gold : C.muted}`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  {payMethod === m && <div style={{ width: 8, height: 8, borderRadius: "50%", background: C.gold }} />}
                </div>
                <div>
                  <div style={{ color: C.text, fontWeight: 600 }}>{m === "upi" ? "💳 Pay via UPI" : "💵 Cash on Delivery"}</div>
                  <div style={{ color: C.muted, fontSize: "0.8rem" }}>{m === "upi" ? `UPI ID: 8540868095@fam` : "Pay when your order arrives"}</div>
                </div>
              </div>
            ))}
          </div>

          {payMethod === "upi" && (
            <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 10, padding: 20, marginBottom: 16, textAlign: "center" }}>
              <div style={{ color: C.gold, fontWeight: 600, marginBottom: 8 }}>Pay ₹{grand} to:</div>
              <div style={{ color: C.text, fontSize: "1.2rem", fontWeight: 700, marginBottom: 4, letterSpacing: 1 }}>8540868095@fam</div>
              <div style={{ color: C.muted, fontSize: "0.82rem", marginBottom: 16 }}>Open any UPI app (GPay, PhonePe, Paytm) and pay to this UPI ID</div>
              <a
                href={`upi://pay?pa=8540868095@fam&pn=Desi%20Delight&am=${grand}&cu=INR`}
                style={{ ...S.btnPrimary, display: "inline-block", textDecoration: "none", marginBottom: 12 }}
              >Open UPI App</a>
              <br />
              <label style={{ display: "flex", alignItems: "center", gap: 8, justifyContent: "center", cursor: "pointer", marginTop: 12 }}>
                <input type="checkbox" checked={upiDone} onChange={(e) => setUpiDone(e.target.checked)}
                  style={{ accentColor: C.gold, width: 16, height: 16 }} />
                <span style={{ color: C.muted, fontSize: "0.88rem" }}>I have completed the UPI payment ✓</span>
              </label>
            </div>
          )}

          <button
            style={{ ...S.btnPrimary, width: "100%", padding: 15, opacity: loading ? 0.7 : 1 }}
            onClick={handlePlaceOrder}
            disabled={loading}
          >
            {loading ? "Placing Order..." : payMethod === "cod" ? "Place Order (COD)" : upiDone ? "Confirm Order" : "Pay & Confirm Order"}
          </button>
        </div>
      )}
    </div>
  );
}

// ─── TRACK ORDER ─────────────────────────────────────────────────────────────
function TrackPage() {
  const [orderId, setOrderId] = useState("");
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const channelRef = useRef(null);

  const fetchOrder = async (id) => {
    setLoading(true); setError("");
    const { data, error: err } = await supabase.from("orders").select("*").eq("id", id).single();
    if (err || !data) { setError("Order not found. Check your Order ID."); setOrder(null); }
    else setOrder(data);
    setLoading(false);
  };

  useEffect(() => {
    if (!order) return;
    if (channelRef.current) supabase.removeChannel(channelRef.current);
    const ch = supabase.channel(`order-${order.id}`)
      .on("postgres_changes", { event: "UPDATE", schema: "public", table: "orders", filter: `id=eq.${order.id}` },
        (payload) => setOrder(payload.new))
      .subscribe();
    channelRef.current = ch;
    return () => supabase.removeChannel(ch);
  }, [order?.id]);

  const stepIdx = order ? ORDER_STATUSES.indexOf(order.status) : -1;

  // Also check localStorage history for quick access
  const history = JSON.parse(localStorage.getItem("dd_orders") || "[]");

  return (
    <div style={{ maxWidth: 580, margin: "0 auto", padding: "40px 24px" }}>
      <h2 style={{ ...S.sectionTitle, marginBottom: 24 }}>Track Your Order</h2>
      <div style={{ display: "flex", gap: 10, marginBottom: 8 }}>
        <input style={S.input} placeholder="Enter Order ID..." value={orderId} onChange={(e) => setOrderId(e.target.value)} />
        <button style={{ ...S.btnPrimary, whiteSpace: "nowrap" }} onClick={() => fetchOrder(orderId)} disabled={loading}>
          {loading ? "..." : "Track"}
        </button>
      </div>
      {error && <div style={{ color: C.danger, fontSize: "0.85rem", marginBottom: 12 }}>{error}</div>}

      {order && (
        <div style={{ background: C.card, borderRadius: 14, border: `1px solid ${C.border}`, padding: 24, marginTop: 20 }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 16 }}>
            <div>
              <div style={{ color: C.muted, fontSize: "0.8rem" }}>ORDER ID</div>
              <div style={{ color: C.gold, fontWeight: 700 }}>#{order.id}</div>
            </div>
            <div style={{ textAlign: "right" }}>
              <div style={{ color: C.muted, fontSize: "0.8rem" }}>TOTAL</div>
              <div style={{ color: C.gold, fontWeight: 700 }}>₹{order.total}</div>
            </div>
          </div>
          <div style={{ color: C.muted, fontSize: "0.85rem", marginBottom: 20 }}>{order.items}</div>

          {/* Progress Steps */}
          <div style={{ position: "relative" }}>
            {ORDER_STATUSES.map((s, i) => (
              <div key={s} style={{ display: "flex", alignItems: "flex-start", gap: 16, marginBottom: i < ORDER_STATUSES.length - 1 ? 0 : 0 }}>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", minWidth: 32 }}>
                  <div style={{
                    width: 32, height: 32, borderRadius: "50%", border: `2px solid ${i <= stepIdx ? C.gold : C.border}`,
                    background: i <= stepIdx ? C.gold : C.input,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    color: i <= stepIdx ? C.bg : C.muted, fontWeight: 700, fontSize: "0.85rem",
                    zIndex: 1,
                  }}>
                    {i < stepIdx ? "✓" : i + 1}
                  </div>
                  {i < ORDER_STATUSES.length - 1 && (
                    <div style={{ width: 2, height: 32, background: i < stepIdx ? C.gold : C.border }} />
                  )}
                </div>
                <div style={{ paddingTop: 6, paddingBottom: 24 }}>
                  <div style={{ color: i <= stepIdx ? C.text : C.muted, fontWeight: i === stepIdx ? 700 : 400 }}>{s}</div>
                  {i === stepIdx && <div style={{ color: C.gold, fontSize: "0.78rem", marginTop: 2 }}>● Current Status</div>}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recent Orders from localStorage */}
      {history.length > 0 && !order && (
        <div style={{ marginTop: 28 }}>
          <div style={{ color: C.muted, fontSize: "0.85rem", marginBottom: 12 }}>Recent Orders:</div>
          {history.slice(0, 5).map((o) => (
            <div key={o.id} style={{ background: C.card, borderRadius: 8, padding: "12px 14px", marginBottom: 8, border: `1px solid ${C.border}`, cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "center" }}
              onClick={() => { setOrderId(String(o.id)); fetchOrder(o.id); }}>
              <div>
                <div style={{ color: C.gold, fontWeight: 600, fontSize: "0.88rem" }}>#{o.id}</div>
                <div style={{ color: C.muted, fontSize: "0.78rem" }}>{o.items?.slice(0, 40)}…</div>
              </div>
              <div style={{ color: C.text, fontWeight: 700 }}>₹{o.total}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── REVIEWS ─────────────────────────────────────────────────────────────────
function ReviewsPage() {
  const [reviews, setReviews] = useState([]);
  const [form, setForm] = useState({ name: "", rating: 5, comment: "" });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    supabase.from("reviews").select("*").order("created_at", { ascending: false })
      .then(({ data }) => { if (data) setReviews(data); });
  }, []);

  const handleSubmit = async () => {
    if (!form.name.trim() || !form.comment.trim()) { alert("Please enter your name and review."); return; }
    setLoading(true);
    const { data: row, error } = await supabase.from("reviews").insert([{
      name: form.name, rating: form.rating, comment: form.comment,
    }]).select().single();
    if (!error && row) {
      setReviews((prev) => [row, ...prev]);
      setForm({ name: "", rating: 5, comment: "" });
      setSubmitted(true);
      setTimeout(() => setSubmitted(false), 3000);
    }
    setLoading(false);
  };

  const avg = reviews.length ? (reviews.reduce((a, r) => a + r.rating, 0) / reviews.length).toFixed(1) : "—";

  return (
    <div style={{ maxWidth: 640, margin: "0 auto", padding: "40px 24px" }}>
      <h2 style={{ ...S.sectionTitle, marginBottom: 4 }}>Customer Reviews</h2>
      <div style={S.goldLine} />

      {reviews.length > 0 && (
        <div style={{ textAlign: "center", marginBottom: 28 }}>
          <div style={{ fontSize: "3rem", color: C.gold, fontWeight: 700 }}>{avg}</div>
          <StarRating value={Math.round(parseFloat(avg))} />
          <div style={{ color: C.muted, fontSize: "0.85rem", marginTop: 4 }}>{reviews.length} reviews</div>
        </div>
      )}

      {/* Submit Review */}
      <div style={{ background: C.card, borderRadius: 14, padding: 20, border: `1px solid ${C.border}`, marginBottom: 28 }}>
        <div style={{ color: C.gold, fontWeight: 600, marginBottom: 14 }}>Write a Review</div>
        <input style={{ ...S.input, marginBottom: 10 }} placeholder="Your name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
        <div style={{ marginBottom: 10 }}>
          <div style={{ color: C.muted, fontSize: "0.82rem", marginBottom: 4 }}>Rating</div>
          <StarRating value={form.rating} onChange={(r) => setForm({ ...form, rating: r })} />
        </div>
        <textarea style={{ ...S.input, minHeight: 80, resize: "vertical", marginBottom: 12 }}
          placeholder="Share your experience..."
          value={form.comment}
          onChange={(e) => setForm({ ...form, comment: e.target.value })}
        />
        <button style={{ ...S.btnPrimary, opacity: loading ? 0.7 : 1 }} onClick={handleSubmit} disabled={loading}>
          {submitted ? "✓ Review Submitted!" : loading ? "Submitting..." : "Submit Review"}
        </button>
      </div>

      {/* Reviews List */}
      {reviews.map((r) => (
        <div key={r.id} style={{ background: C.card, borderRadius: 12, padding: 18, border: `1px solid ${C.border}`, marginBottom: 12 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
            <div style={{ fontWeight: 600, color: C.text }}>{r.name}</div>
            <div style={{ color: C.muted, fontSize: "0.75rem" }}>{new Date(r.created_at).toLocaleDateString()}</div>
          </div>
          <StarRating value={r.rating} />
          <p style={{ color: C.muted, marginTop: 8, lineHeight: 1.6, fontSize: "0.9rem" }}>{r.comment}</p>
        </div>
      ))}
    </div>
  );
}

// ─── RESERVATION ─────────────────────────────────────────────────────────────
function ReservePage() {
  const [form, setForm] = useState({ name: "", phone: "", date: "", time: "", guests: "2", notes: "" });
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [errors, setErrors] = useState({});
  const [waLink, setWaLink] = useState("");

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = "Name required";
    if (!/^[6-9]\d{9}$/.test(form.phone)) e.phone = "Valid mobile number required";
    if (!form.date) e.date = "Date required";
    if (!form.time) e.time = "Time required";
    return e;
  };

  const handleReserve = async () => {
    const e = validate();
    if (Object.keys(e).length > 0) { setErrors(e); return; }
    setErrors({}); setLoading(true);
    const { error } = await supabase.from("reservations").insert([{
      name: form.name, phone: form.phone,
      date: form.date, time: form.time,
      guests: parseInt(form.guests), notes: form.notes,
      status: "pending",
    }]);
    if (!error) {
      const msg = `Table Reservation Request:\nName: ${form.name}\nPhone: ${form.phone}\nDate: ${form.date}\nTime: ${form.time}\nGuests: ${form.guests}\nNotes: ${form.notes || "—"}`;
      setWaLink(`https://wa.me/918540868095?text=${encodeURIComponent(msg)}`);
      setDone(true);
    } else {
      alert("Reservation failed. Please try again.");
    }
    setLoading(false);
  };

  if (done) return (
    <div style={{ textAlign: "center", padding: "80px 24px", maxWidth: 460, margin: "0 auto" }}>
      <div style={{ fontSize: "3.5rem", marginBottom: 16 }}>🎊</div>
      <h2 style={{ fontFamily: "'Playfair Display', serif", color: C.gold, marginBottom: 8 }}>Reservation Submitted!</h2>
      <p style={{ color: C.muted, marginBottom: 24 }}>We'll confirm your table for {form.date} at {form.time}. Please send us a WhatsApp message to confirm quickly.</p>
      <a href={waLink} target="_blank" rel="noreferrer" style={{ ...S.btnPrimary, display: "inline-block", textDecoration: "none" }}>
        Confirm on WhatsApp
      </a>
    </div>
  );

  return (
    <div style={{ maxWidth: 520, margin: "0 auto", padding: "40px 24px" }}>
      <h2 style={{ ...S.sectionTitle, marginBottom: 4 }}>Reserve a Table</h2>
      <div style={S.goldLine} />
      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        {[
          { key: "name", label: "Full Name", placeholder: "Your name", type: "text" },
          { key: "phone", label: "Mobile Number", placeholder: "10-digit number", type: "tel" },
          { key: "date", label: "Date", placeholder: "", type: "date" },
          { key: "time", label: "Time", placeholder: "", type: "time" },
        ].map(({ key, label, placeholder, type }) => (
          <div key={key}>
            <label style={{ color: C.muted, fontSize: "0.82rem", display: "block", marginBottom: 4 }}>{label}</label>
            <input style={{ ...S.input, borderColor: errors[key] ? C.danger : C.border }}
              type={type} placeholder={placeholder}
              value={form[key]} onChange={(e) => setForm({ ...form, [key]: e.target.value })} />
            {errors[key] && <div style={{ color: C.danger, fontSize: "0.78rem", marginTop: 3 }}>{errors[key]}</div>}
          </div>
        ))}
        <div>
          <label style={{ color: C.muted, fontSize: "0.82rem", display: "block", marginBottom: 4 }}>Number of Guests</label>
          <select style={{ ...S.input }} value={form.guests} onChange={(e) => setForm({ ...form, guests: e.target.value })}>
            {[1,2,3,4,5,6,7,8,9,10].map((n) => <option key={n} value={n}>{n} {n === 1 ? "Guest" : "Guests"}</option>)}
          </select>
        </div>
        <div>
          <label style={{ color: C.muted, fontSize: "0.82rem", display: "block", marginBottom: 4 }}>Special Requests (optional)</label>
          <textarea style={{ ...S.input, minHeight: 70, resize: "vertical" }}
            placeholder="Anniversary setup, dietary needs..."
            value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} />
        </div>
        <button style={{ ...S.btnPrimary, opacity: loading ? 0.7 : 1 }} onClick={handleReserve} disabled={loading}>
          {loading ? "Booking..." : "Reserve Table"}
        </button>
      </div>
    </div>
  );
}

// ─── ADMIN ────────────────────────────────────────────────────────────────────
function AdminPage() {
  const [authed, setAuthed] = useState(false);
  const [pw, setPw] = useState("");
  const [pwErr, setPwErr] = useState("");
  const [tab, setTab] = useState("orders");
  const [orders, setOrders] = useState([]);
  const [reservations, setReservations] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loadingId, setLoadingId] = useState(null);

  const login = () => {
    if (pw === "iamgenius") { setAuthed(true); setPwErr(""); }
    else setPwErr("Wrong password. Access denied.");
  };

  useEffect(() => {
    if (!authed) return;
    // Fetch all data
    supabase.from("orders").select("*").order("created_at", { ascending: false }).then(({ data }) => { if (data) setOrders(data); });
    supabase.from("reservations").select("*").order("created_at", { ascending: false }).then(({ data }) => { if (data) setReservations(data); });
    supabase.from("reviews").select("*").order("created_at", { ascending: false }).then(({ data }) => { if (data) setReviews(data); });

    // Realtime orders
    const ch = supabase.channel("admin-orders")
      .on("postgres_changes", { event: "*", schema: "public", table: "orders" }, () => {
        supabase.from("orders").select("*").order("created_at", { ascending: false }).then(({ data }) => { if (data) setOrders(data); });
      }).subscribe();
    return () => supabase.removeChannel(ch);
  }, [authed]);

  const advanceOrder = async (order) => {
    const idx = ORDER_STATUSES.indexOf(order.status);
    if (idx >= ORDER_STATUSES.length - 1 || loadingId === order.id) return;
    setLoadingId(order.id);
    const next = ORDER_STATUSES[idx + 1];
    await supabase.from("orders").update({ status: next }).eq("id", order.id);
    setOrders((prev) => prev.map((o) => o.id === order.id ? { ...o, status: next } : o));
    setLoadingId(null);
  };

  const updateReservation = async (id, status) => {
    await supabase.from("reservations").update({ status }).eq("id", id);
    setReservations((prev) => prev.map((r) => r.id === id ? { ...r, status } : r));
  };

  const revenue = orders.filter((o) => o.payment_status === "paid").reduce((a, o) => a + (o.total || 0), 0);
  const todayOrders = orders.filter((o) => new Date(o.created_at).toDateString() === new Date().toDateString()).length;

  if (!authed) return (
    <div style={{ maxWidth: 380, margin: "80px auto", padding: 24 }}>
      <div style={{ textAlign: "center", marginBottom: 28 }}>
        <Logo size={52} />
        <h2 style={{ fontFamily: "'Playfair Display', serif", color: C.gold, marginTop: 8 }}>Admin Access</h2>
        <p style={{ color: C.muted, fontSize: "0.85rem" }}>Password protected area</p>
      </div>
      <input style={{ ...S.input, marginBottom: 10, borderColor: pwErr ? C.danger : C.border }}
        type="password" placeholder="Enter admin password"
        value={pw} onChange={(e) => setPw(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && login()} />
      {pwErr && <div style={{ color: C.danger, fontSize: "0.82rem", marginBottom: 10 }}>{pwErr}</div>}
      <button style={{ ...S.btnPrimary, width: "100%" }} onClick={login}>Login</button>
    </div>
  );

  const tabStyle = (t) => ({ ...S.navBtn(tab === t), padding: "8px 18px", fontSize: "0.85rem" });

  return (
    <div style={{ padding: "28px 20px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20, flexWrap: "wrap", gap: 12 }}>
        <h2 style={{ fontFamily: "'Playfair Display', serif", color: C.gold }}>Admin Dashboard</h2>
        <button style={S.btnSecondary} onClick={() => setAuthed(false)}>Logout</button>
      </div>

      {/* Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))", gap: 12, marginBottom: 24 }}>
        {[
          { l: "Total Orders", v: orders.length },
          { l: "Today's Orders", v: todayOrders },
          { l: "UPI Revenue", v: `₹${revenue}` },
          { l: "Reservations", v: reservations.length },
          { l: "Reviews", v: reviews.length },
        ].map(({ l, v }) => (
          <div key={l} style={{ background: C.card, borderRadius: 10, padding: "16px", border: `1px solid ${C.border}` }}>
            <div style={{ color: C.gold, fontSize: "1.5rem", fontWeight: 700 }}>{v}</div>
            <div style={{ color: C.muted, fontSize: "0.78rem" }}>{l}</div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
        {["orders", "reservations", "reviews"].map((t) => (
          <button key={t} style={tabStyle(t)} onClick={() => setTab(t)}>{t.charAt(0).toUpperCase() + t.slice(1)}</button>
        ))}
      </div>

      {/* Orders Tab */}
      {tab === "orders" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {orders.length === 0 && <div style={{ color: C.muted, padding: 20 }}>No orders yet.</div>}
          {orders.map((o) => (
            <div key={o.id} style={{ background: C.card, borderRadius: 12, padding: 18, border: `1px solid ${C.border}` }}>
              <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 8, marginBottom: 8 }}>
                <div>
                  <span style={{ color: C.gold, fontWeight: 700 }}>#{o.id}</span>
                  <span style={{ color: C.muted, fontSize: "0.78rem", marginLeft: 8 }}>{new Date(o.created_at).toLocaleString()}</span>
                </div>
                <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                  <span style={{ background: C.input, color: C.gold, borderRadius: 6, padding: "3px 10px", fontSize: "0.78rem", fontWeight: 600 }}>{o.status}</span>
                  <span style={{ color: o.payment_status === "paid" ? C.success : C.muted, fontSize: "0.78rem" }}>{o.payment_status?.toUpperCase()}</span>
                </div>
              </div>
              <div style={{ color: C.text, fontWeight: 600, marginBottom: 4 }}>{o.customer_name} • {o.phone}</div>
              <div style={{ color: C.muted, fontSize: "0.82rem", marginBottom: 4 }}>{o.address}</div>
              <div style={{ color: C.muted, fontSize: "0.82rem", marginBottom: 8 }}>{o.items}</div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ color: C.gold, fontWeight: 700 }}>₹{o.total}</span>
                {o.status !== "Delivered" && (
                  <button
                    style={{ ...S.btnPrimary, padding: "7px 16px", fontSize: "0.8rem", opacity: loadingId === o.id ? 0.6 : 1 }}
                    onClick={() => advanceOrder(o)}
                    disabled={loadingId === o.id}
                  >
                    {loadingId === o.id ? "Updating..." : `Advance → ${ORDER_STATUSES[ORDER_STATUSES.indexOf(o.status) + 1] || ""}`}
                  </button>
                )}
                {o.status === "Delivered" && <span style={{ color: C.success, fontWeight: 600 }}>✓ Delivered</span>}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Reservations Tab */}
      {tab === "reservations" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {reservations.length === 0 && <div style={{ color: C.muted, padding: 20 }}>No reservations yet.</div>}
          {reservations.map((r) => (
            <div key={r.id} style={{ background: C.card, borderRadius: 12, padding: 18, border: `1px solid ${C.border}` }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                <div style={{ color: C.gold, fontWeight: 700 }}>{r.name} • {r.phone}</div>
                <span style={{
                  background: r.status === "confirmed" ? "rgba(76,175,80,0.15)" : r.status === "rejected" ? "rgba(229,57,53,0.15)" : C.input,
                  color: r.status === "confirmed" ? C.success : r.status === "rejected" ? C.danger : C.muted,
                  borderRadius: 6, padding: "3px 10px", fontSize: "0.78rem", fontWeight: 600,
                }}>{r.status?.toUpperCase()}</span>
              </div>
              <div style={{ color: C.muted, fontSize: "0.85rem", marginBottom: 4 }}>📅 {r.date} at {r.time} • 👥 {r.guests} guests</div>
              {r.notes && <div style={{ color: C.muted, fontSize: "0.8rem", marginBottom: 8 }}>Note: {r.notes}</div>}
              {r.status === "pending" && (
                <div style={{ display: "flex", gap: 8 }}>
                  <button style={{ ...S.btnPrimary, padding: "7px 14px", fontSize: "0.8rem" }} onClick={() => updateReservation(r.id, "confirmed")}>✓ Confirm</button>
                  <button style={{ ...S.btnSecondary, padding: "7px 14px", fontSize: "0.8rem", borderColor: C.danger, color: C.danger }} onClick={() => updateReservation(r.id, "rejected")}>✗ Reject</button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Reviews Tab */}
      {tab === "reviews" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {reviews.length === 0 && <div style={{ color: C.muted, padding: 20 }}>No reviews yet.</div>}
          {reviews.map((r) => (
            <div key={r.id} style={{ background: C.card, borderRadius: 12, padding: 16, border: `1px solid ${C.border}` }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                <span style={{ fontWeight: 600, color: C.text }}>{r.name}</span>
                <span style={{ color: C.muted, fontSize: "0.75rem" }}>{new Date(r.created_at).toLocaleDateString()}</span>
              </div>
              <StarRating value={r.rating} />
              <p style={{ color: C.muted, marginTop: 6, fontSize: "0.85rem" }}>{r.comment}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── APP ROOT ─────────────────────────────────────────────────────────────────
export default function App() {
  const [page, setPage] = useState("Home");
  const [pageData, setPageData] = useState(null);
  const [history, setHistory] = useState([]);
  const [cart, setCart] = useState(() => {
    try { return JSON.parse(localStorage.getItem("dd_cart") || "[]"); } catch { return []; }
  });

  // Sync cart to localStorage
  useEffect(() => {
    localStorage.setItem("dd_cart", JSON.stringify(cart));
  }, [cart]);

  // Multi-tab cart sync
  useEffect(() => {
    const onStorage = (e) => {
      if (e.key === "dd_cart") {
        try { setCart(JSON.parse(e.newValue || "[]")); } catch {}
      }
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const pushPage = useCallback((newPage, data = null) => {
    setHistory((h) => [...h, page]);
    setPage(newPage);
    setPageData(data);
    window.scrollTo(0, 0);
  }, [page]);

  const addToCart = useCallback((item) => {
    setCart((prev) => {
      const idx = prev.findIndex((i) => i.id === item.id);
      if (idx !== -1) {
        const updated = [...prev];
        updated[idx] = { ...updated[idx], qty: updated[idx].qty + 1 };
        return updated;
      }
      return [...prev, { ...item, qty: 1 }];
    });
  }, []);

  const renderPage = () => {
    switch (page) {
      case "Home": return <Home pushPage={pushPage} />;
      case "Menu": return <MenuPage pushPage={pushPage} cart={cart} addToCart={addToCart} />;
      case "Detail": return <DetailPage item={pageData} addToCart={addToCart} />;
      case "Cart": return <CartPage cart={cart} setCart={setCart} pushPage={pushPage} />;
      case "Checkout": return <CheckoutPage cart={cart} setCart={setCart} data={pageData} pushPage={pushPage} />;
      case "Track": return <TrackPage />;
      case "Reviews": return <ReviewsPage />;
      case "Reserve": return <ReservePage />;
      case "Admin": return <AdminPage />;
      default: return <Home pushPage={pushPage} />;
    }
  };

  return (
    <div style={S.app}>
      <Nav page={page} setPage={setPage} cart={cart} pushPage={pushPage} />
      {renderPage()}
      <FloatBack page={page} setPage={setPage} history={history} setHistory={setHistory} />
    </div>
  );
}
