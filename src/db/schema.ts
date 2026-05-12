// ============================================================
// src/db/schema.ts — Définition des stores IndexedDB
// Schéma de la base de données — stores, index, structure
// ============================================================
 
/**
 * Nom de la base de données dans le navigateur.
 * Visible dans les DevTools : F12 > Application > IndexedDB
 */
export const DB_NAME = "gestion-pressing-db";
 
/**
 * Version de la base. À incrémenter UNIQUEMENT quand on modifie
 * la structure (ajouter un store, un index...).
 */
export const DB_VERSION = 1;
 
/**
 * Noms des object stores (= "tables" en SQL).
 * Centralisés ici pour éviter les fautes de frappe dans le code.
 */
export const STORES = {
  CLIENTS:   "clients",
  VETEMENTS: "vetements",
  PAIEMENTS: "paiements",
  STOCK:     "stock",
} as const;
 
// Type utilitaire : récupère les valeurs de STORES
export type StoreName = typeof STORES[keyof typeof STORES];
 
/**
 * Appelée par onupgradeneeded — crée tous les stores et leurs index.
 */
export function initialiserSchema(db: IDBDatabase): void {
  // ── Clients ────────────────────────────────────────────────
  if (!db.objectStoreNames.contains(STORES.CLIENTS)) {
    const s = db.createObjectStore(STORES.CLIENTS, { keyPath: "id" });
    s.createIndex("telephone", "telephone", { unique: true });
    s.createIndex("nom",       "nom",       { unique: false });
  }
 
  // ── Vêtements ──────────────────────────────────────────────
  if (!db.objectStoreNames.contains(STORES.VETEMENTS)) {
    const s = db.createObjectStore(STORES.VETEMENTS, { keyPath: "id" });
    s.createIndex("idClient",     "idClient",     { unique: false });
    s.createIndex("idStatut",     "idStatut",     { unique: false });
    s.createIndex("numeroTicket", "numeroTicket", { unique: false });
    s.createIndex("dateDepot",    "dateDepot",    { unique: false });
  }
 
  // ── Paiements ──────────────────────────────────────────────
  if (!db.objectStoreNames.contains(STORES.PAIEMENTS)) {
    const s = db.createObjectStore(STORES.PAIEMENTS, { keyPath: "id" });
    s.createIndex("idVetement",    "idVetement",    { unique: false });
    s.createIndex("datePaiement",  "datePaiement",  { unique: false });
    s.createIndex("estSolde",      "estSolde",      { unique: false });
  }
 
  // ── Stock ──────────────────────────────────────────────────
  if (!db.objectStoreNames.contains(STORES.STOCK)) {
    const s = db.createObjectStore(STORES.STOCK, { keyPath: "id" });
    s.createIndex("nomProduit", "nomProduit", { unique: true });
  }
}
 
