import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import toast from 'react-hot-toast';
import { GALLERY_CATEGORIES } from '@utils/constants';
import { useGalleryAdmin } from '@hooks/useGallery';
import { Spinner, EmptyState } from '@components/ui/Loader/Loader';
import { ConfirmModal } from '@components/ui/Modal/Modal';
import AdminLayout from '@components/admin/AdminLayout';

const DEFAULT_CATEGORIES = GALLERY_CATEGORIES;

export default function AdminGallery() {
  const {
    photos, isLoading, isUploading, uploadProgress, selectedPhotos,
    fetchAllPhotos, handleUpload, handleUpdate, handleDelete,
    toggleSelect, selectAll, deselectAll,
  } = useGalleryAdmin();

  const [filterCategory, setFilterCategory] = useState('all');
  const [allCategories, setAllCategories] = useState([...DEFAULT_CATEGORIES]);

  // Modals
  const [showAddModal, setShowAddModal]       = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showEditModal, setShowEditModal]     = useState(false);
  const [photoToDelete, setPhotoToDelete]     = useState(null);
  const [photoToEdit, setPhotoToEdit]         = useState(null);

  // Formulaire ajout
  const [addForm, setAddForm]           = useState({ title: '', description: '', category: '', customCategory: '' });
  const [addFile, setAddFile]           = useState(null);
  const [useCustomCat, setUseCustomCat] = useState(false);
  const [addPreview, setAddPreview]     = useState(null);

  // Formulaire édition
  const [editForm, setEditForm]             = useState({ title: '', description: '', category: '', customCategory: '' });
  const [useCustomCatEdit, setUseCustomCatEdit] = useState(false);

  useEffect(() => { fetchAllPhotos(); }, []);

  // Met à jour les catégories dynamiquement depuis les photos existantes
  useEffect(() => {
    if (photos.length > 0) {
      const fromPhotos = photos.map(p => p.category).filter(Boolean);
      const merged = [...new Set([...DEFAULT_CATEGORIES, ...fromPhotos])];
      setAllCategories(merged);
    }
  }, [photos]);

  const filteredPhotos = filterCategory === 'all'
    ? photos
    : photos.filter(p => p.category === filterCategory);

  // Prévisualisation du fichier choisi (image ou vidéo)
  const onFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setAddFile(file);
    setAddPreview(URL.createObjectURL(file));
  };
  const addIsVideo = addFile?.type?.startsWith('video/');

  const getFinalCategory = (form, useCustom) =>
    useCustom ? form.customCategory.trim() : form.category;

  const openAddModal = () => {
    setAddForm({ title: '', description: '', category: '', customCategory: '' });
    setAddFile(null);
    setAddPreview(null);
    setUseCustomCat(false);
    setShowAddModal(true);
  };

  const handleAddSubmit = async (e) => {
    e.preventDefault();
    if (!addFile) { toast.error('Veuillez sélectionner une image.'); return; }
    const cat = getFinalCategory(addForm, useCustomCat);
    const result = await handleUpload(addFile, {
      title: addForm.title,
      description: addForm.description,
      category: cat,
    });
    if (result?.success !== false) {
      setShowAddModal(false);
      if (cat && !allCategories.includes(cat)) {
        setAllCategories(prev => [...prev, cat]);
      }
    }
  };

  const openEditModal = (photo) => {
    const isCustom = photo.category && !DEFAULT_CATEGORIES.includes(photo.category);
    setPhotoToEdit(photo);
    setEditForm({
      title: photo.title || '',
      description: photo.description || '',
      category: isCustom ? '' : (photo.category || ''),
      customCategory: isCustom ? photo.category : '',
    });
    setUseCustomCatEdit(isCustom);
    setShowEditModal(true);
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (!photoToEdit) return;
    const cat = getFinalCategory(editForm, useCustomCatEdit);
    const result = await handleUpdate(photoToEdit.id, {
      title: editForm.title,
      description: editForm.description,
      category: cat,
    });
    if (result?.success !== false) {
      setShowEditModal(false);
      if (cat && !allCategories.includes(cat)) setAllCategories(prev => [...prev, cat]);
    }
  };

  const executeDelete = async () => {
    if (photoToDelete) await handleDelete(photoToDelete.id);
    setShowDeleteModal(false);
    setPhotoToDelete(null);
  };

  const handleDeleteSelected = async () => {
    for (const id of selectedPhotos) await handleDelete(id);
    deselectAll();
  };

  return (
    <AdminLayout title="Galerie photo">
      <Helmet><title>Galerie - Administration JUDCD</title></Helmet>

      <div className="p-4 sm:p-6">

        {/* ── Barre de contrôle ─────────────────────────────── */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm mb-6 overflow-hidden">
          {/* Filtres */}
          <div className="px-5 pt-4 pb-3 border-b border-gray-100">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Filtrer par catégorie</p>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setFilterCategory('all')}
                className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${
                  filterCategory === 'all'
                    ? 'bg-[#002060] text-white'
                    : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                }`}
              >
                Toutes ({photos.length})
              </button>
              {allCategories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setFilterCategory(cat)}
                  className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${
                    filterCategory === cat
                      ? 'bg-[#008751] text-white'
                      : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                  }`}
                >
                  {cat} ({photos.filter(p => p.category === cat).length})
                </button>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="px-5 py-3 flex items-center justify-between gap-3 flex-wrap">
            <div className="flex items-center gap-2">
              {photos.length > 0 && (
                <button onClick={selectAll} className="text-xs text-gray-400 hover:text-[#008751] transition-colors font-medium">
                  Tout sélectionner
                </button>
              )}
              {selectedPhotos.length > 0 && (
                <>
                  <span className="text-gray-300">|</span>
                  <button onClick={deselectAll} className="text-xs text-gray-400 hover:text-gray-600 transition-colors">
                    Désélectionner ({selectedPhotos.length})
                  </button>
                  <button
                    onClick={handleDeleteSelected}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-red-50 text-red-600 text-xs font-semibold rounded-lg hover:bg-red-100 transition-colors"
                  >
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                    Supprimer la sélection
                  </button>
                </>
              )}
            </div>
            <button
              onClick={openAddModal}
              className="flex items-center gap-2 px-4 py-2 bg-[#008751] text-white text-sm font-semibold rounded-xl hover:bg-[#006B41] transition-all shadow-sm shadow-green-500/20"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Ajouter une photo
            </button>
          </div>
        </div>

        {/* ── Barre de progression ──────────────────────────── */}
        {isUploading && (
          <div className="bg-white rounded-xl border border-gray-100 p-4 mb-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-500">Envoi en cours...</span>
              <span className="text-sm font-bold text-[#008751]">{uploadProgress}%</span>
            </div>
            <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-[#008751] rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${uploadProgress}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>
          </div>
        )}

        {/* ── Grille de photos ──────────────────────────────── */}
        {isLoading ? (
          <div className="flex justify-center py-24"><Spinner size="lg" /></div>
        ) : filteredPhotos.length === 0 ? (
          <EmptyState
            title="Aucune photo"
            description={filterCategory === 'all'
              ? 'Cliquez sur « Ajouter une photo » pour commencer.'
              : `Aucune photo dans la catégorie « ${filterCategory} ».`}
          />
        ) : (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
              <AnimatePresence>
                {filteredPhotos.map(photo => (
                  <motion.div
                    key={photo.id}
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.25 }}
                    className={`relative group rounded-xl overflow-hidden cursor-pointer transition-all ${
                      selectedPhotos.includes(photo.id)
                        ? 'ring-2 ring-[#008751] ring-offset-1'
                        : 'hover:ring-1 hover:ring-gray-300'
                    }`}
                    onClick={() => toggleSelect(photo.id)}
                  >
                    <div className="aspect-square bg-gray-100 relative">
                      {photo.video ? (
                        <>
                          <video src={photo.video} className="w-full h-full object-cover" muted preload="metadata" />
                          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                            <div className="w-10 h-10 bg-black/50 rounded-full flex items-center justify-center">
                              <svg className="w-5 h-5 text-white ml-0.5" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
                            </div>
                          </div>
                          <span className="absolute top-1.5 left-1.5 px-1.5 py-0.5 bg-black/60 text-white text-[9px] font-bold rounded">VIDÉO</span>
                        </>
                      ) : photo.image ? (
                        <img src={photo.image} alt={photo.title || 'Photo'} className="w-full h-full object-cover" loading="lazy" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <svg className="w-8 h-8 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                        </div>
                      )}
                    </div>

                    {/* Overlay */}
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-200 flex items-center justify-center gap-2">
                      <button
                        onClick={e => { e.stopPropagation(); openEditModal(photo); }}
                        className="w-8 h-8 bg-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all shadow hover:bg-blue-500 hover:text-white text-gray-700"
                      >
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </button>
                      <button
                        onClick={e => { e.stopPropagation(); setPhotoToDelete(photo); setShowDeleteModal(true); }}
                        className="w-8 h-8 bg-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all shadow hover:bg-red-500 hover:text-white text-gray-700"
                      >
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>

                    {/* Check sélection */}
                    {selectedPhotos.includes(photo.id) && (
                      <div className="absolute top-2 right-2 w-5 h-5 bg-[#008751] rounded-full flex items-center justify-center shadow">
                        <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                    )}

                    {/* Catégorie badge */}
                    {photo.category && (
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent px-2 py-2 opacity-0 group-hover:opacity-100 transition-all">
                        <span className="text-[10px] text-white/80 font-medium truncate block">{photo.category}</span>
                      </div>
                    )}
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
            <p className="mt-5 text-center text-xs text-gray-400">
              {filteredPhotos.length} photo{filteredPhotos.length > 1 ? 's' : ''}
              {filterCategory !== 'all' && ` · catégorie « ${filterCategory} »`}
            </p>
          </>
        )}
      </div>

      {/* ── Modal Ajouter ─────────────────────────────────────── */}
      <AnimatePresence>
        {showAddModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
            onClick={() => setShowAddModal(false)}>
            <motion.div initial={{ scale: 0.95, y: 16 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95 }}
              className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl"
              onClick={e => e.stopPropagation()}>
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="font-bold text-xl text-[#002060]">Ajouter une photo</h2>
                  <button onClick={() => setShowAddModal(false)} className="w-8 h-8 rounded-lg hover:bg-gray-100 flex items-center justify-center text-gray-400">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                  </button>
                </div>
                <form onSubmit={handleAddSubmit} className="space-y-5">
                  {/* Zone de dépôt fichier (image ou vidéo) */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Image ou vidéo *</label>
                    <label className={`block w-full rounded-xl border-2 border-dashed cursor-pointer transition-all overflow-hidden ${addPreview ? 'border-[#008751]' : 'border-gray-200 hover:border-[#008751]/50'}`}>
                      {addPreview ? (
                        <div className="relative">
                          {addIsVideo ? (
                            <video src={addPreview} className="w-full h-48 object-cover bg-black" controls />
                          ) : (
                            <img src={addPreview} alt="Prévisualisation" className="w-full h-48 object-cover" />
                          )}
                          <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity pointer-events-none">
                            <span className="text-white text-sm font-medium">Changer le fichier</span>
                          </div>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center justify-center py-10 px-4 text-center">
                          <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center mb-3">
                            <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                            </svg>
                          </div>
                          <p className="text-sm font-medium text-gray-600">Cliquez pour sélectionner</p>
                          <p className="text-xs text-gray-400 mt-1">Images (JPG, PNG, WEBP) ou Vidéos (MP4, WEBM)</p>
                        </div>
                      )}
                      <input type="file" accept="image/*,video/*" onChange={onFileChange} className="hidden" />
                    </label>
                  </div>

                  {/* Titre */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">Titre</label>
                    <input
                      value={addForm.title}
                      onChange={e => setAddForm(f => ({ ...f, title: e.target.value }))}
                      placeholder="Ex : Formation en leadership"
                      className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#008751] focus:ring-2 focus:ring-[#008751]/10 transition-all"
                    />
                  </div>

                  {/* Catégorie */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Catégorie</label>

                    {/* Chips des catégories par défaut */}
                    <div className="flex flex-wrap gap-2 mb-3">
                      {allCategories.map(cat => (
                        <button
                          type="button"
                          key={cat}
                          onClick={() => { setUseCustomCat(false); setAddForm(f => ({ ...f, category: cat, customCategory: '' })); }}
                          className={`px-3 py-1 rounded-full text-xs font-semibold border transition-all ${
                            !useCustomCat && addForm.category === cat
                              ? 'bg-[#008751] border-[#008751] text-white'
                              : 'bg-white border-gray-200 text-gray-500 hover:border-[#008751] hover:text-[#008751]'
                          }`}
                        >
                          {cat}
                        </button>
                      ))}
                      {/* Bouton "Autre" */}
                      <button
                        type="button"
                        onClick={() => { setUseCustomCat(true); setAddForm(f => ({ ...f, category: '' })); }}
                        className={`px-3 py-1 rounded-full text-xs font-semibold border transition-all ${
                          useCustomCat
                            ? 'bg-[#002060] border-[#002060] text-white'
                            : 'bg-white border-gray-200 text-gray-500 hover:border-[#002060] hover:text-[#002060]'
                        }`}
                      >
                        + Nouvelle catégorie
                      </button>
                    </div>

                    {/* Champ texte si "Autre" sélectionné */}
                    {useCustomCat && (
                      <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}>
                        <input
                          autoFocus
                          value={addForm.customCategory}
                          onChange={e => setAddForm(f => ({ ...f, customCategory: e.target.value }))}
                          placeholder="Nom de la nouvelle catégorie..."
                          className="w-full px-3 py-2.5 border border-[#002060] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#002060]/10 transition-all"
                        />
                      </motion.div>
                    )}
                  </div>

                  {/* Description */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">Description</label>
                    <textarea
                      value={addForm.description}
                      onChange={e => setAddForm(f => ({ ...f, description: e.target.value }))}
                      rows={2}
                      placeholder="Description optionnelle..."
                      className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#008751] focus:ring-2 focus:ring-[#008751]/10 transition-all resize-none"
                    />
                  </div>

                  <div className="flex gap-3 pt-1">
                    <button type="button" onClick={() => setShowAddModal(false)} className="flex-1 py-2.5 border border-gray-200 rounded-xl text-sm font-semibold text-gray-600 hover:bg-gray-50">Annuler</button>
                    <button type="submit" disabled={isUploading} className="flex-1 py-2.5 bg-[#008751] text-white rounded-xl text-sm font-semibold hover:bg-[#006B41] disabled:opacity-50 transition-all">
                      {isUploading ? `Envoi ${uploadProgress}%...` : 'Ajouter'}
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Modal Éditer ──────────────────────────────────────── */}
      <AnimatePresence>
        {showEditModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
            onClick={() => setShowEditModal(false)}>
            <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }}
              className="bg-white rounded-2xl w-full max-w-md shadow-2xl"
              onClick={e => e.stopPropagation()}>
              <div className="p-6">
                <div className="flex items-center justify-between mb-5">
                  <h2 className="font-bold text-xl text-[#002060]">Modifier la photo</h2>
                  <button onClick={() => setShowEditModal(false)} className="w-8 h-8 rounded-lg hover:bg-gray-100 flex items-center justify-center text-gray-400">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                  </button>
                </div>
                <form onSubmit={handleEditSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">Titre</label>
                    <input value={editForm.title} onChange={e => setEditForm(f => ({ ...f, title: e.target.value }))}
                      className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#008751] focus:ring-2 focus:ring-[#008751]/10" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Catégorie</label>
                    <div className="flex flex-wrap gap-2 mb-2">
                      {allCategories.map(cat => (
                        <button type="button" key={cat}
                          onClick={() => { setUseCustomCatEdit(false); setEditForm(f => ({ ...f, category: cat, customCategory: '' })); }}
                          className={`px-3 py-1 rounded-full text-xs font-semibold border transition-all ${
                            !useCustomCatEdit && editForm.category === cat
                              ? 'bg-[#008751] border-[#008751] text-white'
                              : 'bg-white border-gray-200 text-gray-500 hover:border-[#008751]'
                          }`}>
                          {cat}
                        </button>
                      ))}
                      <button type="button"
                        onClick={() => { setUseCustomCatEdit(true); setEditForm(f => ({ ...f, category: '' })); }}
                        className={`px-3 py-1 rounded-full text-xs font-semibold border transition-all ${
                          useCustomCatEdit ? 'bg-[#002060] border-[#002060] text-white' : 'bg-white border-gray-200 text-gray-500 hover:border-[#002060]'
                        }`}>
                        + Nouvelle
                      </button>
                    </div>
                    {useCustomCatEdit && (
                      <input autoFocus value={editForm.customCategory}
                        onChange={e => setEditForm(f => ({ ...f, customCategory: e.target.value }))}
                        placeholder="Nouvelle catégorie..."
                        className="w-full px-3 py-2.5 border border-[#002060] rounded-xl text-sm focus:outline-none" />
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">Description</label>
                    <textarea value={editForm.description} onChange={e => setEditForm(f => ({ ...f, description: e.target.value }))} rows={2}
                      className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#008751] resize-none" />
                  </div>
                  <div className="flex gap-3 pt-1">
                    <button type="button" onClick={() => setShowEditModal(false)} className="flex-1 py-2.5 border border-gray-200 rounded-xl text-sm font-semibold text-gray-600">Annuler</button>
                    <button type="submit" className="flex-1 py-2.5 bg-[#008751] text-white rounded-xl text-sm font-semibold hover:bg-[#006B41]">Enregistrer</button>
                  </div>
                </form>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Modal Suppression ─────────────────────────────────── */}
      <ConfirmModal
        isOpen={showDeleteModal}
        onClose={() => { setShowDeleteModal(false); setPhotoToDelete(null); }}
        onConfirm={executeDelete}
        title="Supprimer la photo"
        message="Cette action est irréversible. La photo sera définitivement supprimée."
        confirmText="Supprimer"
        confirmVariant="danger"
      />
    </AdminLayout>
  );
}
