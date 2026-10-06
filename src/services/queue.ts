export type QueueState = "local_only" | "submitting" | "accepted" | "applied" | "stored_historical" | "duplicate" | "rejected";

export type QueuedReport = {
  client_report_id: string;
  reported_at: string;
  payload: Record<string, unknown>;
  state: QueueState;
  error_code?: string;
};

const DB_NAME = "raksha-setu";
const STORE = "reports";

function openDb(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, 1);
    request.onupgradeneeded = () => request.result.createObjectStore(STORE, { keyPath: "client_report_id" });
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

export async function saveLocal(report: QueuedReport) {
  const db = await openDb();
  await new Promise<void>((resolve, reject) => {
    const tx = db.transaction(STORE, "readwrite");
    tx.objectStore(STORE).put(report);
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
  db.close();
}

export async function listLocal(): Promise<QueuedReport[]> {
  const db = await openDb();
  const rows = await new Promise<QueuedReport[]>((resolve, reject) => {
    const tx = db.transaction(STORE, "readonly");
    const request = tx.objectStore(STORE).getAll();
    request.onsuccess = () => resolve(request.result as QueuedReport[]);
    request.onerror = () => reject(request.error);
  });
  db.close();
  return rows;
}

export async function removeLocal(id: string) {
  const db = await openDb();
  await new Promise<void>((resolve, reject) => {
    const tx = db.transaction(STORE, "readwrite");
    tx.objectStore(STORE).delete(id);
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
  db.close();
}

export async function updateLocal(report: QueuedReport) {
  await saveLocal(report);
}
