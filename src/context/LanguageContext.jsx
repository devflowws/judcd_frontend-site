import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { LANGUAGES } from '@utils/constants';

// ==========================================
// CONTEXTE DE LANGUE JUDCD
// ==========================================

const LanguageContext = createContext(null);

// Traductions francais
const fr = {
  // Navigation
  'nav.home': 'Accueil',
  'nav.about': 'A propos',
  'nav.mission': 'Nos actions',
  'nav.gallery': 'Galerie',
  'nav.blog': 'Actualites',
  'nav.contact': 'Contact',
  'nav.join': 'Adherer',
  'nav.donate': 'Faire un don',
  'nav.admin': 'Administration',

  // Hero
  'hero.title': 'Ensemble pour un developpement durable de nos communautes',
  'hero.subtitle': 'Jeunes Unis pour le Developpement Communautaire Durable',
  'hero.cta.primary': 'Decouvrir nos actions',
  'hero.cta.secondary': 'Faire un don',

  // Sections communes
  'section.mission': 'Notre mission',
  'section.vision': 'Notre vision',
  'section.values': 'Nos valeurs',
  'section.team': 'Notre equipe',
  'section.gallery': 'Galerie photo',
  'section.blog': 'Actualites',
  'section.contact': 'Contactez-nous',
  'section.partners': 'Nos partenaires',
  'section.testimonials': 'Temoignages',
  'section.stats': 'Quelques chiffres',
  'section.newsletter': 'Newsletter',

  // Footer
  'footer.description': 'Une jeunesse engagee pour promouvoir le developpement durable, la solidarite et l\'innovation sociale au service des communautes.',
  'footer.quickLinks': 'Liens rapides',
  'footer.contact': 'Contact',
  'footer.newsletter': 'Newsletter',
  'footer.newsletter.placeholder': 'Votre email',
  'footer.newsletter.subscribe': 'S\'inscrire',
  'footer.rights': 'Tous droits reserves.',
  'footer.legal': 'Mentions legales',
  'footer.privacy': 'Politique de confidentialite',

  // Boutons
  'button.readMore': 'Lire la suite',
  'button.viewAll': 'Voir tout',
  'button.submit': 'Envoyer',
  'button.cancel': 'Annuler',
  'button.save': 'Enregistrer',
  'button.delete': 'Supprimer',
  'button.edit': 'Modifier',
  'button.back': 'Retour',

  // Formulaire de contact
  'contact.name': 'Nom complet',
  'contact.email': 'Adresse email',
  'contact.phone': 'Telephone',
  'contact.subject': 'Sujet',
  'contact.message': 'Votre message',
  'contact.success': 'Message envoye avec succes !',
  'contact.success.text': 'Nous vous repondrons dans les plus brefs delais.',
  'contact.error': 'Erreur lors de l\'envoi. Veuillez reessayer.',

  // Don
  'donation.title': 'Soutenir JUDCD',
  'donation.description': 'Votre don nous aide a realiser nos projets communautaires.',
  'donation.amount': 'Montant (FCFA)',
  'donation.method': 'Moyen de paiement',
  'donation.success': 'Promesse de don enregistree !',
  'donation.success.text': 'Suivez les instructions pour finaliser votre don.',

  // Adhesion
  'membership.title': 'Rejoindre JUDCD',
  'membership.description': 'Devenez membre et participez a nos actions.',
  'membership.categories': 'Categories de membres',
  'membership.fee': 'Cotisation annuelle : 5 000 FCFA',

  // Admin
  'admin.login': 'Connexion',
  'admin.email': 'Email',
  'admin.password': 'Mot de passe',
  'admin.dashboard': 'Tableau de bord',
  'admin.gallery': 'Galerie',
  'admin.blog': 'Articles',
  'admin.messages': 'Messages',
  'admin.donations': 'Dons',
  'admin.members': 'Membres',
  'admin.settings': 'Parametres',
  'admin.logout': 'Deconnexion',

  // Etats
  'loading': 'Chargement...',
  'noResults': 'Aucun resultat trouve.',
  'error.generic': 'Une erreur est survenue. Veuillez reessayer.',
  'error.notFound': 'Page introuvable.',
};

