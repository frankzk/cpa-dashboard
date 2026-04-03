export function Label({ children }) {
  return (
    <div style={{
      fontSize: 11, color: "#6b7280", textTransform: "uppercase",
      letterSpacing: "0.08em", fontFamily: "'DM Mono', monospace", marginBottom: 6,
    }}>
      {children}
    </div>
  );
}

export function Input({ value, onChange, placeholder, type = "text", style = {} }) {
  return (
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      style={{
        width: "100%", background: "rgba(255,255,255,0.04)",
        border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8,
        padding: "9px 12px", color: "#f1f5f9", fontSize: 13,
        fontFamily: type === "password" ? "monospace" : "'DM Mono', monospace",
        outline: "none", boxSizing: "border-box", ...style,
      }}
    />
  );
}

export function Btn({ children, onClick, variant = "default", disabled, small }) {
  const styles = {
    default: { background: "rgba(255,255,255,0.06)", color: "#e5e7eb", border: "1px solid rgba(255,255,255,0.1)" },
    primary: { background: "#fbbf24", color: "#111827", border: "none", fontWeight: 700 },
    danger: { background: "rgba(239,68,68,0.12)", color: "#ef4444", border: "1px solid rgba(239,68,68,0.2)" },
    ghost: { background: "transparent", color: "#6b7280", border: "1px solid rgba(255,255,255,0.06)" },
  };
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        ...styles[variant],
        borderRadius: 8, padding: small ? "5px 12px" : "9px 18px",
        fontSize: small ? 11 : 13, cursor: disabled ? "not-allowed" : "pointer",
        opacity: disabled ? 0.5 : 1, transition: "opacity 0.15s",
        fontFamily: "'DM Mono', monospace",
      }}
    >
      {children}
    </button>
  );
}

export function Tag({ children, color = "#6b7280" }) {
  return (
    <span style={{
      fontSize: 11, fontFamily: "'DM Mono', monospace",
      background: `${color}18`, border: `1px solid ${color}40`,
      color, borderRadius: 6, padding: "2px 8px",
    }}>
      {children}
    </span>
  );
}

export function StatusDot({ ok }) {
  return (
    <span style={{
      display: "inline-block", width: 8, height: 8, borderRadius: "50%",
      background: ok ? "#22c55e" : "#ef4444", marginRight: 6,
    }} />
  );
}

export function Card({ children, style = {} }) {
  return (
    <div style={{
      background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)",
      borderRadius: 12, padding: 20, ...style,
    }}>
      {children}
    </div>
  );
}
