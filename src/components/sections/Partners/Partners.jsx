import { motion } from 'framer-motion';
import { PARTNERS } from '@utils/constants';
import { useLanguage } from '@context/LanguageContext';
import FadeInView from '@components/ui/Animations/FadeInView';

// ==========================================
// SECTION PARTENAIRES JUDCD
// ==========================================

export default function Partners() {
  const { t } = useLanguage();

  // Partenaires avec icônes (données temporaires)
  const partnersList = PARTNERS.map((partner, index) => ({
    id: index + 1,
    name: partner,
    logo: null,
    type: index === 0 ? 'OSC' : index === 1 ? 'Institution' : index === 2 ? 'Association' : index === 3 ? 'Éducation' : 'Technique',
  }));

  return (
    <section id="partners" className="py-20 md:py-28 bg-[#F8FAF9] relative overflow-hidden">
      {/* Éléments décoratifs */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-px bg-gradient-to-r from-transparent via-[#008751]/20 to-transparent" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* En-tête */}
        <FadeInView className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-sm font-semibold text-[#008751] uppercase tracking-wider mb-3 block">
            {t('section.partners')}
          </span>
          <h2 className="font-heading font-extrabold text-3xl md:text-4xl lg:text-5xl text-[#002060] mb-6 leading-tight">
            Ils nous soutiennent
          </h2>
          <p className="text-[#666666] text-lg">
            Nous collaborons avec des organisations qui partagent notre vision d'un développement communautaire durable.
          </p>
        </FadeInView>

        {/* Grille de partenaires */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 md:gap-8">
          {partnersList.map((partner, index) => (
            <motion.div
              key={partner.id}
              className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 group text-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              whileHover={{ y: -4 }}
            >
              {/* Logo placeholder */}
              <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-[#008751]/10 to-[#002060]/10 rounded-2xl flex items-center justify-center group-hover:from-[#008751]/20 group-hover:to-[#002060]/20 transition-all">
                <svg className="w-10 h-10 text-[#008751]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              
              {/* Nom du partenaire */}
              <h4 className="font-heading font-bold text-sm text-[#002060] mb-2 group-hover:text-[#008751] transition-colors">
                {partner.name}
              </h4>
              
              {/* Type */}
              <span className="inline-block px-3 py-1 bg-gray-100 text-[#666666] text-xs font-medium rounded-full">
                {partner.type}
              </span>
            </motion.div>
          ))}
        </div>

        {/* Appel à devenir partenaire */}
        <FadeInView className="text-center mt-16">
          <div className="bg-white rounded-2xl p-8 md:p-10 shadow-xl max-w-2xl mx-auto">
            <h3 className="font-heading font-bold text-xl text-[#002060] mb-3">
              Devenir partenaire
            </h3>
            <p className="text-[#666666] text-sm mb-6">
              Vous partagez notre vision et souhaitez collaborer avec nous ? Rejoignez notre réseau de partenaires engagés pour le développement durable.
            </p>
            <a
              href="mailto:associationjudcd@gmail.com?subject=Proposition%20de%20partenariat"
              className="inline-flex items-center gap-2 px-6 py-3 border-2 border-[#008751] text-[#008751] font-semibold rounded-xl hover:bg-[#008751] hover:text-white transition-all group"
            >
              Proposer un partenariat
              <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </a>
          </div>
        </FadeInView>

      </div>
    </section>
  );
}