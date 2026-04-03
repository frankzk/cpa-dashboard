import { useState } from "react";
import { getSheetData, extractCampaigns } from "../lib/sheetsApi";
import { Label, Input, Btn, Card } from "./ui";

export default function StepCampañas({ cfg, setCfg }) {
  const [loading, setLoading] = useState({});
  const [campaigns, setCampaigns] = useState(cfg.campaigns || {});
  const [newProduct, setNewProduct] = useState("");
  const [search, setSearch] = useState("");

  const mapping = cfg.campaignMapping || {};
  const products = cfg.products || [];
  const adsTabs = cfg.adsTabs || [];

  const addProduct = () => {
    const trimmed = newProduct.trim();
    if (!trimmed) return;
    if (!products.includes(trimmed)) {
      setCfg((p) => ({ ...p, products: [...(p.products || []), trimmed] }));
    }
    setNewProduct("");
  };

  const removeProduct = (prod) => {
    setCfg((p) => ({ ...p, products: p.products.filter((x) => x !== prod) }));
  };

  const loadCampaigns = async (tab) => {
    setLoading((p) => ({ ...p, [tab]: true }));
    try {
      const rows = await getSheetData(cfg.adsSheetId, tab, cfg.apiKey);
      const camps = extractCampaigns(rows);
      setCampaigns((p) => ({ ...p, [tab]: camps }));
      setCfg((p) => ({ ...p, campaigns: { ...(p.campaigns || {}), [tab]: camps } }));
    } catch (e) {
      alert(`Error cargando ${tab}: ${e.message}`);
    } finally {
      setLoading((p) => ({ ...p, [tab]: false }));
    }
  };

  const setMap = (campaign, product) => {
    setCfg((p) => ({
      ...p,
      campaignMapping: { ...(p.campaignMapping || {}), [campaign]: product },
    }));
  };

  const allCampaigns = Object.values(campaigns).flat();
  const unmapped = allCampaigns.filter((c) => !mapping[c]);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>

      {/* Product master list */}
      <Card>
        <Label>Productos / SKUs master</Label>
        <div style={{ display: "flex", gap: 8, marginBottom: 10 }}>
          <Input
            value={newProduct}
            onChange={setNewProduct}
            placeholder="Ej: Super Human GLP-1"
            style={{ flex: 1 }}
          />
          <Btn variant="primary" onClick={addProduct}>+ Agregar</Btn>
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
          {products.map((p) => (
            <div key={p} style={{
              display: "flex", alignItems: "center", gap: 6,
              background: "rgba(251,191,36,0.08)", border: "1px solid rgba(251,191,36,0.2)",
              borderRadius: 8, padding: "4px 10px",
            }}>
              <span style={{ fontSize: 12, color: "#fbbf24", fontFamily: "'DM Mono', monospace" }}>{p}</span>
              <button
                onClick={() => removeProduct(p)}
                style={{ background: "none", border: "none", color: "#6b7280", cursor: "pointer", fontSize: 14, lineHeight: 1, padding: 0 }}
              >×</button>
            </div>
          ))}
          {!products.length && (
            <span style={{ color: "#374151", fontSize: 12 }}>Agrega productos arriba para poder mapear</span>
          )}
        </div>
      </Card>

      {/* Load campaigns per tab */}
      <Card>
        <Label>Cargar campañas por cuenta publicitaria</Label>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 6 }}>
          {adsTabs.map((tab) => (
            <Btn
              key={tab}
              onClick={() => loadCampaigns(tab)}
              disabled={loading[tab]}
              variant={campaigns[tab] ? "ghost" : "default"}
              small
            >
              {loading[tab] ? "..." : campaigns[tab] ? `✓ ${tab} (${campaigns[tab].length})` : `↓ Cargar ${tab}`}
            </Btn>
          ))}
        </div>
        {unmapped.length > 0 && (
          <div style={{ marginTop: 10, fontSize: 12, color: "#f59e0b", fontFamily: "'DM Mono', monospace" }}>
            ⚠ {unmapped.length} campaña(s) sin mapear
          </div>
        )}
      </Card>

      {/* Mapping table */}
      {allCampaigns.length > 0 && (
        <Card>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
            <Label>Mapeo campaña → producto</Label>
            <Input
              value={search}
              onChange={setSearch}
              placeholder="Buscar campaña..."
              style={{ width: 200, padding: "6px 10px" }}
            />
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 6, maxHeight: 420, overflowY: "auto" }}>
            {adsTabs.map((tab) => {
              const tabCamps = (campaigns[tab] || []).filter(
                (c) => !search || c.toLowerCase().includes(search.toLowerCase())
              );
              if (!tabCamps.length) return null;
              return (
                <div key={tab}>
                  <div style={{
                    fontSize: 10, color: "#4b5563", fontFamily: "'DM Mono', monospace",
                    textTransform: "uppercase", letterSpacing: "0.1em", margin: "10px 0 6px", paddingLeft: 4,
                  }}>
                    📊 Cuenta: {tab}
                  </div>
                  {tabCamps.map((camp) => {
                    const mapped = mapping[camp];
                    return (
                      <div key={camp} style={{
                        display: "flex", alignItems: "center", gap: 10,
                        padding: "8px 12px", borderRadius: 8,
                        background: mapped ? "rgba(34,197,94,0.04)" : "rgba(239,68,68,0.04)",
                        border: `1px solid ${mapped ? "rgba(34,197,94,0.1)" : "rgba(239,68,68,0.1)"}`,
                        marginBottom: 4,
                      }}>
                        <div style={{
                          flex: 1, fontSize: 12, color: "#e5e7eb",
                          fontFamily: "'DM Mono', monospace",
                          overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
                        }}>
                          {camp}
                        </div>
                        <div style={{ fontSize: 14, color: "#374151" }}>→</div>
                        <select
                          value={mapped || ""}
                          onChange={(e) => setMap(camp, e.target.value)}
                          style={{
                            width: 200, background: "#0f1420",
                            border: `1px solid ${mapped ? "rgba(34,197,94,0.3)" : "rgba(239,68,68,0.2)"}`,
                            color: mapped ? "#22c55e" : "#6b7280",
                            borderRadius: 8, padding: "5px 10px", fontSize: 12,
                            outline: "none", cursor: "pointer", fontFamily: "'DM Mono', monospace",
                          }}
                        >
                          <option value="">— sin mapear —</option>
                          {products.map((p) => <option key={p} value={p}>{p}</option>)}
                        </select>
                      </div>
                    );
                  })}
                </div>
              );
            })}
          </div>
        </Card>
      )}
    </div>
  );
}
