import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import toast from 'react-hot-toast';
import { get, post, put, del, upload } from '@services/api';
import { API } from '@utils/constants';
import AdminLayout from '@components/admin/AdminLayout';

const Icon = ({ path, className = 'w-5 h-5' }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d={path} />
  </svg>
);

const EMPTY = { nom_complet: '', role: '', telephone: '', email: '', infos: '' };
const EMPTY_SOCIAL = { linkedin: '', facebook: '', instagram: '', twitter: '', tiktok: '' };

// Icônes des réseaux sociaux
const SOCIAL_ICONS = {
  linkedin: {
    label: 'LinkedIn',
    color: '#0A66C2',
    icon: 'M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z M4 6a2 2 0 100-4 2 2 0 000 4z',
    placeholder: 'https://linkedin.com/in/...',
  },
  facebook: {
    label: 'Facebook',
    color: '#1877F2',
    icon: 'M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z',
    placeholder: 'https://facebook.com/...',
  },
  instagram: {
    label: 'Instagram',
    color: '#E1306C',
    icon: 'M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37zm1.5-4.87h.01M6.5 6.5h11a2 2 0 012 2v11a2 2 0 01-2 2h-11a2 2 0 01-2-2v-11a2 2 0 012-2z',
    placeholder: 'https://instagram.com/...',
  },
  twitter: {
    label: 'X / Twitter',
    color: '#000000',
    icon: 'M4 4l16 16M4 20L20 4',
    placeholder: 'https://x.com/...',
  },
  tiktok: {
    label: 'TikTok',
    color: '#010101',
    icon: 'M9 12a4 4 0 104 4V4a5 5 0 005 5',
    placeholder: 'https://tiktok.com/@...',
  },
};