// Traductions anglais
const en = {
  'nav.home': 'Home',
  'nav.about': 'About',
  'nav.mission': 'Our Actions',
  'nav.gallery': 'Gallery',
  'nav.blog': 'News',
  'nav.contact': 'Contact',
  'nav.join': 'Join Us',
  'nav.donate': 'Donate',
  'nav.admin': 'Administration',

  'hero.title': 'Together for sustainable community development',
  'hero.subtitle': 'United Youth for Sustainable Community Development',
  'hero.cta.primary': 'Discover our actions',
  'hero.cta.secondary': 'Make a donation',

  'section.mission': 'Our Mission',
  'section.vision': 'Our Vision',
  'section.values': 'Our Values',
  'section.team': 'Our Team',
  'section.gallery': 'Photo Gallery',
  'section.blog': 'News',
  'section.contact': 'Contact Us',
  'section.partners': 'Our Partners',
  'section.testimonials': 'Testimonials',
  'section.stats': 'Key Figures',
  'section.newsletter': 'Newsletter',

  'footer.description': 'A youth committed to promoting sustainable development, solidarity and social innovation for communities.',
  'footer.quickLinks': 'Quick Links',
  'footer.contact': 'Contact',
  'footer.newsletter': 'Newsletter',
  'footer.newsletter.placeholder': 'Your email',
  'footer.newsletter.subscribe': 'Subscribe',
  'footer.rights': 'All rights reserved.',
  'footer.legal': 'Legal Notice',
  'footer.privacy': 'Privacy Policy',

  'button.readMore': 'Read More',
  'button.viewAll': 'View All',
  'button.submit': 'Send',
  'button.cancel': 'Cancel',
  'button.save': 'Save',
  'button.delete': 'Delete',
  'button.edit': 'Edit',
  'button.back': 'Back',

  'contact.name': 'Full Name',
  'contact.email': 'Email Address',
  'contact.phone': 'Phone',
  'contact.subject': 'Subject',
  'contact.message': 'Your Message',
  'contact.success': 'Message sent successfully!',
  'contact.success.text': 'We will respond as soon as possible.',
  'contact.error': 'Error sending. Please try again.',

  'donation.title': 'Support JUDCD',
  'donation.description': 'Your donation helps us carry out our community projects.',
  'donation.amount': 'Amount (FCFA)',
  'donation.method': 'Payment Method',
  'donation.success': 'Donation pledge registered!',
  'donation.success.text': 'Follow the instructions to complete your donation.',

  'membership.title': 'Join JUDCD',
  'membership.description': 'Become a member and participate in our actions.',
  'membership.categories': 'Member Categories',
  'membership.fee': 'Annual fee: 5,000 FCFA',

  'admin.login': 'Login',
  'admin.email': 'Email',
  'admin.password': 'Password',
  'admin.dashboard': 'Dashboard',
  'admin.gallery': 'Gallery',
  'admin.blog': 'Posts',
  'admin.messages': 'Messages',
  'admin.donations': 'Donations',
  'admin.members': 'Members',
  'admin.settings': 'Settings',
  'admin.logout': 'Logout',

  'loading': 'Loading...',
  'noResults': 'No results found.',
  'error.generic': 'An error occurred. Please try again.',
  'error.notFound': 'Page not found.',
};

// Toutes les traductions
const translations = { fr, en };

export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState(() => {
    const saved = localStorage.getItem('judcd_language');
    if (saved) return saved;
    // Detection de la langue du navigateur
    const browserLang = navigator.language?.split('-')[0];
    return browserLang === 'fr' ? 'fr' : 'en';
  });

  // Persiste la langue dans le localStorage
  useEffect(() => {
    localStorage.setItem('judcd_language', language);
    document.documentElement.setAttribute('lang', language);
  }, [language]);

  // Fonction de traduction
  const t = useCallback((key, fallback = '') => {
    const langTranslations = translations[language] || translations.fr;
    return langTranslations[key] || translations.fr[key] || fallback || key;
  }, [language]);

  // Changement de langue
  const changeLanguage = useCallback((lang) => {
    if (translations[lang]) {
      setLanguage(lang);
    }
  }, []);

  // Liste des langues disponibles
  const availableLanguages = LANGUAGES;

  const value = {
    language,
    t,
    changeLanguage,
    availableLanguages,
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

// Hook personnalise
export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage doit etre utilise a l\'interieur d\'un LanguageProvider.');
  }
  return context;
}

export default LanguageContext;