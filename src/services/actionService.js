import { get, post, put, patch, del } from './api';
import { API } from '@utils/constants';

// ==========================================
// SERVICE ACTIONS
// ==========================================

export async function getActions(params = {}) {
  return await get(API.endpoints.action, { params });
}

export async function getActionById(id) {
  return await get(`${API.endpoints.action}${id}/`);
}

export async function createAction(data) {
  return await post(API.endpoints.action, data);
}

export async function updateAction(id, data) {
  return await put(`${API.endpoints.action}${id}/`, data);
}

export async function partialUpdateAction(id, data) {
  return await patch(`${API.endpoints.action}${id}/`, data);
}

export async function deleteAction(id) {
  return await del(`${API.endpoints.action}${id}/`);
}
