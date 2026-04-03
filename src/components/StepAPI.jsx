import { useState } from "react";
import { getTabNames } from "../lib/sheetsApi";
import { Label, Input, Btn, Card, Tag, StatusDot } from "./ui";

export default function StepAPI({ cfg, setCfg }) {
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(null);

  const test = async () => {
    setLoading(true);
    setStatus(null);
    try {
      const [adsTabs, ventasTabs] = await Promise.all([
        getTabNames(cfg.adsSheetId, cfg.apiKey),
        getTabNames(cfg.ventasSheetId, cfg.apiKey),
      ]);
      setStatus({ ok: true, msg: "Conexión exitosa", adsTabs, ventasTabs });
      setCfg((p) => ({ ...p, adsTabs, ventasTabs }));
    } catch (e) {
      setStatus({ ok: false, msg: e.message });
    } finally {
      setLoading(false);
    }
  };

  const ready = cfg.apiKey && cfg.adsSheetId && cfg.ventasSheetId;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
      <Card>
        <Label>Google Sheets API Key</Label>
        <Input
          type="password"
          value={cfg.apiKey || ""}
          onChange={(v) => setCfg((p) => ({ ...p, apiKey: v }))}
          placeholder="AIzaSy..."
        />
        <div style={{ fontSize: 11, color: "#4b5563", marginTop: 6 }}>
          Obtén tu key en console.cloud.google.com → APIs → Google Sheets API → Credenciales
        </div>
      </Card>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        <Card>
          <Label>Sheet ID — Ads</Label>
          <Input
            value={cfg.adsSheetId || ""}
            onChange={(v) => setCfg((p) => ({ ...p, adsSheetId: v }))}
            placeholder="1BxiMVs0XRA..."
          />
          <div style={{ fontSize: 11, color: "#4b5563", marginTop: 6 }}>
            Es el ID en la URL del spreadsheet
          </div>
        </Card>
        <Card>
          <Label>Sheet ID — Ventas</Label>
          <Input
            value={cfg.ventasSheetId || ""}
            onChange={(v) => setCfg((p) => ({ ...p, ventasSheetId: v }))}
            placeholder="1BxiMVs0XRA..."
          />
          <div style={{ fontSize: 11, color: "#4b5563", marginTop: 6 }}>
            1 pestaña por tienda
          </div>
        </Card>
      </div>

      <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
        <Btn variant="primary" onClick={test} disabled={!ready || loading}>
          {loading ? "Verificando..." : "Conectar y verificar"}
        </Btn>
        {status && (
          <div style={{ fontSize: 13, color: status.ok ? "#22c55e" : "#ef4444", fontFamily: "'DM Mono', monospace" }}>
            <StatusDot ok={status.ok} />{status.msg}
          </div>
        )}
      </div>

      {status?.ok && (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          <Card>
            <Label>Pestañas detectadas — Ads</Label>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 4 }}>
              {status.adsTabs.map((t) => <Tag key={t} color="#22c55e">{t}</Tag>)}
            </div>
          </Card>
          <Card>
            <Label>Pestañas detectadas — Ventas</Label>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 4 }}>
              {status.ventasTabs.map((t) => <Tag key={t} color="#a78bfa">{t}</Tag>)}
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
