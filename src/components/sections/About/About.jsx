import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ASSOCIATION, MISSION, PAGE_CONTENT } from '@utils/constants';
import { useLanguage } from '@context/LanguageContext';
import FadeInView, { RevealSection } from '@components/ui/Animations/FadeInView';

// ==========================================
// SECTION A PROPOS JUDCD
// ==========================================

export default function About() {
  const { t } = useLanguage();

  return (
    <section id="about" className="py-20 md:py-28 bg-white relative overflow-hidden">
      {/* Elements decoratifs */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#008751]/5 rounded-full -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-72 h-72 bg-[#FFD100]/5 rounded-full translate-y-1/2 -translate-x-1/2" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-20 items-center">
          
          {/* Colonne gauche - Image */}
          <FadeInView direction="left" className="relative">
            <div className="relative">
              {/* Image principale */}
              <div className="aspect-[4/5] rounded-2xl overflow-hidden shadow-2xl">
                <div className="w-full h-full bg-gradient-to-br from-[#008751] to-[#002060] flex items-center justify-center relative">
                  {/* Logo JUDCD en filigrane */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-30">
                    <img 
                      src="/assets/images/logo2.png" 
                      alt="JUDCD Logo"
                      className="w-[40rem] h-[40rem] md:w-[48rem] md:h-[48rem] object-contain opacity-40 filter brightness-0 invert"
                    />
                  </div>
                  
                  {/* Contenu au premier plan */}
                  <div className="text-center text-white p-8 relative z-10">
                    <svg className="w-24 h-24 mx-auto mb-6 opacity-80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                    <p className="font-heading font-bold text-xl">{ASSOCIATION.name}</p>
                    <p className="text-white/70 text-sm mt-2">{t('about.founded')}</p>
                  </div>
                </div>
              </div>

              {/* Carte flottante */}
              <motion.div
                className="absolute -bottom-8 -right-8 bg-white rounded-2xl shadow-2xl p-4 sm:p-6 max-w-xs sm:max-w-sm"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4 }}
              >
                <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-[#008751]/10 rounded-full flex items-center justify-center">
                    <svg className="w-4 h-4 sm:w-5 sm:h-5 text-[#008751]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-bold text-[#002060] text-sm sm:text-lg">N° {ASSOCIATION.registrationNumber}</p>
                    <p className="text-[10px] sm:text-xs text-[#666666]">Association enregistrée</p>
                  </div>
                </div>
              </motion.div>
            </div>
          </FadeInView>

          {/* Colonne droite - Contenu */}
          <FadeInView direction="right">
            <RevealSection withLine lineColor="#008751">
              <span className="text-sm font-semibold text-[#008751] uppercase tracking-wider mb-3 block">
                {t('nav.about')}
              </span>
              <h2 className="font-heading font-extrabold text-3xl md:text-4xl text-[#002060] mb-6 leading-tight">
                {PAGE_CONTENT.about.title}
              </h2>
            </RevealSection>

            <div className="space-y-4 text-[#666666] leading-relaxed">
              <p>
                {PAGE_CONTENT.about.content}
              </p>
              <p>
                Convaincus que la jeunesse represente une force essentielle pour le changement, nous mobilisons les jeunes autour d'actions concretes visant a promouvoir le developpement durable, la solidarite et l'innovation sociale.
              </p>
              <p>
                Notre ambition est de batir des communautes <strong className="text-[#002060]">autonomes, inclusives et resilientes</strong>, ou chacun peut contribuer activement au developpement durable.
              </p>
            </div>

            {/* Liste des objectifs */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-8">
              {[
                'Promouvoir le leadership des jeunes',
                'Soutenir les initiatives locales',
                'Sensibiliser aux enjeux environnementaux',
                'Renforcer la solidarite et la cohesion sociale',
              ].map((item, index) => (
                <div key={index} className="flex items-start gap-3">
                  <div className="w-5 h-5 bg-[#008751] rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span className="text-sm text-[#333333] font-medium">{item}</span>
                </div>
              ))}
            </div>

            {/* Boutons */}
            <div className="flex flex-col sm:flex-row gap-4 mt-10">
              <Link
                to="/a-propos"
                className="inline-flex items-center justify-center px-6 py-3 bg-[#008751] text-white font-semibold rounded-xl hover:bg-[#006B41] transition-all shadow-lg shadow-green-500/25 group"
              >
                En savoir plus
                <svg className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
              <Link
                to="/contact"
                className="inline-flex items-center justify-center px-6 py-3 border-2 border-[#008751] text-[#008751] font-semibold rounded-xl hover:bg-[#008751] hover:text-white transition-all"
              >
                Nous contacter
              </Link>
            </div>
          </FadeInView>

        </div>
      </div>
    </section>
  );
}