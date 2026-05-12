// ============================================================
// src/db/schema.ts
// Schéma de la base de données IndexedDB
// Définit les noms des stores et les index pour chaque store
// ============================================================

/**
 * Nom de la base de données dans le navigateur.
 * Ce nom apparaît dans les DevTools (F12 > Application > IndexedDB).
 */
export const DB_NAME = 'gestion-pressing-db';

/**
 * Version de la base. On incrémente ce numéro UNIQUEMENT
 * quand on modifie la structure (ajouter un store, un index…).
 * Si on change la version sans modifier onupgradeneeded → erreur.
 */
export const DB_VERSION = 1;

/**
 * Noms des object stores (= "tables" en SQL).
 * On les centralise ici pour éviter les fautes de frappe dans le code.
 */
export const STORES = {
  CLIENTS: 'clients',
  VETEMENTS: 'vetements',
  PAIEMENTS: 'paiements',
  STOCK: 'stock',
} as const;

// Type utilitaire : récupère les valeurs de STORES
export type StoreName = typeof STORES[keyof typeof STORES];
