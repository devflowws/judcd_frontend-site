import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { ASSOCIATION, MEMBER_CATEGORIES, MEMBERSHIP_FEE } from '@utils/constants';
import { useLanguage } from '@context/LanguageContext';
import FadeInView from '@components/ui/Animations/FadeInView';
import { formatPrice } from '@utils/formatters';

export default function JoinPage() {
  const { t } = useLanguage();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      <Helmet>
        <title>Adhérer - {ASSOCIATION.name}</title>
        <meta name="description" content="Rejoignez JUDCD et participez à nos actions de développement communautaire durable. Découvrez les catégories de membres et les avantages." />
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
            <div className="absolute top-0 right-0 w-80 h-80 border-2 border-white rounded-full translate-x-1/3 -translate-y-1/3" />
          </div>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative text-center">
            <motion.h1
              className="font-heading font-extrabold text-4xl md:text-5xl lg:text-6xl mb-6"
              initial={{ y: -30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              Rejoindre JUDCD
            </motion.h1>
            <motion.p
              className="text-white/80 text-lg max-w-3xl mx-auto"
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              Vous souhaitez vous engager pour le développement de votre communauté ? Rejoignez un réseau de jeunes et d'acteurs engagés qui travaillent ensemble pour créer un impact positif et durable.
            </motion.p>
          </div>
        </section>

        {/* Avantages */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <FadeInView className="text-center max-w-3xl mx-auto mb-16">
              <h2 className="font-heading font-extrabold text-3xl md:text-4xl text-[#002060] mb-6">
                Pourquoi nous rejoindre ?
              </h2>
              <p className="text-[#666666] text-lg">
                En devenant membre de l'association, vous pourrez :
              </p>
            </FadeInView>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                {
                  title: 'Participer aux activités',
                  description: 'Prenez part aux projets communautaires et aux actions sur le terrain.',
                  icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z',
                },
                {
                  title: 'Développer vos compétences',
                  description: 'Formation en leadership, entrepreneuriat et engagement citoyen.',
                  icon: 'M12 14l9-5-9-5-9 5 9 5z M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z',
                },
                {
                  title: 'Collaborer avec des jeunes',
                  description: 'Échangez avec des jeunes motivés et engagés comme vous.',
                  icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z',
                },
                {
                  title: 'Contribuer au changement',
                  description: 'Participez à des initiatives qui améliorent les conditions de vie.',
                  icon: 'M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z',
                },
              ].map((item, index) => (
                <FadeInView key={index} delay={index * 0.1}>
                  <div className="bg-white rounded-xl p-6 shadow-lg text-center hover:shadow-xl transition-all border-t-4 border-[#008751] h-full">
                    <div className="w-14 h-14 mx-auto mb-4 bg-[#008751]/10 rounded-xl flex items-center justify-center">
                      <svg className="w-7 h-7 text-[#008751]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={item.icon} />
                      </svg>
                    </div>
                    <h3 className="font-heading font-bold text-[#002060] mb-2">{item.title}</h3>
                    <p className="text-sm text-[#666666]">{item.description}</p>
                  </div>
                </FadeInView>
              ))}
            </div>
          </div>
        </section>

        {/* Catégories de membres */}
        <section className="py-20 bg-[#F8FAF9]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <FadeInView className="text-center max-w-3xl mx-auto mb-16">
              <h2 className="font-heading font-extrabold text-3xl md:text-4xl text-[#002060] mb-6">
                Catégories de membres
              </h2>
              <p className="text-[#666666] text-lg">
                Choisissez la catégorie qui correspond le mieux à votre engagement
              </p>
            </FadeInView>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              {MEMBER_CATEGORIES.map((category, index) => (
                <FadeInView key={index} delay={index * 0.1}>
                  <div className="bg-white rounded-xl p-6 shadow-lg text-center hover:shadow-xl transition-all h-full">
                    <div className="w-12 h-12 mx-auto mb-4 bg-gradient-to-br from-[#008751] to-[#002060] rounded-full flex items-center justify-center text-white font-bold text-lg">
                      {category.name.charAt(0)}
                    </div>
                    <h3 className="font-heading font-bold text-sm text-[#002060] mb-2">{category.name}</h3>
                    <p className="text-xs text-[#666666]">{category.description}</p>
                  </div>
                </FadeInView>
              ))}
            </div>
          </div>
        </section>

        {/* Cotisation et contact */}
        <section className="py-20 bg-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <FadeInView>
              <div className="bg-gradient-to-br from-[#002060] to-[#008751] rounded-2xl p-10 md:p-14 text-white text-center shadow-2xl">
                <h2 className="font-heading font-extrabold text-3xl md:text-4xl mb-4">
                  Prêt à vous engager ?
                </h2>
                <p className="text-white/80 text-lg mb-4">
                  La cotisation annuelle est de <span className="text-[#FFD100] font-bold text-xl">{formatPrice(MEMBERSHIP_FEE)}</span>
                </p>
                <p className="text-white/70 text-sm mb-8">
                  L'adhésion est ouverte à toute personne partageant les valeurs et la vision de l'association.
                </p>
                <a
                  href="mailto:associationjudcd@gmail.com?subject=Demande%20d'adhésion%20JUDCD"
                  className="inline-flex items-center gap-2 px-8 py-4 bg-[#FFD100] text-[#002060] font-bold rounded-xl hover:bg-[#FFE44D] transition-all shadow-lg group"
                >
                  Demander votre adhésion
                  <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </a>
              </div>
            </FadeInView>
          </div>
        </section>
      </motion.main>
    </>
  );
}