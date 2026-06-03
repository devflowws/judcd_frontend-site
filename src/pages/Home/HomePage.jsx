import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { ASSOCIATION } from '@utils/constants';

// Sections
import Hero from '@components/sections/Hero/Hero';
import Stats from '@components/sections/Stats/Stats';
import Mission from '@components/sections/Mission/Mission';
import About from '@components/sections/About/About';
import Actions from '@components/sections/Actions/Actions';
import Gallery from '@components/sections/Gallery/Gallery';
import Team from '@components/sections/Team/Team';
import Testimonials from '@components/sections/Testimonials/Testimonials';
import Blog from '@components/sections/Blog/Blog';
import Partners from '@components/sections/Partners/Partners';
import Newsletter from '@components/sections/Newsletter/Newsletter';
import Contact from '@components/sections/Contact/Contact';
import Donation from '@components/sections/Donation/Donation';

// ==========================================
// PAGE D'ACCUEIL JUDCD
// ==========================================

export default function HomePage() {
  // Scroll vers le haut au chargement
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      <Helmet>
        <title>{ASSOCIATION.name} - {ASSOCIATION.slogan}</title>
        <meta name="description" content={ASSOCIATION.longDescription} />
        <meta property="og:title" content={`${ASSOCIATION.name} - ${ASSOCIATION.slogan}`} />
        <meta property="og:description" content={ASSOCIATION.shortDescription} />
        <link rel="canonical" href="https://judcd.tg" />
      </Helmet>

      <motion.main
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        {/* Section 1 : Hero - Impact visuel immédiat */}
        <Hero />

        {/* Section 2 : Statistiques - Crédibiliser avec les chiffres */}
        <Stats />

        {/* Section 3 : Mission & Services - Expliquer les actions */}
        <Mission />

        {/* Section 4 : À propos - Présenter l'association */}
        <About />

        {/* Section 5 : Actions communautaires - Réalisations sur le terrain */}
        <Actions />

        {/* Section 6 : Galerie - Montrer les réalisations en images */}
        <Gallery />

        {/* Section 6 : Équipe - Présenter le bureau exécutif */}
        <Team />

        {/* Section 7 : Témoignages - Preuve sociale */}
        <Testimonials />

        {/* Section 8 : Actualités - Contenu frais et engageant */}
        <Blog />

        {/* Section 9 : Partenaires - Afficher les soutiens */}
        <Partners />

        {/* Section 10 : Don - Appel à contribution */}
        <Donation />

        {/* Section 11 : Newsletter - Capturer les emails */}
        <Newsletter />

        {/* Section 12 : Contact - Point de conversion final */}
        <Contact />
      </motion.main>
    </>
  );
}