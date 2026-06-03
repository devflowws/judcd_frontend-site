import { get, post, put, patch, del } from './api';
import { API } from '@utils/constants';

// ==========================================
// SERVICE MEMBRES EQUIPE 
// ==========================================
  
export async function getMembres(params = {}) {
  return await get(API.endpoints.public.team, params);
}

export async function getMembreById(id) {
  return await get(`${API.endpoints.membres}${id}/`);
}

export async function createMembre(data) {
  return await post(API.endpoints.membres, data);
}

export async function updateMembre(id, data) {
  return await put(`${API.endpoints.membres}${id}/`, data);
}

export async function partialUpdateMembre(id, data) {
  return await patch(`${API.endpoints.membres}${id}/`, data);
}

export async function deleteMembre(id) {
  return await del(`${API.endpoints.membres}${id}/`);
}
