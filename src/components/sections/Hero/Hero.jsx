import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ASSOCIATION } from '@utils/constants';
import { useLanguage } from '@context/LanguageContext';
import { DonateButton } from '@components/ui/Button/Button';

// ==========================================
// SECTION HERO JUDCD - Banniere principale
// ==========================================

// Slides du hero (a remplacer par des images reelles)
const heroSlides = [
  {
    image: '/assets/images/hero-1.jpg',
    fallbackColor: 'from-[#008751] to-[#002060]',
    title: 'Ensemble pour un developpement durable de nos communautes',
    subtitle: 'Jeunes Unis pour le Developpement Communautaire Durable',
  },
];

export default function Hero() {
  const { t } = useLanguage();

  return (
    <section className="relative h-screen min-h-[600px] overflow-hidden">
      {/* Fond parallaxe */}
      <div className="absolute inset-0">
        {/* Image de fond */}
        <img 
          src="/assets/images/hero-1.jpg" 
          alt="Hero background"
          className="absolute inset-0 w-full h-full object-cover"
          onError={(e) => {
            e.target.style.display = 'none';
            e.target.parentElement.style.background = 'linear-gradient(to right, #008751, #002060)';
          }}
        />
        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/70" />
      </div>
      
      <div className="relative z-10 h-full flex items-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="max-w-3xl">
              
              {/* Badge */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="inline-flex items-center gap-2 px-4 py-2 bg-[#008751]/20 backdrop-blur-sm border border-[#008751]/30 rounded-full mb-8"
              >
                <span className="w-2 h-2 bg-[#FFD100] rounded-full animate-pulse" />
                <span className="text-[#FFD100] text-sm font-semibold">
                  {ASSOCIATION.name}
                </span>
              </motion.div>

              {/* Titre principal */}
              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="font-heading font-extrabold text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-white leading-tight mb-6"
              >
                {heroSlides[0].title}
              </motion.h1>

              {/* Sous-titre */}
              <motion.p
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.6 }}
                className="text-lg sm:text-xl md:text-2xl text-white/80 mb-10 leading-relaxed"
              >
                {heroSlides[0].subtitle}
              </motion.p>

              {/* Boutons CTA */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.8 }}
                className="flex flex-col sm:flex-row gap-4"
              >
                <Link
                  to="/a-propos"
                  className="inline-flex items-center justify-center px-8 py-4 bg-[#008751] text-white font-bold rounded-xl hover:bg-[#006B41] transition-all duration-300 shadow-lg shadow-green-500/25 hover:shadow-green-500/40 hover:-translate-y-1 group"
                >
                  {t('hero.cta.primary')}
                  <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </Link>
                
                <DonateButton
                  size="lg"
                  to="/faire-un-don"
                  className="animate-pulse-shadow"
                >
                  {t('hero.cta.secondary')}
                </DonateButton>
              </motion.div>

              {/* Chiffres cles rapides */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 1 }}
                className="flex flex-wrap gap-8 mt-16"
              >
                <div className="text-center">
                  <p className="font-heading font-extrabold text-3xl text-[#FFD100]">10+</p>
                  <p className="text-white/60 text-sm mt-1">Beneficiaires directs</p>
                </div>
                <div className="w-px bg-white/20 hidden sm:block" />
                <div className="text-center">
                  <p className="font-heading font-extrabold text-3xl text-[#FFD100]">2</p>
                  <p className="text-white/60 text-sm mt-1">Activites communautaires</p>
                </div>
                <div className="w-px bg-white/20 hidden sm:block" />
                <div className="text-center">
                  <p className="font-heading font-extrabold text-3xl text-[#FFD100]">5+</p>
                  <p className="text-white/60 text-sm mt-1">Partenaires locaux</p>
                </div>
              </motion.div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="flex flex-col items-center gap-2"
        >
          <span className="text-white/50 text-xs font-medium">Decouvrir</span>
          <svg className="w-6 h-6 text-white/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </motion.div>
      </motion.div>

      {/* Vague de transition */}
      <div className="absolute bottom-0 left-0 right-0 z-10">
        <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M0 120V80C240 40 480 0 720 0C960 0 1200 40 1440 80V120H0Z"
            fill="white"
          />
        </svg>
      </div>
    </section>
  );
}