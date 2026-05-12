import { useState } from 'react';
import { ProduitStock } from '../../types';
import { useStock } from '../../db/hooks/useStock';

type StatutProduit = 'ok' | 'faible' | 'epuise';

function getStatut(quantite: number, seuilAlerte: number): StatutProduit {
  if (quantite === 0) return 'epuise';
  if (quantite <= seuilAlerte) return 'faible';
  return 'ok';
}

const STATUT_CONFIG = {
  ok: {
    label: 'OK',
    badge: 'bg-green-100 text-green-800',
    text: 'text-green-700',
  },
  faible: {
    label: 'Stock faible',
    badge: 'bg-orange-100 text-orange-800',
    text: 'text-orange-600',
  },
  epuise: {
    label: 'Épuisé',
    badge: 'bg-red-100 text-red-800',
    text: 'text-red-600',
  },
};

// --- Formulaire modal ---
interface FormData {
  nomProduit: string;
  quantite: string;
  seuilAlerte: string;
}

const FORM_VIDE: FormData = { nomProduit: '', quantite: '', seuilAlerte: '' };

interface ModalProps {
  visible: boolean;
  editTarget: ProduitStock | null;
  form: FormData;
  onChange: (field: keyof FormData, value: string) => void;
  onSave: () => void;
  onClose: () => void;
}

function ModalFormulaire({ visible, editTarget, form, onChange, onSave, onClose }: ModalProps) {
  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md mx-4 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-5">
          {editTarget ? 'Modifier le produit' : 'Ajouter un produit'}
        </h2>

        <div className="space-y-4">
          <div>
            <label className="block text-sm text-gray-500 mb-1">Nom du produit</label>
            <input
              type="text"
              value={form.nomProduit}
              onChange={e => onChange('nomProduit', e.target.value)}
              placeholder="Ex: Lessive liquide"
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-300"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm text-gray-500 mb-1">Quantité disponible</label>
              <input
                type="number"
                value={form.quantite}
                onChange={e => onChange('quantite', e.target.value)}
                placeholder="Ex: 20"
                min="0"
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-300"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-500 mb-1">Seuil d'alerte</label>
              <input
                type="number"
                value={form.seuilAlerte}
                onChange={e => onChange('seuilAlerte', e.target.value)}
                placeholder="Ex: 5"
                min="1"
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-300"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-2 mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 transition"
          >
            Annuler
          </button>
          <button
            onClick={onSave}
            className="px-4 py-2 text-sm text-white bg-violet-600 rounded-lg hover:bg-violet-700 transition"
          >
            Enregistrer
          </button>
        </div>
      </div>
    </div>
  );
}

