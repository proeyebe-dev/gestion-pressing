import { useState } from "react";
import Button from "../components/UI/Button";

const mockStock = [
  {
    id: 1,
    produit: "Savon liquide",
    quantite: 12,
    statut: "OK",
  },
  {
    id: 2,
    produit: "Détergent",
    quantite: 4,
    statut: "Faible",
  },
  {
    id: 3,
    produit: "Adoucissant",
    quantite: 0,
    statut: "Rupture",
  },
];

const statusColor: Record<string, string> = {
  OK: "#00c48c",
  Faible: "#ff7c2a",
  Rupture: "#ff4d6d",
};

export default function Stock() {
  const [data] = useState(mockStock);

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
            Inventaire
          </div>

          <div style={{ fontSize: 28, fontWeight: 700 }}>
            Gestion du stock
          </div>

          <div style={{ fontSize: 13, color: "#6b7280", marginTop: 4 }}>
            Produits de pressing et quantités disponibles
          </div>
        </div>

        <Button label="+ Ajouter produit" />
      </div>

      {/* STATS */}
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
            border: "1px solid rgba(0,0,0,0.06)",
            borderRadius: 16,
            padding: 18,
            boxShadow: "0 2px 12px rgba(0,0,0,0.04)",
          }}
        >
          <div style={{ fontSize: 12, color: "#6b7280" }}>
            Produits OK
          </div>
          <div style={{ fontSize: 20, fontWeight: 700, color: "#00c48c" }}>
            1
          </div>
        </div>

        <div
          style={{
            background: "#fff",
            border: "1px solid rgba(0,0,0,0.06)",
            borderRadius: 16,
            padding: 18,
            boxShadow: "0 2px 12px rgba(0,0,0,0.04)",
          }}
        >
          <div style={{ fontSize: 12, color: "#6b7280" }}>
            Stock faible
          </div>
          <div style={{ fontSize: 20, fontWeight: 700, color: "#ff7c2a" }}>
            1
          </div>
        </div>

        <div
          style={{
            background: "#fff",
            border: "1px solid rgba(0,0,0,0.06)",
            borderRadius: 16,
            padding: 18,
            boxShadow: "0 2px 12px rgba(0,0,0,0.04)",
          }}
        >
          <div style={{ fontSize: 12, color: "#6b7280" }}>
            Rupture
          </div>
          <div style={{ fontSize: 20, fontWeight: 700, color: "#ff4d6d" }}>
            1
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
        {/* HEADER */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr 1fr 120px",
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
          <div>Produit</div>
          <div>Quantité</div>
          <div>Statut</div>
          <div>Action</div>
        </div>

        {/* ROWS */}
        {data.map((item) => (
          <div
            key={item.id}
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr 1fr 120px",
              padding: "16px 24px",
              borderBottom: "1px solid rgba(0,0,0,0.04)",
              alignItems: "center",
              fontSize: 13,
            }}
          >
            <div style={{ fontWeight: 600 }}>{item.produit}</div>

            <div style={{ color: "#6b7280" }}>{item.quantite}</div>

            {/* BADGE */}
            <div
              style={{
                display: "inline-flex",
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

            {/* ACTION */}
            <div>
              <Button label="Modifier" small variant="ghost" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}