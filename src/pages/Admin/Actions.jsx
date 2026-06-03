import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { get, post, put, del, upload } from '@services/api';
import { API } from '@utils/constants';
import AdminLayout from '@components/admin/AdminLayout';
import { formatDate } from '@utils/formatters';

const Icon = ({ path, className = 'w-5 h-5' }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d={path} />
  </svg>
);

const EMPTY = { titre: '', description: '', date: '', lieu: '', type_action: '' };

export default function AdminActions() {
  const [actions, setActions]     = useState([]);
  const [types, setTypes]         = useState([]);
  const [gallery, setGallery]     = useState([]); // médias disponibles (galerie)
  const [loading, setLoading]     = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing]     = useState(null);
  const [form, setForm]           = useState(EMPTY);
  const [selectedMedia, setSelectedMedia] = useState([]); // ids des médias liés
  const [imageFile, setImageFile] = useState(null);
  const [preview, setPreview]     = useState(null);
  const [saving, setSaving]       = useState(false);
  const [confirmId, setConfirmId] = useState(null);

  useEffect(() => { loadAll(); }, []);

  const loadAll = async () => {
    setLoading(true);
    const [aRes, tRes, gRes] = await Promise.all([
      get(API.endpoints.admin.actions),
      get(API.endpoints.admin.typesAction),
      get(API.endpoints.admin.galerie),
    ]);
    setActions(aRes?.data?.results || aRes?.data || []);
    setTypes(tRes?.data?.results || tRes?.data || []);
    setGallery(gRes?.data?.results || gRes?.data || []);
    setLoading(false);
  };

  const toggleMedia = (id) => {
    setSelectedMedia(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  const onImage = (e) => {
    const f = e.target.files[0]; if (!f) return;
    setImageFile(f);
    const r = new FileReader(); r.onloadend = () => setPreview(r.result); r.readAsDataURL(f);
  };

  const openCreate = () => {
    setEditing(null); setForm({ ...EMPTY, date: new Date().toISOString().slice(0, 10) });
    setSelectedMedia([]); setImageFile(null); setPreview(null); setShowModal(true);
  };
  const openEdit = (a) => {
    setEditing(a);
    setForm({ titre: a.titre || '', description: a.description || '', date: a.date || '', lieu: a.lieu || '', type_action: a.type_action || '' });
    // a.galerie est une liste d'ids (ActionSerializer __all__)
    setSelectedMedia(Array.isArray(a.galerie) ? a.galerie.map(x => (typeof x === 'object' ? x.id : x)) : []);
    setImageFile(null); setPreview(a.image_couverture || null); setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); setSaving(true);
    try {
      const clean = Object.fromEntries(Object.entries(form).filter(([, v]) => v !== '' && v !== null && v !== undefined));
      if (imageFile) {
        const fd = new FormData();
        Object.entries(clean).forEach(([k, v]) => fd.append(k, v));
        fd.append('image_couverture', imageFile);
        selectedMedia.forEach(id => fd.append('galerie', id));
        const res = editing
          ? await upload(`${API.endpoints.admin.actions}${editing.id}/`, fd, null, 'patch')
          : await upload(API.endpoints.admin.actions, fd);
        res.success ? (toast.success(editing ? 'Action modifiée.' : 'Action créée.'), setShowModal(false), loadAll()) : toast.error('Erreur lors de la sauvegarde.');
      } else {
        const payload = { ...clean, galerie: selectedMedia };
        const res = editing ? await put(`${API.endpoints.admin.actions}${editing.id}/`, payload) : await post(API.endpoints.admin.actions, payload);
        res.success ? (toast.success(editing ? 'Action modifiée.' : 'Action créée.'), setShowModal(false), loadAll()) : toast.error('Erreur lors de la sauvegarde.');
      }
    } finally { setSaving(false); }
  };

  const handleDelete = async (id) => {
    const res = await del(`${API.endpoints.admin.actions}${id}/`);
    res.success ? (toast.success('Action supprimée.'), loadAll()) : toast.error('Erreur.');
    setConfirmId(null);
  };

  return (
    <AdminLayout title="Actions communautaires">
      <Helmet><title>Actions — Administration JUDCD</title></Helmet>
      <div className="p-4 sm:p-6 space-y-5">

        <div className="bg-white rounded-2xl border border-gray-100 px-6 py-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="font-heading font-bold text-xl text-gray-900">Actions communautaires</h1>
            <p className="text-sm text-gray-400 mt-0.5">{actions.length} action{actions.length !== 1 ? 's' : ''}</p>
          </div>
          <div className="flex items-center gap-2">
            <Link to="/admin/types/actions" className="flex items-center gap-1.5 px-3 py-2.5 text-sm font-medium text-gray-500 border border-gray-200 rounded-xl hover:border-[#059669]/30 hover:text-[#059669] transition-all">
              <Icon path="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" className="w-4 h-4" />
              Gérer les types
            </Link>
            <button onClick={openCreate} className="flex items-center gap-2 px-4 py-2.5 bg-[#059669] text-white text-sm font-semibold rounded-xl hover:bg-[#047857] transition-all shadow-sm">
              <Icon path="M12 4v16m8-8H4" className="w-4 h-4" />
              Nouvelle action
            </button>
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[1,2,3,4].map(i => <div key={i} className="bg-white rounded-2xl border border-gray-100 h-40 animate-pulse" />)}
          </div>
        ) : actions.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-100 py-20 text-center">
            <div className="w-14 h-14 bg-gray-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Icon path="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" className="w-6 h-6 text-gray-300" />
            </div>
            <p className="text-sm font-medium text-gray-400">Aucune action. Créez la première.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {actions.map((a, i) => (
              <motion.div key={a.id} layout initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}
                className="bg-white rounded-2xl border border-gray-100 hover:border-gray-200 hover:shadow-sm transition-all overflow-hidden">
                {/* Image */}
                {a.image_couverture ? (
                  <img src={a.image_couverture} alt={a.titre} className="w-full h-36 object-cover" />
                ) : (
                  <div className="w-full h-36 bg-gradient-to-br from-[#059669]/10 to-[#002060]/10 flex items-center justify-center">
                    <Icon path="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" className="w-10 h-10 text-gray-200" />
                  </div>
                )}
                <div className="p-4">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div className="min-w-0">
                      <p className="font-semibold text-gray-900 truncate">{a.titre}</p>
                      <div className="flex items-center gap-3 mt-1 flex-wrap">
                        <span className="text-xs text-gray-400 flex items-center gap-1">
                          <Icon path="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" className="w-3 h-3" />
                          {formatDate(a.date)}
                        </span>
                        <span className="text-xs text-gray-400 flex items-center gap-1">
                          <Icon path="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" className="w-3 h-3" />
                          {a.lieu}
                        </span>
                      </div>
                    </div>
                    <div className="flex gap-1 flex-shrink-0">
                      <button onClick={() => openEdit(a)} className="w-8 h-8 rounded-lg hover:bg-gray-100 flex items-center justify-center text-gray-400 hover:text-[#059669] transition-colors">
                        <Icon path="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" className="w-3.5 h-3.5" />
                      </button>
                      <button onClick={() => setConfirmId(a.id)} className="w-8 h-8 rounded-lg hover:bg-red-50 flex items-center justify-center text-gray-400 hover:text-red-500 transition-colors">
                        <Icon path="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                  <p className="text-xs text-gray-400 line-clamp-2">{a.description}</p>
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
                  <h2 className="font-bold text-xl text-gray-900">{editing ? 'Modifier' : 'Nouvelle'} action</h2>
                  <button onClick={() => setShowModal(false)} className="w-8 h-8 rounded-lg hover:bg-gray-100 flex items-center justify-center text-gray-400">
                    <Icon path="M6 18L18 6M6 6l12 12" className="w-4 h-4" />
                  </button>
                </div>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Image de couverture</label>
                    <label className={`block w-full rounded-xl border-2 border-dashed cursor-pointer overflow-hidden transition-all ${preview ? 'border-[#059669]/30' : 'border-gray-200 hover:border-[#059669]/30'}`}>
                      {preview ? (
                        <div className="relative"><img src={preview} className="w-full h-36 object-cover" /><div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 hover:opacity-100"><span className="text-white text-xs">Changer</span></div></div>
                      ) : (
                        <div className="py-8 flex flex-col items-center"><Icon path="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" className="w-8 h-8 text-gray-300 mb-2" /><span className="text-sm text-gray-400">Cliquez pour sélectionner</span></div>
                      )}
                      <input type="file" accept="image/*" onChange={onImage} className="hidden" />
                    </label>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">Titre *</label>
                    <input required value={form.titre} onChange={e => setForm(f => ({ ...f, titre: e.target.value }))}
                      className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#059669]/50 focus:ring-2 focus:ring-[#059669]/10 transition-all" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">Description *</label>
                    <textarea required value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} rows={4}
                      className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#059669]/50 resize-none" />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1.5">Date *</label>
                      <input type="date" required value={form.date} onChange={e => setForm(f => ({ ...f, date: e.target.value }))}
                        className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#059669]/50" />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1.5">Lieu *</label>
                      <input required value={form.lieu} onChange={e => setForm(f => ({ ...f, lieu: e.target.value }))}
                        className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#059669]/50" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">Type d'action *</label>
                    <select required value={form.type_action} onChange={e => setForm(f => ({ ...f, type_action: e.target.value }))}
                      className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none bg-white">
                      <option value="">— Sélectionner —</option>
                      {types.map(t => <option key={t.id} value={t.id}>{t.nom}</option>)}
                    </select>
                  </div>

                  {/* Galerie de l'action : photos + vidéos */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="block text-sm font-semibold text-gray-700">Galerie (photos / vidéos)</label>
                      <span className="text-xs text-gray-400">{selectedMedia.length} sélectionné(s)</span>
                    </div>
                    {gallery.length === 0 ? (
                      <p className="text-xs text-gray-400 bg-gray-50 rounded-lg p-3">
                        Aucun média. Ajoutez des photos/vidéos dans la page <span className="font-semibold">Galerie</span> d'abord.
                      </p>
                    ) : (
                      <div className="grid grid-cols-4 sm:grid-cols-5 gap-2 max-h-44 overflow-y-auto p-1 border border-gray-100 rounded-xl">
                        {gallery.map(g => {
                          const sel = selectedMedia.includes(g.id);
                          return (
                            <button type="button" key={g.id} onClick={() => toggleMedia(g.id)}
                              className={`relative aspect-square rounded-lg overflow-hidden border-2 transition-all ${sel ? 'border-[#059669] ring-2 ring-[#059669]/20' : 'border-transparent hover:border-gray-200'}`}>
                              {g.video ? (
                                <>
                                  <video src={g.video} className="w-full h-full object-cover" muted preload="metadata" />
                                  <span className="absolute bottom-0.5 left-0.5 px-1 bg-black/60 text-white text-[8px] font-bold rounded">VIDÉO</span>
                                </>
                              ) : g.image ? (
                                <img src={g.image} alt="" className="w-full h-full object-cover" />
                              ) : (
                                <div className="w-full h-full bg-gray-100" />
                              )}
                              {sel && (
                                <div className="absolute top-0.5 right-0.5 w-4 h-4 bg-[#059669] rounded-full flex items-center justify-center">
                                  <svg className="w-2.5 h-2.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                                </div>
                              )}
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>

                  <div className="flex gap-3 pt-1">
                    <button type="button" onClick={() => setShowModal(false)} className="flex-1 py-2.5 border border-gray-200 rounded-xl text-sm font-semibold text-gray-600">Annuler</button>
                    <button type="submit" disabled={saving} className="flex-1 py-2.5 bg-[#059669] text-white rounded-xl text-sm font-semibold hover:bg-[#047857] disabled:opacity-50">
                      {saving ? 'Enregistrement...' : (editing ? 'Modifier' : 'Créer')}
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
            <h3 className="font-bold text-lg text-center text-gray-900 mb-2">Supprimer cette action</h3>
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
