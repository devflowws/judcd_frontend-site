import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { ASSOCIATION, SOCIAL_LINKS } from '@utils/constants';
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
        <title>{t('section.contact')} - {ASSOCIATION.name}</title>
        <meta name="description" content={t('contact.description')} />
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
              {t('section.contact')}
            </motion.h1>
            <motion.p
              className="text-white/80 text-lg max-w-3xl mx-auto"
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              {t('contact.description', 'Une question, une proposition de partenariat ou l\'envie de contribuer ? Écrivez-nous, nous vous répondrons dans les plus brefs délais.')}
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
                      {t('contact.success')}
                    </h3>
                    <p className="text-[#666666] mb-6">
                      {t('contact.success.text')}
                    </p>
                    <button
                      onClick={resetForm}
                      className="px-6 py-3 bg-[#008751] text-white font-semibold rounded-xl hover:bg-[#006B41] transition-all"
                    >
                      {t('button.submit')}
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
                            {t('button.submit')}
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
                      {SOCIAL_LINKS.tiktok && (
                        <a
                          href={SOCIAL_LINKS.tiktok}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-10 h-10 bg-[#002060] rounded-full flex items-center justify-center text-white hover:bg-[#008751] transition-colors"
                          aria-label="TikTok"
                        >
                          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/>
                          </svg>
                        </a>
                      )}
                      {SOCIAL_LINKS.facebook && (
                        <a
                          href={SOCIAL_LINKS.facebook}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-10 h-10 bg-[#002060] rounded-full flex items-center justify-center text-white hover:bg-[#008751] transition-colors"
                          aria-label="Facebook"
                        >
                          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                          </svg>
                        </a>
                      )}
                      {SOCIAL_LINKS.instagram && (
                        <a
                          href={SOCIAL_LINKS.instagram}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-10 h-10 bg-[#002060] rounded-full flex items-center justify-center text-white hover:bg-[#008751] transition-colors"
                          aria-label="Instagram"
                        >
                          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zM5.838 12a6.162 6.162 0 1112.324 0 6.162 6.162 0 01-12.324 0zM12 16a4 4 0 110-8 4 4 0 010 8zm4.965-10.405a1.44 1.44 0 112.881.001 1.44 1.44 0 01-2.881-.001z"/>
                          </svg>
                        </a>
                      )}
                      {SOCIAL_LINKS.twitter && (
                        <a
                          href={SOCIAL_LINKS.twitter}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-10 h-10 bg-[#002060] rounded-full flex items-center justify-center text-white hover:bg-[#008751] transition-colors"
                          aria-label="Twitter"
                        >
                          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                          </svg>
                        </a>
                      )}
                      {SOCIAL_LINKS.youtube && (
                        <a
                          href={SOCIAL_LINKS.youtube}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-10 h-10 bg-[#002060] rounded-full flex items-center justify-center text-white hover:bg-[#008751] transition-colors"
                          aria-label="YouTube"
                        >
                          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                          </svg>
                        </a>
                      )}
                      {SOCIAL_LINKS.linkedin && (
                        <a
                          href={SOCIAL_LINKS.linkedin}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-10 h-10 bg-[#002060] rounded-full flex items-center justify-center text-white hover:bg-[#008751] transition-colors"
                          aria-label="LinkedIn"
                        >
                          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                          </svg>
                        </a>
                      )}
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