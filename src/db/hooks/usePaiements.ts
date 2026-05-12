// ============================================================
// src/db/hooks/usePaiements.ts
// Hook React pour la gestion des paiements en IndexedDB
// Fournit : liste des paiements + fonctions CRUD + statistiques
// ============================================================
 
import { useState, useEffect, useCallback } from "react";
import {
  dbAjouter, dbGetTous, dbGetParId, dbGetParIndex,
  dbMettreAJour, dbSupprimer, genererUUID,
} from "../index";
import { STORES } from "../schema";
import type { Paiement, CreatePaiementDTO, UpdatePaiementDTO } from "../../types";
 
export function usePaiements(idVetementFiltre?: string) {
  const [paiements, setPaiements] = useState<Paiement[]>([]);
  const [loading,   setLoading]   = useState<boolean>(true);
  const [erreur,    setErreur]    = useState<string | null>(null);
 
  // ── Charger les paiements ──────────────────────────────────
  const charger = useCallback(async () => {
    try {
      setLoading(true);
      setErreur(null);
      let data = await dbGetTous<Paiement>(STORES.PAIEMENTS);
      // Filtrer par vêtement si un filtre est passé
      if (idVetementFiltre) {
        data = data.filter((p) => p.idVetement === idVetementFiltre);
      }
      setPaiements(data);
    } catch (e) {
      setErreur("Erreur lors du chargement des paiements");
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [idVetementFiltre]);
 
  useEffect(() => { charger(); }, [charger]);
 
  // ── Enregistrer un paiement ────────────────────────────────
  const enregistrerPaiement = useCallback(
    async (dto: CreatePaiementDTO): Promise<Paiement> => {
      const nouveau: Paiement = {
        ...dto,
        id:           genererUUID(),
        datePaiement: new Date().toISOString(),
      };
      await dbAjouter<Paiement>(STORES.PAIEMENTS, nouveau);
      setPaiements((prev) => [...prev, nouveau]);
      return nouveau;
    },
    []
  );
 
  // ── Paiements d'un client ──────────────────────────────────
  const getPaiementsParClient = useCallback(
    async (clientId: string): Promise<Paiement[]> =>
      dbGetParIndex<Paiement>(STORES.PAIEMENTS, "clientId", clientId),
    []
  );
 
  // ── Vérifier si un vêtement est payé ──────────────────────
  const estPaye = useCallback(
    (idVetement: string): boolean =>
      paiements.some((p) => p.idVetement === idVetement),
    [paiements]
  );
 
  // ── Paiements non soldés ───────────────────────────────────
  const getNonSoldes = useCallback(
    (): Paiement[] => paiements.filter((p) => !p.estSolde),
    [paiements]
  );
 
  // ── Total du jour ──────────────────────────────────────────
  const totalDuJour = useCallback((): number => {
    const aujourd_hui = new Date().toDateString();
    return paiements
      .filter((p) => new Date(p.datePaiement).toDateString() === aujourd_hui)
      .reduce((somme, p) => somme + p.montant, 0);
  }, [paiements]);
 
  // ── Total de la semaine ────────────────────────────────────
  const totalDeLaSemaine = useCallback((): number => {
    const maintenant = new Date();
    const debutSemaine = new Date(maintenant);
    debutSemaine.setDate(maintenant.getDate() - maintenant.getDay() + 1);
    debutSemaine.setHours(0, 0, 0, 0);
    return paiements
      .filter((p) => new Date(p.datePaiement) >= debutSemaine)
      .reduce((somme, p) => somme + p.montant, 0);
  }, [paiements]);
 
  // ── Chiffre d'affaires total ───────────────────────────────
  const getChiffreAffaires = useCallback(
    (): number =>
      paiements.filter((p) => p.estSolde).reduce((sum, p) => sum + p.montant, 0),
    [paiements]
  );
 
  // ── Mettre à jour un paiement ──────────────────────────────
  const mettreAJourPaiement = useCallback(
    async (id: string, maj: UpdatePaiementDTO): Promise<Paiement> => {
      const existant = await dbGetParId<Paiement>(STORES.PAIEMENTS, id);
      if (!existant) throw new Error("Paiement introuvable");
      const majComplet: Paiement = { ...existant, ...maj };
      await dbMettreAJour<Paiement>(STORES.PAIEMENTS, majComplet);
      setPaiements((prev) => prev.map((p) => (p.id === id ? majComplet : p)));
      return majComplet;
    },
    []
  );
 
  // ── Marquer comme soldé ────────────────────────────────────
  const marquerSolde = useCallback(
    (id: string) => mettreAJourPaiement(id, { estSolde: true }),
    [mettreAJourPaiement]
  );
 
  // ── Supprimer un paiement ──────────────────────────────────
  const supprimerPaiement = useCallback(async (id: string): Promise<void> => {
    await dbSupprimer(STORES.PAIEMENTS, id);
    setPaiements((prev) => prev.filter((p) => p.id !== id));
  }, []);
 
  return {
    paiements,
    loading,
    erreur,
    charger,
    enregistrerPaiement,
    getPaiementsParClient,
    estPaye,
    getNonSoldes,
    totalDuJour,
    totalDeLaSemaine,
    getChiffreAffaires,
    mettreAJourPaiement,
    marquerSolde,
    supprimerPaiement,
  };
}
 
