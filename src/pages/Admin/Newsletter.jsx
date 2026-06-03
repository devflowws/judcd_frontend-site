import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import toast from 'react-hot-toast';
import { get, del } from '@services/api';
import { API } from '@utils/constants';
import AdminLayout from '@components/admin/AdminLayout';

const Icon = ({ path, className = 'w-5 h-5' }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d={path} />
  </svg>
);

export default function AdminNewsletter() {
  const [subs, setSubs]       = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch]   = useState('');
  const [confirmId, setConfirmId] = useState(null);

  useEffect(() => { load(); }, []);

  const load = async () => {
    setLoading(true);
    const res = await get(API.endpoints.admin.newsletter);
    if (res.success) {
      const body = res.data;
      setSubs(Array.isArray(body) ? body : (body?.results ?? []));
    }
    setLoading(false);
  };

  const handleDelete = async (id) => {
    const res = await del(`${API.endpoints.admin.newsletter}${id}/`);
    res.success ? (toast.success('Abonné supprimé.'), setSubs(prev => prev.filter(s => s.id !== id))) : toast.error('Erreur.');
    setConfirmId(null);
  };

  const exportCSV = () => {
    const rows = ['Email', ...subs.map(s => s.email)].join('\n');
    const blob = new Blob([rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = 'newsletter_judcd.csv'; a.click();
    URL.revokeObjectURL(url);
    toast.success('Liste exportée.');
  };

  const filtered = subs.filter(s => !search || (s.email || '').toLowerCase().includes(search.toLowerCase()));

  return (
    <AdminLayout title="Newsletter">
      <Helmet><title>Newsletter — Administration JUDCD</title></Helmet>
      <div className="p-4 sm:p-6 space-y-5">

        <div className="bg-white rounded-2xl border border-gray-100 px-6 py-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="font-heading font-bold text-xl text-gray-900">Abonnés à la newsletter</h1>
            <p className="text-sm text-gray-400 mt-0.5">{subs.length} inscrit{subs.length !== 1 ? 's' : ''}</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative">
              <Icon path="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" className="w-4 h-4 text-gray-300 absolute left-3 top-1/2 -translate-y-1/2" />
              <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Rechercher..."
                className="pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:border-[#008751]/30 w-44 transition-all" />
            </div>
            {subs.length > 0 && (
              <button onClick={exportCSV} className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-white bg-[#008751] rounded-xl hover:bg-[#006B41] transition-all">
                <Icon path="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" className="w-4 h-4" />
                Exporter
              </button>
            )}
          </div>
        </div>

        <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden">
          {loading ? (
            <div className="p-6 space-y-3">
              {[1,2,3,4].map(i => <div key={i} className="h-12 bg-gray-50 rounded-xl animate-pulse" />)}
            </div>
          ) : filtered.length === 0 ? (
            <div className="py-20 text-center">
              <div className="w-14 h-14 bg-gray-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Icon path="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" className="w-6 h-6 text-gray-300" />
              </div>
              <p className="text-sm font-medium text-gray-400">{search ? 'Aucun résultat' : 'Aucun abonné pour le moment'}</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-50">
              {filtered.map((s, i) => (
                <motion.div key={s.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.03 }}
                  className="flex items-center justify-between px-5 py-3.5 hover:bg-gray-50/60 transition-colors">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-9 h-9 rounded-full bg-[#008751]/10 flex items-center justify-center flex-shrink-0">
                      <Icon path="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" className="w-4 h-4 text-[#008751]" />
                    </div>
                    <span className="text-sm font-medium text-gray-700 truncate">{s.email}</span>
                  </div>
                  <button onClick={() => setConfirmId(s.id)} className="p-1.5 rounded-lg text-gray-300 hover:text-red-500 hover:bg-red-50 transition-all flex-shrink-0">
                    <Icon path="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" className="w-4 h-4" />
                  </button>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>

      {confirmId && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setConfirmId(null)}>
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-2xl" onClick={e => e.stopPropagation()}>
            <div className="w-12 h-12 bg-red-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Icon path="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" className="w-6 h-6 text-red-500" />
            </div>
            <h3 className="font-bold text-lg text-center text-gray-900 mb-2">Supprimer cet abonné</h3>
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
