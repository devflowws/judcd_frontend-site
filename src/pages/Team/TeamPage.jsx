import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { ASSOCIATION, EXECUTIVE_TEAM } from '@utils/constants';
import { useLanguage } from '@context/LanguageContext';
import { TeamCard } from '@components/ui/Card/Card';
import FadeInView from '@components/ui/Animations/FadeInView';
import { getMembres } from '../../services/membreService';

export default function TeamPage() {
  const { t } = useLanguage();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const fetchMembers = async () => {
      try {
        const response = await getMembres(); // Ajout de await si c'est une promesse asynchrone
        const rawdata = response && response.data ? response.data : [];

        const mappedData = rawdata.map(member => ({
          id: member.id,
          name: member.nom_complet,
          role: member.role,
          photo: member.photo,
          phone: member.telephone,
          email: member.email,
          bio: member.infos,
          reseaux: member.reseaux_sociaux || {},
          quote: member.citation || ""
        }));

        // if (isMounted) {
        //   setMembers(mappedData);
        //   setLoading(false);
        // }
        setMembers(mappedData);
        setLoading(false);

      } catch (error) {
        console.error("Erreur lors de la récupération des membres :", error);
        if (isMounted) setLoading(false);
      }
    };

    fetchMembers();
    return () => { isMounted = false; };
  }, []);

  if (loading) {
    return <div className="text-center py-20">Chargement des membres...</div>;
  }


  return (
    <>
      <Helmet>
        <title>{t('section.team')} - {ASSOCIATION.name}</title>
        <meta name="description" content={t('team.description', `Découvrez le bureau exécutif de ${ASSOCIATION.name}, une équipe de jeunes engagés pour le développement durable.`)} />
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
            <div className="absolute bottom-0 left-0 w-64 h-64 border border-white rounded-full -translate-x-1/4 translate-y-1/4" />
          </div>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative text-center">
            <motion.h1
              className="font-heading font-extrabold text-4xl md:text-5xl lg:text-6xl mb-6"
              initial={{ y: -30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              Notre Bureau Exécutif
            </motion.h1>
            <motion.p
              className="text-white/80 text-lg max-w-3xl mx-auto"
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              Une équipe de jeunes passionnés, déterminés à faire la différence dans leurs communautés à travers des actions concrètes et durables.
            </motion.p>
          </div>
        </section>

        {/* Grille de l'équipe */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {members.map((member, index) => (
                <FadeInView key={member.id || index} delay={index * 0.1}>
                  {/* On passe le membre actuel en prop à la carte */}
                  <TeamCard member={member} />
                </FadeInView>
              ))}
            </div>
          </div>
        </section>

        {/* Citation du président */}
        {EXECUTIVE_TEAM[0]?.quote && (
          <section className="py-20 bg-[#F8FAF9]">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
              <FadeInView>
                <div className="relative bg-white rounded-2xl p-10 md:p-14 shadow-xl text-center">
                  <svg className="absolute top-6 left-6 w-16 h-16 text-[#008751]/10" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                  </svg>
                  
                  <blockquote className="text-xl md:text-2xl text-[#333333] leading-relaxed mb-8 relative z-10 italic">
                    "{EXECUTIVE_TEAM[0].quote}"
                  </blockquote>
                  
                  <div className="flex items-center justify-center gap-4">
                    <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[#008751] to-[#002060] flex items-center justify-center text-white font-bold text-xl">
                      {EXECUTIVE_TEAM[0].name.charAt(0)}
                    </div>
                    <div className="text-left">
                      <p className="font-heading font-bold text-[#002060] text-lg">
                        {EXECUTIVE_TEAM[0].name}
                      </p>
                      <p className="text-sm text-[#008751] font-semibold">
                        {EXECUTIVE_TEAM[0].role} de {ASSOCIATION.name}
                      </p>
                    </div>
                  </div>
                </div>
              </FadeInView>
            </div>
          </section>
        )}

        {/* Rejoindre l'équipe */}
        <section className="py-20 bg-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <FadeInView>
              <h2 className="font-heading font-extrabold text-3xl md:text-4xl text-[#002060] mb-6">
                Rejoignez l'aventure
              </h2>
              <p className="text-[#666666] text-lg mb-8">
                Vous avez envie de vous engager et de contribuer au développement de votre communauté ? 
                Rejoignez JUDCD et faites partie du changement.
              </p>
              <a
                href="mailto:associationjudcd@gmail.com?subject=Candidature%20bénévolat%20JUDCD"
                className="inline-flex items-center gap-2 px-8 py-4 bg-[#008751] text-white font-bold rounded-xl hover:bg-[#006B41] transition-all shadow-lg shadow-green-500/25 group"
              >
                Nous rejoindre
                <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </a>
            </FadeInView>
          </div>
        </section>
      </motion.main>
    </>
  );
}