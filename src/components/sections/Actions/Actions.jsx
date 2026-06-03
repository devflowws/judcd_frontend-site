import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useLanguage } from '@context/LanguageContext';
import FadeInView from '@components/ui/Animations/FadeInView';
import { get } from '@services/api';
import { API } from '@utils/constants';

// ==========================================
// SECTION ACTIONS COMMUNAUTAIRES JUDCD
// ==========================================

export default function Actions() {
  const { t, language } = useLanguage();
  const [actions, setActions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const res = await get(API.endpoints.public.actions);
        const raw = Array.isArray(res?.data) ? res.data : (res?.data?.results || []);
        if (mounted) { setActions(raw); setLoading(false); }
      } catch {
        if (mounted) { setActions([]); setLoading(false); }
      }
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

  // Ne rien afficher si aucune action (évite une section vide)
  if (!loading && actions.length === 0) return null;

  return (
    <section id="actions" className="relative py-20 md:py-28 bg-[#001233] overflow-hidden">
      {/* Décor premium */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#008751]/20 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-[#FFD100]/10 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] border border-white/5 rounded-full" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] border border-white/5 rounded-full" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* En-tête */}
        <FadeInView className="text-center max-w-3xl mx-auto mb-14">
          <span className="inline-flex items-center gap-2 text-sm font-semibold text-[#FFD100] uppercase tracking-wider mb-4">
            <span className="w-8 h-px bg-[#FFD100]" />
            {t('actions.subtitle')}
            <span className="w-8 h-px bg-[#FFD100]" />
          </span>
          <h2 className="font-heading font-extrabold text-3xl md:text-4xl lg:text-5xl text-white mb-6 leading-tight">
            {t('actions.title')}
          </h2>
          <p className="text-white/60 text-lg leading-relaxed">
            {t('actions.description')}
          </p>
        </FadeInView>

        {/* Contenu */}
        {loading ? (
          <div className="text-center py-12 text-white/50">{t('actions.loading')}</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {actions.slice(0, 6).map((action, index) => (
              <FadeInView key={action.id} delay={index * 0.08}>
                <motion.article
                  whileHover={{ y: -6 }}
                  className="group relative rounded-2xl overflow-hidden bg-white/[0.03] border border-white/10 hover:border-[#008751]/40 transition-all duration-300 h-full flex flex-col"
                >
                  {/* Image */}
                  <div className="relative h-52 overflow-hidden bg-gradient-to-br from-[#008751]/20 to-[#002060]/40">
                    {action.image_couverture ? (
                      <img
                        src={action.image_couverture}
                        alt={action.titre}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        loading="lazy"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <svg className="w-14 h-14 text-white/15" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#001233] via-transparent to-transparent opacity-80" />

                    {/* Badge type */}
                    {action.type_action && (
                      <span className="absolute top-4 left-4 px-3 py-1 bg-[#008751] text-white text-xs font-semibold rounded-full shadow-lg">
                        {action.type_action}
                      </span>
                    )}

                    {/* Nombre de photos dans la galerie */}
                    {action.galerie && action.galerie.length > 0 && (
                      <span className="absolute top-4 right-4 inline-flex items-center gap-1 px-2.5 py-1 bg-black/40 backdrop-blur-sm text-white text-xs font-medium rounded-full">
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        {action.galerie.length}
                      </span>
                    )}
                  </div>

                  {/* Corps */}
                  <div className="flex-1 flex flex-col p-6">
                    <div className="flex items-center gap-4 text-xs text-white/40 mb-3">
                      {action.date && (
                        <span className="inline-flex items-center gap-1.5">
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          {formatDate(action.date)}
                        </span>
                      )}
                      {action.lieu && (
                        <span className="inline-flex items-center gap-1.5 truncate">
                          <svg className="w-3.5 h-3.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                          <span className="truncate">{action.lieu}</span>
                        </span>
                      )}
                    </div>

                    <h3 className="font-heading font-bold text-lg text-white mb-2 leading-snug group-hover:text-[#FFD100] transition-colors line-clamp-2">
                      {action.titre}
                    </h3>
                    <p className="text-white/50 text-sm leading-relaxed line-clamp-3">
                      {action.description}
                    </p>

                    {/* Miniatures galerie (images + vidéos) */}
                    {action.galerie && action.galerie.length > 0 && (
                      <div className="flex gap-2 mt-4 pt-4 border-t border-white/5">
                        {action.galerie.slice(0, 4).map((media, i) => (
                          <div key={i} className="relative w-10 h-10 rounded-lg overflow-hidden border border-white/10 flex-shrink-0 bg-black/30">
                            {media.thumb ? (
                              <img src={media.thumb} alt="" className="w-full h-full object-cover" loading="lazy" />
                            ) : (
                              <div className="w-full h-full bg-gradient-to-br from-[#008751]/30 to-[#002060]/40" />
                            )}
                            {media.type === 'video' && (
                              <div className="absolute inset-0 flex items-center justify-center">
                                <svg className="w-4 h-4 text-white drop-shadow" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
                              </div>
                            )}
                          </div>
                        ))}
                        {action.galerie.length > 4 && (
                          <div className="w-10 h-10 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-[10px] font-bold text-white/50">
                            +{action.galerie.length - 4}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </motion.article>
              </FadeInView>
            ))}
          </div>
        )}

        {/* CTA vers la galerie */}
        {!loading && actions.length > 0 && (
          <FadeInView className="text-center mt-14">
            <Link
              to="/galerie"
              className="inline-flex items-center gap-2 px-8 py-4 bg-[#008751] text-white font-bold rounded-xl hover:bg-[#006B41] transition-all duration-300 shadow-lg shadow-green-900/40 group"
            >
              {t('actions.viewAll')}
              <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </FadeInView>
        )}
      </div>
    </section>
  );
}
