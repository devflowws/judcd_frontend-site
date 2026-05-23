import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '@context/LanguageContext';
import FadeInView from '@components/ui/Animations/FadeInView';
import { getPartenaires } from '../../../services/partenairesService';

// ==========================================
// SECTION PARTENAIRES JUDCD
// ==========================================

export default function Partners() {
  const { t } = useLanguage();
  const [partnersList, setPartnersList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const fetchBackendPartners = async () => {
      try {
        const response = await getPartenaires();
        // console.log("response: ", response);
        // Extraction du tableau depuis l'enveloppe { success: true, data: [...] }
        const rawdata = response && response.data ? response.data : [];

        const mappedData = rawdata.map(partner => ({
          id: partner.id,
          name: partner.nom,
          logo: partner.logo,
          link: partner.lien,
          // Récupération sécurisée de la catégorie (gère l'ID brut ou l'objet type_partenaire)
          // category: partner.type_partenaire
          category: partner.type_partenaire_details?.nom || "Partenaire"
        }));

        if (isMounted) {
          setPartnersList(mappedData);
          setLoading(false);
        }
      } catch (error) {
        console.error("Erreur lors de la récupération des partenaires :", error);
        if (isMounted) {
          setPartnersList([]);
          setLoading(false);
        }
      }
    };

    fetchBackendPartners();
    return () => { isMounted = false; };
  }, []);

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

        {/* Rendu conditionnel : Évite les calculs sur un tableau vide pendant le chargement */}
        {loading ? (
          <div className="text-center py-8 text-[#002060] font-semibold">
            Chargement des partenaires...
          </div>
        ) : partnersList.length > 0 ? (
          <FadeInView>
            <InfiniteCarousel partners={partnersList} />
          </FadeInView>
        ) : (
          <div className="text-center py-8 text-gray-500 text-sm italic">
            Aucun partenaire affiché pour le moment.
          </div>
        )}

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

// ==========================================
// CARROUSEL INFINI FLUIDE
// ==========================================

function InfiniteCarousel({ partners }) {
  const duplicated = [...partners, ...partners, ...partners];

  const logoSize = 'w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24';
  const itemWidth = 'w-[130px] sm:w-[150px] md:w-[170px] lg:w-[190px]';
  const iconInner = 'w-8 h-8 sm:w-10 sm:h-10';

  return (
    <div className="relative overflow-hidden py-6 sm:py-8">
      <div className="absolute left-0 top-0 bottom-0 w-10 sm:w-20 bg-gradient-to-r from-[#F8FAF9] to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-10 sm:w-20 bg-gradient-to-l from-[#F8FAF9] to-transparent z-10 pointer-events-none" />

      <div className="flex animate-scroll gap-4 sm:gap-6 md:gap-8">
        {duplicated.map((partner, index) => (
          <div
            key={`${partner.id}-${index}`}
            className={`flex-shrink-0 flex flex-col items-center ${itemWidth}`}
          >
            <a
              href={partner.link || '#'}
              target="_blank"
              rel="noopener noreferrer"
              className={`${logoSize} bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center overflow-hidden group cursor-pointer`}
            >
              {partner.logo ? (
                <img
                  src={partner.logo}
                  alt={partner.name}
                  className="w-full h-full object-contain p-2 sm:p-3 transition-transform duration-300 group-hover:scale-110"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-[#008751]/10 to-[#002060]/10 flex items-center justify-center group-hover:from-[#008751]/20 group-hover:to-[#002060]/20 transition-all">
                  <svg className={`${iconInner} text-[#008751]`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
              )}
            </a>
            <p className="font-heading font-bold text-[10px] sm:text-xs text-[#002060] mt-2 sm:mt-3 text-center leading-tight w-full px-1"
               style={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
              {String(partner.name)}
            </p>
            {partner.category && (
              <span className="text-[8px] sm:text-[10px] text-[#666666] mt-1 bg-gray-100 px-2 py-0.5 rounded-full whitespace-nowrap">
                {String(partner.category)}
              </span>
            )}
          </div>
        ))}
      </div>

      <style>{`
        @keyframes scroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-33.333%); }
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