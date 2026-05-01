import { get, post, put } from './api';
import { API } from '@utils/constants';

// ==========================================
// SERVICE DONS JUDCD
// ==========================================

/**
 * Soumet une promesse de don
 */
export async function submitDonation(data) {
  if (!data || !data.fullName || !data.email || !data.amount) {
    return {
      success: false,
      error: { detail: 'Les champs nom, email et montant sont requis.' },
    };
  }

  const donationData = {
    full_name: data.fullName.trim(),
    email: data.email.trim(),
    phone: data.phone ? data.phone.trim() : '',
    amount: Number(data.amount),
    payment_method: data.paymentMethod || 'mobile_money',
    campaign: data.campaign || null,
    message: data.message ? data.message.trim() : '',
    anonymous: data.anonymous || false,
  };

  return await post(API.endpoints.donations, donationData);
}

/**
 * Verifie le statut d'un don par sa reference
 */
export async function verifyDonation(reference) {
  if (!reference) {
    return {
      success: false,
      error: { detail: 'Reference du don requise.' },
    };
  }

  return await get(`${API.endpoints.donations}verify/${reference}/`);
}

/**
 * Recupere tous les dons (admin uniquement)
 */
export async function getDonations(params = {}) {
  const queryParams = {
    page: params.page || 1,
    page_size: params.pageSize || 20,
    ...(params.status && { status: params.status }),
    ...(params.paymentMethod && { payment_method: params.paymentMethod }),
    ...(params.campaign && { campaign: params.campaign }),
    ...(params.search && { search: params.search }),
    ...(params.dateFrom && { date_from: params.dateFrom }),
    ...(params.dateTo && { date_to: params.dateTo }),
    ...(params.ordering && { ordering: params.ordering || '-created_at' }),
  };

  return await get(API.endpoints.donations, queryParams);
}

/**
 * Recupere un don par son ID
 */
export async function getDonationById(id) {
  if (!id) {
    return { success: false, error: { detail: 'ID du don requis.' } };
  }
  return await get(`${API.endpoints.donations}${id}/`);
}

/**
 * Confirme un don (admin uniquement)
 */
export async function confirmDonation(id, notes = '') {
  if (!id) {
    return { success: false, error: { detail: 'ID du don requis.' } };
  }

  return await put(`${API.endpoints.donations}${id}/`, {
    status: 'confirmed',
    admin_notes: notes,
    confirmed_at: new Date().toISOString(),
  });
}

/**
 * Rejette un don (admin uniquement)
 */
export async function rejectDonation(id, reason = '') {
  if (!id) {
    return { success: false, error: { detail: 'ID du don requis.' } };
  }

  return await put(`${API.endpoints.donations}${id}/`, {
    status: 'rejected',
    admin_notes: reason,
  });
}

/**
 * Recupere les statistiques des dons (admin uniquement)
 */
export async function getDonationStats(params = {}) {
  return await get(`${API.endpoints.donations}stats/`, params);
}

/**
 * Recupere les campagnes de dons actives
 */
export async function getActiveCampaigns() {
  return await get(`${API.endpoints.donations}campaigns/`, {
    status: 'active',
  });
}

/**
 * Recupere les moyens de paiement disponibles
 */
export async function getPaymentMethods() {
  return {
    success: true,
    data: [
      {
        id: 'mobile_money',
        name: 'Mobile Money',
        description: 'Flooz / T-Money',
        icon: 'mobile',
        instructions: 'Transferez le montant de votre don vers le numero ci-dessous. Envoyez la confirmation de transaction par WhatsApp pour un traitement rapide.',
        number: '+228 XX XX XX XX',
      },
      {
        id: 'bank_transfer',
        name: 'Virement bancaire',
        description: 'RIB sur demande',
        icon: 'bank',
        instructions: 'Contactez-nous par email pour obtenir notre RIB et effectuer un virement bancaire securise.',
        email: 'associationjudcd@gmail.com',
      },
    ],
  };
}

/**
 * Genere un recu de don (admin uniquement)
 */
export async function generateReceipt(donationId) {
  if (!donationId) {
    return { success: false, error: { detail: 'ID du don requis.' } };
  }

  return await get(`${API.endpoints.donations}${donationId}/receipt/`);
}

/**
 * Exporte les dons en CSV (admin uniquement)
 */
export async function exportDonationsCSV(params = {}) {
  return await get(`${API.endpoints.donations}export/`, {
    ...params,
    format: 'csv',
  });
}