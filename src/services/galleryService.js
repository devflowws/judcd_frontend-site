import { get, post, put, del, upload } from './api';
import { API } from '@utils/constants';

// ==========================================
// SERVICE GALERIE JUDCD
// ==========================================

/**
 * Recupere la liste des photos avec filtres et pagination
 */
export async function getPhotos(params = {}) {
  const queryParams = {
    page: params.page || 1,
    page_size: params.pageSize || 12,
    ...(params.category && { category: params.category }),
    ...(params.search && { search: params.search }),
    ...(params.ordering && { ordering: params.ordering }),
  };

  return await get(API.endpoints.gallery, queryParams);
}

/**
 * Recupere une photo par son ID
 */
export async function getPhotoById(id) {
  if (!id) {
    return { success: false, error: { detail: 'ID de la photo requis.' } };
  }
  return await get(`${API.endpoints.gallery}${id}/`);
}

/**
 * Upload une nouvelle photo
 */
export async function uploadPhoto(file, metadata = {}, onProgress = null) {
  if (!file) {
    return { success: false, error: { detail: 'Fichier image requis.' } };
  }

  const formData = new FormData();
  formData.append('image', file);
  
  if (metadata.title) formData.append('title', metadata.title);
  if (metadata.description) formData.append('description', metadata.description);
  if (metadata.category) formData.append('category', metadata.category);
  if (metadata.is_published !== undefined) formData.append('is_published', metadata.is_published);
  if (metadata.order !== undefined) formData.append('order', metadata.order);

  return await upload(API.endpoints.gallery, formData, onProgress);
}

/**
 * Upload multiple photos
 */
export async function uploadMultiplePhotos(files, metadata = {}, onProgress = null) {
  if (!files || files.length === 0) {
    return { success: false, error: { detail: 'Aucun fichier selectionne.' } };
  }

  const results = [];
  let errors = [];

  for (let i = 0; i < files.length; i++) {
    const fileMetadata = {
      ...metadata,
      title: metadata.title || files[i].name.replace(/\.[^/.]+$/, ''),
    };

    const result = await uploadPhoto(files[i], fileMetadata, (progress) => {
      if (onProgress) {
        onProgress({
          fileIndex: i,
          fileName: files[i].name,
          progress,
          totalFiles: files.length,
        });
      }
    });

    if (result.success) {
      results.push(result.data);
    } else {
      errors.push({ file: files[i].name, error: result.error });
    }
  }

  if (errors.length > 0) {
    return {
      success: results.length > 0,
      data: results,
      partial: true,
      errors,
    };
  }

  return { success: true, data: results };
}

/**
 * Met a jour les informations d'une photo
 */
export async function updatePhoto(id, data) {
  if (!id) {
    return { success: false, error: { detail: 'ID de la photo requis.' } };
  }

  return await put(`${API.endpoints.gallery}${id}/`, data);
}

/**
 * Met a jour partiellement une photo
 */
export async function patchPhoto(id, data) {
  if (!id) {
    return { success: false, error: { detail: 'ID de la photo requis.' } };
  }

  return await put(`${API.endpoints.gallery}${id}/`, data);
}

/**
 * Supprime une photo
 */
export async function deletePhoto(id) {
  if (!id) {
    return { success: false, error: { detail: 'ID de la photo requis.' } };
  }

  return await del(`${API.endpoints.gallery}${id}/`);
}

/**
 * Supprime plusieurs photos
 */
export async function deleteMultiplePhotos(ids) {
  if (!ids || ids.length === 0) {
    return { success: false, error: { detail: 'Aucune photo selectionnee.' } };
  }

  const results = [];
  let errors = [];

  for (const id of ids) {
    const result = await deletePhoto(id);
    if (result.success) {
      results.push(id);
    } else {
      errors.push({ id, error: result.error });
    }
  }

  return {
    success: errors.length === 0,
    data: results,
    errors,
  };
}

/**
 * Recupere les categories de la galerie
 */
export async function getGalleryCategories() {
  return await get(API.endpoints.gallery + 'categories/');
}

/**
 * Recupere les photos par categorie
 */
export async function getPhotosByCategory(categorySlug, params = {}) {
  return await getPhotos({
    ...params,
    category: categorySlug,
  });
}

/**
 * Recherche des photos
 */
export async function searchPhotos(query, params = {}) {
  return await getPhotos({
    ...params,
    search: query,
  });
}