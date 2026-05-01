import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ASSOCIATION } from '@utils/constants';
import { useLanguage } from '@context/LanguageContext';
import { DonateButton } from '@components/ui/Button/Button';

// ==========================================
// SECTION HERO JUDCD - Bannière principale
// ==========================================

export default function Hero() {
  const { t } = useLanguage();

  return (
    <section className="relative min-h-[100svh] overflow-hidden flex items-center">
      {/* Fond parallaxe */}
      <div className="absolute inset-0">
        <img 
          // src="https://images.unsplash.com/photo-1529156069898-49953e39b3ac?q=80&w=1932&auto=format&fit=crop"
          src='/assets/images/hero-1.jpg'
          alt="Jeunesse africaine engagée"
          className="absolute inset-0 w-full h-full object-cover"
          onError={(e) => {
            e.target.style.display = 'none';
            e.target.parentElement.style.background = 'linear-gradient(135deg, #008751 0%, #002060 100%)';
          }}
        />
        {/* Overlay dégradé */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/80" />
      </div>
      
      {/* Contenu */}
      <div className="relative z-10 w-full py-24 md:py-28 lg:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
              
            {/* Badge JUDCD */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-[#008751]/20 backdrop-blur-sm border border-[#008751]/30 rounded-full mb-6 md:mb-8"
            >
              <span className="w-2 h-2 bg-[#FFD100] rounded-full animate-pulse flex-shrink-0" />
              <span className="text-[#FFD100] text-xs sm:text-sm font-semibold whitespace-nowrap">
                {ASSOCIATION.name}
              </span>
            </motion.div>

            {/* Titre principal */}
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="font-heading font-extrabold text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl text-white leading-[1.1] sm:leading-tight mb-4 sm:mb-6"
            >
              {t('hero.title')}
            </motion.h1>

            {/* Sous-titre */}
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="text-base sm:text-lg md:text-xl lg:text-2xl text-white/80 mb-8 sm:mb-10 leading-relaxed max-w-2xl"
            >
              {t('hero.subtitle')}
            </motion.p>

            {/* Boutons CTA */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
              className="flex flex-col sm:flex-row gap-3 sm:gap-4 w-full sm:w-auto"
            >
              <Link
                to="/a-propos"
                className="inline-flex items-center justify-center px-6 py-3.5 bg-[#008751] text-white font-bold rounded-xl hover:bg-[#006B41] transition-all duration-300 shadow-lg shadow-green-500/25 hover:shadow-green-500/40 hover:-translate-y-1 group text-sm w-full sm:w-auto"
              >
                {t('hero.cta.primary')}
                <svg className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
              
              <div className="w-full sm:w-auto">
                <DonateButton size="lg" to="/faire-un-don" className="w-full sm:w-auto text-sm">
                  {t('hero.cta.secondary')}
                </DonateButton>
              </div>
            </motion.div>

            {/* Chiffres clés */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1 }}
              className="flex flex-wrap items-center gap-4 sm:gap-6 md:gap-8 mt-10 sm:mt-12 md:mt-16"
            >
              <div className="text-center">
                <p className="font-heading font-extrabold text-2xl sm:text-3xl md:text-4xl text-[#FFD100]">10+</p>
                <p className="text-white/60 text-[10px] sm:text-xs md:text-sm mt-1 whitespace-nowrap">Bénéficiaires directs</p>
              </div>
              <div className="w-px h-8 sm:h-10 bg-white/20 hidden sm:block" />
              <div className="text-center">
                <p className="font-heading font-extrabold text-2xl sm:text-3xl md:text-4xl text-[#FFD100]">2</p>
                <p className="text-white/60 text-[10px] sm:text-xs md:text-sm mt-1 whitespace-nowrap">Activités communautaires</p>
              </div>
              <div className="w-px h-8 sm:h-10 bg-white/20 hidden sm:block" />
              <div className="text-center">
                <p className="font-heading font-extrabold text-2xl sm:text-3xl md:text-4xl text-[#FFD100]">5+</p>
                <p className="text-white/60 text-[10px] sm:text-xs md:text-sm mt-1 whitespace-nowrap">Partenaires locaux</p>
              </div>
            </motion.div>

          </div>
        </div>
      </div>

      {/* Indicateur de scroll */}
      <motion.div
        className="absolute bottom-6 sm:bottom-8 left-1/2 -translate-x-1/2 z-20"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="flex flex-col items-center gap-2 cursor-pointer"
          onClick={() => window.scrollTo({ top: window.innerHeight, behavior: 'smooth' })}
        >
          <span className="text-white/50 text-[10px] sm:text-xs font-medium">Découvrir</span>
          <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </motion.div>
      </motion.div>

      {/* Vague de transition */}
      <div className="absolute bottom-0 left-0 right-0 z-10 pointer-events-none">
        <svg viewBox="0 0 1440 80" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none" className="w-full h-auto">
          <path
            d="M0 80V40C240 20 480 0 720 0C960 0 1200 20 1440 40V80H0Z"
            fill="white"
          />
        </svg>
      </div>
    </section>
  );
}