import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { ASSOCIATION } from '@utils/constants';
import { useLanguage } from '@context/LanguageContext';
import { useBlog } from '@hooks/useBlog';
import { ImageCard } from '@components/ui/Card/Card';
import { Spinner } from '@components/ui/Loader/Loader';
import FadeInView from '@components/ui/Animations/FadeInView';
import { formatDateShort, truncateText } from '@utils/helpers';

export default function BlogPage() {
  const { t } = useLanguage();
  const {
    posts,
    categories,
    isLoading,
    activeCategory,
    searchQuery,
    fetchPosts,
    fetchMetadata,
    changeCategory,
    search,
    nextPage,
    previousPage,
    page,
    totalPages,
  } = useBlog({ pageSize: 9 });

  const [searchInput, setSearchInput] = useState('');

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchPosts({ pageSize: 9 });
    fetchMetadata();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    search(searchInput);
  };

  return (
    <>
      <Helmet>
        <title>Actualités - {ASSOCIATION.name}</title>
        <meta name="description" content="Restez informé des dernières actualités, événements et projets de JUDCD." />
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
            <div className="absolute top-0 right-0 w-72 h-72 border-2 border-white rounded-full translate-x-1/4 -translate-y-1/4" />
            <div className="absolute bottom-0 left-0 w-56 h-56 border border-white rounded-full -translate-x-1/4 translate-y-1/4" />
          </div>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative text-center">
            <motion.h1
              className="font-heading font-extrabold text-4xl md:text-5xl lg:text-6xl mb-6"
              initial={{ y: -30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              Actualités
            </motion.h1>
            <motion.p
              className="text-white/80 text-lg max-w-3xl mx-auto"
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              Restez informé de nos activités, projets et événements
            </motion.p>
          </div>
        </section>

        {/* Filtres et recherche */}
        <section className="py-8 bg-white border-b border-gray-100 sticky top-20 z-30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
              {/* Catégories */}
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => changeCategory(null)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    !activeCategory || activeCategory === 'all'
                      ? 'bg-[#008751] text-white'
                      : 'bg-gray-100 text-[#666666] hover:bg-gray-200'
                  }`}
                >
                  Tous les articles
                </button>
                {categories.map((cat) => (
                  <button
                    key={cat.slug || cat.id}
                    onClick={() => changeCategory(cat.slug || cat.name)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                      activeCategory === (cat.slug || cat.name)
                        ? 'bg-[#008751] text-white'
                        : 'bg-gray-100 text-[#666666] hover:bg-gray-200'
                    }`}
                  >
                    {cat.name}
                  </button>
                ))}
              </div>

              {/* Barre de recherche */}
              <form onSubmit={handleSearch} className="flex gap-2">
                <input
                  type="text"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  placeholder="Rechercher un article..."
                  className="px-4 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#008751] focus:ring-2 focus:ring-green-100 w-64"
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#008751] text-white rounded-xl hover:bg-[#006B41] transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </button>
              </form>
            </div>
          </div>
        </section>

        {/* Liste des articles */}
        <section className="py-16 bg-[#F8FAF9] min-h-[60vh]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {isLoading ? (
              <div className="flex justify-center py-20">
                <Spinner size="lg" />
              </div>
            ) : posts.length === 0 ? (
              <div className="text-center py-20">
                <svg className="w-20 h-20 mx-auto mb-6 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                </svg>
                <h3 className="font-heading font-bold text-xl text-[#333333] mb-2">Aucun article trouvé</h3>
                <p className="text-[#666666]">
                  {searchQuery ? 'Aucun résultat pour votre recherche.' : 'Les articles seront bientôt publiés.'}
                </p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {posts.map((post, index) => (
                    <FadeInView key={post.id} delay={index * 0.1}>
                      <ImageCard
                        to={`/actualites/${post.slug}`}
                        image={post.cover_image}
                        alt={post.title}
                        title={post.title}
                        description={truncateText(post.excerpt || post.content, 150)}
                        date={formatDateShort(post.published_at)}
                        category={post.category?.name}
                        author={post.author?.name}
                      />
                    </FadeInView>
                  ))}
                </div>

                {/* Pagination */}
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
                      Page {page} sur {totalPages}
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
    </>
  );
}