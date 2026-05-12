import { useState } from "react";
import Button from "../components/UI/Button";

const mockPaiements = [
  {
    id: 1,
    client: "Aminata Diallo",
    montant: 5000,
    statut: "Payé",
    methode: "Mobile Money",
  },
  {
    id: 2,
    client: "Jean Paul",
    montant: 8000,
    statut: "Non payé",
    methode: "Cash",
  },
  {
    id: 3,
    client: "Fatou Ndiaye",
    montant: 3000,
    statut: "Payé",
    methode: "Mobile Money",
  },
];

const statusColor: Record<string, string> = {
  "Payé": "#00c48c",
  "Non payé": "#ff4d6d",
};

export default function Paiements() {
  const [data] = useState(mockPaiements);

  return (
    <div>
      {/* HEADER */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-end",
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
            Finance
          </div>

          <div style={{ fontSize: 28, fontWeight: 700 }}>
            Paiements
          </div>

          <div style={{ fontSize: 13, color: "#6b7280", marginTop: 4 }}>
            Gestion des transactions clients
          </div>
        </div>

        <Button label="+ Nouvelle facture" />
      </div>

      {/* CARDS STATS */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: 16,
          marginBottom: 28,
        }}
      >
        <div
          style={{
            background: "#fff",
            padding: 18,
            borderRadius: 16,
            border: "1px solid rgba(0,0,0,0.06)",
            boxShadow: "0 2px 12px rgba(0,0,0,0.04)",
          }}
        >
          <div style={{ fontSize: 12, color: "#6b7280" }}>
            Total encaissé
          </div>
          <div style={{ fontSize: 20, fontWeight: 700, color: "#00c48c" }}>
            16 000 FCFA
          </div>
        </div>

        <div
          style={{
            background: "#fff",
            padding: 18,
            borderRadius: 16,
            border: "1px solid rgba(0,0,0,0.06)",
            boxShadow: "0 2px 12px rgba(0,0,0,0.04)",
          }}
        >
          <div style={{ fontSize: 12, color: "#6b7280" }}>
            Non payés
          </div>
          <div style={{ fontSize: 20, fontWeight: 700, color: "#ff4d6d" }}>
            1 client
          </div>
        </div>

        <div
          style={{
            background: "#fff",
            padding: 18,
            borderRadius: 16,
            border: "1px solid rgba(0,0,0,0.06)",
            boxShadow: "0 2px 12px rgba(0,0,0,0.04)",
          }}
        >
          <div style={{ fontSize: 12, color: "#6b7280" }}>
            Moyenne
          </div>
          <div style={{ fontSize: 20, fontWeight: 700, color: "#6c47ff" }}>
            5 300 FCFA
          </div>
        </div>
      </div>

      {/* TABLE */}
      <div
        style={{
          background: "#fff",
          border: "1px solid rgba(0,0,0,0.06)",
          borderRadius: 16,
          overflow: "hidden",
          boxShadow: "0 2px 12px rgba(0,0,0,0.04)",
        }}
      >
        {/* HEADER TABLE */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr 1fr 1fr 120px",
            padding: "16px 24px",
            background: "#f8f9ff",
            borderBottom: "1px solid rgba(0,0,0,0.06)",
            fontSize: 11,
            fontWeight: 700,
            color: "#9ca3af",
            textTransform: "uppercase",
            letterSpacing: "0.8px",
          }}
        >
          <div>Client</div>
          <div>Montant</div>
          <div>Méthode</div>
          <div>Statut</div>
          <div>Action</div>
        </div>

        {/* ROWS */}
        {data.map((p) => (
          <div
            key={p.id}
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr 1fr 1fr 120px",
              padding: "16px 24px",
              borderBottom: "1px solid rgba(0,0,0,0.04)",
              alignItems: "center",
              fontSize: 13,
            }}
          >
            <div style={{ fontWeight: 600 }}>{p.client}</div>

            <div style={{ color: "#1a1a2e", fontWeight: 600 }}>
              {p.montant} FCFA
            </div>

            <div style={{ color: "#6b7280" }}>{p.methode}</div>

            {/* BADGE */}
            <div
              style={{
                display: "inline-flex",
                padding: "6px 10px",
                borderRadius: 999,
                fontSize: 12,
                fontWeight: 600,
                width: "fit-content",
                background: `${statusColor[p.statut]}15`,
                color: statusColor[p.statut],
              }}
            >
              {p.statut}
            </div>

            {/* ACTION */}
            <div>
              <Button label="Facture" small variant="ghost" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}