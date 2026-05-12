interface BadgeProps {
  status: "en_attente" | "en_lavage" | "pret" | "recupere";
}

const statusMap: Record<string, { label: string; color: string; bg: string }> = {
  en_attente: {
    label: "En attente",
    color: "#ff7c2a",
    bg: "rgba(255,124,42,0.1)",
  },
  en_lavage: {
    label: "En lavage",
    color: "#2d9cdb",
    bg: "rgba(45,156,219,0.1)",
  },
  pret: {
    label: "Pret",
    color: "#00c48c",
    bg: "rgba(0,196,140,0.1)",
  },
  recupere: {
    label: "Recupere",
    color: "#6c47ff",
    bg: "rgba(108,71,255,0.1)",
  },
};

export default function Badge({ status }: BadgeProps) {
  const { label, color, bg } = statusMap[status];

  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 6,
        padding: "5px 12px",
        borderRadius: 20,
        fontSize: 12,
        fontWeight: 600,
        background: bg,
        color: color,
      }}
    >
      <span
        style={{
          width: 6,
          height: 6,
          borderRadius: "50%",
          background: color,
          display: "inline-block",
        }}
      />
      {label}
    </span>
  );
}