import { Label, Input, Card, Tag } from "./ui";

const COUNTRIES = [
  { code: "PE", name: "Perú", flag: "🇵🇪" },
  { code: "CR", name: "Costa Rica", flag: "🇨🇷" },
  { code: "HN", name: "Honduras", flag: "🇭🇳" },
  { code: "ES", name: "España", flag: "🇪🇸" },
  { code: "IT", name: "Italia", flag: "🇮🇹" },
  { code: "AR", name: "Argentina", flag: "🇦🇷" },
  { code: "PA", name: "Panamá", flag: "🇵🇦" },
  { code: "CL", name: "Chile", flag: "🇨🇱" },
];

export default function StepTiendas({ cfg, setCfg }) {
  const ventasTabs = cfg.ventasTabs || [];
  const adsTabs = cfg.adsTabs || [];
  const tiendas = cfg.tiendas || {};

  const setTienda = (tab, field, value) => {
    setCfg((p) => ({
      ...p,
      tiendas: { ...p.tiendas, [tab]: { ...(p.tiendas?.[tab] || {}), [field]: value } },
    }));
  };

  const toggleAccount = (tab, accTab) => {
    const current = tiendas[tab]?.accounts || [];
    const next = current.includes(accTab)
      ? current.filter((a) => a !== accTab)
      : [...current, accTab];
    setTienda(tab, "accounts", next);
  };

  const assignedElsewhere = (tab, accTab) =>
    Object.entries(tiendas).some(([t, v]) => t !== tab && v.accounts?.includes(accTab));

  if (!ventasTabs.length) {
    return (
      <div style={{ textAlign: "center", padding: "40px 0", color: "#4b5563" }}>
        Conecta los sheets primero en el paso anterior
      </div>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div style={{ fontSize: 12, color: "#6b7280" }}>
        Cada pestaña del Sheet de Ventas es una tienda. Configura su país, CPA objetivo y qué
        cuentas publicitarias le pertenecen.
      </div>

      {ventasTabs.map((tab) => {
        const t = tiendas[tab] || {};
        return (
          <Card key={tab}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
              <div style={{ fontSize: 16, fontWeight: 700, color: "#f1f5f9" }}>{tab}</div>
              <Tag color="#a78bfa">tienda</Tag>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 120px", gap: 12, marginBottom: 14 }}>
              <div>
                <Label>Nombre visible</Label>
                <Input
                  value={t.name || tab}
                  onChange={(v) => setTienda(tab, "name", v)}
                  placeholder={tab}
                />
              </div>
              <div>
                <Label>País</Label>
                <select
                  value={t.country || ""}
                  onChange={(e) => setTienda(tab, "country", e.target.value)}
                  style={{
                    width: "100%", background: "#0f1420",
                    border: "1px solid rgba(255,255,255,0.1)", color: "#e5e7eb",
                    borderRadius: 8, padding: "9px 12px", fontSize: 13,
                    outline: "none", cursor: "pointer",
                  }}
                >
                  <option value="">— seleccionar —</option>
                  {COUNTRIES.map((c) => (
                    <option key={c.code} value={c.code}>{c.flag} {c.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <Label>CPA objetivo $</Label>
                <Input
                  type="number"
                  value={t.cpaTarget || ""}
                  onChange={(v) => setTienda(tab, "cpaTarget", Number(v))}
                  placeholder="15"
                />
              </div>
            </div>

            <Label>Cuentas publicitarias asignadas (del Sheet Ads)</Label>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 6 }}>
              {adsTabs.map((acc) => {
                const selected = t.accounts?.includes(acc);
                const blocked = !selected && assignedElsewhere(tab, acc);
                return (
                  <button
                    key={acc}
                    disabled={blocked}
                    onClick={() => !blocked && toggleAccount(tab, acc)}
                    style={{
                      background: selected ? "rgba(34,197,94,0.12)" : "rgba(255,255,255,0.03)",
                      border: `1px solid ${selected ? "rgba(34,197,94,0.4)" : "rgba(255,255,255,0.08)"}`,
                      color: blocked ? "#374151" : selected ? "#22c55e" : "#9ca3af",
                      borderRadius: 8, padding: "5px 12px", fontSize: 12,
                      cursor: blocked ? "not-allowed" : "pointer",
                      fontFamily: "'DM Mono', monospace", transition: "all 0.15s",
                    }}
                  >
                    {selected ? "✓ " : ""}{acc}{blocked && " (asignada)"}
                  </button>
                );
              })}
              {!adsTabs.length && (
                <span style={{ color: "#374151", fontSize: 12 }}>No hay pestañas de Ads detectadas</span>
              )}
            </div>
          </Card>
        );
      })}
    </div>
  );
}
