import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { LANGUAGES } from '@utils/constants';

// ==========================================
// CONTEXTE DE LANGUE JUDCD
// ==========================================

const LanguageContext = createContext(null);

// Traductions françaises
const fr = {
  // Navigation
  'nav.home': 'Accueil',
  'nav.about': 'À propos',
  'nav.mission': 'Nos actions',
  'nav.gallery': 'Galerie',
  'nav.blog': 'Actualités',
  'nav.contact': 'Contact',
  'nav.join': 'Adhérer',
  'nav.donate': 'Faire un don',
  'nav.admin': 'Administration',

  // Hero
  'hero.title': 'Ensemble pour un développement durable de nos communautés',
  'hero.subtitle': 'Jeunes Unis pour le Développement Communautaire Durable',
  'hero.cta.primary': 'Découvrir nos actions',
  'hero.cta.secondary': 'Faire un don',
  'hero.stats.beneficiaries': 'Bénéficiaires directs',
  'hero.stats.activities': 'Activités communautaires',
  'hero.stats.partners': 'Partenaires locaux',
  'hero.scroll': 'Découvrir',

  // Sections
  'section.mission': 'Notre mission',
  'section.vision': 'Notre vision',
  'section.values': 'Nos valeurs',
  'section.team': 'Notre équipe',
  'section.gallery': 'Galerie photo',
  'section.blog': 'Actualités',
  'section.contact': 'Contactez-nous',
  'section.partners': 'Nos partenaires',
  'section.testimonials': 'Témoignages',
  'section.stats': 'Quelques chiffres',
  'section.newsletter': 'Newsletter',
  'section.about': 'À propos',
  'section.donate': 'Faire un don',
  'section.join': 'Adhérer',

  // À propos
  'about.title': 'Qui sommes-nous ?',
  'about.subtitle': 'À propos de JUDCD',
  'about.founded': 'Depuis le 09 août 2024',
  'about.mission.title': 'Notre Mission',
  'about.vision.title': 'Notre Vision',
  'about.values.title': 'Nos Valeurs',

  // Équipe
  'team.title': 'Notre Bureau Exécutif',
  'team.subtitle': 'Notre équipe',
  'team.description': 'Une équipe de jeunes engagés, passionnés et déterminés à faire la différence dans leurs communautés.',
  'team.viewAll': 'Voir toute l\'équipe',

  // Galerie
  'gallery.title': 'Nos actions en images',
  'gallery.subtitle': 'Galerie photo',
  'gallery.description': 'Découvrez les photos de nos activités de développement communautaire durable au Togo.',
  'gallery.all': 'Toutes les photos',
  'gallery.noPhotos': 'Aucune photo disponible.',

  // Blog
  'blog.title': 'Actualités & Événements',
  'blog.subtitle': 'Dernières nouvelles',
  'blog.description': 'Découvrez nos dernières actualités, événements et initiatives qui font avancer notre mission.',
  'blog.readMore': 'Lire la suite',
  'blog.viewAll': 'Voir toutes les actualités',
  'blog.noArticles': 'Aucun article disponible pour le moment.',

  // Partenaires
  'partners.title': 'Ils nous soutiennent',
  'partners.subtitle': 'Nos partenaires',
  'partners.description': 'Nous collaborons avec des organisations qui partagent notre vision d\'un développement communautaire durable.',
  'partners.become': 'Devenir partenaire',
  'partners.becomeText': 'Vous partagez notre vision et souhaitez collaborer avec nous ? Rejoignez notre réseau de partenaires engagés.',
  'partners.propose': 'Proposer un partenariat',
  'partners.none': 'Aucun partenaire affiché pour le moment.',

  // Témoignages
  'testimonials.title': 'Ce qu\'ils disent de nous',
  'testimonials.subtitle': 'Témoignages',
  'testimonials.description': 'Découvrez les témoignages de ceux qui ont bénéficié de nos actions.',

  // Contact
  'contact.title': 'Parlons ensemble',
  'contact.subtitle': 'Nos coordonnées',
  'contact.description': 'Contactez-nous pour toute question, suggestion ou collaboration.',
  'contact.name': 'Nom complet',
  'contact.email': 'Adresse e-mail',
  'contact.phone': 'Téléphone',
  'contact.subject': 'Sujet',
  'contact.message': 'Votre message',
  'contact.submit': 'Envoyer le message',
  'contact.success': 'Message envoyé avec succès !',
  'contact.success.text': 'Nous vous répondrons dans les plus brefs délais.',
  'contact.error': 'Erreur lors de l\'envoi. Veuillez réessayer.',
  'contact.info.address': 'Adresse',
  'contact.info.phone': 'Téléphone',
  'contact.info.email': 'Email',

  // Don
  'donation.title': 'Soutenir JUDCD',
  'donation.subtitle': 'Faire un don',
  'donation.description': 'Votre don nous aide à réaliser nos projets communautaires. Chaque contribution compte.',
  'donation.amount': 'Montant (FCFA)',
  'donation.name': 'Votre nom',
  'donation.email': 'Votre email',
  'donation.message': 'Message (optionnel)',
  'donation.method': 'Moyen de paiement',
  'donation.transaction': 'Numéro de transaction',
  'donation.submit': 'Confirmer mon don',
  'donation.success': 'Don enregistré avec succès !',
  'donation.success.text': 'Merci pour votre générosité. Votre don sera utilisé pour nos projets communautaires.',
  'donation.error': 'Erreur lors de l\'enregistrement. Veuillez réessayer.',

  // Adhésion
  'membership.title': 'Rejoindre JUDCD',
  'membership.subtitle': 'Devenir membre',
  'membership.description': 'Devenez membre et participez activement à nos actions pour le développement durable.',
  'membership.categories': 'Catégories de membres',
  'membership.fee': 'Cotisation annuelle : 5 000 FCFA',
  'membership.benefits': 'Avantages membres',
  'membership.join': 'Adhérer maintenant',

  // Newsletter
  'newsletter.title': 'Restez informé',
  'newsletter.description': 'Inscrivez-vous à notre newsletter pour recevoir nos actualités et mises à jour.',
  'newsletter.placeholder': 'Votre adresse e-mail',
  'newsletter.subscribe': 'S\'inscrire',
  'newsletter.success': 'Inscription réussie ! Bienvenue dans notre communauté.',
  'newsletter.error': 'Erreur d\'inscription. Veuillez réessayer.',
  'newsletter.exists': 'Cet email est déjà inscrit à la newsletter.',

  // Footer
  'footer.description': 'Une jeunesse engagée pour promouvoir le développement durable, la solidarité et l\'innovation sociale au service des communautés.',
  'footer.quickLinks': 'Liens rapides',
  'footer.contact': 'Contact',
  'footer.newsletter': 'Newsletter',
  'footer.newsletter.placeholder': 'Votre e-mail',
  'footer.newsletter.subscribe': 'S\'inscrire',
  'footer.rights': 'Tous droits réservés.',
  'footer.legal': 'Mentions légales',
  'footer.privacy': 'Politique de confidentialité',

  // Boutons
  'button.readMore': 'Lire la suite',
  'button.viewAll': 'Voir tout',
  'button.submit': 'Envoyer',
  'button.cancel': 'Annuler',
  'button.save': 'Enregistrer',
  'button.delete': 'Supprimer',
  'button.edit': 'Modifier',
  'button.back': 'Retour',
  'button.seeMore': 'En savoir plus',

  // Admin
  'admin.login': 'Connexion',
  'admin.email': 'Email',
  'admin.password': 'Mot de passe',
  'admin.dashboard': 'Tableau de bord',
  'admin.gallery': 'Galerie',
  'admin.blog': 'Actualités',
  'admin.messages': 'Messages',
  'admin.donations': 'Dons',
  'admin.members': 'Membres',
  'admin.settings': 'Paramètres',
  'admin.logout': 'Déconnexion',

  // Stats
  'stats.description': "L'impact de nos actions en quelques chiffres",

  // About textes
  'about.content1': "L'association Jeunes Unis pour le Développement Communautaire Durable (JUDCD) est une organisation engagée qui œuvre pour l'amélioration des conditions de vie des communautés à travers des initiatives sociales, éducatives, environnementales et économiques.",
  'about.content2': "Convaincus que la jeunesse représente une force essentielle pour le changement, nous mobilisons les jeunes autour d'actions concrètes visant à promouvoir le développement durable, la solidarité et l'innovation sociale.",
  'about.content3': "Notre ambition est de bâtir des communautés <strong>autonomes, inclusives et résilientes</strong>, où chacun peut contribuer activement au développement durable.",
  'about.obj1': 'Promouvoir le leadership des jeunes',
  'about.obj2': 'Soutenir les initiatives locales',
  'about.obj3': 'Sensibiliser aux enjeux environnementaux',
  'about.obj4': 'Renforcer la solidarité et la cohésion sociale',
  'about.learnMore': 'En savoir plus',
  'about.contactUs': 'Nous contacter',

  // Mission / Vision (énoncés)
  'home.mission.statement': 'Promouvoir le développement communautaire durable en mobilisant la jeunesse autour d\'initiatives sociales, éducatives, environnementales et économiques au bénéfice des communautés locales.',
  'home.vision.statement': 'Construire des communautés autonomes, solidaires et résilientes où la jeunesse joue un rôle central dans le développement durable et l\'innovation sociale.',
  'values.heading': 'Ce qui nous anime',
  'service.publicLabel': 'Public :',

  // Valeurs
  'value.0.name': 'Solidarité', 'value.0.desc': 'Agir ensemble pour le bien commun de nos communautés.',
  'value.1.name': 'Engagement Citoyen', 'value.1.desc': 'Participer activement à la construction d\'une société meilleure.',
  'value.2.name': 'Transparence', 'value.2.desc': 'Gérer avec honnêteté, clarté et responsabilité.',
  'value.3.name': 'Innovation Sociale', 'value.3.desc': 'Créer des solutions nouvelles adaptées aux besoins locaux.',
  'value.4.name': 'Développement Durable', 'value.4.desc': 'Agir aujourd\'hui en pensant aux générations futures.',

  // Services
  'service.1.title': 'Formation des Jeunes', 'service.1.desc': 'Programmes de formation en leadership, entrepreneuriat et compétences numériques pour préparer la jeunesse à relever les défis de demain.', 'service.1.public': 'Jeunes, étudiants, jeunes diplômés',
  'service.2.title': 'Sensibilisation Communautaire', 'service.2.desc': 'Campagnes de sensibilisation sur la citoyenneté, l\'environnement et la santé pour informer et mobiliser les populations.', 'service.2.public': 'Communautés locales, jeunes, femmes',
  'service.3.title': 'Projets de Développement Local', 'service.3.desc': 'Initiatives concrètes visant à améliorer les conditions de vie des communautés à travers des projets participatifs.', 'service.3.public': 'Communautés locales, populations vulnérables',
  'service.4.title': 'Accompagnement Entrepreneurial', 'service.4.desc': 'Mentorat et soutien aux projets des jeunes entrepreneurs pour stimuler l\'innovation et la création d\'emplois.', 'service.4.public': 'Jeunes entrepreneurs, porteurs de projets',
  'service.5.title': 'Actions Sociales et Humanitaires', 'service.5.desc': 'Actions solidaires pour soutenir les populations vulnérables et renforcer la cohésion sociale dans les communautés.', 'service.5.public': 'Populations vulnérables, communautés locales',
  'service.6.title': 'Promotion du Développement Durable', 'service.6.desc': 'Initiatives écologiques et environnementales pour sensibiliser et agir en faveur de la protection de notre planète.', 'service.6.public': 'Jeunes, écoles, communautés locales',

  // Chiffres clés
  'figure.0.label': 'Bénéficiaires directs', 'figure.1.label': 'Activités communautaires', 'figure.2.label': 'Partenaires locaux', 'figure.3.label': 'Jeunesse engagée',

  // Page À propos
  'aboutpage.banner': 'À propos de', 'aboutpage.mission.h': 'Notre mission', 'aboutpage.vision.h': 'Notre vision', 'aboutpage.values.h': 'Nos valeurs', 'aboutpage.figures.h': 'JUDCD en chiffres',
  'aboutpage.cta.h': 'Rejoignez-nous', 'aboutpage.cta.text': 'Vous partagez nos valeurs et souhaitez contribuer au développement durable de nos communautés ?', 'aboutpage.cta.member': 'Devenir membre', 'aboutpage.cta.contact': 'Nous contacter',

  // Page Équipe
  'teampage.banner.title': 'Notre Bureau Exécutif', 'teampage.banner.desc': 'Une équipe de jeunes passionnés, déterminés à faire la différence dans leurs communautés à travers des actions concrètes et durables.',
  'teampage.loading': 'Chargement des membres...', 'teampage.join.h': 'Rejoignez l\'aventure', 'teampage.join.text': 'Vous avez envie de vous engager et de contribuer au développement de votre communauté ? Rejoignez JUDCD et faites partie du changement.', 'teampage.join.btn': 'Nous rejoindre',

  // Page Galerie
  'gallerypage.desc': 'Découvrez les moments forts de nos actions sur le terrain', 'gallerypage.empty.h': 'Aucune photo pour le moment', 'gallerypage.empty.text': 'Les photos de nos activités seront bientôt disponibles.', 'gallerypage.page': 'Page', 'gallerypage.of': 'sur',

  // Formulaire contact
  'cform.name': 'Nom complet', 'cform.namePh': 'Votre nom complet', 'cform.email': 'Email', 'cform.phone': 'Téléphone', 'cform.subject': 'Sujet', 'cform.message': 'Message', 'cform.messagePh': 'Votre message...', 'cform.sending': 'Envoi en cours...', 'cform.coords': 'Nos coordonnées', 'cform.follow': 'Suivez-nous',
  'subject.adhesion': 'Adhésion', 'subject.partenariat': 'Partenariat', 'subject.renseignements': 'Renseignements', 'subject.don': 'Don', 'subject.projet': 'Projet', 'subject.presse': 'Presse', 'subject.autre': 'Autre',

  // Footer additionnel
  'footer.newsletterDesc': 'Restez informé de nos actions et événements.', 'footer.newsletterConsent': 'En vous inscrivant, vous acceptez de recevoir nos actualités.', 'footer.poweredBy': 'Propulsé par',

  // Section Contact (accueil)
  'contact.sendAnother': 'Envoyer un autre message',
  // Section Don (accueil)
  'donation.support': 'Soutenez notre mission',
  'donation.sectionDesc': 'Votre don, quel que soit son montant, nous permet de financer nos projets communautaires et d\'avoir un impact positif durable.',
  'donation.contactInfo': 'Pour toute question concernant les dons, contactez-nous à',
  'donation.another': 'Faire un autre don',
  'donation.messageOpt': 'Message (optionnel)',
  'donation.processing': 'Traitement en cours...',
  'donation.otherAmount': 'Autre montant en FCFA',
  'donation.messagePh': 'Un message d\'encouragement...',
  'donation.namePh': 'Votre nom complet',
  'donation.refLabel': 'Référence :',
  'donation.arg1': 'Soutenez les initiatives locales de développement',
  'donation.arg2': 'Contribuez à la formation des jeunes leaders',
  'donation.arg3': 'Participez à la protection de l\'environnement',
  'donation.arg4': 'Aidez les communautés vulnérables',
  'pay.bank': 'Virement bancaire',
  'newsletter.sending': 'Envoi...',
  'common.loadingTestimonials': 'Chargement des témoignages...',
  'common.loadingPartners': 'Chargement des partenaires...',
  // Section Actions communautaires
  'actions.subtitle': 'Sur le terrain',
  'actions.title': 'Nos actions communautaires',
  'actions.description': 'Des initiatives concrètes menées au cœur des communautés pour un impact réel et durable.',
  'actions.empty': 'Les actions communautaires seront bientôt publiées.',
  'actions.viewAll': 'Voir toute la galerie',
  'actions.loading': 'Chargement des actions...',
  // Page Actualités
  'blogpage.title': 'Notre Actualité', 'blogpage.subtitle': 'Suivez en temps réel toutes les activités, revues de presse et rapports de la JUDCD.',
  'blogpage.searchPh': 'Rechercher un article...', 'blogpage.all': 'Tout voir', 'blogpage.loading': 'Chargement des articles...',
  'blogpage.noMatch': 'Aucun article ne correspond à votre recherche.', 'blogpage.prev': 'Précédent', 'blogpage.next': 'Suivant', 'blogpage.readMore': 'Lire la suite', 'blogpage.readTime': 'min de lecture',

  // Etats
  'loading': 'Chargement...',
  'noResults': 'Aucun résultat trouvé.',
  'error.generic': 'Une erreur est survenue. Veuillez réessayer.',
  'error.notFound': 'Page introuvable.',
};

