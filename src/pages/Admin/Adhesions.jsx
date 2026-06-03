import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import AdminLayout from '@components/admin/AdminLayout';
import { formatDateShort, formatPrice } from '@utils/formatters';

const API_URL = 'http://127.0.0.1:8000/api/v1';
const token   = () => localStorage.getItem('judcd_access_token');

const Icon = ({ path, className = 'w-5 h-5' }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d={path} />
  </svg>
);

const STATUS_CONFIG = {
  EN_ATTENTE: { label: 'En attente',  bg: '#FEF3C7', text: '#D97706', dot: '#D97706' },
  APPROUVEE:  { label: 'Approuvée',   bg: '#ECFDF5', text: '#059669', dot: '#059669' },
  REJETEE:    { label: 'Rejetée',     bg: '#FEF2F2', text: '#DC2626', dot: '#DC2626' },
  EXPIREE:    { label: 'Expirée',     bg: '#F3F4F6', text: '#6B7280', dot: '#6B7280' },
};

const StatusBadge = ({ status }) => {
  const cfg = STATUS_CONFIG[status] || STATUS_CONFIG.EXPIREE;
  return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold" style={{ backgroundColor: cfg.bg, color: cfg.text }}>
      <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ backgroundColor: cfg.dot }} />
      {cfg.label}
    </span>
  );
};

