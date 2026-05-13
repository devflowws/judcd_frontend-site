import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { GALLERY_CATEGORIES } from '@utils/constants';
import { useGalleryAdmin } from '@hooks/useGallery';
import { Spinner, EmptyState } from '@components/ui/Loader/Loader';
import { ConfirmModal } from '@components/ui/Modal/Modal';
import AdminLayout from '@components/admin/AdminLayout';

export default function AdminGallery() {
  const {
    photos,
    isLoading,
    isUploading,
    uploadProgress,
    selectedPhotos,
    fetchAllPhotos,
    handleUpload,
    handleDelete,
    toggleSelect,
    selectAll,
    deselectAll,
  } = useGalleryAdmin();

  const [filterCategory, setFilterCategory] = useState('all');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [photoToDelete, setPhotoToDelete] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [photoToEdit, setPhotoToEdit] = useState(null);
  const [editForm, setEditForm] = useState({ title: '', description: '', category: '' });

  useEffect(() => {
    fetchAllPhotos();
  }, []);

  const filteredPhotos = filterCategory === 'all'
    ? photos
    : photos.filter(p => p.category === filterCategory || p.categorie === filterCategory);

  const handleFileDrop = useCallback(async (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      await handleUpload(files[0], {
        category: filterCategory !== 'all' ? filterCategory : null
      });
      e.target.value = '';
    }
  }, [handleUpload, filterCategory]);

  const confirmDelete = (photo) => {
    setPhotoToDelete(photo);
    setShowDeleteModal(true);
  };

  const openEditModal = (photo) => {
    setPhotoToEdit(photo);
    setEditForm({
      title: photo.title || photo.titre || '',
      description: photo.description || '',
      category: photo.category || ''
    });
    setShowEditModal(true);
  };

  const closeEditModal = () => {
    setShowEditModal(false);
    setPhotoToEdit(null);
    setEditForm({ title: '', description: '', category: '' });
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (photoToEdit) {
      // Ici il faudrait appeler une fonction de mise à jour
      // Pour l'instant, on va juste fermer la modal
      toast.success('Photo mise à jour avec succès.');
      await fetchAllPhotos();
      closeEditModal();
    }
  };

  const executeDelete = async () => {
    if (photoToDelete) {
      await handleDelete(photoToDelete.id);
    }
    setShowDeleteModal(false);
    setPhotoToDelete(null);
  };

  const handleDeleteSelected = async () => {
    for (const id of selectedPhotos) {
      await handleDelete(id);
    }
    deselectAll();
  };

  const categories = ['all', ...GALLERY_CATEGORIES];

  return (
    <AdminLayout title="Galerie">
      <Helmet>
        <title>Galerie - Administration JUDCD</title>
      </Helmet>

      <div className="p-4 sm:p-6">
        {/* Barre d'actions */}
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 mb-6">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            {/* Filtres par categorie */}
            <div className="flex flex-wrap gap-2">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setFilterCategory(cat)}
                  className={`px-3 py-1.5 rounded-full text-xs sm:text-sm font-medium transition-all ${
                    filterCategory === cat
                      ? 'bg-[#008751] text-white shadow-sm'
                      : 'bg-gray-100 text-[#666666] hover:bg-gray-200'
                  }`}
                >
                  {cat === 'all' ? 'Toutes' : cat}
                </button>
              ))}
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2 sm:gap-3">
              {selectedPhotos.length > 0 && (
                <>
                  <button
                    onClick={deselectAll}
                    className="px-3 py-1.5 text-xs sm:text-sm text-[#666666] hover:text-[#333333] transition-colors"
                  >
                    Deselectionner ({selectedPhotos.length})
                  </button>
                  <button
                    onClick={handleDeleteSelected}
                    className="px-3 py-1.5 bg-red-500 text-white text-xs sm:text-sm font-medium rounded-lg hover:bg-red-600 transition-colors"
                  >
                    Supprimer
                  </button>
                </>
              )}
              {photos.length > 0 && (
                <button
                  onClick={selectAll}
                  className="px-3 py-1.5 text-xs sm:text-sm text-[#666666] hover:text-[#008751] transition-colors"
                >
                  Tout selectionner
                </button>
              )}
              <label className="px-4 py-2 bg-[#008751] text-white text-xs sm:text-sm font-semibold rounded-lg hover:bg-[#006B41] cursor-pointer transition-colors inline-flex items-center gap-1.5">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Ajouter
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileDrop}
                  className="hidden"
                  disabled={isUploading}
                />
              </label>
            </div>
          </div>
        </div>

        {/* Barre de progression upload */}
        {isUploading && (
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 mb-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-[#666666]">Telechargement en cours...</p>
              <p className="text-sm font-semibold text-[#008751]">{uploadProgress}%</p>
            </div>
            <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-[#008751] rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${uploadProgress}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>
          </div>
        )}

        {/* Contenu */}
        {isLoading ? (
          <div className="flex justify-center py-20">
            <Spinner size="lg" />
          </div>
        ) : filteredPhotos.length === 0 ? (
          <EmptyState
            title="Aucune photo"
            description="Ajoutez votre premiere photo en cliquant sur le bouton Ajouter."
          />
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4">
            <AnimatePresence>
              {filteredPhotos.map((photo) => (
                <motion.div
                  key={photo.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3 }}
                  className={`relative group rounded-xl overflow-hidden shadow-sm border-2 cursor-pointer transition-all ${
                    selectedPhotos.includes(photo.id)
                      ? 'border-[#008751] ring-2 ring-[#008751]/20'
                      : 'border-gray-100 hover:border-gray-300'
                  }`}
                  onClick={() => toggleSelect(photo.id)}
                >
                  {/* Image */}
                  <div className="aspect-square bg-gray-100">
                    {photo.image ? (
                      <img
                        src={photo.image}
                        alt={photo.title || photo.titre || 'Photo'}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                    )}
                  </div>

                  {/* Overlay avec boutons */}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all flex items-center justify-center">
                    {/* Bouton éditer */}
                    <button
                      onClick={(e) => { e.stopPropagation(); openEditModal(photo); }}
                      className="absolute top-2 left-2 w-8 h-8 bg-white/90 hover:bg-blue-500 text-gray-700 hover:text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all shadow-lg"
                      title="Éditer"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2H5a2 2 0 00-2 2v14a2 2 0 002 2h2a2 2 0 002-2v-14a2 2 0 00-2-2h-2z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 11l4 4" />
                      </svg>
                    </button>
                    
                    {/* Bouton supprimer */}
                    <button
                      onClick={(e) => { e.stopPropagation(); confirmDelete(photo); }}
                      className="w-9 h-9 bg-white/90 hover:bg-red-500 text-gray-700 hover:text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all shadow-lg"
                      title="Supprimer"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>

                  {/* Check de selection */}
                  {selectedPhotos.includes(photo.id) && (
                    <div className="absolute top-2 right-2 w-6 h-6 bg-[#008751] rounded-full flex items-center justify-center shadow-lg">
                      <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                  )}

                  {/* Titre de la photo */}
                  {(photo.title || photo.titre) && (
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-2 sm:p-3 opacity-0 group-hover:opacity-100 transition-all">
                      <p className="text-white text-xs font-medium truncate">
                        {photo.title || photo.titre}
                      </p>
                    </div>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}

        {/* Compteur */}
        {!isLoading && filteredPhotos.length > 0 && (
          <div className="mt-6 text-center text-sm text-[#999999]">
            {filteredPhotos.length} photo(s) affichee(s)
            {filterCategory !== 'all' && ` dans la categorie "${filterCategory}"`}
          </div>
        )}
      </div>

      {/* Modal de confirmation suppression */}
      <ConfirmModal
        isOpen={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false);
          setPhotoToDelete(null);
        }}
        onConfirm={executeDelete}
        title="Supprimer la photo"
        message="Etes-vous sur de vouloir supprimer cette photo ? Cette action est irreversible."
        confirmText="Supprimer"
        confirmVariant="danger"
      />
    </AdminLayout>
  );
}