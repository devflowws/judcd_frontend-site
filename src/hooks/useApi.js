import { useState, useCallback, useEffect, useRef } from 'react';

// ==========================================
// HOOK USEAPI - Gestion des appels API
// ==========================================

/**
 * Hook generique pour les appels API
 * @param {Function} apiFunction - La fonction API a appeler
 * @param {Object} options - Options de configuration
 */
export function useApi(apiFunction, options = {}) {
  const {
    immediate = false,
    initialData = null,
    onSuccess = null,
    onError = null,
  } = options;

  const [data, setData] = useState(initialData);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const abortControllerRef = useRef(null);

  // Nettoie les requetes en cours au demontage
  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  // Execute la fonction API
  const execute = useCallback(async (...args) => {
    // Annule la requete precedente si elle existe
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    // Nouvel AbortController
    abortControllerRef.current = new AbortController();

    setIsLoading(true);
    setError(null);
    setIsSuccess(false);

    try {
      const response = await apiFunction(...args);

      if (response.success) {
        setData(response.data);
        setIsSuccess(true);
        onSuccess?.(response.data);
        return { success: true, data: response.data };
      } else {
        const errorMessage = response.error?.detail || 'Une erreur est survenue.';
        setError(errorMessage);
        onError?.(errorMessage);
        return { success: false, error: errorMessage };
      }
    } catch (err) {
      // Ignore les erreurs d'annulation
      if (err.name === 'AbortError' || err.code === 'ERR_CANCELED') {
        return { success: false, error: 'Requete annulee.' };
      }

      const errorMessage = err.response?.data?.detail || err.message || 'Erreur reseau.';
      setError(errorMessage);
      onError?.(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  }, [apiFunction, onSuccess, onError]);

  // Reinitialise les etats
  const reset = useCallback(() => {
    setData(initialData);
    setError(null);
    setIsLoading(false);
    setIsSuccess(false);
  }, [initialData]);

  // Efface l'erreur
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // Execution immediate si demandee
  useEffect(() => {
    if (immediate) {
      execute();
    }
  }, [immediate, execute]);

  return {
    data,
    isLoading,
    error,
    isSuccess,
    execute,
    reset,
    clearError,
    setData,
  };
}

/**
 * Hook pour les operations de mutation (POST, PUT, DELETE)
 */
export function useMutation(apiFunction, options = {}) {
  const {
    onSuccess = null,
    onError = null,
    onSettled = null,
  } = options;

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const [data, setData] = useState(null);

  const mutate = useCallback(async (...args) => {
    setIsLoading(true);
    setError(null);
    setIsSuccess(false);

    try {
      const response = await apiFunction(...args);

      if (response.success) {
        setData(response.data);
        setIsSuccess(true);
        onSuccess?.(response.data);
        return { success: true, data: response.data };
      } else {
        const errorMessage = response.error?.detail || 'Une erreur est survenue.';
        setError(errorMessage);
        onError?.(errorMessage);
        return { success: false, error: errorMessage };
      }
    } catch (err) {
      const errorMessage = err.response?.data?.detail || err.message || 'Erreur reseau.';
      setError(errorMessage);
      onError?.(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
      onSettled?.();
    }
  }, [apiFunction, onSuccess, onError, onSettled]);

  const reset = useCallback(() => {
    setData(null);
    setError(null);
    setIsLoading(false);
    setIsSuccess(false);
  }, []);

  return {
    mutate,
    data,
    isLoading,
    error,
    isSuccess,
    reset,
  };
}

/**
 * Hook pour les requetes avec pagination
 */
export function usePaginatedApi(apiFunction, options = {}) {
  const {
    initialPage = 1,
    pageSize = 12,
    initialData = null,
  } = options;

  const [data, setData] = useState(initialData);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(initialPage);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [hasMore, setHasMore] = useState(false);

  const fetchPage = useCallback(async (pageNumber, customParams = {}) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await apiFunction({
        page: pageNumber,
        pageSize,
        ...customParams,
      });

      if (response.success && response.data) {
        const responseData = response.data;
        setData(responseData.results || responseData);
        setTotalPages(responseData.total_pages || 1);
        setTotalItems(responseData.count || 0);
        setHasMore(
          responseData.next !== null &&
          (responseData.results?.length === pageSize)
        );
        setPage(pageNumber);
        return { success: true, data: responseData };
      } else {
        const errorMessage = response.error?.detail || 'Erreur de chargement.';
        setError(errorMessage);
        return { success: false, error: errorMessage };
      }
    } catch (err) {
      const errorMessage = err.response?.data?.detail || err.message || 'Erreur reseau.';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  }, [apiFunction, pageSize]);

  const nextPage = useCallback((customParams = {}) => {
    if (hasMore && !isLoading) {
      return fetchPage(page + 1, customParams);
    }
    return { success: false, error: 'Pas de page suivante.' };
  }, [page, hasMore, isLoading, fetchPage]);

  const previousPage = useCallback((customParams = {}) => {
    if (page > 1 && !isLoading) {
      return fetchPage(page - 1, customParams);
    }
    return { success: false, error: 'Pas de page precedente.' };
  }, [page, isLoading, fetchPage]);

  const goToPage = useCallback((pageNumber, customParams = {}) => {
    if (pageNumber >= 1 && pageNumber <= totalPages && !isLoading) {
      return fetchPage(pageNumber, customParams);
    }
    return { success: false, error: 'Page invalide.' };
  }, [totalPages, isLoading, fetchPage]);

  return {
    data,
    isLoading,
    error,
    page,
    totalPages,
    totalItems,
    hasMore,
    fetchPage,
    nextPage,
    previousPage,
    goToPage,
    setData,
  };
}

export default useApi;