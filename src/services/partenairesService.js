import { get, post, put, patch, del } from './api';
import { API } from '@utils/constants';

// ==========================================
// SERVICE PARTENAIRES
// ==========================================

export async function getPartenaires(params = {}) {
  return await get(API.endpoints.public.partenaires, params);
}

export async function getPartenaireById(id) {
  return await get(`${API.endpoints.partenaires}${id}/`);
}

export async function createPartenaire(data) {
  return await post(API.endpoints.partenaires, data);
}

export async function updatePartenaire(id, data) {
  return await put(`${API.endpoints.partenaires}${id}/`, data);
}

export async function partialUpdatePartenaire(id, data) {
  return await patch(`${API.endpoints.partenaires}${id}/`, data);
}

export async function deletePartenaire(id) {
  return await del(`${API.endpoints.partenaires}${id}/`);
}
