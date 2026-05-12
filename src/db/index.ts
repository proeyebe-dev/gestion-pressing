// ============================================================
// src/db/index.ts — Initialisation + couche CRUD générique
// ============================================================

import { DB_NAME, DB_VERSION, initialiserSchema, type StoreName } from "./schema";

// ── Singleton de connexion ───────────────────────────────────

let _db: IDBDatabase | null = null;

export async function ouvrirDB(): Promise<IDBDatabase> {
  if (_db) return _db;

  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, DB_VERSION);

    req.onupgradeneeded = (e) => {
      initialiserSchema((e.target as IDBOpenDBRequest).result);
    };

    req.onsuccess = (e) => {
      _db = (e.target as IDBOpenDBRequest).result;

      // Réinitialise le singleton si la connexion se ferme
      _db.onclose = () => { _db = null; };
      resolve(_db);
    };

    req.onerror = () =>
      reject(new Error(`Impossible d'ouvrir la base : ${req.error?.message}`));

    req.onblocked = () =>
      console.warn("IndexedDB bloquée — fermez les autres onglets.");
  });
}

// ── Helpers transaction ──────────────────────────────────────

async function tx(
  store: StoreName,
  mode: IDBTransactionMode = "readonly"
): Promise<IDBObjectStore> {
  const db = await ouvrirDB();
  return db.transaction(store, mode).objectStore(store);
}

function promesse<T>(req: IDBRequest<T>): Promise<T> {
  return new Promise((res, rej) => {
    req.onsuccess = () => res(req.result);
    req.onerror   = () => rej(req.error);
  });
}

// ── CRUD générique ───────────────────────────────────────────

/** Insère un nouvel enregistrement. */
export async function dbAjouter<T>(store: StoreName, data: T): Promise<T> {
  const s = await tx(store, "readwrite");
  await promesse(s.add(data));
  return data;
}

/** Récupère un enregistrement par sa clé primaire. */
export async function dbGetParId<T>(store: StoreName, id: string): Promise<T | undefined> {
  const s = await tx(store);
  return promesse<T>(s.get(id));
}

/** Récupère tous les enregistrements d'un store. */
export async function dbGetTous<T>(store: StoreName): Promise<T[]> {
  const s = await tx(store);
  return promesse<T[]>(s.getAll());
}

/** Récupère des enregistrements via un index. */
export async function dbGetParIndex<T>(
  store: StoreName,
  index: string,
  valeur: IDBValidKey
): Promise<T[]> {
  const s   = await tx(store);
  const idx = s.index(index);
  return promesse<T[]>(idx.getAll(valeur));
}

/** Met à jour (put) un enregistrement existant. */
export async function dbMettreAJour<T>(store: StoreName, data: T): Promise<T> {
  const s = await tx(store, "readwrite");
  await promesse(s.put(data));
  return data;
}

/** Supprime un enregistrement par sa clé primaire. */
export async function dbSupprimer(store: StoreName, id: string): Promise<void> {
  const s = await tx(store, "readwrite");
  await promesse(s.delete(id));
}

/** Vide entièrement un store. */
export async function dbVider(store: StoreName): Promise<void> {
  const s = await tx(store, "readwrite");
  await promesse(s.clear());
}

// ── Utilitaire ───────────────────────────────────────────────

/** Génère un numéro de ticket humainement lisible. */
export function genererNumeroTicket(): string {
  const d   = new Date();
  const pad = (n: number) => String(n).padStart(2, "0");
  const date = `${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}`;
  const rand = Math.floor(1000 + Math.random() * 9000);
  return `TK-${date}-${rand}`;
}

/** Génère un UUID v4 simple (sans dépendance externe). */
export function genererUUID(): string {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    return (c === "x" ? r : (r & 0x3) | 0x8).toString(16);
  });
}
