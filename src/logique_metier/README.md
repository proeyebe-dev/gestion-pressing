#  Gestion de Pressing — Membre 3 : Logique Métier

> **Rôle :** Services TypeScript, types/interfaces, CRUD via IndexedDB  
> **Périmètre :** `src/types/`, `src/db/`

---

##  Fichiers produits

```
src/
├── types/
│   └── index.ts              ← Types & interfaces partagés (toute l'équipe)
└── db/
    ├── schema.ts             ← Définition des stores IndexedDB
    ├── index.ts              ← Initialisation DB + CRUD générique
    └── hooks/
        ├── useClients.ts     ← Hook React — gestion des clients
        ├── useVetements.ts   ← Hook React — gestion des vêtements & statuts
        ├── usePaiements.ts   ← Hook React — paiements & chiffre d'affaires
        └── useStock.ts       ← Hook React — stock & alertes
```

---

##  Types & Interfaces (`src/types/index.ts`)

Ce fichier centralise **tous les types TypeScript** utilisés par l'application.

### Enums

| Enum | Valeurs |
|---|---|
| `StatutVetement` | `EN_ATTENTE` · `EN_COURS` · `LAVE` · `PRET` · `RECUPERE` |
| `TypeVetement` | `CHEMISE` · `PANTALON` · `ROBE` · `VESTE` · `MANTEAU` · `PULL` · `JEAN` · `COSTUME` · `AUTRE` |
| `TypeService` | `LAVAGE_SIMPLE` · `LAVAGE_PRESSING` · `REPASSAGE` · `NETTOYAGE_SEC` · `DETACHAGE` |
| `ModePaiement` | `ESPECES` · `MOBILE_MONEY` · `CARTE` |

### Interfaces principales

| Interface | Champs clés |
|---|---|
| `Client` | `id`, `nom`, `prenom`, `telephone`, `email?`, `adresse?`, `dateCreation` |
| `Vetement` | `id`, `clientId`, `numeroTicket`, `type`, `statut`, `service`, `prix`, `dateDepot`, `dateLavage?` |
| `Paiement` | `id`, `clientId`, `vetementIds[]`, `montant`, `modePaiement`, `estSolde` |
| `ArticleStock` | `id`, `nom`, `quantite`, `unite`, `seuilAlerte`, `dateMAJ` |

### DTOs (Data Transfer Objects)

Chaque entité dispose de types `CreateXDTO` et `UpdateXDTO` pour les opérations d'écriture, afin d'éviter de passer manuellement les champs auto-générés (`id`, `dateCreation`, etc.).

---

## 🗄️ Base de données IndexedDB

### `src/db/schema.ts` — Structure de la base

Définit les 4 **object stores** et leurs index :

| Store | Index disponibles |
|---|---|
| `clients` | `telephone` (unique), `nom` |
| `vetements` | `clientId`, `statut`, `numeroTicket`, `dateDepot` |
| `paiements` | `clientId`, `datePaiement`, `estSolde` |
| `stock` | `nom` (unique) |

### `src/db/index.ts` — Couche CRUD générique

Fournit les fonctions de bas niveau utilisées par tous les hooks :

```ts
ouvrirDB()                              // Connexion singleton
dbAjouter<T>(store, data)              // INSERT
dbGetParId<T>(store, id)               // SELECT by PK
dbGetTous<T>(store)                    // SELECT ALL
dbGetParIndex<T>(store, index, valeur) // SELECT by index
dbMettreAJour<T>(store, data)          // UPDATE (put)
dbSupprimer(store, id)                 // DELETE
dbVider(store)                         // TRUNCATE
genererUUID()                          // UUID v4 sans dépendance
genererNumeroTicket()                  // ex: TK-20260511-4821
```

> La connexion est un **singleton** : la base n'est ouverte qu'une seule fois et réutilisée dans toute l'application.

---

##  Hooks React (`src/db/hooks/`)

Chaque hook expose un état réactif + des fonctions CRUD. Il suffit de l'importer dans n'importe quelle page.

---

### `useClients`

