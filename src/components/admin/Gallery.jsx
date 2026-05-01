import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { ASSETS, ASSOCIATION, GALLERY_CATEGORIES } from '@utils/constants';
import { useAuth } from '@context/AuthContext';
import { useGalleryAdmin } from '@hooks/useGallery';
import { Spinner, EmptyState } from '@components/ui/Loader/Loader';
import { ConfirmModal } from '@components/ui/Modal/Modal';

export default function AdminGallery() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
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

  useEffect(() => {
    fetchAllPhotos();
  }, []);

  const filteredPhotos = filterCategory === 'all'
    ? photos
    : photos.filter(p => p.category === filterCategory);

  const handleFileDrop = useCallback(async (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      await handleUpload(files[0], { category: filterCategory !== 'all' ? filterCategory : null });
    }
  }, [handleUpload, filterCategory]);

  const confirmDelete = (photo) => {
    setPhotoToDelete(photo);
    setShowDeleteModal(true);
  };

  const executeDelete = async () => {
    if (photoToDelete) {
      await handleDelete(photoToDelete.id);
    }
    setShowDeleteModal(false);
    setPhotoToDelete(null);
  };

  const handleLogout = async () => {
    await logout();
    navigate('/admin/login');
  };

  const categories = ['all', ...GALLERY_CATEGORIES];

  return (
    <>
      <Helmet>
        <title>Galerie - Administration JUDCD</title>
      </Helmet>

      <div className="min-h-screen bg-[#F8FAF9]">
        {/* Sidebar */}
        <AdminSidebar currentPath={location.pathname} onLogout={handleLogout} />

        {/* Contenu */}
        <div className="lg:ml-64">
          <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between sticky top-0 z-20">
            <h1 className="font-heading font-bold text-xl text-[#002060]">Gestion de la galerie</h1>
            <div className="flex items-center gap-3">
              <span className="text-sm text-[#666666]">{user?.email || 'Admin'}</span>
              <div className="w-10 h-10 bg-[#008751] rounded-full flex items-center justify-center text-white font-bold">
                A
              </div>
            </div>
          </header>

          <div className="p-6">
            {/* Barre d'actions */}
            <div className="bg-white rounded-xl p-4 shadow-lg mb-6 flex flex-col sm:flex-row gap-4 items-center justify-between">
              <div className="flex flex-wrap gap-2">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setFilterCategory(cat)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                      filterCategory === cat
                        ? 'bg-[#008751] text-white'
                        : 'bg-gray-100 text-[#666666] hover:bg-gray-200'
                    }`}
                  >
                    {cat === 'all' ? 'Toutes' : cat}
                  </button>
                ))}
              </div>

              <div className="flex gap-3">
                {selectedPhotos.length > 0 && (
                  <>
                    <button
                      onClick={deselectAll}
                      className="px-4 py-2 text-sm text-[#666666] hover:text-[#333333]"
                    >
                      Désélectionner ({selectedPhotos.length})
                    </button>
                    <button
                      onClick={() => selectedPhotos.forEach(id => handleDelete(id))}
                      className="px-4 py-2 bg-red-500 text-white text-sm rounded-lg hover:bg-red-600"
                    >
                      Supprimer la sélection
                    </button>
                  </>
                )}
                <label className="px-5 py-2 bg-[#008751] text-white text-sm font-semibold rounded-lg hover:bg-[#006B41] cursor-pointer transition-all flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Ajouter une photo
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

            {/* Barre de progression upload */}
            {isUploading && (
              <div className="bg-white rounded-xl p-4 shadow-lg mb-6">
                <p className="text-sm text-[#666666] mb-2">Téléchargement en cours...</p>
                <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-[#008751] rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${uploadProgress}%` }}
                    transition={{ duration: 0.3 }}
                  />
                </div>
                <p className="text-xs text-[#999999] mt-1">{uploadProgress}%</p>
              </div>
            )}

            {/* Grille de photos */}
            {isLoading ? (
              <div className="flex justify-center py-20">
                <Spinner size="lg" />
              </div>
            ) : filteredPhotos.length === 0 ? (
              <EmptyState
                title="Aucune photo"
                description="Ajoutez votre première photo en cliquant sur le bouton ci-dessus."
              />
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                <AnimatePresence>
                  {filteredPhotos.map((photo) => (
                    <motion.div
                      key={photo.id}
                      layout
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className={`relative group rounded-xl overflow-hidden shadow-lg cursor-pointer ${
                        selectedPhotos.includes(photo.id) ? 'ring-4 ring-[#008751]' : ''
                      }`}
                      onClick={() => toggleSelect(photo.id)}
                    >
                      {photo.image ? (
                        <img src={photo.image} alt={photo.title || ''} className="w-full aspect-square object-cover" loading="lazy" />
                      ) : (
                        <div className="w-full aspect-square bg-gray-200 flex items-center justify-center">
                          <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                        </div>
                      )}

                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all flex items-center justify-center">
                        <button
                          onClick={(e) => { e.stopPropagation(); confirmDelete(photo); }}
                          className="w-10 h-10 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all hover:bg-red-600"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>

                      {selectedPhotos.includes(photo.id) && (
                        <div className="absolute top-2 right-2 w-6 h-6 bg-[#008751] rounded-full flex items-center justify-center">
                          <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                      )}
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            )}
          </div>
        </div>
      </div>

      <ConfirmModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={executeDelete}
        title="Supprimer la photo"
        message="Êtes-vous sûr de vouloir supprimer cette photo ? Cette action est irréversible."
        confirmText="Supprimer"
        confirmVariant="danger"
      />
    </>
  );
}

// Sidebar admin réutilisable
function AdminSidebar({ currentPath, onLogout }) {
  const menuItems = [
    { path: '/admin/dashboard', label: 'Tableau de bord', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
    { path: '/admin/galerie', label: 'Galerie', icon: 'M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z' },
    { path: '/admin/blog', label: 'Articles', icon: 'M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z' },
    { path: '/admin/messages', label: 'Messages', icon: 'M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z' },
    { path: '/admin/dons', label: 'Dons', icon: 'M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z' },
  ];

  return (
    <aside className="fixed top-0 left-0 h-full w-64 bg-[#002060] text-white z-30 hidden lg:block">
      <div className="p-6 border-b border-white/10">
        <Link to="/admin/dashboard" className="flex items-center gap-3">
          <img src={ASSETS.logo} alt={ASSOCIATION.name} className="h-10 w-auto brightness-0 invert" />
          <span className="font-heading font-bold text-sm">Admin JUDCD</span>
        </Link>
      </div>
      <nav className="p-4 space-y-2">
        {menuItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
              currentPath === item.path ? 'bg-[#008751] text-white' : 'text-white/70 hover:bg-white/10 hover:text-white'
            }`}
          >
            <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon} />
            </svg>
            {item.label}
          </Link>
        ))}
      </nav>
      <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-white/10">
        <button onClick={onLogout} className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-white/70 hover:bg-white/10 hover:text-white transition-all w-full">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          Déconnexion
        </button>
      </div>
    </aside>
  );
}