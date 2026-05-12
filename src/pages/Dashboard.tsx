import StatCard from "../components/UI/StatCard";

interface DashboardProps {
  totalVetements: number;
  enCours: number;
  recuperes: number;
  revenus: number;
}

export default function Dashboard({
  totalVetements = 0,
  enCours = 0,
  recuperes = 0,
  revenus = 0,
}: DashboardProps) {
  return (
    <div>
      {/* HEADER */}
      <div
        style={{
          display: "flex",
          alignItems: "flex-end",
          justifyContent: "space-between",
          marginBottom: 32,
        }}
      >
        <div>
          <div
            style={{
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: "1.5px",
              color: "#6c47ff",
              textTransform: "uppercase",
              marginBottom: 6,
            }}
          >
            Vue generale
          </div>
          <div style={{ fontSize: 28, fontWeight: 700 }}>
            Tableau de bord
          </div>
          <div style={{ fontSize: 13, color: "#6b7280", marginTop: 4 }}>
            Activite du jour
          </div>
        </div>
      </div>

      {/* STATS */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: 16,
          marginBottom: 28,
        }}
      >
        <StatCard
          label="Total vetements"
          value={totalVetements}
          icon="👕"
          iconBg="rgba(108,71,255,0.1)"
          progress={100}
          progressColor="#6c47ff"
        />
        <StatCard
          label="En cours"
          value={enCours}
          icon="🔄"
          iconBg="rgba(45,156,219,0.1)"
          progress={50}
          progressColor="#2d9cdb"
        />
        <StatCard
          label="Recuperes"
          value={recuperes}
          icon="✅"
          iconBg="rgba(0,196,140,0.1)"
          progress={75}
          progressColor="#00c48c"
        />
        <StatCard
          label="Revenus (FCFA)"
          value={revenus}
          icon="💰"
          iconBg="rgba(255,124,42,0.1)"
          progress={60}
          progressColor="#ff7c2a"
        />
      </div>

      {/* DEUX COLONNES */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 300px",
          gap: 20,
        }}
      >
        {/* VETEMENTS RECENTS */}
        <div
          style={{
            background: "#fff",
            border: "1px solid rgba(0,0,0,0.06)",
            borderRadius: 16,
            overflow: "hidden",
            boxShadow: "0 2px 12px rgba(0,0,0,0.04)",
          }}
        >
          <div
            style={{
              padding: "18px 24px",
              borderBottom: "1px solid rgba(0,0,0,0.06)",
              fontWeight: 700,
              fontSize: 15,
            }}
          >
            Vetements recents
          </div>
          <div
            style={{
              padding: 24,
              color: "#9ca3af",
              fontSize: 13,
              textAlign: "center",
            }}
          >
            Les vetements recents apparaitront ici
          </div>
        </div>

        {/* ACTIVITE */}
        <div
          style={{
            background: "#fff",
            border: "1px solid rgba(0,0,0,0.06)",
            borderRadius: 16,
            overflow: "hidden",
            boxShadow: "0 2px 12px rgba(0,0,0,0.04)",
          }}
        >
          <div
            style={{
              padding: "18px 24px",
              borderBottom: "1px solid rgba(0,0,0,0.06)",
              fontWeight: 700,
              fontSize: 15,
            }}
          >
            Activite du jour
          </div>
          <div
            style={{
              padding: 24,
              color: "#9ca3af",
              fontSize: 13,
              textAlign: "center",
            }}
          >
            L'activite du jour apparaitra ici
          </div>
        </div>
      </div>
    </div>
  );
}