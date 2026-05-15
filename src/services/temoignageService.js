import { get, post, put, patch, del } from './api';
import { API } from '@utils/constants';

// ==========================================
// SERVICE TEMOIGNAGES
// ==========================================

export async function getTemoignages(params = {}) {
  return await get(API.endpoints.temoignages, { params });
}

export async function getTemoignageById(id) {
  return await get(`${API.endpoints.temoignages}${id}/`);
}

export async function createTemoignage(data) {
  return await post(API.endpoints.temoignages, data);
}

export async function updateTemoignage(id, data) {
  return await put(`${API.endpoints.temoignages}${id}/`, data);
}

export async function partialUpdateTemoignage(id, data) {
  return await patch(`${API.endpoints.temoignages}${id}/`, data);
}

export async function deleteTemoignage(id) {
  return await del(`${API.endpoints.temoignages}${id}/`);
}
