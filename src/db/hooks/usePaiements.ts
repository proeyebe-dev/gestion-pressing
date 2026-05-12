// ============================================================
// src/db/hooks/usePaiements.ts
// Hook React pour la gestion des paiements en IndexedDB
// Fournit : liste des paiements + fonctions CRUD + statistiques
// ============================================================

import { useState, useEffect, useCallback } from 'react';
import { getDB } from '../index';
import { STORES } from '../schema';
import type { Paiement } from '../../types';

/**
 * usePaiements — hook personnalisé pour les paiements.
 *
 * Utilisation dans un composant :
 *   const { paiements, ajouterPaiement, totalDuJour } = usePaiements();
 *   // Ou filtré par vêtement :
 *   const { paiements } = usePaiements(idVetement);
 */
export function usePaiements(idVetementFiltre?: string) {
  const [paiements, setPaiements] = useState<Paiement[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // ── Charger les paiements ──────────────────────────────────
  const chargerPaiements = useCallback(async () => {
    try {
      setLoading(true);
      const db = await getDB();

      let tous: Paiement[];

      if (idVetementFiltre) {
        // Utilise l'index 'by_vetement' pour filtrer
        tous = await db.getAllFromIndex(
          STORES.PAIEMENTS,
          'by_vetement',
          idVetementFiltre
        ) as Paiement[];
      } else {
        tous = await db.getAll(STORES.PAIEMENTS) as Paiement[];
      }

      setPaiements(tous);
      setError(null);
    } catch (e) {
      setError('Erreur lors du chargement des paiements');
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [idVetementFiltre]);

  useEffect(() => {
    chargerPaiements();
  }, [chargerPaiements]);

  // ── Enregistrer un paiement ────────────────────────────────
  const ajouterPaiement = useCallback(async (
    data: Omit<Paiement, 'id' | 'datePaiement'>
  ): Promise<void> => {
    try {
      const db = await getDB();
      const nouveauPaiement: Paiement = {
        ...data,
        id: crypto.randomUUID(),
        datePaiement: new Date().toISOString(), // Date = maintenant
      };
      await db.add(STORES.PAIEMENTS, nouveauPaiement);
      await chargerPaiements();
    } catch (e) {
      setError("Erreur lors de l'enregistrement du paiement");
      console.error(e);
    }
  }, [chargerPaiements]);

  // ── Supprimer un paiement ──────────────────────────────────
  const supprimerPaiement = useCallback(async (id: string): Promise<void> => {
    try {
      const db = await getDB();
      await db.delete(STORES.PAIEMENTS, id);
      await chargerPaiements();
    } catch (e) {
      setError('Erreur lors de la suppression du paiement');
      console.error(e);
    }
  }, [chargerPaiements]);

  // ── Vérifier si un vêtement est payé ──────────────────────
  const estPaye = useCallback((idVetement: string): boolean => {
    return paiements.some(p => p.idVetement === idVetement);
  }, [paiements]);

  // ── Calculer le total des paiements du jour ───────────────
  const totalDuJour = useCallback((): number => {
    const aujourd_hui = new Date().toDateString();
    return paiements
      .filter(p => new Date(p.datePaiement).toDateString() === aujourd_hui)
      .reduce((somme, p) => somme + p.montant, 0);
  }, [paiements]);

  // ── Calculer le total de la semaine ───────────────────────
  const totalDeLaSemaine = useCallback((): number => {
    const maintenant = new Date();
    const debutSemaine = new Date(maintenant);
    // Retourne au lundi de la semaine courante
    debutSemaine.setDate(maintenant.getDate() - maintenant.getDay() + 1);
    debutSemaine.setHours(0, 0, 0, 0);

    return paiements
      .filter(p => new Date(p.datePaiement) >= debutSemaine)
      .reduce((somme, p) => somme + p.montant, 0);
  }, [paiements]);

  return {
    paiements,
    loading,
    error,
    ajouterPaiement,
    supprimerPaiement,
    estPaye,
    totalDuJour,
    totalDeLaSemaine,
    recharger: chargerPaiements,
  };
}
