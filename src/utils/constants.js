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
  fullName: 'Jeunes Unis pour le Developpement Communautaire Durable',
  slogan: 'Ensemble pour un developpement durable et responsable',
  shortDescription: 'Organisation de jeunes engages pour le developpement communautaire durable.',
  longDescription: 'JUDCD est une association qui mobilise les jeunes afin de promouvoir des initiatives de developpement durable, d\'education citoyenne, d\'entrepreneuriat et d\'actions sociales pour ameliorer les conditions de vie des communautes.',
  email: 'associationjudcd@gmail.com',
  phone: '+228 71661230',
  phoneDisplay: '+228 71 66 12 30',
  address: 'Amadahome, face a la station Cap',
  city: 'Lome',
  country: 'Togo',
  creationDate: '09/08/2024',
  registrationNumber: '0566-09-08-2024',
  zone: 'TOGO, Grand Lome, commune de Golfe 5',
};

// Reseaux sociaux
export const SOCIAL_LINKS = {
  tiktok: 'https://www.tiktok.com/@associationjudcd',
  facebook: null,
  instagram: null,
  twitter: null,
  youtube: null,
  linkedin: null,
};

// Mission, Vision, Valeurs
export const MISSION = {
  mission: 'Promouvoir le developpement communautaire durable en mobilisant la jeunesse autour d\'initiatives sociales, educatives, environnementales et economiques au benefice des communautes locales.',
  vision: 'Construire des communautes autonomes, solidaires et resilientes ou la jeunesse joue un role central dans le developpement durable et l\'innovation sociale.',
  values: [
    { name: 'Solidarite', description: 'Agir ensemble pour le bien commun de nos communautes.' },
    { name: 'Engagement Citoyen', description: 'Participer activement a la construction d\'une societe meilleure.' },
    { name: 'Transparence', description: 'Gerer avec honnetete, clarte et responsabilite.' },
    { name: 'Innovation Sociale', description: 'Creer des solutions nouvelles adaptees aux besoins locaux.' },
    { name: 'Developpement Durable', description: 'Agir aujourd\'hui en pensant aux generations futures.' },
  ],
};

// Chiffres cles
export const KEY_FIGURES = [
  { value: 10, suffix: '+', label: 'Beneficiaires directs' },
  { value: 2, suffix: '', label: 'Activites communautaires' },
  { value: 5, suffix: '+', label: 'Partenaires locaux' },
  { value: 1, suffix: '', label: 'Jeunesse engagee' },
];

// Services / Activites
export const SERVICES = [
  {
    id: 1,
    title: 'Formation des Jeunes',
    description: 'Programmes de formation en leadership, entrepreneuriat et competences numeriques pour preparer la jeunesse a relever les defis de demain.',
    icon: 'academic',
    publicCible: 'Jeunes, etudiants, jeunes diplomes',
  },
  {
    id: 2,
    title: 'Sensibilisation Communautaire',
    description: 'Campagnes de sensibilisation sur la citoyennete, l\'environnement et la sante pour informer et mobiliser les populations.',
    icon: 'awareness',
    publicCible: 'Communautes locales, jeunes, femmes',
  },
  {
    id: 3,
    title: 'Projets de Developpement Local',
    description: 'Initiatives concretes visant a ameliorer les conditions de vie des communautes a travers des projets participatifs.',
    icon: 'development',
    publicCible: 'Communautes locales, populations vulnerables',
  },
  {
    id: 4,
    title: 'Accompagnement Entrepreneurial',
    description: 'Mentorat et soutien aux projets des jeunes entrepreneurs pour stimuler l\'innovation et la creation d\'emplois.',
    icon: 'entrepreneurship',
    publicCible: 'Jeunes entrepreneurs, porteurs de projets',
  },
  {
    id: 5,
    title: 'Actions Sociales et Humanitaires',
    description: 'Actions solidaires pour soutenir les populations vulnerables et renforcer la cohesion sociale dans les communautes.',
    icon: 'social',
    publicCible: 'Populations vulnerables, communautes locales',
  },
  {
    id: 6,
    title: 'Promotion du Developpement Durable',
    description: 'Initiatives ecologiques et environnementales pour sensibiliser et agir en faveur de la protection de notre planete.',
    icon: 'ecology',
    publicCible: 'Jeunes, ecoles, communautes locales',
  },
];

