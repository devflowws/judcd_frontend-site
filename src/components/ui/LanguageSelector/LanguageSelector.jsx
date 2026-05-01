import { useContext } from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '@context/LanguageContext';
import FlagFrance from './FlagFrance';
import FlagUK from './FlagUK';

// ==========================================
// SÉLECTEUR DE LANGUE JUDCD
// ==========================================

export default function LanguageSelector() {
  const { language, changeLanguage, availableLanguages } = useLanguage();

  return (
    <div className="relative group">
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/10 hover:bg-white/20 backdrop-blur-sm transition-all duration-300"
        aria-label="Changer de langue"
      >
        {/* Flag de la langue actuelle */}
        {language === 'fr' ? (
          <FlagFrance className="w-6 h-4" />
        ) : (
          <FlagUK className="w-6 h-4" />
        )}
        
        {/* Flèche */}
        <svg 
          className="w-3 h-3 text-white/70 group-hover:text-white transition-colors" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </motion.button>

      {/* Menu déroulant */}
      <div className="absolute right-0 mt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden min-w-[140px]"
        >
          {availableLanguages.map((lang) => (
            <button
              key={lang.code}
              onClick={() => changeLanguage(lang.code)}
              className={`w-full flex items-center gap-3 px-3 py-2 text-left hover:bg-gray-50 transition-colors ${
                language === lang.code ? 'bg-gray-100 text-[#008751] font-semibold' : 'text-gray-700'
              }`}
              aria-label={`Changer en ${lang.name}`}
            >
              {/* Flag */}
              {lang.code === 'fr' ? (
                <FlagFrance className="w-5 h-3" />
              ) : (
                <FlagUK className="w-5 h-3" />
              )}
              
              {/* Nom de la langue */}
              <span className="text-sm">
                {lang.name}
              </span>
              
              {/* Indicateur de sélection */}
              {language === lang.code && (
                <svg className="w-3 h-3 ml-auto text-[#008751]" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              )}
            </button>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
