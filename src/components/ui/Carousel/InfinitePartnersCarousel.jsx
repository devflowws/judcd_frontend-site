import { motion } from 'framer-motion';
import { PARTNERS } from '@utils/constants';
import { useLanguage } from '@context/LanguageContext';
import FadeInView from '@components/ui/Animations/FadeInView';
import { Link } from 'react-router-dom';

// ==========================================
// SECTION PARTENAIRES JUDCD
// ==========================================

// Données des partenaires
const partnersList = PARTNERS.map((partner, index) => ({
  id: index + 1,
  name: partner,
  logo: null,
  category: index === 0 ? 'OSC' : index === 1 ? 'Institution' : index === 2 ? 'Association' : index === 3 ? 'Éducation' : 'Technique',
  link: '#',
}));

export default function Partners() {
  const { t } = useLanguage();

  return (
    <section id="partners" className="py-20 md:py-28 bg-[#F8FAF9] relative overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-px bg-gradient-to-r from-transparent via-[#008751]/20 to-transparent" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
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

        {/* Carrousel infini */}
        <InfiniteCarousel partners={partnersList} />

        {/* Appel à devenir partenaire */}
        <FadeInView className="text-center mt-16">
          <div className="bg-white rounded-2xl p-8 md:p-10 shadow-xl max-w-2xl mx-auto">
            <h3 className="font-heading font-bold text-xl text-[#002060] mb-3">
              Devenir partenaire
            </h3>
            <p className="text-[#666666] text-sm mb-6">
              Vous partagez notre vision et souhaitez collaborer avec nous ? Rejoignez notre réseau de partenaires.
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

// ==========================================
// CARROUSEL INFINI FLUIDE
// ==========================================

function InfiniteCarousel({ partners }) {
  // On duplique juste 2 fois pour avoir une boucle infinie sans "calage"
  const duplicated = [...partners, ...partners];

  return (
    <div className="relative overflow-hidden py-8">
      {/* Dégradés sur les bords */}
      <div className="absolute left-0 top-0 bottom-0 w-16 sm:w-24 bg-gradient-to-r from-[#F8FAF9] to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-16 sm:w-24 bg-gradient-to-l from-[#F8FAF9] to-transparent z-10 pointer-events-none" />

      {/* Piste de défilement */}
      <div className="flex animate-scroll gap-6 sm:gap-8">
        {duplicated.map((partner, index) => (
          <div
            key={`${partner.id}-${index}`}
            className="flex-shrink-0 flex flex-col items-center w-[140px] sm:w-[160px] md:w-[180px]"
          >
            <a
              href={partner.link}
              target="_blank"
              rel="noopener noreferrer"
              className="block w-20 h-20 sm:w-24 sm:h-24 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center overflow-hidden group"
            >
              <div className="w-full h-full bg-gradient-to-br from-[#008751]/10 to-[#002060]/10 flex items-center justify-center group-hover:from-[#008751]/20 group-hover:to-[#002060]/20 transition-all">
                <svg className="w-10 h-10 sm:w-12 sm:h-12 text-[#008751]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
            </a>
            <p className="font-heading font-bold text-xs text-[#002060] mt-3 text-center line-clamp-2">
              {partner.name}
            </p>
            <span className="text-[10px] text-[#666666] mt-1 bg-gray-100 px-2 py-0.5 rounded-full">
              {partner.category}
            </span>
          </div>
        ))}
      </div>

      {/* Animation CSS pure - défilement continu SANS calage */}
      <style>{`
        @keyframes scroll {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
        
        .animate-scroll {
          animation: scroll ${partners.length * 4}s linear infinite;
          width: fit-content;
        }
        
        .animate-scroll:hover {
          animation-play-state: paused;
        }
      `}</style>
    </div>
  );
}