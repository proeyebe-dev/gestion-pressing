

> Rôle : Gestion des données métier via IndexedDB  
> Périmètre : `src/db/`, `src/db/hooks/`, `src/types/`

---

##  Fichiers concernés

src/
├── types/
│   └── index.ts
│
└── db/
    ├── schema.ts
    ├── index.ts
    └── hooks/
        ├── useClients.ts
        ├── useVetements.ts
        ├── usePaiements.ts
        └── useStock.ts

---

#  Types & Interfaces (`src/types/index.ts`)

Contient les structures TypeScript globales.

## Entités principales

- Client
- Vetement
- Paiement
- ArticleStock

## Enums principaux

- StatutVetement
- TypeVetement
- ModePaiement

---

#  Base de données (`src/db/`)

## schema.ts
Définit les stores IndexedDB :
- clients
- vetements
- paiements
- stock

## index.ts (CRUD générique)

- dbAjouter()
- dbGetParId()
- dbGetTous()
- dbGetParIndex()
- dbMettreAJour()
- dbSupprimer()
- dbVider()
- genererUUID()
- genererNumeroTicket()

---

#  Hooks métier (`src/db/hooks/`)

## useClients
- créer client
- modifier
- supprimer
- rechercher

## useVetements
- enregistrer vêtement
- changer statut
- marquer lavé / récupéré

## usePaiements
- enregistrer paiement
- chiffre d’affaires
- paiements soldés

## useStock
- ajouter article
- ajuster quantité
- alertes stock

---

#  Utilisation dans React

import { useClients } from "../db/hooks/useClients";
import { useVetements } from "../db/hooks/useVetements";

---

#  Architecture

UI (pages)
   ↓
Hooks (logique métier)
   ↓
db/index.ts (CRUD)
   ↓
IndexedDB

---

