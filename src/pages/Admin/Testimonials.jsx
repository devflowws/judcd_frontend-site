import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import toast from 'react-hot-toast';
import { get, post, put, del } from '@services/api';
import { API } from '@utils/constants';
import AdminLayout from '@components/admin/AdminLayout';

const Icon = ({ path, className = 'w-5 h-5' }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d={path} />
  </svg>
);

const Stars = ({ value, onChange }) => (
  <div className="flex gap-1">
    {[1,2,3,4,5].map(i => (
      <button key={i} type="button"
        onClick={() => onChange && onChange(i)}
        className={`text-xl transition-transform hover:scale-110 ${i <= value ? 'text-[#FFD100]' : 'text-gray-200'} ${onChange ? 'cursor-pointer' : 'cursor-default'}`}>
        ★
      </button>
    ))}
  </div>
);

const EMPTY = { nom: '', titre: '', message: '', note: 5 };

export default function AdminTestimonials() {
  const [items, setItems]         = useState([]);
  const [loading, setLoading]     = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing]     = useState(null);
  const [form, setForm]           = useState(EMPTY);
  const [saving, setSaving]       = useState(false);
  const [confirmId, setConfirmId] = useState(null);

  useEffect(() => { load(); }, []);

  const load = async () => {
    setLoading(true);
    const res = await get(API.endpoints.admin.temoignages);
    setItems(res?.data?.results || res?.data || []);
    setLoading(false);
  };

  const openCreate = () => { setEditing(null); setForm(EMPTY); setShowModal(true); };
  const openEdit   = (t) => { setEditing(t); setForm({ nom: t.nom || '', titre: t.titre || '', message: t.message || '', note: t.note || 5 }); setShowModal(true); };

  const handleSubmit = async (e) => {
    e.preventDefault(); setSaving(true);
    try {
      const res = editing ? await put(`${API.endpoints.admin.temoignages}${editing.id}/`, form) : await post(API.endpoints.admin.temoignages, form);
      res.success ? (toast.success(editing ? 'Modifié.' : 'Ajouté.'), setShowModal(false), load()) : toast.error(JSON.stringify(res.error) || 'Erreur.');
    } finally { setSaving(false); }
  };

  const handleDelete = async (id) => {
    const res = await del(`${API.endpoints.admin.temoignages}${id}/`);
    res.success ? (toast.success('Supprimé.'), load()) : toast.error('Erreur.');
    setConfirmId(null);
  };

  return (
    <AdminLayout title="Témoignages">
      <Helmet><title>Témoignages — Administration JUDCD</title></Helmet>
      <div className="p-4 sm:p-6 space-y-5">

        <div className="bg-white rounded-2xl border border-gray-100 px-6 py-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="font-heading font-bold text-xl text-gray-900">Témoignages</h1>
            <p className="text-sm text-gray-400 mt-0.5">{items.length} témoignage{items.length !== 1 ? 's' : ''}</p>
          </div>
          <button onClick={openCreate} className="flex items-center gap-2 px-4 py-2.5 bg-[#6D28D9] text-white text-sm font-semibold rounded-xl hover:bg-[#5B21B6] transition-all shadow-sm">
            <Icon path="M12 4v16m8-8H4" className="w-4 h-4" />
            Ajouter un témoignage
          </button>
        </div>

        {loading ? (
          <div className="space-y-3">
            {[1,2,3].map(i => <div key={i} className="bg-white rounded-2xl border border-gray-100 p-5 h-24 animate-pulse" />)}
          </div>
        ) : items.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-100 py-20 text-center">
            <div className="w-14 h-14 bg-gray-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Icon path="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" className="w-6 h-6 text-gray-300" />
            </div>
            <p className="text-sm font-medium text-gray-400">Aucun témoignage.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {items.map((t, i) => (
              <motion.div key={t.id} layout initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                className="bg-white rounded-2xl border border-gray-100 hover:border-gray-200 transition-all p-5 flex gap-5">
                {/* Avatar */}
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#6D28D9] to-[#0284C7] flex items-center justify-center text-white font-bold text-sm flex-shrink-0 mt-0.5">
                  {(t.nom || '?').charAt(0).toUpperCase()}
                </div>

                {/* Contenu */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="font-semibold text-gray-900">{t.nom}</p>
                        {t.titre && <span className="text-xs text-[#6D28D9] font-medium px-2 py-0.5 bg-[#6D28D9]/10 rounded-full">{t.titre}</span>}
                      </div>
                      <Stars value={t.note || 5} />
                    </div>
                    <div className="flex gap-1 flex-shrink-0">
                      <button onClick={() => openEdit(t)} className="w-8 h-8 rounded-lg hover:bg-gray-100 flex items-center justify-center text-gray-400 hover:text-[#6D28D9] transition-colors">
                        <Icon path="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" className="w-3.5 h-3.5" />
                      </button>
                      <button onClick={() => setConfirmId(t.id)} className="w-8 h-8 rounded-lg hover:bg-red-50 flex items-center justify-center text-gray-400 hover:text-red-500 transition-colors">
                        <Icon path="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                  <p className="text-sm text-gray-500 mt-2 line-clamp-2 leading-relaxed">"{t.message}"</p>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      <AnimatePresence>
        {showModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setShowModal(false)}>
            <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }}
              className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl" onClick={e => e.stopPropagation()}>
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="font-bold text-xl text-gray-900">{editing ? 'Modifier' : 'Ajouter'} un témoignage</h2>
                  <button onClick={() => setShowModal(false)} className="w-8 h-8 rounded-lg hover:bg-gray-100 flex items-center justify-center text-gray-400">
                    <Icon path="M6 18L18 6M6 6l12 12" className="w-4 h-4" />
                  </button>
                </div>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">Nom *</label>
                    <input required value={form.nom} onChange={e => setForm(f => ({ ...f, nom: e.target.value }))}
                      className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#6D28D9]/50 focus:ring-2 focus:ring-[#6D28D9]/10 transition-all" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">Titre / Rôle</label>
                    <input value={form.titre} onChange={e => setForm(f => ({ ...f, titre: e.target.value }))}
                      className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#6D28D9]/50 transition-all" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">Témoignage *</label>
                    <textarea required value={form.message} onChange={e => setForm(f => ({ ...f, message: e.target.value }))} rows={4}
                      className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#6D28D9]/50 resize-none" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Note — {form.note}/5</label>
                    <Stars value={form.note} onChange={v => setForm(f => ({ ...f, note: v }))} />
                  </div>
                  <div className="flex gap-3 pt-1">
                    <button type="button" onClick={() => setShowModal(false)} className="flex-1 py-2.5 border border-gray-200 rounded-xl text-sm font-semibold text-gray-600">Annuler</button>
                    <button type="submit" disabled={saving} className="flex-1 py-2.5 bg-[#6D28D9] text-white rounded-xl text-sm font-semibold hover:bg-[#5B21B6] disabled:opacity-50">
                      {saving ? 'Enregistrement...' : 'Enregistrer'}
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {confirmId && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setConfirmId(null)}>
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-2xl" onClick={e => e.stopPropagation()}>
            <div className="w-12 h-12 bg-red-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Icon path="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" className="w-6 h-6 text-red-500" />
            </div>
            <h3 className="font-bold text-lg text-center text-gray-900 mb-2">Supprimer ce témoignage</h3>
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