// --- Page principale ---
export default function StockPage() {
  const { produits, loading, ajouterProduit, modifierProduit, supprimerProduit } = useStock();

  const [recherche, setRecherche] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [editTarget, setEditTarget] = useState<ProduitStock | null>(null);
  const [form, setForm] = useState<FormData>(FORM_VIDE);

  // Stats
  const total = produits.length;
  const nbFaibles = produits.filter(p => getStatut(p.quantite, p.seuilAlerte) === 'faible').length;
  const nbEpuises = produits.filter(p => getStatut(p.quantite, p.seuilAlerte) === 'epuise').length;
  const nbAlertes = nbFaibles + nbEpuises;

  // Filtrage
  const produitsFiltres = produits.filter(p =>
    p.nomProduit.toLowerCase().includes(recherche.toLowerCase())
  );

  // Gestion du formulaire
  const handleFormChange = (field: keyof FormData, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const ouvrirAjout = () => {
    setEditTarget(null);
    setForm(FORM_VIDE);
    setModalVisible(true);
  };

  const ouvrirEdition = (produit: ProduitStock) => {
    setEditTarget(produit);
    setForm({
      nomProduit: produit.nomProduit,
      quantite: String(produit.quantite),
      seuilAlerte: String(produit.seuilAlerte),
    });
    setModalVisible(true);
  };

  const fermerModal = () => {
    setModalVisible(false);
    setEditTarget(null);
    setForm(FORM_VIDE);
  };

  const handleSave = async () => {
    const nomProduit = form.nomProduit.trim();
    const quantite = parseInt(form.quantite);
    const seuilAlerte = parseInt(form.seuilAlerte);

    if (!nomProduit || isNaN(quantite) || isNaN(seuilAlerte)) return;

    if (editTarget) {
      await modifierProduit(editTarget.id, { nomProduit, quantite, seuilAlerte });
    } else {
      await ajouterProduit({ nomProduit, quantite, seuilAlerte });
    }

    fermerModal();
  };

  const handleSupprimer = async (id: string) => {
    if (window.confirm('Supprimer ce produit du stock ?')) {
      await supprimerProduit(id);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-400 text-sm">
        Chargement du stock...
      </div>
    );
  }

  return (
    <div className="p-6 max-w-5xl mx-auto">
      {/* En-tête */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Gestion du stock</h1>
          <p className="text-sm text-gray-500 mt-0.5">Produits de lavage — quantités et alertes</p>
        </div>
        <button
          onClick={ouvrirAjout}
          className="flex items-center gap-2 px-4 py-2 bg-violet-600 text-white text-sm rounded-xl hover:bg-violet-700 transition"
        >
          <span className="text-lg leading-none">+</span>
          Ajouter produit
        </button>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-gray-50 rounded-xl p-4">
          <p className="text-xs text-gray-400 mb-1">Total produits</p>
          <p className="text-2xl font-semibold text-gray-900">{total}</p>
        </div>
        <div className="bg-gray-50 rounded-xl p-4">
          <p className="text-xs text-gray-400 mb-1">Stock faible</p>
          <p className="text-2xl font-semibold text-orange-600">{nbFaibles}</p>
        </div>
        <div className="bg-gray-50 rounded-xl p-4">
          <p className="text-xs text-gray-400 mb-1">Rupture de stock</p>
          <p className="text-2xl font-semibold text-red-600">{nbEpuises}</p>
        </div>
      </div>

      {/* Bannière d'alerte */}
      {nbAlertes > 0 && (
        <div className="flex items-center gap-2 bg-orange-50 border border-orange-200 rounded-xl px-4 py-3 mb-5 text-sm text-orange-800">
          <span>⚠️</span>
          <span>
            {nbAlertes} produit{nbAlertes > 1 ? 's' : ''} nécessite{nbAlertes > 1 ? 'nt' : ''} votre attention (stock faible ou épuisé)
          </span>
        </div>
      )}

      {/* Barre de recherche */}
      <div className="mb-4">
        <input
          type="text"
          value={recherche}
          onChange={e => setRecherche(e.target.value)}
          placeholder="Rechercher un produit..."
          className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-violet-300"
        />
      </div>

      {/* Tableau */}
      <div className="border border-gray-100 rounded-2xl overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-xs text-gray-400 uppercase tracking-wide">
            <tr>
              <th className="text-left px-5 py-3 font-medium">Produit</th>
              <th className="text-left px-5 py-3 font-medium">Quantité</th>
              <th className="text-left px-5 py-3 font-medium">Seuil alerte</th>
              <th className="text-left px-5 py-3 font-medium">Statut</th>
              <th className="px-5 py-3"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {produitsFiltres.length === 0 ? (
              <tr>
                <td colSpan={5} className="text-center py-10 text-gray-400">
                  Aucun produit trouvé
                </td>
              </tr>
            ) : (
              produitsFiltres.map(produit => {
                const statut = getStatut(produit.quantite, produit.seuilAlerte);
                const config = STATUT_CONFIG[statut];
                return (
                  <tr key={produit.id} className="hover:bg-gray-50 transition">
                    <td className="px-5 py-3.5 font-medium text-gray-800">{produit.nomProduit}</td>
                    <td className={`px-5 py-3.5 font-semibold ${config.text}`}>
                      {produit.quantite}
                    </td>
                    <td className="px-5 py-3.5 text-gray-500">{produit.seuilAlerte}</td>
                    <td className="px-5 py-3.5">
                      <span className={`inline-block text-xs font-medium px-2.5 py-1 rounded-full ${config.badge}`}>
                        {config.label}
                      </span>
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => ouvrirEdition(produit)}
                          className="p-1.5 text-gray-400 hover:text-violet-600 hover:bg-violet-50 rounded-lg transition"
                          title="Modifier"
                        >
                          ✏️
                        </button>
                        <button
                          onClick={() => handleSupprimer(produit.id)}
                          className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition"
                          title="Supprimer"
                        >
                          🗑️
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      <ModalFormulaire
        visible={modalVisible}
        editTarget={editTarget}
        form={form}
        onChange={handleFormChange}
        onSave={handleSave}
        onClose={fermerModal}
      />
    </div>
  );
}
