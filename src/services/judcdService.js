import { get, post, put, patch, del, upload } from './api';
import { API } from '@utils/constants';

// ==========================================
// SERVICE PRINCIPAL JUDCD - API BACKEND
// ==========================================

export const contactService = {
  sendMessage: async (data) => post(API.endpoints.public.contact, data),
  getMessages: async () => get(API.endpoints.admin.contact),
  deleteMessage: async (id) => del(`${API.endpoints.admin.contact}${id}/`),
  markAsRead: async (id) => patch(`${API.endpoints.admin.contact}${id}/`, { is_read: true }),
};

export const newsletterService = {
  subscribe: async (email) => post(API.endpoints.public.newsletter, { email }),
  getSubscribers: async () => get(API.endpoints.admin.newsletter),
  deleteSubscriber: async (id) => del(`${API.endpoints.admin.newsletter}${id}/`),
};

export const partenaireService = {
  getPartenaires: async () => get(API.endpoints.public.partenaires),
  getTypesPartenaires: async () => get(API.endpoints.public.typesPartenaires),
  addPartenaire: async (data) => post(API.endpoints.admin.partenaires, data),
  updatePartenaire: async (id, data) => put(`${API.endpoints.admin.partenaires}${id}/`, data),
  deletePartenaire: async (id) => del(`${API.endpoints.admin.partenaires}${id}/`),
};

export const donationService = {
  makeDonation: async (data) => post(API.endpoints.public.donation, data),
  getDonations: async () => get(API.endpoints.admin.dons),
  deleteDonation: async (id) => del(`${API.endpoints.admin.dons}${id}/`),
};

export const teamService = {
  getTeamMembers: async () => get(API.endpoints.public.team),
  addTeamMember: async (data) => post(API.endpoints.admin.team, data),
  updateTeamMember: async (id, data) => put(`${API.endpoints.admin.team}${id}/`, data),
  deleteTeamMember: async (id) => del(`${API.endpoints.admin.team}${id}/`),
};

export const actionService = {
  getActions: async () => get(API.endpoints.public.actions),
  getTypesActions: async () => get(API.endpoints.public.typesActions),
  getGalerieActions: async () => get(API.endpoints.admin.galerie),
  addAction: async (data) => post(API.endpoints.admin.actions, data),
  updateAction: async (id, data) => put(`${API.endpoints.admin.actions}${id}/`, data),
  deleteAction: async (id) => del(`${API.endpoints.admin.actions}${id}/`),
  addGalerieImage: async (formData) => upload(API.endpoints.admin.galerie, formData),
};

export const temoignageService = {
  getTemoignages: async () => get(API.endpoints.public.temoignages),
  addTemoignage: async (data) => post(API.endpoints.public.temoignage, data),
  updateTemoignage: async (id, data) => put(`${API.endpoints.admin.temoignages}${id}/`, data),
  deleteTemoignage: async (id) => del(`${API.endpoints.admin.temoignages}${id}/`),
};

export const actualiteService = {
  getActualites: async () => get(API.endpoints.admin.actualites),
  getTypesActualites: async () => get(API.endpoints.admin.typesActualite),
  addActualite: async (data) => post(API.endpoints.admin.actualites, data),
  updateActualite: async (id, data) => put(`${API.endpoints.admin.actualites}${id}/`, data),
  deleteActualite: async (id) => del(`${API.endpoints.admin.actualites}${id}/`),
};
