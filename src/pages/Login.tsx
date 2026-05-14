interface LoginProps {
  onLogin: () => void;
}

export default function Login({ onLogin }: LoginProps) {
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(135deg, #f8f9ff, #ede9ff)",
        padding: 16,
      }}
    >
      {/* CARD */}
      <div
        style={{
          width: "100%",
          maxWidth: 420,
          background: "#fff",
          borderRadius: 24,
          padding: "40px 34px",
          boxShadow: "0 20px 60px rgba(108,71,255,0.15)",
        }}
      >
        {/* LOGO */}
        <div style={{ textAlign: "center", marginBottom: 28 }}>
          <svg
            width="60"
            height="60"
            viewBox="0 0 64 64"
            style={{
              animation: "float 3s ease-in-out infinite",
            }}
          >
            <circle cx="32" cy="32" r="30" fill="#F0F2FF" />

            <path
              d="M32 12C25 22 18 30 18 38C18 46 24 52 32 52C40 52 46 46 46 38C46 30 39 22 32 12Z"
              fill="#6C47FF"
            />

            <path
              d="M42 18L44 22L48 24L44 26L42 30L40 26L36 24L40 22L42 18Z"
              fill="#8B6DFF"
            />
          </svg>

          <div
            style={{
              fontSize: 26,
              fontWeight: 800,
              color: "#6c47ff",
              marginTop: 10,
            }}
          >
            PressingPro
          </div>

          <div
            style={{
              fontSize: 12,
              color: "#6b7280",
              marginTop: 4,
            }}
          >
            Gestion de pressing moderne
          </div>
        </div>

        {/* EMAIL */}
        <div style={{ marginBottom: 14 }}>
          <label
            style={{
              fontSize: 12,
              fontWeight: 600,
              color: "#6b7280",
            }}
          >
            Adresse email
          </label>

          <input
            type="email"
            placeholder="admin@pressing.com"
            style={{
              width: "100%",
              marginTop: 6,
              padding: "12px 14px",
              borderRadius: 12,
              border: "1px solid rgba(0,0,0,0.08)",
              background: "#f8f9ff",
              outline: "none",
              fontSize: 13,
            }}
          />
        </div>

        {/* PASSWORD */}
        <div style={{ marginBottom: 22 }}>
          <label
            style={{
              fontSize: 12,
              fontWeight: 600,
              color: "#6b7280",
            }}
          >
            Mot de passe
          </label>

          <input
            type="password"
            placeholder="••••••••"
            style={{
              width: "100%",
              marginTop: 6,
              padding: "12px 14px",
              borderRadius: 12,
              border: "1px solid rgba(0,0,0,0.08)",
              background: "#f8f9ff",
              outline: "none",
              fontSize: 13,
            }}
          />
        </div>

        {/* BUTTON */}
        <button
          onClick={onLogin}
          style={{
            width: "100%",
            padding: 13,
            borderRadius: 12,
            border: "none",
            cursor: "pointer",
            fontSize: 14,
            fontWeight: 600,
            color: "#fff",
            background: "linear-gradient(135deg, #6c47ff, #8b6dff)",
            boxShadow: "0 6px 20px rgba(108,71,255,0.25)",
          }}
        >
          Se connecter →
        </button>

        {/* DIVIDER */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            margin: "22px 0",
            gap: 10,
          }}
        >
          <div
            style={{
              flex: 1,
              height: 1,
              background: "#e5e7eb",
            }}
          />
          <span style={{ fontSize: 12, color: "#9ca3af" }}>ou</span>
          <div
            style={{
              flex: 1,
              height: 1,
              background: "#e5e7eb",
            }}
          />
        </div>

        {/* GOOGLE BUTTON */}
        <button
          style={{
            width: "100%",
            padding: 12,
            borderRadius: 12,
            border: "1px solid rgba(0,0,0,0.08)",
            background: "#fff",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 10,
            fontSize: 13,
            fontWeight: 500,
          }}
        >
          <span>🔵</span>
          Continuer avec Google
        </button>

        {/* FOOTER */}
        <div
          style={{
            textAlign: "center",
            fontSize: 11,
            color: "#9ca3af",
            marginTop: 24,//modification
          }}
        >
          PressingPro v1.0 © 2024
        </div>// Mise a jour UI
      </div>
    </div>
  );
}