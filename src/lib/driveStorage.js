/**
 * Google Drive appDataFolder storage
 * Saves/loads cpa-config.json in the app's hidden Drive folder.
 * Requires OAuth access token with scope: drive.appdata
 */

const FILE_NAME = "cpa-config.json";
const DRIVE_API = "https://www.googleapis.com/drive/v3";
const UPLOAD_API = "https://www.googleapis.com/upload/drive/v3";

async function findFile(token) {
  const res = await fetch(
    `${DRIVE_API}/files?spaces=appDataFolder&q=name='${FILE_NAME}'&fields=files(id)`,
    { headers: { Authorization: `Bearer ${token}` } }
  );
  if (!res.ok) throw new Error(`Drive list failed: ${res.status}`);
  const data = await res.json();
  return data.files?.[0]?.id || null;
}

export async function loadConfig(token) {
  const fileId = await findFile(token);
  if (!fileId) return null;
  const res = await fetch(`${DRIVE_API}/files/${fileId}?alt=media`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error(`Drive read failed: ${res.status}`);
  return res.json();
}

export async function saveConfig(token, cfg) {
  const fileId = await findFile(token);
  const body = JSON.stringify(cfg);

  if (fileId) {
    // Update existing file
    const res = await fetch(
      `${UPLOAD_API}/files/${fileId}?uploadType=media`,
      {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body,
      }
    );
    if (!res.ok) throw new Error(`Drive update failed: ${res.status}`);
    return res.json();
  } else {
    // Create new file with metadata
    const metadata = { name: FILE_NAME, parents: ["appDataFolder"] };
    const form = new FormData();
    form.append(
      "metadata",
      new Blob([JSON.stringify(metadata)], { type: "application/json" })
    );
    form.append("file", new Blob([body], { type: "application/json" }));

    const res = await fetch(`${UPLOAD_API}/files?uploadType=multipart`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      body: form,
    });
    if (!res.ok) throw new Error(`Drive create failed: ${res.status}`);
    return res.json();
  }
}
