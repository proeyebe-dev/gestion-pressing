// ============================================================
// src/types/index.ts — Types TypeScript partagés
// ============================================================

export enum StatutVetement {
  EN_ATTENTE = "en_attente",
  EN_COURS    = "en_cours",
  LAVE        = "lave",
  PRET        = "pret",
  RECUPERE    = "recupere",
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
  ESPECES  = "especes",
  MOBILE_MONEY = "mobile_money",
  CARTE    = "carte",
}

// ---- Entités principales ----

export interface Client {
  id: string;
  nom: string;
  prenom: string;
  telephone: string;
  email?: string;
  adresse?: string;
  dateCreation: string; // ISO string pour IndexedDB
}

export interface Vetement {
  id: string;
  clientId: string;
  numeroTicket: string;
  type: TypeVetement;
  description: string;
  couleur?: string;
  marque?: string;
  statut: StatutVetement;
  service: TypeService;
  prix: number;
  dateDepot: string;
  dateLavage?: string;
  dateRecuperation?: string;
  observations?: string;
}

export interface Paiement {
  id: string;
  clientId: string;
  vetementIds: string[];
  montant: number;
  modePaiement: ModePaiement;
  datePaiement: string;
  estSolde: boolean;
  observations?: string;
}

export interface ArticleStock {
  id: string;
  nom: string;          // ex: "Lessive", "Eau de Javel"
  quantite: number;
  unite: string;        // ex: "kg", "L", "unité"
  seuilAlerte: number;
  dateMAJ: string;
}

// ---- DTOs ----

export type CreateClientDTO    = Omit<Client,    "id" | "dateCreation">;
export type UpdateClientDTO    = Partial<Omit<Client,    "id" | "dateCreation">>;

export type CreateVetementDTO  = Omit<Vetement,  "id" | "statut" | "dateDepot" | "numeroTicket">;
export type UpdateVetementDTO  = Partial<Omit<Vetement,  "id" | "clientId" | "dateDepot" | "numeroTicket">>;

export type CreatePaiementDTO  = Omit<Paiement,  "id" | "datePaiement">;
export type UpdatePaiementDTO  = Partial<Omit<Paiement,  "id" | "clientId" | "datePaiement">>;

export type CreateStockDTO     = Omit<ArticleStock, "id" | "dateMAJ">;
export type UpdateStockDTO     = Partial<Omit<ArticleStock, "id" | "dateMAJ">>;

// ---- Résultat générique ----

export interface ResultatOp<T> {
  succes: boolean;
  donnees?: T;
  erreur?: string;
}
