import { useState, useCallback } from 'react';
import {
  getPhotos,
  uploadPhoto,
  uploadMultiplePhotos,
  updatePhoto,
  deletePhoto,
  getGalleryCategories,
} from '@services/galleryService';
import toast from 'react-hot-toast';

// ==========================================
// HOOK USEGALLERY - Gestion de la galerie
// ==========================================

/**
 * Hook pour la galerie publique
 */
export function useGallery(options = {}) {
  const {
    initialCategory = null,
    pageSize = 12,
  } = options;

  const [photos, setPhotos] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalPhotos, setTotalPhotos] = useState(0);
  const [activeCategory, setActiveCategory] = useState(initialCategory);
  const [hasMore, setHasMore] = useState(false);

  // Charger les photos
  const fetchPhotos = useCallback(async (params = {}) => {
    setIsLoading(true);
    setError(null);

    try {
      const queryParams = {
        page: params.page || page,
        pageSize: params.pageSize || pageSize,
        ...(activeCategory && activeCategory !== 'all' && { category: activeCategory }),
        ...(params.search && { search: params.search }),
      };

      const result = await getPhotos(queryParams);

      if (result.success && result.data) {
        const responseData = result.data;
        const photosList = responseData.results || responseData;
        setPhotos(photosList);
        setTotalPages(responseData.total_pages || 1);
        setTotalPhotos(responseData.count || photosList.length);
        setHasMore(responseData.next !== null);
        setPage(queryParams.page);
        return { success: true, data: responseData };
      } else {
        setError(result.error?.detail || 'Erreur de chargement.');
        return { success: false, error: result.error };
      }
    } catch (err) {
      setError('Erreur de chargement des photos.');
      return { success: false, error: 'Erreur reseau.' };
    } finally {
      setIsLoading(false);
    }
  }, [page, pageSize, activeCategory]);

  // Changer de categorie
  const changeCategory = useCallback((category) => {
    setActiveCategory(category);
    setPage(1);
    fetchPhotos({ page: 1, category });
  }, [fetchPhotos]);

  // Page suivante
  const nextPage = useCallback(() => {
    if (hasMore) {
      fetchPhotos({ page: page + 1 });
    }
  }, [page, hasMore, fetchPhotos]);

  // Page precedente
  const previousPage = useCallback(() => {
    if (page > 1) {
      fetchPhotos({ page: page - 1 });
    }
  }, [page, fetchPhotos]);

  // Charger les categories
  const fetchCategories = useCallback(async () => {
    try {
      const result = await getGalleryCategories();
      if (result.success && result.data) {
        setCategories(result.data.results || result.data);
      }
    } catch (err) {
      console.error('Erreur chargement categories:', err);
    }
  }, []);

  return {
    photos,
    categories,
    isLoading,
    error,
    page,
    totalPages,
    totalPhotos,
    activeCategory,
    hasMore,
    fetchPhotos,
    fetchCategories,
    changeCategory,
    nextPage,
    previousPage,
    setPhotos,
  };
}

/**
 * Hook pour la gestion admin de la galerie
 */
export function useGalleryAdmin() {
  const [photos, setPhotos] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [selectedPhotos, setSelectedPhotos] = useState([]);
  const [error, setError] = useState(null);

  // Charger toutes les photos
  const fetchAllPhotos = useCallback(async (params = {}) => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await getPhotos({
        pageSize: params.pageSize || 50,
        ...params,
      });

      if (result.success && result.data) {
        setPhotos(result.data.results || result.data);
        return { success: true, data: result.data };
      } else {
        setError(result.error?.detail || 'Erreur de chargement.');
        return { success: false };
      }
    } catch (err) {
      setError('Erreur de chargement des photos.');
      return { success: false };
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Uploader une photo
  const handleUpload = useCallback(async (file, metadata = {}) => {
    setIsUploading(true);
    setUploadProgress(0);
    setError(null);

    try {
      const result = await uploadPhoto(file, metadata, (progress) => {
        setUploadProgress(progress);
      });

      if (result.success) {
        toast.success('Photo ajoutee avec succes.');
        await fetchAllPhotos();
        return { success: true, data: result.data };
      } else {
        toast.error(result.error?.detail || 'Erreur lors de l\'upload.');
        setError(result.error?.detail);
        return { success: false };
      }
    } catch (err) {
      toast.error('Erreur lors de l\'upload.');
      setError('Erreur reseau.');
      return { success: false };
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  }, [fetchAllPhotos]);

  // Uploader plusieurs photos
  const handleUploadMultiple = useCallback(async (files, metadata = {}) => {
    setIsUploading(true);
    setError(null);

    try {
      const result = await uploadMultiplePhotos(files, metadata, (progressInfo) => {
        setUploadProgress(progressInfo.progress);
      });

      if (result.success) {
        const count = result.data?.length || 0;
        toast.success(`${count} photo(s) ajoutee(s) avec succes.`);
        await fetchAllPhotos();
        return { success: true };
      }

      if (result.partial) {
        toast.success(`${result.data?.length || 0} photo(s) ajoutee(s). ${result.errors?.length || 0} echec(s).`);
        await fetchAllPhotos();
        return { success: true, partial: true };
      }

      toast.error('Erreur lors de l\'upload.');
      return { success: false };
    } catch (err) {
      toast.error('Erreur lors de l\'upload multiple.');
      return { success: false };
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  }, [fetchAllPhotos]);

  // Mettre a jour une photo
  const handleUpdate = useCallback(async (id, data) => {
    try {
      const result = await updatePhoto(id, data);
      if (result.success) {
        toast.success('Photo mise a jour.');
        await fetchAllPhotos();
        return { success: true };
      } else {
        toast.error(result.error?.detail || 'Erreur de mise a jour.');
        return { success: false };
      }
    } catch (err) {
      toast.error('Erreur de mise a jour.');
      return { success: false };
    }
  }, [fetchAllPhotos]);

  // Supprimer une photo
  const handleDelete = useCallback(async (id) => {
    try {
      const result = await deletePhoto(id);
      if (result.success) {
        toast.success('Photo supprimée.');
        setSelectedPhotos(prev => prev.filter(pid => pid !== id));
        await fetchAllPhotos();
        return { success: true };
      } else {
        toast.error(result.error?.detail || 'Erreur de suppression.');
        return { success: false };
      }
    } catch (err) {
      toast.error('Erreur de suppression.');
      return { success: false };
    }
  }, [fetchAllPhotos]);

  // Selection / Deselection
  const toggleSelect = useCallback((id) => {
    setSelectedPhotos(prev =>
      prev.includes(id) ? prev.filter(pid => pid !== id) : [...prev, id]
    );
  }, []);

  const selectAll = useCallback(() => {
    setSelectedPhotos(photos.map(p => p.id));
  }, [photos]);

  const deselectAll = useCallback(() => {
    setSelectedPhotos([]);
  }, []);

  return {
    photos,
    isLoading,
    isUploading,
    uploadProgress,
    selectedPhotos,
    error,
    fetchAllPhotos,
    handleUpload,
    handleUploadMultiple,
    handleUpdate,
    handleDelete,
    toggleSelect,
    selectAll,
    deselectAll,
  };
}

// ==========================================
// HOOK USEGALLERYADMIN - Gestion admin de la galerie
// ==========================================

export default useGallery;