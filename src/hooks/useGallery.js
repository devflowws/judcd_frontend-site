import { useState, useCallback } from 'react';
import { get, upload, del, patch } from '../services/api';
import { API } from '@utils/constants';
import toast from 'react-hot-toast';

// ==========================================
// HOOK USEGALLERY - Galerie publique
// ==========================================

export function useGallery() {
  const [photos, setPhotos] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [activeCategory, setActiveCategory] = useState(null);

  const fetchPhotos = useCallback(async (filters = {}) => {
    setIsLoading(true);
    try {
      const params = {};
      if (filters.pageSize) params.page_size = filters.pageSize;
      if (filters.category) params.category = filters.category;

      const response = await get(API.endpoints.public.galerie, params);
      const raw = response?.data?.results || response?.data || [];

      setPhotos(raw.map(photo => ({
        id: photo.id,
        image: photo.image,
        video: photo.video,
        media_type: photo.media_type || (photo.video ? 'video' : 'image'),
        title: photo.title,
        description: photo.description,
        category: photo.category,
        created_at: photo.created_at,
      })));
    } catch (err) {
      console.error('Erreur galerie:', err);
      setPhotos([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const changeCategory = useCallback((category) => {
    setActiveCategory(category);
    fetchPhotos({ pageSize: 50, category: category || undefined });
  }, [fetchPhotos]);

  return { photos, isLoading, activeCategory, changeCategory, fetchPhotos };
}

// ==========================================
// HOOK USEGALLERYADMIN - Gestion admin
// ==========================================

export function useGalleryAdmin() {
  const [photos, setPhotos] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [selectedPhotos, setSelectedPhotos] = useState([]);

  const fetchAllPhotos = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await get(API.endpoints.admin.galerie);
      const raw = response?.data?.results || response?.data || [];
      setPhotos(Array.isArray(raw) ? raw : []);
    } catch (err) {
      toast.error('Erreur lors du chargement des photos.');
      setPhotos([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleUpload = useCallback(async (file, metadata = {}) => {
    setIsUploading(true);
    setUploadProgress(0);
    try {
      const formData = new FormData();
      // Détecte automatiquement image ou vidéo
      const isVideo = file.type?.startsWith('video/');
      formData.append(isVideo ? 'video' : 'image', file);
      if (metadata.title) formData.append('title', metadata.title);
      if (metadata.description) formData.append('description', metadata.description);
      if (metadata.category) formData.append('category', metadata.category);

      const result = await upload(API.endpoints.admin.galerie, formData, (p) => setUploadProgress(p));
      if (result.success) {
        toast.success('Photo ajoutée avec succès.');
        await fetchAllPhotos();
        return { success: true };
      } else {
        toast.error('Erreur lors de l\'upload.');
        return { success: false };
      }
    } catch (err) {
      toast.error('Erreur lors de l\'upload.');
      return { success: false };
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  }, [fetchAllPhotos]);

  const handleUpdate = useCallback(async (id, data) => {
    try {
      const result = await patch(`${API.endpoints.admin.galerie}${id}/`, data);
      if (result.success) {
        toast.success('Photo mise à jour.');
        await fetchAllPhotos();
        return { success: true };
      }
      toast.error('Erreur de mise à jour.');
      return { success: false };
    } catch (err) {
      toast.error('Erreur de mise à jour.');
      return { success: false };
    }
  }, [fetchAllPhotos]);

  const handleDelete = useCallback(async (id) => {
    try {
      const result = await del(`${API.endpoints.admin.galerie}${id}/`);
      if (result.success) {
        toast.success('Photo supprimée.');
        setSelectedPhotos(prev => prev.filter(pid => pid !== id));
        await fetchAllPhotos();
        return { success: true };
      }
      toast.error('Erreur de suppression.');
      return { success: false };
    } catch (err) {
      toast.error('Erreur de suppression.');
      return { success: false };
    }
  }, [fetchAllPhotos]);

  const toggleSelect = useCallback((id) => {
    setSelectedPhotos(prev => prev.includes(id) ? prev.filter(pid => pid !== id) : [...prev, id]);
  }, []);

  const selectAll = useCallback(() => setSelectedPhotos(photos.map(p => p.id)), [photos]);
  const deselectAll = useCallback(() => setSelectedPhotos([]), []);

  return {
    photos, isLoading, isUploading, uploadProgress, selectedPhotos,
    fetchAllPhotos, handleUpload, handleUpdate, handleDelete,
    toggleSelect, selectAll, deselectAll,
  };
}

export default useGallery;
