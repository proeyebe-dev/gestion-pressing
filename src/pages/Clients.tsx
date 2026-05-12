import Button from "../components/UI/Button";
import Modal from "../components/UI/Modal";
import { useState } from "react";

export default function Clients() {
  const [modalOpen, setModalOpen] = useState(false);

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
            Gestion
          </div>
          <div style={{ fontSize: 28, fontWeight: 700 }}>Clients</div>
          <div style={{ fontSize: 13, color: "#6b7280", marginTop: 4 }}>
            Gestion de la base clients
          </div>
        </div>
        <Button label="+ Nouveau client" onClick={() => setModalOpen(true)} />
      </div>

      {/* TABLEAU */}
      <div
        style={{
          background: "#fff",
          border: "1px solid rgba(0,0,0,0.06)",
          borderRadius: 16,
          overflow: "hidden",
          boxShadow: "0 2px 12px rgba(0,0,0,0.04)",
        }}
      >
        {/* HEAD */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "18px 24px",
            borderBottom: "1px solid rgba(0,0,0,0.06)",
          }}
        >
          <span style={{ fontSize: 15, fontWeight: 700 }}>
            Base clients
          </span>
          <input
            placeholder="Rechercher un client..."
            style={{
              background: "#f0f2ff",
              border: "1px solid rgba(0,0,0,0.08)",
              borderRadius: 10,
              padding: "8px 14px",
              fontSize: 13,
              outline: "none",
              width: 220,
            }}
          />
        </div>

        {/* TABLE */}
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              {["Nom", "Telephone", "Email", "Vetements", "Dernier depot", "Actions"].map((h) => (
                <th
                  key={h}
                  style={{
                    textAlign: "left",
                    padding: "12px 24px",
                    fontSize: 11,
                    fontWeight: 700,
                    color: "#9ca3af",
                    textTransform: "uppercase",
                    letterSpacing: "0.8px",
                    borderBottom: "1px solid rgba(0,0,0,0.06)",
                    background: "#f8f9ff",
                  }}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr>
              <td
                colSpan={6}
                style={{
                  padding: 32,
                  textAlign: "center",
                  color: "#9ca3af",
                  fontSize: 13,
                }}
              >
                Les clients enregistres apparaitront ici
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* MODAL AJOUT CLIENT */}
      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Nouveau client"
      >
        <div style={{ marginBottom: 16 }}>
          <label style={{ display: "block", fontSize: 12, color: "#6b7280", fontWeight: 600, marginBottom: 7 }}>
            Nom complet
          </label>
          <input
            placeholder="Ex: Aminata Diallo"
            style={{
              width: "100%",
              background: "#f8f9ff",
              border: "1px solid rgba(0,0,0,0.08)",
              borderRadius: 10,
              padding: "10px 14px",
              fontSize: 13.5,
              outline: "none",
            }}
          />
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 16 }}>
          <div>
            <label style={{ display: "block", fontSize: 12, color: "#6b7280", fontWeight: 600, marginBottom: 7 }}>
              Telephone
            </label>
            <input
              placeholder="Ex: +221 77 123 45 67"
              style={{
                width: "100%",
                background: "#f8f9ff",
                border: "1px solid rgba(0,0,0,0.08)",
                borderRadius: 10,
                padding: "10px 14px",
                fontSize: 13.5,
                outline: "none",
              }}
            />
          </div>
          <div>
            <label style={{ display: "block", fontSize: 12, color: "#6b7280", fontWeight: 600, marginBottom: 7 }}>
              Email
            </label>
            <input
              type="email"
              placeholder="Ex: aminata@email.com"
              style={{
                width: "100%",
                background: "#f8f9ff",
                border: "1px solid rgba(0,0,0,0.08)",
                borderRadius: 10,
                padding: "10px 14px",
                fontSize: 13.5,
                outline: "none",
              }}
            />
          </div>
        </div>

        <div style={{ marginBottom: 16 }}>
          <label style={{ display: "block", fontSize: 12, color: "#6b7280", fontWeight: 600, marginBottom: 7 }}>
            Adresse
          </label>
          <input
            placeholder="Ex: Dakar, Senegal"
            style={{
              width: "100%",
              background: "#f8f9ff",
              border: "1px solid rgba(0,0,0,0.08)",
              borderRadius: 10,
              padding: "10px 14px",
              fontSize: 13.5,
              outline: "none",
            }}
          />
        </div>

        <div style={{ display: "flex", gap: 10, justifyContent: "flex-end", marginTop: 24 }}>
          <Button label="Annuler" variant="ghost" onClick={() => setModalOpen(false)} />
          <Button label="Enregistrer" onClick={() => setModalOpen(false)} />
        </div>
      </Modal>
    </div>
  );
}