import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '@context/LanguageContext';
import FadeInView from '@components/ui/Animations/FadeInView';
import { getActualites } from '../../../services/blogService';

// ==========================================
// SECTION ACTUALITÉS JUDCD
// ==========================================

export default function Blog() {
  const { t } = useLanguage();
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const fetchActualites = async () => {
      try {
        const response = await getActualites();
        console.log("ACTUALITES..: ", response);
        const rawdata = response && response.data ? response.data : [];

        const mappedData = rawdata.map(actualite => ({
          id: actualite.id,
          title: actualite.titre || "Sans titre", // Harmonisation avec le JSX plus bas
          excerpt: actualite.description ? actualite.description.substring(0, 120) + '...' : "", 
          date: actualite.date || "",
          image: actualite.image_couverture || "",
          category: actualite.categorie || "Actualité", // Valeur par défaut si absent de l'API
          readTime: actualite.temps_lecture || "3 min" // Valeur par défaut si absent de l'API
        }));

        if (isMounted) {
          setBlogs(mappedData);
          setLoading(false);
        }
      } catch (error) {
        console.error("Erreur lors de la récupération des actualités :", error);
        if (isMounted) setLoading(false);
      }
    };

    fetchActualites();
    return () => { isMounted = false; };
  }, []);

  if (loading) {
    return <div className="text-center py-20 text-[#002060] font-semibold">Chargement des actualités...</div>;
  }

  return (
    <section className="py-20 md:py-28 bg-[#F8FAF9] relative overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-20 right-20 w-40 h-40 bg-[#008751] rounded-full" />
        <div className="absolute bottom-20 left-20 w-32 h-32 bg-[#FFD100] rounded-full" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* En-tête */}
        <FadeInView className="text-center mb-16">
          <span className="text-sm font-semibold text-[#008751] uppercase tracking-wider mb-3 block">
            {t('section.blog')}
          </span>
          <h2 className="font-heading font-extrabold text-3xl md:text-4xl lg:text-5xl text-[#002060] mb-6 leading-tight">
            Actualités & Événements
          </h2>
          <p className="text-[#666666] text-lg max-w-3xl mx-auto">
            Découvrez nos dernières actualités, événements et initiatives qui font avancer notre mission
          </p>
        </FadeInView>

        {/* Grille d'articles */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogs.map((actualite, index) => (
            <FadeInView key={actualite.id || index} delay={index * 0.1}>
              <motion.article
                whileHover={{ y: -5 }}
                className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300"
              >
                {/* Image */}
                <div className="relative h-48 bg-gradient-to-br from-[#008751] to-[#002060]">
                  <div className="absolute inset-0 flex items-center justify-center">
                    {actualite.image ? (
                      <img src={actualite.image} alt={actualite.title} className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-white/20 text-6xl font-bold">
                        {actualite.category?.charAt(0)}
                      </span>
                    )}
                  </div>
                  {/* Catégorie */}
                  <div className="absolute top-4 left-4">
                    <span className="px-3 py-1 bg-[#008751] text-white text-xs font-semibold rounded-full">
                      {actualite.category}
                    </span>
                  </div>
                </div>

                {/* Contenu */}
                <div className="p-6">
                  {/* Date et temps de lecture */}
                  <div className="flex items-center gap-4 text-sm text-[#666666] mb-3">
                    <time>{actualite.date}</time>
                    <span>•</span>
                    <span>{actualite.readTime}</span>
                  </div>

                  {/* Titre */}
                  <h3 className="font-heading font-bold text-xl text-[#002060] mb-3 leading-tight">
                    {actualite.title}
                  </h3>

                  {/* Extrait */}
                  <p className="text-[#666666] mb-4 line-clamp-3">
                    {actualite.excerpt}
                  </p>

                  {/* Bouton */}
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="inline-flex items-center gap-2 text-[#008751] font-semibold hover:text-[#006B41] transition-colors"
                  >
                    Lire la suite
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </motion.button>
                </div>
              </motion.article>
            </FadeInView>
          ))}
        </div>

        {/* Bouton voir tout */}
        <FadeInView className="text-center mt-12">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="inline-flex items-center gap-2 px-8 py-4 bg-[#008751] text-white font-bold rounded-xl hover:bg-[#006B41] transition-all duration-300 shadow-lg shadow-green-500/25 hover:shadow-green-500/40"
          >
            Voir toutes les actualités
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </motion.button>
        </FadeInView>
      </div>
    </section>
  );
}