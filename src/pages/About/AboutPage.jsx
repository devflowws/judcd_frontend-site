import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { ASSOCIATION, MISSION, KEY_FIGURES } from '@utils/constants';
import { useLanguage } from '@context/LanguageContext';
import FadeInView from '@components/ui/Animations/FadeInView';

export default function AboutPage() {
  const { t } = useLanguage();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      <Helmet>
        <title>{t('nav.about')} - {ASSOCIATION.name}</title>
        <meta name="description" content={t('about.content1')} />
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
            <div className="absolute top-10 right-10 w-64 h-64 border-2 border-white rounded-full" />
            <div className="absolute bottom-10 left-10 w-48 h-48 border border-white rounded-full" />
          </div>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative text-center">
            <motion.h1
              className="font-heading font-extrabold text-4xl md:text-5xl lg:text-6xl mb-6"
              initial={{ y: -30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              {t('aboutpage.banner')} {ASSOCIATION.name}
            </motion.h1>
            <motion.p
              className="text-white/80 text-lg max-w-3xl mx-auto"
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              {t('about.content1')}
            </motion.p>
          </div>
        </section>

        {/* Notre mission */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <FadeInView className="text-center max-w-3xl mx-auto mb-16">
              <h2 className="font-heading font-extrabold text-3xl md:text-4xl text-[#002060] mb-6">
                {t('aboutpage.mission.h')}
              </h2>
              <p className="text-[#666666] text-lg leading-relaxed">
                {t('home.mission.statement')}
              </p>
            </FadeInView>

            <FadeInView className="text-center max-w-3xl mx-auto mb-16">
              <h2 className="font-heading font-extrabold text-3xl md:text-4xl text-[#002060] mb-6">
                {t('aboutpage.vision.h')}
              </h2>
              <p className="text-[#666666] text-lg leading-relaxed">
                {t('home.vision.statement')}
              </p>
            </FadeInView>

            <FadeInView>
              <h2 className="font-heading font-extrabold text-3xl md:text-4xl text-[#002060] mb-10 text-center">
                {t('aboutpage.values.h')}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
                {MISSION.values.map((value, index) => (
                  <div
                    key={value.name}
                    className="bg-[#F8FAF9] rounded-xl p-6 text-center border-t-4 border-[#008751] hover:shadow-lg transition-all"
                  >
                    <h3 className="font-heading font-bold text-[#002060] mb-2">{t(`value.${index}.name`)}</h3>
                    <p className="text-sm text-[#666666]">{t(`value.${index}.desc`)}</p>
                  </div>
                ))}
              </div>
            </FadeInView>
          </div>
        </section>

        {/* Chiffres clés */}
        <section className="py-20 bg-[#F8FAF9]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <FadeInView className="text-center mb-16">
              <h2 className="font-heading font-extrabold text-3xl md:text-4xl text-[#002060]">
                {t('aboutpage.figures.h')}
              </h2>
            </FadeInView>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {KEY_FIGURES.map((stat, index) => (
                <FadeInView key={index}>
                  <div className="text-center">
                    <p className="font-heading font-extrabold text-5xl text-[#008751] mb-2">
                      {stat.value}{stat.suffix}
                    </p>
                    <p className="text-[#666666] font-medium">{t(`figure.${index}.label`)}</p>
                  </div>
                </FadeInView>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-20 bg-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <FadeInView>
              <h2 className="font-heading font-extrabold text-3xl md:text-4xl text-[#002060] mb-6">
                {t('aboutpage.cta.h')}
              </h2>
              <p className="text-[#666666] text-lg mb-8">
                {t('aboutpage.cta.text')}
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  to="/adherer"
                  className="px-8 py-4 bg-[#008751] text-white font-bold rounded-xl hover:bg-[#006B41] transition-all shadow-lg shadow-green-500/25"
                >
                  {t('aboutpage.cta.member')}
                </Link>
                <Link
                  to="/contact"
                  className="px-8 py-4 border-2 border-[#008751] text-[#008751] font-bold rounded-xl hover:bg-[#008751] hover:text-white transition-all"
                >
                  {t('aboutpage.cta.contact')}
                </Link>
              </div>
            </FadeInView>
          </div>
        </section>
      </motion.main>
    </>
  );
}