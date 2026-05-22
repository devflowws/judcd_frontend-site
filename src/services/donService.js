import { get, post, put, patch, del } from './api';
import { API } from '@utils/constants';

// ==========================================
// SERVICE DONS / DONATIONS
// ==========================================

export async function getDons(params = {}) {
  return await get(API.endpoints.don, { params });
}

export async function getDonById(id) {
  return await get(`${API.endpoints.don}${id}/`);
}

export async function createDon(data) {
  return await post(API.endpoints.don, data);
}

export async function updateDon(id, data) {
  return await put(`${API.endpoints.don}${id}/`, data);
}

export async function partialUpdateDon(id, data) {
  return await patch(`${API.endpoints.don}${id}/`, data);
}

export async function deleteDon(id) {
  return await del(`${API.endpoints.don}${id}/`);
}
