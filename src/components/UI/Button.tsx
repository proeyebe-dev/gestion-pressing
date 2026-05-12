interface ButtonProps {
  label: string;
  onClick?: () => void;
  variant?: "primary" | "ghost" | "danger";
  fullWidth?: boolean;
  small?: boolean;
}

export default function Button({ 
  label, 
  onClick, 
  variant = "primary",
  fullWidth = false,
  small = false 
}: ButtonProps) {
  const styles: Record<string, React.CSSProperties> = {
    primary: {
      background: "linear-gradient(135deg, #6c47ff, #8b6dff)",
      color: "#fff",
      border: "none",
      boxShadow: "0 4px 16px rgba(108,71,255,0.3)",
    },
    ghost: {
      background: "#fff",
      color: "#6b7280",
      border: "1px solid rgba(0,0,0,0.08)",
    },
    danger: {
      background: "linear-gradient(135deg, #ff4d6d, #ff7c2a)",
      color: "#fff",
      border: "none",
    },
  };

  return (
    <button
      onClick={onClick}
      style={{
        ...styles[variant],
        padding: small ? "6px 14px" : "10px 20px",
        borderRadius: 10,
        fontSize: small ? 12 : 13.5,
        fontWeight: 600,
        cursor: "pointer",
        width: fullWidth ? "100%" : "auto",
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        transition: "all 0.2s",
        fontFamily: "inherit",
      }}
    >
      {label}
    </button>
  );
}
