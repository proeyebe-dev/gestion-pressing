export type StatutVetement = 'en_attente' | 'en_lavage' | 'pret' | 'recupere';
export interface Client {
  id: string;
  nom: string;
  telephone: string;
  adresse: string;
}
export interface Vetement {
  id: string;
  type: string;
  couleur: string;
  description: string;
  dateDepot: string;
  idClient: string;
  idStatut: StatutVetement;
}