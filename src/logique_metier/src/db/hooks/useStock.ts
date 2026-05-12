// ============================================================
// src/db/hooks/useStock.ts
// ============================================================

import { useState, useEffect, useCallback } from "react";
import {
  dbAjouter, dbGetTous, dbGetParId,
  dbMettreAJour, dbSupprimer, genererUUID,
} from "../index";
import { STORES } from "../schema";
import type { ArticleStock, CreateStockDTO, UpdateStockDTO } from "../../types";

export function useStock() {
  const [articles, setArticles] = useState<ArticleStock[]>([]);
  const [loading,  setLoading]  = useState(true);
  const [erreur,   setErreur]   = useState<string | null>(null);

  // ── Charger ────────────────────────────────────────────────
  const charger = useCallback(async () => {
    try {
      setLoading(true);
      setErreur(null);
      const data = await dbGetTous<ArticleStock>(STORES.STOCK);
      setArticles(data);
    } catch (e) {
      setErreur(String(e));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { charger(); }, [charger]);

  // ── Ajouter un article ─────────────────────────────────────
  const ajouterArticle = useCallback(
    async (dto: CreateStockDTO): Promise<ArticleStock> => {
      const nouveau: ArticleStock = {
        ...dto,
        id:      genererUUID(),
        dateMAJ: new Date().toISOString(),
      };
      await dbAjouter<ArticleStock>(STORES.STOCK, nouveau);
      setArticles((prev) => [...prev, nouveau]);
      return nouveau;
    },
    []
  );

  // ── Articles en alerte (stock faible) ─────────────────────
  const getArticlesEnAlerte = useCallback(
    (): ArticleStock[] => articles.filter((a) => a.quantite <= a.seuilAlerte),
    [articles]
  );

  // ── Mettre à jour la quantité ──────────────────────────────
  const ajusterQuantite = useCallback(
    async (id: string, delta: number): Promise<ArticleStock> => {
      const existant = await dbGetParId<ArticleStock>(STORES.STOCK, id);
      if (!existant) throw new Error("Article introuvable");

      const majComplet: ArticleStock = {
        ...existant,
        quantite: Math.max(0, existant.quantite + delta),
        dateMAJ:  new Date().toISOString(),
      };
      await dbMettreAJour<ArticleStock>(STORES.STOCK, majComplet);
      setArticles((prev) => prev.map((a) => (a.id === id ? majComplet : a)));
      return majComplet;
    },
    []
  );

  // ── Mettre à jour un article ───────────────────────────────
  const mettreAJourArticle = useCallback(
    async (id: string, maj: UpdateStockDTO): Promise<ArticleStock> => {
      const existant = await dbGetParId<ArticleStock>(STORES.STOCK, id);
      if (!existant) throw new Error("Article introuvable");

      const majComplet: ArticleStock = {
        ...existant,
        ...maj,
        dateMAJ: new Date().toISOString(),
      };
      await dbMettreAJour<ArticleStock>(STORES.STOCK, majComplet);
      setArticles((prev) => prev.map((a) => (a.id === id ? majComplet : a)));
      return majComplet;
    },
    []
  );

  // ── Supprimer ──────────────────────────────────────────────
  const supprimerArticle = useCallback(async (id: string): Promise<void> => {
    await dbSupprimer(STORES.STOCK, id);
    setArticles((prev) => prev.filter((a) => a.id !== id));
  }, []);

  return {
    articles,
    loading,
    erreur,
    charger,
    ajouterArticle,
    getArticlesEnAlerte,
    ajusterQuantite,
    mettreAJourArticle,
    supprimerArticle,
  };
}
