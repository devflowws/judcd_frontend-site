import { get, post, put, del } from './api';
import { API } from '@utils/constants';

// ==========================================
// SERVICE BLOG / ACTUALITES JUDCD
// ==========================================

/**
 * Recupere la liste des articles publies
 */
export async function getPosts(params = {}) {
  const queryParams = {
    page: params.page || 1,
    page_size: params.pageSize || 9,
    ...(params.category && { category: params.category }),
    ...(params.tag && { tag: params.tag }),
    ...(params.search && { search: params.search }),
    ...(params.ordering && { ordering: params.ordering || '-published_at' }),
    ...(params.status && { status: params.status }),
  };

  return await get(API.endpoints.blog, queryParams);
}

/**
 * Recupere un article par son slug
 */
export async function getPostBySlug(slug) {
  if (!slug) {
    return { success: false, error: { detail: 'Slug de l\'article requis.' } };
  }
  return await get(`${API.endpoints.blog}${slug}/`);
}

/**
 * Recupere un article par son ID
 */
export async function getPostById(id) {
  if (!id) {
    return { success: false, error: { detail: 'ID de l\'article requis.' } };
  }
  return await get(`${API.endpoints.blog}${id}/`);
}

/**
 * Cree un nouvel article
 */
export async function createPost(data) {
  if (!data || !data.title) {
    return { success: false, error: { detail: 'Le titre de l\'article est requis.' } };
  }

  const postData = {
    title: data.title,
    content: data.content || '',
    excerpt: data.excerpt || '',
    category: data.category || null,
    tags: data.tags || [],
    cover_image: data.coverImage || null,
    status: data.status || 'draft',
    published_at: data.publishedAt || null,
    meta_title: data.metaTitle || data.title,
    meta_description: data.metaDescription || data.excerpt || '',
  };

  return await post(API.endpoints.blog, postData);
}

/**
 * Met a jour un article existant
 */
export async function updatePost(id, data) {
  if (!id) {
    return { success: false, error: { detail: 'ID de l\'article requis.' } };
  }

  return await put(`${API.endpoints.blog}${id}/`, data);
}

/**
 * Met a jour partiellement un article
 */
export async function patchPost(id, data) {
  if (!id) {
    return { success: false, error: { detail: 'ID de l\'article requis.' } };
  }

  return await put(`${API.endpoints.blog}${id}/`, data);
}

/**
 * Supprime un article
 */
export async function deletePost(id) {
  if (!id) {
    return { success: false, error: { detail: 'ID de l\'article requis.' } };
  }

  return await del(`${API.endpoints.blog}${id}/`);
}

/**
 * Publie un article (change le statut en published)
 */
export async function publishPost(id) {
  return await patchPost(id, {
    status: 'published',
    published_at: new Date().toISOString(),
  });
}

/**
 * Archive un article
 */
export async function archivePost(id) {
  return await patchPost(id, { status: 'archived' });
}

/**
 * Remet un article en brouillon
 */
export async function unpublishPost(id) {
  return await patchPost(id, { status: 'draft' });
}

/**
 * Recupere les categories d'articles
 */
export async function getBlogCategories() {
  return await get(API.endpoints.blog + 'categories/');
}

/**
 * Recupere les tags d'articles
 */
export async function getBlogTags() {
  return await get(API.endpoints.blog + 'tags/');
}

/**
 * Recupere les articles similaires
 */
export async function getRelatedPosts(postId, limit = 3) {
  if (!postId) {
    return { success: false, error: { detail: 'ID de l\'article requis.' } };
  }

  return await get(`${API.endpoints.blog}${postId}/related/`, {
    limit,
  });
}

/**
 * Recherche des articles
 */
export async function searchPosts(query, params = {}) {
  return await getPosts({
    ...params,
    search: query,
  });
}

/**
 * Recupere les articles recents
 */
export async function getRecentPosts(limit = 5) {
  return await getPosts({
    pageSize: limit,
    ordering: '-published_at',
    status: 'published',
  });
}

/**
 * Recupere les articles d'une categorie
 */
export async function getPostsByCategory(categorySlug, params = {}) {
  return await getPosts({
    ...params,
    category: categorySlug,
  });
}

/**
 * Recupere les articles d'un tag
 */
export async function getPostsByTag(tagSlug, params = {}) {
  return await getPosts({
    ...params,
    tag: tagSlug,
  });
}