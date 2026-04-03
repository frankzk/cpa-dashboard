import { useState, useEffect, useCallback } from "react";
import { saveConfig, loadConfig } from "../lib/driveStorage";
import { Btn } from "./ui";
import StepAPI from "./StepAPI";
import StepTiendas from "./StepTiendas";
import StepCampañas from "./StepCampañas";
import StepResumen from "./StepResumen";

const STEPS = ["🔑 API & Sheets", "🏪 Tiendas", "🎯 Campañas", "✅ Resumen"];

const DEFAULT_CFG = {
  apiKey: "", adsSheetId: "", ventasSheetId: "",
  adsTabs: [], ventasTabs: [], tiendas: {},
  products: [], campaigns: {}, campaignMapping: {},
};

export default function ConfigPanel({ token, user, onLogout }) {
  const [step, setStep] = useState(0);
  const [cfg, setCfg] = useState(DEFAULT_CFG);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [loadingInit, setLoadingInit] = useState(true);
  const [loadError, setLoadError] = useState(null);

  // Auto-save indicator: reset "saved" badge after a few seconds
  const flashSaved = useCallback(() => {
    setSaved(true);
    setTimeout(() => setSaved(false), 3500);
  }, []);

  // Load config from Drive on mount
  useEffect(() => {
    loadConfig(token)
      .then((data) => {
        if (data) setCfg(data);
      })
      .catch((e) => setLoadError(e.message))
      .finally(() => setLoadingInit(false));
  }, [token]);

  const handleSave = async () => {
    setSaving(true);
    try {
      await saveConfig(token, cfg);
      flashSaved();
    } catch (e) {
      alert(`Error al guardar: ${e.message}`);
    } finally {
      setSaving(false);
    }
  };

  if (loadingInit) {
    return (
      <div style={{
        minHeight: "100vh", background: "#080b12", display: "flex",
        alignItems: "center", justifyContent: "center", color: "#4b5563",
        fontFamily: "'DM Mono', monospace", fontSize: 13,
      }}>
        Cargando configuración desde Drive...
      </div>
    );
  }

  if (loadError) {
    return (
      <div style={{
        minHeight: "100vh", background: "#080b12", display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center", gap: 16, padding: 24,
        fontFamily: "'DM Mono', monospace",
      }}>
        <div style={{ color: "#ef4444", fontSize: 13 }}>⚠ Error cargando config: {loadError}</div>
        <Btn onClick={() => { setLoadError(null); setLoadingInit(true); }}>Reintentar</Btn>
      </div>
    );
  }

  return (
    <div style={{
      minHeight: "100vh", background: "#080b12", color: "#f1f5f9",
      fontFamily: "'Sora', sans-serif", padding: "24px 20px", maxWidth: 900, margin: "0 auto",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Mono:wght@400;500;600&family=Sora:wght@400;500;600;700&display=swap');
      `}</style>

      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 28 }}>
        <div>
          <div style={{
            fontSize: 10, color: "#fbbf24", letterSpacing: "0.15em",
            textTransform: "uppercase", fontFamily: "'DM Mono', monospace", marginBottom: 4,
          }}>
            SUPER HUMAN · CPA DASHBOARD
          </div>
          <h1 style={{ margin: 0, fontSize: 22, fontWeight: 700, letterSpacing: "-0.02em" }}>
            Panel de configuración
          </h1>
        </div>

        {/* User info + logout */}
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          {user?.picture && (
            <img
              src={user.picture}
              alt={user.name}
              style={{ width: 32, height: 32, borderRadius: "50%", border: "2px solid rgba(255,255,255,0.1)" }}
            />
          )}
          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: 12, color: "#e5e7eb", fontFamily: "'DM Mono', monospace" }}>
              {user?.name || user?.email}
            </div>
            <button
              onClick={onLogout}
              style={{
                background: "none", border: "none", color: "#6b7280", cursor: "pointer",
                fontSize: 11, fontFamily: "'DM Mono', monospace", padding: 0,
                textDecoration: "underline",
              }}
            >
              Cerrar sesión
            </button>
          </div>
        </div>
      </div>

      {/* Step tabs */}
      <div style={{
        display: "flex", gap: 4, marginBottom: 28,
        borderBottom: "1px solid rgba(255,255,255,0.06)", paddingBottom: 0,
      }}>
        {STEPS.map((s, i) => (
          <button
            key={s}
            onClick={() => setStep(i)}
            style={{
              background: "none", border: "none", cursor: "pointer",
              padding: "10px 16px", fontSize: 13,
              color: step === i ? "#fbbf24" : "#6b7280",
              borderBottom: `2px solid ${step === i ? "#fbbf24" : "transparent"}`,
              fontFamily: "'Sora', sans-serif", transition: "all 0.15s",
              fontWeight: step === i ? 600 : 400, marginBottom: -1,
            }}
          >
            {s}
          </button>
        ))}
        <div style={{ flex: 1 }} />
        <button
          onClick={handleSave}
          disabled={saving}
          style={{
            background: saved ? "rgba(34,197,94,0.1)" : "rgba(251,191,36,0.08)",
            border: `1px solid ${saved ? "rgba(34,197,94,0.3)" : "rgba(251,191,36,0.2)"}`,
            color: saved ? "#22c55e" : "#fbbf24",
            borderRadius: 8, padding: "6px 14px", cursor: saving ? "not-allowed" : "pointer",
            fontSize: 12, fontFamily: "'DM Mono', monospace", marginBottom: 6,
            opacity: saving ? 0.6 : 1, transition: "all 0.2s",
          }}
        >
          {saving ? "Guardando..." : saved ? "✓ Guardado" : "💾 Guardar"}
        </button>
      </div>

      {/* Step content */}
      {step === 0 && <StepAPI cfg={cfg} setCfg={setCfg} />}
      {step === 1 && <StepTiendas cfg={cfg} setCfg={setCfg} />}
      {step === 2 && <StepCampañas cfg={cfg} setCfg={setCfg} />}
      {step === 3 && <StepResumen cfg={cfg} onSave={handleSave} saving={saving} saved={saved} />}

      {/* Navigation */}
      <div style={{ display: "flex", justifyContent: "space-between", marginTop: 28 }}>
        <Btn onClick={() => setStep((s) => Math.max(0, s - 1))} disabled={step === 0}>
          ← Anterior
        </Btn>
        <Btn
          variant="primary"
          onClick={() => setStep((s) => Math.min(STEPS.length - 1, s + 1))}
          disabled={step === STEPS.length - 1}
        >
          Siguiente →
        </Btn>
      </div>
    </div>
  );
}
