import { useState } from "react";
import Button from "../components/UI/Button";

const mockData = [
  { id: 1, client: "Aminata Diallo", vetement: "Robe", statut: "En attente" },
  { id: 2, client: "Jean Paul", vetement: "Costume", statut: "En lavage" },
  { id: 3, client: "Fatou Ndiaye", vetement: "Jupe", statut: "Prêt" },
  { id: 4, client: "Moussa Kane", vetement: "Chemise", statut: "Récupéré" },
];

const statusColor: Record<string, string> = {
  "En attente": "#6c47ff",
  "En lavage": "#2d9cdb",
  "Prêt": "#ff7c2a",
  "Récupéré": "#00c48c",
};

export default function Statuts() {
  const [data] = useState(mockData);

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
            Suivi
          </div>

          <div style={{ fontSize: 28, fontWeight: 700 }}>
            Statuts des vêtements
          </div>

          <div style={{ fontSize: 13, color: "#6b7280", marginTop: 4 }}>
            Gestion des états de traitement
          </div>
        </div>

        <Button label="+ Filtrer" variant="ghost" />
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
            gridTemplateColumns: "1fr 1fr 1fr 160px",
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
          <div>Vêtement</div>
          <div>Statut</div>
          <div>Action</div>
        </div>

        {/* ROWS */}
        {data.map((item) => (
          <div
            key={item.id}
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr 1fr 160px",
              padding: "16px 24px",
              borderBottom: "1px solid rgba(0,0,0,0.04)",
              alignItems: "center",
              fontSize: 13,
            }}
          >
            <div style={{ fontWeight: 600 }}>{item.client}</div>

            <div style={{ color: "#6b7280" }}>{item.vetement}</div>

            {/* BADGE STATUT */}
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                padding: "6px 10px",
                borderRadius: 999,
                fontSize: 12,
                fontWeight: 600,
                width: "fit-content",
                background: `${statusColor[item.statut]}15`,
                color: statusColor[item.statut],
              }}
            >
              {item.statut}
            </div>

            {/* ACTION UI */}
            <div>
              <select
                style={{
                  padding: "6px 10px",
                  borderRadius: 10,
                  border: "1px solid rgba(0,0,0,0.08)",
                  background: "#f8f9ff",
                  fontSize: 12,
                  outline: "none",
                }}
              >
                <option>Changer statut</option>
                <option>En attente</option>
                <option>En lavage</option>
                <option>Prêt</option>
                <option>Récupéré</option>
              </select>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}