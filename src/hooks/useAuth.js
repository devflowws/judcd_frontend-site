import { useState, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  login as loginService,
  logout as logoutService,
  getCurrentUser,
  changePassword as changePasswordService,
  checkAuth,
} from '@services/authService';

// ==========================================
// HOOK USEAUTH - Logique d'authentification
// ==========================================

/**
 * Hook complet d'authentification
 */
export function useAuth() {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Initialisation
  useEffect(() => {
    const initAuth = async () => {
      try {
        const hasAuth = checkAuth();
        if (hasAuth) {
          const result = await getCurrentUser();
          if (result.success && result.data) {
            setUser(result.data);
            setIsAuthenticated(true);
          } else {
            setIsAuthenticated(false);
            setUser(null);
          }
        } else {
          setIsAuthenticated(false);
          setUser(null);
        }
      } catch (err) {
        setIsAuthenticated(false);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();
  }, []);

  // Connexion
  const login = useCallback(async (email, password) => {
    setError(null);
    setIsLoading(true);

    try {
      const result = await loginService(email, password);

      if (result.success && result.data) {
        setUser(result.data);
        setIsAuthenticated(true);
        navigate('/admin/dashboard');
        return { success: true };
      } else {
        const message = result.error?.detail || 'Identifiants incorrects.';
        setError(message);
        return { success: false, error: message };
      }
    } catch (err) {
      const message = 'Erreur de connexion. Veuillez reessayer.';
      setError(message);
      return { success: false, error: message };
    } finally {
      setIsLoading(false);
    }
  }, [navigate]);

  // Deconnexion
  const logout = useCallback(async () => {
    try {
      await logoutService();
    } catch (err) {
      console.error('Erreur deconnexion:', err);
    } finally {
      setUser(null);
      setIsAuthenticated(false);
      setError(null);
      navigate('/admin/login');
    }
  }, [navigate]);

  // Changement de mot de passe
  const changePassword = useCallback(async (currentPassword, newPassword) => {
    setError(null);
    setIsLoading(true);

    try {
      const result = await changePasswordService(currentPassword, newPassword);
      if (result.success) {
        return { success: true, message: 'Mot de passe modifie avec succes.' };
      } else {
        const message = result.error?.detail || 'Erreur lors du changement.';
        setError(message);
        return { success: false, error: message };
      }
    } catch (err) {
      const message = 'Erreur serveur. Veuillez reessayer.';
      setError(message);
      return { success: false, error: message };
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Verifie si l'utilisateur a un role specifique
  const hasRole = useCallback((role) => {
    if (!user) return false;
    return user.role === role || user.roles?.includes(role);
  }, [user]);

  // Verifie si l'utilisateur est admin
  const isAdmin = useCallback(() => {
    if (!user) return false;
    return user.is_staff || user.is_superuser || user.role === 'admin';
  }, [user]);

  return {
    user,
    isLoading,
    isAuthenticated,
    error,
    login,
    logout,
    changePassword,
    hasRole,
    isAdmin,
    setError,
  };
}

/**
 * Hook pour proteger les routes admin
 */
export function useRequireAuth() {
  const [isChecking, setIsChecking] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const check = async () => {
      try {
        const hasAuth = checkAuth();
        if (!hasAuth) {
          setIsAuthorized(false);
          navigate('/admin/login');
          return;
        }

        const result = await getCurrentUser();
        if (result.success && result.data) {
          setIsAuthorized(true);
        } else {
          setIsAuthorized(false);
          navigate('/admin/login');
        }
      } catch (err) {
        setIsAuthorized(false);
        navigate('/admin/login');
      } finally {
        setIsChecking(false);
      }
    };

    check();
  }, [navigate]);

  return { isChecking, isAuthorized };
}

/**
 * Hook pour les permissions granulaires
 */
export function usePermission(requiredPermission) {
  const [hasPermission, setHasPermission] = useState(false);
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const checkPermission = async () => {
      try {
        const result = await getCurrentUser();
        if (result.success && result.data) {
          const user = result.data;
          const permissions = user.permissions || [];
          setHasPermission(
            user.is_superuser ||
            user.is_staff ||
            permissions.includes(requiredPermission)
          );
        } else {
          setHasPermission(false);
        }
      } catch (err) {
        setHasPermission(false);
      } finally {
        setIsChecking(false);
      }
    };

    checkPermission();
  }, [requiredPermission]);

  return { hasPermission, isChecking };
}

export default useAuth;