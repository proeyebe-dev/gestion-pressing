/**
 * ╔══════════════════════════════════════════════════════════════╗
 * ║          MAJESTIC PRESSING — Application Complète            ║
 * ║          React Native Web · TypeScript · All-in-one          ║
 * ╚══════════════════════════════════════════════════════════════╝
 *
 * PAGES :
 *   1. Écran de connexion (Login)
 *   2. Tableau de bord (Dashboard)
 *   3. Clients
 *   4. Vêtements
 *   5. Statuts & Workflow
 *   6. Paiements & Factures
 *   7. Stock
 *   8. Profil / Paramètres
 *
 * STACK :
 *   - React 18 (hooks)
 *   - CSS-in-JS via StyleSheet (React Native compatible)
 *   - TypeScript interfaces intégrées
 *   - IndexedDB (via idb) — adapter dans /db/index.ts en production
 */

import React, {
  useState,
  useEffect,
  useCallback,
  useMemo,
  ReactNode,
  CSSProperties,
} from "react";

// ─────────────────────────────────────────────
// 1. TYPES & INTERFACES
// ─────────────────────────────────────────────
type Page =
  | "login"
  | "dashboard"
  | "clients"
  | "vetements"
  | "statuts"
  | "paiements"
  | "stock"
  | "profil";

type StatutVetement = "en_attente" | "en_lavage" | "pret" | "recupere";
type ModePaiement = "Espèces" | "Mobile Money" | "Carte";

interface Client {
  id: string;
  nom: string;
  telephone: string;
  adresse: string;
  createdAt: string;
}

interface Vetement {
  id: string;
  type: string;
  couleur: string;
  description: string;
  dateDepot: string;
  idClient: string;
  statut: StatutVetement;
}

interface Paiement {
  id: string;
  montant: number;
  datePaiement: string;
  modePaiement: ModePaiement;
  idVetement: string;
  idClient: string;
}

interface ProduitStock {
  id: string;
  nomProduit: string;
  quantite: number;
  unite: string;
  seuilAlerte: number;
  quantiteMax: number;
}

// ─────────────────────────────────────────────
// 2. DONNÉES INITIALES (mock IndexedDB)
// ─────────────────────────────────────────────
const INIT_CLIENTS: Client[] = [
  { id: "C001", nom: "Ngo Biyong Estelle", telephone: "+237 691 234 567", adresse: "Bastos, Yaoundé", createdAt: "2025-05-10" },
  { id: "C002", nom: "Mvondo Jean-Serge", telephone: "+237 677 891 234", adresse: "Mvan, Yaoundé", createdAt: "2025-05-11" },
  { id: "C003", nom: "Abena Flore", telephone: "+237 656 445 221", adresse: "Omnisport, Yaoundé", createdAt: "2025-05-12" },
  { id: "C004", nom: "Kamto Alain", telephone: "+237 699 112 088", adresse: "Mendong, Yaoundé", createdAt: "2025-05-13" },
  { id: "C005", nom: "Effa Marie-Thérèse", telephone: "+237 681 776 530", adresse: "Nsam, Yaoundé", createdAt: "2025-05-13" },
];

const INIT_VETEMENTS: Vetement[] = [
  { id: "V001", type: "Costume", couleur: "Gris anthracite", description: "2 pièces, tissu délicat", dateDepot: "2025-05-14", idClient: "C001", statut: "en_lavage" },
  { id: "V002", type: "Robe de soirée", couleur: "Rouge bordeaux", description: "Séchage délicat", dateDepot: "2025-05-13", idClient: "C003", statut: "pret" },
  { id: "V003", type: "Chemise ×3", couleur: "Blanc", description: "Amidon fort", dateDepot: "2025-05-13", idClient: "C002", statut: "en_attente" },
  { id: "V004", type: "Manteau", couleur: "Camel", description: "Doublure fragile", dateDepot: "2025-05-12", idClient: "C005", statut: "en_lavage" },
  { id: "V005", type: "Pantalon ×2", couleur: "Marine", description: "", dateDepot: "2025-05-11", idClient: "C004", statut: "recupere" },
];

const INIT_PAIEMENTS: Paiement[] = [
  { id: "P001", montant: 8500, datePaiement: "2025-05-14", modePaiement: "Espèces", idVetement: "V005", idClient: "C004" },
  { id: "P002", montant: 3500, datePaiement: "2025-05-13", modePaiement: "Mobile Money", idVetement: "V002", idClient: "C003" },
  { id: "P003", montant: 12000, datePaiement: "2025-05-12", modePaiement: "Carte", idVetement: "V004", idClient: "C005" },
];

const INIT_STOCK: ProduitStock[] = [
  { id: "S001", nomProduit: "Lessive industrielle", quantite: 2, unite: "kg", seuilAlerte: 10, quantiteMax: 50 },
  { id: "S002", nomProduit: "Détachant tissu", quantite: 8, unite: "unités", seuilAlerte: 10, quantiteMax: 30 },
  { id: "S003", nomProduit: "Sacs plastiques", quantite: 15, unite: "pièces", seuilAlerte: 20, quantiteMax: 100 },
  { id: "S004", nomProduit: "Adoucissant", quantite: 18, unite: "litres", seuilAlerte: 5, quantiteMax: 25 },
  { id: "S005", nomProduit: "Cintres plastique", quantite: 240, unite: "pièces", seuilAlerte: 50, quantiteMax: 300 },
  { id: "S006", nomProduit: "Eau de Javel", quantite: 6, unite: "litres", seuilAlerte: 3, quantiteMax: 20 },
];

// ─────────────────────────────────────────────
// 3. DESIGN SYSTEM — TOKENS & STYLES
// ─────────────────────────────────────────────
const COLORS = {
  // Palette principale — Or & Noir luxueux
  gold:        "#C9A84C",
  goldLight:   "#F0D080",
  goldPale:    "#FBF4E3",
  goldDark:    "#8B6914",
  black:       "#0A0A0F",
  dark:        "#141420",
  darkCard:    "#1C1C2E",
  darkBorder:  "#2A2A3E",
  charcoal:    "#252535",
  white:       "#FFFFFF",
  offWhite:    "#F8F6F0",
  // Textes
  textPrimary:   "#F8F6F0",
  textSecondary: "#A8A4B8",
  textMuted:     "#5C5870",
  // Statuts
  success:     "#2ECC71",
  successPale: "#0D2E1A",
  warning:     "#F39C12",
  warningPale: "#2E1F0A",
  danger:      "#E74C3C",
  dangerPale:  "#2E0A0A",
  info:        "#3498DB",
  infoPale:    "#0A1E2E",
};

const FONTS = {
  display:  "'Playfair Display', 'Georgia', serif",
  body:     "'DM Sans', 'Helvetica Neue', sans-serif",
  mono:     "'JetBrains Mono', 'Courier New', monospace",
};

const RADIUS = { sm: "8px", md: "12px", lg: "18px", xl: "24px", full: "999px" };

const SHADOW = {
  sm:  "0 2px 8px rgba(0,0,0,.35)",
  md:  "0 4px 20px rgba(0,0,0,.45)",
  lg:  "0 8px 40px rgba(0,0,0,.55)",
  gold:"0 4px 24px rgba(201,168,76,.25)",
};

