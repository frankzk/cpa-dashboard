/**
 * Vercel Serverless Function: /api/config
 *
 * GET  → load user config from Supabase
 * PUT  → upsert user config into Supabase
 *
 * Auth: expects Google access token in Authorization: Bearer <token>
 * The token is verified against Google's tokeninfo endpoint, so the
 * Supabase service key never leaves the server.
 */

const GOOGLE_TOKENINFO = "https://www.googleapis.com/oauth2/v3/tokeninfo";

function cors(res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, PUT, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Authorization, Content-Type");
}

async function verifyGoogleToken(token) {
  const res = await fetch(`${GOOGLE_TOKENINFO}?access_token=${token}`);
  if (!res.ok) return null;
  const data = await res.json();
  // sub is the stable Google user ID; aud must match our client
  if (!data.sub) return null;
  return { googleId: data.sub, email: data.email };
}

function supabaseHeaders() {
  const key = process.env.SUPABASE_SERVICE_KEY;
  return {
    apikey: key,
    Authorization: `Bearer ${key}`,
    "Content-Type": "application/json",
  };
}

export default async function handler(req, res) {
  cors(res);
  if (req.method === "OPTIONS") return res.status(200).end();

  // ── Auth ────────────────────────────────────────────────────────────────
  const token = req.headers.authorization?.replace("Bearer ", "").trim();
  if (!token) return res.status(401).json({ error: "Missing token" });

  const identity = await verifyGoogleToken(token);
  if (!identity) return res.status(401).json({ error: "Invalid or expired token" });

  const { googleId, email } = identity;
  const SUPABASE_URL = process.env.SUPABASE_URL;

  if (!SUPABASE_URL || !process.env.SUPABASE_SERVICE_KEY) {
    return res.status(500).json({ error: "Server not configured (missing Supabase env vars)" });
  }

  // ── GET: load config ─────────────────────────────────────────────────────
  if (req.method === "GET") {
    const r = await fetch(
      `${SUPABASE_URL}/rest/v1/user_configs?google_id=eq.${googleId}&select=config`,
      { headers: supabaseHeaders() }
    );
    if (!r.ok) return res.status(502).json({ error: "DB read failed" });
    const rows = await r.json();
    return res.status(200).json(rows[0]?.config ?? null);
  }

  // ── PUT: save config ─────────────────────────────────────────────────────
  if (req.method === "PUT") {
    const config = req.body;
    if (!config || typeof config !== "object") {
      return res.status(400).json({ error: "Invalid body" });
    }

    const r = await fetch(`${SUPABASE_URL}/rest/v1/user_configs`, {
      method: "POST",
      headers: {
        ...supabaseHeaders(),
        Prefer: "resolution=merge-duplicates,return=minimal",
      },
      body: JSON.stringify({
        google_id: googleId,
        email,
        config,
        updated_at: new Date().toISOString(),
      }),
    });

    if (!r.ok) {
      const err = await r.text();
      return res.status(502).json({ error: `DB write failed: ${err}` });
    }

    return res.status(200).json({ ok: true });
  }

  return res.status(405).json({ error: "Method not allowed" });
}
