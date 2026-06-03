import { useEffect, useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@context/LanguageContext';
import FadeInView from '@components/ui/Animations/FadeInView';
import { get } from '@services/api';
import { API } from '@utils/constants';

const PAGE_SIZE = 9;

export default function ActualitesPage() {
  const { t, language } = useLanguage();
  const navigate = useNavigate();

  const [allArticles, setAllArticles] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all'); // 'all' | type id
  const [currentPage, setCurrentPage] = useState(1);

  // Catégories (types) au montage
  useEffect(() => {
    (async () => {
      try {
        const res = await get(API.endpoints.typeActualite);
        const body = res?.data ?? {};
        setCategories(Array.isArray(body) ? body : (body?.results ?? []));
      } catch { setCategories([]); }
    })();
  }, []);

  // Tous les articles (une seule fois) depuis l'endpoint public
  useEffect(() => {
    let mounted = true;
    (async () => {
      setLoading(true);
      try {
        const res = await get(API.endpoints.public.actualites);
        const raw = Array.isArray(res?.data) ? res.data : (res?.data?.results ?? []);
        if (mounted) setAllArticles(raw);
      } catch { if (mounted) setAllArticles([]); }
      finally { if (mounted) setLoading(false); }
    })();
    return () => { mounted = false; };
  }, []);

  const formatDate = (d) => {
    if (!d) return '';
    try {
      return new Date(d).toLocaleDateString(language === 'en' ? 'en-GB' : 'fr-FR', {
        day: 'numeric', month: 'long', year: 'numeric',
      });
    } catch { return ''; }
  };

  // Filtrage (type + recherche) puis mapping
  const filtered = useMemo(() => {
    return allArticles
      .filter(a => selectedCategory === 'all' || String(a.type_actualite) === String(selectedCategory))
      .filter(a => {
        if (!search) return true;
        const q = search.toLowerCase();
        return (a.titre || '').toLowerCase().includes(q) || (a.description || '').toLowerCase().includes(q);
      })
      .map(a => ({
        pid: a.public_id || a.id,
        title: a.titre || 'Sans titre',
        excerpt: a.description ? a.description.slice(0, 130) + '…' : '',
        date: formatDate(a.date),
        image: a.image_couverture || '',
        category: a.type_actualite_details?.nom || 'Actualité',
        readTime: `${a.temps_lecture || 1} min`,
      }));
  }, [allArticles, selectedCategory, search, language]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const blogs = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  // Revenir page 1 quand le filtre/recherche change
  useEffect(() => { setCurrentPage(1); }, [selectedCategory, search]);

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
            {t('blogpage.title')}
          </h1>
          <p className="text-[#666666] text-lg max-w-2xl mx-auto">
            {t('blogpage.subtitle')}
          </p>
        </div>

        {/* Barre de recherche et Filtres */}
        <div className="flex flex-col md:flex-row gap-4 justify-between items-center mb-10 bg-white p-4 rounded-xl shadow-sm">
          {/* Recherche */}
          <div className="relative w-full md:w-80">
            <input
              type="text"
              placeholder={t('blogpage.searchPh')}
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
              {t('blogpage.all')}
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
            {t('blogpage.loading')}
          </div>
        ) : blogs.length === 0 ? (
          <div className="text-center py-20 text-gray-500">
            {t('blogpage.noMatch')}
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {blogs.map((actualite, index) => (
                <FadeInView key={actualite.pid || index} delay={index * 0.05}>
                  <motion.article
                    whileHover={{ y: -5 }}
                    onClick={() => navigate(`/actualites/${actualite.pid}`)}
                    className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 flex flex-col h-full cursor-pointer"
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
                        {t('blogpage.readMore')}
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
                  {t('blogpage.prev')}
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
                  {t('blogpage.next')}
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </main>
  );
}