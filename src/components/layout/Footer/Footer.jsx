import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ASSETS, ASSOCIATION, PAGE_CONTENT, SOCIAL_LINKS } from '@utils/constants';
import { formatPhoneNumber, formatPhoneLink } from '@utils/formatters';
import { useLanguage } from '@context/LanguageContext';

// ==========================================
// FOOTER JUDCD - Pied de page
// ==========================================

const quickLinks = [
  { path: '/', label: 'nav.home' },
  { path: '/a-propos', label: 'nav.about' },
  { path: '/galerie', label: 'nav.gallery' },
  { path: '/actualites', label: 'nav.blog' },
  { path: '/contact', label: 'nav.contact' },
  { path: '/adherer', label: 'nav.join' },
];

export default function Footer() {
  const { t } = useLanguage();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#002060] text-white">
      {/* Section principale */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          
          {/* Colonne 1 - Logo & Description */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="lg:col-span-1"
          >
            <Link to="/" className="inline-block mb-4">
              <img
                src={ASSETS.logo}
                alt={ASSOCIATION.name}
                className="h-16 w-auto brightness-0 invert"
              />
            </Link>
            <p className="text-white/70 text-sm leading-relaxed mb-6">
              {t('footer.description')}
            </p>
            {/* Reseaux sociaux */}
            <div className="flex gap-3">
              {SOCIAL_LINKS.tiktok && (
                <a
                  href={SOCIAL_LINKS.tiktok}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-white/10 hover:bg-[#008751] flex items-center justify-center transition-all duration-300 hover:scale-110"
                  aria-label="TikTok"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/>
                  </svg>
                </a>
              )}
            </div>
          </motion.div>

          {/* Colonne 2 - Liens rapides */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <h4 className="font-heading font-bold text-lg mb-6 relative inline-block">
              {t('footer.quickLinks')}
              <span className="absolute -bottom-2 left-0 w-8 h-0.5 bg-[#FFD100] rounded-full" />
            </h4>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="text-white/70 hover:text-[#FFD100] transition-colors duration-300 text-sm flex items-center gap-2 group"
                  >
                    <svg className="w-4 h-4 text-[#FFD100] opacity-0 group-hover:opacity-100 transition-all -ml-6 group-hover:ml-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                    {t(link.label)}
                  </Link>
                </li>
              ))}
              <li>
                <a
                  href={SOCIAL_LINKS.tiktok || '#'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white/70 hover:text-[#FFD100] transition-colors duration-300 text-sm flex items-center gap-2 group"
                >
                  <svg className="w-4 h-4 text-[#FFD100] opacity-0 group-hover:opacity-100 transition-all -ml-6 group-hover:ml-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                  TikTok
                </a>
              </li>
            </ul>
          </motion.div>

          {/* Colonne 3 - Contact */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <h4 className="font-heading font-bold text-lg mb-6 relative inline-block">
              {t('footer.contact')}
              <span className="absolute -bottom-2 left-0 w-8 h-0.5 bg-[#FFD100] rounded-full" />
            </h4>
            <ul className="space-y-4">
              <li>
                <a
                  href={`tel:${formatPhoneLink(ASSOCIATION.phone)}`}
                  className="text-white/70 hover:text-[#FFD100] transition-colors duration-300 text-sm flex items-start gap-3"
                >
                  <svg className="w-5 h-5 flex-shrink-0 mt-0.5 text-[#FFD100]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  <span>{formatPhoneNumber(ASSOCIATION.phone)}</span>
                </a>
              </li>
              <li>
                <a
                  href={`mailto:${ASSOCIATION.email}`}
                  className="text-white/70 hover:text-[#FFD100] transition-colors duration-300 text-sm flex items-start gap-3"
                >
                  <svg className="w-5 h-5 flex-shrink-0 mt-0.5 text-[#FFD100]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <span>{ASSOCIATION.email}</span>
                </a>
              </li>
              <li className="text-white/70 text-sm flex items-start gap-3">
                <svg className="w-5 h-5 flex-shrink-0 mt-0.5 text-[#FFD100]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span>{ASSOCIATION.address}, {ASSOCIATION.city}, {ASSOCIATION.country}</span>
              </li>
            </ul>
          </motion.div>

          {/* Colonne 4 - Newsletter */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <h4 className="font-heading font-bold text-lg mb-6 relative inline-block">
              {t('footer.newsletter')}
              <span className="absolute -bottom-2 left-0 w-8 h-0.5 bg-[#FFD100] rounded-full" />
            </h4>
            <p className="text-white/70 text-sm mb-4">
              Restez informe de nos actions et evenements.
            </p>
            <form className="space-y-3" onSubmit={(e) => e.preventDefault()}>
              <div className="relative">
                <input
                  type="email"
                  placeholder={t('footer.newsletter.placeholder')}
                  className="w-full px-4 py-3 pr-12 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 text-sm focus:outline-none focus:border-[#FFD100] transition-colors"
                />
                <button
                  type="submit"
                  className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-[#FFD100] rounded-lg flex items-center justify-center hover:bg-[#FFE44D] transition-colors"
                  aria-label={t('footer.newsletter.subscribe')}
                >
                  <svg className="w-4 h-4 text-[#002060]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </button>
              </div>
            </form>
            <p className="text-white/40 text-xs mt-4">
              En vous inscrivant, vous acceptez de recevoir nos actualites.
            </p>
          </motion.div>

        </div>
      </div>

      {/* Barre inferieure */}
      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-white/50 text-sm">
              &copy; {currentYear} {ASSOCIATION.fullName}. {t('footer.rights')}
            </p>
            <div className="flex gap-6">
              <Link to="/mentions-legales" className="text-white/50 hover:text-[#FFD100] text-sm transition-colors">
                {t('footer.legal')}
              </Link>
              <Link to="/politique-confidentialite" className="text-white/50 hover:text-[#FFD100] text-sm transition-colors">
                {t('footer.privacy')}
              </Link>
              <span className="text-white/30 text-sm">
                Propulse par MIABEINNOVATION
              </span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}