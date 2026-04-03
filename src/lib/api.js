/**
 * Frontend API client — all calls go through /api/config (Vercel Function).
 * The Vercel Function verifies the Google token server-side and talks to Supabase,
 * so credentials never touch the browser.
 *
 * Both functions throw "AUTH_EXPIRED" if the Google token is no longer valid.
 * Callers should catch this and force a re-login.
 */

const BASE = "/api";

async function apiFetch(path, token, options = {}) {
  const res = await fetch(`${BASE}${path}`, {
    ...options,
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
  });

  if (res.status === 401) throw new Error("AUTH_EXPIRED");
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error || `HTTP ${res.status}`);
  }
  return res.json();
}

export async function loadConfig(token) {
  return apiFetch("/config", token);
}

export async function saveConfig(token, cfg) {
  return apiFetch("/config", token, {
    method: "PUT",
    body: JSON.stringify(cfg),
  });
}
