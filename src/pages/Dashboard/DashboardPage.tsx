import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDashboard, Periode, RepartitionStatuts, DonneesGraphique } from '../../db/hooks/useDashboard';
import { StatutVetement } from '../../types';

// --- Utilitaires ---
function formatMontant(val: number): string {
  if (val >= 1000000) return (val / 1000000).toFixed(1) + 'M F';
  if (val >= 1000) return Math.round(val / 1000) + 'k F';
  return val + ' F';
}

function getDateJour(): string {
  const jours = ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];
  const mois = ['janvier', 'février', 'mars', 'avril', 'mai', 'juin',
                 'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre'];
  const now = new Date();
  return `${jours[now.getDay()]} ${now.getDate()} ${mois[now.getMonth()]} ${now.getFullYear()}`;
}

const STATUT_CONFIG: Record<StatutVetement, { label: string; className: string }> = {
  en_attente: { label: 'En attente', className: 'bg-orange-100 text-orange-800' },
  en_lavage:  { label: 'En lavage',  className: 'bg-blue-100 text-blue-800'   },
  pret:       { label: 'Prêt',       className: 'bg-green-100 text-green-800' },
  recupere:   { label: 'Récupéré',   className: 'bg-gray-100 text-gray-600'   },
};

// --- Composant graphique barres ---
function GraphiqueBarres({ donnees }: { donnees: DonneesGraphique[] }) {
  const [hovered, setHovered] = useState<number | null>(null);
  const max = useMemo(() => Math.max(...donnees.map(d => d.valeur)), [donnees]);

  return (
    <div className="flex items-end gap-1.5 h-32 w-full">
      {donnees.map((d, i) => {
        const pct = Math.round((d.valeur / max) * 100);
        const isLast = i === donnees.length - 1;
        const isHovered = hovered === i;
        return (
          <div
            key={i}
            className="flex flex-col items-center gap-1 flex-1 h-full justify-end"
            onMouseEnter={() => setHovered(i)}
            onMouseLeave={() => setHovered(null)}
          >
            <div className="relative w-full flex flex-col justify-end" style={{ height: '110px' }}>
              {isHovered && (
                <div className="absolute bottom-full mb-1 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded-md whitespace-nowrap z-10">
                  {formatMontant(d.valeur)}
                </div>
              )}
              <div
                className="w-full rounded-t-md transition-all duration-200 cursor-pointer"
                style={{
                  height: `${pct}%`,
                  background: isLast ? '#534AB7' : isHovered ? '#7F77DD' : '#AFA9EC',
                }}
              />
            </div>
            <span className="text-xs text-gray-400">{d.label}</span>
          </div>
        );
      })}
    </div>
  );
}

