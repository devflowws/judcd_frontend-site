// ==========================================
// FONCTIONS UTILITAIRES JUDCD
// ==========================================

/**
 * Formate une date ISO en format francais long
 * Exemple: "jeudi 30 avril 2026"
 */
export function formatDateLong(dateString) {
  if (!dateString) return '';
  const date = new Date(dateString);
  const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
  return date.toLocaleDateString('fr-FR', options);
}

/**
 * Formate une date ISO en format francais court
 * Exemple: "30/04/2026"
 */
export function formatDateShort(dateString) {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
}

/**
 * Formate un montant en FCFA
 * Exemple: "50 000 FCFA"
 */
export function formatCurrency(amount) {
  if (amount === null || amount === undefined) return '';
  return new Intl.NumberFormat('fr-FR', {
    style: 'decimal',
    maximumFractionDigits: 0,
  }).format(amount) + ' FCFA';
}

/**
 * Tronque un texte sans couper les mots
 */
export function truncateText(text, maxLength = 150) {
  if (!text || text.length <= maxLength) return text || '';
  const truncated = text.substring(0, maxLength);
  const lastSpace = truncated.lastIndexOf(' ');
  return truncated.substring(0, lastSpace > 0 ? lastSpace : maxLength) + '...';
}

/**
 * Genere un slug a partir d'une chaine
 */
export function slugify(text) {
  return text
    .toString()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w-]+/g, '')
    .replace(/--+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '');
}

/**
 * Debounce une fonction
 */
export function debounce(func, wait = 300) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

/**
 * Throttle une fonction
 */
export function throttle(func, limit = 300) {
  let inThrottle;
  return function executedFunction(...args) {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => {
        inThrottle = false;
      }, limit);
    }
  };
}

/**
 * Genere les meta tags SEO pour react-helmet
 */
export function generateMetaTags(page) {
  const defaults = {
    title: 'JUDCD - Jeunes Unis pour le Developpement Communautaire Durable',
    description: 'Organisation de jeunes engages pour le developpement communautaire durable au Togo.',
    image: '/assets/images/og-image.jpg',
    url: 'https://judcd.tg',
  };

  return {
    title: page.title ? `${page.title} - JUDCD` : defaults.title,
    description: page.description || defaults.description,
    image: page.image || defaults.image,
    url: page.url ? `${defaults.url}${page.url}` : defaults.url,
  };
}

/**
 * Verifie si un element est dans le viewport
 */
export function isInViewport(element, offset = 0) {
  if (!element) return false;
  const rect = element.getBoundingClientRect();
  return (
    rect.top + offset <= (window.innerHeight || document.documentElement.clientHeight) &&
    rect.bottom - offset >= 0
  );
}

/**
 * Scroll fluide vers un element
 */
export function scrollToElement(elementId, offset = 80) {
  const element = document.getElementById(elementId);
  if (element) {
    const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
    const offsetPosition = elementPosition - offset;
    window.scrollTo({
      top: offsetPosition,
      behavior: 'smooth',
    });
  }
}

/**
 * Scroll vers le haut de la page
 */
export function scrollToTop() {
  window.scrollTo({
    top: 0,
    behavior: 'smooth',
  });
}

/**
 * Obtient l'URL complete d'une image media
 */
export function getMediaUrl(path) {
  if (!path) return '/assets/images/placeholder.jpg';
  if (path.startsWith('http')) return path;
  const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:8000';
  return `${baseURL}${path}`;
}

/**
 * Genere un ID unique
 */
export function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

/**
 * Copie un texte dans le presse-papier
 */
export async function copyToClipboard(text) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (err) {
    return false;
  }
}

/**
 * Parse les parametres d'URL
 */
export function getQueryParams(url) {
  const params = new URLSearchParams(new URL(url).search);
  const result = {};
  for (const [key, value] of params.entries()) {
    result[key] = value;
  }
  return result;
}

/**
 * Verifie si l'appareil est mobile
 */
export function isMobile() {
  return window.innerWidth < 768;
}

/**
 * Verifie si l'appareil est une tablette
 */
export function isTablet() {
  return window.innerWidth >= 768 && window.innerWidth < 1024;
}

/**
 * Obtient la classe de couleur selon le statut
 */
export function getStatusColor(status) {
  const colors = {
    published: '#008751',
    draft: '#FFD100',
    archived: '#999999',
    pending: '#FFD100',
    confirmed: '#008751',
    rejected: '#D21034',
    unread: '#D21034',
    read: '#008751',
  };
  return colors[status] || '#666666';
}

/**
 * Obtient le libelle du statut en francais
 */
export function getStatusLabel(status) {
  const labels = {
    published: 'Publie',
    draft: 'Brouillon',
    archived: 'Archive',
    pending: 'En attente',
    confirmed: 'Confirme',
    rejected: 'Rejete',
    unread: 'Non lu',
    read: 'Lu',
  };
  return labels[status] || status;
}