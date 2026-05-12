// ============================================================
// src/db/hooks/useClients.ts
// Hook React pour la gestion des clients en IndexedDB
// Fournit : liste des clients + fonctions CRUD
// ============================================================

import { useState, useEffect, useCallback } from 'react';
import { getDB } from '../index';
import { STORES } from '../schema';
import type { Client } from '../../types';

/**
 * useClients — hook personnalisé pour les clients.
 *
 * Utilisation dans un composant :
 *   const { clients, loading, ajouterClient, supprimerClient, modifierClient } = useClients();
 */
export function useClients() {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // ── Charger tous les clients depuis IndexedDB ──────────────
  const chargerClients = useCallback(async () => {
    try {
      setLoading(true);
      const db = await getDB();
      // getAll() retourne tous les enregistrements du store
      const tous = await db.getAll(STORES.CLIENTS) as Client[];
      setClients(tous);
      setError(null);
    } catch (e) {
      setError('Erreur lors du chargement des clients');
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, []);

  // Chargement automatique au montage du composant
  useEffect(() => {
    chargerClients();
  }, [chargerClients]);

  // ── Ajouter un client ──────────────────────────────────────
  const ajouterClient = useCallback(async (
    data: Omit<Client, 'id'>  // On reçoit tout sauf l'id (généré ici)
  ): Promise<void> => {
    try {
      const db = await getDB();
      const nouveauClient: Client = {
        ...data,
        id: crypto.randomUUID(), // Génère un identifiant unique
      };
      await db.add(STORES.CLIENTS, nouveauClient);
      // Recharger la liste pour mettre à jour l'affichage
      await chargerClients();
    } catch (e) {
      setError("Erreur lors de l'ajout du client");
      console.error(e);
    }
  }, [chargerClients]);

  // ── Modifier un client existant ────────────────────────────
  const modifierClient = useCallback(async (client: Client): Promise<void> => {
    try {
      const db = await getDB();
      // put() remplace l'entrée entière (pas une mise à jour partielle)
      await db.put(STORES.CLIENTS, client);
      await chargerClients();
    } catch (e) {
      setError('Erreur lors de la modification du client');
      console.error(e);
    }
  }, [chargerClients]);

  // ── Supprimer un client ────────────────────────────────────
  const supprimerClient = useCallback(async (id: string): Promise<void> => {
    try {
      const db = await getDB();
      await db.delete(STORES.CLIENTS, id);
      await chargerClients();
    } catch (e) {
      setError('Erreur lors de la suppression du client');
      console.error(e);
    }
  }, [chargerClients]);

  // ── Rechercher un client par son nom ──────────────────────
  const rechercherParNom = useCallback((terme: string): Client[] => {
    if (!terme.trim()) return clients;
    const termeLower = terme.toLowerCase();
    return clients.filter(c =>
      c.nom.toLowerCase().includes(termeLower) ||
      c.telephone.includes(terme)
    );
  }, [clients]);

  return {
    clients,
    loading,
    error,
    ajouterClient,
    modifierClient,
    supprimerClient,
    rechercherParNom,
    recharger: chargerClients,
  };
}
