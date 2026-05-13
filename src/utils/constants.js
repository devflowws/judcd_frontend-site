// ==========================================
// CONSTANTES GLOBALES JUDCD
// ==========================================

// Couleurs officielles
export const COLORS = {
  green: '#008751',
  greenLight: '#00A860',
  greenDark: '#006B41',
  yellow: '#FFD100',
  yellowLight: '#FFE44D',
  red: '#D21034',
  blue: '#002060',
  blueLight: '#003A8C',
  white: '#FFFFFF',
  black: '#000000',
  text: '#333333',
  textLight: '#666666',
  gray: '#F5F5F5',
};

// Chemins des assets
export const ASSETS = {
  logo: '/assets/images/logo2.png',
  logoWhite: '/assets/images/logo-white.png',
  favicon: '/assets/images/favicon.png',
  ogImage: '/assets/images/og-image.jpg',
};

// Informations de l'association
export const ASSOCIATION = {
  name: 'JUDCD',
  fullName: 'Jeunes Unis pour le Développement Communautaire Durable',
  slogan: 'Ensemble pour un développement durable et responsable',
  shortDescription: 'Organisation de jeunes engagés pour le développement communautaire durable.',
  longDescription: 'JUDCD est une association qui mobilise les jeunes afin de promouvoir des initiatives de développement durable, d\'éducation citoyenne, d\'entrepreneuriat et d\'actions sociales pour améliorer les conditions de vie des communautés.',
  email: 'associationjudcd@gmail.com',
  phone: '+228 71661230',
  phoneDisplay: '+228 71 66 12 30',
  address: 'Amadahome, face à la station Cap',
  city: 'Lome',
  country: 'Togo',
  creationDate: '09/08/2024',
  registrationNumber: '0566-09-08-2024',
  zone: 'TOGO, Grand Lome, commune de Golfe 5',
};

// Reseaux sociaux
export const SOCIAL_LINKS = {
  tiktok: 'https://www.tiktok.com/@association.judcd?_r=1&_t=ZS-95zwQTGqj0U',
  facebook: '#',
  instagram: '#',
  twitter: '#',
  youtube: '#',
  linkedin: '#',
};

// Mission, Vision, Valeurs
export const MISSION = {
  mission: 'Promouvoir le développement communautaire durable en mobilisant la jeunesse autour d\'initiatives sociales, éducatives, environnementales et économiques au bénéfice des communautés locales.',
  vision: 'Construire des communautés autonomes, solidaires et résilientes où la jeunesse joue un rôle central dans le développement durable et l\'innovation sociale.',
  values: [
    { name: 'Solidarité', description: 'Agir ensemble pour le bien commun de nos communautés.' },
    { name: 'Engagement Citoyen', description: 'Participer activement à la construction d\'une société meilleure.' },
    { name: 'Transparence', description: 'Gérer avec honnêteté, clarté et responsabilité.' },
    { name: 'Innovation Sociale', description: 'Créer des solutions nouvelles adaptées aux besoins locaux.' },
    { name: 'Développement Durable', description: 'Agir aujourd\'hui en pensant aux générations futures.' },
  ],
};

// Chiffres cles
export const KEY_FIGURES = [
  { value: 10, suffix: '+', label: 'Bénéficiaires directs' },
  { value: 2, suffix: '', label: 'Activités communautaires' },
  { value: 5, suffix: '+', label: 'Partenaires locaux' },
  { value: 1, suffix: '', label: 'Jeunesse engagée' },
];

// Services / Activites
export const SERVICES = [
  {
    id: 1,
    title: 'Formation des Jeunes',
    description: 'Programmes de formation en leadership, entrepreneuriat et compétences numériques pour préparer la jeunesse à relever les défis de demain.',
    icon: 'academic',
    publicCible: 'Jeunes, étudiants, jeunes diplômés',
  },
  {
    id: 2,
    title: 'Sensibilisation Communautaire',
    description: 'Campagnes de sensibilisation sur la citoyenneté, l\'environnement et la santé pour informer et mobiliser les populations.',
    icon: 'awareness',
    publicCible: 'Communautés locales, jeunes, femmes',
  },
  {
    id: 3,
    title: 'Projets de Développement Local',
    description: 'Initiatives concrètes visant à améliorer les conditions de vie des communautés à travers des projets participatifs.',
    icon: 'development',
    publicCible: 'Communautés locales, populations vulnérables',
  },
  {
    id: 4,
    title: 'Accompagnement Entrepreneurial',
    description: 'Mentorat et soutien aux projets des jeunes entrepreneurs pour stimuler l\'innovation et la création d\'emplois.',
    icon: 'entrepreneurship',
    publicCible: 'Jeunes entrepreneurs, porteurs de projets',
  },
  {
    id: 5,
    title: 'Actions Sociales et Humanitaires',
    description: 'Actions solidaires pour soutenir les populations vulnérables et renforcer la cohésion sociale dans les communautés.',
    icon: 'social',
    publicCible: 'Populations vulnérables, communautés locales',
  },
  {
    id: 6,
    title: 'Promotion du Développement Durable',
    description: 'Initiatives écologiques et environnementales pour sensibiliser et agir en faveur de la protection de notre planète.',
    icon: 'ecology',
    publicCible: 'Jeunes, écoles, communautés locales',
  },
];

