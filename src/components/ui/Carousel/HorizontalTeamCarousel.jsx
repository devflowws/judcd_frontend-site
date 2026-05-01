import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

// ==========================================
// CARROUSEL HORIZONTAL INFINI POUR L'ÉQUIPE JUDCD
// ==========================================

export default function HorizontalTeamCarousel({ members }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Auto-play toutes les 3 secondes
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % members.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [members.length]);

  // Dupliquer les membres pour créer l'effet infini
  const duplicatedMembers = [...members, ...members];

  return (
    <div className="relative w-full overflow-hidden">
      {/* Conteneur horizontal qui défile */}
      <div className="relative h-[300px] sm:h-[350px] md:h-[400px] lg:h-[500px]">
        <motion.div
          className="flex h-full items-center"
          animate={{
            x: `-${currentIndex * (window.innerWidth < 640 ? 50 : window.innerWidth < 1024 ? 33.33 : 25)}%` // Responsive: mobile 50%, tablette 33.33%, desktop 25%
          }}
          transition={{
            type: "spring",
            stiffness: 300,
            damping: 30,
            duration: 0.8
          }}
        >
          {/* Toutes les photos sur une seule ligne */}
          {duplicatedMembers.map((member, index) => {
            const originalIndex = index % members.length;
            const isActive = originalIndex === currentIndex;
            
            return (
              <motion.div
                key={`${member.id}-${index}`}
                className="w-1/2 sm:w-1/3 lg:w-1/4 flex-shrink-0 flex items-center justify-center px-2 sm:px-3 lg:px-4"
                initial={{ opacity: 0.7, scale: 0.9 }}
                animate={{ 
                  opacity: isActive ? 1 : 0.7,
                  scale: isActive ? 1 : 0.9
                }}
                transition={{ duration: 0.5 }}
              >
                <div className="relative w-full max-w-[200px] sm:max-w-[250px] md:max-w-[300px] lg:max-w-[350px]">
                  {/* Photo du membre */}
                  <motion.img
                    src={member.photo || '/assets/images/team-placeholder.jpg'}
                    alt={member.name}
                    className="w-full h-[200px] sm:h-[250px] md:h-[300px] lg:h-[400px] object-cover rounded-xl sm:rounded-2xl shadow-lg sm:shadow-xl"
                    animate={{
                      scale: isActive ? 1.05 : 1,
                      y: isActive ? -10 : 0
                    }}
                    transition={{ duration: 0.6 }}
                  />
                  
                  {/* Informations sur la photo */}
                  <motion.div
                    className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-2 sm:p-3 md:p-4 rounded-b-xl sm:rounded-b-2xl"
                    animate={{
                      opacity: isActive ? 1 : 0.8
                    }}
                    transition={{ duration: 0.3 }}
                  >
                    <h3 className="text-white font-heading font-bold text-xs sm:text-sm md:text-lg lg:text-xl mb-1">
                      {member.name}
                    </h3>
                    <p className="text-white/90 font-semibold text-xs sm:text-xs md:text-sm lg:text-base mb-2">
                      {member.role}
                    </p>
                    <p className="text-white/80 text-xs sm:text-xs md:text-sm line-clamp-2">
                      {member.bio}
                    </p>
                  </motion.div>
                  
                  {/* Badge de rôle */}
                  <motion.div
                    className="absolute top-2 sm:top-3 md:top-4 right-2 sm:right-3 md:right-4"
                    animate={{
                      scale: isActive ? 1 : 0.8,
                      opacity: isActive ? 1 : 0.7
                    }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="px-2 py-1 sm:px-3 bg-[#008751] text-white rounded-full text-xs sm:text-xs md:text-sm font-semibold shadow-lg">
                      {member.role}
                    </div>
                  </motion.div>

                  {/* Actions pour le membre actif */}
                  {isActive && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 }}
                      className="absolute top-2 sm:top-3 md:top-4 left-2 sm:left-3 md:left-4 flex gap-1 sm:gap-2"
                    >
                      <a
                        href={`mailto:${member.email}`}
                        className="w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-all duration-300"
                      >
                        <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                      </a>
                      <a
                        href={`tel:${member.phone}`}
                        className="w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 bg-[#008751]/80 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-[#008751] transition-all duration-300"
                      >
                        <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                        </svg>
                      </a>
                    </motion.div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>

      {/* Indicateurs de progression */}
      <div className="flex justify-center gap-2 mt-6">
        {members.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              index === currentIndex
                ? 'bg-[#008751] w-8'
                : 'bg-gray-300 hover:bg-gray-400'
            }`}
            aria-label={`Aller au membre ${index + 1}`}
          />
        ))}
      </div>

      {/* Navigation flèches */}
      <button
        onClick={() => setCurrentIndex((prev) => (prev - 1 + members.length) % members.length)}
        className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center text-[#002060] hover:bg-white hover:scale-110 transition-all duration-300 shadow-lg z-10"
        aria-label="Précédent"
      >
        <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>
      
      <button
        onClick={() => setCurrentIndex((prev) => (prev + 1) % members.length)}
        className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center text-[#002060] hover:bg-white hover:scale-110 transition-all duration-300 shadow-lg z-10"
        aria-label="Suivant"
      >
        <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>
    </div>
  );
}
