import { useState } from 'react';
import { useVetements } from '../../db/hooks/useVetements';
import { useClients } from '../../db/hooks/useClients';
export default function VetementForm() {
  const { vetements, addVetement } = useVetements();
  const { clients } = useClients();
  const [type, setType] = useState('');
  const [couleur, setCouleur] = useState('');
  const [description, setDescription] = useState('');
  const [idClient, setIdClient] = useState('');
  const [success, setSuccess] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [errors, setErrors] = useState<{type?: string; couleur?: string; description?: string; idClient?: string}>({});
  const validate = () => {
    const newErrors: {type?: string; couleur?: string; description?: string; idClient?: string} = {};
    if (!idClient) newErrors.idClient = 'Veuillez sélectionner un client';
    if (!type) newErrors.type = 'Le type est obligatoire';
    if (!couleur) newErrors.couleur = 'La couleur est obligatoire';
    if (!description) newErrors.description = 'La description est obligatoire';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    await addVetement({ type, couleur, description, idClient });
    setType('');
    setCouleur('');
    setDescription('');
    setIdClient('');
    setErrors({});
    setSuccess(true);
    setShowForm(false);
    setTimeout(() => setSuccess(false), 3000);
  };
  const statutColors: Record<string, string> = {
    en_attente: 'bg-yellow-400/20 text-yellow-300 border-yellow-400/40',
    en_lavage: 'bg-blue-400/20 text-blue-300 border-blue-400/40',
    pret: 'bg-green-400/20 text-green-300 border-green-400/40',
    recupere: 'bg-gray-400/20 text-gray-300 border-gray-400/40',
  };
  const statutLabels: Record<string, string> = {
    en_attente: '⏳ En attente',
    en_lavage: '🫧 En lavage',
    pret: '✅ Prêt',
    recupere: '📦 Récupéré',
  };
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 p-6">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-yellow-400 rounded-2xl mb-4 shadow-lg">
            <span className="text-3xl">👕</span>
          </div>
          <h1 className="text-3xl font-bold text-white mb-1">Gestion Vêtements</h1>
          <p className="text-blue-300 text-sm">Enregistrez les vêtements déposés</p>
        </div>
        {/* Bouton ajouter */}
        {!showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="w-full mb-6 bg-yellow-400 hover:bg-yellow-300 text-slate-900 font-bold py-3 rounded-2xl transition-all duration-200 shadow-lg hover:shadow-yellow-400/30 hover:scale-105"
          >
            + Nouveau Vêtement
          </button>
        )}
        {/* Message succès */}
        {success && (
          <div className="mb-4 bg-green-500/20 border border-green-500/50 text-green-300 text-center py-3 rounded-xl font-medium">
            ✅ Vêtement enregistré avec succès !
          </div>
        )}
        {/* Formulaire */}
        {showForm && (
          <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6 mb-6 shadow-xl">
            <h2 className="text-white font-bold text-lg mb-4">Nouveau Vêtement</h2>
            {/* Client */}
            <div className="mb-4">
              <label className="block text-blue-200 text-sm font-medium mb-1">Client</label>
              <select
                value={idClient}
                onChange={e => setIdClient(e.target.value)}
                className={`w-full bg-white/10 border ${errors.idClient ? 'border-red-400' : 'border-white/20'} text-white rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-yellow-400`}
              >
                <option value="" className="bg-slate-800">-- Sélectionner un client --</option>
                {clients.map(client => (
                  <option key={client.id} value={client.id} className="bg-slate-800">
                    {client.nom}
                  </option>
                ))}
              </select>
              {errors.idClient && <p className="text-red-400 text-xs mt-1">{errors.idClient}</p>}
            </div>
            {/* Type */}
            <div className="mb-4">
              <label className="block text-blue-200 text-sm font-medium mb-1">Type de vêtement</label>
              <input
                type="text"
                value={type}
                onChange={e => setType(e.target.value)}
                placeholder="Ex: Chemise, Pantalon, Robe..."
                className={`w-full bg-white/10 border ${errors.type ? 'border-red-400' : 'border-white/20'} text-white placeholder-white/40 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-yellow-400`}
              />
              {errors.type && <p className="text-red-400 text-xs mt-1">{errors.type}</p>}
            </div>
            {/* Couleur */}
            <div className="mb-4">
              <label className="block text-blue-200 text-sm font-medium mb-1">Couleur</label>
              <input
                type="text"
                value={couleur}
                onChange={e => setCouleur(e.target.value)}
                placeholder="Ex: Bleu, Rouge, Noir..."
                className={`w-full bg-white/10 border ${errors.couleur ? 'border-red-400' : 'border-white/20'} text-white placeholder-white/40 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-yellow-400`}
              />
              {errors.couleur && <p className="text-red-400 text-xs mt-1">{errors.couleur}</p>}
            </div>
            {/* Description */}
            <div className="mb-4">
              <label className="block text-blue-200 text-sm font-medium mb-1">Description</label>
              <textarea
                value={description}
                onChange={e => setDescription(e.target.value)}
                placeholder="Ex: Taches sur le col, à laver à froid..."
                rows={3}
                className={`w-full bg-white/10 border ${errors.description ? 'border-red-400' : 'border-white/20'} text-white placeholder-white/40 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-yellow-400`}
              />
              {errors.description && <p className="text-red-400 text-xs mt-1">{errors.description}</p>}
            </div>
            {/* Date automatique */}
            <div className="mb-6">
              <label className="block text-blue-200 text-sm font-medium mb-1">Date de dépôt</label>
              <input
                type="text"
                value={new Date().toLocaleDateString('fr-FR')}
                disabled
                className="w-full bg-white/5 border border-white/10 text-white/50 rounded-xl px-4 py-3"
              />
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setShowForm(false)}
                className="flex-1 bg-white/10 hover:bg-white/20 text-white font-semibold py-3 rounded-xl transition"
              >
                Annuler
              </button>
              <button
                onClick={handleSubmit}
                className="flex-1 bg-yellow-400 hover:bg-yellow-300 text-slate-900 font-bold py-3 rounded-xl transition hover:scale-105"
              >
                Enregistrer
              </button>
            </div>
          </div>
        )}
        {/* Liste vêtements */}
        <h2 className="text-white font-bold text-lg mb-3">
          📋 Vêtements déposés
          <span className="ml-2 bg-yellow-400 text-slate-900 text-xs font-bold px-2 py-1 rounded-full">
            {vetements.length}
          </span>
        </h2>
        {vetements.length === 0 ? (
          <div className="text-center py-10 text-blue-300">
            <p className="text-4xl mb-2">👕</p>
            <p>Aucun vêtement pour l'instant.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {vetements.map(v => {
              const client = clients.find(c => c.id === v.idClient);
              return (
                <div key={v.id} className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-4 hover:bg-white/15 transition">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-500/30 rounded-full flex items-center justify-center text-xl">
                        👕
                      </div>
                      <div>
                        <p className="font-semibold text-white">{v.type} — {v.couleur}</p>
                        <p className="text-sm text-blue-300">👤 {client?.nom ?? 'Client inconnu'}</p>
                        <p className="text-sm text-blue-300">📝 {v.description}</p>
                        <p className="text-sm text-blue-300">📅 {new Date(v.dateDepot).toLocaleDateString('fr-FR')}</p>
                      </div>
                    </div>
                    <span className={`text-xs font-medium px-2 py-1 rounded-full border ${statutColors[v.idStatut]}`}>
                      {statutLabels[v.idStatut]}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}