// CSS injecté globalement
const GLOBAL_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700;800&family=DM+Sans:wght@300;400;500;600&family=JetBrains+Mono:wght@400;500&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  html, body, #root { height: 100%; font-family: 'DM Sans', sans-serif; background: #0A0A0F; color: #F8F6F0; }
  ::-webkit-scrollbar { width: 5px; background: #141420; }
  ::-webkit-scrollbar-thumb { background: #2A2A3E; border-radius: 4px; }
  input, select, textarea, button { font-family: inherit; }
  * { -webkit-tap-highlight-color: transparent; }

  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(16px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes fadeIn {
    from { opacity: 0; } to { opacity: 1; }
  }
  @keyframes shimmer {
    0%   { background-position: -400px 0; }
    100% { background-position: 400px 0; }
  }
  @keyframes spin {
    from { transform: rotate(0deg); }
    to   { transform: rotate(360deg); }
  }
  @keyframes pulse {
    0%,100% { opacity:1; } 50% { opacity:.5; }
  }
  @keyframes slideIn {
    from { transform: translateX(-20px); opacity: 0; }
    to   { transform: translateX(0); opacity: 1; }
  }
  @keyframes barFill {
    from { width: 0; } to { width: var(--target-w); }
  }

  .anim-fade-up  { animation: fadeUp .5s ease both; }
  .anim-fade-in  { animation: fadeIn .4s ease both; }
  .anim-slide-in { animation: slideIn .4s ease both; }

  .d1 { animation-delay: .05s; }
  .d2 { animation-delay: .1s;  }
  .d3 { animation-delay: .15s; }
  .d4 { animation-delay: .2s;  }
  .d5 { animation-delay: .25s; }
  .d6 { animation-delay: .3s;  }

  .gold-text {
    background: linear-gradient(135deg, #C9A84C, #F0D080, #C9A84C);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  .hover-lift {
    transition: transform .2s ease, box-shadow .2s ease;
    cursor: pointer;
  }
  .hover-lift:hover { transform: translateY(-2px); box-shadow: 0 8px 30px rgba(201,168,76,.2); }

  .btn-press:active { transform: scale(.97); }
`;

// ─────────────────────────────────────────────
// 4. UTILITAIRES
// ─────────────────────────────────────────────
const genId = () => Math.random().toString(36).slice(2, 9).toUpperCase();
const today = () => new Date().toISOString().split("T")[0];
const fmtDate = (d: string) =>
  new Date(d).toLocaleDateString("fr-FR", { day: "2-digit", month: "short", year: "numeric" });
const fmtMoney = (n: number) =>
  new Intl.NumberFormat("fr-CM").format(n) + " FCFA";

const STATUT_LABELS: Record<StatutVetement, string> = {
  en_attente: "En attente",
  en_lavage:  "En lavage",
  pret:       "Prêt",
  recupere:   "Récupéré",
};
const STATUT_COLORS: Record<StatutVetement, { bg: string; text: string; dot: string }> = {
  en_attente: { bg: "#2E1F0A", text: "#F39C12", dot: "#F39C12" },
  en_lavage:  { bg: "#0A1E2E", text: "#3498DB", dot: "#3498DB" },
  pret:       { bg: "#0D2E1A", text: "#2ECC71", dot: "#2ECC71" },
  recupere:   { bg: "#1C1C2E", text: "#A8A4B8", dot: "#5C5870" },
};

// ─────────────────────────────────────────────
// 5. COMPOSANTS DE BASE
// ─────────────────────────────────────────────

/** Logo SVG Majestic Pressing */
const MajesticLogo: React.FC<{ size?: number; showText?: boolean }> = ({
  size = 48, showText = true,
}) => (
  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none">
      <defs>
        <linearGradient id="gGold" x1="0" y1="0" x2="48" y2="48" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#F0D080"/>
          <stop offset="50%" stopColor="#C9A84C"/>
          <stop offset="100%" stopColor="#8B6914"/>
        </linearGradient>
        <linearGradient id="gDark" x1="0" y1="0" x2="48" y2="48" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#1C1C2E"/>
          <stop offset="100%" stopColor="#0A0A0F"/>
        </linearGradient>
      </defs>
      {/* Fond hexagonal */}
      <polygon points="24,2 44,13 44,35 24,46 4,35 4,13" fill="url(#gDark)" stroke="url(#gGold)" strokeWidth="1.5"/>
      {/* Couronne stylisée */}
      <path d="M14 30 L14 22 L18 26 L24 18 L30 26 L34 22 L34 30 Z" fill="url(#gGold)" opacity="0.95"/>
      {/* Cintre */}
      <path d="M18 32 Q24 28 30 32" stroke="url(#gGold)" strokeWidth="1.8" fill="none" strokeLinecap="round"/>
      {/* Point du cintre */}
      <circle cx="24" cy="28" r="1.5" fill="#F0D080"/>
      {/* Étoiles déco */}
      <circle cx="10" cy="18" r="1" fill="#C9A84C" opacity="0.6"/>
      <circle cx="38" cy="18" r="1" fill="#C9A84C" opacity="0.6"/>
      <circle cx="24" cy="8"  r="1" fill="#C9A84C" opacity="0.6"/>
    </svg>
    {showText && (
      <div>
        <div style={{
          fontFamily: FONTS.display,
          fontSize: size * 0.5,
          fontWeight: 700,
          background: `linear-gradient(135deg, ${COLORS.goldLight}, ${COLORS.gold})`,
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          lineHeight: 1,
          letterSpacing: "0.02em",
        }}>Majestic</div>
        <div style={{
          fontFamily: FONTS.body,
          fontSize: size * 0.22,
          fontWeight: 500,
          color: COLORS.textSecondary,
          letterSpacing: "0.18em",
          textTransform: "uppercase" as const,
        }}>Pressing</div>
      </div>
    )}
  </div>
);

/** Badge statut */
const StatusBadge: React.FC<{ statut: StatutVetement }> = ({ statut }) => {
  const c = STATUT_COLORS[statut];
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: 6,
      padding: "4px 10px", borderRadius: RADIUS.full,
      background: c.bg, color: c.text,
      fontSize: 11, fontWeight: 600, letterSpacing: ".5px",
    }}>
      <span style={{ width: 6, height: 6, borderRadius: "50%", background: c.dot, display: "inline-block" }}/>
      {STATUT_LABELS[statut]}
    </span>
  );
};

/** Carte métrique */
const MetricCard: React.FC<{
  icon: string; label: string; value: string; sub?: string;
  color?: string; delay?: string;
}> = ({ icon, label, value, sub, color = COLORS.gold, delay = "0s" }) => (
  <div className="anim-fade-up hover-lift" style={{
    animationDelay: delay,
    background: COLORS.darkCard, borderRadius: RADIUS.lg,
    border: `1px solid ${COLORS.darkBorder}`,
    padding: "22px 20px", position: "relative", overflow: "hidden",
  }}>
    <div style={{
      position: "absolute", top: 0, left: 0, right: 0, height: 2,
      background: `linear-gradient(90deg, transparent, ${color}, transparent)`,
    }}/>
    <div style={{
      width: 42, height: 42, borderRadius: RADIUS.md,
      background: color + "18", display: "flex",
      alignItems: "center", justifyContent: "center",
      fontSize: 20, marginBottom: 14,
    }}>{icon}</div>
    <div style={{ fontSize: 26, fontWeight: 800, fontFamily: FONTS.display, color: COLORS.textPrimary }}>{value}</div>
    <div style={{ fontSize: 12, color: COLORS.textSecondary, marginTop: 2, fontWeight: 500 }}>{label}</div>
    {sub && <div style={{ fontSize: 11, color, marginTop: 6, fontWeight: 600 }}>{sub}</div>}
  </div>
);

/** Bouton */
const Btn: React.FC<{
  children: ReactNode; onClick?: () => void;
  variant?: "primary" | "secondary" | "ghost" | "danger";
  size?: "sm" | "md"; fullWidth?: boolean; style?: CSSProperties;
}> = ({ children, onClick, variant = "primary", size = "md", fullWidth, style }) => {
  const base: CSSProperties = {
    display: "inline-flex", alignItems: "center", justifyContent: "center",
    gap: 7, border: "none", cursor: "pointer", fontFamily: FONTS.body,
    fontWeight: 600, borderRadius: RADIUS.md, transition: "all .2s ease",
    width: fullWidth ? "100%" : "auto",
    padding: size === "sm" ? "7px 14px" : "11px 22px",
    fontSize: size === "sm" ? 12 : 13.5,
  };
  const variants = {
    primary: { background: `linear-gradient(135deg, ${COLORS.gold}, ${COLORS.goldDark})`, color: COLORS.black, boxShadow: SHADOW.gold },
    secondary: { background: COLORS.darkBorder, color: COLORS.textPrimary, border: `1px solid ${COLORS.darkBorder}` },
    ghost: { background: "transparent", color: COLORS.textSecondary, border: `1px solid ${COLORS.darkBorder}` },
    danger: { background: COLORS.dangerPale, color: COLORS.danger, border: `1px solid ${COLORS.danger}30` },
  };
  return (
    <button className="btn-press" onClick={onClick} style={{ ...base, ...variants[variant], ...style }}>
      {children}
    </button>
  );
};

/** Input */
const Input: React.FC<{
  label?: string; placeholder?: string; value: string;
  onChange: (v: string) => void; type?: string;
}> = ({ label, placeholder, value, onChange, type = "text" }) => (
  <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
    {label && <label style={{ fontSize: 12, fontWeight: 600, color: COLORS.textSecondary, letterSpacing: ".5px", textTransform: "uppercase" }}>{label}</label>}
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={e => onChange(e.target.value)}
      style={{
        background: COLORS.charcoal, border: `1px solid ${COLORS.darkBorder}`,
        borderRadius: RADIUS.md, padding: "11px 14px",
        color: COLORS.textPrimary, fontSize: 14, outline: "none",
        transition: "border-color .2s",
      }}
      onFocus={e => { e.currentTarget.style.borderColor = COLORS.gold; }}
      onBlur={e  => { e.currentTarget.style.borderColor = COLORS.darkBorder; }}
    />
  </div>
);

/** Select */
const Select: React.FC<{
  label?: string; value: string; onChange: (v: string) => void;
  options: { value: string; label: string }[];
}> = ({ label, value, onChange, options }) => (
  <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
    {label && <label style={{ fontSize: 12, fontWeight: 600, color: COLORS.textSecondary, letterSpacing: ".5px", textTransform: "uppercase" }}>{label}</label>}
    <select
      value={value}
      onChange={e => onChange(e.target.value)}
      style={{
        background: COLORS.charcoal, border: `1px solid ${COLORS.darkBorder}`,
        borderRadius: RADIUS.md, padding: "11px 14px",
        color: COLORS.textPrimary, fontSize: 14, outline: "none", cursor: "pointer",
      }}
    >
      {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
    </select>
  </div>
);

/** Carte générique */
const Card: React.FC<{
  children: ReactNode; style?: CSSProperties; className?: string;
}> = ({ children, style, className }) => (
  <div className={className} style={{
    background: COLORS.darkCard, borderRadius: RADIUS.lg,
    border: `1px solid ${COLORS.darkBorder}`,
    overflow: "hidden", ...style,
  }}>{children}</div>
);

/** En-tête de carte */
const CardHeader: React.FC<{
  title: string; sub?: string; action?: ReactNode;
}> = ({ title, sub, action }) => (
  <div style={{
    display: "flex", alignItems: "center", justifyContent: "space-between",
    padding: "18px 22px 14px", borderBottom: `1px solid ${COLORS.darkBorder}`,
  }}>
    <div>
      <div style={{ fontFamily: FONTS.display, fontSize: 16, fontWeight: 700, color: COLORS.textPrimary }}>{title}</div>
      {sub && <div style={{ fontSize: 12, color: COLORS.textSecondary, marginTop: 2 }}>{sub}</div>}
    </div>
    {action}
  </div>
);

/** Barre de progression */
const ProgressBar: React.FC<{ value: number; max: number; threshold: number }> = ({ value, max, threshold }) => {
  const pct = Math.min(100, Math.round((value / max) * 100));
  const color = pct <= 20 ? COLORS.danger : pct <= 40 ? COLORS.warning : COLORS.success;
  return (
    <div style={{ height: 6, background: COLORS.darkBorder, borderRadius: RADIUS.full, overflow: "hidden", marginTop: 8 }}>
      <div style={{ height: "100%", width: `${pct}%`, background: color, borderRadius: RADIUS.full, transition: "width .6s ease" }}/>
    </div>
  );
};

/** Modal */
const Modal: React.FC<{
  open: boolean; onClose: () => void; title: string; children: ReactNode;
}> = ({ open, onClose, title, children }) => {
  if (!open) return null;
  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 1000,
      background: "rgba(0,0,0,.75)", backdropFilter: "blur(6px)",
      display: "flex", alignItems: "center", justifyContent: "center",
      padding: 20,
    }} onClick={onClose}>
      <div className="anim-fade-up" onClick={e => e.stopPropagation()} style={{
        background: COLORS.darkCard, borderRadius: RADIUS.xl,
        border: `1px solid ${COLORS.darkBorder}`,
        width: "100%", maxWidth: 520, boxShadow: SHADOW.lg,
        overflow: "hidden",
      }}>
        <div style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "20px 24px", borderBottom: `1px solid ${COLORS.darkBorder}`,
        }}>
          <div style={{ fontFamily: FONTS.display, fontSize: 18, fontWeight: 700 }}>{title}</div>
          <button onClick={onClose} style={{
            background: "none", border: "none", color: COLORS.textSecondary,
            fontSize: 22, cursor: "pointer", lineHeight: 1,
          }}>×</button>
        </div>
        <div style={{ padding: 24 }}>{children}</div>
      </div>
    </div>
  );
};

/** Toast */
const Toast: React.FC<{ msg: string; type: "success" | "error" | "info"; onClose: () => void }> = ({ msg, type, onClose }) => {
  const colors = { success: COLORS.success, error: COLORS.danger, info: COLORS.gold };
  useEffect(() => { const t = setTimeout(onClose, 3000); return () => clearTimeout(t); }, []);
  return (
    <div className="anim-slide-in" style={{
      position: "fixed", bottom: 28, right: 28, zIndex: 9999,
      background: COLORS.darkCard, border: `1px solid ${colors[type]}50`,
      borderLeft: `3px solid ${colors[type]}`,
      borderRadius: RADIUS.md, padding: "14px 18px",
      boxShadow: SHADOW.lg, color: COLORS.textPrimary, fontSize: 13,
      display: "flex", alignItems: "center", gap: 10, maxWidth: 340,
    }}>
      <span>{type === "success" ? "✓" : type === "error" ? "✕" : "✦"}</span>
      <span style={{ flex: 1 }}>{msg}</span>
      <span onClick={onClose} style={{ cursor: "pointer", color: COLORS.textMuted, fontSize: 16 }}>×</span>
    </div>
  );
};

// ─────────────────────────────────────────────
// 6. SIDEBAR
// ─────────────────────────────────────────────
const NAV_ITEMS: { page: Page; icon: string; label: string; badge?: number }[] = [
  { page: "dashboard", icon: "◆", label: "Tableau de bord" },
  { page: "clients",   icon: "◉", label: "Clients" },
  { page: "vetements", icon: "◈", label: "Vêtements", badge: 3 },
  { page: "statuts",   icon: "⟳", label: "Statuts" },
  { page: "paiements", icon: "◎", label: "Paiements" },
  { page: "stock",     icon: "◧", label: "Stock", badge: 2 },
  { page: "profil",    icon: "◐", label: "Profil" },
];

const Sidebar: React.FC<{
  current: Page; onNavigate: (p: Page) => void;
}> = ({ current, onNavigate }) => (
  <div style={{
    width: 230, background: COLORS.dark, borderRight: `1px solid ${COLORS.darkBorder}`,
    display: "flex", flexDirection: "column", height: "100vh",
    position: "fixed", left: 0, top: 0, zIndex: 100,
  }}>
    {/* Logo */}
    <div style={{ padding: "24px 20px 20px", borderBottom: `1px solid ${COLORS.darkBorder}` }}>
      <MajesticLogo size={36}/>
    </div>

    {/* Navigation */}
    <nav style={{ flex: 1, padding: "16px 12px", overflowY: "auto" }}>
      <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "1.2px", color: COLORS.textMuted, padding: "0 10px 10px", textTransform: "uppercase" }}>Navigation</div>
      {NAV_ITEMS.map(item => {
        const active = current === item.page;
        return (
          <div key={item.page} onClick={() => onNavigate(item.page)} style={{
            display: "flex", alignItems: "center", gap: 10,
            padding: "10px 12px", borderRadius: RADIUS.md,
            marginBottom: 3, cursor: "pointer", transition: "all .2s",
            background: active ? `${COLORS.gold}18` : "transparent",
            border: `1px solid ${active ? COLORS.gold + "40" : "transparent"}`,
            color: active ? COLORS.gold : COLORS.textSecondary,
          }}
            onMouseEnter={e => { if (!active) e.currentTarget.style.background = COLORS.charcoal; }}
            onMouseLeave={e => { if (!active) e.currentTarget.style.background = "transparent"; }}
          >
            <span style={{ fontSize: 14, width: 18, textAlign: "center" }}>{item.icon}</span>
            <span style={{ fontSize: 13.5, fontWeight: active ? 600 : 400, flex: 1 }}>{item.label}</span>
            {item.badge && (
              <span style={{
                background: COLORS.danger, color: "#fff", fontSize: 10,
                fontWeight: 700, padding: "2px 6px", borderRadius: RADIUS.full,
              }}>{item.badge}</span>
            )}
          </div>
        );
      })}
    </nav>

    {/* Bas sidebar */}
    <div style={{ padding: "14px 16px", borderTop: `1px solid ${COLORS.darkBorder}` }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <div style={{
          width: 36, height: 36, borderRadius: RADIUS.full,
          background: `linear-gradient(135deg, ${COLORS.gold}, ${COLORS.goldDark})`,
          display: "flex", alignItems: "center", justifyContent: "center",
          fontWeight: 800, fontSize: 14, color: COLORS.black, flexShrink: 0,
        }}>MK</div>
        <div>
          <div style={{ fontSize: 13, fontWeight: 600, color: COLORS.textPrimary }}>Marie Koudou</div>
          <div style={{ fontSize: 11, color: COLORS.textMuted }}>Administratrice</div>
        </div>
      </div>
    </div>
  </div>
);

// ─────────────────────────────────────────────
// 7. TOPBAR
// ─────────────────────────────────────────────
const PAGE_TITLES: Record<Page, string> = {
  login:     "Connexion",
  dashboard: "Tableau de bord",
  clients:   "Gestion des clients",
  vetements: "Vêtements",
  statuts:   "Statuts & Workflow",
  paiements: "Paiements & Facturation",
  stock:     "Gestion du stock",
  profil:    "Profil & Paramètres",
};

const Topbar: React.FC<{
  page: Page; onLogout: () => void; nbAlerts: number;
}> = ({ page, onLogout, nbAlerts }) => (
  <header style={{
    height: 62, background: COLORS.dark, borderBottom: `1px solid ${COLORS.darkBorder}`,
    display: "flex", alignItems: "center", justifyContent: "space-between",
    padding: "0 28px", position: "sticky", top: 0, zIndex: 50,
  }}>
    <div>
      <div style={{ fontFamily: FONTS.display, fontSize: 19, fontWeight: 700, color: COLORS.textPrimary }}>{PAGE_TITLES[page]}</div>
      <div style={{ fontSize: 11, color: COLORS.textMuted }}>
        {new Date().toLocaleDateString("fr-FR", { weekday: "long", day: "2-digit", month: "long", year: "numeric" })}
      </div>
    </div>
    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
      {/* Notifications */}
      <div style={{ position: "relative", cursor: "pointer" }}>
        <div style={{
          width: 38, height: 38, borderRadius: RADIUS.md,
          background: COLORS.charcoal, border: `1px solid ${COLORS.darkBorder}`,
          display: "flex", alignItems: "center", justifyContent: "center", fontSize: 17,
        }}>🔔</div>
        {nbAlerts > 0 && (
          <div style={{
            position: "absolute", top: -4, right: -4,
            width: 18, height: 18, borderRadius: RADIUS.full,
            background: COLORS.danger, border: `2px solid ${COLORS.dark}`,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 10, fontWeight: 700, color: "#fff",
          }}>{nbAlerts}</div>
        )}
      </div>
      {/* Déconnexion */}
      <Btn variant="ghost" size="sm" onClick={onLogout}>⎋ Déconnexion</Btn>
    </div>
  </header>
);

// ─────────────────────────────────────────────
// 8. PAGE — LOGIN
// ─────────────────────────────────────────────
const PageLogin: React.FC<{ onLogin: () => void }> = ({ onLogin }) => {
  const [email, setEmail] = useState("admin@majestic.cm");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = () => {
    if (!email || !password) { setError("Veuillez remplir tous les champs."); return; }
    if (password.length < 4) { setError("Mot de passe incorrect."); return; }
    setLoading(true); setError("");
    setTimeout(() => { setLoading(false); onLogin(); }, 1200);
  };

  return (
    <div style={{
      minHeight: "100vh", display: "flex",
      background: COLORS.black,
    }}>
      {/* Côté gauche — branding */}
      <div style={{
        flex: 1, background: COLORS.dark, display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center", padding: "60px 80px",
        position: "relative", overflow: "hidden",
      }}>
        {/* Déco géométrique */}
        {[...Array(6)].map((_, i) => (
          <div key={i} style={{
            position: "absolute",
            width: [300, 200, 150, 180, 120, 90][i],
            height: [300, 200, 150, 180, 120, 90][i],
            border: `1px solid ${COLORS.gold}${["0A", "0D", "10", "08", "12", "0F"][i]}`,
            borderRadius: "50%",
            top: ["-80px", "60%", "20%", "75%", "40%", "10%"][i],
            left: ["-80px", "-60px", "60%", "50%", "30%", "70%"][i],
          }}/>
        ))}
        {/* Ligne or verticale */}
        <div style={{
          position: "absolute", left: "50%", top: "10%", bottom: "10%",
          width: 1, background: `linear-gradient(180deg, transparent, ${COLORS.gold}30, transparent)`,
        }}/>

        <div className="anim-fade-up" style={{ textAlign: "center", position: "relative", zIndex: 1 }}>
          <MajesticLogo size={72} showText={false}/>
          <h1 style={{
            fontFamily: FONTS.display, fontSize: 52, fontWeight: 800,
            background: `linear-gradient(135deg, ${COLORS.goldLight}, ${COLORS.gold}, ${COLORS.goldDark})`,
            WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
            marginTop: 24, lineHeight: 1.1, letterSpacing: "-.02em",
          }}>Majestic<br/>Pressing</h1>
          <p style={{ color: COLORS.textSecondary, fontSize: 15, marginTop: 14, maxWidth: 320, lineHeight: 1.7 }}>
            Gérez votre pressing avec élégance — clients, vêtements, paiements et stocks en un seul endroit.
          </p>

          {/* Features */}
          <div style={{ marginTop: 40, display: "flex", flexDirection: "column", gap: 14 }}>
            {[
              ["✦", "Gestion clients & vêtements"],
              ["◆", "Suivi des statuts en temps réel"],
              ["◎", "Facturation & paiements mobiles"],
              ["◧", "Alertes stock intelligentes"],
            ].map(([icon, text]) => (
              <div key={text} style={{
                display: "flex", alignItems: "center", gap: 12,
                color: COLORS.textSecondary, fontSize: 14,
              }}>
                <span style={{ color: COLORS.gold, fontSize: 12 }}>{icon}</span>
                {text}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Côté droit — formulaire */}
      <div style={{
        width: 460, display: "flex", alignItems: "center", justifyContent: "center",
        padding: "60px 50px", background: COLORS.black,
      }}>
        <div className="anim-fade-up d2" style={{ width: "100%" }}>
          <div style={{ marginBottom: 40 }}>
            <h2 style={{ fontFamily: FONTS.display, fontSize: 30, fontWeight: 700, marginBottom: 6 }}>
              Bienvenue 👋
            </h2>
            <p style={{ color: COLORS.textSecondary, fontSize: 14 }}>
              Connectez-vous à votre espace Majestic Pressing
            </p>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
            <Input label="Adresse e-mail" placeholder="votre@pressing.cm" value={email} onChange={setEmail} type="email"/>
            <Input label="Mot de passe" placeholder="••••••••" value={password} onChange={setPassword} type="password"/>

            {error && (
              <div style={{
                background: COLORS.dangerPale, border: `1px solid ${COLORS.danger}40`,
                borderRadius: RADIUS.md, padding: "10px 14px",
                color: COLORS.danger, fontSize: 13,
              }}>⚠ {error}</div>
            )}

            <Btn fullWidth onClick={handleSubmit} style={{ padding: "13px", fontSize: 15, marginTop: 4 }}>
              {loading ? "Connexion en cours…" : "Se connecter →"}
            </Btn>
          </div>

          <p style={{ textAlign: "center", marginTop: 28, fontSize: 12, color: COLORS.textMuted }}>
            Mot de passe oublié ?{" "}
            <span style={{ color: COLORS.gold, cursor: "pointer" }}>Réinitialiser</span>
          </p>

          <div style={{
            marginTop: 40, padding: "14px 18px",
            background: COLORS.darkCard, borderRadius: RADIUS.md,
            border: `1px solid ${COLORS.darkBorder}`,
            fontSize: 12, color: COLORS.textMuted, lineHeight: 1.6,
          }}>
            <span style={{ color: COLORS.gold }}>✦ Compte démo :</span><br/>
            Email : admin@majestic.cm · Mot de passe : 1234
          </div>
        </div>
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────
// 9. PAGE — DASHBOARD
// ─────────────────────────────────────────────
const PageDashboard: React.FC<{
  clients: Client[]; vetements: Vetement[]; paiements: Paiement[]; stock: ProduitStock[];
  onNavigate: (p: Page) => void;
}> = ({ clients, vetements, paiements, stock, onNavigate }) => {
  const enCours  = vetements.filter(v => v.statut !== "recupere").length;
  const prets    = vetements.filter(v => v.statut === "pret").length;
  const revJour  = paiements.filter(p => p.datePaiement === today()).reduce((s, p) => s + p.montant, 0);
  const stockAlerts = stock.filter(s => s.quantite <= s.seuilAlerte).length;

  // Activité hebdo simulée
  const jours = ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"];
  const vals  = [8, 14, 11, 18, 13, 22, 6];
  const maxVal = Math.max(...vals);

  return (
    <div className="anim-fade-in">
      {/* Header */}
      <div style={{ marginBottom: 28, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div>
          <h2 style={{ fontFamily: FONTS.display, fontSize: 26, fontWeight: 800 }}>
            Bonjour, Marie ✨
          </h2>
          <p style={{ color: COLORS.textSecondary, fontSize: 14, marginTop: 3 }}>
            Voici ce qui se passe dans votre pressing aujourd'hui
          </p>
        </div>
        <Btn onClick={() => onNavigate("vetements")}>+ Nouveau vêtement</Btn>
      </div>

      {/* Métriques */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 18, marginBottom: 28 }}>
        <MetricCard icon="👗" label="Vêtements en cours" value={String(enCours)} sub="↑ +3 depuis hier" color={COLORS.gold} delay=".05s"/>
        <MetricCard icon="💰" label="Revenus du jour" value={revJour > 0 ? fmtMoney(revJour) : "0 FCFA"} sub="↑ +12% vs hier" color={COLORS.success} delay=".1s"/>
        <MetricCard icon="✓" label="Prêts à récupérer" value={String(prets)} sub="Notifier les clients" color={COLORS.info} delay=".15s"/>
        <MetricCard icon="⚠" label="Alertes stock" value={String(stockAlerts)} sub="Vérifier maintenant" color={COLORS.danger} delay=".2s"/>
      </div>

      {/* Grille principale */}
      <div style={{ display: "grid", gridTemplateColumns: "1.6fr 1fr", gap: 22, marginBottom: 22 }}>
        {/* Graphique */}
        <Card className="anim-fade-up d3">
          <CardHeader title="Activité de la semaine" sub="Nombre de vêtements traités"/>
          <div style={{ padding: "20px 22px" }}>
            <div style={{ display: "flex", alignItems: "flex-end", gap: 12, height: 160 }}>
              {jours.map((j, i) => {
                const h = Math.round((vals[i] / maxVal) * 100);
                const isToday = j === "Jeu";
                return (
                  <div key={j} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
                    <div style={{ fontSize: 11, color: isToday ? COLORS.gold : COLORS.textMuted, fontWeight: isToday ? 700 : 400 }}>{vals[i]}</div>
                    <div style={{
                      width: "100%", height: `${h}%`,
                      background: isToday
                        ? `linear-gradient(180deg, ${COLORS.goldLight}, ${COLORS.gold})`
                        : `${COLORS.gold}25`,
                      borderRadius: `${RADIUS.sm} ${RADIUS.sm} 0 0`,
                      border: isToday ? `1px solid ${COLORS.gold}60` : "none",
                      transition: "height .5s ease",
                    }}/>
                    <div style={{ fontSize: 11, color: isToday ? COLORS.gold : COLORS.textMuted, fontWeight: isToday ? 700 : 400 }}>{j}</div>
                  </div>
                );
              })}
            </div>
          </div>
        </Card>

        {/* Répartition des statuts */}
        <Card className="anim-fade-up d4">
          <CardHeader title="Répartition statuts"/>
          <div style={{ padding: "18px 22px", display: "flex", flexDirection: "column", gap: 14 }}>
            {(["en_attente","en_lavage","pret","recupere"] as StatutVetement[]).map(s => {
              const count = vetements.filter(v => v.statut === s).length;
              const pct = vetements.length ? Math.round((count / vetements.length) * 100) : 0;
              const c = STATUT_COLORS[s];
              return (
                <div key={s}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
                    <span style={{ fontSize: 12, color: c.text, fontWeight: 600 }}>{STATUT_LABELS[s]}</span>
                    <span style={{ fontSize: 12, color: COLORS.textSecondary }}>{count} ({pct}%)</span>
                  </div>
                  <div style={{ height: 5, background: COLORS.darkBorder, borderRadius: RADIUS.full }}>
                    <div style={{ height: "100%", width: `${pct}%`, background: c.dot, borderRadius: RADIUS.full, transition: "width .6s" }}/>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      </div>

      {/* Bas du dashboard */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 22 }}>
        {/* Clients récents */}
        <Card className="anim-fade-up d5">
          <CardHeader title="Clients récents" action={
            <Btn variant="ghost" size="sm" onClick={() => onNavigate("clients")}>Voir tous →</Btn>
          }/>
          <div>
            {clients.slice(0, 4).map((c, i) => {
              const v = vetements.filter(v => v.idClient === c.id);
              return (
                <div key={c.id} style={{
                  display: "flex", alignItems: "center", gap: 12,
                  padding: "12px 20px", borderBottom: i < 3 ? `1px solid ${COLORS.darkBorder}` : "none",
                }}>
                  <div style={{
                    width: 36, height: 36, borderRadius: RADIUS.full, flexShrink: 0,
                    background: `linear-gradient(135deg, ${COLORS.gold}20, ${COLORS.gold}40)`,
                    border: `1px solid ${COLORS.gold}40`,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 13, fontWeight: 700, color: COLORS.gold,
                  }}>{c.nom.split(" ").map(n => n[0]).join("").slice(0,2)}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13, fontWeight: 600, color: COLORS.textPrimary }}>{c.nom}</div>
                    <div style={{ fontSize: 11, color: COLORS.textSecondary }}>{v.length} vêtement{v.length > 1 ? "s" : ""}</div>
                  </div>
                  {v[0] && <StatusBadge statut={v[0].statut}/>}
                </div>
              );
            })}
          </div>
        </Card>

        {/* Alertes stock */}
        <Card className="anim-fade-up d6">
          <CardHeader title="Alertes & Notifications" action={
            <Btn variant="ghost" size="sm" onClick={() => onNavigate("stock")}>Stock →</Btn>
          }/>
          <div style={{ padding: "14px 20px", display: "flex", flexDirection: "column", gap: 10 }}>
            {stock.filter(s => s.quantite <= s.seuilAlerte).map(s => {
              const critical = s.quantite <= s.seuilAlerte * 0.3;
              return (
                <div key={s.id} style={{
                  display: "flex", alignItems: "center", gap: 10,
                  padding: "10px 14px", borderRadius: RADIUS.md,
                  background: critical ? COLORS.dangerPale : COLORS.warningPale,
                  border: `1px solid ${critical ? COLORS.danger : COLORS.warning}30`,
                }}>
                  <span style={{ fontSize: 16 }}>{critical ? "🚨" : "⚠️"}</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 12, fontWeight: 600, color: critical ? COLORS.danger : COLORS.warning }}>{s.nomProduit}</div>
                    <div style={{ fontSize: 11, color: COLORS.textSecondary }}>{s.quantite} {s.unite} restants · Seuil : {s.seuilAlerte}</div>
                  </div>
                </div>
              );
            })}
            {stock.filter(s => s.quantite <= s.seuilAlerte).length === 0 && (
              <div style={{ color: COLORS.success, fontSize: 13, padding: "10px 0" }}>✓ Tous les stocks sont suffisants</div>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────
// 10. PAGE — CLIENTS
// ─────────────────────────────────────────────
const PageClients: React.FC<{
  clients: Client[]; vetements: Vetement[];
  onAdd: (c: Client) => void; onDelete: (id: string) => void;
  showToast: (m: string, t: "success"|"error"|"info") => void;
}> = ({ clients, vetements, onAdd, onDelete, showToast }) => {
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState({ nom: "", telephone: "", adresse: "" });

  const filtered = clients.filter(c =>
    c.nom.toLowerCase().includes(search.toLowerCase()) ||
    c.telephone.includes(search)
  );

  const submit = () => {
    if (!form.nom || !form.telephone) { showToast("Nom et téléphone requis.", "error"); return; }
    onAdd({ id: "C" + genId(), createdAt: today(), ...form });
    setForm({ nom: "", telephone: "", adresse: "" });
    setModalOpen(false);
    showToast("Client ajouté avec succès.", "success");
  };

  return (
    <div className="anim-fade-in">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
        <div>
          <h2 style={{ fontFamily: FONTS.display, fontSize: 22, fontWeight: 700 }}>Clients</h2>
          <p style={{ color: COLORS.textSecondary, fontSize: 13 }}>{clients.length} clients enregistrés</p>
        </div>
        <Btn onClick={() => setModalOpen(true)}>+ Nouveau client</Btn>
      </div>

      {/* Barre de recherche */}
      <div style={{ marginBottom: 20 }}>
        <input
          placeholder="🔍  Rechercher par nom, téléphone…"
          value={search} onChange={e => setSearch(e.target.value)}
          style={{
            width: "100%", background: COLORS.darkCard,
            border: `1px solid ${COLORS.darkBorder}`, borderRadius: RADIUS.md,
            padding: "12px 16px", color: COLORS.textPrimary, fontSize: 13.5, outline: "none",
          }}
        />
      </div>

      {/* Table */}
      <Card>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: COLORS.charcoal }}>
                {["Client", "Téléphone", "Adresse", "Vêtements", "Inscrit le", "Actions"].map(h => (
                  <th key={h} style={{
                    padding: "11px 18px", textAlign: "left",
                    fontSize: 10.5, fontWeight: 700, letterSpacing: ".8px",
                    textTransform: "uppercase", color: COLORS.textMuted,
                    borderBottom: `1px solid ${COLORS.darkBorder}`,
                  }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((c, i) => {
                const v = vetements.filter(v => v.idClient === c.id);
                const actifs = v.filter(x => x.statut !== "recupere");
                return (
                  <tr key={c.id} style={{ borderBottom: i < filtered.length - 1 ? `1px solid ${COLORS.darkBorder}` : "none" }}
                    onMouseEnter={e => e.currentTarget.style.background = COLORS.charcoal + "60"}
                    onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                  >
                    <td style={{ padding: "14px 18px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        <div style={{
                          width: 34, height: 34, borderRadius: RADIUS.full,
                          background: `${COLORS.gold}20`, border: `1px solid ${COLORS.gold}40`,
                          display: "flex", alignItems: "center", justifyContent: "center",
                          fontSize: 12, fontWeight: 700, color: COLORS.gold, flexShrink: 0,
                        }}>{c.nom.split(" ").map(n => n[0]).join("").slice(0, 2)}</div>
                        <div>
                          <div style={{ fontWeight: 600, fontSize: 13.5, color: COLORS.textPrimary }}>{c.nom}</div>
                          <div style={{ fontSize: 11, color: COLORS.textMuted }}>ID: {c.id}</div>
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: "14px 18px", color: COLORS.textSecondary, fontSize: 13 }}>{c.telephone}</td>
                    <td style={{ padding: "14px 18px", color: COLORS.textSecondary, fontSize: 13 }}>{c.adresse}</td>
                    <td style={{ padding: "14px 18px" }}>
                      {actifs.length > 0
                        ? <StatusBadge statut={actifs[0].statut}/>
                        : <span style={{ color: COLORS.textMuted, fontSize: 12 }}>Aucun</span>
                      }
                    </td>
                    <td style={{ padding: "14px 18px", color: COLORS.textSecondary, fontSize: 12 }}>{fmtDate(c.createdAt)}</td>
                    <td style={{ padding: "14px 18px" }}>
                      <div style={{ display: "flex", gap: 6 }}>
                        <Btn variant="ghost" size="sm">✏</Btn>
                        <Btn variant="danger" size="sm" onClick={() => { onDelete(c.id); showToast("Client supprimé.", "info"); }}>🗑</Btn>
                      </div>
                    </td>
                  </tr>
                );
              })}
              {filtered.length === 0 && (
                <tr><td colSpan={6} style={{ padding: "32px 18px", textAlign: "center", color: COLORS.textMuted }}>Aucun client trouvé.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Modal Ajout */}
      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="Nouveau client">
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <Input label="Nom complet *" placeholder="Ex: Ngo Biyong Estelle" value={form.nom} onChange={v => setForm(f => ({ ...f, nom: v }))}/>
          <Input label="Téléphone *" placeholder="+237 6XX XXX XXX" value={form.telephone} onChange={v => setForm(f => ({ ...f, telephone: v }))}/>
          <Input label="Adresse" placeholder="Quartier, Ville" value={form.adresse} onChange={v => setForm(f => ({ ...f, adresse: v }))}/>
          <div style={{ display: "flex", gap: 10, marginTop: 6 }}>
            <Btn variant="ghost" fullWidth onClick={() => setModalOpen(false)}>Annuler</Btn>
            <Btn fullWidth onClick={submit}>💾 Enregistrer</Btn>
          </div>
        </div>
      </Modal>
    </div>
  );
};

// ─────────────────────────────────────────────
// 11. PAGE — VÊTEMENTS
// ─────────────────────────────────────────────
const PageVetements: React.FC<{
  vetements: Vetement[]; clients: Client[];
  onAdd: (v: Vetement) => void; onDelete: (id: string) => void;
  showToast: (m: string, t: "success"|"error"|"info") => void;
}> = ({ vetements, clients, onAdd, onDelete, showToast }) => {
  const [search, setSearch] = useState("");
  const [filterStatut, setFilterStatut] = useState<StatutVetement | "all">("all");
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState({ type: "Chemise", couleur: "", description: "", idClient: clients[0]?.id || "" });

  const TYPES_VET = ["Chemise", "Pantalon", "Robe", "Costume", "Veste", "Manteau", "Jupe", "Autre"];

  const filtered = vetements.filter(v => {
    const c = clients.find(c => c.id === v.idClient);
    const matchSearch = v.type.toLowerCase().includes(search.toLowerCase()) ||
      v.couleur.toLowerCase().includes(search.toLowerCase()) ||
      (c?.nom || "").toLowerCase().includes(search.toLowerCase());
    const matchStatut = filterStatut === "all" || v.statut === filterStatut;
    return matchSearch && matchStatut;
  });

  const submit = () => {
    if (!form.idClient) { showToast("Sélectionnez un client.", "error"); return; }
    onAdd({ id: "V" + genId(), dateDepot: today(), statut: "en_attente", ...form });
    setModalOpen(false);
    showToast("Vêtement enregistré.", "success");
  };

  return (
    <div className="anim-fade-in">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
        <div>
          <h2 style={{ fontFamily: FONTS.display, fontSize: 22, fontWeight: 700 }}>Vêtements</h2>
          <p style={{ color: COLORS.textSecondary, fontSize: 13 }}>{vetements.filter(v => v.statut !== "recupere").length} en cours · {vetements.length} total</p>
        </div>
        <Btn onClick={() => setModalOpen(true)}>+ Enregistrer</Btn>
      </div>

      {/* Mini stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 14, marginBottom: 22 }}>
        {(["en_attente","en_lavage","pret","recupere"] as StatutVetement[]).map(s => {
          const count = vetements.filter(v => v.statut === s).length;
          const c = STATUT_COLORS[s];
          return (
            <div key={s} onClick={() => setFilterStatut(filterStatut === s ? "all" : s)}
              style={{
                background: filterStatut === s ? c.bg : COLORS.darkCard,
                border: `1px solid ${filterStatut === s ? c.dot : COLORS.darkBorder}`,
                borderRadius: RADIUS.md, padding: "14px 16px", cursor: "pointer", transition: "all .2s",
              }}>
              <div style={{ fontSize: 22, fontWeight: 800, fontFamily: FONTS.display, color: c.text }}>{count}</div>
              <div style={{ fontSize: 11, color: c.text, opacity: .8 }}>{STATUT_LABELS[s]}</div>
            </div>
          );
        })}
      </div>

      {/* Recherche */}
      <input
        placeholder="🔍  Rechercher par type, couleur, client…"
        value={search} onChange={e => setSearch(e.target.value)}
        style={{
          width: "100%", background: COLORS.darkCard,
          border: `1px solid ${COLORS.darkBorder}`, borderRadius: RADIUS.md,
          padding: "12px 16px", color: COLORS.textPrimary, fontSize: 13.5, outline: "none",
          marginBottom: 18,
        }}
      />

      <Card>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: COLORS.charcoal }}>
                {["ID", "Client", "Type", "Couleur", "Déposé le", "Statut", "Actions"].map(h => (
                  <th key={h} style={{
                    padding: "11px 16px", textAlign: "left",
                    fontSize: 10.5, fontWeight: 700, letterSpacing: ".8px",
                    textTransform: "uppercase", color: COLORS.textMuted,
                    borderBottom: `1px solid ${COLORS.darkBorder}`,
                  }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((v, i) => {
                const client = clients.find(c => c.id === v.idClient);
                return (
                  <tr key={v.id} style={{ borderBottom: i < filtered.length - 1 ? `1px solid ${COLORS.darkBorder}` : "none" }}
                    onMouseEnter={e => e.currentTarget.style.background = COLORS.charcoal + "60"}
                    onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                  >
                    <td style={{ padding: "13px 16px", fontFamily: FONTS.mono, fontSize: 12, color: COLORS.gold }}>{v.id}</td>
                    <td style={{ padding: "13px 16px", fontSize: 13, fontWeight: 600, color: COLORS.textPrimary }}>{client?.nom || "—"}</td>
                    <td style={{ padding: "13px 16px", fontSize: 13, color: COLORS.textSecondary }}>{v.type}</td>
                    <td style={{ padding: "13px 16px", fontSize: 13, color: COLORS.textSecondary }}>{v.couleur}</td>
                    <td style={{ padding: "13px 16px", fontSize: 12, color: COLORS.textMuted }}>{fmtDate(v.dateDepot)}</td>
                    <td style={{ padding: "13px 16px" }}><StatusBadge statut={v.statut}/></td>
                    <td style={{ padding: "13px 16px" }}>
                      <div style={{ display: "flex", gap: 6 }}>
                        <Btn variant="ghost" size="sm">✏</Btn>
                        <Btn variant="danger" size="sm" onClick={() => { onDelete(v.id); showToast("Vêtement supprimé.", "info"); }}>🗑</Btn>
                      </div>
                    </td>
                  </tr>
                );
              })}
              {filtered.length === 0 && (
                <tr><td colSpan={7} style={{ padding: "32px", textAlign: "center", color: COLORS.textMuted }}>Aucun vêtement trouvé.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="Enregistrer un vêtement">
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <Select label="Client *" value={form.idClient} onChange={v => setForm(f => ({ ...f, idClient: v }))}
            options={clients.map(c => ({ value: c.id, label: c.nom }))}/>
          <Select label="Type de vêtement" value={form.type} onChange={v => setForm(f => ({ ...f, type: v }))}
            options={TYPES_VET.map(t => ({ value: t, label: t }))}/>
          <Input label="Couleur" placeholder="Ex: Bleu marine" value={form.couleur} onChange={v => setForm(f => ({ ...f, couleur: v }))}/>
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            <label style={{ fontSize: 12, fontWeight: 600, color: COLORS.textSecondary, letterSpacing: ".5px", textTransform: "uppercase" }}>Description / Notes</label>
            <textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
              placeholder="Taches particulières, tissu délicat…"
              style={{
                background: COLORS.charcoal, border: `1px solid ${COLORS.darkBorder}`,
                borderRadius: RADIUS.md, padding: "11px 14px", color: COLORS.textPrimary,
                fontSize: 13.5, outline: "none", resize: "vertical", minHeight: 70,
              }}/>
          </div>
          <div style={{ display: "flex", gap: 10, marginTop: 4 }}>
            <Btn variant="ghost" fullWidth onClick={() => setModalOpen(false)}>Annuler</Btn>
            <Btn fullWidth onClick={submit}>💾 Enregistrer</Btn>
          </div>
        </div>
      </Modal>
    </div>
  );
};

// ─────────────────────────────────────────────
// 12. PAGE — STATUTS
// ─────────────────────────────────────────────
const PageStatuts: React.FC<{
  vetements: Vetement[]; clients: Client[];
  onUpdateStatut: (id: string, s: StatutVetement) => void;
  showToast: (m: string, t: "success"|"error"|"info") => void;
}> = ({ vetements, clients, onUpdateStatut, showToast }) => {
  const [selected, setSelected] = useState<Vetement | null>(null);

  const WORKFLOW: StatutVetement[] = ["en_attente", "en_lavage", "pret", "recupere"];
  const WORKFLOW_ICONS: Record<StatutVetement, string> = {
    en_attente: "📥", en_lavage: "🧼", pret: "✅", recupere: "🏠",
  };

  const advance = () => {
    if (!selected) return;
    const idx = WORKFLOW.indexOf(selected.statut);
    if (idx < WORKFLOW.length - 1) {
      const next = WORKFLOW[idx + 1];
      onUpdateStatut(selected.id, next);
      setSelected({ ...selected, statut: next });
      showToast(`Statut mis à jour : ${STATUT_LABELS[next]}`, "success");
    }
  };

  const actifs = vetements.filter(v => v.statut !== "recupere");

  return (
    <div className="anim-fade-in">
      <div style={{ marginBottom: 24 }}>
        <h2 style={{ fontFamily: FONTS.display, fontSize: 22, fontWeight: 700 }}>Statuts & Workflow</h2>
        <p style={{ color: COLORS.textSecondary, fontSize: 13 }}>{actifs.length} vêtements actifs</p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1.4fr", gap: 22 }}>
        {/* Liste vêtements */}
        <Card>
          <CardHeader title="Vêtements en cours" sub="Cliquez pour gérer le statut"/>
          <div style={{ maxHeight: 500, overflowY: "auto" }}>
            {actifs.map((v, i) => {
              const c = clients.find(c => c.id === v.idClient);
              const isSel = selected?.id === v.id;
              return (
                <div key={v.id} onClick={() => setSelected(v)} style={{
                  padding: "13px 18px", cursor: "pointer", transition: "all .2s",
                  background: isSel ? `${COLORS.gold}12` : "transparent",
                  borderLeft: isSel ? `3px solid ${COLORS.gold}` : "3px solid transparent",
                  borderBottom: i < actifs.length - 1 ? `1px solid ${COLORS.darkBorder}` : "none",
                }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <div>
                      <div style={{ fontWeight: 600, fontSize: 13, color: COLORS.textPrimary }}>{v.type}</div>
                      <div style={{ fontSize: 11, color: COLORS.textSecondary, marginTop: 2 }}>{c?.nom} · {fmtDate(v.dateDepot)}</div>
                    </div>
                    <StatusBadge statut={v.statut}/>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>

        {/* Détail & Workflow */}
        <div>
          {selected ? (
            <Card>
              <CardHeader title={selected.type} sub={`Client : ${clients.find(c => c.id === selected.idClient)?.nom || "—"} · ID : ${selected.id}`}/>
              <div style={{ padding: "22px" }}>
                {/* Workflow visuel */}
                <div style={{ display: "flex", alignItems: "center", marginBottom: 24, gap: 0 }}>
                  {WORKFLOW.map((s, i) => {
                    const done = WORKFLOW.indexOf(selected.statut) >= i;
                    const active = selected.statut === s;
                    const c = STATUT_COLORS[s];
                    return (
                      <React.Fragment key={s}>
                        <div style={{
                          flex: 1, textAlign: "center",
                          background: active ? c.bg : done ? c.bg + "60" : COLORS.charcoal,
                          border: `1px solid ${active ? c.dot : done ? c.dot + "50" : COLORS.darkBorder}`,
                          borderRadius: RADIUS.md, padding: "10px 6px",
                          transition: "all .3s",
                        }}>
                          <div style={{ fontSize: 18, marginBottom: 4 }}>{WORKFLOW_ICONS[s]}</div>
                          <div style={{ fontSize: 10.5, fontWeight: 700, color: active ? c.text : done ? c.text + "90" : COLORS.textMuted }}>
                            {STATUT_LABELS[s]}
                          </div>
                        </div>
                        {i < WORKFLOW.length - 1 && (
                          <div style={{
                            width: 24, height: 2, flexShrink: 0,
                            background: WORKFLOW.indexOf(selected.statut) > i ? COLORS.gold : COLORS.darkBorder,
                            transition: "background .3s",
                          }}/>
                        )}
                      </React.Fragment>
                    );
                  })}
                </div>

                {/* Infos */}
                <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 22 }}>
                  {[
                    ["Type", selected.type],
                    ["Couleur", selected.couleur || "—"],
                    ["Déposé le", fmtDate(selected.dateDepot)],
                    ["Description", selected.description || "Aucune note"],
                  ].map(([k, v]) => (
                    <div key={k} style={{ display: "flex", justifyContent: "space-between", fontSize: 13 }}>
                      <span style={{ color: COLORS.textMuted }}>{k}</span>
                      <span style={{ color: COLORS.textPrimary, fontWeight: 500 }}>{v}</span>
                    </div>
                  ))}
                </div>

                {/* Actions */}
                <div style={{ display: "flex", gap: 10 }}>
                  {selected.statut !== "recupere" && (
                    <Btn fullWidth onClick={advance}>
                      Passer à : {STATUT_LABELS[WORKFLOW[WORKFLOW.indexOf(selected.statut) + 1]]} →
                    </Btn>
                  )}
                  {selected.statut === "recupere" && (
                    <div style={{ color: COLORS.success, fontSize: 14, fontWeight: 600 }}>✓ Vêtement récupéré</div>
                  )}
                </div>
              </div>
            </Card>
          ) : (
            <Card style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: 300 }}>
              <div style={{ textAlign: "center", color: COLORS.textMuted }}>
                <div style={{ fontSize: 48, marginBottom: 12 }}>👆</div>
                <div style={{ fontSize: 14 }}>Sélectionnez un vêtement</div>
              </div>
            </Card>
          )}

          {/* Kanban résumé */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginTop: 20 }}>
            {WORKFLOW.map(s => {
              const count = vetements.filter(v => v.statut === s).length;
              const c = STATUT_COLORS[s];
              return (
                <div key={s} style={{
                  background: c.bg, border: `1px solid ${c.dot}30`,
                  borderRadius: RADIUS.md, padding: "14px 16px",
                }}>
                  <div style={{ fontSize: 18, marginBottom: 6 }}>{WORKFLOW_ICONS[s]}</div>
                  <div style={{ fontSize: 22, fontWeight: 800, fontFamily: FONTS.display, color: c.text }}>{count}</div>
                  <div style={{ fontSize: 11, color: c.text, opacity: .8, marginTop: 2 }}>{STATUT_LABELS[s]}</div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────
// 13. PAGE — PAIEMENTS
// ─────────────────────────────────────────────
const PagePaiements: React.FC<{
  paiements: Paiement[]; vetements: Vetement[]; clients: Client[];
  onAdd: (p: Paiement) => void;
  showToast: (m: string, t: "success"|"error"|"info") => void;
}> = ({ paiements, vetements, clients, onAdd, showToast }) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState({ idVetement: vetements[0]?.id || "", montant: "", modePaiement: "Espèces" as ModePaiement });
  const [showInvoice, setShowInvoice] = useState<Paiement | null>(null);

  const totalMois = paiements.reduce((s, p) => s + p.montant, 0);
  const payesIds  = paiements.map(p => p.idVetement);
  const nonPayes  = vetements.filter(v => !payesIds.includes(v.id)).length;

  const submit = () => {
    if (!form.idVetement || !form.montant) { showToast("Champs requis.", "error"); return; }
    const vet = vetements.find(v => v.id === form.idVetement);
    const p: Paiement = {
      id: "P" + genId(), datePaiement: today(),
      montant: Number(form.montant), modePaiement: form.modePaiement,
      idVetement: form.idVetement, idClient: vet?.idClient || "",
    };
    onAdd(p);
    setModalOpen(false);
    setShowInvoice(p);
    showToast("Paiement enregistré.", "success");
  };

  const MODES: ModePaiement[] = ["Espèces", "Mobile Money", "Carte"];
  const MODE_ICONS: Record<ModePaiement, string> = { "Espèces": "💵", "Mobile Money": "📱", "Carte": "💳" };

  return (
    <div className="anim-fade-in">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
        <div>
          <h2 style={{ fontFamily: FONTS.display, fontSize: 22, fontWeight: 700 }}>Paiements & Facturation</h2>
          <p style={{ color: COLORS.textSecondary, fontSize: 13 }}>{paiements.length} transactions</p>
        </div>
        <Btn onClick={() => setModalOpen(true)}>+ Enregistrer un paiement</Btn>
      </div>

      {/* Métriques */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 18, marginBottom: 26 }}>
        <MetricCard icon="✓" label="Total encaissé" value={fmtMoney(totalMois)} color={COLORS.success}/>
        <MetricCard icon="⏳" label="Non payés" value={String(nonPayes)} sub="vêtements sans paiement" color={COLORS.danger}/>
        <MetricCard icon="🧾" label="Transactions" value={String(paiements.length)} color={COLORS.gold}/>
      </div>

      {/* Historique */}
      <Card>
        <CardHeader title="Historique des paiements"/>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: COLORS.charcoal }}>
                {["Réf.", "Client", "Vêtement", "Montant", "Mode", "Date", "Action"].map(h => (
                  <th key={h} style={{
                    padding: "11px 16px", textAlign: "left",
                    fontSize: 10.5, fontWeight: 700, letterSpacing: ".8px",
                    textTransform: "uppercase", color: COLORS.textMuted,
                    borderBottom: `1px solid ${COLORS.darkBorder}`,
                  }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {paiements.map((p, i) => {
                const c = clients.find(c => c.id === p.idClient);
                const v = vetements.find(v => v.id === p.idVetement);
                return (
                  <tr key={p.id} style={{ borderBottom: i < paiements.length - 1 ? `1px solid ${COLORS.darkBorder}` : "none" }}>
                    <td style={{ padding: "13px 16px", fontFamily: FONTS.mono, fontSize: 12, color: COLORS.gold }}>#{p.id}</td>
                    <td style={{ padding: "13px 16px", fontSize: 13, fontWeight: 600, color: COLORS.textPrimary }}>{c?.nom || "—"}</td>
                    <td style={{ padding: "13px 16px", fontSize: 13, color: COLORS.textSecondary }}>{v?.type || "—"}</td>
                    <td style={{ padding: "13px 16px", fontSize: 13, fontWeight: 700, color: COLORS.success }}>{fmtMoney(p.montant)}</td>
                    <td style={{ padding: "13px 16px", fontSize: 13, color: COLORS.textSecondary }}>{MODE_ICONS[p.modePaiement]} {p.modePaiement}</td>
                    <td style={{ padding: "13px 16px", fontSize: 12, color: COLORS.textMuted }}>{fmtDate(p.datePaiement)}</td>
                    <td style={{ padding: "13px 16px" }}>
                      <Btn variant="ghost" size="sm" onClick={() => setShowInvoice(p)}>🧾 Facture</Btn>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Modal Paiement */}
      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="Enregistrer un paiement">
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <Select label="Vêtement" value={form.idVetement} onChange={v => setForm(f => ({ ...f, idVetement: v }))}
            options={vetements.map(v => {
              const c = clients.find(c => c.id === v.idClient);
              return { value: v.id, label: `${v.id} — ${v.type} · ${c?.nom || ""}` };
            })}/>
          <Input label="Montant (FCFA)" placeholder="Ex: 3500" value={form.montant} onChange={v => setForm(f => ({ ...f, montant: v }))} type="number"/>
          <div>
            <label style={{ fontSize: 12, fontWeight: 600, color: COLORS.textSecondary, letterSpacing: ".5px", textTransform: "uppercase", display: "block", marginBottom: 8 }}>Mode de paiement</label>
            <div style={{ display: "flex", gap: 8 }}>
              {MODES.map(m => (
                <div key={m} onClick={() => setForm(f => ({ ...f, modePaiement: m }))} style={{
                  flex: 1, textAlign: "center", padding: "10px 6px",
                  borderRadius: RADIUS.md, cursor: "pointer", transition: "all .2s",
                  background: form.modePaiement === m ? `${COLORS.gold}18` : COLORS.charcoal,
                  border: `1px solid ${form.modePaiement === m ? COLORS.gold : COLORS.darkBorder}`,
                  fontSize: 12, fontWeight: 600, color: form.modePaiement === m ? COLORS.gold : COLORS.textSecondary,
                }}>
                  <div style={{ fontSize: 20, marginBottom: 4 }}>{MODE_ICONS[m]}</div>
                  {m}
                </div>
              ))}
            </div>
          </div>
          <div style={{ display: "flex", gap: 10, marginTop: 4 }}>
            <Btn variant="ghost" fullWidth onClick={() => setModalOpen(false)}>Annuler</Btn>
            <Btn fullWidth onClick={submit}>✓ Confirmer</Btn>
          </div>
        </div>
      </Modal>

      {/* Modal Facture */}
      <Modal open={!!showInvoice} onClose={() => setShowInvoice(null)} title="🧾 Facture Majestic Pressing">
        {showInvoice && (() => {
          const c = clients.find(c => c.id === showInvoice.idClient);
          const v = vetements.find(v => v.id === showInvoice.idVetement);
          return (
            <div>
              <div style={{ background: COLORS.charcoal, borderRadius: RADIUS.md, padding: "16px 18px", marginBottom: 18 }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                  <div style={{ fontFamily: FONTS.display, fontSize: 16, fontWeight: 700 }}>Majestic Pressing</div>
                  <div style={{ fontSize: 11, color: COLORS.textSecondary }}>#{showInvoice.id}</div>
                </div>
                <div style={{ fontSize: 12, color: COLORS.textSecondary }}>Yaoundé, Cameroun</div>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 16, fontSize: 13 }}>
                <div><div style={{ color: COLORS.textMuted, marginBottom: 2 }}>Client</div><div style={{ fontWeight: 600 }}>{c?.nom || "—"}</div><div style={{ color: COLORS.textSecondary, fontSize: 11 }}>{c?.telephone}</div></div>
                <div style={{ textAlign: "right" }}><div style={{ color: COLORS.textMuted, marginBottom: 2 }}>Date</div><div style={{ fontWeight: 600 }}>{fmtDate(showInvoice.datePaiement)}</div></div>
              </div>
              <div style={{ borderTop: `1px solid ${COLORS.darkBorder}`, borderBottom: `1px solid ${COLORS.darkBorder}`, padding: "12px 0", marginBottom: 14 }}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, padding: "6px 0" }}>
                  <span style={{ color: COLORS.textSecondary }}>{v?.type || "Prestation"}</span>
                  <span>{fmtMoney(showInvoice.montant)}</span>
                </div>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 16, fontWeight: 700, marginBottom: 16 }}>
                <span>Total</span>
                <span style={{ color: COLORS.gold }}>{fmtMoney(showInvoice.montant)}</span>
              </div>
              <div style={{ fontSize: 12, color: COLORS.textMuted, textAlign: "center", marginBottom: 18 }}>
                Mode : {MODE_ICONS[showInvoice.modePaiement]} {showInvoice.modePaiement} · Merci pour votre confiance ✨
              </div>
              <Btn fullWidth onClick={() => setShowInvoice(null)}>Fermer</Btn>
            </div>
          );
        })()}
      </Modal>
    </div>
  );
};

// ─────────────────────────────────────────────
// 14. PAGE — STOCK
// ─────────────────────────────────────────────
const PageStock: React.FC<{
  stock: ProduitStock[];
  onUpdate: (id: string, qty: number) => void;
  onAdd: (p: ProduitStock) => void;
  showToast: (m: string, t: "success"|"error"|"info") => void;
}> = ({ stock, onUpdate, onAdd, showToast }) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [editQty, setEditQty] = useState("");
  const [form, setForm] = useState({ nomProduit: "", quantite: "", unite: "kg", seuilAlerte: "", quantiteMax: "" });

  const alerts = stock.filter(s => s.quantite <= s.seuilAlerte);

  const submit = () => {
    if (!form.nomProduit) { showToast("Nom requis.", "error"); return; }
    onAdd({ id: "S" + genId(), ...form, quantite: Number(form.quantite), seuilAlerte: Number(form.seuilAlerte), quantiteMax: Number(form.quantiteMax) });
    setModalOpen(false);
    showToast("Produit ajouté.", "success");
  };

  return (
    <div className="anim-fade-in">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
        <div>
          <h2 style={{ fontFamily: FONTS.display, fontSize: 22, fontWeight: 700 }}>Gestion du stock</h2>
          <p style={{ color: COLORS.textSecondary, fontSize: 13 }}>{alerts.length} alerte{alerts.length > 1 ? "s" : ""} active{alerts.length > 1 ? "s" : ""} · {stock.length} produits</p>
        </div>
        <Btn onClick={() => setModalOpen(true)}>+ Ajouter un produit</Btn>
      </div>

      {/* Alertes */}
      {alerts.length > 0 && (
        <div style={{ marginBottom: 22 }}>
          {alerts.map(s => {
            const critical = s.quantite <= s.seuilAlerte * 0.3;
            return (
              <div key={s.id} style={{
                display: "flex", alignItems: "center", gap: 12,
                padding: "12px 18px", borderRadius: RADIUS.md, marginBottom: 8,
                background: critical ? COLORS.dangerPale : COLORS.warningPale,
                border: `1px solid ${critical ? COLORS.danger : COLORS.warning}40`,
                fontSize: 13,
              }}>
                <span style={{ fontSize: 18 }}>{critical ? "🚨" : "⚠️"}</span>
                <span style={{ flex: 1 }}>
                  <strong style={{ color: critical ? COLORS.danger : COLORS.warning }}>{s.nomProduit}</strong>
                  {" "}— {s.quantite} {s.unite} restants (seuil : {s.seuilAlerte})
                </span>
                <Btn variant="danger" size="sm">Commander</Btn>
              </div>
            );
          })}
        </div>
      )}

      {/* Grille stock */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 18 }}>
        {stock.map(s => {
          const pct = Math.min(100, Math.round((s.quantite / s.quantiteMax) * 100));
          const color = pct <= 20 ? COLORS.danger : pct <= 40 ? COLORS.warning : COLORS.success;
          const isEditing = editId === s.id;
          return (
            <Card key={s.id} className="hover-lift" style={{ padding: "20px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
                <div style={{ fontWeight: 700, fontSize: 14, color: COLORS.textPrimary }}>{s.nomProduit}</div>
                <span style={{
                  fontSize: 10, fontWeight: 700, padding: "3px 8px", borderRadius: RADIUS.full,
                  background: pct <= 20 ? COLORS.dangerPale : pct <= 40 ? COLORS.warningPale : COLORS.successPale,
                  color,
                }}>{pct <= 20 ? "Critique" : pct <= 40 ? "Faible" : "OK"}</span>
              </div>
              <div>
                <span style={{ fontSize: 32, fontWeight: 800, fontFamily: FONTS.display, color }}>{s.quantite}</span>
                <span style={{ fontSize: 13, color: COLORS.textMuted, marginLeft: 4 }}>{s.unite}</span>
              </div>
              <div style={{ height: 5, background: COLORS.darkBorder, borderRadius: RADIUS.full, margin: "12px 0 8px", overflow: "hidden" }}>
                <div style={{ height: "100%", width: `${pct}%`, background: color, borderRadius: RADIUS.full, transition: "width .6s" }}/>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: COLORS.textMuted, marginBottom: 12 }}>
                <span>Seuil : {s.seuilAlerte}</span>
                <span>Max : {s.quantiteMax}</span>
              </div>
              {isEditing ? (
                <div style={{ display: "flex", gap: 6 }}>
                  <input value={editQty} onChange={e => setEditQty(e.target.value)}
                    placeholder="Nouvelle qté" type="number"
                    style={{
                      flex: 1, background: COLORS.charcoal, border: `1px solid ${COLORS.gold}`,
                      borderRadius: RADIUS.sm, padding: "7px 10px", color: COLORS.textPrimary, fontSize: 12, outline: "none",
                    }}/>
                  <Btn size="sm" onClick={() => {
                    onUpdate(s.id, Number(editQty));
                    setEditId(null);
                    showToast("Stock mis à jour.", "success");
                  }}>✓</Btn>
                  <Btn variant="ghost" size="sm" onClick={() => setEditId(null)}>✕</Btn>
                </div>
              ) : (
                <Btn variant="ghost" size="sm" fullWidth onClick={() => { setEditId(s.id); setEditQty(String(s.quantite)); }}>
                  ✏ Modifier la quantité
                </Btn>
              )}
            </Card>
          );
        })}

        {/* Bouton ajouter */}
        <div onClick={() => setModalOpen(true)} className="hover-lift" style={{
          border: `2px dashed ${COLORS.darkBorder}`, borderRadius: RADIUS.lg,
          display: "flex", flexDirection: "column", alignItems: "center",
          justifyContent: "center", minHeight: 200, cursor: "pointer",
          color: COLORS.textMuted, transition: "all .2s",
        }}
          onMouseEnter={e => { e.currentTarget.style.borderColor = COLORS.gold; e.currentTarget.style.color = COLORS.gold; }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = COLORS.darkBorder; e.currentTarget.style.color = COLORS.textMuted; }}
        >
          <div style={{ fontSize: 32, marginBottom: 8 }}>+</div>
          <div style={{ fontSize: 13, fontWeight: 600 }}>Nouveau produit</div>
        </div>
      </div>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="Ajouter un produit">
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <Input label="Nom du produit *" placeholder="Ex: Lessive industrielle" value={form.nomProduit} onChange={v => setForm(f => ({ ...f, nomProduit: v }))}/>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <Input label="Quantité" placeholder="0" value={form.quantite} onChange={v => setForm(f => ({ ...f, quantite: v }))} type="number"/>
            <Select label="Unité" value={form.unite} onChange={v => setForm(f => ({ ...f, unite: v }))}
              options={[{ value: "kg", label: "kg" },{ value: "litres", label: "litres" },{ value: "pièces", label: "pièces" },{ value: "unités", label: "unités" }]}/>
            <Input label="Seuil alerte" placeholder="10" value={form.seuilAlerte} onChange={v => setForm(f => ({ ...f, seuilAlerte: v }))} type="number"/>
            <Input label="Quantité max" placeholder="50" value={form.quantiteMax} onChange={v => setForm(f => ({ ...f, quantiteMax: v }))} type="number"/>
          </div>
          <div style={{ display: "flex", gap: 10, marginTop: 4 }}>
            <Btn variant="ghost" fullWidth onClick={() => setModalOpen(false)}>Annuler</Btn>
            <Btn fullWidth onClick={submit}>💾 Enregistrer</Btn>
          </div>
        </div>
      </Modal>
    </div>
  );
};

// ─────────────────────────────────────────────
// 15. PAGE — PROFIL
// ─────────────────────────────────────────────
const PageProfil: React.FC<{ onLogout: () => void }> = ({ onLogout }) => {
  const [nom, setNom]   = useState("Marie Koudou");
  const [email, setEmail] = useState("admin@majestic.cm");
  const [tel, setTel]   = useState("+237 691 000 001");

  return (
    <div className="anim-fade-in">
      <h2 style={{ fontFamily: FONTS.display, fontSize: 22, fontWeight: 700, marginBottom: 24 }}>Profil & Paramètres</h2>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1.5fr", gap: 24 }}>
        <Card style={{ padding: 28, textAlign: "center" }}>
          <div style={{
            width: 80, height: 80, borderRadius: "50%",
            background: `linear-gradient(135deg, ${COLORS.gold}, ${COLORS.goldDark})`,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 32, fontWeight: 800, color: COLORS.black,
            margin: "0 auto 16px",
          }}>MK</div>
          <div style={{ fontFamily: FONTS.display, fontSize: 20, fontWeight: 700 }}>{nom}</div>
          <div style={{ color: COLORS.textSecondary, fontSize: 13, margin: "4px 0 18px" }}>Administratrice</div>
          <div style={{
            background: `${COLORS.gold}12`, border: `1px solid ${COLORS.gold}30`,
            borderRadius: RADIUS.md, padding: "8px 16px", fontSize: 12, color: COLORS.gold,
          }}>✦ Majestic Pressing · Yaoundé</div>
          <Btn variant="danger" fullWidth style={{ marginTop: 20 }} onClick={onLogout}>⎋ Se déconnecter</Btn>
        </Card>

        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <Card>
            <CardHeader title="Informations personnelles"/>
            <div style={{ padding: 22, display: "flex", flexDirection: "column", gap: 16 }}>
              <Input label="Nom complet" value={nom} onChange={setNom}/>
              <Input label="Email" value={email} onChange={setEmail} type="email"/>
              <Input label="Téléphone" value={tel} onChange={setTel}/>
              <Btn>💾 Sauvegarder</Btn>
            </div>
          </Card>
          <Card>
            <CardHeader title="Sécurité"/>
            <div style={{ padding: 22, display: "flex", flexDirection: "column", gap: 16 }}>
              <Input label="Nouveau mot de passe" value="" onChange={() => {}} type="password" placeholder="••••••••"/>
              <Input label="Confirmer le mot de passe" value="" onChange={() => {}} type="password" placeholder="••••••••"/>
              <Btn variant="secondary">🔒 Changer le mot de passe</Btn>
            </div>
          </Card>
          <Card>
            <CardHeader title="À propos de l'application"/>
            <div style={{ padding: "16px 22px", fontSize: 13, color: COLORS.textSecondary, lineHeight: 1.8 }}>
              <p>💎 <strong style={{ color: COLORS.gold }}>Majestic Pressing</strong> v1.0</p>
              <p>Stack : React 18 · TypeScript · IndexedDB (idb)</p>
              <p>Projet TP — Équipe de 8 étudiants · Yaoundé, Cameroun</p>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────
// 16. APP PRINCIPALE
// ─────────────────────────────────────────────
export default function App() {
  // État global
  const [page, setPage]       = useState<Page>("login");
  const [loggedIn, setLoggedIn] = useState(false);
  const [clients, setClients]   = useState<Client[]>(INIT_CLIENTS);
  const [vetements, setVetements] = useState<Vetement[]>(INIT_VETEMENTS);
  const [paiements, setPaiements] = useState<Paiement[]>(INIT_PAIEMENTS);
  const [stock, setStock]       = useState<ProduitStock[]>(INIT_STOCK);
  const [toast, setToast]       = useState<{ msg: string; type: "success"|"error"|"info" } | null>(null);

  // Injecter CSS global
  useEffect(() => {
    const style = document.createElement("style");
    style.innerHTML = GLOBAL_CSS;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);

  const showToast = useCallback((msg: string, type: "success"|"error"|"info") => {
    setToast({ msg, type });
  }, []);

  const navigate = useCallback((p: Page) => {
    if (!loggedIn && p !== "login") return;
    setPage(p);
  }, [loggedIn]);

  const handleLogin = () => { setLoggedIn(true); setPage("dashboard"); };
  const handleLogout = () => { setLoggedIn(false); setPage("login"); };

  const nbAlerts = stock.filter(s => s.quantite <= s.seuilAlerte).length;

  // Actions CRUD
  const addClient   = (c: Client) => setClients(prev => [c, ...prev]);
  const delClient   = (id: string) => setClients(prev => prev.filter(c => c.id !== id));
  const addVetement = (v: Vetement) => setVetements(prev => [v, ...prev]);
  const delVetement = (id: string) => setVetements(prev => prev.filter(v => v.id !== id));
  const addPaiement = (p: Paiement) => setPaiements(prev => [p, ...prev]);
  const addStock    = (s: ProduitStock) => setStock(prev => [...prev, s]);
  const updateStatut = (id: string, statut: StatutVetement) =>
    setVetements(prev => prev.map(v => v.id === id ? { ...v, statut } : v));
  const updateStock = (id: string, qty: number) =>
    setStock(prev => prev.map(s => s.id === id ? { ...s, quantite: qty } : s));

  // Page Login
  if (!loggedIn) return <PageLogin onLogin={handleLogin}/>;

  // App Shell
  return (
    <div style={{ display: "flex", minHeight: "100vh", background: COLORS.black }}>
      <Sidebar current={page} onNavigate={navigate}/>
      <div style={{ marginLeft: 230, flex: 1, display: "flex", flexDirection: "column", minHeight: "100vh" }}>
        <Topbar page={page} onLogout={handleLogout} nbAlerts={nbAlerts}/>
        <div style={{ flex: 1, padding: "28px 32px", overflowY: "auto" }}>
          {page === "dashboard" && (
            <PageDashboard clients={clients} vetements={vetements} paiements={paiements} stock={stock} onNavigate={navigate}/>
          )}
          {page === "clients" && (
            <PageClients clients={clients} vetements={vetements} onAdd={addClient} onDelete={delClient} showToast={showToast}/>
          )}
          {page === "vetements" && (
            <PageVetements vetements={vetements} clients={clients} onAdd={addVetement} onDelete={delVetement} showToast={showToast}/>
          )}
          {page === "statuts" && (
            <PageStatuts vetements={vetements} clients={clients} onUpdateStatut={updateStatut} showToast={showToast}/>
          )}
          {page === "paiements" && (
            <PagePaiements paiements={paiements} vetements={vetements} clients={clients} onAdd={addPaiement} showToast={showToast}/>
          )}
          {page === "stock" && (
            <PageStock stock={stock} onUpdate={updateStock} onAdd={addStock} showToast={showToast}/>
          )}
          {page === "profil" && (
            <PageProfil onLogout={handleLogout}/>
          )}
        </div>
      </div>

      {toast && (
        <Toast msg={toast.msg} type={toast.type} onClose={() => setToast(null)}/>
      )}
    </div>
  );
}