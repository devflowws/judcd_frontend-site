import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { ASSOCIATION } from '@utils/constants';
import { formatPhoneNumber } from '@utils/formatters';
import { useLanguage } from '@context/LanguageContext';
import { useContactForm } from '@hooks/useContact';
import FadeInView from '@components/ui/Animations/FadeInView';

export default function ContactPage() {
  const { t } = useLanguage();
  const {
    formData,
    isSubmitting,
    isSuccess,
    errors,
    handleChange,
    handleSubmit,
    resetForm,
  } = useContactForm();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const subjects = [
    'Adhésion',
    'Partenariat',
    'Renseignements',
    'Don',
    'Projet',
    'Presse',
    'Autre',
  ];

  return (
    <>
      <Helmet>
        <title>Contact - {ASSOCIATION.name}</title>
        <meta name="description" content="Contactez l'association JUDCD pour toute question, partenariat ou participation à nos activités." />
      </Helmet>

      <motion.main
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="pt-24"
      >
        {/* Bannière */}
        <section className="relative py-20 bg-gradient-to-br from-[#002060] to-[#008751] text-white overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-10 right-10 w-72 h-72 border-2 border-white rounded-full" />
          </div>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative text-center">
            <motion.h1
              className="font-heading font-extrabold text-4xl md:text-5xl lg:text-6xl mb-6"
              initial={{ y: -30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              Contactez-nous
            </motion.h1>
            <motion.p
              className="text-white/80 text-lg max-w-3xl mx-auto"
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              Une question, une proposition de partenariat ou l'envie de contribuer ? Écrivez-nous, nous vous répondrons dans les plus brefs délais.
            </motion.p>
          </div>
        </section>

        {/* Contenu */}
        <section className="py-16 bg-[#F8FAF9]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
              
              {/* Formulaire */}
              <FadeInView className="lg:col-span-3">
                {isSuccess ? (
                  <motion.div
                    className="bg-white rounded-2xl p-10 shadow-xl text-center"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                  >
                    <div className="w-20 h-20 mx-auto mb-6 bg-[#008751]/10 rounded-full flex items-center justify-center">
                      <svg className="w-10 h-10 text-[#008751]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <h3 className="font-heading font-bold text-2xl text-[#002060] mb-3">
                      Message envoyé avec succès !
                    </h3>
                    <p className="text-[#666666] mb-6">
                      Nous avons bien reçu votre message et nous vous répondrons dans les plus brefs délais.
                    </p>
                    <button
                      onClick={resetForm}
                      className="px-6 py-3 bg-[#008751] text-white font-semibold rounded-xl hover:bg-[#006B41] transition-all"
                    >
                      Envoyer un autre message
                    </button>
                  </motion.div>
                ) : (
                  <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-8 md:p-10 shadow-xl">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      
                      <div>
                        <label htmlFor="name" className="block text-sm font-semibold text-[#333333] mb-2">
                          Nom complet *
                        </label>
                        <input
                          type="text"
                          id="name"
                          value={formData.name}
                          onChange={(e) => handleChange('name', e.target.value)}
                          className={`w-full px-4 py-3 border rounded-xl text-sm focus:outline-none focus:ring-2 transition-all ${
                            errors.name
                              ? 'border-red-500 focus:ring-red-200'
                              : 'border-gray-200 focus:border-[#008751] focus:ring-green-100'
                          }`}
                          placeholder="Votre nom complet"
                        />
                        {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                      </div>

                      <div>
                        <label htmlFor="email" className="block text-sm font-semibold text-[#333333] mb-2">
                          Email *
                        </label>
                        <input
                          type="email"
                          id="email"
                          value={formData.email}
                          onChange={(e) => handleChange('email', e.target.value)}
                          className={`w-full px-4 py-3 border rounded-xl text-sm focus:outline-none focus:ring-2 transition-all ${
                            errors.email
                              ? 'border-red-500 focus:ring-red-200'
                              : 'border-gray-200 focus:border-[#008751] focus:ring-green-100'
                          }`}
                          placeholder="votre@email.com"
                        />
                        {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                      </div>

                      <div>
                        <label htmlFor="phone" className="block text-sm font-semibold text-[#333333] mb-2">
                          Téléphone
                        </label>
                        <input
                          type="tel"
                          id="phone"
                          value={formData.phone}
                          onChange={(e) => handleChange('phone', e.target.value)}
                          className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#008751] focus:ring-2 focus:ring-green-100 transition-all"
                          placeholder="+228 XX XX XX XX"
                        />
                      </div>

                      <div>
                        <label htmlFor="subject" className="block text-sm font-semibold text-[#333333] mb-2">
                          Sujet *
                        </label>
                        <select
                          id="subject"
                          value={formData.subject}
                          onChange={(e) => handleChange('subject', e.target.value)}
                          className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#008751] focus:ring-2 focus:ring-green-100 transition-all bg-white"
                        >
                          {subjects.map((subject) => (
                            <option key={subject} value={subject}>{subject}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="mt-6">
                      <label htmlFor="message" className="block text-sm font-semibold text-[#333333] mb-2">
                        Message *
                      </label>
                      <textarea
                        id="message"
                        value={formData.message}
                        onChange={(e) => handleChange('message', e.target.value)}
                        rows="6"
                        className={`w-full px-4 py-3 border rounded-xl text-sm focus:outline-none focus:ring-2 transition-all resize-none ${
                          errors.message
                            ? 'border-red-500 focus:ring-red-200'
                            : 'border-gray-200 focus:border-[#008751] focus:ring-green-100'
                        }`}
                        placeholder="Votre message..."
                      />
                      {errors.message && <p className="text-red-500 text-xs mt-1">{errors.message}</p>}
                    </div>

                    <div className="mt-8">
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full px-8 py-4 bg-[#008751] text-white font-bold rounded-xl hover:bg-[#006B41] transition-all shadow-lg shadow-green-500/25 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                      >
                        {isSubmitting ? (
                          <>
                            <svg className="animate-spin w-5 h-5" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                            </svg>
                            Envoi en cours...
                          </>
                        ) : (
                          <>
                            Envoyer le message
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                            </svg>
                          </>
                        )}
                      </button>
                    </div>
                  </form>
                )}
              </FadeInView>

              {/* Infos de contact */}
              <FadeInView className="lg:col-span-2" direction="right">
                <div className="bg-white rounded-2xl p-8 md:p-10 shadow-xl h-full">
                  <h3 className="font-heading font-bold text-xl text-[#002060] mb-8">Nos coordonnées</h3>

                  <div className="space-y-6">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-[#008751]/10 rounded-xl flex items-center justify-center flex-shrink-0">
                        <svg className="w-6 h-6 text-[#008751]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                      </div>
                      <div>
                        <p className="font-semibold text-[#333333] mb-1">Adresse</p>
                        <p className="text-[#666666] text-sm leading-relaxed">
                          {ASSOCIATION.address}<br />
                          {ASSOCIATION.city}, {ASSOCIATION.country}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-[#008751]/10 rounded-xl flex items-center justify-center flex-shrink-0">
                        <svg className="w-6 h-6 text-[#008751]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                        </svg>
                      </div>
                      <div>
                        <p className="font-semibold text-[#333333] mb-1">Téléphone</p>
                        <a href={`tel:${ASSOCIATION.phone}`} className="text-[#008751] text-sm hover:underline">
                          {formatPhoneNumber(ASSOCIATION.phone)}
                        </a>
                      </div>
                    </div>

                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-[#008751]/10 rounded-xl flex items-center justify-center flex-shrink-0">
                        <svg className="w-6 h-6 text-[#008751]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <div>
                        <p className="font-semibold text-[#333333] mb-1">Email</p>
                        <a href={`mailto:${ASSOCIATION.email}`} className="text-[#008751] text-sm hover:underline">
                          {ASSOCIATION.email}
                        </a>
                      </div>
                    </div>
                  </div>

                  <div className="mt-10 pt-8 border-t border-gray-100">
                    <p className="font-semibold text-[#333333] mb-4">Suivez-nous</p>
                    <div className="flex gap-3">
                      <a
                        href="https://www.tiktok.com/@associationjudcd"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-10 h-10 bg-[#002060] rounded-full flex items-center justify-center text-white hover:bg-[#008751] transition-colors"
                        aria-label="TikTok"
                      >
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/>
                        </svg>
                      </a>
                    </div>
                  </div>
                </div>
              </FadeInView>

            </div>
          </div>
        </section>
      </motion.main>
    </>
  );
}