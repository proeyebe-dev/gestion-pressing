interface TopbarProps {
  page: string;
  setPage: (page: string) => void;
  onMenuClick: () => void;
}

export default function Topbar({
  page,
  setPage,
  onMenuClick,
}: TopbarProps) {
  return (
    <header
      style={{
        height: 60,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 20px",
        borderBottom: "1px solid rgba(0,0,0,0.06)",
        background: "#fff",
      }}
    >
      {/* LEFT */}
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        {/* MENU BUTTON (MOBILE) */}
        <button
          onClick={onMenuClick}
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            display: "flex",
            flexDirection: "column",
            gap: 3,
          }}
        >
          <span style={{ width: 18, height: 2, background: "#1a1a2e" }} />
          <span style={{ width: 18, height: 2, background: "#1a1a2e" }} />
          <span style={{ width: 18, height: 2, background: "#1a1a2e" }} />
        </button>

        <div style={{ fontWeight: 600 }}>PressingPro</div>
      </div>

      {/* RIGHT */}
      <div style={{ fontSize: 13, color: "#6b7280" }}>
        {page}
      </div>
    </header>
  );
}