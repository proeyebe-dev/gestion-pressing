// ============================================================
// src/types/index.ts
// Types et interfaces partagés dans tout le projet
// Définis ici UNE SEULE FOIS — ne pas dupliquer ailleurs
// ============================================================

/**
 * Représente un client du pressing
 */
export interface Client {
  id: string;           // UUID généré côté frontend (crypto.randomUUID())
  nom: string;          // Nom complet du client
  telephone: string;    // Numéro de téléphone
  adresse: string;      // Adresse du client
}

/**
 * Les 4 états possibles d'un vêtement
 * Workflow : en_attente → en_lavage → pret → recupere
 */
export type StatutVetement = 'en_attente' | 'en_lavage' | 'pret' | 'recupere';

/**
 * Représente un vêtement déposé par un client
 */
export interface Vetement {
  id: string;                   // UUID
  type: string;                 // Ex : "Chemise", "Pantalon", "Robe"
  couleur: string;              // Ex : "Blanc", "Bleu marine"
  description: string;          // Détails supplémentaires
  dateDepot: string;            // Date ISO (new Date().toISOString())
  idClient: string;             // Référence vers Client.id
  idStatut: StatutVetement;     // Statut actuel du vêtement
}

/**
 * Représente un paiement pour un vêtement
 */
export interface Paiement {
  id: string;                                         // UUID
  montant: number;                                    // Montant en FCFA
  datePaiement: string;                               // Date ISO
  modePaiement: 'Espèces' | 'Mobile Money' | 'Carte'; // Mode de paiement
  idVetement: string;                                 // Référence vers Vetement.id
}

/**
 * Représente un produit dans le stock du pressing
 */
export interface ProduitStock {
  id: string;          // UUID
  nomProduit: string;  // Ex : "Lessive", "Adoucissant"
  quantite: number;    // Quantité disponible
  seuilAlerte: number; // Si quantite <= seuilAlerte → alerte stock faible
}
