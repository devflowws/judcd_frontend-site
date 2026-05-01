// ==========================================
// FONCTIONS DE VALIDATION JUDCD
// ==========================================

/**
 * Valide un email
 */
export function validateEmail(email) {
  if (!email || !email.trim()) {
    return { valid: false, message: 'L\'adresse email est requise.' };
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email.trim())) {
    return { valid: false, message: 'Veuillez saisir une adresse email valide.' };
  }
  return { valid: true, message: '' };
}

/**
 * Valide un numero de telephone togolais
 */
export function validatePhone(phone) {
  if (!phone || !phone.trim()) {
    return { valid: false, message: 'Le numero de telephone est requis.' };
  }
  const cleaned = phone.replace(/\s+/g, '').replace(/[()-]/g, '');
  const phoneRegex = /^(\+228)?\d{8}$/;
  if (!phoneRegex.test(cleaned.replace('+228', ''))) {
    return { valid: false, message: 'Veuillez saisir un numero de telephone togolais valide (8 chiffres).' };
  }
  return { valid: true, message: '' };
}

/**
 * Valide un champ texte requis
 */
export function validateRequired(value, fieldName = 'Ce champ') {
  if (!value || (typeof value === 'string' && !value.trim())) {
    return { valid: false, message: `${fieldName} est requis.` };
  }
  return { valid: true, message: '' };
}

/**
 * Valide la longueur minimale d'un texte
 */
export function validateMinLength(value, minLength, fieldName = 'Ce champ') {
  if (value && value.trim().length < minLength) {
    return { valid: false, message: `${fieldName} doit contenir au moins ${minLength} caracteres.` };
  }
  return { valid: true, message: '' };
}

/**
 * Valide la longueur maximale d'un texte
 */
export function validateMaxLength(value, maxLength, fieldName = 'Ce champ') {
  if (value && value.trim().length > maxLength) {
    return { valid: false, message: `${fieldName} ne doit pas depasser ${maxLength} caracteres.` };
  }
  return { valid: true, message: '' };
}

/**
 * Valide un montant de don
 */
export function validateDonationAmount(amount) {
  const numAmount = Number(amount);
  if (!amount || isNaN(numAmount)) {
    return { valid: false, message: 'Veuillez saisir un montant valide.' };
  }
  if (numAmount < 1000) {
    return { valid: false, message: 'Le montant minimum est de 1 000 FCFA.' };
  }
  if (numAmount > 10000000) {
    return { valid: false, message: 'Le montant maximum est de 10 000 000 FCFA.' };
  }
  return { valid: true, message: '' };
}

/**
 * Valide une URL
 */
export function validateURL(url) {
  if (!url || !url.trim()) {
    return { valid: true, message: '' };
  }
  try {
    new URL(url);
    return { valid: true, message: '' };
  } catch {
    return { valid: false, message: 'Veuillez saisir une URL valide.' };
  }
}

/**
 * Valide un formulaire de contact complet
 */
export function validateContactForm(data) {
  const errors = {};

  const nameValidation = validateRequired(data.name, 'Le nom');
  if (!nameValidation.valid) errors.name = nameValidation.message;

  const nameLengthValidation = validateMinLength(data.name, 2, 'Le nom');
  if (nameLengthValidation.message && !errors.name) errors.name = nameLengthValidation.message;

  const emailValidation = validateEmail(data.email);
  if (!emailValidation.valid) errors.email = emailValidation.message;

  const phoneValidation = validatePhone(data.phone);
  if (!phoneValidation.valid) errors.phone = phoneValidation.message;

  const subjectValidation = validateRequired(data.subject, 'Le sujet');
  if (!subjectValidation.valid) errors.subject = subjectValidation.message;

  const messageValidation = validateRequired(data.message, 'Le message');
  if (!messageValidation.valid) errors.message = messageValidation.message;

  const messageMinValidation = validateMinLength(data.message, 10, 'Le message');
  if (messageMinValidation.message && !errors.message) errors.message = messageMinValidation.message;

  return {
    valid: Object.keys(errors).length === 0,
    errors,
  };
}

/**
 * Valide un formulaire d'adhesion
 */
export function validateMembershipForm(data) {
  const errors = {};

  const nameValidation = validateRequired(data.fullName, 'Le nom complet');
  if (!nameValidation.valid) errors.fullName = nameValidation.message;

  const emailValidation = validateEmail(data.email);
  if (!emailValidation.valid) errors.email = emailValidation.message;

  const phoneValidation = validatePhone(data.phone);
  if (!phoneValidation.valid) errors.phone = phoneValidation.message;

  const categoryValidation = validateRequired(data.category, 'La categorie de membre');
  if (!categoryValidation.valid) errors.category = categoryValidation.message;

  return {
    valid: Object.keys(errors).length === 0,
    errors,
  };
}

/**
 * Valide un formulaire de don
 */
export function validateDonationForm(data) {
  const errors = {};

  const nameValidation = validateRequired(data.fullName, 'Le nom complet');
  if (!nameValidation.valid) errors.fullName = nameValidation.message;

  const emailValidation = validateEmail(data.email);
  if (!emailValidation.valid) errors.email = emailValidation.message;

  const amountValidation = validateDonationAmount(data.amount);
  if (!amountValidation.valid) errors.amount = amountValidation.message;

  const methodValidation = validateRequired(data.paymentMethod, 'Le moyen de paiement');
  if (!methodValidation.valid) errors.paymentMethod = methodValidation.message;

  return {
    valid: Object.keys(errors).length === 0,
    errors,
  };
}

/**
 * Valide un fichier image
 */
export function validateImageFile(file) {
  const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml'];
  const maxSize = 10 * 1024 * 1024;

  if (!file) {
    return { valid: false, message: 'Veuillez sélectionner un fichier.' };
  }

  if (!allowedTypes.includes(file.type)) {
    return { valid: false, message: 'Format non autorisé. Utilisez JPG, PNG, WebP ou SVG.' };
  }

  if (file.size > maxSize) {
    return { valid: false, message: 'Le fichier est trop volumineux. Maximum 10 Mo.' };
  }

  return { valid: true, message: '' };
}