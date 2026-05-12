// ============================================================
// src/db/index.ts
// Initialisation et ouverture de la base IndexedDB
// Point d'entrée unique pour toute interaction avec la base
// ============================================================

import { openDB, IDBPDatabase } from 'idb';
import { DB_NAME, DB_VERSION, STORES } from './schema';

/**
 * Instance unique de la base (singleton).
 * On évite d'ouvrir plusieurs connexions en même temps.
 */
let dbInstance: IDBPDatabase | null = null;

/**
 * Ouvre (ou crée) la base IndexedDB.
 *
 * - Si c'est la première fois : crée tous les stores + index
 * - Si la version change : met à jour la structure
 * - Sinon : retourne simplement la connexion existante
 *
 * @returns Promise<IDBPDatabase> — connexion prête à l'emploi
 */
export async function getDB(): Promise<IDBPDatabase> {
  // Si la base est déjà ouverte, on la retourne directement
  if (dbInstance) return dbInstance;

  dbInstance = await openDB(DB_NAME, DB_VERSION, {
    /**
     * upgrade() est appelé uniquement lors de la création
     * ou quand DB_VERSION augmente.
     * C'est ici qu'on définit les stores et les index.
     */
    upgrade(db) {
      // ─── Store : clients ───────────────────────────────────
      // keyPath: 'id' → le champ 'id' sert de clé primaire
      if (!db.objectStoreNames.contains(STORES.CLIENTS)) {
        const clientStore = db.createObjectStore(STORES.CLIENTS, {
          keyPath: 'id',
        });
        // Index sur 'telephone' pour rechercher un client par numéro
        clientStore.createIndex('by_telephone', 'telephone', { unique: true });
        // Index sur 'nom' pour rechercher / trier par nom
        clientStore.createIndex('by_nom', 'nom', { unique: false });
      }

      // ─── Store : vetements ─────────────────────────────────
      if (!db.objectStoreNames.contains(STORES.VETEMENTS)) {
        const vetementStore = db.createObjectStore(STORES.VETEMENTS, {
          keyPath: 'id',
        });
        // Index pour retrouver tous les vêtements d'un client
        vetementStore.createIndex('by_client', 'idClient', { unique: false });
        // Index pour filtrer par statut (ex : tous les vêtements "pret")
        vetementStore.createIndex('by_statut', 'idStatut', { unique: false });
      }

      // ─── Store : paiements ─────────────────────────────────
      if (!db.objectStoreNames.contains(STORES.PAIEMENTS)) {
        const paiementStore = db.createObjectStore(STORES.PAIEMENTS, {
          keyPath: 'id',
        });
        // Index pour retrouver le paiement lié à un vêtement
        paiementStore.createIndex('by_vetement', 'idVetement', { unique: false });
        // Index pour filtrer par date de paiement
        paiementStore.createIndex('by_date', 'datePaiement', { unique: false });
      }

      // ─── Store : stock ─────────────────────────────────────
      if (!db.objectStoreNames.contains(STORES.STOCK)) {
        const stockStore = db.createObjectStore(STORES.STOCK, {
          keyPath: 'id',
        });
        // Index pour chercher un produit par son nom
        stockStore.createIndex('by_nom', 'nomProduit', { unique: true });
      }
    },
  });

  return dbInstance;
}
