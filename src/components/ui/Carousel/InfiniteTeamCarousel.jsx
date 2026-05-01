import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// ==========================================
// CARROUSEL INFINI POUR L'ÉQUIPE JUDCD
// ==========================================

export default function InfiniteTeamCarousel({ members }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollContainerRef = useRef(null);

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
      {/* Conteneur du carroussel */}
      <div className="relative h-[400px] md:h-[500px] lg:h-[600px]">
        <motion.div
          className="flex h-full items-center"
          animate={{
            x: `-${currentIndex * 100}%`
          }}
          transition={{
            type: "spring",
            stiffness: 300,
            damping: 30,
            duration: 0.8
          }}
        >
          {/* Afficher tous les membres en même temps */}
          {duplicatedMembers.map((member, index) => {
            const originalIndex = index % members.length;
            const isActive = originalIndex === currentIndex;
            
            return (
              <motion.div
                key={`${member.id}-${index}`}
                className="w-full flex-shrink-0 flex items-center justify-center px-8"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ 
                  opacity: isActive ? 1 : 0.7,
                  scale: isActive ? 1 : 0.85
                }}
                transition={{ duration: 0.5 }}
              >
                <div className="relative">
                  {/* Photo principale */}
                  <motion.img
                    src={member.photo || '/assets/images/team-placeholder.jpg'}
                    alt={member.name}
                    className={`object-cover rounded-2xl shadow-2xl ${
                      isActive 
                        ? 'w-[300px] h-[350px] md:w-[400px] h-[450px] lg:w-[500px] h-[550px]' 
                        : 'w-[250px] h-[300px] md:w-[300px] h-[350px] lg:w-[350px] h-[400px]'
                    }`}
                    animate={{
                      scale: isActive ? 1.05 : 1,
                      y: isActive ? -10 : 0
                    }}
                    transition={{ duration: 0.6 }}
                  />
                  
                  {/* Overlay avec informations */}
                  {isActive && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 }}
                      className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-6 rounded-b-2xl"
                    >
                      <h3 className="text-white font-heading font-bold text-2xl md:text-3xl mb-2">
                        {member.name}
                      </h3>
                      <p className="text-white/90 font-semibold text-lg md:text-xl mb-4">
                        {member.role}
                      </p>
                      
                      {/* Actions */}
                      <div className="flex gap-3">
                        <a
                          href={`mailto:${member.email}`}
                          className="flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-lg text-white hover:bg-white/30 transition-all duration-300"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                          </svg>
                          Email
                        </a>
                        <a
                          href={`tel:${member.phone}`}
                          className="flex items-center gap-2 px-4 py-2 bg-[#008751]/80 backdrop-blur-sm rounded-lg text-white hover:bg-[#008751] transition-all duration-300"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                          </svg>
                          Appeler
                        </a>
                      </div>
                    </motion.div>
                  )}
                  
                  {/* Badge de rôle */}
                  <div className="absolute top-4 right-4">
                    <motion.div
                      animate={{
                        scale: isActive ? 1 : 0.8,
                        opacity: isActive ? 1 : 0.7
                      }}
                      transition={{ duration: 0.3 }}
                      className="px-4 py-2 bg-[#008751] text-white rounded-full text-sm font-semibold shadow-lg"
                    >
                      {member.role}
                    </motion.div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>

      {/* Indicateurs de progression */}
      <div className="flex justify-center gap-2 mt-8">
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
        className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center text-[#002060] hover:bg-white hover:scale-110 transition-all duration-300 shadow-lg z-10"
        aria-label="Précédent"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>
      
      <button
        onClick={() => setCurrentIndex((prev) => (prev + 1) % members.length)}
        className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center text-[#002060] hover:bg-white hover:scale-110 transition-all duration-300 shadow-lg z-10"
        aria-label="Suivant"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>
    </div>
  );
}
