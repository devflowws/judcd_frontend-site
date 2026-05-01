import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { useDonationForm } from '@hooks/useDonation';
import SuccessModal from '@components/ui/Modal/SuccessModal';
import { useLanguage } from '@context/LanguageContext';
import FadeInView from '@components/ui/Animations/FadeInView';
import { ASSOCIATION } from '@utils/constants';

const predefinedAmounts = [
  { value: 1000, label: '1 000 FCFA' },
  { value: 5000, label: '5 000 FCFA' },
  { value: 10000, label: '10 000 FCFA' },
  { value: 25000, label: '25 000 FCFA' },
  { value: 50000, label: '50 000 FCFA' },
  { value: 100000, label: '100 000 FCFA' },
];

export default function DonatePage() {
  const { t } = useLanguage();
  const {
    formData,
    isSubmitting,
    isSuccess,
    donationReference,
    errors,
    showSuccessModal,
    setShowSuccessModal,
    handleChange,
    handleSubmit,
    resetForm,
  } = useDonationForm();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      <Helmet>
        <title>{t('nav.donate')} - {ASSOCIATION.name}</title>
        <meta name="description" content={t('donate.description')} />
      </Helmet>

      <motion.main
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="pt-24"
      >
        {/* Bannière */}
        <section className="relative py-20 bg-gradient-to-br from-[#D21034] to-[#8B0000] text-white overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-10 right-10 w-80 h-80 border-2 border-white rounded-full" />
          </div>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative text-center">
            <motion.h1
              className="font-heading font-extrabold text-4xl md:text-5xl lg:text-6xl mb-6"
              initial={{ y: -30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              Soutenir JUDCD
            </motion.h1>
            <motion.p
              className="text-white/80 text-lg max-w-3xl mx-auto"
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              Votre don, quel que soit son montant, nous permet de financer nos projets communautaires et de continuer à avoir un impact positif durable.
            </motion.p>
          </div>
        </section>

        {/* Contenu */}
        <section className="py-16 bg-[#F8FAF9]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              
              {/* Pourquoi donner */}
              <FadeInView direction="left">
                <div>
                  <h2 className="font-heading font-extrabold text-3xl md:text-4xl text-[#002060] mb-8">
                    Pourquoi donner ?
                  </h2>
                  
                  <div className="space-y-4 mb-10">
                    {[
                      { title: 'Soutenir les initiatives locales', desc: 'Votre contribution finance directement nos projets de développement communautaire au Togo.' },
                      { title: 'Former les jeunes leaders', desc: 'Aidez-nous à offrir des formations en leadership et entrepreneuriat aux jeunes.' },
                      { title: 'Protéger l\'environnement', desc: 'Soutenez nos campagnes de sensibilisation et nos actions écologiques.' },
                      { title: 'Aider les plus vulnérables', desc: 'Votre don permet de mener des actions sociales et humanitaires concrètes.' },
                    ].map((item, index) => (
                      <div key={index} className="flex items-start gap-4 bg-white rounded-xl p-5 shadow-lg">
                        <div className="w-10 h-10 bg-[#008751]/10 rounded-xl flex items-center justify-center flex-shrink-0">
                          <svg className="w-5 h-5 text-[#008751]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                        <div>
                          <h3 className="font-bold text-[#002060] mb-1">{item.title}</h3>
                          <p className="text-sm text-[#666666]">{item.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </FadeInView>

              {/* Formulaire */}
              <FadeInView direction="right">
                {isSuccess ? (
                  <motion.div
                    className="bg-white rounded-2xl p-10 shadow-2xl text-center sticky top-24"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                  >
                    <div className="w-20 h-20 mx-auto mb-6 bg-[#008751]/10 rounded-full flex items-center justify-center">
                      <svg className="w-10 h-10 text-[#008751]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                      </svg>
                    </div>
                    <h3 className="font-heading font-bold text-2xl text-[#002060] mb-3">
                      Promesse de don enregistrée !
                    </h3>
                    <p className="text-[#666666] mb-4">
                      Suivez les instructions pour finaliser votre don.
                    </p>
                    {donationReference && (
                      <p className="text-sm text-[#666666] mb-6">
                        Référence : <span className="font-bold text-[#008751]">{donationReference}</span>
                      </p>
                    )}
                    <button
                      onClick={resetForm}
                      className="px-6 py-3 bg-[#008751] text-white font-semibold rounded-xl hover:bg-[#006B41] transition-all"
                    >
                      Faire un autre don
                    </button>
                  </motion.div>
                ) : (
                  <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-8 md:p-10 shadow-2xl sticky top-24">
                    <h2 className="font-heading font-bold text-2xl text-[#002060] mb-6">
                      Faire un don
                    </h2>

                    <div className="mb-5">
                      <label className="block text-sm font-semibold text-[#333333] mb-2">Nom complet *</label>
                      <input
                        type="text"
                        value={formData.fullName}
                        onChange={(e) => handleChange('fullName', e.target.value)}
                        className={`w-full px-4 py-3 border rounded-xl text-sm focus:outline-none focus:ring-2 transition-all ${
                          errors.fullName ? 'border-red-500 focus:ring-red-200' : 'border-gray-200 focus:border-[#008751] focus:ring-green-100'
                        }`}
                        placeholder="Votre nom complet"
                      />
                      {errors.fullName && <p className="text-red-500 text-xs mt-1">{errors.fullName}</p>}
                    </div>

                    <div className="mb-5">
                      <label className="block text-sm font-semibold text-[#333333] mb-2">Email *</label>
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleChange('email', e.target.value)}
                        className={`w-full px-4 py-3 border rounded-xl text-sm focus:outline-none focus:ring-2 transition-all ${
                          errors.email ? 'border-red-500 focus:ring-red-200' : 'border-gray-200 focus:border-[#008751] focus:ring-green-100'
                        }`}
                        placeholder="votre@email.com"
                      />
                      {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                    </div>

                    <div className="mb-5">
                      <label className="block text-sm font-semibold text-[#333333] mb-2">Montant (FCFA) *</label>
                      <div className="grid grid-cols-3 gap-2 mb-3">
                        {predefinedAmounts.slice(0, 3).map((amount) => (
                          <button
                            key={amount.value}
                            type="button"
                            onClick={() => handleChange('amount', amount.value.toString())}
                            className={`py-2 px-3 text-xs font-semibold rounded-lg border transition-all ${
                              formData.amount === amount.value.toString()
                                ? 'border-[#008751] bg-[#008751]/10 text-[#008751]'
                                : 'border-gray-200 text-[#666666] hover:border-gray-300'
                            }`}
                          >
                            {amount.label}
                          </button>
                        ))}
                      </div>
                      <div className="grid grid-cols-3 gap-2">
                        {predefinedAmounts.slice(3, 6).map((amount) => (
                          <button
                            key={amount.value}
                            type="button"
                            onClick={() => handleChange('amount', amount.value.toString())}
                            className={`py-2 px-3 text-xs font-semibold rounded-lg border transition-all ${
                              formData.amount === amount.value.toString()
                                ? 'border-[#008751] bg-[#008751]/10 text-[#008751]'
                                : 'border-gray-200 text-[#666666] hover:border-gray-300'
                            }`}
                          >
                            {amount.label}
                          </button>
                        ))}
                      </div>
                      <input
                        type="number"
                        value={formData.amount}
                        onChange={(e) => handleChange('amount', e.target.value)}
                        className="w-full mt-3 px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#008751] focus:ring-2 focus:ring-green-100 transition-all"
                        placeholder="Autre montant en FCFA"
                        min="1000"
                      />
                      {errors.amount && <p className="text-red-500 text-xs mt-1">{errors.amount}</p>}
                    </div>

                    <div className="mb-5">
                      <label className="block text-sm font-semibold text-[#333333] mb-2">Moyen de paiement *</label>
                      <select
                        value={formData.paymentMethod}
                        onChange={(e) => handleChange('paymentMethod', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#008751] focus:ring-2 focus:ring-green-100 transition-all bg-white"
                      >
                        <option value="mobile_money">Mobile Money (Flooz / T-Money)</option>
                        <option value="bank_transfer">Virement bancaire</option>
                      </select>
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full px-8 py-4 bg-[#D21034] text-white font-bold rounded-xl hover:bg-[#B00D2B] transition-all shadow-lg shadow-red-500/25 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      {isSubmitting ? (
                        <>
                          <svg className="animate-spin w-5 h-5" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                          </svg>
                          Traitement...
                        </>
                      ) : (
                        <>
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                          </svg>
                          Faire un don
                        </>
                      )}
                    </button>

                    <p className="text-xs text-[#999999] mt-4 text-center">
                      Pour toute question : <a href="mailto:associationjudcd@gmail.com" className="text-[#008751] hover:underline">associationjudcd@gmail.com</a>
                    </p>
                  </form>
                )}
              </FadeInView>

            </div>
          </div>
        </section>
      </motion.main>

      {/* Modale de succès chic */}
      <SuccessModal
        isOpen={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
        title="Promesse de don enregistrée !"
        message="Suivez les instructions pour finaliser votre don. Merci pour votre générosité !"
        reference={donationReference}
        showReference={!!donationReference}
      />
    </>
  );
}