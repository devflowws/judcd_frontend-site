import { get, post, put, del, upload } from './api';
import { API } from '@utils/constants';

// ==========================================
// SERVICE PRINCIPAL JUDCD - API BACKEND
// ==========================================

/**
 * Service Contact
 */
export const contactService = {
  // Envoyer un message de contact (public)
  sendMessage: async (contactData) => {
    return await post(API.endpoints.public.contact, contactData);
  },
  
  // Récupérer tous les messages (admin)
  getMessages: async () => {
    return await get(`${API.baseURL}/contact/`);
  },
  
  // Supprimer un message (admin)
  deleteMessage: async (id) => {
    return await del(`${API.baseURL}/contact/${id}/`);
  }
};

/**
 * Service Newsletter
 */
export const newsletterService = {
  // S'inscrire à la newsletter (public)
  subscribe: async (email) => {
    return await post(API.endpoints.public.newsletter, { email });
  },
  
  // Récupérer tous les abonnés (admin)
  getSubscribers: async () => {
    return await get(API.endpoints.admin.newsletter);
  },
  
  // Supprimer un abonné (admin)
  deleteSubscriber: async (id) => {
    return await del(`${API.endpoints.admin.newsletter}${id}/`);
  }
};

/**
 * Service Partenaires
 */
export const partenaireService = {
  // Récupérer tous les partenaires (public)
  getPartenaires: async () => {
    return await get(API.endpoints.public.partenaires);
  },
  
  // Récupérer les types de partenaires (public)
  getTypesPartenaires: async () => {
    return await get(API.endpoints.public.typesPartenaires);
  },
  
  // Ajouter un partenaire (admin)
  addPartenaire: async (partenaireData) => {
    return await post(API.endpoints.admin.partenaires, partenaireData);
  },
  
  // Modifier un partenaire (admin)
  updatePartenaire: async (id, partenaireData) => {
    return await put(`${API.endpoints.admin.partenaires}${id}/`, partenaireData);
  },
  
  // Supprimer un partenaire (admin)
  deletePartenaire: async (id) => {
    return await del(`${API.endpoints.admin.partenaires}${id}/`);
  }
};

/**
 * Service Dons
 */
export const donationService = {
  // Faire un don (public)
  makeDonation: async (donationData) => {
    return await post(API.endpoints.public.donation, donationData);
  },
  
  // Récupérer tous les dons (admin)
  getDonations: async () => {
    return await get(`${API.baseURL}/don/`);
  },
  
  // Supprimer un don (admin)
  deleteDonation: async (id) => {
    return await del(`${API.baseURL}/don/${id}/`);
  }
};

/**
 * Service Équipe
 */
export const teamService = {
  // Récupérer tous les membres de l'équipe (public)
  getTeamMembers: async () => {
    return await get(API.endpoints.public.team);
  },
  
  // Ajouter un membre (admin)
  addTeamMember: async (memberData) => {
    return await post(API.endpoints.admin.team, memberData);
  },
  
  // Modifier un membre (admin)
  updateTeamMember: async (id, memberData) => {
    return await put(`${API.endpoints.admin.team}${id}/`, memberData);
  },
  
  // Supprimer un membre (admin)
  deleteTeamMember: async (id) => {
    return await del(`${API.endpoints.admin.team}${id}/`);
  }
};

/**
 * Service Actions
 */
export const actionService = {
  // Récupérer toutes les actions (public)
  getActions: async () => {
    return await get(API.endpoints.public.actions);
  },
  
  // Récupérer les types d'actions (public)
  getTypesActions: async () => {
    return await get(API.endpoints.public.typesActions);
  },
  
  // Récupérer la galerie d'actions (admin)
  getGalerieActions: async () => {
    return await get(`${API.baseURL}/galerie-action/`);
  },
  
  // Ajouter une action (admin)
  addAction: async (actionData) => {
    return await post(`${API.baseURL}/action/`, actionData);
  },
  
  // Modifier une action (admin)
  updateAction: async (id, actionData) => {
    return await put(`${API.baseURL}/action/${id}/`, actionData);
  },
  
  // Supprimer une action (admin)
  deleteAction: async (id) => {
    return await del(`${API.baseURL}/action/${id}/`);
  },
  
  // Ajouter une image à la galerie (admin)
  addGalerieImage: async (formData) => {
    return await upload(`${API.baseURL}/galerie-action/`, formData);
  }
};

/**
 * Service Témoignages
 */
export const temoignageService = {
  // Récupérer tous les témoignages (public)
  getTemoignages: async () => {
    return await get(API.endpoints.public.temoignages);
  },
  
  // Ajouter un témoignage (public)
  addTemoignage: async (temoignageData) => {
    return await post(API.endpoints.public.temoignage, temoignageData);
  },
  
  // Modifier un témoignage (admin)
  updateTemoignage: async (id, temoignageData) => {
    return await put(`${API.endpoints.admin.temoignages}${id}/`, temoignageData);
  },
  
  // Supprimer un témoignage (admin)
  deleteTemoignage: async (id) => {
    return await del(`${API.endpoints.admin.temoignages}${id}/`);
  }
};

/**
 * Service Actualités
 */
export const actualiteService = {
  // Récupérer les types d'actualités (admin)
  getTypesActualites: async () => {
    return await get(API.endpoints.admin.typesActualite);
  }
};

// ==========================================
// FONCTIONS UTILITAIRES
// ==========================================

/**
 * Récupère toutes les données publiques pour le site
 */
export const getPublicData = async () => {
  try {
    const [
      partenaires,
      teamMembers,
      actions,
      temoignages,
      typesActions
    ] = await Promise.all([
      partenaireService.getPartenaires(),
      teamService.getTeamMembers(),
      actionService.getActions(),
      temoignageService.getTemoignages(),
      actionService.getTypesActions()
    ]);
    
    return {
      success: true,
      data: {
        partenaires: partenaires.data || [],
        team: teamMembers.data || [],
        actions: actions.data || [],
        temoignages: temoignages.data || [],
        typesActions: typesActions.data || []
      }
    };
  } catch (error) {
    return {
      success: false,
      error: 'Erreur lors de la récupération des données publiques'
    };
  }
};

/**
 * Formate les données pour le frontend
 */
export const formatData = {
  partenaire: (backendPartenaire) => ({
    id: backendPartenaire.id,
    name: backendPartenaire.nom,
    description: backendPartenaire.description,
    logo: backendPartenaire.logo,
    category: backendPartenaire.type_partenaire?.nom || 'Partenaire',
    link: backendPartenaire.lien
  }),
  
  teamMember: (backendMember) => ({
    id: backendMember.id,
    name: backendMember.nom_complet,
    role: backendMember.role,
    photo: backendMember.photo,
    phone: backendMember.telephone,
    email: backendMember.email,
    social: backendMember.reseaux_sociaux || {},
    bio: backendMember.infos
  }),
  
  action: (backendAction) => ({
    id: backendAction.id,
    title: backendAction.titre,
    description: backendAction.description,
    date: backendAction.date,
    location: backendAction.lieu,
    type: backendAction.type_action?.nom || 'Action',
    coverImage: backendAction.image_couverture,
    gallery: backendAction.galerie || []
  }),
  
  temoignage: (backendTemoignage) => ({
    id: backendTemoignage.id,
    name: backendTemoignage.nom,
    title: backendTemoignage.titre,
    message: backendTemoignage.message,
    photo: backendTemoignage.photo,
    date: backendTemoignage.date
  })
};
