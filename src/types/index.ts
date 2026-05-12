// ============================================================
// src/types/index.ts — Types TypeScript partagés dans tout le projet
// Définis ici UNE SEULE FOIS — ne pas dupliquer ailleurs
// ============================================================
 
// ── Enums ──────────────────────────────────────────────────
 
/**
 * Les statuts possibles d'un vêtement
 * Workflow : EN_ATTENTE → EN_COURS → LAVE → PRET → RECUPERE
 */
export enum StatutVetement {
  EN_ATTENTE = "en_attente",
  EN_COURS   = "en_cours",
  LAVE       = "lave",
  PRET       = "pret",
  RECUPERE   = "recupere",
}
 
export enum TypeVetement {
  CHEMISE  = "chemise",
  PANTALON = "pantalon",
  ROBE     = "robe",
  VESTE    = "veste",
  MANTEAU  = "manteau",
  PULL     = "pull",
  JEAN     = "jean",
  COSTUME  = "costume",
  AUTRE    = "autre",
}
 
export enum TypeService {
  LAVAGE_SIMPLE   = "lavage_simple",
  LAVAGE_PRESSING = "lavage_pressing",
  REPASSAGE       = "repassage",
  NETTOYAGE_SEC   = "nettoyage_sec",
  DETACHAGE       = "detachage",
}
 
export enum ModePaiement {
  ESPECES      = "especes",
  MOBILE_MONEY = "mobile_money",
  CARTE        = "carte",
}
 
// ── Entités principales ────────────────────────────────────
 
/**
 * Représente un client du pressing
 */
export interface Client {
  id: string;           // UUID généré côté frontend
  nom: string;          // Nom complet
  prenom: string;
  telephone: string;
  email?: string;
  adresse?: string;
  dateCreation: string; // ISO string
}
 
/**
 * Représente un vêtement déposé par un client
 */
export interface Vetement {
  id: string;
  idClient: string;             // Référence vers Client.id
  numeroTicket: string;
  type: TypeVetement;
  description: string;
  couleur?: string;
  marque?: string;
  idStatut: StatutVetement;     // Statut actuel
  service: TypeService;
  prix: number;
  dateDepot: string;            // ISO string
  dateLavage?: string;
  dateRecuperation?: string;
  observations?: string;
}
 
/**
 * Représente un paiement pour un vêtement
 */
export interface Paiement {
  id: string;
  idVetement: string;           // Référence vers Vetement.id
  montant: number;              // Montant en FCFA
  datePaiement: string;         // ISO string
  modePaiement: ModePaiement;
  estSolde: boolean;
  observations?: string;
}
 
/**
 * Représente un produit dans le stock du pressing
 */
export interface ProduitStock {
  id: string;
  nomProduit: string;   // Ex : "Lessive", "Adoucissant"
  quantite: number;
  seuilAlerte: number;  // Alerte si quantite <= seuilAlerte
  dateMAJ: string;      // ISO string
}
 
// ── DTOs (Data Transfer Objects) ──────────────────────────
// Types utilisés pour créer ou modifier des entités
 
export type CreateClientDTO   = Omit<Client,      "id" | "dateCreation">;
export type UpdateClientDTO   = Partial<Omit<Client,      "id" | "dateCreation">>;
 
export type CreateVetementDTO = Omit<Vetement,    "id" | "idStatut" | "dateDepot" | "numeroTicket">;
export type UpdateVetementDTO = Partial<Omit<Vetement,    "id" | "idClient" | "dateDepot" | "numeroTicket">>;
 
export type CreatePaiementDTO = Omit<Paiement,    "id" | "datePaiement">;
export type UpdatePaiementDTO = Partial<Omit<Paiement,    "id" | "idVetement" | "datePaiement">>;
 
export type CreateStockDTO    = Omit<ProduitStock, "id" | "dateMAJ">;
export type UpdateStockDTO    = Partial<Omit<ProduitStock, "id" | "dateMAJ">>;
 
// ── Résultat générique ─────────────────────────────────────
 
export interface ResultatOp<T> {
  succes: boolean;
  donnees?: T;
  erreur?: string;
}
 
