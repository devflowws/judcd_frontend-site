import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { useParams, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { get, post, put, del } from '@services/api';
import { API } from '@utils/constants';
import AdminLayout from '@components/admin/AdminLayout';

const Icon = ({ path, className = 'w-5 h-5' }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d={path} />
  </svg>
);

const CONFIG = {
  partenaires: {
    title: 'Types de partenaires',
    subtitle: 'Catégoriser vos partenaires',
    endpoint: API.endpoints.admin.typesPartenaires,
    accent: '#0284C7',
    bg: '#EFF6FF',
    back: '/admin/partenaires',
    backLabel: 'Partenaires',
    placeholder: 'Ex: Entreprise privée, ONG, Fondation...',
  },
  actualites: {
    title: "Types d'actualités",
    subtitle: 'Catégoriser vos articles',
    endpoint: API.endpoints.admin.typesActualite,
    accent: '#002060',
    bg: '#EEF2FF',
    back: '/admin/blog',
    backLabel: 'Actualités',
    placeholder: 'Ex: Actualité, Événement, Rapport...',
  },
  actions: {
    title: "Types d'actions",
    subtitle: 'Catégoriser vos actions communautaires',
    endpoint: API.endpoints.admin.typesAction,
    accent: '#059669',
    bg: '#ECFDF5',
    back: '/admin/actions',
    backLabel: 'Actions',
    placeholder: 'Ex: Formation, Sensibilisation, Projet...',
  },
};

export default function AdminTypes() {
  const { category } = useParams(); // 'partenaires' | 'actualites' | 'actions'
  const cfg = CONFIG[category];

  const [items, setItems]         = useState([]);
  const [loading, setLoading]     = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing]     = useState(null);
  const [nom, setNom]             = useState('');
  const [saving, setSaving]       = useState(false);
  const [confirmId, setConfirmId] = useState(null);

  useEffect(() => { if (cfg) load(); }, [category]);

  const load = async () => {
    setLoading(true);
    const res = await get(cfg.endpoint);
    setItems(res?.data?.results || res?.data || []);
    setLoading(false);
  };

  const openCreate = () => { setEditing(null); setNom(''); setShowModal(true); };
  const openEdit = (t) => { setEditing(t); setNom(t.nom); setShowModal(true); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!nom.trim()) return;
    setSaving(true);
    try {
      const res = editing
        ? await put(`${cfg.endpoint}${editing.id}/`, { nom: nom.trim() })
        : await post(cfg.endpoint, { nom: nom.trim() });
      if (res.success) {
        toast.success(editing ? 'Type modifié.' : 'Type créé.');
        setShowModal(false);
        load();
      } else {
        toast.error(JSON.stringify(res.error) || 'Erreur.');
      }
    } finally { setSaving(false); }
  };

  const handleDelete = async (id) => {
    const res = await del(`${cfg.endpoint}${id}/`);
    res.success ? (toast.success('Type supprimé.'), load()) : toast.error('Impossible de supprimer — des éléments y sont liés.');
    setConfirmId(null);
  };

  if (!cfg) return (
    <AdminLayout title="Types">
      <div className="p-6 text-center text-gray-400">Catégorie inconnue.</div>
    </AdminLayout>
  );

  return (
    <AdminLayout title={cfg.title}>
      <Helmet><title>{cfg.title} — Administration JUDCD</title></Helmet>
      <div className="p-4 sm:p-6 space-y-5">

        {/* En-tête */}
        <div className="bg-white rounded-2xl border border-gray-100 px-6 py-5">
          <div className="flex items-center gap-3 mb-4">
            <Link to={cfg.back} className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-gray-600 transition-colors">
              <Icon path="M15 19l-7-7 7-7" className="w-4 h-4" />
              {cfg.backLabel}
            </Link>
            <span className="text-gray-200">/</span>
            <span className="text-sm font-medium text-gray-600">Types</span>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="font-heading font-bold text-xl text-gray-900">{cfg.title}</h1>
              <p className="text-sm text-gray-400 mt-0.5">{items.length} type{items.length !== 1 ? 's' : ''} · {cfg.subtitle}</p>
            </div>
            <button onClick={openCreate}
              className="flex items-center gap-2 px-4 py-2.5 text-white text-sm font-semibold rounded-xl transition-all shadow-sm"
              style={{ backgroundColor: cfg.accent }}>
              <Icon path="M12 4v16m8-8H4" className="w-4 h-4" />
              Nouveau type
            </button>
          </div>
        </div>

        {/* Notice */}
        <div className="bg-amber-50 border border-amber-200 rounded-xl px-5 py-3.5 text-sm text-amber-700 flex items-start gap-3">
          <Icon path="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" className="w-4 h-4 flex-shrink-0 mt-0.5" />
          <span>Supprimer un type supprimera aussi les éléments qui y sont associés. Les 3 types par défaut peuvent être renommés ou supprimés.</span>
        </div>

        {/* Liste */}
        {loading ? (
          <div className="bg-white rounded-2xl border border-gray-100 p-6 space-y-3">
            {[1,2,3].map(i => <div key={i} className="h-12 bg-gray-100 rounded-xl animate-pulse" />)}
          </div>
        ) : items.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-100 py-16 text-center">
            <div className="w-14 h-14 bg-gray-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Icon path="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" className="w-6 h-6 text-gray-300" />
            </div>
            <p className="text-sm font-medium text-gray-400">Aucun type. Créez le premier.</p>
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
            <div className="divide-y divide-gray-50">
              {items.map((t, i) => (
                <motion.div key={t.id} layout initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.04 }}
                  className="flex items-center justify-between px-5 py-4 hover:bg-gray-50/60 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ backgroundColor: cfg.bg }}>
                      <Icon path="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" className="w-4 h-4" style={{ color: cfg.accent }} />
                    </div>
                    <span className="font-medium text-gray-800">{t.nom}</span>
                  </div>
                  <div className="flex gap-1">
                    <button onClick={() => openEdit(t)} className="w-8 h-8 rounded-lg hover:bg-gray-100 flex items-center justify-center text-gray-400 hover:text-gray-600 transition-colors">
                      <Icon path="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" className="w-3.5 h-3.5" />
                    </button>
                    <button onClick={() => setConfirmId(t.id)} className="w-8 h-8 rounded-lg hover:bg-red-50 flex items-center justify-center text-gray-400 hover:text-red-500 transition-colors">
                      <Icon path="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setShowModal(false)}>
            <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }}
              className="bg-white rounded-2xl w-full max-w-sm shadow-2xl" onClick={e => e.stopPropagation()}>
              <div className="p-6">
                <div className="flex items-center justify-between mb-5">
                  <h2 className="font-bold text-lg text-gray-900">{editing ? 'Renommer' : 'Nouveau'} type</h2>
                  <button onClick={() => setShowModal(false)} className="w-8 h-8 rounded-lg hover:bg-gray-100 flex items-center justify-center text-gray-400">
                    <Icon path="M6 18L18 6M6 6l12 12" className="w-4 h-4" />
                  </button>
                </div>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">Nom du type *</label>
                    <input autoFocus required value={nom} onChange={e => setNom(e.target.value)}
                      placeholder={cfg.placeholder}
                      className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 transition-all"
                      style={{ '--tw-ring-color': cfg.accent + '30', outlineColor: cfg.accent }} />
                  </div>
                  <div className="flex gap-3">
                    <button type="button" onClick={() => setShowModal(false)} className="flex-1 py-2.5 border border-gray-200 rounded-xl text-sm font-semibold text-gray-600">Annuler</button>
                    <button type="submit" disabled={saving} className="flex-1 py-2.5 text-white rounded-xl text-sm font-semibold disabled:opacity-50 transition-all"
                      style={{ backgroundColor: cfg.accent }}>
                      {saving ? 'Enregistrement...' : 'Enregistrer'}
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Confirm */}
      {confirmId && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setConfirmId(null)}>
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-2xl" onClick={e => e.stopPropagation()}>
            <div className="w-12 h-12 bg-red-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Icon path="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" className="w-6 h-6 text-red-500" />
            </div>
            <h3 className="font-bold text-lg text-center text-gray-900 mb-2">Supprimer ce type</h3>
            <p className="text-sm text-gray-400 text-center mb-6">Attention : les éléments associés seront également supprimés.</p>
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
