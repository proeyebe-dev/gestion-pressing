// ============================================================
// src/db/schema.ts — Définition des stores IndexedDB
// ============================================================

export const DB_NAME    = "PressingDB";
export const DB_VERSION = 1;

// Noms des object stores
export const STORES = {
  CLIENTS:   "clients",
  VETEMENTS: "vetements",
  PAIEMENTS: "paiements",
  STOCK:     "stock",
} as const;

export type StoreName = (typeof STORES)[keyof typeof STORES];

/**
 * Appelée par onupgradeneeded — crée tous les stores et index.
 */
export function initialiserSchema(db: IDBDatabase): void {
  // ---- Clients ----
  if (!db.objectStoreNames.contains(STORES.CLIENTS)) {
    const s = db.createObjectStore(STORES.CLIENTS, { keyPath: "id" });
    s.createIndex("telephone", "telephone", { unique: true });
    s.createIndex("nom",       "nom",       { unique: false });
  }

  // ---- Vêtements ----
  if (!db.objectStoreNames.contains(STORES.VETEMENTS)) {
    const s = db.createObjectStore(STORES.VETEMENTS, { keyPath: "id" });
    s.createIndex("clientId",     "clientId",     { unique: false });
    s.createIndex("statut",       "statut",       { unique: false });
    s.createIndex("numeroTicket", "numeroTicket", { unique: false });
    s.createIndex("dateDepot",    "dateDepot",    { unique: false });
  }

  // ---- Paiements ----
  if (!db.objectStoreNames.contains(STORES.PAIEMENTS)) {
    const s = db.createObjectStore(STORES.PAIEMENTS, { keyPath: "id" });
    s.createIndex("clientId",      "clientId",      { unique: false });
    s.createIndex("datePaiement",  "datePaiement",  { unique: false });
    s.createIndex("estSolde",      "estSolde",      { unique: false });
  }

  // ---- Stock ----
  if (!db.objectStoreNames.contains(STORES.STOCK)) {
    const s = db.createObjectStore(STORES.STOCK, { keyPath: "id" });
    s.createIndex("nom", "nom", { unique: true });
  }
}
