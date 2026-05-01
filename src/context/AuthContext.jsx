import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { login as loginService, logout as logoutService, getCurrentUser, checkAuth } from '@services/authService';

// ==========================================
// CONTEXTE D'AUTHENTIFICATION JUDCD
// ==========================================

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [error, setError] = useState(null);

  // Verification du token au chargement
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
            // Token invalide
            setIsAuthenticated(false);
            setUser(null);
          }
        }
      } catch (err) {
        console.error('Erreur d\'initialisation auth:', err);
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
        return { success: true };
      } else {
        setError(result.error?.detail || 'Identifiants incorrects.');
        return { success: false, error: result.error };
      }
    } catch (err) {
      const message = 'Erreur de connexion. Veuillez reessayer.';
      setError(message);
      return { success: false, error: { detail: message } };
    } finally {
      setIsLoading(false);
    }
  }, []);

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
    }
  }, []);

  // Mise a jour du profil utilisateur
  const updateUser = useCallback((userData) => {
    setUser(prev => ({ ...prev, ...userData }));
  }, []);

  // Reinitialisation de l'erreur
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const value = {
    user,
    isLoading,
    isAuthenticated,
    error,
    login,
    logout,
    updateUser,
    clearError,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

// Hook personnalise pour utiliser le contexte
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth doit etre utilise a l\'interieur d\'un AuthProvider.');
  }
  return context;
}

export default AuthContext;