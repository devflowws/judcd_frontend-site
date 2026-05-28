import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '@context/LanguageContext';
import FadeInView from '@components/ui/Animations/FadeInView';
import { getTypeActualites, getActualites } from '../../services/blogService';
//  getActualites, getTypeActualites 
export default function ActualitesPage() {
  const { t } = useLanguage();
  
  // États pour les données
  const [blogs, setBlogs] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // États pour les filtres et la pagination
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // 1. Récupération des catégories (une seule fois au montage)
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await getTypeActualites();
        const data = response && response.data ? response.data : response || [];
        setCategories(data);
      } catch (error) {
        console.error("Erreur catégories :", error);
      }
    };
    fetchCategories();
  }, []);

  // 2. Récupération des actualités (re-déclenchée à chaque changement de filtre ou page)
  useEffect(() => {
    let isMounted = true;
    setLoading(true);

    const fetchFilteredActualites = async () => {
      try {
        const params = {
          page: currentPage,
          search: search || undefined,
          // Si ton backend Django supporte le filtrage par clé étrangère (ex: django-filter) :
          type_actualite: selectedCategory !== 'all' ? selectedCategory : undefined
        };

        const response = await getActualites(params);
        
        // Django Rest Framework renvoie souvent { count, next, previous, results: [...] } lors d'une pagination
        const rawData = response && response.results ? response.results : (response.data || response || []);
        
        // Calcul des pages si l'info est fournie par DRF (ex: 9 éléments par page)
        if (response.count) {
          setTotalPages(Math.ceil(response.count / 9));
        }

        const mappedData = rawData.map(actualite => ({
          id: actualite.id,
          title: actualite.titre || "Sans titre",
          excerpt: actualite.description ? actualite.description.substring(0, 120) + '...' : "", 
          date: actualite.date ? new Date(actualite.date).toLocaleDateString() : "",
          image: actualite.image_couverture || "",
          category: actualite.type_actualite_details?.nom || "Actualité",
          readTime: "3 min" 
        }));

        if (isMounted) {
          setBlogs(mappedData);
          setLoading(false);
        }
      } catch (error) {
        console.error("Erreur actualités :", error);
        if (isMounted) setLoading(false);
      }
    };

    // Petit debounce optionnel pour la recherche textuelle afin d'éviter de spammer l'API
    const delayDebounceFn = setTimeout(() => {
      fetchFilteredActualites();
    }, 300);

    return () => {
      isMounted = false;
      clearTimeout(delayDebounceFn);
    };
  }, [currentPage, search, selectedCategory]);

  // Réinitialiser la page si on change de filtre
  const handleCategoryChange = (id) => {
    setSelectedCategory(id);
    setCurrentPage(1);
  };

  return (
    <main className="min-h-screen bg-[#F8FAF9] pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* En-tête de la page */}
        <div className="text-center mb-12">
          <h1 className="font-heading font-extrabold text-4xl md:text-5xl text-[#002060] mb-4">
            Notre Actualité
          </h1>
          <p className="text-[#666666] text-lg max-w-2xl mx-auto">
            Suivez en temps réel toutes les activités, revues de presse et rapports de la JUDCD.
          </p>
        </div>

        {/* Barre de recherche et Filtres */}
        <div className="flex flex-col md:flex-row gap-4 justify-between items-center mb-10 bg-white p-4 rounded-xl shadow-sm">
          {/* Recherche */}
          <div className="relative w-full md:w-80">
            <input
              type="text"
              placeholder="Rechercher un article..."
              value={search}
              onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
              className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:border-[#008751] text-sm"
            />
            <span className="absolute right-3 top-3 text-gray-400">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
            </span>
          </div>

          {/* Catégories (Onglets) */}
          <div className="flex flex-wrap gap-2 w-full md:w-auto justify-start md:justify-end">
            <button
              onClick={() => handleCategoryChange('all')}
              className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
                selectedCategory === 'all' 
                  ? 'bg-[#008751] text-white' 
                  : 'bg-gray-100 text-[#002060] hover:bg-gray-200'
              }`}
            >
              Tout voir
            </button>
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => handleCategoryChange(cat.id)}
                className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
                  selectedCategory === cat.id 
                    ? 'bg-[#008751] text-white' 
                    : 'bg-gray-100 text-[#002060] hover:bg-gray-200'
                }`}
              >
                {cat.nom}
              </button>
            ))}
          </div>
        </div>

        {/* Grille ou loader */}
        {loading ? (
          <div className="text-center py-20 text-[#002060] font-semibold flex flex-col items-center gap-3">
            <div className="w-10 h-10 border-4 border-[#008751] border-t-transparent rounded-full animate-spin"></div>
            Chargement des articles...
          </div>
        ) : blogs.length === 0 ? (
          <div className="text-center py-20 text-gray-500">
            Aucun article ne correspond à vos critères de recherche.
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {blogs.map((actualite, index) => (
                <FadeInView key={actualite.id || index} delay={index * 0.05}>
                  <motion.article
                    whileHover={{ y: -5 }}
                    className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 flex flex-col h-full"
                  >
                    {/* Image */}
                    <div className="relative h-48 bg-gradient-to-br from-[#008751] to-[#002060] shrink-0">
                      {actualite.image ? (
                        <img src={actualite.image} alt={actualite.title} className="w-full h-full object-cover" />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center text-white/20 text-5xl font-bold">
                          {actualite.category?.charAt(0)}
                        </div>
                      )}
                      <div className="absolute top-4 left-4">
                        <span className="px-3 py-1 bg-[#008751] text-white text-xs font-semibold rounded-full">
                          {actualite.category}
                        </span>
                      </div>
                    </div>

                    {/* Corps de la carte */}
                    <div className="p-6 flex flex-col flex-grow">
                      <div className="flex items-center gap-4 text-xs text-[#666666] mb-3">
                        <time>{actualite.date}</time>
                        <span>•</span>
                        <span>{actualite.readTime}</span>
                      </div>

                      <h3 className="font-heading font-bold text-lg text-[#002060] mb-2 line-clamp-2 min-h-[3.5rem]">
                        {actualite.title}
                      </h3>

                      <p className="text-[#666666] text-sm mb-6 line-clamp-3 flex-grow">
                        {actualite.excerpt}
                      </p>

                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="inline-flex items-center gap-2 text-[#008751] font-semibold text-sm hover:text-[#006B41] transition-colors mt-auto"
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

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-2 mt-12">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="p-2 rounded-lg bg-white border border-gray-200 text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                >
                  Précédent
                </button>
                {[...Array(totalPages)].map((_, i) => (
                  <button
                    key={i + 1}
                    onClick={() => setCurrentPage(i + 1)}
                    className={`w-10 h-10 rounded-lg text-sm font-semibold transition-all ${
                      currentPage === i + 1
                        ? 'bg-[#008751] text-white'
                        : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
                <button
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="p-2 rounded-lg bg-white border border-gray-200 text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                >
                  Suivant
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </main>
  );
}