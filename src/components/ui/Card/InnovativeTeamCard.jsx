import { motion } from 'framer-motion';
import { useState } from 'react';

// ==========================================
// CARTE INNOVANTE POUR L'ÉQUIPE JUDCD
// ==========================================

export default function InnovativeTeamCard({ 
  photo, 
  name, 
  role, 
  bio, 
  email, 
  phone,
  quote,
  delay = 0 
}) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ 
        duration: 0.6, 
        delay: delay * 0.1,
        type: "spring",
        stiffness: 100
      }}
      className="group relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2">
        
        {/* Grande photo avec overlay */}
        <div className="relative h-80 md:h-96 overflow-hidden">
          <motion.img
            src={photo || '/assets/images/team-placeholder.jpg'}
            alt={name}
            className="w-full h-full object-cover"
            animate={{ scale: isHovered ? 1.1 : 1 }}
            transition={{ duration: 0.6 }}
          />
          
          {/* Overlay gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          
          {/* Informations qui apparaissent au hover */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ 
              opacity: isHovered ? 1 : 0, 
              y: isHovered ? 0 : 20 
            }}
            transition={{ duration: 0.4 }}
            className="absolute bottom-0 left-0 right-0 p-6 text-white"
          >
            <h3 className="font-heading font-bold text-xl mb-1">{name}</h3>
            <p className="text-sm font-medium opacity-90">{role}</p>
          </motion.div>
        </div>

        {/* Informations principales */}
        <div className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <h3 className="font-heading font-bold text-xl text-[#002060] mb-1 group-hover:text-[#008751] transition-colors">
                {name}
              </h3>
              <p className="text-sm font-semibold text-[#008751] uppercase tracking-wide">
                {role}
              </p>
            </div>
            
            {/* Badge animé */}
            <motion.div
              animate={{ 
                rotate: isHovered ? 360 : 0,
                scale: isHovered ? 1.1 : 1
              }}
              transition={{ duration: 0.6 }}
              className="w-12 h-12 bg-gradient-to-br from-[#008751] to-[#00A860] rounded-full flex items-center justify-center text-white shadow-lg"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </motion.div>
          </div>

          {/* Bio tronquée */}
          <p className="text-[#666666] text-sm leading-relaxed mb-4 line-clamp-3">
            {bio}
          </p>

          {/* Actions */}
          <div className="flex gap-2">
            <motion.a
              href={`mailto:${email}`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-[#008751]/10 text-[#008751] rounded-lg text-sm font-medium hover:bg-[#008751] hover:text-white transition-all duration-300"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              Email
            </motion.a>
            
            <motion.a
              href={`tel:${phone}`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-[#FFD100]/20 text-[#FFD100] rounded-lg text-sm font-medium hover:bg-[#FFD100] hover:text-[#002060] transition-all duration-300"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              Appeler
            </motion.a>
          </div>

          {/* Citation si disponible */}
          {quote && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="mt-4 pt-4 border-t border-gray-100"
            >
              <blockquote className="text-xs italic text-[#666666] leading-relaxed">
                "{quote}"
              </blockquote>
            </motion.div>
          )}
        </div>

        {/* Éléments décoratifs */}
        <div className="absolute top-2 right-2 w-3 h-3 bg-[#FFD100] rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        <div className="absolute bottom-2 left-2 w-2 h-2 bg-[#008751] rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      </div>
    </motion.div>
  );
}
