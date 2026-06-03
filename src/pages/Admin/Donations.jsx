import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { donationService } from '@services/judcdService';
import AdminLayout from '@components/admin/AdminLayout';
import { formatPrice, formatDateShort } from '@utils/formatters';

const Icon = ({ path, className = 'w-5 h-5' }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d={path} />
  </svg>
);

const Stat = ({ label, value, accent }) => (
  <div className="bg-white border border-gray-100 rounded-2xl px-5 py-4 flex items-center gap-4">
    <div className="flex-1 min-w-0">
      <p className="text-sm text-gray-400 font-medium">{label}</p>
      <p className="font-heading font-extrabold text-xl text-gray-900 mt-0.5 truncate">{value}</p>
    </div>
    <div className="w-1 h-10 rounded-full flex-shrink-0" style={{ backgroundColor: accent }} />
  </div>
);

export default function AdminDonations() {
  const [donations, setDonations] = useState([]);
  const [loading, setLoading]     = useState(true);
  const [error, setError]         = useState('');
  const [search, setSearch]       = useState('');
  const [confirmId, setConfirmId] = useState(null);

  useEffect(() => { load(); }, []);

  const load = async () => {
    setLoading(true);
    const res = await donationService.getDonations();
    if (res.success) {
      const body = res.data;
      setDonations(Array.isArray(body) ? body : (body?.results ?? []));
    } else {
      setError('Impossible de charger les dons.');
    }
    setLoading(false);
  };

  const handleDelete = async (id) => {
    const res = await donationService.deleteDonation(id);
    if (res.success) setDonations(prev => prev.filter(d => d.id !== id));
    setConfirmId(null);
  };

  const filtered = donations.filter(d =>
    !search ||
    (d.nom || '').toLowerCase().includes(search.toLowerCase()) ||
    (d.email || '').toLowerCase().includes(search.toLowerCase())
  );

  const total      = donations.reduce((s, d) => s + parseFloat(d.montant || 0), 0);
  const avg        = donations.length ? total / donations.length : 0;
  const maxDon     = donations.length ? Math.max(...donations.map(d => parseFloat(d.montant || 0))) : 0;

  return (
    <AdminLayout title="Dons">
      <Helmet><title>Dons — Administration JUDCD</title></Helmet>

      <div className="p-4 sm:p-6 space-y-5">

        {/* En-tête */}
        <div className="bg-white rounded-2xl border border-gray-100 px-6 py-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="font-heading font-bold text-xl text-gray-900">Dons reçus</h1>
            <p className="text-sm text-gray-400 mt-0.5">{donations.length} don{donations.length !== 1 ? 's' : ''} enregistré{donations.length !== 1 ? 's' : ''}</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative">
              <Icon path="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" className="w-4 h-4 text-gray-300 absolute left-3 top-1/2 -translate-y-1/2" />
              <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Rechercher..."
                className="pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:border-[#DC2626]/50 w-44 transition-all" />
            </div>
            <button onClick={load} className="flex items-center gap-1.5 px-3 py-2 text-sm text-gray-500 hover:text-[#DC2626] border border-gray-200 rounded-xl transition-all">
              <Icon path="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" className="w-4 h-4" />
              Actualiser
            </button>
          </div>
        </div>

        {/* Stats */}
        {!loading && donations.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Stat label="Total collecté"  value={formatPrice(total)}   accent="#DC2626" />
            <Stat label="Don moyen"       value={formatPrice(avg)}     accent="#D97706" />
            <Stat label="Don le plus élevé" value={formatPrice(maxDon)} accent="#008751" />
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-100 rounded-xl px-5 py-3.5 text-sm text-red-600 flex items-center justify-between">
            <span>{error}</span>
            <button onClick={load} className="font-semibold underline">Réessayer</button>
          </div>
        )}

        {/* Tableau */}
        <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden">
          {loading ? (
            <div className="p-6 space-y-3">
              {[1,2,3,4].map(i => (
                <div key={i} className="animate-pulse flex items-center gap-4 py-3 border-b border-gray-50">
                  <div className="flex-1 h-4 bg-gray-100 rounded" />
                  <div className="w-24 h-4 bg-gray-100 rounded" />
                  <div className="w-20 h-4 bg-gray-100 rounded" />
                  <div className="w-16 h-4 bg-gray-100 rounded" />
                </div>
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="py-20 text-center">
              <div className="w-14 h-14 bg-gray-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Icon path="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" className="w-6 h-6 text-gray-300" />
              </div>
              <p className="text-sm font-medium text-gray-400">{search ? 'Aucun résultat' : 'Aucun don reçu'}</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-50">
                    {['Donateur', 'Montant', 'Moyen de paiement', 'Date', ''].map(h => (
                      <th key={h} className="px-5 py-3.5 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {filtered.map((d, i) => (
                    <motion.tr
                      key={d.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: i * 0.03 }}
                      className="hover:bg-gray-50/60 transition-colors"
                    >
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#DC2626] to-[#D97706] flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                            {(d.nom || '?').charAt(0).toUpperCase()}
                          </div>
                          <div className="min-w-0">
                            <p className="text-sm font-semibold text-gray-900 truncate">{d.nom || 'Anonyme'}</p>
                            <p className="text-xs text-gray-400 truncate">{d.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <span className="font-heading font-bold text-[#008751] text-base">
                          {formatPrice(parseFloat(d.montant || 0))}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <span className="inline-flex items-center px-2.5 py-1 rounded-lg bg-gray-100 text-xs font-medium text-gray-600">
                          {d.moyen_paiement || '—'}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <span className="text-sm text-gray-400">{formatDateShort(d.created_at)}</span>
                      </td>
                      <td className="px-5 py-4 text-right">
                        <button
                          onClick={() => setConfirmId(d.id)}
                          className="p-1.5 rounded-lg text-gray-300 hover:text-red-500 hover:bg-red-50 transition-all"
                        >
                          <Icon path="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" className="w-4 h-4" />
                        </button>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Confirm delete */}
      {confirmId && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setConfirmId(null)}>
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-2xl" onClick={e => e.stopPropagation()}>
            <div className="w-12 h-12 bg-red-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Icon path="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" className="w-6 h-6 text-red-500" />
            </div>
            <h3 className="font-bold text-lg text-center text-gray-900 mb-2">Supprimer ce don</h3>
            <p className="text-sm text-gray-400 text-center mb-6">Cette action est irréversible.</p>
            <div className="flex gap-3">
              <button onClick={() => setConfirmId(null)} className="flex-1 py-2.5 border border-gray-200 rounded-xl text-sm font-semibold text-gray-600">Annuler</button>
              <button onClick={() => handleDelete(confirmId)} className="flex-1 py-2.5 bg-red-500 text-white rounded-xl text-sm font-semibold hover:bg-red-600">Supprimer</button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
