import { useClients } from '../../db/hooks/useClients';
import { useVetements } from '../../db/hooks/useVetements';
export default function Dashboard() {
  const { clients } = useClients();
  const { vetements } = useVetements();
  const enAttente = vetements.filter(v => v.idStatut === 'en_attente').length;
  const enLavage = vetements.filter(v => v.idStatut === 'en_lavage').length;
  const pret = vetements.filter(v => v.idStatut === 'pret').length;
  const recupere = vetements.filter(v => v.idStatut === 'recupere').length;
  const stats = [
    { label: 'Clients', value: clients.length, icon: '👤', color: 'bg-blue-500/20 border-blue-500/40 text-blue-300' },
    { label: 'Vêtements', value: vetements.length, icon: '👕', color: 'bg-purple-500/20 border-purple-500/40 text-purple-300' },
    { label: 'En attente', value: enAttente, icon: '⏳', color: 'bg-yellow-500/20 border-yellow-500/40 text-yellow-300' },
    { label: 'En lavage', value: enLavage, icon: '🫧', color: 'bg-cyan-500/20 border-cyan-500/40 text-cyan-300' },
    { label: 'Prêts', value: pret, icon: '✅', color: 'bg-green-500/20 border-green-500/40 text-green-300' },
    { label: 'Récupérés', value: recupere, icon: '📦', color: 'bg-gray-500/20 border-gray-500/40 text-gray-300' },
  ];
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 p-6">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-yellow-400 rounded-2xl mb-4 shadow-lg">
            <span className="text-3xl">📊</span>
          </div>
          <h1 className="text-3xl font-bold text-white mb-1">Dashboard</h1>
          <p className="text-blue-300 text-sm">Vue d'ensemble de votre pressing</p>
        </div>
        {/* Stats */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          {stats.map((stat, i) => (
            <div key={i} className={`border rounded-2xl p-4 ${stat.color} backdrop-blur-sm`}>
              <div className="flex items-center gap-3">
                <span className="text-3xl">{stat.icon}</span>
                <div>
                  <p className="text-2xl font-bold text-white">{stat.value}</p>
                  <p className="text-sm">{stat.label}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
        {/* Derniers vêtements */}
        <h2 className="text-white font-bold text-lg mb-3">🕐 Derniers dépôts</h2>
        {vetements.length === 0 ? (
          <div className="text-center py-10 text-blue-300">
            <p className="text-4xl mb-2">👕</p>
            <p>Aucun vêtement déposé pour l'instant.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {[...vetements].reverse().slice(0, 5).map(v => {
              const client = clients.find(c => c.id === v.idClient);
              return (
                <div key={v.id} className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-4 hover:bg-white/15 transition">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">👕</span>
                      <div>
                        <p className="font-semibold text-white">{v.type} — {v.couleur}</p>
                        <p className="text-sm text-blue-300">👤 {client?.nom ?? 'Client inconnu'}</p>
                        <p className="text-sm text-blue-300">📅 {new Date(v.dateDepot).toLocaleDateString('fr-FR')}</p>
                      </div>
                    </div>
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