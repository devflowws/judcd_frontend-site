import { get, post, put, patch, del } from './api';
import { API } from '@utils/constants';

// ==========================================
// SERVICE GALERIE ACTIONS
// ==========================================

export async function getGaleries(params = {}) {
  return await get(API.endpoints.galerie, { params });
}

export async function getGalerieById(id) {
  return await get(`${API.endpoints.galerie}${id}/`);
}

export async function createGalerie(data) {
  return await post(API.endpoints.galerie, data);
}

export async function updateGalerie(id, data) {
  return await put(`${API.endpoints.galerie}${id}/`, data);
}

export async function partialUpdateGalerie(id, data) {
  return await patch(`${API.endpoints.galerie}${id}/`, data);
}

export async function deleteGalerie(id) {
  return await del(`${API.endpoints.galerie}${id}/`);
}
