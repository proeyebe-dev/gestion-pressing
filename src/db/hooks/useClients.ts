// ============================================================
// src/db/hooks/useClients.ts
// Hook React pour la gestion des clients en IndexedDB
// Fournit : liste des clients + fonctions CRUD complètes
// ============================================================
 
import { useState, useEffect, useCallback } from "react";
import {
  dbAjouter, dbGetTous, dbGetParId, dbGetParIndex,
  dbMettreAJour, dbSupprimer, genererUUID,
} from "../index";
import { STORES } from "../schema";
import type { Client, CreateClientDTO, UpdateClientDTO } from "../../types";
 
export function useClients() {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [erreur, setErreur]   = useState<string | null>(null);
 
  // ── Charger tous les clients ───────────────────────────────
  const charger = useCallback(async () => {
    try {
      setLoading(true);
      setErreur(null);
      const data = await dbGetTous<Client>(STORES.CLIENTS);
      setClients(data);
    } catch (e) {
      setErreur("Erreur lors du chargement des clients");
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, []);
 
  // Chargement automatique au montage du composant
  useEffect(() => {
    charger();
  }, [charger]);
 
  // ── Créer un client ────────────────────────────────────────
  const creerClient = useCallback(async (dto: CreateClientDTO): Promise<Client> => {
    const nouveau: Client = {
      ...dto,
      id: genererUUID(),
      dateCreation: new Date().toISOString(),
    };
    await dbAjouter<Client>(STORES.CLIENTS, nouveau);
    setClients((prev) => [...prev, nouveau]);
    return nouveau;
  }, []);
 
  // ── Obtenir un client par ID ───────────────────────────────
  const getClientParId = useCallback(
    async (id: string): Promise<Client | undefined> =>
      dbGetParId<Client>(STORES.CLIENTS, id),
    []
  );
 
  // ── Rechercher par téléphone ───────────────────────────────
  const rechercherParTel = useCallback(
    async (telephone: string): Promise<Client[]> =>
      dbGetParIndex<Client>(STORES.CLIENTS, "telephone", telephone),
    []
  );
 
  // ── Rechercher par nom (filtrage local) ───────────────────
  const rechercherParNom = useCallback(
    (nom: string): Client[] => {
      if (!nom.trim()) return clients;
      const q = nom.toLowerCase();
      return clients.filter(
        (c) =>
          c.nom.toLowerCase().includes(q) ||
          c.telephone.includes(nom)
      );
    },
    [clients]
  );
 
  // ── Mettre à jour un client ────────────────────────────────
  const modifierClient = useCallback(
    async (id: string, maj: UpdateClientDTO): Promise<Client> => {
      const existant = await dbGetParId<Client>(STORES.CLIENTS, id);
      if (!existant) throw new Error("Client introuvable");
 
      const majComplet: Client = { ...existant, ...maj };
      await dbMettreAJour<Client>(STORES.CLIENTS, majComplet);
      setClients((prev) => prev.map((c) => (c.id === id ? majComplet : c)));
      return majComplet;
    },
    []
  );
 
  // ── Supprimer un client ────────────────────────────────────
  const supprimerClient = useCallback(async (id: string): Promise<void> => {
    await dbSupprimer(STORES.CLIENTS, id);
    setClients((prev) => prev.filter((c) => c.id !== id));
  }, []);
 
  return {
    clients,
    loading,
    erreur,
    charger,
    creerClient,
    getClientParId,
    rechercherParTel,
    rechercherParNom,
    modifierClient,
    supprimerClient,
  };
}
 