// Bureau executif
export const EXECUTIVE_TEAM = [
  {
    id: 1,
    name: 'Yannick Komlan Kpoholo',
    role: 'Président',
    email: 'yannicksekkpoholo@gmail.com',
    phone: '+228 97776216',
    photo: '/assets/images/team/yannik.png',
    bio: 'Yannick Sek Kpoholo, professionnel de la logistique et entrepreneur digital à Lomé, allie rigueur et ambition. Il développe des projets durables et inspire la jeunesse à construire une vision claire et responsable',
    quote: 'Servir la jeunesse, ce n\'est pas seulement préparer demain, c\'est donner un sens à aujourd\'hui.',
  },
  {
    id: 2,
    name: 'NATO Kokou Valere',
    role: 'Vice-Président',
    email: 'natovalere@gmail.com',
    phone: '+228 92069284',
    photo: '/assets/images/team/valere.jpeg',
    bio: 'Géologue de formation passionné par le numérique, il se spécialise dans le développement web et mobile. Il met son expertise technique au service de solutions digitales innovantes',
    quote: '',
  },
  {
    id: 3,
    name: 'Eliezer Moubarak RADJI',
    role: 'Secrétaire Général',
    email: 'eliezermoubarakr@gmail.com',
    phone: '+228 70920830',
    photo: '/assets/images/team/eliezer.jpeg',
    bio: 'Biologiste et physiologiste végétal, il combine expertise technique et expérience en rédaction et gestion de projets, mettant ses compétences au service de l\'innovation',
    quote: '',
  },
  {
    id: 4,
    name: 'Mohamed AKOURTANDO',
    role: 'Trésorier',
    email: 'Mohamedakourtando229@gmail.com',
    phone: '+228 90860685',
    photo: '/assets/images/team/mohamed.jpeg',
    bio: 'Jeune Togolais dynamique, formé en informatique. Il met sa polyvalence technique au service de projets innovants et de la croissance de l\'association',
    quote: '',
  },
  {
    id: 5,
    name: 'AGBESSI Komi Elom Francois',
    role: 'Secrétaire Adjoint / Responsable des projets',
    email: 'elomagbessi012@gmail.com',
    phone: '+228 90593801',
    photo: '/assets/images/team/elom.jpeg',
    bio: 'Marketeur et stratège passionné, il complète son expertise par des études en droit pour allier vision commerciale et rigueur juridique. Il est ainsi capable de gérer des projets avec efficacité et de développer des stratégies innovantes.',
    quote: '',
  },
  {
    id: 6,
    name: 'METSOKO Wateba Othniel',
    role: 'Conseiller n°1',
    email: 'ametsoko@gmail.com',
    phone: '90686585 / 97551634',
    photo: '/assets/images/team/othniel.jpeg',
    bio: 'Biographie en attente.',
    quote: '',
  },
];

// Partenaires
export const PARTNERS = [
  {
    id: 1,
    name: 'Dynace Global',
    category: 'Santé et Bien-être',
    logo: '/assets/images/partners/dynaceglobal.png',
    link: 'https://www.dynaceglobal.com'
  },
  {
    id: 2,
    name: 'CEFOPEAV',
    category: 'Formation Professionnelle',
    logo: '/assets/images/partners/cefopeav.png',
    link: '#'
  },
  {
    id: 3,
    name: 'HTC',
    category: 'Technologie',
    logo: '/assets/images/partners/htc.png',
    link: '#'
  },
  {
    id: 4,
    name: 'Oprinx',
    category: 'Services Numériques',
    logo: '/assets/images/partners/oprinx.png',
    link: '#'
  },
  {
    id: 5,
    name: 'The Queen',
    category: 'Mode et Lifestyle',
    logo: '/assets/images/partners/thequeen.png',
    link: '#'
  },
  {
    id: 6,
    name: 'UL Chess Club',
    category: 'Jeux et Échecs',
    logo: '/assets/images/partners/ulchessclub.png',
    link: '#'
  },
  {
    id: 7,
    name: 'Miabé Innovation',
    category: 'Startup Technologique',
    logo: '/assets/images/partners/miabeinnovation.png',
    link: 'https://www.miabeinnovation.com'
  }
];

