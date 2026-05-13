import { useState } from 'react';
import { useClients } from '../../db/hooks/useClients';
export default function ClientForm() {
  const { clients, addClient } = useClients();
  const [nom, setNom] = useState('');
  const [telephone, setTelephone] = useState('');
  const [adresse, setAdresse] = useState('');
  const [success, setSuccess] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [errors, setErrors] = useState<{nom?: string; telephone?: string; adresse?: string}>({});
  const validate = () => {
    const newErrors: {nom?: string; telephone?: string; adresse?: string} = {};
    if (!nom) newErrors.nom = 'Le nom est obligatoire';
    if (!telephone) newErrors.telephone = 'Le téléphone est obligatoire';
    if (!adresse) newErrors.adresse = "L'adresse est obligatoire";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    await addClient({ nom, telephone, adresse });
    setNom('');
    setTelephone('');
    setAdresse('');
    setErrors({});
    setSuccess(true);
    setShowForm(false);
    setTimeout(() => setSuccess(false), 3000);
  };
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 p-6">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-yellow-400 rounded-2xl mb-4 shadow-lg">
            <span className="text-3xl">👤</span>
          </div>
          <h1 className="text-3xl font-bold text-white mb-1">Gestion Clients</h1>
          <p className="text-blue-300 text-sm">Enregistrez et gérez vos clients</p>
        </div>
        {/* Bouton ajouter */}
        {!showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="w-full mb-6 bg-yellow-400 hover:bg-yellow-300 text-slate-900 font-bold py-3 rounded-2xl transition-all duration-200 shadow-lg hover:shadow-yellow-400/30 hover:scale-105"
          >
            + Nouveau Client
          </button>
        )}
        {/* Message succès */}
        {success && (
          <div className="mb-4 bg-green-500/20 border border-green-500/50 text-green-300 text-center py-3 rounded-xl font-medium">
            ✅ Client enregistré avec succès !
          </div>
        )}
        {/* Formulaire */}
        {showForm && (
          <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6 mb-6 shadow-xl">
            <h2 className="text-white font-bold text-lg mb-4">Nouveau Client</h2>
            <div className="mb-4">
              <label className="block text-blue-200 text-sm font-medium mb-1">Nom complet</label>
              <input
                type="text"
                value={nom}
                onChange={e => setNom(e.target.value)}
                placeholder="Ex: Marie Dupont"
                className={`w-full bg-white/10 border ${errors.nom ? 'border-red-400' : 'border-white/20'} text-white placeholder-white/40 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-yellow-400`}
              />
              {errors.nom && <p className="text-red-400 text-xs mt-1">{errors.nom}</p>}
            </div>
            <div className="mb-4">
              <label className="block text-blue-200 text-sm font-medium mb-1">Téléphone</label>
              <input
                type="tel"
                value={telephone}
                onChange={e => setTelephone(e.target.value)}
                placeholder="Ex: 06 12 34 56 78"
                className={`w-full bg-white/10 border ${errors.telephone ? 'border-red-400' : 'border-white/20'} text-white placeholder-white/40 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-yellow-400`}
              />
              {errors.telephone && <p className="text-red-400 text-xs mt-1">{errors.telephone}</p>}
            </div>
            <div className="mb-6">
              <label className="block text-blue-200 text-sm font-medium mb-1">Adresse</label>
              <input
                type="text"
                value={adresse}
                onChange={e => setAdresse(e.target.value)}
                placeholder="Ex: 12 rue des Fleurs"
                className={`w-full bg-white/10 border ${errors.adresse ? 'border-red-400' : 'border-white/20'} text-white placeholder-white/40 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-yellow-400`}
              />
              {errors.adresse && <p className="text-red-400 text-xs mt-1">{errors.adresse}</p>}
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
        {/* Liste clients */}
        <h2 className="text-white font-bold text-lg mb-3">
          📋 Clients enregistrés
          <span className="ml-2 bg-yellow-400 text-slate-900 text-xs font-bold px-2 py-1 rounded-full">
            {clients.length}
          </span>
        </h2>
        {clients.length === 0 ? (
          <div className="text-center py-10 text-blue-300">
            <p className="text-4xl mb-2">👥</p>
            <p>Aucun client pour l'instant.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {clients.map(client => (
              <div key={client.id} className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-4 hover:bg-white/15 transition">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-yellow-400 rounded-full flex items-center justify-center font-bold text-slate-900">
                    {client.nom.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="font-semibold text-white">{client.nom}</p>
                    <p className="text-sm text-blue-300">📞 {client.telephone}</p>
                    <p className="text-sm text-blue-300">📍 {client.adresse}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}