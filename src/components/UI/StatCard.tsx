interface StatCardProps {
  label: string;
  value: string | number;
  icon: string;
  iconBg: string;
  progressColor?: string;
  progress?: number;
}

export default function StatCard({
  label,
  value,
  icon,
  iconBg,
  progressColor,
  progress,
}: StatCardProps) {
  return (
    <div
      style={{
        background: "#fff",
        border: "1px solid rgba(0,0,0,0.06)",
        borderRadius: 16,
        padding: "22px 24px",
        boxShadow: "0 2px 12px rgba(0,0,0,0.04)",
        transition: "transform 0.2s, box-shadow 0.2s",
        cursor: "default",
      }}
    >
      <div
        style={{
          width: 44,
          height: 44,
          borderRadius: 12,
          background: iconBg,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 20,
          marginBottom: 14,
        }}
      >
        {icon}
      </div>

      <div style={{ fontSize: 12, color: "#6b7280", fontWeight: 500, marginBottom: 6 }}>
        {label}
      </div>

      <div style={{ fontSize: 32, fontWeight: 700, lineHeight: 1 }}>
        {value}
      </div>

      {progress !== undefined && (
        <div
          style={{
            background: "#f0f2ff",
            borderRadius: 4,
            height: 6,
            marginTop: 12,
            overflow: "hidden",
          }}
        >
          <div
            style={{
              width: `${progress}%`,
              height: "100%",
              borderRadius: 4,
              background: progressColor || "#6c47ff",
            }}
          />
        </div>
      )}
    </div>
  );
}