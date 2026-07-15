// Archivage automatique dans un dossier local (ex. lecteur réseau NAS monté)
// via la File System Access API du navigateur (Chrome / Edge).
// Le handle de dossier est mémorisé dans IndexedDB pour ne pas redemander
// le sélecteur à chaque visite ; seule la permission doit être réaccordée
// (geste utilisateur requis par le navigateur, généralement une fois par session).

const DB_NAME = "kcp-nas";
const STORE = "handles";
const KEY = "folder";

function openDB() {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, 1);
    req.onupgradeneeded = () => { req.result.createObjectStore(STORE); };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

async function idbGet(key) {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE, "readonly");
    const req = tx.objectStore(STORE).get(key);
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

async function idbSet(key, value) {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE, "readwrite");
    tx.objectStore(STORE).put(value, key);
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

async function idbDelete(key) {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE, "readwrite");
    tx.objectStore(STORE).delete(key);
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

export function isSupported() {
  return typeof window !== "undefined" && "showDirectoryPicker" in window;
}

// Ouvre le sélecteur de dossier (doit être appelé depuis un clic utilisateur).
export async function pickFolder() {
  const handle = await window.showDirectoryPicker({ mode: "readwrite" });
  await idbSet(KEY, handle);
  return handle;
}

export async function getSavedHandle() {
  try { return (await idbGet(KEY)) || null; } catch { return null; }
}

export async function forgetFolder() {
  await idbDelete(KEY);
}

// "granted" | "prompt" | "denied" | "unavailable"
export async function checkPermission(handle) {
  if (!handle) return "unavailable";
  try { return await handle.queryPermission({ mode: "readwrite" }); }
  catch { return "unavailable"; }
}

// Doit être appelé depuis un clic utilisateur si la permission n'est pas déjà "granted".
export async function requestPermission(handle) {
  if (!handle) return "unavailable";
  try { return await handle.requestPermission({ mode: "readwrite" }); }
  catch { return "denied"; }
}

export async function saveFile(handle, blob, filename) {
  const fileHandle = await handle.getFileHandle(filename, { create: true });
  const writable = await fileHandle.createWritable();
  await writable.write(blob);
  await writable.close();
}