```ts
const {
  clients,             // Client[] — liste réactive
  loading, erreur,
  creerClient,         // (dto: CreateClientDTO) => Promise<Client>
  getClientParId,      // (id) => Promise<Client | undefined>
  rechercherParNom,    // (nom) => Client[]  — filtrage local
  rechercherParTel,    // (tel) => Promise<Client[]>
  mettreAJourClient,   // (id, maj) => Promise<Client>
  supprimerClient,     // (id) => Promise<void>
  charger,             // () => void  — recharge manuellement
} = useClients();
```

**Exemple — page Clients :**
```tsx
const { clients, creerClient } = useClients();

await creerClient({
  nom: "Mbarga", prenom: "Paul",
  telephone: "699000000"
});
```

---

### `useVetements`

```ts
const {
  vetements,
  loading, erreur,
  enregistrerVetement,   // (dto) => Promise<Vetement>  — génère ticket auto
  getVetementsParClient, // (clientId) => Promise<Vetement[]>
  getLaves,              // () => Vetement[]
  getNonLaves,           // () => Vetement[]
  getParStatut,          // (statut) => Vetement[]
  marquerLave,           // (id) => Promise<Vetement>  — horodate dateLavage
  marquerRecupere,       // (id) => Promise<Vetement>  — horodate dateRecuperation
  marquerEnCours,        // (id) => Promise<Vetement>
  changerStatut,         // (id, statut) => Promise<Vetement>
  mettreAJourVetement,   // (id, maj) => Promise<Vetement>
  supprimerVetement,     // (id) => Promise<void>
} = useVetements();
```

**Exemple — page Statuts :**
```tsx
const { getLaves, marquerRecupere } = useVetements();

// Afficher les vêtements lavés
const laves = getLaves();

// Marquer un vêtement comme récupéré par le client
await marquerRecupere(vetementId);
```

---

### `usePaiements`

```ts
const {
  paiements,
  loading, erreur,
  enregistrerPaiement,    // (dto) => Promise<Paiement>
  getPaiementsParClient,  // (clientId) => Promise<Paiement[]>
  getNonSoldes,           // () => Paiement[]
  getChiffreAffaires,     // () => number  — total des paiements soldés
  getCAJour,              // (date: Date) => number
  marquerSolde,           // (id) => Promise<Paiement>
  mettreAJourPaiement,    // (id, maj) => Promise<Paiement>
  supprimerPaiement,      // (id) => Promise<void>
} = usePaiements();
```

**Exemple — Dashboard :**
```tsx
const { getChiffreAffaires, getCAJour } = usePaiements();

const totalGeneral  = getChiffreAffaires();
const caAujourdhui  = getCAJour(new Date());
```

---

### `useStock`

```ts
const {
  articles,
  loading, erreur,
  ajouterArticle,        // (dto) => Promise<ArticleStock>
  getArticlesEnAlerte,   // () => ArticleStock[]  — quantité ≤ seuilAlerte
  ajusterQuantite,       // (id, delta) => Promise<ArticleStock>  — delta peut être négatif
  mettreAJourArticle,    // (id, maj) => Promise<ArticleStock>
  supprimerArticle,      // (id) => Promise<void>
} = useStock();
```

**Exemple — page Stock :**
```tsx
const { articles, ajusterQuantite, getArticlesEnAlerte } = useStock();

// Consommer 2 kg de lessive
await ajusterQuantite(lessivelId, -2);

// Articles à réapprovisionner
const alertes = getArticlesEnAlerte();
```

---

##  Intégration avec les autres membres

| Membre | Page | Hook(s) à utiliser |
|---|---|---|
| Membre 1 | `Clients/` | `useClients` |
| Membre 2 | `Vetements/`, `Statuts/` | `useVetements` |
| Membre 2 | `Dashboard/` | `usePaiements`, `useVetements` |
| Membre 4 | `Paiements/` | `usePaiements`, `useClients` |
| Membre 4 | `Stock/` | `useStock` |

Import dans une page :
```ts
import { useVetements } from "../../db/hooks/useVetements";
import { useClients }   from "../../db/hooks/useClients";
```

---

##  Dépendances

Aucune dépendance externe — tout repose sur l'API **IndexedDB native** du navigateur.  
UUID et numéros de ticket sont générés en interne (`src/db/index.ts`).

---


 — Logique métier  
Projet :  — Gestion de Pressing*  
Stack : React · TypeScript · IndexedDB
