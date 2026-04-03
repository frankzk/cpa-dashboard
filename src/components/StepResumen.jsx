import { Label, Btn, Card, Tag, StatusDot } from "./ui";

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

export default function StepResumen({ cfg, onSave, saving, saved }) {
  const tiendas = cfg.tiendas || {};
  const mapping = cfg.campaignMapping || {};
  const mapped = Object.keys(mapping).filter((k) => mapping[k]).length;
  const total = (cfg.products || []).length;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>

      {/* API status */}
      <Card>
        <Label>Conexión Google Sheets</Label>
        <div style={{ display: "flex", gap: 16, flexWrap: "wrap", marginTop: 6 }}>
          <div style={{ fontSize: 13, color: "#e5e7eb" }}>
            <StatusDot ok={!!cfg.apiKey} />API Key {cfg.apiKey ? "configurada" : "pendiente"}
          </div>
          <div style={{ fontSize: 13, color: "#e5e7eb" }}>
            <StatusDot ok={(cfg.adsTabs || []).length > 0} />
            Ads: {(cfg.adsTabs || []).length} pestañas
          </div>
          <div style={{ fontSize: 13, color: "#e5e7eb" }}>
            <StatusDot ok={(cfg.ventasTabs || []).length > 0} />
            Ventas: {(cfg.ventasTabs || []).length} pestañas
          </div>
        </div>
      </Card>

      {/* Tiendas summary */}
      <Card>
        <Label>Tiendas configuradas</Label>
        <div style={{ display: "flex", flexDirection: "column", gap: 8, marginTop: 8 }}>
          {Object.entries(tiendas).map(([tab, t]) => {
            const country = COUNTRIES.find((c) => c.code === t.country);
            return (
              <div key={tab} style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
                <span style={{ fontSize: 16 }}>{country?.flag || "🏪"}</span>
                <span style={{ fontSize: 13, color: "#f1f5f9", fontWeight: 600 }}>{t.name || tab}</span>
                {t.cpaTarget && <Tag color="#fbbf24">CPA ${t.cpaTarget}</Tag>}
                {(t.accounts || []).map((a) => <Tag key={a} color="#22c55e">{a}</Tag>)}
                {!(t.accounts || []).length && <Tag color="#ef4444">sin cuentas</Tag>}
              </div>
            );
          })}
          {!Object.keys(tiendas).length && (
            <span style={{ color: "#374151", fontSize: 12 }}>Sin tiendas configuradas</span>
          )}
        </div>
      </Card>

      {/* Campaigns */}
      <Card>
        <Label>Mapeo de campañas</Label>
        <div style={{ fontSize: 13, color: "#e5e7eb", marginTop: 6 }}>
          <StatusDot ok={mapped > 0} />
          {mapped} campaña(s) mapeadas · {total} producto(s) en master list
        </div>
        <div style={{ marginTop: 10, display: "flex", flexDirection: "column", gap: 4, maxHeight: 200, overflowY: "auto" }}>
          {Object.entries(mapping)
            .filter(([, v]) => v)
            .map(([camp, prod]) => (
              <div key={camp} style={{
                fontSize: 11, color: "#9ca3af", fontFamily: "'DM Mono', monospace",
                display: "flex", gap: 8,
              }}>
                <span style={{ color: "#6b7280", flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {camp}
                </span>
                <span style={{ color: "#374151" }}>→</span>
                <span style={{ color: "#fbbf24" }}>{prod}</span>
              </div>
            ))}
        </div>
      </Card>

      {/* Save to Drive */}
      <Card style={{ border: "1px solid rgba(251,191,36,0.15)", background: "rgba(251,191,36,0.03)" }}>
        <Label>Guardar en Google Drive</Label>
        <div style={{ fontSize: 12, color: "#6b7280", marginBottom: 14 }}>
          Tu configuración se guarda en la carpeta privada de esta app en tu Google Drive.
          Estará disponible la próxima vez que inicies sesión.
        </div>
        <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
          <Btn variant="primary" onClick={onSave} disabled={saving}>
            {saving ? "Guardando..." : "💾 Guardar configuración"}
          </Btn>
          {saved && (
            <span style={{ fontSize: 13, color: "#22c55e", fontFamily: "'DM Mono', monospace" }}>
              ✓ Guardado en Drive
            </span>
          )}
        </div>
      </Card>
    </div>
  );
}
