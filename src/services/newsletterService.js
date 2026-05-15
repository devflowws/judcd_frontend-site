import { get, post, put, patch, del } from './api';
import { API } from '@utils/constants';

// ==========================================
// SERVICE NEWSLETTER
// ==========================================

export async function getNewsletters(params = {}) {
  return await get(API.endpoints.newsletter, { params });
}

export async function getNewsletterById(id) {
  return await get(`${API.endpoints.newsletter}${id}/`);
}

export async function createNewsletter(data) {
  return await post(API.endpoints.newsletter, data);
}

export async function updateNewsletter(id, data) {
  return await put(`${API.endpoints.newsletter}${id}/`, data);
}

export async function partialUpdateNewsletter(id, data) {
  return await patch(`${API.endpoints.newsletter}${id}/`, data);
}

export async function deleteNewsletter(id) {
  return await del(`${API.endpoints.newsletter}${id}/`);
}
