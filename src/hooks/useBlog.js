import { useState, useCallback } from 'react';
import {
  getPosts,
  getPostBySlug,
  createPost,
  updatePost,
  deletePost,
  publishPost,
  archivePost,
  getBlogCategories,
  getBlogTags,
  getRelatedPosts,
} from '@services/blogService';
import toast from 'react-hot-toast';

// ==========================================
// HOOK USEBLOG - Gestion des articles
// ==========================================

/**
 * Hook pour les articles publics
 */
export function useBlog(options = {}) {
  const {
    initialCategory = null,
    pageSize = 9,
  } = options;

  const [posts, setPosts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [tags, setTags] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalPosts, setTotalPosts] = useState(0);
  const [activeCategory, setActiveCategory] = useState(initialCategory);
  const [hasMore, setHasMore] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Charger les articles
  const fetchPosts = useCallback(async (params = {}) => {
    setIsLoading(true);
    setError(null);

    try {
      const queryParams = {
        page: params.page || page,
        pageSize: params.pageSize || pageSize,
        ...(activeCategory && activeCategory !== 'all' && { category: activeCategory }),
        ...(params.search && { search: params.search }),
        ...(params.tag && { tag: params.tag }),
        ordering: params.ordering || '-published_at',
        status: 'published',
      };

      const result = await getPosts(queryParams);

      if (result.success && result.data) {
        const responseData = result.data;
        const postsList = responseData.results || responseData;
        setPosts(postsList);
        setTotalPages(responseData.total_pages || 1);
        setTotalPosts(responseData.count || postsList.length);
        setHasMore(responseData.next !== null);
        setPage(queryParams.page);
        return { success: true, data: responseData };
      } else {
        setError(result.error?.detail || 'Erreur de chargement des articles.');
        return { success: false };
      }
    } catch (err) {
      setError('Erreur de chargement des articles.');
      return { success: false };
    } finally {
      setIsLoading(false);
    }
  }, [page, pageSize, activeCategory]);

  // Rechercher des articles
  const search = useCallback((query) => {
    setSearchQuery(query);
    setPage(1);
    fetchPosts({ page: 1, search: query });
  }, [fetchPosts]);

  // Changer de categorie
  const changeCategory = useCallback((category) => {
    setActiveCategory(category);
    setPage(1);
    fetchPosts({ page: 1, category });
  }, [fetchPosts]);

  // Page suivante
  const nextPage = useCallback(() => {
    if (hasMore) {
      fetchPosts({ page: page + 1 });
    }
  }, [page, hasMore, fetchPosts]);

  // Page precedente
  const previousPage = useCallback(() => {
    if (page > 1) {
      fetchPosts({ page: page - 1 });
    }
  }, [page, fetchPosts]);

  // Charger les categories et tags
  const fetchMetadata = useCallback(async () => {
    try {
      const [catResult, tagResult] = await Promise.all([
        getBlogCategories(),
        getBlogTags(),
      ]);

      if (catResult.success) {
        setCategories(catResult.data.results || catResult.data);
      }
      if (tagResult.success) {
        setTags(tagResult.data.results || tagResult.data);
      }
    } catch (err) {
      console.error('Erreur chargement metadonnees:', err);
    }
  }, []);

  return {
    posts,
    categories,
    tags,
    isLoading,
    error,
    page,
    totalPages,
    totalPosts,
    activeCategory,
    hasMore,
    searchQuery,
    fetchPosts,
    fetchMetadata,
    changeCategory,
    search,
    nextPage,
    previousPage,
    setPosts,
  };
}

/**
 * Hook pour un article detaille
 */
export function usePostDetail(slug) {
  const [post, setPost] = useState(null);
  const [relatedPosts, setRelatedPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchPost = useCallback(async () => {
    if (!slug) return;

    setIsLoading(true);
    setError(null);

    try {
      const result = await getPostBySlug(slug);

      if (result.success && result.data) {
        setPost(result.data);

        // Charger les articles similaires
        const relatedResult = await getRelatedPosts(result.data.id, 3);
        if (relatedResult.success) {
          setRelatedPosts(relatedResult.data.results || relatedResult.data || []);
        }

        return { success: true, data: result.data };
      } else {
        setError('Article introuvable.');
        return { success: false };
      }
    } catch (err) {
      setError('Erreur de chargement de l\'article.');
      return { success: false };
    } finally {
      setIsLoading(false);
    }
  }, [slug]);

  return {
    post,
    relatedPosts,
    isLoading,
    error,
    fetchPost,
  };
}

/**
 * Hook pour la gestion admin des articles
 */
export function useBlogAdmin() {
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Charger tous les articles (admin)
  const fetchAllPosts = useCallback(async (params = {}) => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await getPosts({
        pageSize: params.pageSize || 20,
        ordering: params.ordering || '-created_at',
        ...params,
      });

      if (result.success && result.data) {
        setPosts(result.data.results || result.data);
        return { success: true, data: result.data };
      } else {
        setError(result.error?.detail || 'Erreur de chargement.');
        return { success: false };
      }
    } catch (err) {
      setError('Erreur de chargement des articles.');
      return { success: false };
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Creer un article
  const handleCreate = useCallback(async (data) => {
    try {
      const result = await createPost(data);
      if (result.success) {
        toast.success('Article cree avec succes.');
        await fetchAllPosts();
        return { success: true, data: result.data };
      } else {
        toast.error(result.error?.detail || 'Erreur de creation.');
        return { success: false };
      }
    } catch (err) {
      toast.error('Erreur de creation.');
      return { success: false };
    }
  }, [fetchAllPosts]);

  // Mettre a jour un article
  const handleUpdate = useCallback(async (id, data) => {
    try {
      const result = await updatePost(id, data);
      if (result.success) {
        toast.success('Article mis a jour.');
        await fetchAllPosts();
        return { success: true };
      } else {
        toast.error(result.error?.detail || 'Erreur de mise a jour.');
        return { success: false };
      }
    } catch (err) {
      toast.error('Erreur de mise a jour.');
      return { success: false };
    }
  }, [fetchAllPosts]);

  // Supprimer un article
  const handleDelete = useCallback(async (id) => {
    try {
      const result = await deletePost(id);
      if (result.success) {
        toast.success('Article supprime.');
        await fetchAllPosts();
        return { success: true };
      } else {
        toast.error(result.error?.detail || 'Erreur de suppression.');
        return { success: false };
      }
    } catch (err) {
      toast.error('Erreur de suppression.');
      return { success: false };
    }
  }, [fetchAllPosts]);

  // Publier un article
  const handlePublish = useCallback(async (id) => {
    try {
      const result = await publishPost(id);
      if (result.success) {
        toast.success('Article publie.');
        await fetchAllPosts();
        return { success: true };
      } else {
        toast.error('Erreur de publication.');
        return { success: false };
      }
    } catch (err) {
      toast.error('Erreur de publication.');
      return { success: false };
    }
  }, [fetchAllPosts]);

  // Archiver un article
  const handleArchive = useCallback(async (id) => {
    try {
      const result = await archivePost(id);
      if (result.success) {
        toast.success('Article archive.');
        await fetchAllPosts();
        return { success: true };
      } else {
        toast.error('Erreur d\'archivage.');
        return { success: false };
      }
    } catch (err) {
      toast.error('Erreur d\'archivage.');
      return { success: false };
    }
  }, [fetchAllPosts]);

  return {
    posts,
    isLoading,
    error,
    fetchAllPosts,
    handleCreate,
    handleUpdate,
    handleDelete,
    handlePublish,
    handleArchive,
  };
}

export default useBlog;