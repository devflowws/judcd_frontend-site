import { useState, useEffect } from 'react'; // <-- 1. Import de useEffect ajouté
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '@context/LanguageContext';
import FadeInView from '@components/ui/Animations/FadeInView';
import { getTemoignages } from '../../../services/temoignageService';

// ==========================================
// SECTION TEMOIGNAGES JUDCD
// ==========================================

export default function Testimonials() {
  const { t } = useLanguage();
  const [currentIndex, setCurrentIndex] = useState(0);
  // 2. Initialisation avec un tableau vide [] pour éviter le crash au démarrage
  const [testimonials, setTestimonials] = useState([]); 
  const [loading, setLoading] = useState(true); // Optionnel : pour gérer l'état de chargement

  useEffect(() => {
    let isMounted = true;

    const fetchBackendTestimonials = async () => {
      try {
        const response = await getTemoignages();
        const rawdata = response && response.data ? response.data : [];

        const mappedData = rawdata.map(testimonial => ({
          "name": testimonial.nom || 'Anonyme',
          "role": testimonial.titre || '',
          "content": testimonial.message || '',
          "avatar": testimonial.photo,
          "rating": testimonial.note || 5
        }));

        if (isMounted) {
          setTestimonials(mappedData);
          setLoading(false);
        }
      } catch (error) {
        console.error("Erreur lors de la récupération des témoignages :", error);
        if (isMounted) {
          setLoading(false); // Nettoyage des anciennes fonctions partenaires ici
        }
      }
    };

    fetchBackendTestimonials(); // 3. Appel de la BONNE fonction ici !
    return () => { isMounted = false; };
  }, []);

  const next = () => {
    if (testimonials.length === 0) return;
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const previous = () => {
    if (testimonials.length === 0) return;
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  // Sécurité anti-crash : on ne lit l'index que s'il y a des données
  const currentTestimonial = testimonials[currentIndex];

  // Si l'API charge ou s'il n'y a aucun témoignage à afficher
  if (loading || testimonials.length === 0) {
    return (
      <section className="py-20 bg-white text-center text-gray-500">
        Chargement des témoignages...
      </section>
    );
  }

  return (
    <section className="py-20 md:py-28 bg-white relative overflow-hidden">
      {/* Fond décoratif */}
      <div className="absolute inset-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#008751]/3 rounded-full blur-3xl" />
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        
        {/* En-tête */}
        <FadeInView className="text-center mb-16">
          <span className="text-sm font-semibold text-[#008751] uppercase tracking-wider mb-3 block">
            {t('section.testimonials')}
          </span>
          <h2 className="font-heading font-extrabold text-3xl md:text-4xl lg:text-5xl text-[#002060] mb-6 leading-tight">
            Ce qu'ils disent de nous
          </h2>
          <p className="text-[#666666] text-lg">
            Découvrez les témoignages de ceux qui ont bénéficié de nos actions
          </p>
        </FadeInView>

        {/* Carrousel de témoignages */}
        <div className="relative">
          {/* Grands guillemets */}
          <svg className="absolute -top-8 -left-4 w-24 h-24 text-[#008751]/10" fill="currentColor" viewBox="0 0 24 24">
            <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
          </svg>

          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              transition={{ duration: 0.4 }}
              className="text-center px-8 md:px-16"
            >
              {/* Étoiles */}
              <div className="flex justify-center gap-1 mb-6">
                {Array.from({ length: 5 }).map((_, i) => (
                  <svg
                    key={i}
                    className={`w-6 h-6 ${i < currentTestimonial.rating ? 'text-[#FFD100]' : 'text-gray-300'}`}
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>

              {/* Contenu */}
              <blockquote className="text-xl md:text-2xl text-[#333333] leading-relaxed mb-8 font-medium italic">
                "{currentTestimonial.content}"
              </blockquote>

              {/* Auteur */}
              <div className="flex items-center justify-center gap-4">
                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[#008751] to-[#002060] flex items-center justify-center text-white font-bold text-xl">
                  {currentTestimonial.name ? currentTestimonial.name.charAt(0) : '?'}
                </div>
                <div className="text-left">
                  <p className="font-heading font-bold text-[#002060] text-lg">
                    {currentTestimonial.name}
                  </p>
                  <p className="text-sm text-[#008751] font-semibold">
                    {currentTestimonial.role}
                  </p>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Navigation */}
          {testimonials.length > 1 && (
            <div className="flex justify-center items-center gap-4 mt-10">
              <button
                onClick={previous}
                className="w-12 h-12 rounded-full border-2 border-[#008751] text-[#008751] hover:bg-[#008751] hover:text-white flex items-center justify-center transition-all group"
                aria-label="Témoignage précédent"
              >
                <svg className="w-5 h-5 group-hover:-translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              
              {/* Indicateurs */}
              <div className="flex gap-2">
                {testimonials.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentIndex(index)}
                    className={`transition-all duration-300 rounded-full ${
                      index === currentIndex
                        ? 'w-8 h-3 bg-[#008751]'
                        : 'w-3 h-3 bg-gray-300 hover:bg-gray-400'
                    }`}
                    aria-label={`Témoignage ${index + 1}`}
                  />
                ))}
              </div>

              <button
                onClick={next}
                className="w-12 h-12 rounded-full border-2 border-[#008751] text-[#008751] hover:bg-[#008751] hover:text-white flex items-center justify-center transition-all group"
                aria-label="Témoignage suivant"
              >
                <svg className="w-5 h-5 group-hover:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}