export default function Adhesions() {
  const [adhesions, setAdhesions]     = useState([]);
  const [stats, setStats]             = useState({});
  const [loading, setLoading]         = useState(true);
  const [error, setError]             = useState('');
  const [selected, setSelected]       = useState(null);
  const [showAction, setShowAction]   = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [adminComment, setAdminComment] = useState('');
  const [filter, setFilter]           = useState('TOUT');
  const [search, setSearch]           = useState('');

  useEffect(() => { loadData(); }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const h = { Authorization: `Bearer ${token()}` };
      const [ar, sr] = await Promise.all([
        fetch(`${API_URL}/admin/adhesions/`,             { headers: h }),
        fetch(`${API_URL}/admin/adhesions/statistiques/`, { headers: h }),
      ]);
      const ad = await ar.json(); if (ad.success) setAdhesions(ad.data || []);
      const sd = await sr.json(); if (sd.success) setStats(sd.data || {});
    } catch { setError('Erreur de connexion au serveur.'); }
    finally   { setLoading(false); }
  };

  const handleAction = async (action, commentaires = '') => {
    if (!selected) return;
    setActionLoading(true);
    try {
      const r = await fetch(`${API_URL}/admin/adhesions/${selected.id}/action/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token()}` },
        body: JSON.stringify({ action, commentaires }),
      });
      const data = await r.json();
      if (data.success) {
        loadData();
        setShowAction(false);
        setSelected(null);
        setAdminComment('');
      } else {
        setError(data.error?.detail || 'Erreur lors de l\'action.');
      }
    } catch { setError('Erreur de connexion.'); }
    finally   { setActionLoading(false); }
  };

  const filtered = adhesions.filter(a => {
    const matchFilter = filter === 'TOUT' || a.statut === filter;
    const matchSearch = !search ||
      a.nom.toLowerCase().includes(search.toLowerCase()) ||
      a.prenom.toLowerCase().includes(search.toLowerCase()) ||
      a.email.toLowerCase().includes(search.toLowerCase());
    return matchFilter && matchSearch;
  });

  const statCards = [
    { key: 'total_adhesions',     label: 'Total',      color: '#002060', bg: '#EEF2FF'  },
    { key: 'adhesions_en_attente',label: 'En attente', color: '#D97706', bg: '#FEF3C7'  },
    { key: 'adhesions_approuvees',label: 'Approuvées', color: '#059669', bg: '#ECFDF5'  },
    { key: 'adhesions_valides',   label: 'Valides',    color: '#7C3AED', bg: '#EDE9FE'  },
    { key: 'revenus_totaux',      label: 'Revenus',    color: '#DC2626', bg: '#FEF2F2', format: v => formatPrice(v) },
  ];

  return (
    <AdminLayout title="Adhésions">
      <Helmet><title>Adhésions — Administration JUDCD</title></Helmet>

      <div className="p-4 sm:p-6 space-y-5">

        {/* En-tête */}
        <div className="bg-white rounded-2xl border border-gray-100 px-6 py-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="font-heading font-bold text-xl text-gray-900">Gestion des adhésions</h1>
            <p className="text-sm text-gray-400 mt-0.5">{adhesions.length} dossier{adhesions.length !== 1 ? 's' : ''} · Cotisation 5 000 FCFA</p>
          </div>
          <button onClick={loadData} className="flex items-center gap-1.5 px-3 py-2 text-sm text-gray-500 hover:text-[#002060] border border-gray-200 rounded-xl transition-all">
            <Icon path="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" className="w-4 h-4" />
            Actualiser
          </button>
        </div>

        {/* Statistiques */}
        {!loading && Object.keys(stats).length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            {statCards.map(({ key, label, color, bg, format }) => (
              <div key={key} className="bg-white border border-gray-100 rounded-2xl p-4">
                <div className="w-8 h-8 rounded-xl flex items-center justify-center mb-3" style={{ backgroundColor: bg }}>
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: color }} />
                </div>
                <p className="font-heading font-extrabold text-xl text-gray-900">
                  {format ? format(stats[key] || 0) : (stats[key] || 0)}
                </p>
                <p className="text-xs text-gray-400 font-medium mt-0.5">{label}</p>
              </div>
            ))}
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-100 rounded-xl px-5 py-3.5 text-sm text-red-600 flex items-center justify-between">
            <span>{error}</span>
            <button onClick={() => setError('')} className="text-red-400 hover:text-red-600">
              <Icon path="M6 18L18 6M6 6l12 12" className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Filtres + recherche */}
        <div className="bg-white border border-gray-100 rounded-2xl px-5 py-4">
          <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
            <div className="flex flex-wrap gap-2">
              {['TOUT', 'EN_ATTENTE', 'APPROUVEE', 'REJETEE', 'EXPIREE'].map(s => {
                const cfg = s === 'TOUT' ? { label: 'Tout', color: '#002060', bg: '#EEF2FF' } : STATUS_CONFIG[s];
                const active = filter === s;
                return (
                  <button key={s} onClick={() => setFilter(s)}
                    className="px-3 py-1.5 rounded-full text-xs font-semibold transition-all"
                    style={active ? { backgroundColor: cfg.color || cfg.dot, color: '#fff' } : { backgroundColor: '#F3F4F6', color: '#6B7280' }}>
                    {cfg.label || 'Tout'}
                    {s !== 'TOUT' && <span className="ml-1 opacity-70">({adhesions.filter(a => a.statut === s).length})</span>}
                  </button>
                );
              })}
            </div>
            <div className="relative">
              <Icon path="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" className="w-4 h-4 text-gray-300 absolute left-3 top-1/2 -translate-y-1/2" />
              <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Rechercher..."
                className="pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:border-[#002060]/30 w-52 transition-all" />
            </div>
          </div>
        </div>

        {/* Tableau */}
        <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden">
          {loading ? (
            <div className="p-6 space-y-3">
              {[1,2,3,4].map(i => (
                <div key={i} className="animate-pulse flex items-center gap-4 py-2">
                  <div className="w-9 h-9 bg-gray-100 rounded-full flex-shrink-0" />
                  <div className="flex-1 space-y-1.5">
                    <div className="h-3.5 bg-gray-100 rounded w-40" />
                    <div className="h-3 bg-gray-100 rounded w-28" />
                  </div>
                  <div className="w-20 h-6 bg-gray-100 rounded-full" />
                  <div className="w-16 h-3 bg-gray-100 rounded" />
                </div>
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="py-20 text-center">
              <div className="w-14 h-14 bg-gray-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Icon path="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" className="w-6 h-6 text-gray-300" />
              </div>
              <p className="text-sm font-medium text-gray-400">
                {search || filter !== 'TOUT' ? 'Aucun résultat pour ce filtre.' : 'Aucune demande d\'adhésion.'}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-50">
                    {['Membre', 'Contact', 'Date', 'Statut', 'Montant', 'Actions'].map(h => (
                      <th key={h} className="px-5 py-3.5 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {filtered.map((a, i) => (
                    <motion.tr key={a.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.03 }}
                      className="hover:bg-gray-50/60 transition-colors">
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#002060] to-[#008751] flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                            {(a.prenom || '?').charAt(0).toUpperCase()}
                          </div>
                          <div className="min-w-0">
                            <p className="text-sm font-semibold text-gray-900 truncate">{a.prenom} {a.nom}</p>
                            <p className="text-xs text-gray-400 truncate">{a.profession}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <p className="text-sm text-gray-600 truncate max-w-[160px]">{a.email}</p>
                        <p className="text-xs text-gray-400">{a.telephone}</p>
                      </td>
                      <td className="px-5 py-4 text-sm text-gray-400 whitespace-nowrap">
                        {formatDateShort(a.date_demande)}
                      </td>
                      <td className="px-5 py-4">
                        <StatusBadge status={a.statut} />
                      </td>
                      <td className="px-5 py-4">
                        <span className="text-sm font-semibold text-[#008751]">{formatPrice(parseFloat(a.montant_paye || 5000))}</span>
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-1">
                          <button onClick={() => setSelected(a)} className="px-2.5 py-1.5 text-xs font-semibold text-[#002060] bg-[#EEF2FF] hover:bg-[#002060] hover:text-white rounded-lg transition-all">
                            Voir
                          </button>
                          {a.statut === 'EN_ATTENTE' && (
                            <button onClick={() => { setSelected(a); setShowAction(true); }} className="px-2.5 py-1.5 text-xs font-semibold text-[#059669] bg-[#ECFDF5] hover:bg-[#059669] hover:text-white rounded-lg transition-all">
                              Traiter
                            </button>
                          )}
                          {a.statut === 'APPROUVEE' && (a.jours_restants || 0) < 30 && (
                            <button onClick={() => handleAction('RENOUVELER', '')} className="px-2.5 py-1.5 text-xs font-semibold text-[#7C3AED] bg-[#EDE9FE] hover:bg-[#7C3AED] hover:text-white rounded-lg transition-all">
                              Renouveler
                            </button>
                          )}
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Panneau détail */}
      <AnimatePresence>
        {selected && !showAction && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setSelected(null)}>
            <motion.div initial={{ scale: 0.96, y: 16 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.96 }}
              className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl" onClick={e => e.stopPropagation()}>
              <div className="p-6">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#002060] to-[#008751] flex items-center justify-center text-white font-bold text-lg">
                      {(selected.prenom || '?').charAt(0)}
                    </div>
                    <div>
                      <h2 className="font-bold text-lg text-gray-900">{selected.prenom} {selected.nom}</h2>
                      <StatusBadge status={selected.statut} />
                    </div>
                  </div>
                  <button onClick={() => setSelected(null)} className="w-8 h-8 rounded-lg hover:bg-gray-100 flex items-center justify-center text-gray-400">
                    <Icon path="M6 18L18 6M6 6l12 12" className="w-4 h-4" />
                  </button>
                </div>

                {/* Infos */}
                <div className="grid grid-cols-2 gap-4 mb-5">
                  {[
                    { label: 'Email',        val: selected.email },
                    { label: 'Téléphone',    val: selected.telephone },
                    { label: 'Profession',   val: selected.profession },
                    { label: 'Date de naissance', val: selected.date_naissance },
                    { label: 'Lieu de naissance', val: selected.lieu_naissance },
                    { label: 'Date demande', val: formatDateShort(selected.date_demande) },
                    { label: 'Montant payé', val: formatPrice(parseFloat(selected.montant_paye || 5000)) },
                    { label: 'Référence',    val: selected.reference_paiement || '—' },
                  ].map(({ label, val }) => (
                    <div key={label}>
                      <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-0.5">{label}</p>
                      <p className="text-sm text-gray-800 font-medium">{val || '—'}</p>
                    </div>
                  ))}
                </div>

                <div className="mb-4">
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">Adresse</p>
                  <p className="text-sm text-gray-700">{selected.adresse}</p>
                </div>

                <div className="mb-4 bg-gray-50 rounded-xl p-4">
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">Motivations</p>
                  <p className="text-sm text-gray-700 leading-relaxed">{selected.motivations}</p>
                </div>

                {selected.competences && (
                  <div className="mb-4">
                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">Compétences</p>
                    <p className="text-sm text-gray-700">{selected.competences}</p>
                  </div>
                )}

                {selected.capture_depot && (
                  <div className="mb-5">
                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">Preuve de paiement</p>
                    <img src={selected.capture_depot} alt="Preuve" className="w-full max-w-sm rounded-xl border border-gray-200" />
                  </div>
                )}

                {/* Actions */}
                {selected.statut === 'EN_ATTENTE' && (
                  <div className="flex gap-3 pt-4 border-t border-gray-100">
                    <button
                      onClick={() => setShowAction(true)}
                      className="flex-1 py-2.5 bg-[#059669] text-white font-semibold text-sm rounded-xl hover:bg-[#047857] transition-all">
                      Approuver
                    </button>
                    <button
                      onClick={() => handleAction('REJETER', '')}
                      disabled={actionLoading}
                      className="flex-1 py-2.5 bg-red-50 text-red-600 font-semibold text-sm rounded-xl hover:bg-red-100 disabled:opacity-50 transition-all">
                      Rejeter
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modal approbation */}
      <AnimatePresence>
        {showAction && selected && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setShowAction(false)}>
            <motion.div initial={{ scale: 0.96 }} animate={{ scale: 1 }} exit={{ scale: 0.96 }}
              className="bg-white rounded-2xl w-full max-w-md shadow-2xl" onClick={e => e.stopPropagation()}>
              <div className="p-6">
                <div className="w-12 h-12 bg-[#ECFDF5] rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Icon path="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" className="w-6 h-6 text-[#059669]" />
                </div>
                <h3 className="font-bold text-lg text-center text-gray-900 mb-1">Approuver l'adhésion</h3>
                <p className="text-sm text-center text-gray-400 mb-5">
                  {selected.prenom} {selected.nom} sera notifié par email.
                </p>
                <div className="mb-5">
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Commentaire (optionnel)</label>
                  <textarea value={adminComment} onChange={e => setAdminComment(e.target.value)} rows={3}
                    placeholder="Message à transmettre au membre..."
                    className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none resize-none" />
                </div>
                <div className="flex gap-3">
                  <button onClick={() => setShowAction(false)} className="flex-1 py-2.5 border border-gray-200 rounded-xl text-sm font-semibold text-gray-600">Annuler</button>
                  <button onClick={() => handleAction('APPROUVER', adminComment)} disabled={actionLoading}
                    className="flex-1 py-2.5 bg-[#059669] text-white rounded-xl text-sm font-semibold hover:bg-[#047857] disabled:opacity-50 transition-all">
                    {actionLoading ? 'Traitement...' : 'Confirmer l\'approbation'}
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </AdminLayout>
  );
}
