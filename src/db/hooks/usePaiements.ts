// ============================================================
// src/db/hooks/usePaiements.ts
// ============================================================

import { useState, useEffect, useCallback } from "react";
import {
  dbAjouter, dbGetTous, dbGetParId, dbGetParIndex,
  dbMettreAJour, dbSupprimer, genererUUID,
} from "../index";
import { STORES } from "../schema";
import type { Paiement, CreatePaiementDTO, UpdatePaiementDTO } from "../../types";

export function usePaiements() {
  const [paiements, setPaiements] = useState<Paiement[]>([]);
  const [loading,   setLoading]   = useState(true);
  const [erreur,    setErreur]    = useState<string | null>(null);

  // ── Charger ────────────────────────────────────────────────
  const charger = useCallback(async () => {
    try {
      setLoading(true);
      setErreur(null);
      const data = await dbGetTous<Paiement>(STORES.PAIEMENTS);
      setPaiements(data);
    } catch (e) {
      setErreur(String(e));
    } finally {
      setLoading(false);
    }
  }, []);

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

  // ── Paiements non soldés (filtrage local) ─────────────────
  const getNonSoldes = useCallback(
    (): Paiement[] => paiements.filter((p) => !p.estSolde),
    [paiements]
  );

  // ── Chiffre d'affaires total ───────────────────────────────
  const getChiffreAffaires = useCallback(
    (): number => paiements.filter((p) => p.estSolde).reduce((sum, p) => sum + p.montant, 0),
    [paiements]
  );

  // ── CA d'une journée ───────────────────────────────────────
  const getCAJour = useCallback(
    (date: Date): number => {
      const debut = new Date(date); debut.setHours(0, 0, 0, 0);
      const fin   = new Date(date); fin.setHours(23, 59, 59, 999);
      return paiements
        .filter((p) => {
          const d = new Date(p.datePaiement);
          return p.estSolde && d >= debut && d <= fin;
        })
        .reduce((sum, p) => sum + p.montant, 0);
    },
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

  // ── Marquer soldé ──────────────────────────────────────────
  const marquerSolde = useCallback(
    (id: string) => mettreAJourPaiement(id, { estSolde: true }),
    [mettreAJourPaiement]
  );

  // ── Supprimer ──────────────────────────────────────────────
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
    getNonSoldes,
    getChiffreAffaires,
    getCAJour,
    mettreAJourPaiement,
    marquerSolde,
    supprimerPaiement,
  };
}
