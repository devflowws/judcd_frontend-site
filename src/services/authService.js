import { post, setAuthTokens, clearAuthTokens, getAccessToken } from './api';
import { API } from '@utils/constants';

// ==========================================
// SERVICE D'AUTHENTIFICATION JUDCD
// ==========================================

/**
 * Connexion administrateur
 */
export async function login(email, password) {
  if (!email || !password) {
    return {
      success: false,
      error: { detail: 'Veuillez fournir un email et un mot de passe.' },
    };
  }

  try {
    const response = await post(API.endpoints.auth.login, {
      email: email.trim(),
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
 * Deconnexion - Nettoyage côté client (pas d'endpoint logout nécessaire)
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
      error: { detail: 'Non authentifie.' },
    };
  }

  return await post(API.endpoints.auth + 'me/', {});
}

/**
 * Modifie le mot de passe
 */
export async function changePassword(currentPassword, newPassword) {
  if (!currentPassword || !newPassword) {
    return {
      success: false,
      error: { detail: 'Veuillez fournir l\'ancien et le nouveau mot de passe.' },
    };
  }

  return await post(API.endpoints.auth + 'change-password/', {
    current_password: currentPassword,
    new_password: newPassword,
  });
}

/**
 * Demande de reinitialisation de mot de passe (mot de passe oublie)
 */
export async function requestPasswordReset(email) {
  if (!email) {
    return {
      success: false,
      error: { detail: 'Veuillez fournir une adresse email.' },
    };
  }

  return await post(API.endpoints.auth + 'password-reset/', {
    email: email.trim(),
  });
}

/**
 * Confirme la reinitialisation de mot de passe
 */
export async function confirmPasswordReset(token, newPassword) {
  if (!token || !newPassword) {
    return {
      success: false,
      error: { detail: 'Token et nouveau mot de passe requis.' },
    };
  }

  return await post(API.endpoints.auth + 'password-reset/confirm/', {
    token: token,
    new_password: newPassword,
  });
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