// Bureau executif
export const EXECUTIVE_TEAM = [
  {
    id: 1,
    name: 'Yannick Komlan Kpoholo',
    role: 'President',
    email: 'yannicksekkpoholo@gmail.com',
    phone: '+228 97776216',
    bio: 'Yannick Sek Kpoholo, professionnel de la logistique et entrepreneur digital a Lome, allie rigueur et ambition. Il developpe des projets durables et inspire la jeunesse a construire une vision claire et responsable.',
    quote: 'Servir la jeunesse, ce n\'est pas seulement preparer demain, c\'est donner un sens a aujourd\'hui.',
  },
  {
    id: 2,
    name: 'NATO Kokou Valere',
    role: 'Vice-President',
    email: 'natovalere@gmail.com',
    phone: '+228 92069284',
    bio: 'Geologue de formation passionne par le numerique, il se specialise dans le developpement web et mobile. Il met son expertise technique au service de solutions digitales innovantes.',
    quote: '',
  },
  {
    id: 3,
    name: 'Eliezer Moubarak RADJI',
    role: 'Secretaire General',
    email: 'eliezermoubarakr@gmail.com',
    phone: '+228 70920830',
    bio: 'Biologiste et physiologiste vegetal, il combine expertise technique et experience en redaction et gestion de projets, mettant ses competences au service de l\'innovation.',
    quote: '',
  },
  {
    id: 4,
    name: 'Mohamed AKOURTANDO',
    role: 'Tresorier',
    email: 'Mohamedakourtando229@gmail.com',
    phone: '+228 90860685',
    bio: 'Jeune Togolais dynamique, forme en informatique. Il met sa polyvalence technique au service de projets innovants et de la croissance de l\'association.',
    quote: '',
  },
  {
    id: 5,
    name: 'AGBESSI Komi Elom Francois',
    role: 'Secretaire Adjoint / Responsable des projets',
    email: 'elomagbessi012@gmail.com',
    phone: '+228 90593801',
    bio: 'Marketeur et stratege passionne, il complete son expertise par des etudes en droit pour allier vision commerciale et rigueur juridique.',
    quote: '',
  },
];

// Partenaires
export const PARTNERS = [
  'Organisations de la societe civile',
  'Institutions locales',
  'Associations de jeunesse',
  'Structures educatives',
  'Partenaires techniques et financiers',
];

// Cibles
export const TARGET_AUDIENCES = [
  'Jeunes',
  'Femmes',
  'Communautes rurales et urbaines',
  'Entrepreneurs locaux',
  'Organisations communautaires',
];

// Types de membres
export const MEMBER_CATEGORIES = [
  { name: 'Membre Fondateur', description: 'Les createurs historiques de l\'association' },
  { name: 'Membre Actif', description: 'Participant regulierement aux activites' },
  { name: 'Membre Bienfaiteur', description: 'Soutenant financierement l\'association' },
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
    gallery: '/gallery/photos/',
    blog: '/blog/posts/',
    contact: '/contact/messages/',
    members: '/members/',
    donations: '/donations/',
    pages: '/pages/',
    settings: '/site-settings/',
    auth: '/auth/',
  },
};

// Categories galerie
export const GALLERY_CATEGORIES = [
  'Formation des jeunes',
  'Sensibilisation communautaire',
  'Projets de developpement local',
  'Accompagnement entrepreneurial',
  'Actions sociales',
  'Developpement durable',
];

// Textes des pages
export const PAGE_CONTENT = {
  hero: {
    title: 'Ensemble pour un developpement durable de nos communautes',
    subtitle: 'Jeunes Unis pour le Developpement Communautaire Durable',
    cta: {
      primary: 'Decouvrir nos actions',
      secondary: 'Faire un don',
    },
  },
  about: {
    title: 'Qui sommes-nous ?',
    content: `L'association Jeunes Unis pour le Developpement Communautaire Durable (JUDCD) est une organisation engagee qui oeuvre pour l'amelioration des conditions de vie des communautes a travers des initiatives sociales, educatives, environnementales et economiques. Convaincus que la jeunesse represente une force essentielle pour le changement, nous mobilisons les jeunes autour d'actions concretes visant a promouvoir le developpement durable, la solidarite et l'innovation sociale.`,
  },
  footer: {
    text: 'Une jeunesse engagee pour promouvoir le developpement durable, la solidarite et l\'innovation sociale au service des communautes.',
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
  { code: 'fr', name: 'Francais', flag: 'fr' },
  { code: 'en', name: 'English', flag: 'gb' },
];