import { get, post, setAuthTokens, clearAuthTokens, getAccessToken } from './api';
import { API } from '@utils/constants';

// ==========================================
// SERVICE D'AUTHENTIFICATION JUDCD
// ==========================================

/**
 * Connexion administrateur
 */
export async function login(username, password) {
  if (!username || !password) {
    return {
      success: false,
      error: { detail: 'Veuillez fournir un email et un mot de passe.' },
    };
  }

  try {
    const id = username.trim();
    const response = await post(API.endpoints.auth.login, {
      username: id,
      email: id,
      password: password,
    });

    if (response.success && response.data) {
      const { access, refresh, user } = response.data;
      setAuthTokens(access, refresh);
      return {
        success: true,
        data: user,
      };
    }

    return response;
  } catch (error) {
    return {
      success: false,
      error: { detail: 'Identifiants incorrects. Veuillez reessayer.' },
    };
  }
}

/**
 * Deconnexion — nettoyage côté client uniquement
 */
export async function logout() {
  clearAuthTokens();
  window.location.href = '/admin/login';
}

/**
 * Recupere le profil de l'utilisateur connecte
 */
export async function getCurrentUser() {
  const token = getAccessToken();
  if (!token) {
    return {
      success: false,
      error: { detail: 'Non authentifié.' },
    };
  }

  return await get(API.endpoints.auth.me);
}

/**
 * Verifie si l'utilisateur est authentifie
 */
export function checkAuth() {
  const token = getAccessToken();
  return !!token;
}

/**
 * Recupere le token d'acces
 */
export function getToken() {
  return getAccessToken();
}

/**
 * Rafraichit le token d'acces
 */
export async function refreshAccessToken() {
  const refreshToken = localStorage.getItem('judcd_refresh_token');
  if (!refreshToken) {
    return { success: false, error: { detail: 'Aucun token de rafraichissement.' } };
  }

  try {
    const response = await post(API.endpoints.auth.refresh, {
      refresh: refreshToken,
    });

    if (response.success && response.data) {
      setAuthTokens(response.data.access, response.data.refresh || refreshToken);
      return { success: true };
    }

    return response;
  } catch (error) {
    clearAuthTokens();
    return {
      success: false,
      error: { detail: 'Session expiree. Veuillez vous reconnecter.' },
    };
  }
}
