import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { EXECUTIVE_TEAM } from '@utils/constants';
import { useLanguage } from '@context/LanguageContext';
import { TeamCard } from '@components/ui/Card/Card';
import FadeInView, { StaggerChildren } from '@components/ui/Animations/FadeInView';

// ==========================================
// SECTION EQUIPE JUDCD
// ==========================================

export default function Team() {
  const { t } = useLanguage();

  // Afficher seulement les 4 premiers membres sur la page d'accueil
  const displayTeam = EXECUTIVE_TEAM.slice(0, 4);

  return (
    <section id="team" className="py-20 md:py-28 bg-[#F8FAF9] relative overflow-hidden">
      {/* Elements decoratifs */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-[#FFD100]/5 rounded-full -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#008751]/5 rounded-full translate-y-1/2 -translate-x-1/2" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        
        {/* En-tete */}
        <FadeInView className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-sm font-semibold text-[#008751] uppercase tracking-wider mb-3 block">
            {t('section.team')}
          </span>
          <h2 className="font-heading font-extrabold text-3xl md:text-4xl lg:text-5xl text-[#002060] mb-6 leading-tight">
            Notre Bureau Executif
          </h2>
          <p className="text-[#666666] text-lg">
            Une equipe de jeunes engages, passionnes et determines a faire la difference dans leurs communautes.
          </p>
        </FadeInView>

        {/* Grille de l'equipe */}
        <StaggerChildren className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {displayTeam.map((member) => (
            <TeamCard
              key={member.id}
              photo={member.photo}
              name={member.name}
              role={member.role}
              bio={member.bio}
              quote={member.quote}
              email={member.email}
              phone={member.phone}
            />
          ))}
        </StaggerChildren>

        {/* Citation du President */}
        {EXECUTIVE_TEAM[0]?.quote && (
          <FadeInView className="mt-16 max-w-3xl mx-auto text-center">
            <div className="relative bg-white rounded-2xl p-8 md:p-10 shadow-xl">
              {/* Guillemets decoratifs */}
              <svg className="absolute top-4 left-4 w-12 h-12 text-[#008751]/10" fill="currentColor" viewBox="0 0 24 24">
                <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
              </svg>
              
              <blockquote className="text-lg md:text-xl text-[#333333] leading-relaxed mb-6 relative z-10">
                "{EXECUTIVE_TEAM[0].quote}"
              </blockquote>
              
              <div className="flex items-center justify-center gap-3">
                <div className="w-12 h-12 rounded-full bg-[#008751] flex items-center justify-center text-white font-bold text-lg">
                  {EXECUTIVE_TEAM[0].name.charAt(0)}
                </div>
                <div className="text-left">
                  <p className="font-heading font-bold text-[#002060]">
                    {EXECUTIVE_TEAM[0].name}
                  </p>
                  <p className="text-sm text-[#008751] font-semibold">
                    {EXECUTIVE_TEAM[0].role}
                  </p>
                </div>
              </div>
            </div>
          </FadeInView>
        )}

        {/* Lien vers la page equipe complete */}
        <FadeInView className="text-center mt-12">
          <Link
            to="/equipe"
            className="inline-flex items-center gap-2 px-6 py-3 border-2 border-[#008751] text-[#008751] font-semibold rounded-xl hover:bg-[#008751] hover:text-white transition-all group"
          >
            Voir toute l'equipe
            <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </FadeInView>

      </div>
    </section>
  );
}