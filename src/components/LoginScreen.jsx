import { useGoogleLogin } from "@react-oauth/google";

// We only need openid + email + profile — Drive scope is no longer used
// (config now lives in Supabase, accessed via Vercel Functions)
const SCOPES = ["openid", "email", "profile"].join(" ");

export default function LoginScreen({ onLogin, expired = false }) {
  const login = useGoogleLogin({
    onSuccess: (tokenResponse) => onLogin(tokenResponse),
    onError: (err) => console.error("Login failed", err),
    scope: SCOPES,
  });

  return (
    <div style={{
      minHeight: "100vh", background: "#080b12", display: "flex",
      alignItems: "center", justifyContent: "center", fontFamily: "'Sora', sans-serif",
    }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Mono:wght@400;500&family=Sora:wght@400;600;700&display=swap');`}</style>

      <div style={{
        textAlign: "center", background: "rgba(255,255,255,0.03)",
        border: "1px solid rgba(255,255,255,0.08)", borderRadius: 20,
        padding: "48px 56px", maxWidth: 420, width: "90%",
      }}>
        <div style={{
          fontSize: 10, color: "#fbbf24", letterSpacing: "0.15em",
          textTransform: "uppercase", fontFamily: "'DM Mono', monospace", marginBottom: 16,
        }}>
          SUPER HUMAN · CPA DASHBOARD
        </div>

        <h1 style={{ fontSize: 26, fontWeight: 700, color: "#f1f5f9", marginBottom: 8 }}>
          Panel de configuración
        </h1>

        {expired ? (
          <div style={{
            background: "rgba(251,191,36,0.08)", border: "1px solid rgba(251,191,36,0.2)",
            borderRadius: 10, padding: "10px 16px", marginBottom: 24,
            fontSize: 12, color: "#fbbf24", fontFamily: "'DM Mono', monospace",
          }}>
            Tu sesión expiró. Vuelve a iniciar sesión para continuar.
          </div>
        ) : (
          <p style={{ fontSize: 13, color: "#6b7280", marginBottom: 36, lineHeight: 1.6 }}>
            Inicia sesión con Google para guardar tu configuración y acceder desde cualquier dispositivo.
          </p>
        )}

        <button
          onClick={() => login()}
          style={{
            display: "flex", alignItems: "center", gap: 12, justifyContent: "center",
            width: "100%", background: "#fff", color: "#111827", border: "none",
            borderRadius: 10, padding: "12px 20px", fontSize: 14, fontWeight: 600,
            cursor: "pointer", fontFamily: "'Sora', sans-serif", transition: "opacity 0.15s",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.9")}
          onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
        >
          <GoogleIcon />
          {expired ? "Volver a iniciar sesión" : "Continuar con Google"}
        </button>

        <p style={{ fontSize: 11, color: "#374151", marginTop: 20, fontFamily: "'DM Mono', monospace" }}>
          Tu configuración se guarda de forma segura en la base de datos de la app
        </p>
      </div>
    </div>
  );
}

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18">
      <path fill="#4285F4" d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.875 2.684-6.615z"/>
      <path fill="#34A853" d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z"/>
      <path fill="#FBBC05" d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332z"/>
      <path fill="#EA4335" d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z"/>
    </svg>
  );
}