// Traductions anglaises
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
  'hero.stats.beneficiaries': 'Direct beneficiaries',
  'hero.stats.activities': 'Community activities',
  'hero.stats.partners': 'Local partners',
  'hero.scroll': 'Discover',

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
  'section.about': 'About',
  'section.donate': 'Donate',
  'section.join': 'Join',

  'about.title': 'Who are we?',
  'about.subtitle': 'About JUDCD',
  'about.founded': 'Since August 09, 2024',
  'about.mission.title': 'Our Mission',
  'about.vision.title': 'Our Vision',
  'about.values.title': 'Our Values',

  'team.title': 'Our Executive Board',
  'team.subtitle': 'Our Team',
  'team.description': 'A team of committed, passionate young people determined to make a difference in their communities.',
  'team.viewAll': 'See the full team',

  'gallery.title': 'Our actions in pictures',
  'gallery.subtitle': 'Photo Gallery',
  'gallery.description': 'Discover photos of our sustainable community development activities in Togo.',
  'gallery.all': 'All photos',
  'gallery.noPhotos': 'No photos available.',

  'blog.title': 'News & Events',
  'blog.subtitle': 'Latest news',
  'blog.description': 'Discover our latest news, events and initiatives that advance our mission.',
  'blog.readMore': 'Read more',
  'blog.viewAll': 'See all news',
  'blog.noArticles': 'No articles available yet.',

  'partners.title': 'They support us',
  'partners.subtitle': 'Our Partners',
  'partners.description': 'We collaborate with organizations that share our vision of sustainable community development.',
  'partners.become': 'Become a partner',
  'partners.becomeText': 'Do you share our vision and want to collaborate with us? Join our network of committed partners.',
  'partners.propose': 'Propose a partnership',
  'partners.none': 'No partners displayed at the moment.',

  'testimonials.title': 'What they say about us',
  'testimonials.subtitle': 'Testimonials',
  'testimonials.description': 'Discover testimonials from those who have benefited from our actions.',

  'contact.title': 'Let\'s Talk',
  'contact.subtitle': 'Our Contact Details',
  'contact.description': 'Contact us for any questions, suggestions or collaborations.',
  'contact.name': 'Full Name',
  'contact.email': 'Email Address',
  'contact.phone': 'Phone',
  'contact.subject': 'Subject',
  'contact.message': 'Your Message',
  'contact.submit': 'Send Message',
  'contact.success': 'Message sent successfully!',
  'contact.success.text': 'We will respond as soon as possible.',
  'contact.error': 'Error sending. Please try again.',
  'contact.info.address': 'Address',
  'contact.info.phone': 'Phone',
  'contact.info.email': 'Email',

  'donation.title': 'Support JUDCD',
  'donation.subtitle': 'Make a donation',
  'donation.description': 'Your donation helps us carry out our community projects. Every contribution counts.',
  'donation.amount': 'Amount (FCFA)',
  'donation.name': 'Your name',
  'donation.email': 'Your email',
  'donation.message': 'Message (optional)',
  'donation.method': 'Payment Method',
  'donation.transaction': 'Transaction Number',
  'donation.submit': 'Confirm my donation',
  'donation.success': 'Donation registered successfully!',
  'donation.success.text': 'Thank you for your generosity. Your donation will be used for our community projects.',
  'donation.error': 'Registration error. Please try again.',

  'membership.title': 'Join JUDCD',
  'membership.subtitle': 'Become a member',
  'membership.description': 'Become a member and actively participate in our actions for sustainable development.',
  'membership.categories': 'Member Categories',
  'membership.fee': 'Annual fee: 5,000 FCFA',
  'membership.benefits': 'Member benefits',
  'membership.join': 'Join now',

  'newsletter.title': 'Stay informed',
  'newsletter.description': 'Subscribe to our newsletter to receive our news and updates.',
  'newsletter.placeholder': 'Your email address',
  'newsletter.subscribe': 'Subscribe',
  'newsletter.success': 'Subscription successful! Welcome to our community.',
  'newsletter.error': 'Subscription error. Please try again.',
  'newsletter.exists': 'This email is already subscribed to the newsletter.',

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
  'button.seeMore': 'Learn more',

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

  // Stats
  'stats.description': 'The impact of our actions in numbers',

  // About texts
  'about.content1': 'JUDCD (United Youth for Sustainable Community Development) is a committed organization working to improve community living conditions through social, educational, environmental and economic initiatives.',
  'about.content2': 'Convinced that youth represents an essential force for change, we mobilize young people around concrete actions to promote sustainable development, solidarity and social innovation.',
  'about.content3': 'Our ambition is to build <strong>autonomous, inclusive and resilient</strong> communities where everyone can actively contribute to sustainable development.',
  'about.obj1': 'Promote youth leadership',
  'about.obj2': 'Support local initiatives',
  'about.obj3': 'Raise awareness of environmental issues',
  'about.obj4': 'Strengthen solidarity and social cohesion',
  'about.learnMore': 'Learn more',
  'about.contactUs': 'Contact us',

  // Mission / Vision
  'home.mission.statement': 'To promote sustainable community development by mobilizing youth around social, educational, environmental and economic initiatives for the benefit of local communities.',
  'home.vision.statement': 'To build autonomous, united and resilient communities where youth plays a central role in sustainable development and social innovation.',
  'values.heading': 'What drives us',
  'service.publicLabel': 'Audience:',

  'value.0.name': 'Solidarity', 'value.0.desc': 'Acting together for the common good of our communities.',
  'value.1.name': 'Civic Engagement', 'value.1.desc': 'Actively participating in building a better society.',
  'value.2.name': 'Transparency', 'value.2.desc': 'Managing with honesty, clarity and responsibility.',
  'value.3.name': 'Social Innovation', 'value.3.desc': 'Creating new solutions tailored to local needs.',
  'value.4.name': 'Sustainable Development', 'value.4.desc': 'Acting today while thinking of future generations.',

  'service.1.title': 'Youth Training', 'service.1.desc': 'Training programs in leadership, entrepreneurship and digital skills to prepare youth for tomorrow\'s challenges.', 'service.1.public': 'Youth, students, young graduates',
  'service.2.title': 'Community Awareness', 'service.2.desc': 'Awareness campaigns on citizenship, environment and health to inform and mobilize populations.', 'service.2.public': 'Local communities, youth, women',
  'service.3.title': 'Local Development Projects', 'service.3.desc': 'Concrete initiatives to improve community living conditions through participatory projects.', 'service.3.public': 'Local communities, vulnerable populations',
  'service.4.title': 'Entrepreneurial Support', 'service.4.desc': 'Mentoring and support for young entrepreneurs\' projects to stimulate innovation and job creation.', 'service.4.public': 'Young entrepreneurs, project leaders',
  'service.5.title': 'Social & Humanitarian Actions', 'service.5.desc': 'Solidarity actions to support vulnerable populations and strengthen social cohesion in communities.', 'service.5.public': 'Vulnerable populations, local communities',
  'service.6.title': 'Promoting Sustainable Development', 'service.6.desc': 'Ecological and environmental initiatives to raise awareness and act to protect our planet.', 'service.6.public': 'Youth, schools, local communities',

  'figure.0.label': 'Direct beneficiaries', 'figure.1.label': 'Community activities', 'figure.2.label': 'Local partners', 'figure.3.label': 'Engaged youth',

  'aboutpage.banner': 'About', 'aboutpage.mission.h': 'Our Mission', 'aboutpage.vision.h': 'Our Vision', 'aboutpage.values.h': 'Our Values', 'aboutpage.figures.h': 'JUDCD in numbers',
  'aboutpage.cta.h': 'Join us', 'aboutpage.cta.text': 'Do you share our values and want to contribute to the sustainable development of our communities?', 'aboutpage.cta.member': 'Become a member', 'aboutpage.cta.contact': 'Contact us',

  'teampage.banner.title': 'Our Executive Board', 'teampage.banner.desc': 'A team of passionate young people determined to make a difference in their communities through concrete and lasting actions.',
  'teampage.loading': 'Loading members...', 'teampage.join.h': 'Join the adventure', 'teampage.join.text': 'Do you want to get involved and contribute to your community\'s development? Join JUDCD and be part of the change.', 'teampage.join.btn': 'Join us',

  'gallerypage.desc': 'Discover the highlights of our actions in the field', 'gallerypage.empty.h': 'No photos yet', 'gallerypage.empty.text': 'Photos of our activities will be available soon.', 'gallerypage.page': 'Page', 'gallerypage.of': 'of',

  'cform.name': 'Full Name', 'cform.namePh': 'Your full name', 'cform.email': 'Email', 'cform.phone': 'Phone', 'cform.subject': 'Subject', 'cform.message': 'Message', 'cform.messagePh': 'Your message...', 'cform.sending': 'Sending...', 'cform.coords': 'Our contact details', 'cform.follow': 'Follow us',
  'subject.adhesion': 'Membership', 'subject.partenariat': 'Partnership', 'subject.renseignements': 'Information', 'subject.don': 'Donation', 'subject.projet': 'Project', 'subject.presse': 'Press', 'subject.autre': 'Other',

  'footer.newsletterDesc': 'Stay informed about our actions and events.', 'footer.newsletterConsent': 'By subscribing, you agree to receive our news.', 'footer.poweredBy': 'Powered by',

  'contact.sendAnother': 'Send another message',
  'donation.support': 'Support our mission',
  'donation.sectionDesc': 'Your donation, whatever the amount, helps us fund our community projects and have a lasting positive impact.',
  'donation.contactInfo': 'For any questions about donations, contact us at',
  'donation.another': 'Make another donation',
  'donation.messageOpt': 'Message (optional)',
  'donation.processing': 'Processing...',
  'donation.otherAmount': 'Other amount in FCFA',
  'donation.messagePh': 'A message of encouragement...',
  'donation.namePh': 'Your full name',
  'donation.refLabel': 'Reference:',
  'donation.arg1': 'Support local development initiatives',
  'donation.arg2': 'Contribute to training young leaders',
  'donation.arg3': 'Help protect the environment',
  'donation.arg4': 'Help vulnerable communities',
  'pay.bank': 'Bank transfer',
  'newsletter.sending': 'Sending...',
  'common.loadingTestimonials': 'Loading testimonials...',
  'common.loadingPartners': 'Loading partners...',
  'actions.subtitle': 'In the field',
  'actions.title': 'Our community actions',
  'actions.description': 'Concrete initiatives carried out at the heart of communities for real and lasting impact.',
  'actions.empty': 'Community actions will be published soon.',
  'actions.viewAll': 'View the full gallery',
  'actions.loading': 'Loading actions...',
  'blogpage.title': 'Our News', 'blogpage.subtitle': 'Follow in real time all activities, press reviews and reports from JUDCD.',
  'blogpage.searchPh': 'Search an article...', 'blogpage.all': 'View all', 'blogpage.loading': 'Loading articles...',
  'blogpage.noMatch': 'No article matches your search.', 'blogpage.prev': 'Previous', 'blogpage.next': 'Next', 'blogpage.readMore': 'Read more', 'blogpage.readTime': 'min read',

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
    // Langue par défaut : français
    return 'fr';
  });

  // Persiste la langue dans le localStorage
  useEffect(() => {
    localStorage.setItem('judcd_language', language);
    document.documentElement.setAttribute('lang', language);
  }, [language]);

  // Fonction de traduction
  const t = useCallback((key, fallback = '') => {
    const langTranslations = translations[language] || translations.fr;
    return langTranslations[key] || fallback || key;
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