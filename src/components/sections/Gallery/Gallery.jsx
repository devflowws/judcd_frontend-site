import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { GALLERY_CATEGORIES } from '@utils/constants';
import { useLanguage } from '@context/LanguageContext';
import FadeInView from '@components/ui/Animations/FadeInView';
import { ImageModal } from '@components/ui/Modal/Modal';
import { Spinner } from '@components/ui/Loader/Loader';
import { useGallery } from '@hooks/useGallery';






// ==========================================
// SECTION GALERIE JUDCD
// ==========================================

export default function Gallery() {
  const { t } = useLanguage();
  const { photos, isLoading, activeCategory, changeCategory, fetchPhotos } = useGallery();
  const [selectedImage, setSelectedImage] = useState(null);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [categories, setCategories] = useState(['all']);

  // Chargement initial des photos
  useEffect(() => {
    fetchPhotos({ pageSize: 8 });
  }, [fetchPhotos]);

  // Extraction dynamique des catégories présentes dans les photos pour créer les filtres
  useEffect(() => {
    if (photos && photos.length > 0) {
      const uniqueCategories = [
        'all',
        ...new Set(photos.map(p => p.category).filter(Boolean))
      ];
      // On ne met à jour les filtres que si on est sur la vue "Toutes les photos"
      // afin d'éviter que les boutons des autres catégories disparaissent au filtrage
      if (!activeCategory) {
        setCategories(uniqueCategories);
      }
    }
  }, [photos, activeCategory]);

  const openLightbox = (photo) => {
    setSelectedImage(photo);
    setIsLightboxOpen(true);
  };

  const closeLightbox = () => {
    setIsLightboxOpen(false);
    setSelectedImage(null);
  };

  return (
    <section id="gallery" className="py-20 md:py-28 bg-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* En-tête */}
        <FadeInView className="text-center max-w-3xl mx-auto mb-12">
          <span className="text-sm font-semibold text-[#008751] uppercase tracking-wider mb-3 block">
            {t('section.gallery')}
          </span>
          <h2 className="font-heading font-extrabold text-3xl md:text-4xl lg:text-5xl text-[#002060] mb-6 leading-tight">
            {t('gallery.title')}
          </h2>
          <p className="text-[#666666] text-lg">
            {t('gallery.description')}
          </p>
        </FadeInView>

        {/* Filtres par catégorie */}
        <FadeInView className="flex flex-wrap justify-center gap-3 mb-12">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => changeCategory(category === 'all' ? null : category)}
              className={`px-5 py-2.5 rounded-full font-medium text-sm transition-all duration-300 ${
                (category === 'all' && !activeCategory) || activeCategory === category
                  ? 'bg-[#008751] text-white shadow-lg shadow-green-500/25'
                  : 'bg-gray-100 text-[#666666] hover:bg-gray-200 hover:text-[#333333]'
              }`}
            >
              {category === 'all' ? t('gallery.all') : category}
            </button>
          ))}
        </FadeInView>

        {/* Grille de photos */}
        {isLoading ? (
          <div className="flex justify-center py-20">
            <Spinner size="lg" />
          </div>
        ) : photos.length === 0 ? (
          <div className="text-center py-20">
            <svg className="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <p className="text-[#666666] text-lg">Aucune photo pour le moment</p>
            <p className="text-[#999999] text-sm mt-2">Les photos de nos activités seront bientôt disponibles</p>
          </div>
        ) : (
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
            layout
          >
            <AnimatePresence mode="popLayout">
              {photos.map((photo) => (
                <motion.div
                  key={photo.id}
                  layout
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.4 }}
                  className="group relative aspect-[4/3] rounded-xl overflow-hidden cursor-pointer shadow-lg hover:shadow-xl"
                  onClick={() => openLightbox(photo)}
                >
                  {/* Média : vidéo ou image */}
                  {photo.video ? (
                    <>
                      <video src={photo.video} className="w-full h-full object-cover" muted preload="metadata" />
                      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <div className="w-14 h-14 bg-black/50 backdrop-blur-sm rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                          <svg className="w-7 h-7 text-white ml-1" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
                        </div>
                      </div>
                    </>
                  ) : photo.image ? (
                    <img
                      src={photo.image}
                      alt={photo.title || 'Photo JUDCD'}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      loading="lazy"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-[#008751]/20 to-[#002060]/20 flex items-center justify-center">
                      <svg className="w-12 h-12 text-[#008751]/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                  )}

                  {/* Overlay au survol */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
                    <h4 className="text-white font-bold text-sm mb-1">
                      {photo.title || 'Sans titre'}
                    </h4>
                    {photo.category && (
                      <span className="text-[#FFD100] text-xs font-medium">
                        {photo.category}
                      </span>
                    )}
                  </div>

                  {/* Icône loupe */}
                  <div className="absolute top-3 right-3 w-8 h-8 bg-white/90 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 transform group-hover:scale-100 scale-75">
                    <svg className="w-4 h-4 text-[#002060]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                    </svg>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}

        {/* Lien voir toute la galerie */}
        <FadeInView className="text-center mt-12">
          <Link
            to="/galerie"
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#008751] text-white font-semibold rounded-xl hover:bg-[#006B41] transition-all shadow-lg shadow-green-500/25 group"
          >
            {t('button.viewAll')}
            <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </FadeInView>
      </div>

      {/* Lightbox d'affichage grand format */}
      <ImageModal
        isOpen={isLightboxOpen}
        onClose={closeLightbox}
        image={selectedImage?.image}
        video={selectedImage?.video}
        alt={selectedImage?.title}
        title={selectedImage?.title}
        description={selectedImage?.description || selectedImage?.category}
      />
    </section>
  );
}


