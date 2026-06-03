import axios from 'axios';
import { API } from '@utils/constants';

// ==========================================
// CONFIGURATION AXIOS JUDCD
// ==========================================

const apiClient = axios.create({
  baseURL: API.baseURL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Stockage du token d'acces
let accessToken = localStorage.getItem('judcd_access_token') || null;

// Endpoints publics d'authentification : ne JAMAIS y envoyer de token.
// Sinon un token expiré dans le localStorage fait rejeter la requête (401)
// par JWTAuthentication avant même que la vue publique ne s'exécute.
const AUTH_PATHS = ['/login/', '/refresh/'];

// Intercepteur de requete : injection du token JWT
apiClient.interceptors.request.use(
  (config) => {
    const url = config.url || '';
    const isAuthPath = AUTH_PATHS.some((p) => url.includes(p));

    if (isAuthPath) {
      // Surtout pas de header Authorization sur login/refresh
      if (config.headers) delete config.headers.Authorization;
      return config;
    }

    const currentToken = localStorage.getItem('judcd_access_token');
    if (currentToken) {
      accessToken = currentToken;
      config.headers.Authorization = `Bearer ${currentToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Intercepteur de reponse : gestion des erreurs
apiClient.interceptors.response.use(
  (response) => {
    return response.data;
  },
  async (error) => {
    const originalRequest = error.config;
    const reqUrl = originalRequest?.url || '';
    const isAuthPath = AUTH_PATHS.some((p) => reqUrl.includes(p));

    // Sur login/refresh : ne pas tenter de rafraîchir, renvoyer l'erreur telle quelle
    if (isAuthPath) {
      return Promise.reject(error);
    }

    // Si 401 et pas encore retente
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      const refreshToken = localStorage.getItem('judcd_refresh_token');
      if (refreshToken) {
        try {
          const response = await axios.post(`${API.baseURL}${API.endpoints.auth.refresh}`, {
            refresh: refreshToken,
          });
          
          const newAccessToken = response.data.access;
          accessToken = newAccessToken;
          localStorage.setItem('judcd_access_token', newAccessToken);
          
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
          return apiClient(originalRequest);
        } catch (refreshError) {
          // Refresh token expire ou invalide
          clearAuthTokens();
          window.location.href = '/admin/login';
          return Promise.reject(refreshError);
        }
      } else {
        clearAuthTokens();
      }
    }

    // Gestion des autres codes d'erreur
    if (error.response?.status === 403) {
      console.error('Acces interdit : permissions insuffisantes.');
    }

    if (error.response?.status === 404) {
      console.error('Ressource introuvable.');
    }

    if (error.response?.status === 500) {
      console.error('Erreur serveur. Veuillez reessayer plus tard.');
    }

    if (!error.response) {
      console.error('Erreur reseau. Verifiez votre connexion internet.');
    }

    return Promise.reject(error);
  }
);

// ==========================================
// METHODES DE L'API
// ==========================================

/**
 * Requete GET
 */
export async function get(endpoint, params = {}) {
  try {
    const response = await apiClient.get(endpoint, { params });
    return { success: true, data: response };
  } catch (error) {
    return { success: false, error: error.response?.data || error.message };
  }
}

/**
 * Requete POST
 */
export async function post(endpoint, data = {}) {
  try {
    const response = await apiClient.post(endpoint, data);
    return { success: true, data: response };
  } catch (error) {
    return { success: false, error: error.response?.data || error.message };
  }
}

/**
 * Requete PUT
 */
export async function put(endpoint, data = {}) {
  try {
    const response = await apiClient.put(endpoint, data);
    return { success: true, data: response };
  } catch (error) {
    return { success: false, error: error.response?.data || error.message };
  }
}

/**
 * Requete PATCH
 */
export async function patch(endpoint, data = {}) {
  try {
    const response = await apiClient.patch(endpoint, data);
    return { success: true, data: response };
  } catch (error) {
    return { success: false, error: error.response?.data || error.message };
  }
}

/**
 * Requete DELETE
 */
export async function del(endpoint) {
  try {
    await apiClient.delete(endpoint);
    return { success: true };
  } catch (error) {
    return { success: false, error: error.response?.data || error.message };
  }
}

/**
 * Upload de fichier (multipart/form-data)
 * @param {string} method - 'post' (création) ou 'patch'/'put' (modification)
 */
export async function upload(endpoint, formData, onProgress = null, method = 'post') {
  try {
    const verb = ['post', 'put', 'patch'].includes(method) ? method : 'post';
    const response = await apiClient[verb](endpoint, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress: (progressEvent) => {
        if (onProgress && progressEvent.total) {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          onProgress(percentCompleted);
        }
      },
    });
    return { success: true, data: response };
  } catch (error) {
    return { success: false, error: error.response?.data || error.message };
  }
}

// ==========================================
// GESTION DES TOKENS
// ==========================================

/**
 * Stocke les tokens d'authentification
 */
export function setAuthTokens(access, refresh) {
  accessToken = access;
  localStorage.setItem('judcd_access_token', access);
  if (refresh) {
    localStorage.setItem('judcd_refresh_token', refresh);
  }
}

/**
 * Efface les tokens d'authentification
 */
export function clearAuthTokens() {
  accessToken = null;
  localStorage.removeItem('judcd_access_token');
  localStorage.removeItem('judcd_refresh_token');
}

/**
 * Recupere le token d'acces actuel
 */
export function getAccessToken() {
  return accessToken || localStorage.getItem('judcd_access_token');
}

/**
 * Verifie si l'utilisateur est authentifie
 */
export function isAuthenticated() {
  return !!getAccessToken();
}

export default apiClient;