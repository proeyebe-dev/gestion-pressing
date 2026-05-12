// ============================================================
// src/db/hooks/useVetements.ts
// ============================================================

import { useState, useEffect, useCallback } from "react";
import {
  dbAjouter, dbGetTous, dbGetParId, dbGetParIndex,
  dbMettreAJour, dbSupprimer, genererUUID, genererNumeroTicket,
} from "../index";
import { STORES } from "../schema";
import type { Vetement, CreateVetementDTO, UpdateVetementDTO } from "../../types";
import { StatutVetement } from "../../types";

export function useVetements() {
  const [vetements, setVetements] = useState<Vetement[]>([]);
  const [loading,   setLoading]   = useState(true);
  const [erreur,    setErreur]    = useState<string | null>(null);

  // ── Charger tous les vêtements ─────────────────────────────
  const charger = useCallback(async () => {
    try {
      setLoading(true);
      setErreur(null);
      const data = await dbGetTous<Vetement>(STORES.VETEMENTS);
      setVetements(data);
    } catch (e) {
      setErreur(String(e));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { charger(); }, [charger]);

  // ── Enregistrer un vêtement ────────────────────────────────
  const enregistrerVetement = useCallback(
    async (dto: CreateVetementDTO): Promise<Vetement> => {
      const nouveau: Vetement = {
        ...dto,
        id:           genererUUID(),
        numeroTicket: genererNumeroTicket(),
        statut:       StatutVetement.EN_ATTENTE,
        dateDepot:    new Date().toISOString(),
      };
      await dbAjouter<Vetement>(STORES.VETEMENTS, nouveau);
      setVetements((prev) => [...prev, nouveau]);
      return nouveau;
    },
    []
  );

  // ── Obtenir par ID ─────────────────────────────────────────
  const getVetementParId = useCallback(
    async (id: string): Promise<Vetement | undefined> =>
      dbGetParId<Vetement>(STORES.VETEMENTS, id),
    []
  );

  // ── Vêtements d'un client ──────────────────────────────────
  const getVetementsParClient = useCallback(
    async (clientId: string): Promise<Vetement[]> =>
      dbGetParIndex<Vetement>(STORES.VETEMENTS, "clientId", clientId),
    []
  );

  // ── Vêtements par statut (filtrage local) ─────────────────
  const getParStatut = useCallback(
    (statut: StatutVetement): Vetement[] =>
      vetements.filter((v) => v.statut === statut),
    [vetements]
  );

  const getLaves    = useCallback(() => getParStatut(StatutVetement.LAVE),        [getParStatut]);
  const getNonLaves = useCallback(
    () => vetements.filter((v) =>
      v.statut === StatutVetement.EN_ATTENTE || v.statut === StatutVetement.EN_COURS
    ),
    [vetements]
  );

  // ── Mettre à jour un vêtement ──────────────────────────────
  const mettreAJourVetement = useCallback(
    async (id: string, maj: UpdateVetementDTO): Promise<Vetement> => {
      const existant = await dbGetParId<Vetement>(STORES.VETEMENTS, id);
      if (!existant) throw new Error("Vêtement introuvable");

      const majComplet: Vetement = { ...existant, ...maj };
      await dbMettreAJour<Vetement>(STORES.VETEMENTS, majComplet);
      setVetements((prev) => prev.map((v) => (v.id === id ? majComplet : v)));
      return majComplet;
    },
    []
  );

  // ── Changer le statut ──────────────────────────────────────
  const changerStatut = useCallback(
    async (id: string, statut: StatutVetement): Promise<Vetement> => {
      const extra: Partial<Vetement> = { statut };
      if (statut === StatutVetement.LAVE)      extra.dateLavage      = new Date().toISOString();
      if (statut === StatutVetement.RECUPERE)  extra.dateRecuperation = new Date().toISOString();
      return mettreAJourVetement(id, extra);
    },
    [mettreAJourVetement]
  );

  const marquerLave      = useCallback((id: string) => changerStatut(id, StatutVetement.LAVE),      [changerStatut]);
  const marquerRecupere  = useCallback((id: string) => changerStatut(id, StatutVetement.RECUPERE),  [changerStatut]);
  const marquerEnCours   = useCallback((id: string) => changerStatut(id, StatutVetement.EN_COURS),  [changerStatut]);

  // ── Supprimer un vêtement ──────────────────────────────────
  const supprimerVetement = useCallback(async (id: string): Promise<void> => {
    await dbSupprimer(STORES.VETEMENTS, id);
    setVetements((prev) => prev.filter((v) => v.id !== id));
  }, []);

  return {
    vetements,
    loading,
    erreur,
    charger,
    enregistrerVetement,
    getVetementParId,
    getVetementsParClient,
    getParStatut,
    getLaves,
    getNonLaves,
    mettreAJourVetement,
    changerStatut,
    marquerLave,
    marquerRecupere,
    marquerEnCours,
    supprimerVetement,
  };
}
