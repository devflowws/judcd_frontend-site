// ==========================================
// FORMATAGE DE DONNEES JUDCD
// ==========================================

/**
 * Formate un numero de telephone pour affichage
 * Exemple: +228 71 66 12 30
 */
export function formatPhoneNumber(phone) {
  if (!phone) return '';
  const cleaned = phone.replace(/[^\d+]/g, '');
  if (cleaned.startsWith('+228')) {
    const num = cleaned.substring(4);
    return `+228 ${num.slice(0, 2)} ${num.slice(2, 4)} ${num.slice(4, 6)} ${num.slice(6, 8)}`;
  }
  return phone;
}

/**
 * Formate un numero de telephone pour lien tel:
 * Exemple: +22871661230
 */
export function formatPhoneLink(phone) {
  if (!phone) return '';
  return phone.replace(/\s+/g, '').replace(/[()-]/g, '');
}

/**
 * Formate un prix en FCFA
 * Exemple: 50000 -> "50 000 FCFA"
 */
export function formatPrice(amount) {
  if (amount === null || amount === undefined || isNaN(amount)) return '0 FCFA';
  return amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ') + ' FCFA';
}

/**
 * Formate un pourcentage
 * Exemple: 75 -> "75%"
 */
export function formatPercentage(value) {
  if (value === null || value === undefined) return '0%';
  return Math.round(value) + '%';
}

/**
 * Formate un nom complet (premiere lettre en majuscule)
 */
export function formatName(name) {
  if (!name) return '';
  return name
    .toLowerCase()
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

/**
 * Formate le temps ecoule depuis une date
 * Exemple: "Il y a 2 jours", "Il y a 3 heures"
 */
export function formatTimeAgo(dateString) {
  if (!dateString) return '';
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now - date;
  const diffSeconds = Math.floor(diffMs / 1000);
  const diffMinutes = Math.floor(diffSeconds / 60);
  const diffHours = Math.floor(diffMinutes / 60);
  const diffDays = Math.floor(diffHours / 24);
  const diffMonths = Math.floor(diffDays / 30);
  const diffYears = Math.floor(diffDays / 365);

  if (diffSeconds < 60) return 'A l\'instant';
  if (diffMinutes < 60) return `Il y a ${diffMinutes} minute${diffMinutes > 1 ? 's' : ''}`;
  if (diffHours < 24) return `Il y a ${diffHours} heure${diffHours > 1 ? 's' : ''}`;
  if (diffDays < 30) return `Il y a ${diffDays} jour${diffDays > 1 ? 's' : ''}`;
  if (diffMonths < 12) return `Il y a ${diffMonths} mois`;
  return `Il y a ${diffYears} an${diffYears > 1 ? 's' : ''}`;
}

/**
 * Formate la duree en minutes vers un format lisible
 * Exemple: 150 -> "2h 30min"
 */
export function formatDuration(minutes) {
  if (!minutes || minutes <= 0) return '0 min';
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  if (hours === 0) return `${mins} min`;
  if (mins === 0) return `${hours}h`;
  return `${hours}h ${mins}min`;
}

/**
 * Formate une taille de fichier
 * Exemple: 1536000 -> "1.5 Mo"
 */
export function formatFileSize(bytes) {
  if (!bytes || bytes === 0) return '0 o';
  const sizes = ['o', 'Ko', 'Mo', 'Go'];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return (bytes / Math.pow(1024, i)).toFixed(1) + ' ' + sizes[i];
}

/**
 * Formate un compteur avec suffixe
 * Exemple: 1500 -> "1.5k"
 */
export function formatCount(count) {
  if (!count || count === 0) return '0';
  if (count >= 1000000) return (count / 1000000).toFixed(1) + 'M';
  if (count >= 1000) return (count / 1000).toFixed(1) + 'k';
  return count.toString();
}

/**
 * Formate une liste en texte
 * Exemple: ['A', 'B', 'C'] -> "A, B et C"
 */
export function formatList(list) {
  if (!list || list.length === 0) return '';
  if (list.length === 1) return list[0];
  if (list.length === 2) return `${list[0]} et ${list[1]}`;
  return list.slice(0, -1).join(', ') + ' et ' + list[list.length - 1];
}

/**
 * Truncate un texte pour les meta descriptions
 */
export function formatMetaDescription(text, maxLength = 160) {
  if (!text) return '';
  return text.length > maxLength ? text.substring(0, maxLength - 3) + '...' : text;
}

/**
 * Genere une couleur aleatoire (pour les placeholders)
 */
export function getRandomColor() {
  const colors = ['#008751', '#FFD100', '#D21034', '#002060', '#00A860'];
  return colors[Math.floor(Math.random() * colors.length)];
}

/**
 * Obtient les initiales d'un nom
 * Exemple: "Yannick Kpoholo" -> "YK"
 */
export function getInitials(name) {
  if (!name) return '?';
  const parts = name.trim().split(' ');
  if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
}

/**
 * Formate un objet pour l'URL query string
 */
export function toQueryString(params) {
  const searchParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== null && value !== undefined && value !== '') {
      searchParams.append(key, value);
    }
  });
  return searchParams.toString();
}

/**
 * Formate une date en format court
 * Exemple: "15/03/2024"
 */
export function formatDateShort(dateString) {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
}

/**
 * Formate une date en format long
 * Exemple: "15 mars 2024"
 */
export function formatDate(dateString) {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });
}

/**
 * Formate une date avec heure
 * Exemple: "15 mars 2024 à 14:30"
 */
export function formatDateTime(dateString) {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}

/**
 * Parse une query string en objet
 */
export function parseQueryString(queryString) {
  const params = new URLSearchParams(queryString);
  const result = {};
  for (const [key, value] of params.entries()) {
    result[key] = value;
  }
  return result;
}