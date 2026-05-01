import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Icônes SVG intégrées
const ChevronLeftIcon = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
  </svg>
);

const ChevronRightIcon = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
  </svg>
);

// ==========================================
// CARROUSEL CONTRÔLÉ POUR L'ÉQUIPE JUDCD
// ==========================================

export default function TeamCarousel({ members }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlay, setIsAutoPlay] = useState(true);

  // Auto-play toutes les 4 secondes
  useEffect(() => {
    if (!isAutoPlay) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % members.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [isAutoPlay, members.length]);

  // Navigation
  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + members.length) % members.length);
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % members.length);
  };

  const goToSlide = (index) => {
    setCurrentIndex(index);
  };

  // Pause auto-play au survol
  const handleMouseEnter = () => setIsAutoPlay(false);
  const handleMouseLeave = () => setIsAutoPlay(true);

  if (!members || members.length === 0) return null;

  return (
    <div 
      className="relative w-full max-w-4xl mx-auto"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Carrousel principal */}
      <div className="relative h-[659px] overflow-hidden rounded-2xl bg-white shadow-2xl">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, x: 300 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -300 }}
            transition={{ 
              duration: 0.5, 
              ease: "easeInOut"
            }}
            className="absolute inset-0 flex items-center justify-center"
          >
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#F8FAF9] to-[#E8F5F2]">
              {/* Photo du membre */}
              <div className="relative">
                <motion.img
                  src={members[currentIndex].photo || '/assets/images/team-placeholder.jpg'}
                  alt={members[currentIndex].name}
                  className="w-[658px] h-[659px] object-cover rounded-xl shadow-lg"
                  initial={{ scale: 0.9 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.6 }}
                />
                
                {/* Overlay avec informations */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-8 rounded-b-xl"
                >
                  <h3 className="text-white font-heading font-bold text-2xl mb-2">
                    {members[currentIndex].name}
                  </h3>
                  <p className="text-white/90 font-semibold text-lg mb-3">
                    {members[currentIndex].role}
                  </p>
                  
                  {/* Actions */}
                  <div className="flex gap-3">
                    <a
                      href={`mailto:${members[currentIndex].email}`}
                      className="flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-lg text-white hover:bg-white/30 transition-all duration-300"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                      Email
                    </a>
                    <a
                      href={`tel:${members[currentIndex].phone}`}
                      className="flex items-center gap-2 px-4 py-2 bg-[#008751]/80 backdrop-blur-sm rounded-lg text-white hover:bg-[#008751] transition-all duration-300"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                      Appeler
                    </a>
                  </div>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Boutons de navigation */}
        <button
          onClick={goToPrevious}
          className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center text-[#002060] hover:bg-white hover:scale-110 transition-all duration-300 shadow-lg z-10"
          aria-label="Précédent"
        >
          <ChevronLeftIcon className="w-6 h-6" />
        </button>
        
        <button
          onClick={goToNext}
          className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center text-[#002060] hover:bg-white hover:scale-110 transition-all duration-300 shadow-lg z-10"
          aria-label="Suivant"
        >
          <ChevronRightIcon className="w-6 h-6" />
        </button>
      </div>

      {/* Indicateurs de slides */}
      <div className="flex justify-center gap-2 mt-6">
        {members.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              index === currentIndex
                ? 'bg-[#008751] w-8'
                : 'bg-gray-300 hover:bg-gray-400'
            }`}
            aria-label={`Aller au membre ${index + 1}`}
          />
        ))}
      </div>

      {/* Miniatures optionnelles */}
      <div className="flex justify-center gap-2 mt-4 overflow-x-auto pb-2">
        {members.map((member, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden transition-all duration-300 ${
              index === currentIndex
                ? 'ring-2 ring-[#008751] ring-offset-2'
                : 'opacity-60 hover:opacity-80'
            }`}
          >
            <img
              src={member.photo || '/assets/images/team-placeholder.jpg'}
              alt={member.name}
              className="w-full h-full object-cover"
            />
          </button>
        ))}
      </div>
    </div>
  );
}