// Cibles
export const TARGET_AUDIENCES = [
  'Jeunes',
  'Femmes',
  'Communautés rurales et urbaines',
  'Entrepreneurs locaux',
  'Organisations communautaires',
];

// Types de membres
export const MEMBER_CATEGORIES = [
  { name: 'Membre Fondateur', description: 'Les créateurs historiques de l\'association' },
  { name: 'Membre Actif', description: 'Participant régulièrement aux activités' },
  { name: 'Membre Bienfaiteur', description: 'Soutenant financièrement l\'association' },
  { name: 'Membre d\'Honneur', description: 'Reconnaissance honorifique' },
  { name: 'Membre Partenaire', description: 'Organisations collaboratrices' },
];

// Montant adhesion
export const MEMBERSHIP_FEE = 5000;

// Methodes de paiement
export const PAYMENT_METHODS = [
  { name: 'Mobile Money', icon: 'mobile', description: 'Flooz / T-Money' },
  { name: 'Virement bancaire', icon: 'bank', description: 'RIB disponible sur demande' },
];

// Endpoints API
export const API = {
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1',
  endpoints: {
    // Authentification
    auth: {
      login: '/login/',
      refresh: '/refresh/',
    },
    // Endpoints publics (sans authentification)
    public: {
      partenaires: '/public/partenaires/',
      team: '/public/team/',
      actions: '/public/actions/',
      temoignages: '/public/temoignages/',
      typesActions: '/public/types-actions/',
      typesPartenaires: '/public/types-partenaires/',
      contact: '/public/contact/',
      newsletter: '/public/newsletter/',
      donation: '/public/donation/',
      temoignage: '/public/temoignage/',
      stats: '/public/stats/',
      gallery: '/public/galerie-action/',
    },
    // Endpoints admin (avec authentification)
    admin: {
      contact: '/contact/',
      newsletter: '/newsletter/',
      partenaires: '/partenaire/',
      typesPartenaire: '/type-partenaire/',
      donations: '/don/',
      team: '/membre-equipe/',
      actions: '/action/',
      typesAction: '/type-action/',
      galerie: '/galerie-action/',
      galerieActions: '/galerie-action/',
      temoignages: '/temoignage/',
      typesActualite: '/type-actualite/',
      adhesions: {
        list: '/admin/adhesions/',
        detail: '/admin/adhesions/',
        action: '/admin/adhesions/',
        statistiques: '/admin/adhesions/statistiques/',
      },
    },
  },
};

// Categories galerie
export const GALLERY_CATEGORIES = [
  'Formation des jeunes',
  'Sensibilisation communautaire',
  'Projets de développement local',
  'Accompagnement entrepreneurial',
  'Actions sociales',
  'Développement durable',
];

// Textes des pages
export const PAGE_CONTENT = {
  hero: {
    title: 'Ensemble pour un développement durable de nos communautés',
    subtitle: 'Jeunes Unis pour le Développement Communautaire Durable',
    cta: {
      primary: 'Découvrir nos actions',
      secondary: 'Faire un don',
    },
  },
  about: {
    title: 'Qui sommes-nous ?',
    content: `L'association Jeunes Unis pour le Développement Communautaire Durable (JUDCD) est une organisation engagée qui œuvre pour l'amélioration des conditions de vie des communautés à travers des initiatives sociales, éducatives, environnementales et économiques. Convaincus que la jeunesse représente une force essentielle pour le changement, nous mobilisons les jeunes autour d'actions concrètes visant à promouvoir le développement durable, la solidarité et l'innovation sociale.`,
  },
  footer: {
    text: 'Une jeunesse engagée pour promouvoir le développement durable, la solidarité et l\'innovation sociale au service des communautés.',
  },
};

// Liens de reference design
export const DESIGN_REFERENCES = {
  unicef: 'https://www.unicef.org/',
  wwf: 'https://www.worldwildlife.org/',
  ashoka: 'https://www.ashoka.org/',
};

// Style
export const DESIGN_STYLE = 'Moderne, dynamique et professionnel';

// Langues
export const LANGUAGES = [
  { code: 'fr', name: 'Français', flag: 'fr' },
  { code: 'en', name: 'English', flag: 'gb' },
];