// --- Composant donut ---
function DonutStatuts({ repartition }: { repartition: RepartitionStatuts[] }) {
  const total = repartition.reduce((s, x) => s + x.valeur, 0);
  const r = 32, cx = 45, cy = 45;
  const circ = 2 * Math.PI * r;

  let offset = 0;
  const segments = repartition.map(s => {
    const dash = (s.valeur / total) * circ;
    const seg = { ...s, dash, offset };
    offset += dash;
    return seg;
  });

  return (
    <div className="flex items-center gap-5">
      <svg width="90" height="90" viewBox="0 0 90 90" className="flex-shrink-0">
        <circle cx={cx} cy={cy} r={r} fill="none" stroke="#EEEDFE" strokeWidth="14" />
        {segments.map((s, i) => (
          <circle
            key={i}
            cx={cx} cy={cy} r={r}
            fill="none"
            stroke={s.couleur}
            strokeWidth="14"
            strokeDasharray={`${s.dash} ${circ - s.dash}`}
            strokeDashoffset={-s.offset}
            transform={`rotate(-90 ${cx} ${cy})`}
          />
        ))}
        <text x={cx} y={cy + 5} textAnchor="middle" fontSize="13" fontWeight="500" fill="var(--color-text-primary)">
          {total}
        </text>
      </svg>
      <div className="flex flex-col gap-2 flex-1">
        {repartition.map((s, i) => (
          <div key={i} className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-2 text-gray-500">
              <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: s.couleur }} />
              {s.label}
            </div>
            <span className="font-medium text-gray-800">{s.valeur}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// --- Page principale ---
export default function DashboardPage() {
  const navigate = useNavigate();
  const { loading, stats, clientsRecents, activiteRecente, repartitionStatuts, getGraphique } = useDashboard();
  const [periode, setPeriode] = useState<Periode>('mois');

  const donnees = getGraphique(periode);

  if (loading) {
    return (
      <div className="p-6 max-w-5xl mx-auto">
        <div className="grid grid-cols-4 gap-3 mb-5">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-24 bg-gray-100 rounded-xl animate-pulse" />
          ))}
        </div>
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="h-52 bg-gray-100 rounded-xl animate-pulse" />
          <div className="h-52 bg-gray-100 rounded-xl animate-pulse" />
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-5xl mx-auto">

      {/* En-tête */}
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Tableau de bord</h1>
        <p className="text-sm text-gray-400 mt-0.5">{getDateJour()}</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-3 mb-4">
        <div className="bg-gray-50 rounded-xl p-4">
          <p className="text-xs text-gray-400 uppercase tracking-wide mb-1.5">Vêtements en cours</p>
          <p className="text-2xl font-semibold text-gray-900">{stats.vetementsEnCours}</p>
          <p className={`text-xs mt-1 ${stats.tendanceEnCours >= 0 ? 'text-green-600' : 'text-red-500'}`}>
            {stats.tendanceEnCours >= 0 ? '↑' : '↓'} {Math.abs(stats.tendanceEnCours)} vs hier
          </p>
        </div>

        <div className="bg-gray-50 rounded-xl p-4">
          <p className="text-xs text-gray-400 uppercase tracking-wide mb-1.5">Revenus du jour</p>
          <p className="text-2xl font-semibold text-gray-900">{formatMontant(stats.revenuJour)}</p>
          <p className={`text-xs mt-1 ${stats.tendanceJour >= 0 ? 'text-green-600' : 'text-red-500'}`}>
            {stats.tendanceJour >= 0 ? '↑' : '↓'} {Math.abs(stats.tendanceJour)}% vs hier
          </p>
        </div>

        <div className="bg-gray-50 rounded-xl p-4">
          <p className="text-xs text-gray-400 uppercase tracking-wide mb-1.5">Revenus semaine</p>
          <p className="text-2xl font-semibold text-gray-900">{formatMontant(stats.revenuSemaine)}</p>
          <p className={`text-xs mt-1 ${stats.tendanceSemaine >= 0 ? 'text-green-600' : 'text-red-500'}`}>
            {stats.tendanceSemaine >= 0 ? '↑' : '↓'} {Math.abs(stats.tendanceSemaine)}% vs sem. passée
          </p>
        </div>

        <div className="bg-gray-50 rounded-xl p-4">
          <p className="text-xs text-gray-400 uppercase tracking-wide mb-1.5">Prêts non récupérés</p>
          <p className="text-2xl font-semibold text-amber-600">{stats.pretNonRecuperes}</p>
          <p className="text-xs mt-1 text-gray-400">depuis plus de 24h</p>
        </div>
      </div>

      {/* Alerte vêtements prêts */}
      {stats.pretNonRecuperes > 0 && (
        <div className="flex items-center justify-between bg-green-50 border border-green-200 rounded-xl px-4 py-3 mb-3">
          <div className="flex items-center gap-2 text-sm text-green-800 font-medium">
            <span>✅</span>
            <span>{stats.pretNonRecuperes} vêtements prêts attendent d'être récupérés</span>
          </div>
          <button
            onClick={() => navigate('/vetements')}
            className="text-xs text-green-700 border border-green-300 bg-transparent rounded-lg px-3 py-1.5 hover:bg-green-100 transition"
          >
            Voir la liste →
          </button>
        </div>
      )}

      {/* Alerte stock */}
      {stats.alertesStock > 0 && (
        <div
          className="flex items-center justify-between bg-orange-50 border border-orange-200 rounded-xl px-4 py-3 mb-5 cursor-pointer hover:bg-orange-100 transition"
          onClick={() => navigate('/stock')}
        >
          <div className="flex items-center gap-2 text-sm text-orange-800 font-medium">
            <span>⚠️</span>
            <span>{stats.alertesStock} produits en stock faible ou épuisés</span>
          </div>
          <span className="text-xs text-orange-700">→ Gérer le stock</span>
        </div>
      )}

      {/* Graphique + Donut */}
      <div className="grid gap-4 mb-4" style={{ gridTemplateColumns: '3fr 2fr' }}>

        {/* Graphique revenus */}
        <div className="border border-gray-100 rounded-2xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-medium text-gray-800">Revenus</h2>
            <div className="flex gap-1 bg-gray-100 rounded-lg p-0.5">
              {(['sem', 'mois', 'an'] as Periode[]).map(p => (
                <button
                  key={p}
                  onClick={() => setPeriode(p)}
                  className={`text-xs px-3 py-1 rounded-md transition ${
                    periode === p
                      ? 'bg-white text-gray-900 font-medium shadow-sm'
                      : 'text-gray-400 hover:text-gray-600'
                  }`}
                >
                  {p === 'sem' ? 'Semaine' : p === 'mois' ? 'Mois' : 'Année'}
                </button>
              ))}
            </div>
          </div>
          <GraphiqueBarres donnees={donnees} />
        </div>

        {/* Donut statuts */}
        <div className="border border-gray-100 rounded-2xl p-5">
          <h2 className="text-sm font-medium text-gray-800 mb-4">Statuts des vêtements</h2>
          <DonutStatuts repartition={repartitionStatuts} />
        </div>
      </div>

      {/* Clients récents + Activité */}
      <div className="grid grid-cols-2 gap-4">

        {/* Clients récents */}
        <div className="border border-gray-100 rounded-2xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-medium text-gray-800">Clients récents</h2>
            <button
              onClick={() => navigate('/clients')}
              className="text-xs text-violet-600 hover:underline"
            >
              Voir tout →
            </button>
          </div>
          <div className="flex flex-col gap-3">
            {clientsRecents.map(client => (
              <div key={client.id} className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium flex-shrink-0 ${client.couleurAvatar}`}>
                  {client.initiales}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-800 truncate">{client.nom}</p>
                  <p className="text-xs text-gray-400">{client.telephone}</p>
                </div>
                <span className="text-xs bg-violet-50 text-violet-700 px-2 py-1 rounded-full whitespace-nowrap">
                  {client.nbVetements} vêt.
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Activité récente */}
        <div className="border border-gray-100 rounded-2xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-medium text-gray-800">Activité récente</h2>
            <button
              onClick={() => navigate('/statuts')}
              className="text-xs text-violet-600 hover:underline"
            >
              Voir tout →
            </button>
          </div>
          <div className="flex flex-col divide-y divide-gray-50">
            {activiteRecente.map(act => {
              const config = STATUT_CONFIG[act.statut];
              return (
                <div key={act.id} className="flex items-center gap-2.5 py-2.5">
                  <span className={`text-xs font-medium px-2 py-0.5 rounded-full whitespace-nowrap ${config.className}`}>
                    {config.label}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-gray-700 truncate">
                      {act.description} — {act.client}
                    </p>
                  </div>
                  <span className="text-xs text-gray-300 flex-shrink-0">{act.heure}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

    </div>
  );
}
