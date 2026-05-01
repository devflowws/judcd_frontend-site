import { motion, AnimatePresence } from 'framer-motion';

// Icônes SVG intégrées
const XIcon = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
  </svg>
);

const CheckCircleIcon = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const SparklesIcon = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
  </svg>
);

// ==========================================
// MODALE DE SUCCÈS CHIC JUDCD
// ==========================================

export default function SuccessModal({ 
  isOpen, 
  onClose, 
  title = "Succès !", 
  message, 
  reference = null,
  showReference = false 
}) {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Arrière-plan flouté */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/60 backdrop-blur-md"
            onClick={onClose}
          />
          
          {/* Modale chic */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ 
              type: "spring", 
              stiffness: 300, 
              damping: 30,
              duration: 0.4
            }}
            className="relative bg-white rounded-3xl shadow-2xl max-w-md w-full mx-4 overflow-hidden"
          >
            {/* Header avec décoration */}
            <div className="relative bg-gradient-to-br from-[#008751] via-[#00A860] to-[#006B41] p-8 pb-20">
              {/* Éléments décoratifs */}
              <div className="absolute top-4 right-4">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                  className="w-8 h-8"
                >
                  <SparklesIcon className="w-full h-full text-white/30" />
                </motion.div>
              </div>
              
              <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-white to-transparent" />
              
              {/* Bouton fermer */}
              <button
                onClick={onClose}
                className="absolute top-4 right-4 w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-all duration-300 group"
              >
                <XIcon className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" />
              </button>
              
              {/* Icône de succès animée */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ 
                  type: "spring", 
                  stiffness: 200, 
                  damping: 20,
                  delay: 0.2
                }}
                className="flex justify-center"
              >
                <div className="relative">
                  <div className="absolute inset-0 bg-white/30 rounded-full blur-xl" />
                  <div className="relative w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-lg">
                    <CheckCircleIcon className="w-10 h-10 text-[#008751]" />
                  </div>
                </div>
              </motion.div>
            </div>
            
            {/* Contenu */}
            <div className="relative px-8 pb-8 -mt-12">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-center"
              >
                {/* Titre */}
                <h3 className="font-heading font-bold text-2xl text-[#002060] mb-4">
                  {title}
                </h3>
                
                {/* Message */}
                <p className="text-[#666666] leading-relaxed mb-6">
                  {message}
                </p>
                
                {/* Référence si fournie */}
                {showReference && reference && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.4 }}
                    className="bg-gradient-to-r from-[#008751]/10 to-[#FFD100]/10 rounded-2xl p-4 mb-6 border border-[#008751]/20"
                  >
                    <p className="text-xs font-semibold text-[#008751] uppercase tracking-wider mb-1">
                      Référence
                    </p>
                    <p className="font-mono text-lg font-bold text-[#002060]">
                      {reference}
                    </p>
                  </motion.div>
                )}
                
                {/* Boutons d'action */}
                <div className="flex gap-3">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={onClose}
                    className="flex-1 px-6 py-3 bg-gradient-to-r from-[#008751] to-[#00A860] text-white font-semibold rounded-xl hover:shadow-lg transition-all duration-300 shadow-[#008751]/25"
                  >
                    Parfait !
                  </motion.button>
                </div>
              </motion.div>
            </div>
            
            {/* Éléments décoratifs supplémentaires */}
            <div className="absolute top-2 left-2 w-2 h-2 bg-[#FFD100]/50 rounded-full" />
            <div className="absolute top-2 right-12 w-1 h-1 bg-white/40 rounded-full" />
            <div className="absolute bottom-2 left-2 w-1 h-1 bg-white/40 rounded-full" />
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
