import { useState } from 'react';
import { motion } from 'framer-motion';
import { validateEmail } from '@utils/validators';
import { useLanguage } from '@context/LanguageContext';
import FadeInView from '@components/ui/Animations/FadeInView';

// ==========================================
// SECTION NEWSLETTER JUDCD
// ==========================================

export default function Newsletter() {
  const { t } = useLanguage();
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('idle'); // idle | loading | success | error
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');

    // Validation
    const validation = validateEmail(email);
    if (!validation.valid) {
      setStatus('error');
      setMessage(validation.message);
      return;
    }

    setStatus('loading');

    // Simulation d'inscription (à remplacer par l'appel API)
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      setStatus('success');
      setMessage('Inscription réussie ! Merci de votre intérêt pour nos activités.');
      setEmail('');
    } catch (error) {
      setStatus('error');
      setMessage('Une erreur est survenue. Veuillez réessayer.');
    }
  };

  return (
    <section className="py-20 md:py-28 bg-white relative overflow-hidden">
      {/* Fond décoratif */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#F8FAF9] to-white" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        
        {/* Carte newsletter */}
        <FadeInView>
          <div className="bg-[#002060] rounded-3xl p-10 md:p-16 shadow-2xl relative overflow-hidden">
            {/* Motifs décoratifs */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#008751]/20 rounded-full -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-[#FFD100]/10 rounded-full translate-y-1/2 -translate-x-1/2" />
            
            <div className="relative z-10 text-center">
              {/* Icône */}
              <div className="w-16 h-16 mx-auto mb-6 bg-white/10 rounded-2xl flex items-center justify-center">
                <svg className="w-8 h-8 text-[#FFD100]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>

              {/* Titre */}
              <h2 className="font-heading font-extrabold text-3xl md:text-4xl text-white mb-4">
                {t('section.newsletter')}
              </h2>
              
              {/* Description */}
              <p className="text-white/70 text-lg mb-8 max-w-xl mx-auto">
                Recevez nos actualités, événements et rapports d'activité directement dans votre boîte mail.
              </p>

              {/* Formulaire */}
              {status === 'success' ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 max-w-md mx-auto"
                >
                  <div className="w-12 h-12 mx-auto mb-3 bg-[#008751] rounded-full flex items-center justify-center">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <p className="text-white font-semibold">{message}</p>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="max-w-md mx-auto">
                  <div className="flex flex-col sm:flex-row gap-3">
                    <div className="relative flex-1">
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => {
                          setEmail(e.target.value);
                          if (status === 'error') setStatus('idle');
                        }}
                        placeholder={t('footer.newsletter.placeholder')}
                        className={`w-full px-5 py-4 pr-12 rounded-xl text-sm focus:outline-none focus:ring-2 transition-all ${
                          status === 'error'
                            ? 'ring-2 ring-red-400 bg-red-50'
                            : 'bg-white/10 border border-white/20 text-white placeholder-white/50 focus:border-[#FFD100] focus:ring-[#FFD100]/30'
                        }`}
                        disabled={status === 'loading'}
                      />
                      <svg className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <button
                      type="submit"
                      disabled={status === 'loading'}
                      className="px-6 py-4 bg-[#FFD100] text-[#002060] font-bold rounded-xl hover:bg-[#FFE44D] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 whitespace-nowrap"
                    >
                      {status === 'loading' ? (
                        <>
                          <svg className="animate-spin w-5 h-5" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                          </svg>
                          Envoi...
                        </>
                      ) : (
                        t('footer.newsletter.subscribe')
                      )}
                    </button>
                  </div>
                  
                  {/* Message d'erreur */}
                  {status === 'error' && message && (
                    <motion.p
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-red-300 text-sm mt-3"
                    >
                      {message}
                    </motion.p>
                  )}

                  {/* Texte de confidentialité */}
                  <p className="text-white/40 text-xs mt-4">
                    En vous inscrivant, vous acceptez de recevoir nos communications. Vous pouvez vous désinscrire à tout moment.
                  </p>
                </form>
              )}
            </div>
          </div>
        </FadeInView>

      </div>
    </section>
  );
}