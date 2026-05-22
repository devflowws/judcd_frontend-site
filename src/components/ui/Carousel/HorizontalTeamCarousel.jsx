import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { getMembres } from '../../../services/membreService';

export default function HorizontalTeamCarousel() {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [itemsToShow, setItemsToShow] = useState(4);

  // 1. Appel API pour récupérer et mapper uniquement les membres réels de JUDCD
  useEffect(() => {
    let isMounted = true;

    const fetchMembers = async () => {
      try {
        const response = await getMembres();
        // console.log("Ma réponse API brute :", response);

        // Extraction sûre du tableau à partir de l'enveloppe { success: true, data: [...] }
        const rawData = response && response.data ? response.data : [];

        // CRUCIAL : Correspondance des champs Django (nom_complet, infos) -> Champs React (name, bio)
        const mappedData = rawData.map(member => ({
          id: member.id,
          name: member.nom_complet, // Transforme nom_complet en name
          role: member.role,
          photo: member.photo,
          phone: member.telephone,
          email: member.email,
          bio: member.infos,        // Transforme infos en bio
          reseaux: member.reseaux_sociaux || {},
          quote: member.citation || ""
        }));

        if (isMounted) {
          setMembers(mappedData);
          setError(null);
        }
      } catch (err) {
        console.error("Erreur lors de la récupération des membres :", err);
        if (isMounted) {
          setError("Impossible de charger les membres de l'équipe.");
          setMembers([]);
        }
      } finally {
        if (isMounted) {
          setLoading(false); // 💡 Désactive l'écran de chargement quoi qu'il arrive
        }
      }
    };

    fetchMembers();
    return () => { isMounted = false; };
  }, []);

  // 2. Gestion de l'affichage responsive
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) setItemsToShow(1);
      else if (window.innerWidth < 1024) setItemsToShow(2);
      else setItemsToShow(4);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // 3. Défilement automatique basé sur les membres chargés
  useEffect(() => {
    if (isPaused || members.length <= itemsToShow) return;
    
    const interval = setInterval(() => {
      setCurrentIndex((prev) => {
        const next = prev + 1;
        if (next >= members.length) {
          return 0;
        }
        return next;
      });
    }, 2500);

    return () => clearInterval(interval);
  }, [isPaused, members.length, itemsToShow]);

  // État de chargement initial
  if (loading) {
    return (
      <div className="flex justify-center items-center py-12 text-[#002060] font-semibold">
        Chargement des membres de l'équipe...
      </div>
    );
  }

  // Si la base de données ne renvoie aucun élément
  if (members.length === 0) {
    return (
      <div className="text-center py-12 px-4 bg-white rounded-2xl shadow-sm max-w-xl mx-auto border border-gray-100">
        <svg className="w-12 h-12 mx-auto text-gray-400 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
        <p className="text-[#666666] font-medium text-base">
          Aucun membre ajouté pour l'instantané...
        </p>
      </div>
    );
  }

  // Duplication pour effet infini sécurisé
  // L'effet de carrousel infini (Duplication des données)
  const extendedMembers = [...members, ...members, ...members];
  const cardWidth = itemsToShow === 1 ? 'w-full' : itemsToShow === 2 ? 'w-1/2' : 'w-1/4';

  const goNext = () => {
    setIsPaused(true);
    setCurrentIndex((prev) => (prev + 1) % members.length);
    setTimeout(() => setIsPaused(false), 4000);
  };

  const goPrev = () => {
    setIsPaused(true);
    setCurrentIndex((prev) => (prev - 1 + members.length) % members.length);
    setTimeout(() => setIsPaused(false), 4000);
  };

  const goTo = (index) => {
    setIsPaused(true);
    setCurrentIndex(index);
    setTimeout(() => setIsPaused(false), 4000);
  };

  return (
    <div
      className="relative max-w-6xl mx-auto"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="relative overflow-hidden rounded-2xl py-4">
        <motion.div
          className="flex"
          animate={{
            x: `-${currentIndex * (100 / itemsToShow)}%`,
          }}
          transition={{
            type: 'spring',
            stiffness: 120,
            damping: 20,
            mass: 1,
          }}
        >
          {extendedMembers.map((member, index) => (
            <div
              key={`${member.id}-${index}`}
              className={`${cardWidth} flex-shrink-0 px-2 sm:px-3`}
            >
              <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden h-full flex flex-col group">
                {/* Photo */}
                <div className="relative aspect-[3/4] overflow-hidden bg-gradient-to-br from-[#002060]/10 to-[#008751]/10">
                  {member.photo ? (
                    <img
                      src={member.photo}
                      alt={member.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      loading="lazy"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-br from-[#008751] to-[#002060] flex items-center justify-center text-white text-xl sm:text-2xl font-bold">
                        {member.name?.charAt(0) || '?'}
                      </div>
                    </div>
                  )}
                  
                  {/* Overlay actions au survol */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-end justify-center p-3 sm:p-4">
                    <div className="flex gap-2 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                      {member.email && (
                        <a
                          href={`mailto:${member.email}`}
                          className="w-8 h-8 sm:w-9 sm:h-9 bg-white rounded-full flex items-center justify-center text-[#002060] hover:bg-[#008751] hover:text-white transition-all shadow-lg"
                          title="Email"
                        >
                          <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                          </svg>
                        </a>
                      )}
                      {member.phone && (
                        <a
                          href={`tel:${member.phone.replace(/\s+/g, '')}`}
                          className="w-8 h-8 sm:w-9 sm:h-9 bg-white rounded-full flex items-center justify-center text-[#002060] hover:bg-[#008751] hover:text-white transition-all shadow-lg"
                          title="Appeler"
                        >
                          <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                          </svg>
                        </a>
                      )}
                    </div>
                  </div>
                </div>

                {/* Infos */}
                <div className="p-3 sm:p-4 flex-1 flex flex-col">
                  <span className="inline-block text-[9px] sm:text-[10px] font-semibold text-[#008751] bg-[#008751]/10 px-2 py-0.5 rounded-full mb-1.5 w-fit uppercase tracking-wider">
                    {member.role}
                  </span>
                  <h3 className="font-heading font-bold text-xs sm:text-sm text-[#002060] mb-1 line-clamp-1">
                    {member.name}
                  </h3>
                  <p className="text-[10px] sm:text-xs text-[#666666] line-clamp-2 leading-relaxed">
                    {member.bio}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </motion.div>

        {/* Flèches de navigation */}
        {members.length > itemsToShow && (
          <>
            <button
              onClick={goPrev}
              className="absolute left-2 sm:left-3 top-1/2 -translate-y-1/2 w-8 h-8 sm:w-10 sm:h-10 bg-white shadow-lg rounded-full flex items-center justify-center text-[#002060] hover:bg-[#008751] hover:text-white transition-all z-10"
              aria-label="Precedent"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              onClick={goNext}
              className="absolute right-2 sm:right-3 top-1/2 -translate-y-1/2 w-8 h-8 sm:w-10 sm:h-10 bg-white shadow-lg rounded-full flex items-center justify-center text-[#002060] hover:bg-[#008751] hover:text-white transition-all z-10"
              aria-label="Suivant"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </>
        )}
      </div>

      {/* Indicateurs dots */}
      {members.length > itemsToShow && (
        <div className="flex justify-center gap-2 mt-4">
          {members.map((_, index) => (
            <button
              key={index}
              onClick={() => goTo(index)}
              className={`h-2 rounded-full transition-all duration-500 ${
                index === currentIndex
                  ? 'bg-[#008751] w-8'
                  : 'bg-gray-300 hover:bg-gray-400 w-2'
              }`}
              aria-label={`Voir ${members[index]?.name}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}