import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { get, post, put, del, upload } from '@services/api';
import { API } from '@utils/constants';
import AdminLayout from '@components/admin/AdminLayout';

const Icon = ({ path, className = 'w-5 h-5' }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d={path} />
  </svg>
);

const EMPTY = { nom: '', description: '', lien: '', type_partenaire: '' };

export default function AdminPartners() {
  const [partners, setPartners]   = useState([]);
  const [types, setTypes]         = useState([]);
  const [loading, setLoading]     = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing]     = useState(null);
  const [form, setForm]           = useState(EMPTY);
  const [logoFile, setLogoFile]   = useState(null);
  const [preview, setPreview]     = useState(null);
  const [saving, setSaving]       = useState(false);
  const [confirmId, setConfirmId] = useState(null);

  useEffect(() => { loadAll(); }, []);

  const loadAll = async () => {
    setLoading(true);
    const [pRes, tRes] = await Promise.all([get(API.endpoints.admin.partenaires), get(API.endpoints.admin.typesPartenaires)]);
    setPartners(pRes?.data?.results || pRes?.data || []);
    setTypes(tRes?.data?.results || tRes?.data || []);
    setLoading(false);
  };

  const onLogo = (e) => {
    const f = e.target.files[0]; if (!f) return;
    setLogoFile(f);
    const r = new FileReader(); r.onloadend = () => setPreview(r.result); r.readAsDataURL(f);
  };

  const openCreate = () => { setEditing(null); setForm(EMPTY); setLogoFile(null); setPreview(null); setShowModal(true); };
  const openEdit = (p) => {
    setEditing(p);
    setForm({ nom: p.nom || '', description: p.description || '', lien: p.lien || '', type_partenaire: p.type_partenaire || '' });
    setLogoFile(null); setPreview(p.logo || null); setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); setSaving(true);
    try {
      // Retire les champs vides (évite l'erreur DRF sur une FK vide)
      const clean = Object.fromEntries(Object.entries(form).filter(([, v]) => v !== '' && v !== null && v !== undefined));
      if (logoFile) {
        const fd = new FormData();
        Object.entries(clean).forEach(([k, v]) => fd.append(k, v));
        fd.append('logo', logoFile);
        const res = editing
          ? await upload(`${API.endpoints.admin.partenaires}${editing.id}/`, fd, null, 'patch')
          : await upload(API.endpoints.admin.partenaires, fd);
        res.success ? (toast.success(editing ? 'Partenaire modifié.' : 'Partenaire ajouté.'), setShowModal(false), loadAll()) : toast.error('Erreur lors de la sauvegarde.');
      } else {
        const res = editing ? await put(`${API.endpoints.admin.partenaires}${editing.id}/`, clean) : await post(API.endpoints.admin.partenaires, clean);
        res.success ? (toast.success(editing ? 'Partenaire modifié.' : 'Partenaire ajouté.'), setShowModal(false), loadAll()) : toast.error('Erreur lors de la sauvegarde.');
      }
    } finally { setSaving(false); }
  };

  const handleDelete = async (id) => {
    const res = await del(`${API.endpoints.admin.partenaires}${id}/`);
    res.success ? (toast.success('Partenaire supprimé.'), loadAll()) : toast.error('Erreur.');
    setConfirmId(null);
  };

  return (
    <AdminLayout title="Partenaires">
      <Helmet><title>Partenaires — Administration JUDCD</title></Helmet>
      <div className="p-4 sm:p-6 space-y-5">

        <div className="bg-white rounded-2xl border border-gray-100 px-6 py-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="font-heading font-bold text-xl text-gray-900">Partenaires</h1>
            <p className="text-sm text-gray-400 mt-0.5">{partners.length} partenaire{partners.length !== 1 ? 's' : ''}</p>
          </div>
          <div className="flex items-center gap-2">
            <Link to="/admin/types/partenaires" className="flex items-center gap-1.5 px-3 py-2.5 text-sm font-medium text-gray-500 border border-gray-200 rounded-xl hover:border-[#0284C7]/30 hover:text-[#0284C7] transition-all">
              <Icon path="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" className="w-4 h-4" />
              Gérer les types
            </Link>
            <button onClick={openCreate} className="flex items-center gap-2 px-4 py-2.5 bg-[#0284C7] text-white text-sm font-semibold rounded-xl hover:bg-[#0369A1] transition-all shadow-sm">
              <Icon path="M12 4v16m8-8H4" className="w-4 h-4" />
              Ajouter
            </button>
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1,2,3].map(i => <div key={i} className="bg-white rounded-2xl p-5 border border-gray-100 animate-pulse h-28" />)}
          </div>
        ) : partners.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-100 py-20 text-center">
            <div className="w-14 h-14 bg-gray-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Icon path="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" className="w-6 h-6 text-gray-300" />
            </div>
            <p className="text-sm font-medium text-gray-400">Aucun partenaire. Ajoutez le premier.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {partners.map((p, i) => (
              <motion.div key={p.id} layout initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}
                className="bg-white rounded-2xl border border-gray-100 hover:border-gray-200 hover:shadow-sm transition-all overflow-hidden">
                <div className="p-5 flex gap-4">
                  {p.logo ? (
                    <img src={p.logo} alt={p.nom} className="w-14 h-14 rounded-xl object-contain border border-gray-100 flex-shrink-0 bg-gray-50 p-1" />
                  ) : (
                    <div className="w-14 h-14 rounded-xl bg-gray-100 flex items-center justify-center flex-shrink-0">
                      <Icon path="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16" className="w-5 h-5 text-gray-300" />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-900 truncate">{p.nom}</p>
                    <span className="inline-block mt-0.5 px-2 py-0.5 bg-[#0284C7]/10 text-[#0284C7] text-xs font-semibold rounded-full">
                      {p.type_partenaire_details?.nom || 'Partenaire'}
                    </span>
                    <p className="text-xs text-gray-400 line-clamp-1 mt-1.5">{p.description}</p>
                  </div>
                </div>
                <div className="border-t border-gray-50 flex divide-x divide-gray-50">
                  <button onClick={() => openEdit(p)} className="flex-1 py-2.5 text-xs font-semibold text-gray-500 hover:text-[#0284C7] hover:bg-sky-50 transition-colors flex items-center justify-center gap-1.5">
                    <Icon path="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" className="w-3.5 h-3.5" />
                    Modifier
                  </button>
                  <button onClick={() => setConfirmId(p.id)} className="flex-1 py-2.5 text-xs font-semibold text-gray-500 hover:text-red-500 hover:bg-red-50 transition-colors flex items-center justify-center gap-1.5">
                    <Icon path="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" className="w-3.5 h-3.5" />
                    Supprimer
                  </button>
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
                  <h2 className="font-bold text-xl text-gray-900">{editing ? 'Modifier' : 'Ajouter'} un partenaire</h2>
                  <button onClick={() => setShowModal(false)} className="w-8 h-8 rounded-lg hover:bg-gray-100 flex items-center justify-center text-gray-400">
                    <Icon path="M6 18L18 6M6 6l12 12" className="w-4 h-4" />
                  </button>
                </div>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Logo</label>
                    <label className="flex items-center gap-4 cursor-pointer">
                      <div className="w-16 h-16 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0 border border-gray-200">
                        {preview ? <img src={preview} className="w-full h-full object-contain p-1" /> : <div className="w-full h-full flex items-center justify-center"><Icon path="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16" className="w-6 h-6 text-gray-300" /></div>}
                      </div>
                      <span className="text-sm text-[#0284C7] font-medium">Choisir un logo</span>
                      <input type="file" accept="image/*" onChange={onLogo} className="hidden" />
                    </label>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">Nom *</label>
                    <input required value={form.nom} onChange={e => setForm(f => ({ ...f, nom: e.target.value }))}
                      className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#0284C7]/50 focus:ring-2 focus:ring-[#0284C7]/10 transition-all" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">Site web / Lien</label>
                    <input type="url" value={form.lien} onChange={e => setForm(f => ({ ...f, lien: e.target.value }))}
                      placeholder="https://..."
                      className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#0284C7]/50 transition-all" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">Description</label>
                    <textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} rows={3}
                      placeholder="Description du partenaire (optionnel)"
                      className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#0284C7]/50 resize-none" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">Type de partenaire</label>
                    <div className="flex gap-2">
                      <select value={form.type_partenaire} onChange={e => setForm(f => ({ ...f, type_partenaire: e.target.value }))}
                        className="flex-1 px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#0284C7]/50 bg-white">
                        <option value="">— Sélectionner —</option>
                        {types.map(t => <option key={t.id} value={t.id}>{t.nom}</option>)}
                      </select>
                      <Link to="/admin/types/partenaires" target="_blank" className="flex-shrink-0 px-3 py-2.5 border border-dashed border-gray-200 rounded-xl text-xs text-[#0284C7] hover:bg-sky-50 transition-all whitespace-nowrap">
                        + Gérer
                      </Link>
                    </div>
                  </div>
                  <div className="flex gap-3 pt-1">
                    <button type="button" onClick={() => setShowModal(false)} className="flex-1 py-2.5 border border-gray-200 rounded-xl text-sm font-semibold text-gray-600">Annuler</button>
                    <button type="submit" disabled={saving} className="flex-1 py-2.5 bg-[#0284C7] text-white rounded-xl text-sm font-semibold hover:bg-[#0369A1] disabled:opacity-50">
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
            <h3 className="font-bold text-lg text-center text-gray-900 mb-2">Supprimer ce partenaire</h3>
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
