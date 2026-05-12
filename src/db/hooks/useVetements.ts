// ============================================================
// src/db/hooks/useVetements.ts
// Hook React pour la gestion des vêtements en IndexedDB
// Fournit : liste des vêtements + fonctions CRUD + changement de statut
// ============================================================

import { useState, useEffect, useCallback } from 'react';
import { getDB } from '../index';
import { STORES } from '../schema';
import type { Vetement, StatutVetement } from '../../types';

/**
 * useVetements — hook personnalisé pour les vêtements.
 *
 * Utilisation dans un composant :
 *   const { vetements, ajouterVetement, changerStatut } = useVetements();
 *   // Ou filtré par client :
 *   const { vetements } = useVetements(idClient);
 */
export function useVetements(idClientFiltre?: string) {
  const [vetements, setVetements] = useState<Vetement[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // ── Charger les vêtements ──────────────────────────────────
  const chargerVetements = useCallback(async () => {
    try {
      setLoading(true);
      const db = await getDB();

      let tous: Vetement[];

      if (idClientFiltre) {
        // Utilise l'index 'by_client' pour ne récupérer que les vêtements
        // du client spécifié (plus efficace que de tout charger et filtrer)
        tous = await db.getAllFromIndex(
          STORES.VETEMENTS,
          'by_client',
          idClientFiltre
        ) as Vetement[];
      } else {
        tous = await db.getAll(STORES.VETEMENTS) as Vetement[];
      }

      setVetements(tous);
      setError(null);
    } catch (e) {
      setError('Erreur lors du chargement des vêtements');
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [idClientFiltre]);

  useEffect(() => {
    chargerVetements();
  }, [chargerVetements]);

  // ── Ajouter un vêtement ────────────────────────────────────
  const ajouterVetement = useCallback(async (
    data: Omit<Vetement, 'id' | 'dateDepot' | 'idStatut'>
  ): Promise<void> => {
    try {
      const db = await getDB();
      const nouveauVetement: Vetement = {
        ...data,
        id: crypto.randomUUID(),
        dateDepot: new Date().toISOString(),  // Date de dépôt = maintenant
        idStatut: 'en_attente',               // Statut initial
      };
      await db.add(STORES.VETEMENTS, nouveauVetement);
      await chargerVetements();
    } catch (e) {
      setError("Erreur lors de l'ajout du vêtement");
      console.error(e);
    }
  }, [chargerVetements]);

  // ── Changer le statut d'un vêtement ───────────────────────
  /**
   * Workflow autorisé :
   *   en_attente → en_lavage → pret → recupere
   * Cette fonction ne vérifie pas l'ordre (laissé à la logique métier).
   */
  const changerStatut = useCallback(async (
    id: string,
    nouveauStatut: StatutVetement
  ): Promise<void> => {
    try {
      const db = await getDB();
      // Récupérer le vêtement actuel
      const vetement = await db.get(STORES.VETEMENTS, id) as Vetement | undefined;
      if (!vetement) {
        setError('Vêtement introuvable');
        return;
      }
      // Mettre à jour uniquement le statut
      await db.put(STORES.VETEMENTS, { ...vetement, idStatut: nouveauStatut });
      await chargerVetements();
    } catch (e) {
      setError('Erreur lors du changement de statut');
      console.error(e);
    }
  }, [chargerVetements]);

  // ── Modifier un vêtement ───────────────────────────────────
  const modifierVetement = useCallback(async (vetement: Vetement): Promise<void> => {
    try {
      const db = await getDB();
      await db.put(STORES.VETEMENTS, vetement);
      await chargerVetements();
    } catch (e) {
      setError('Erreur lors de la modification du vêtement');
      console.error(e);
    }
  }, [chargerVetements]);

  // ── Supprimer un vêtement ──────────────────────────────────
  const supprimerVetement = useCallback(async (id: string): Promise<void> => {
    try {
      const db = await getDB();
      await db.delete(STORES.VETEMENTS, id);
      await chargerVetements();
    } catch (e) {
      setError('Erreur lors de la suppression du vêtement');
      console.error(e);
    }
  }, [chargerVetements]);

  // ── Filtrer par statut (côté mémoire) ─────────────────────
  const filtrerParStatut = useCallback((statut: StatutVetement): Vetement[] => {
    return vetements.filter(v => v.idStatut === statut);
  }, [vetements]);

  return {
    vetements,
    loading,
    error,
    ajouterVetement,
    modifierVetement,
    supprimerVetement,
    changerStatut,
    filtrerParStatut,
    recharger: chargerVetements,
  };
}
