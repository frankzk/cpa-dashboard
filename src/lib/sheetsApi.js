export async function gsFetch(sheetId, apiKey, path = "", params = "") {
  const url = `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}${path}?key=${apiKey}${params}`;
  const res = await fetch(url);
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error?.message || `HTTP ${res.status}`);
  }
  return res.json();
}

export async function getTabNames(sheetId, apiKey) {
  const data = await gsFetch(sheetId, apiKey, "", "&fields=sheets.properties.title");
  return data.sheets.map((s) => s.properties.title);
}

export async function getSheetData(sheetId, tabName, apiKey) {
  const tab = encodeURIComponent(tabName);
  const data = await gsFetch(sheetId, apiKey, `/values/${tab}!A:Z`);
  return data.values || [];
}

export function extractCampaigns(rows) {
  if (rows.length < 2) return [];
  const headers = rows[0].map((h) => h.toLowerCase().trim());
  const campIdx = headers.findIndex(
    (h) => h.includes("campaña") || h.includes("campaign") || h.includes("nombre")
  );
  if (campIdx === -1) return [];
  const unique = new Set();
  rows.slice(1).forEach((row) => {
    if (row[campIdx]) unique.add(row[campIdx].trim());
  });
  return [...unique];
}
