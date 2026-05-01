import { get, post, put, del } from './api';
import { API } from '@utils/constants';

// ==========================================
// SERVICE CONTACT JUDCD
// ==========================================

/**
 * Envoie un message de contact
 */
export async function sendMessage(data) {
  if (!data || !data.name || !data.email || !data.message) {
    return {
      success: false,
      error: { detail: 'Les champs nom, email et message sont requis.' },
    };
  }

  const messageData = {
    name: data.name.trim(),
    email: data.email.trim(),
    phone: data.phone ? data.phone.trim() : '',
    subject: data.subject || 'Renseignements',
    message: data.message.trim(),
    recaptcha_token: data.recaptchaToken || null,
  };

  return await post(API.endpoints.contact, messageData);
}

/**
 * Recupere tous les messages (admin uniquement)
 */
export async function getMessages(params = {}) {
  const queryParams = {
    page: params.page || 1,
    page_size: params.pageSize || 20,
    ...(params.status && { status: params.status }),
    ...(params.subject && { subject: params.subject }),
    ...(params.search && { search: params.search }),
    ...(params.ordering && { ordering: params.ordering || '-created_at' }),
  };

  return await get(API.endpoints.contact, queryParams);
}

/**
 * Recupere un message par son ID
 */
export async function getMessageById(id) {
  if (!id) {
    return { success: false, error: { detail: 'ID du message requis.' } };
  }
  return await get(`${API.endpoints.contact}${id}/`);
}

/**
 * Marque un message comme lu
 */
export async function markMessageAsRead(id) {
  if (!id) {
    return { success: false, error: { detail: 'ID du message requis.' } };
  }

  return await put(`${API.endpoints.contact}${id}/`, { is_read: true });
}

/**
 * Marque un message comme non lu
 */
export async function markMessageAsUnread(id) {
  if (!id) {
    return { success: false, error: { detail: 'ID du message requis.' } };
  }

  return await put(`${API.endpoints.contact}${id}/`, { is_read: false });
}

/**
 * Archive un message
 */
export async function archiveMessage(id) {
  if (!id) {
    return { success: false, error: { detail: 'ID du message requis.' } };
  }

  return await put(`${API.endpoints.contact}${id}/`, { is_archived: true });
}

/**
 * Desarchive un message
 */
export async function unarchiveMessage(id) {
  if (!id) {
    return { success: false, error: { detail: 'ID du message requis.' } };
  }

  return await put(`${API.endpoints.contact}${id}/`, { is_archived: false });
}

/**
 * Supprime un message
 */
export async function deleteMessage(id) {
  if (!id) {
    return { success: false, error: { detail: 'ID du message requis.' } };
  }

  return await del(`${API.endpoints.contact}${id}/`);
}

/**
 * Supprime plusieurs messages
 */
export async function deleteMultipleMessages(ids) {
  if (!ids || ids.length === 0) {
    return { success: false, error: { detail: 'Aucun message selectionne.' } };
  }

  const results = [];
  let errors = [];

  for (const id of ids) {
    const result = await deleteMessage(id);
    if (result.success) {
      results.push(id);
    } else {
      errors.push({ id, error: result.error });
    }
  }

  return {
    success: errors.length === 0,
    data: results,
    errors,
  };
}

/**
 * Recupere le nombre de messages non lus
 */
export async function getUnreadCount() {
  const result = await getMessages({
    status: 'unread',
    pageSize: 1,
  });

  if (result.success && result.data) {
    return {
      success: true,
      data: result.data.count || 0,
    };
  }

  return result;
}

/**
 * Recupere les sujets de contact disponibles
 */
export async function getContactSubjects() {
  // Sujets predefinis selon le cahier des charges
  return {
    success: true,
    data: [
      'Adhesion',
      'Partenariat',
      'Renseignements',
      'Don',
      'Projet',
      'Presse',
      'Autre',
    ],
  };
}