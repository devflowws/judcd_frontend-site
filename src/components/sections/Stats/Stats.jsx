import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { KEY_FIGURES } from '@utils/constants';
import { useLanguage } from '@context/LanguageContext';
import FadeInView from '@components/ui/Animations/FadeInView';
import { useState, useEffect } from 'react';

// ==========================================
// SECTION STATISTIQUES JUDCD
// ==========================================

export default function Stats() {
  const { t } = useLanguage();

  return (
    <section className="py-20 relative overflow-hidden bg-gradient-to-r from-[#008751] to-[#002060]">
      {/* Motif décoratif */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 right-0 w-64 h-64 bg-[#FFD100] rounded-full translate-x-1/2 translate-y-1/2" />
      </div>

      {/* Lignes décoratives */}
      <div className="absolute inset-0">
        <svg className="w-full h-full opacity-5" viewBox="0 0 1440 400" fill="none">
          <line x1="0" y1="100" x2="1440" y2="100" stroke="white" strokeWidth="2" />
          <line x1="0" y1="200" x2="1440" y2="200" stroke="white" strokeWidth="2" />
          <line x1="0" y1="300" x2="1440" y2="300" stroke="white" strokeWidth="2" />
        </svg>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        
        {/* En-tete */}
        <FadeInView className="text-center mb-16">
          <h2 className="font-heading font-extrabold text-3xl md:text-4xl text-white mb-4">
            {t('section.stats')}
          </h2>
          <p className="text-white/70 text-lg max-w-2xl mx-auto">
            {t('stats.description')}
          </p>
        </FadeInView>

        {/* Grille des statistiques */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12">
          {KEY_FIGURES.map((stat, index) => (
            <StatItem key={index} stat={{ ...stat, label: t(`figure.${index}.label`) }} index={index} />
          ))}
        </div>

        {/* Barre de progression décorative */}
        <motion.div
          className="mt-16 h-1 bg-white/10 rounded-full overflow-hidden max-w-md mx-auto"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          <motion.div
            className="h-full bg-[#FFD100] rounded-full"
            initial={{ width: 0 }}
            whileInView={{ width: '100%' }}
            viewport={{ once: true }}
            transition={{ duration: 1.5, delay: 0.5, ease: 'easeOut' }}
          />
        </motion.div>
      </div>
    </section>
  );
}

// Composant individuel de statistique
function StatItem({ stat, index }) {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.5,
  });

  return (
    <motion.div
      ref={ref}
      className="text-center group"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.15 }}
    >
      {/* Cercle decoratif */}
      <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-white/10 flex items-center justify-center group-hover:bg-white/20 transition-all duration-300 group-hover:scale-110">
        <span className="text-[#FFD100] text-2xl font-extrabold">
          {inView ? <AnimatedNumber value={stat.value} suffix={stat.suffix} /> : '0'}
        </span>
      </div>
      
      {/* Valeur */}
      <div className="text-4xl md:text-5xl font-extrabold text-white mb-2 font-heading">
        {inView ? <AnimatedNumber value={stat.value} suffix={stat.suffix} /> : '0'}
      </div>
      
      {/* Label */}
      <p className="text-white/60 text-sm font-medium">{stat.label}</p>
    </motion.div>
  );
}

// Animation de comptage
function AnimatedNumber({ value, suffix = '', duration = 2 }) {
  const [count, setCount] = useState(0);
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.5,
  });

  useEffect(() => {
    if (!inView) return;

    let startTime;
    let animationFrame;

    const animate = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / (duration * 1000), 1);
      // Easing ease-out
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(eased * value));

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };

    animationFrame = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(animationFrame);
  }, [value, duration, inView]);

  return (
    <span ref={ref}>
      {count}{suffix}
    </span>
  );
}