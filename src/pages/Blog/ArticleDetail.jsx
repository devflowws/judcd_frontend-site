import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { get } from '@services/api';
import { API, ASSOCIATION } from '@utils/constants';
import { formatDate } from '@utils/formatters';
import { useLanguage } from '@context/LanguageContext';

export default function ArticleDetail() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [article, setArticle]   = useState(null);
  const [related, setRelated]   = useState([]);
  const [loading, setLoading]   = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    loadArticle();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [slug]);

  const loadArticle = async () => {
    setLoading(true);
    setNotFound(false);
    const res = await get(`${API.endpoints.public.actualites}${slug}/`);
    if (res.success && res.data && (res.data.public_id || res.data.id)) {
      setArticle(res.data);
      // Charger d'autres articles
      const allRes = await get(API.endpoints.public.actualites);
      const all = Array.isArray(allRes?.data) ? allRes.data : (allRes?.data?.results || []);
      const currentPid = res.data.public_id;
      setRelated(all.filter(a => a.public_id !== currentPid).slice(0, 3));
    } else {
      setNotFound(true);
    }
    setLoading(false);
  };

  if (loading) return (
    <main className="min-h-screen bg-white pt-24 pb-16">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        <div className="animate-pulse space-y-5">
          <div className="h-8 bg-gray-100 rounded-xl w-3/4" />
          <div className="h-5 bg-gray-100 rounded-xl w-1/3" />
          <div className="h-72 bg-gray-100 rounded-2xl" />
          <div className="space-y-3">
            {[1,2,3,4,5].map(i => <div key={i} className="h-4 bg-gray-100 rounded" style={{ width: `${85 - i * 5}%` }} />)}
          </div>
        </div>
      </div>
    </main>
  );

  if (notFound) return (
    <main className="min-h-screen bg-white flex items-center justify-center pt-24">
      <div className="text-center">
        <div className="w-20 h-20 bg-gray-50 rounded-3xl flex items-center justify-center mx-auto mb-6">
          <svg className="w-10 h-10 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
          </svg>
        </div>
        <h1 className="font-heading font-bold text-2xl text-[#002060] mb-3">Article introuvable</h1>
        <p className="text-gray-400 mb-8">Cet article n'existe pas ou a été supprimé.</p>
        <Link to="/actualites" className="inline-flex items-center gap-2 px-6 py-3 bg-[#008751] text-white font-semibold rounded-xl hover:bg-[#006B41] transition-all">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
          Retour aux actualités
        </Link>
      </div>
    </main>
  );

  return (
    <>
      <Helmet>
        <title>{article.titre} — {ASSOCIATION.name}</title>
        <meta name="description" content={article.description?.substring(0, 160)} />
      </Helmet>

      <main className="min-h-screen bg-white">
        {/* Hero image */}
        {article.image_couverture ? (
          <div className="relative h-72 sm:h-96 overflow-hidden">
            <img src={article.image_couverture} alt={article.titre} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-10 max-w-4xl mx-auto">
              <span className="inline-block px-3 py-1 bg-[#008751] text-white text-xs font-semibold rounded-full mb-3">
                {article.type_actualite_details?.nom || 'Actualité'}
              </span>
              <h1 className="font-heading font-extrabold text-2xl sm:text-4xl text-white leading-tight">
                {article.titre}
              </h1>
            </div>
          </div>
        ) : (
          <div className="pt-24 pb-8 bg-gradient-to-br from-[#002060]/5 to-[#008751]/5">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
              <span className="inline-block px-3 py-1 bg-[#008751]/10 text-[#008751] text-xs font-semibold rounded-full mb-4">
                {article.type_actualite_details?.nom || 'Actualité'}
              </span>
              <h1 className="font-heading font-extrabold text-3xl sm:text-4xl text-[#002060] leading-tight">
                {article.titre}
              </h1>
            </div>
          </div>
        )}

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          {/* Barre de navigation + meta */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-6 border-b border-gray-100">
            <Link to="/actualites" className="flex items-center gap-2 text-sm text-gray-400 hover:text-[#008751] transition-colors font-medium">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
              Toutes les actualités
            </Link>
            <div className="flex items-center gap-4 text-sm text-gray-400">
              <span className="flex items-center gap-1.5">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                {formatDate(article.date)}
              </span>
              {article.temps_lecture && (
                <span className="flex items-center gap-1.5">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                  {article.temps_lecture} {t('blogpage.readTime')}
                </span>
              )}
            </div>
          </div>

          {/* Contenu de l'article */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="prose prose-lg max-w-none"
          >
            <div className="text-gray-700 leading-relaxed text-base sm:text-lg whitespace-pre-wrap">
              {article.description}
            </div>
          </motion.div>

          {/* Partage */}
          <div className="mt-12 pt-8 border-t border-gray-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <p className="text-sm font-semibold text-gray-700 mb-2">Partager cet article</p>
              <div className="flex gap-2">
                {[
                  { label: 'Facebook', href: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`, color: '#1877F2' },
                  { label: 'Twitter/X', href: `https://twitter.com/intent/tweet?text=${encodeURIComponent(article.titre)}&url=${encodeURIComponent(window.location.href)}`, color: '#000' },
                  { label: 'WhatsApp', href: `https://wa.me/?text=${encodeURIComponent(article.titre + ' ' + window.location.href)}`, color: '#25D366' },
                ].map(s => (
                  <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer"
                    className="px-3 py-1.5 rounded-lg text-xs font-semibold text-white transition-opacity hover:opacity-80"
                    style={{ backgroundColor: s.color }}>
                    {s.label}
                  </a>
                ))}
              </div>
            </div>
            <Link to="/actualites" className="flex items-center gap-2 px-5 py-2.5 border border-gray-200 text-gray-600 text-sm font-semibold rounded-xl hover:border-[#008751] hover:text-[#008751] transition-all">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
              Retour
            </Link>
          </div>

          {/* Articles similaires */}
          {related.length > 0 && (
            <div className="mt-14">
              <h2 className="font-heading font-bold text-xl text-[#002060] mb-6">Autres actualités</h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                {related.map((a, i) => (
                  <motion.article key={a.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
                    className="bg-white border border-gray-100 rounded-2xl overflow-hidden hover:shadow-md transition-all group">
                    <div className="h-32 bg-gradient-to-br from-[#008751]/10 to-[#002060]/10 overflow-hidden">
                      {a.image_couverture && <img src={a.image_couverture} alt={a.titre} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />}
                    </div>
                    <div className="p-4">
                      <p className="font-semibold text-sm text-[#002060] line-clamp-2 mb-2">{a.titre}</p>
                      <p className="text-xs text-gray-400 mb-3">{formatDate(a.date)}</p>
                      <Link to={`/actualites/${a.public_id || a.id}`} className="text-xs font-semibold text-[#008751] hover:underline">
                        Lire la suite →
                      </Link>
                    </div>
                  </motion.article>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
    </>
  );
}
