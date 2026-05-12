interface SidebarProps {
  page: string;
  setPage: (page: string) => void;
  onLogout: () => void;
  open?: boolean;
}

const nav = [
  { key: "dashboard", icon: "📊", label: "Dashboard" },
  { key: "vetements", icon: "👕", label: "Vetements" },
  { key: "clients", icon: "👤", label: "Clients" },
  { key: "statuts", icon: "📋", label: "Statuts" },
  { key: "paiements", icon: "💳", label: "Paiements" },
  { key: "stock", icon: "📦", label: "Stock" },
];

export default function Sidebar({ page, setPage, onLogout }: SidebarProps) {
  return (
    <aside
  style={{
    width: 240,
    background: "#fff",
    borderRight: "1px solid rgba(0,0,0,0.08)",
    display: "flex",
    flexDirection: "column",
    padding: "20px 14px",
    flexShrink: 0,
    boxShadow: "2px 0 12px rgba(0,0,0,0.04)",

    /* 🔥 IMPORTANT POUR LE MENU MOBILE */
    position: "fixed",
    top: 0,
    left: 0,
    height: "100vh",
    zIndex: 999,

    /* 🎯 ANIMATION OUVERTURE / FERMETURE */
    transform: open ? "translateX(0)" : "translateX(-100%)",
    transition: "transform 0.3s ease",
  }}
>
    
      {/* NAV LABEL */}
      <div
        style={{
          fontSize: 10,
          fontWeight: 700,
          letterSpacing: "1.5px",
          color: "#9ca3af",
          textTransform: "uppercase",
          padding: "14px 10px 6px",
        }}
      >
        Navigation
      </div>

      {/* NAV ITEMS */}
      {nav.map((n) => (
        <div
          key={n.key}
          onClick={() => setPage(n.key)}
          style={{
  display: "flex",
  alignItems: "center",
  gap: 10,
  padding: "10px 12px",
  borderRadius: 10,
  cursor: "pointer",
  color: page === n.key ? "#6c47ff" : "#6b7280",
  background: page === n.key ? "rgba(108,71,255,0.08)" : "transparent",
  fontWeight: page === n.key ? 600 : 500,
  fontSize: 13.5,
  marginBottom: 2,
  border: page === n.key
    ? "1px solid rgba(108,71,255,0.15)"
    : "1px solid transparent",
  transform: "translateX(0)",
}}
onMouseEnter={(e) => {
  if (page !== n.key) {
    (e.currentTarget as HTMLDivElement).style.transform =
      "translateX(4px)";
  }
}}
onMouseLeave={(e) => {
  (e.currentTarget as HTMLDivElement).style.transform =
    "translateX(0)";
}}
        >
          <span style={{ fontSize: 16, width: 20, textAlign: "center" }}>{n.icon}</span>
          <span>{n.label}</span>
        </div>
      ))}

      {/* BOTTOM */}
      <div
        style={{
          marginTop: "auto",
          borderTop: "1px solid rgba(0,0,0,0.08)",
          paddingTop: 14,
        }}
      >
        {/* USER CARD */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            padding: "10px 12px",
            borderRadius: 10,
            background: "#f0f2ff",
            marginBottom: 8,
          }}
        >
          <div
            style={{
              width: 32,
              height: 32,
              borderRadius: 8,
              background: "linear-gradient(135deg, #6c47ff, #8b6dff)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 12,
              fontWeight: 700,
              color: "#fff",
            }}
          >
            AP
          </div>
          <div>
            <div style={{ fontSize: 13, fontWeight: 600 }}>Admin</div>
            <div style={{ fontSize: 11, color: "#6b7280" }}>Administrateur</div>
          </div>
        </div>

        {/* LOGOUT */}
        <div
          onClick={onLogout}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            padding: "10px 12px",
            borderRadius: 10,
            cursor: "pointer",
            color: "#ff4d6d",
            fontWeight: 500,
            fontSize: 13.5,
            transition: "all 0.2s",
          }}
        >
          <span style={{ fontSize: 16 }}>🚪</span>
          <span>Deconnexion</span>
        </div>
      </div>
    </aside>
  );
}