export default function AdminTeam() {
  const [members, setMembers]     = useState([]);
  const [loading, setLoading]     = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing]     = useState(null);
  const [form, setForm]           = useState(EMPTY);
  const [social, setSocial]       = useState(EMPTY_SOCIAL);
  const [photoFile, setPhotoFile] = useState(null);
  const [preview, setPreview]     = useState(null);
  const [saving, setSaving]       = useState(false);
  const [confirmId, setConfirmId] = useState(null);

  useEffect(() => { load(); }, []);

  const load = async () => {
    setLoading(true);
    const res = await get(API.endpoints.admin.team);
    setMembers(res?.data?.results || res?.data || []);
    setLoading(false);
  };

  const openCreate = () => {
    setEditing(null); setForm(EMPTY); setSocial(EMPTY_SOCIAL); setPhotoFile(null); setPreview(null); setShowModal(true);
  };
  const openEdit = (m) => {
    setEditing(m);
    setForm({ nom_complet: m.nom_complet || '', role: m.role || '', telephone: m.telephone || '', email: m.email || '', infos: m.infos || '' });
    const rs = typeof m.reseaux_sociaux === 'object' ? m.reseaux_sociaux : {};
    setSocial({ linkedin: rs.linkedin || '', facebook: rs.facebook || '', instagram: rs.instagram || '', twitter: rs.twitter || '', tiktok: rs.tiktok || '' });
    setPhotoFile(null); setPreview(m.photo || null); setShowModal(true);
  };

  const onFile = (e) => {
    const f = e.target.files[0]; if (!f) return;
    setPhotoFile(f);
    const r = new FileReader(); r.onloadend = () => setPreview(r.result); r.readAsDataURL(f);
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); setSaving(true);
    try {
      const socialFiltered = Object.fromEntries(Object.entries(social).filter(([, v]) => v.trim()));
      if (photoFile) {
        const fd = new FormData();
        Object.entries(form).forEach(([k, v]) => fd.append(k, v));
        fd.append('reseaux_sociaux', JSON.stringify(socialFiltered));
        fd.append('photo', photoFile);
        const res = editing
          ? await upload(`${API.endpoints.admin.team}${editing.id}/`, fd, null, 'patch')
          : await upload(API.endpoints.admin.team, fd);
        res.success ? (toast.success(editing ? 'Membre modifié.' : 'Membre ajouté.'), setShowModal(false), load()) : toast.error('Erreur.');
      } else {
        const data = { ...form, reseaux_sociaux: socialFiltered };
        const res = editing ? await put(`${API.endpoints.admin.team}${editing.id}/`, data) : await post(API.endpoints.admin.team, data);
        res.success ? (toast.success(editing ? 'Membre modifié.' : 'Membre ajouté.'), setShowModal(false), load()) : toast.error(JSON.stringify(res.error) || 'Erreur.');
      }
    } finally { setSaving(false); }
  };

  const handleDelete = async (id) => {
    const res = await del(`${API.endpoints.admin.team}${id}/`);
    res.success ? (toast.success('Membre supprimé.'), load()) : toast.error('Erreur.');
    setConfirmId(null);
  };

  return (
    <AdminLayout title="Équipe">
      <Helmet><title>Équipe — Administration JUDCD</title></Helmet>
      <div className="p-4 sm:p-6 space-y-5">

        {/* En-tête */}
        <div className="bg-white rounded-2xl border border-gray-100 px-6 py-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="font-heading font-bold text-xl text-gray-900">Membres de l'équipe</h1>
            <p className="text-sm text-gray-400 mt-0.5">{members.length} membre{members.length !== 1 ? 's' : ''}</p>
          </div>
          <button onClick={openCreate} className="flex items-center gap-2 px-4 py-2.5 bg-[#008751] text-white text-sm font-semibold rounded-xl hover:bg-[#006B41] transition-all shadow-sm shadow-green-500/20">
            <Icon path="M12 4v16m8-8H4" className="w-4 h-4" />
            Ajouter un membre
          </button>
        </div>

        {/* Grille */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1,2,3].map(i => <div key={i} className="bg-white rounded-2xl p-6 border border-gray-100 animate-pulse"><div className="flex gap-4"><div className="w-16 h-16 bg-gray-100 rounded-2xl flex-shrink-0"/><div className="flex-1 space-y-2"><div className="h-4 bg-gray-100 rounded w-32"/><div className="h-3 bg-gray-100 rounded w-24"/></div></div></div>)}
          </div>
        ) : members.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-100 py-20 text-center">
            <div className="w-14 h-14 bg-gray-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Icon path="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" className="w-6 h-6 text-gray-300" />
            </div>
            <p className="text-sm font-medium text-gray-400">Aucun membre. Ajoutez le premier.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {members.map((m, i) => (
              <motion.div key={m.id} layout initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}
                className="bg-white rounded-2xl border border-gray-100 hover:border-gray-200 hover:shadow-sm transition-all overflow-hidden">
                <div className="p-5 flex gap-4">
                  {m.photo ? (
                    <img src={m.photo} alt={m.nom_complet} className="w-16 h-16 rounded-2xl object-cover flex-shrink-0 ring-1 ring-black/5" />
                  ) : (
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#002060] to-[#008751] flex items-center justify-center text-white text-xl font-bold flex-shrink-0">
                      {(m.nom_complet || '?').charAt(0)}
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-900 truncate">{m.nom_complet}</p>
                    <span className="inline-block mt-1 px-2 py-0.5 bg-[#008751]/10 text-[#008751] text-xs font-semibold rounded-full">{m.role}</span>
                    <p className="text-xs text-gray-400 truncate mt-1.5">{m.email}</p>
                  </div>
                </div>
                <div className="border-t border-gray-50 flex divide-x divide-gray-50">
                  <button onClick={() => openEdit(m)} className="flex-1 py-2.5 text-xs font-semibold text-gray-500 hover:text-[#008751] hover:bg-green-50 transition-colors flex items-center justify-center gap-1.5">
                    <Icon path="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" className="w-3.5 h-3.5" />
                    Modifier
                  </button>
                  <button onClick={() => setConfirmId(m.id)} className="flex-1 py-2.5 text-xs font-semibold text-gray-500 hover:text-red-500 hover:bg-red-50 transition-colors flex items-center justify-center gap-1.5">
                    <Icon path="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" className="w-3.5 h-3.5" />
                    Supprimer
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Modal ajout/édition */}
      <AnimatePresence>
        {showModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setShowModal(false)}>
            <motion.div initial={{ scale: 0.95, y: 16 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95 }}
              className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl" onClick={e => e.stopPropagation()}>
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="font-bold text-xl text-gray-900">{editing ? 'Modifier' : 'Ajouter'} un membre</h2>
                  <button onClick={() => setShowModal(false)} className="w-8 h-8 rounded-lg hover:bg-gray-100 flex items-center justify-center text-gray-400">
                    <Icon path="M6 18L18 6M6 6l12 12" className="w-4 h-4" />
                  </button>
                </div>
                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Photo */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Photo</label>
                    <label className="flex items-center gap-4 cursor-pointer">
                      <div className="w-16 h-16 rounded-2xl overflow-hidden bg-gray-100 flex-shrink-0">
                        {preview ? <img src={preview} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center"><Icon path="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" className="w-6 h-6 text-gray-300" /></div>}
                      </div>
                      <span className="text-sm text-[#008751] font-medium">Choisir une photo</span>
                      <input type="file" accept="image/*" onChange={onFile} className="hidden" />
                    </label>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">Nom complet *</label>
                    <input required value={form.nom_complet} onChange={e => setForm(f => ({ ...f, nom_complet: e.target.value }))}
                      className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#008751] focus:ring-2 focus:ring-[#008751]/10 transition-all" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">Rôle / Poste *</label>
                    <input required value={form.role} onChange={e => setForm(f => ({ ...f, role: e.target.value }))}
                      className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#008751] focus:ring-2 focus:ring-[#008751]/10 transition-all" />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1.5">Email</label>
                      <input type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                        className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#008751] transition-all" />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1.5">Téléphone</label>
                      <input value={form.telephone} onChange={e => setForm(f => ({ ...f, telephone: e.target.value }))}
                        className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#008751] transition-all" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">Biographie</label>
                    <textarea value={form.infos} onChange={e => setForm(f => ({ ...f, infos: e.target.value }))} rows={3}
                      className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#008751] focus:ring-2 focus:ring-[#008751]/10 resize-none" />
                  </div>
                  {/* Réseaux sociaux — UI intuitive */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Réseaux sociaux</label>
                    <div className="space-y-2">
                      {Object.entries(SOCIAL_ICONS).map(([key, cfg]) => (
                        <div key={key} className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: cfg.color + '15' }}>
                            <svg className="w-4 h-4" style={{ color: cfg.color }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d={cfg.icon} />
                            </svg>
                          </div>
                          <input
                            type="url"
                            value={social[key]}
                            onChange={e => setSocial(s => ({ ...s, [key]: e.target.value }))}
                            placeholder={cfg.placeholder}
                            className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-xs focus:outline-none focus:border-gray-400 transition-all"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="flex gap-3 pt-1">
                    <button type="button" onClick={() => setShowModal(false)} className="flex-1 py-2.5 border border-gray-200 rounded-xl text-sm font-semibold text-gray-600 hover:bg-gray-50">Annuler</button>
                    <button type="submit" disabled={saving} className="flex-1 py-2.5 bg-[#008751] text-white rounded-xl text-sm font-semibold hover:bg-[#006B41] disabled:opacity-50 transition-all">
                      {saving ? 'Enregistrement...' : 'Enregistrer'}
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Confirm delete */}
      {confirmId && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setConfirmId(null)}>
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-2xl" onClick={e => e.stopPropagation()}>
            <div className="w-12 h-12 bg-red-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Icon path="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" className="w-6 h-6 text-red-500" />
            </div>
            <h3 className="font-bold text-lg text-center text-gray-900 mb-2">Supprimer ce membre</h3>
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
