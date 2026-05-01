import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ASSETS, ASSOCIATION } from '@utils/constants';
import { useLanguage } from '@context/LanguageContext';
import { DonateButton } from '@components/ui/Button/Button';

const navLinks = [
  { path: '/', label: 'nav.home' },
  { path: '/a-propos', label: 'nav.about' },
  { path: '/galerie', label: 'nav.gallery' },
  { path: '/actualites', label: 'nav.blog' },
  { path: '/contact', label: 'nav.contact' },
];

export default function Header() {
  const { t } = useLanguage();
  const location = useLocation();
  const isHomePage = location.pathname === '/';
  
  // Sur page d'accueil : transparent puis blanc au scroll
  // Sur autres pages : toujours blanc
  const [isScrolled, setIsScrolled] = useState(!isHomePage);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (isHomePage) {
      const handleScroll = () => {
        setIsScrolled(window.scrollY > 50);
      };
      window.addEventListener('scroll', handleScroll, { passive: true });
      return () => window.removeEventListener('scroll', handleScroll);
    } else {
      setIsScrolled(true);
    }
  }, [isHomePage]);

  // Fermer le menu mobile au changement de route
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location]);

  // Bloquer le scroll quand menu mobile ouvert
  useEffect(() => {
    document.body.style.overflow = isMobileMenuOpen ? 'hidden' : 'unset';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMobileMenuOpen]);

  return (
    <motion.header
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-500 ${
        isScrolled
          ? 'bg-white/95 backdrop-blur-md shadow-lg py-2'
          : 'bg-transparent py-4'
      }`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <img
              src={ASSETS.logo}
              alt={ASSOCIATION.name}
              className="h-12 md:h-14 w-auto transition-transform duration-300 group-hover:scale-105"
            />
            <div className="hidden lg:block">
              <span className={`font-heading font-extrabold text-lg transition-colors duration-300 ${
                isScrolled ? 'text-[#002060]' : 'text-white'
              }`}>
                {ASSOCIATION.name}
              </span>
              <p className={`text-xs font-medium transition-colors duration-300 ${
                isScrolled ? 'text-[#666666]' : 'text-white/80'
              }`}>
                {ASSOCIATION.slogan}
              </p>
            </div>
          </Link>

          {/* Navigation desktop */}
          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`relative px-4 py-2 font-medium text-sm transition-colors duration-300 rounded-lg ${
                    isScrolled
                      ? isActive ? 'text-[#008751]' : 'text-[#333333] hover:text-[#008751]'
                      : isActive ? 'text-[#FFD100]' : 'text-white hover:text-[#FFD100]'
                  }`}
                >
                  {t(link.label)}
                  {isActive && (
                    <motion.div
                      className="absolute bottom-0 left-1/2 -translate-x-1/2 w-6 h-0.5 rounded-full"
                      style={{ backgroundColor: isScrolled ? '#008751' : '#FFD100' }}
                      layoutId="activeNav"
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Actions desktop */}
          <div className="hidden lg:flex items-center gap-3">
            <Link
              to="/adherer"
              className={`px-5 py-2.5 rounded-lg font-semibold text-sm transition-all duration-300 ${
                isScrolled
                  ? 'border-2 border-[#008751] text-[#008751] hover:bg-[#008751] hover:text-white'
                  : 'border-2 border-white text-white hover:bg-white hover:text-[#008751]'
              }`}
            >
              {t('nav.join')}
            </Link>
            <DonateButton size="sm" to="/faire-un-don" />
          </div>

          {/* Bouton menu mobile */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden relative w-10 h-10 flex items-center justify-center"
            aria-label="Menu"
          >
            <div className="flex flex-col gap-1.5">
              <motion.span
                className={`block w-6 h-0.5 rounded-full transition-colors ${
                  isScrolled ? 'bg-[#002060]' : 'bg-white'
                }`}
                animate={isMobileMenuOpen ? { rotate: 45, y: 8 } : { rotate: 0, y: 0 }}
              />
              <motion.span
                className={`block w-6 h-0.5 rounded-full transition-colors ${
                  isScrolled ? 'bg-[#002060]' : 'bg-white'
                }`}
                animate={isMobileMenuOpen ? { opacity: 0 } : { opacity: 1 }}
              />
              <motion.span
                className={`block w-6 h-0.5 rounded-full transition-colors ${
                  isScrolled ? 'bg-[#002060]' : 'bg-white'
                }`}
                animate={isMobileMenuOpen ? { rotate: -45, y: -8 } : { rotate: 0, y: 0 }}
              />
            </div>
          </button>
        </div>
      </div>

      {/* Menu mobile */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            className="fixed inset-0 z-50 lg:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="absolute inset-0 bg-black/50"
              onClick={() => setIsMobileMenuOpen(false)}
            />
            <motion.div
              className="absolute right-0 top-0 h-full w-[85%] max-w-sm bg-white shadow-2xl"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            >
              <div className="flex flex-col h-full">
                <div className="p-6 border-b border-gray-100">
                  <div className="flex items-center justify-between mb-6">
                    <img src={ASSETS.logo} alt={ASSOCIATION.name} className="h-10 w-auto" />
                    <button
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="w-10 h-10 rounded-full hover:bg-gray-100 flex items-center justify-center"
                    >
                      <svg className="w-5 h-5 text-[#333333]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                  <p className="text-sm text-[#666666]">{ASSOCIATION.slogan}</p>
                </div>

                <nav className="flex-1 p-6 space-y-2 overflow-y-auto">
                  {navLinks.map((link, index) => {
                    const isActive = location.pathname === link.path;
                    return (
                      <motion.div
                        key={link.path}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                      >
                        <Link
                          to={link.path}
                          className={`block px-4 py-3 rounded-lg font-medium transition-all ${
                            isActive
                              ? 'bg-[#008751] text-white'
                              : 'text-[#333333] hover:bg-gray-50 hover:text-[#008751]'
                          }`}
                        >
                          {t(link.label)}
                        </Link>
                      </motion.div>
                    );
                  })}
                </nav>

                <div className="p-6 border-t border-gray-100 space-y-3">
                  <Link
                    to="/adherer"
                    className="block w-full text-center px-6 py-3 border-2 border-[#008751] text-[#008751] rounded-lg font-semibold hover:bg-[#008751] hover:text-white transition-all"
                  >
                    {t('nav.join')}
                  </Link>
                  <DonateButton fullWidth to="/faire-un-don">
                    {t('nav.donate')}
                  </DonateButton>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}