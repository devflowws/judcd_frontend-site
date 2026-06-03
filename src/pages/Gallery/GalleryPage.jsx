import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { ASSOCIATION } from '@utils/constants';
import { useLanguage } from '@context/LanguageContext';
import { useGallery } from '@hooks/useGallery';
import { ImageModal } from '@components/ui/Modal/Modal';
import { Spinner } from '@components/ui/Loader/Loader';
import FadeInView from '@components/ui/Animations/FadeInView';

export default function GalleryPage() {
  const { t } = useLanguage();
  const { 
    photos, 
    isLoading, 
    activeCategory, 
    changeCategory, 
    fetchPhotos, 
    nextPage, 
    previousPage, 
    page, 
    totalPages 
  } = useGallery();
  
  const [selectedImage, setSelectedImage] = useState(null);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [categories, setCategories] = useState(['all']);

  // Chargement initial des photos de la page globale
  useEffect(() => {
    window.scrollTo(0, 0);
    fetchPhotos({ pageSize: 12, page: 1 });
  }, [fetchPhotos]);

  // Extraction dynamique des filtres de catégories basés sur la réponse de l'API
  useEffect(() => {
    if (photos && photos.length > 0) {
      const uniqueCategories = [
        'all',
        ...new Set(photos.map(p => p.category).filter(Boolean))
      ];
      
      // On fige la liste des boutons uniquement lorsque l'utilisateur est sur l'onglet global "all"
      // afin d'éviter que les autres boutons disparaissent lorsqu'un filtre restrictif est appliqué
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

  const handleCategoryChange = (category) => {
    const targetCategory = category === 'all' ? null : category;
    changeCategory(targetCategory);
  };

  return (
    <>
      <Helmet>
        <title>{t('section.gallery')} - {ASSOCIATION.name}</title>
        <meta name="description" content={t('gallery.description')} />
      </Helmet>

      <motion.main
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="pt-24"
      >
        {/* Bannière */}
        <section className="relative py-20 bg-gradient-to-br from-[#002060] to-[#008751] text-white overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 border-2 border-white rounded-full" />
          </div>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative text-center">
            <motion.h1
              className="font-heading font-extrabold text-4xl md:text-5xl lg:text-6xl mb-6"
              initial={{ y: -30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              {t('section.gallery')}
            </motion.h1>
            <motion.p
              className="text-white/80 text-lg max-w-3xl mx-auto"
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              {t('gallerypage.desc')}
            </motion.p>
          </div>
        </section>

        {/* Filtres collants */}
        <section className="py-10 bg-white border-b border-gray-100 sticky top-20 z-30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-wrap justify-center gap-3">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => handleCategoryChange(category)}
                  className={`px-5 py-2.5 rounded-full font-medium text-sm transition-all duration-300 ${
                    (category === 'all' && !activeCategory) || activeCategory === category
                      ? 'bg-[#008751] text-white shadow-lg shadow-green-500/25'
                      : 'bg-gray-100 text-[#666666] hover:bg-gray-200 hover:text-[#333333]'
                  }`}
                >
                  {category === 'all' ? t('gallery.all') : category}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Grille principale */}
        <section className="py-16 bg-[#F8FAF9] min-h-[60vh]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {isLoading ? (
              <div className="flex justify-center py-20">
                <Spinner size="lg" />
              </div>
            ) : photos.length === 0 ? (
              <div className="text-center py-20">
                <svg className="w-20 h-20 mx-auto mb-6 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <h3 className="font-heading font-bold text-xl text-[#333333] mb-2">{t('gallerypage.empty.h')}</h3>
                <p className="text-[#666666]">{t('gallerypage.empty.text')}</p>
              </div>
            ) : (
              <>
                <motion.div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4" layout>
                  <AnimatePresence mode="popLayout">
                    {photos.map((photo) => (
                      <motion.div
                        key={photo.id}
                        layout
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        transition={{ duration: 0.4 }}
                        className="group relative aspect-[4/3] rounded-xl overflow-hidden cursor-pointer shadow-lg hover:shadow-xl bg-white"
                        onClick={() => openLightbox(photo)}
                      >
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

                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
                          <h4 className="text-white font-bold text-sm mb-1">{photo.title || 'Sans titre'}</h4>
                          {photo.category && (
                            <span className="text-[#FFD100] text-xs font-medium">{photo.category}</span>
                          )}
                        </div>

                        <div className="absolute top-3 right-3 w-8 h-8 bg-white/90 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 transform group-hover:scale-100 scale-75">
                          <svg className="w-4 h-4 text-[#002060]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                          </svg>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </motion.div>

                {/* Barre de Pagination Django Rest Framework */}
                {totalPages > 1 && (
                  <div className="flex justify-center items-center gap-4 mt-12">
                    <button
                      onClick={previousPage}
                      disabled={page <= 1}
                      className="w-12 h-12 rounded-full border-2 border-[#008751] text-[#008751] hover:bg-[#008751] hover:text-white flex items-center justify-center transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                      </svg>
                    </button>
                    
                    <span className="text-[#666666] font-medium">
                      {t('gallerypage.page')} {page} {t('gallerypage.of')} {totalPages}
                    </span>
                    
                    <button
                      onClick={nextPage}
                      disabled={page >= totalPages}
                      className="w-12 h-12 rounded-full border-2 border-[#008751] text-[#008751] hover:bg-[#008751] hover:text-white flex items-center justify-center transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </section>
      </motion.main>

      {/* Lightbox */}
      <ImageModal
        isOpen={isLightboxOpen}
        onClose={closeLightbox}
        image={selectedImage?.image}
        video={selectedImage?.video}
        alt={selectedImage?.title}
        title={selectedImage?.title}
        description={selectedImage?.description || selectedImage?.category}
      />
    </>
  );
}