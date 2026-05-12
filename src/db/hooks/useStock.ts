// ============================================================
// src/db/hooks/useStock.ts
// Hook React pour la gestion du stock en IndexedDB
// Fournit : liste des produits + fonctions CRUD + alertes stock
// ============================================================

import { useState, useEffect, useCallback } from 'react';
import { getDB } from '../index';
import { STORES } from '../schema';
import type { ProduitStock } from '../../types';

/**
 * useStock — hook personnalisé pour le stock.
 *
 * Utilisation dans un composant :
 *   const { produits, alertes, ajouterProduit, mettreAJourQuantite } = useStock();
 */
export function useStock() {
  const [produits, setProduits] = useState<ProduitStock[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // ── Charger tous les produits ──────────────────────────────
  const chargerStock = useCallback(async () => {
    try {
      setLoading(true);
      const db = await getDB();
      const tous = await db.getAll(STORES.STOCK) as ProduitStock[];
      setProduits(tous);
      setError(null);
    } catch (e) {
      setError('Erreur lors du chargement du stock');
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    chargerStock();
  }, [chargerStock]);

  // ── Ajouter un produit au stock ────────────────────────────
  const ajouterProduit = useCallback(async (
    data: Omit<ProduitStock, 'id'>
  ): Promise<void> => {
    try {
      const db = await getDB();
      const nouveauProduit: ProduitStock = {
        ...data,
        id: crypto.randomUUID(),
      };
      await db.add(STORES.STOCK, nouveauProduit);
      await chargerStock();
    } catch (e) {
      setError("Erreur lors de l'ajout du produit");
      console.error(e);
    }
  }, [chargerStock]);

  // ── Modifier un produit ────────────────────────────────────
  const modifierProduit = useCallback(async (produit: ProduitStock): Promise<void> => {
    try {
      const db = await getDB();
      await db.put(STORES.STOCK, produit);
      await chargerStock();
    } catch (e) {
      setError('Erreur lors de la modification du produit');
      console.error(e);
    }
  }, [chargerStock]);

  // ── Mettre à jour uniquement la quantité d'un produit ─────
  /**
   * Utilisé quand on consomme ou reçoit du stock.
   * @param id - ID du produit
   * @param nouvelleQuantite - Nouvelle quantité (pas un delta, la valeur absolue)
   */
  const mettreAJourQuantite = useCallback(async (
    id: string,
    nouvelleQuantite: number
  ): Promise<void> => {
    try {
      const db = await getDB();
      const produit = await db.get(STORES.STOCK, id) as ProduitStock | undefined;
      if (!produit) {
        setError('Produit introuvable');
        return;
      }
      await db.put(STORES.STOCK, { ...produit, quantite: nouvelleQuantite });
      await chargerStock();
    } catch (e) {
      setError('Erreur lors de la mise à jour de la quantité');
      console.error(e);
    }
  }, [chargerStock]);

  // ── Supprimer un produit ───────────────────────────────────
  const supprimerProduit = useCallback(async (id: string): Promise<void> => {
    try {
      const db = await getDB();
      await db.delete(STORES.STOCK, id);
      await chargerStock();
    } catch (e) {
      setError('Erreur lors de la suppression du produit');
      console.error(e);
    }
  }, [chargerStock]);

  // ── Produits en alerte (stock faible) ─────────────────────
  /**
   * Retourne les produits dont la quantité est <= seuilAlerte.
   * Utilisé par le Dashboard pour afficher les alertes.
   */
  const alertes = produits.filter(p => p.quantite <= p.seuilAlerte);

  return {
    produits,
    loading,
    error,
    alertes,           // Produits dont le stock est faible
    ajouterProduit,
    modifierProduit,
    mettreAJourQuantite,
    supprimerProduit,
    recharger: chargerStock,
  };
}
