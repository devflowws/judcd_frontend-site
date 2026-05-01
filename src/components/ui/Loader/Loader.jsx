import { motion } from 'framer-motion';
import { ASSETS } from '@utils/constants';

// ==========================================
// LOADER PAGE JUDCD - Design premium
// ==========================================

export function PageLoader() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-[#002060] via-[#001540] to-[#008751] overflow-hidden">
      
      {/* Cercles décoratifs en arrière-plan */}
      <motion.div
        className="absolute rounded-full border border-white/10"
        style={{ width: 'min(500px, 90vw)', height: 'min(500px, 90vw)' }}
        animate={{ rotate: 360 }}
        transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}
      />
      <motion.div
        className="absolute rounded-full border border-white/5"
        style={{ width: 'min(380px, 70vw)', height: 'min(380px, 70vw)' }}
        animate={{ rotate: -360 }}
        transition={{ duration: 18, repeat: Infinity, ease: 'linear' }}
      />

      {/* Contenu centré */}
      <div className="relative z-10 flex flex-col items-center justify-center"
        style={{ width: 'min(350px, 85vw)', height: 'min(350px, 85vw)' }}
      >
        
        {/* Cercle qui entoure le logo et les points */}
        <motion.div
          className="absolute inset-0 rounded-full"
          style={{
            background: 'radial-gradient(circle, rgba(0,135,81,0.1) 0%, rgba(0,135,81,0.05) 40%, transparent 70%)',
            border: '1px solid rgba(255,255,255,0.08)',
          }}
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
        />

        {/* Logo avec glow */}
        <motion.div
          className="relative mb-8 md:mb-10"
          animate={{ y: [0, -6, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
        >
          {/* Glow vert derrière le logo */}
          <div
            className="absolute inset-0 rounded-full blur-2xl"
            style={{
              background: 'radial-gradient(circle, rgba(0,135,81,0.5) 0%, transparent 70%)',
              transform: 'scale(1.6)',
            }}
          />
          
          {/* Logo */}
          <img
            src={ASSETS.logo}
            alt="JUDCD"
            className="h-24 sm:h-28 md:h-32 w-auto relative z-10 drop-shadow-2xl brightness-0 invert"
          />
        </motion.div>

        {/* Points de chargement stylés */}
        <div className="flex items-center gap-4 sm:gap-5">
          {[0, 1, 2].map((index) => (
            <motion.div
              key={index}
              className="relative"
              animate={{ y: [0, -16, 0] }}
              transition={{
                duration: 0.9,
                repeat: Infinity,
                delay: index * 0.25,
                ease: [0.25, 0.1, 0.25, 1],
              }}
            >
              {/* Point avec gradient et glow */}
              <div
                className="w-4 h-4 sm:w-5 sm:h-5 rounded-full"
                style={{
                  background: 'linear-gradient(135deg, #FFD100 0%, #FFA000 100%)',
                  boxShadow: '0 0 15px rgba(255, 209, 0, 0.7), 0 0 30px rgba(255, 209, 0, 0.4), 0 0 50px rgba(255, 209, 0, 0.2)',
                }}
              />
              
              {/* Reflet brillant */}
              <div
                className="absolute top-0.5 left-1 w-1 h-1 sm:w-1.5 sm:h-1.5 bg-white/70 rounded-full"
              />
            </motion.div>
          ))}
        </div>

        {/* Texte */}
        <motion.p
          className="mt-6 sm:mt-8 text-white/40 text-[10px] sm:text-xs tracking-[0.3em] uppercase font-medium"
          animate={{ opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        >
          Chargement
        </motion.p>
      </div>
    </div>
  );
}

// Spinner simple
export function Spinner({ size = 'md', color = '#008751', className = '' }) {
  const sizes = { sm: 'w-4 h-4', md: 'w-8 h-8', lg: 'w-12 h-12' };

  return (
    <div className={`flex items-center justify-center ${className}`}>
      <div
        className={`${sizes[size]} rounded-full border-[3px] border-gray-200`}
        style={{ borderTopColor: color, animation: 'spin 0.7s linear infinite' }}
      />
    </div>
  );
}

// Skeleton carte
export function CardSkeleton() {
  return (
    <div className="bg-white rounded-xl overflow-hidden shadow animate-pulse">
      <div className="aspect-[4/3] bg-gray-200" />
      <div className="p-5 space-y-3">
        <div className="h-3 bg-gray-200 rounded w-1/4" />
        <div className="h-5 bg-gray-200 rounded w-3/4" />
        <div className="h-4 bg-gray-200 rounded w-full" />
      </div>
    </div>
  );
}