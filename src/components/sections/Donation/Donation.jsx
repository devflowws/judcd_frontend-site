import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useLanguage } from '@context/LanguageContext';
import { useDonationForm } from '@hooks/useDonation';
import { DonateButton } from '@components/ui/Button/Button';
import FadeInView from '@components/ui/Animations/FadeInView';

// ==========================================
// SECTION DON JUDCD
// ==========================================

const predefinedAmounts = [
  { value: 1000, label: '1 000 FCFA' },
  { value: 5000, label: '5 000 FCFA' },
  { value: 10000, label: '10 000 FCFA' },
  { value: 25000, label: '25 000 FCFA' },
  { value: 50000, label: '50 000 FCFA' },
  { value: 100000, label: '100 000 FCFA' },
];

export default function Donation() {
  const { t } = useLanguage();
  const {
    formData,
    isSubmitting,
    isSuccess,
    donationReference,
    errors,
    handleChange,
    handleSubmit,
    resetForm,
  } = useDonationForm();

  return (
    <section id="donation" className="py-20 md:py-28 relative overflow-hidden">
      {/* Fond avec dégradé */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#002060] via-[#001540] to-[#008751]" />
      
      {/* Motif décoratif */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 left-10 w-40 h-40 border-2 border-white rounded-full" />
        <div className="absolute bottom-10 right-10 w-60 h-60 border-2 border-white rounded-full" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 border border-white rounded-full" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          
          {/* Colonne gauche - Message */}
          <FadeInView direction="left">
            <div className="text-white">
              <span className="text-sm font-semibold text-[#FFD100] uppercase tracking-wider mb-3 block">
                {t('donation.title')}
              </span>
              <h2 className="font-heading font-extrabold text-3xl md:text-4xl lg:text-5xl mb-6 leading-tight">
                Soutenez notre mission
              </h2>
              <p className="text-white/80 text-lg leading-relaxed mb-8">
                Votre don, quel que soit son montant, nous permet de financer nos projets communautaires,
                nos formations et nos actions de sensibilisation. Chaque contribution compte.
              </p>

              {/* Arguments */}
              <div className="space-y-4 mb-10">
                {[
                  'Soutenez les initiatives locales de développement',
                  'Contribuez à la formation des jeunes leaders',
                  'Participez à la protection de l\'environnement',
                  'Aidez les communautés vulnérables',
                ].map((item, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <div className="w-6 h-6 bg-[#FFD100]/20 rounded-full flex items-center justify-center flex-shrink-0">
                      <svg className="w-4 h-4 text-[#FFD100]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span className="text-white/90 text-sm">{item}</span>
                  </div>
                ))}
              </div>

              {/* Contact pour don */}
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                <p className="text-white/80 text-sm">
                  Pour toute question concernant les dons, contactez-nous à{' '}
                  <a href="mailto:associationjudcd@gmail.com" className="text-[#FFD100] hover:underline font-semibold">
                    associationjudcd@gmail.com
                  </a>
                </p>
              </div>
            </div>
          </FadeInView>

          {/* Colonne droite - Formulaire */}
          <FadeInView direction="right">
            {isSuccess ? (
              <motion.div
                className="bg-white rounded-2xl p-8 md:p-10 shadow-2xl text-center"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
              >
                <div className="w-20 h-20 mx-auto mb-6 bg-[#008751]/10 rounded-full flex items-center justify-center">
                  <svg className="w-10 h-10 text-[#008751]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </div>
                <h3 className="font-heading font-bold text-2xl text-[#002060] mb-3">
                  {t('donation.success')}
                </h3>
                <p className="text-[#666666] mb-4">
                  {t('donation.success.text')}
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
              <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-8 md:p-10 shadow-2xl">
                <h3 className="font-heading font-bold text-xl text-[#002060] mb-6">
                  Faire un don
                </h3>

                {/* Nom complet */}
                <div className="mb-5">
                  <label htmlFor="donationName" className="block text-sm font-semibold text-[#333333] mb-2">
                    Nom complet *
                  </label>
                  <input
                    type="text"
                    id="donationName"
                    value={formData.fullName}
                    onChange={(e) => handleChange('fullName', e.target.value)}
                    className={`w-full px-4 py-3 border rounded-xl text-sm focus:outline-none focus:ring-2 transition-all ${
                      errors.fullName
                        ? 'border-red-500 focus:ring-red-200'
                        : 'border-gray-200 focus:border-[#008751] focus:ring-green-100'
                    }`}
                    placeholder="Votre nom complet"
                  />
                  {errors.fullName && (
                    <p className="text-red-500 text-xs mt-1">{errors.fullName}</p>
                  )}
                </div>

                {/* Email */}
                <div className="mb-5">
                  <label htmlFor="donationEmail" className="block text-sm font-semibold text-[#333333] mb-2">
                    Email *
                  </label>
                  <input
                    type="email"
                    id="donationEmail"
                    value={formData.email}
                    onChange={(e) => handleChange('email', e.target.value)}
                    className={`w-full px-4 py-3 border rounded-xl text-sm focus:outline-none focus:ring-2 transition-all ${
                      errors.email
                        ? 'border-red-500 focus:ring-red-200'
                        : 'border-gray-200 focus:border-[#008751] focus:ring-green-100'
                    }`}
                    placeholder="votre@email.com"
                  />
                  {errors.email && (
                    <p className="text-red-500 text-xs mt-1">{errors.email}</p>
                  )}
                </div>

                {/* Montant */}
                <div className="mb-5">
                  <label htmlFor="donationAmount" className="block text-sm font-semibold text-[#333333] mb-2">
                    {t('donation.amount')} *
                  </label>
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
                  <div className="grid grid-cols-3 gap-2 mb-3">
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
                    id="donationAmount"
                    value={formData.amount}
                    onChange={(e) => handleChange('amount', e.target.value)}
                    className={`w-full px-4 py-3 border rounded-xl text-sm focus:outline-none focus:ring-2 transition-all ${
                      errors.amount
                        ? 'border-red-500 focus:ring-red-200'
                        : 'border-gray-200 focus:border-[#008751] focus:ring-green-100'
                    }`}
                    placeholder="Autre montant en FCFA"
                    min="1000"
                  />
                  {errors.amount && (
                    <p className="text-red-500 text-xs mt-1">{errors.amount}</p>
                  )}
                </div>

                {/* Moyen de paiement */}
                <div className="mb-5">
                  <label htmlFor="paymentMethod" className="block text-sm font-semibold text-[#333333] mb-2">
                    {t('donation.method')} *
                  </label>
                  <select
                    id="paymentMethod"
                    value={formData.paymentMethod}
                    onChange={(e) => handleChange('paymentMethod', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#008751] focus:ring-2 focus:ring-green-100 transition-all bg-white"
                  >
                    <option value="mobile_money">Mobile Money (Flooz / T-Money)</option>
                    <option value="bank_transfer">Virement bancaire</option>
                  </select>
                </div>

                {/* Message */}
                <div className="mb-6">
                  <label htmlFor="donationMessage" className="block text-sm font-semibold text-[#333333] mb-2">
                    Message (optionnel)
                  </label>
                  <textarea
                    id="donationMessage"
                    value={formData.message}
                    onChange={(e) => handleChange('message', e.target.value)}
                    rows="2"
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#008751] focus:ring-2 focus:ring-green-100 transition-all resize-none"
                    placeholder="Un message d'encouragement..."
                  />
                </div>

                {/* Bouton */}
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
                      Traitement en cours...
                    </>
                  ) : (
                    <>
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                      </svg>
                      {t('nav.donate')}
                    </>
                  )}
                </button>
              </form>
            )}
          </FadeInView>

        </div>
      </div>
    </section>
  );
}