import { motion } from 'framer-motion';
import { MISSION, SERVICES, COLORS } from '@utils/constants';
import { useLanguage } from '@context/LanguageContext';
import FadeInView, { StaggerChildren } from '@components/ui/Animations/FadeInView';
import Card from '@components/ui/Card/Card';

// ==========================================
// SECTION MISSION & SERVICES JUDCD
// ==========================================

const serviceIcons = {
  academic: (
    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 14l9-5-9-5-9 5 9 5z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
    </svg>
  ),
  awareness: (
    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
    </svg>
  ),
  development: (
    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
    </svg>
  ),
  entrepreneurship: (
    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
    </svg>
  ),
  social: (
    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
    </svg>
  ),
  ecology: (
    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
};

export default function Mission() {
  const { t } = useLanguage();

  return (
    <section id="mission" className="py-20 md:py-28 bg-[#F8FAF9] relative overflow-hidden">
      {/* Fond decoratif */}
      <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-white to-transparent" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        
        {/* En-tete de section */}
        <FadeInView className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-sm font-semibold text-[#008751] uppercase tracking-wider mb-3 block">
            {t('section.mission')}
          </span>
          <h2 className="font-heading font-extrabold text-3xl md:text-4xl lg:text-5xl text-[#002060] mb-6 leading-tight">
            {MISSION.mission}
          </h2>
          <p className="text-[#666666] text-lg leading-relaxed">
            {MISSION.vision}
          </p>
        </FadeInView>

        {/* Grille des services */}
        <StaggerChildren className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {SERVICES.map((service, index) => (
            <Card key={service.id} className="group text-center p-8">
              {/* Icone */}
              <div className="w-16 h-16 mx-auto mb-6 bg-gradient-to-br from-[#008751]/10 to-[#002060]/10 rounded-2xl flex items-center justify-center text-[#008751] group-hover:scale-110 group-hover:bg-[#008751] group-hover:text-white transition-all duration-300">
                {serviceIcons[service.icon] || serviceIcons.academic}
              </div>
              
              {/* Contenu */}
              <h3 className="font-heading font-bold text-xl text-[#002060] mb-3 group-hover:text-[#008751] transition-colors">
                {service.title}
              </h3>
              <p className="text-[#666666] text-sm leading-relaxed">
                {service.description}
              </p>
              
              {/* Public cible */}
              <div className="mt-4 pt-4 border-t border-gray-100">
                <p className="text-xs text-[#666666]">
                  <span className="font-semibold text-[#002060]">Public :</span> {service.publicCible}
                </p>
              </div>
            </Card>
          ))}
        </StaggerChildren>

        {/* Valeurs */}
        <FadeInView className="mt-20">
          <div className="text-center mb-12">
            <span className="text-sm font-semibold text-[#008751] uppercase tracking-wider mb-3 block">
              {t('section.values')}
            </span>
            <h2 className="font-heading font-extrabold text-3xl md:text-4xl text-[#002060]">
              Ce qui nous anime
            </h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {MISSION.values.map((value, index) => (
              <motion.div
                key={index}
                className="bg-white rounded-xl p-6 text-center shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-t-4 border-[#008751]"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <h4 className="font-heading font-bold text-[#002060] mb-2">{value.name}</h4>
                <p className="text-xs text-[#666666]">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </FadeInView>

      </div>
    </section>
  );
}