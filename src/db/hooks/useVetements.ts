// ============================================================
// src/db/hooks/useVetements.ts
// Hook React pour la gestion des vêtements en IndexedDB
// Fournit : liste des vêtements + fonctions CRUD + changement de statut
// ============================================================
 
import { useState, useEffect, useCallback } from "react";
import {
  dbAjouter, dbGetTous, dbGetParId, dbGetParIndex,
  dbMettreAJour, dbSupprimer, genererUUID, genererNumeroTicket,
} from "../index";
import { STORES } from "../schema";
import type { Vetement, CreateVetementDTO, UpdateVetementDTO } from "../../types";
import { StatutVetement } from "../../types";
 
export function useVetements(idClientFiltre?: string) {
  const [vetements, setVetements] = useState<Vetement[]>([]);
  const [loading,   setLoading]   = useState<boolean>(true);
  const [erreur,    setErreur]    = useState<string | null>(null);
 
  // ── Charger les vêtements ──────────────────────────────────
  const charger = useCallback(async () => {
    try {
      setLoading(true);
      setErreur(null);
      let data = await dbGetTous<Vetement>(STORES.VETEMENTS);
      // Filtrer par client si un filtre est passé
      if (idClientFiltre) {
        data = data.filter((v) => v.idClient === idClientFiltre);
      }
      setVetements(data);
    } catch (e) {
      setErreur("Erreur lors du chargement des vêtements");
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [idClientFiltre]);
 
  useEffect(() => { charger(); }, [charger]);
 
  // ── Enregistrer un vêtement ────────────────────────────────
  const enregistrerVetement = useCallback(
    async (dto: CreateVetementDTO): Promise<Vetement> => {
      const nouveau: Vetement = {
        ...dto,
        id:           genererUUID(),
        numeroTicket: genererNumeroTicket(),
        idStatut:     StatutVetement.EN_ATTENTE,
        dateDepot:    new Date().toISOString(),
      };
      await dbAjouter<Vetement>(STORES.VETEMENTS, nouveau);
      setVetements((prev) => [...prev, nouveau]);
      return nouveau;
    },
    []
  );
 
  // ── Obtenir un vêtement par ID ─────────────────────────────
  const getVetementParId = useCallback(
    async (id: string): Promise<Vetement | undefined> =>
      dbGetParId<Vetement>(STORES.VETEMENTS, id),
    []
  );
 
  // ── Vêtements d'un client ──────────────────────────────────
  const getVetementsParClient = useCallback(
    async (clientId: string): Promise<Vetement[]> =>
      dbGetParIndex<Vetement>(STORES.VETEMENTS, "idClient", clientId),
    []
  );
 
  // ── Filtrer par statut (côté mémoire) ─────────────────────
  const filtrerParStatut = useCallback(
    (statut: StatutVetement): Vetement[] =>
      vetements.filter((v) => v.idStatut === statut),
    [vetements]
  );
 
  const getLaves    = useCallback(
    () => filtrerParStatut(StatutVetement.LAVE),
    [filtrerParStatut]
  );
 
  const getNonLaves = useCallback(
    () => vetements.filter((v) =>
      v.idStatut === StatutVetement.EN_ATTENTE ||
      v.idStatut === StatutVetement.EN_COURS
    ),
    [vetements]
  );
 
  // ── Modifier un vêtement ───────────────────────────────────
  const modifierVetement = useCallback(
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
  /**
   * Workflow : en_attente → en_lavage → pret → recupere
   */
  const changerStatut = useCallback(
    async (id: string, statut: StatutVetement): Promise<Vetement> => {
      const extra: Partial<Vetement> = { idStatut: statut };
      if (statut === StatutVetement.LAVE)     extra.dateLavage       = new Date().toISOString();
      if (statut === StatutVetement.RECUPERE) extra.dateRecuperation = new Date().toISOString();
      return modifierVetement(id, extra);
    },
    [modifierVetement]
  );
 
  const marquerEnCours  = useCallback((id: string) => changerStatut(id, StatutVetement.EN_COURS),  [changerStatut]);
  const marquerLave     = useCallback((id: string) => changerStatut(id, StatutVetement.LAVE),      [changerStatut]);
  const marquerRecupere = useCallback((id: string) => changerStatut(id, StatutVetement.RECUPERE),  [changerStatut]);
 
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
    filtrerParStatut,
    getLaves,
    getNonLaves,
    modifierVetement,
    changerStatut,
    marquerEnCours,
    marquerLave,
    marquerRecupere,
    supprimerVetement,
  };
}
 
