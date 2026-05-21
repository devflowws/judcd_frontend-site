import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '@context/LanguageContext';
import { HorizontalTeamCarousel } from '@components/ui/Carousel';
import FadeInView from '@components/ui/Animations/FadeInView';
import { getMembres } from '../../../services/membreService';

export default function Team() {
  const { t } = useLanguage();
  const [dbMembers, setDbMembers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkMembers = async () => {
      try {
        const response = await getMembres();
        const rawData = Array.isArray(response) ? response : response.results || [];
        setDbMembers(rawData);
      } catch (err) {
        console.error(err);
        setDbMembers([]);
      } finally {
        setLoading(false);
      }
    };
    checkMembers();
  }, []);

  // Déterminer s'il y a un président dans les données récupérées pour la citation
  const president = dbMembers.find(m => m.role?.toLowerCase().includes('président') || m.role?.toLowerCase().includes('president'));

  return (
    <section id="team" className="py-20 md:py-28 bg-[#F8FAF9] relative overflow-hidden">
      {/* Éléments décoratifs */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-[#FFD100]/5 rounded-full -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#008751]/5 rounded-full translate-y-1/2 -translate-x-1/2" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        
        {/* En-tête */}
        <FadeInView className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-sm font-semibold text-[#008751] uppercase tracking-wider mb-3 block">
            {t('section.team')}
          </span>
          <h2 className="font-heading font-extrabold text-3xl md:text-4xl lg:text-5xl text-[#002060] mb-6 leading-tight">
            Notre Bureau Exécutif
          </h2>
          <p className="text-[#666666] text-lg">
            Une équipe de jeunes engagés, passionnés et déterminés à faire la différence dans leurs communautés.
          </p>
        </FadeInView>

        {/* Carrousel ou Message Vide intégré */}
        <FadeInView>
          <HorizontalTeamCarousel />
        </FadeInView> 

        {/* Affichages conditionnels additionnels (Uniquement s'il y a des membres en BDD) */}
        {!loading && (
          <>
            {/* Citation dynamique du Président si présente dans sa description ou son modèle */}
            {president && president.citation && (
              <FadeInView className="mt-16 max-w-3xl mx-auto text-center">
                <div className="relative bg-white rounded-2xl p-8 md:p-10 shadow-xl">
                  <svg className="absolute top-4 left-4 w-12 h-12 text-[#008751]/10" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                  </svg>
                  
                  <blockquote className="text-lg md:text-xl text-[#333333] leading-relaxed mb-6 relative z-10">
                    "{president.citation}"
                  </blockquote>
                  
                  <div className="flex items-center justify-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-[#008751] flex items-center justify-center text-white font-bold text-lg">
                      {president.nom_complet?.charAt(0)}
                    </div>
                    <div className="text-left">
                      <p className="font-heading font-bold text-[#002060]">
                        {president.nom_complet}
                      </p>
                      <p className="text-sm text-[#008751] font-semibold">
                        {president.role}
                      </p>
                    </div>
                  </div>
                </div>
              </FadeInView>
            )}

            {/* Lien vers la page équipe complète */}
            <FadeInView className="text-center mt-12">
              <Link
                to="/equipe"
                className="inline-flex items-center gap-2 px-6 py-3 border-2 border-[#008751] text-[#008751] font-semibold rounded-xl hover:bg-[#008751] hover:text-white transition-all group"
              >
                Voir toute l'équipe
                <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            </FadeInView>
          </>
        )}

      </div>
    </section>
  );
}