import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { ASSETS, ASSOCIATION } from '@utils/constants';
import { useAuth } from '@context/AuthContext';
import { useBlogAdmin } from '@hooks/useBlog';
import { Spinner, EmptyState } from '@components/ui/Loader/Loader';
import { ConfirmModal } from '@components/ui/Modal/Modal';
import { formatDateShort } from '@utils/helpers';

export default function AdminBlog() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const {
    posts,
    isLoading,
    fetchAllPosts,
    handleCreate,
    handleUpdate,
    handleDelete,
    handlePublish,
    handleArchive,
  } = useBlogAdmin();

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showEditor, setShowEditor] = useState(false);
  const [editingPost, setEditingPost] = useState(null);
  const [postToDelete, setPostToDelete] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    excerpt: '',
    category: '',
    status: 'draft',
  });
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    fetchAllPosts();
  }, []);

  const openEditor = (post = null) => {
    if (post) {
      setEditingPost(post);
      setFormData({
        title: post.title || '',
        content: post.content || '',
        excerpt: post.excerpt || '',
        category: post.category || '',
        status: post.status || 'draft',
      });
    } else {
      setEditingPost(null);
      setFormData({ title: '', content: '', excerpt: '', category: '', status: 'draft' });
    }
    setShowEditor(true);
  };

  const closeEditor = () => {
    setShowEditor(false);
    setEditingPost(null);
  };

  const handleSave = async () => {
    if (!formData.title.trim()) return;

    setIsSaving(true);
    let result;
    if (editingPost) {
      result = await handleUpdate(editingPost.id, formData);
    } else {
      result = await handleCreate(formData);
    }

    if (result.success) {
      closeEditor();
    }
    setIsSaving(false);
  };

  const confirmDelete = (post) => {
    setPostToDelete(post);
    setShowDeleteModal(true);
  };

  const executeDelete = async () => {
    if (postToDelete) {
      await handleDelete(postToDelete.id);
    }
    setShowDeleteModal(false);
    setPostToDelete(null);
  };

  const handleLogout = async () => {
    await logout();
    navigate('/admin/login');
  };

  return (
    <>
      <Helmet>
        <title>Articles - Administration JUDCD</title>
      </Helmet>

      <div className="min-h-screen bg-[#F8FAF9]">
        <AdminSidebar currentPath={location.pathname} onLogout={handleLogout} />

        <div className="lg:ml-64">
          <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between sticky top-0 z-20">
            <h1 className="font-heading font-bold text-xl text-[#002060]">Gestion des articles</h1>
            <div className="flex items-center gap-3">
              <button
                onClick={() => openEditor()}
                className="px-5 py-2 bg-[#008751] text-white text-sm font-semibold rounded-lg hover:bg-[#006B41] transition-all flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Nouvel article
              </button>
              <div className="w-10 h-10 bg-[#008751] rounded-full flex items-center justify-center text-white font-bold">
                A
              </div>
            </div>
          </header>

          <div className="p-6">
            {isLoading ? (
              <div className="flex justify-center py-20"><Spinner size="lg" /></div>
            ) : posts.length === 0 ? (
              <EmptyState
                title="Aucun article"
                description="Publiez votre premier article en cliquant sur le bouton ci-dessus."
              />
            ) : (
              <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-200">
                      <tr>
                        <th className="text-left px-6 py-4 text-xs font-semibold text-[#666666] uppercase">Article</th>
                        <th className="text-left px-6 py-4 text-xs font-semibold text-[#666666] uppercase hidden md:table-cell">Statut</th>
                        <th className="text-left px-6 py-4 text-xs font-semibold text-[#666666] uppercase hidden lg:table-cell">Date</th>
                        <th className="text-right px-6 py-4 text-xs font-semibold text-[#666666] uppercase">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {posts.map((post) => (
                        <tr key={post.id} className="hover:bg-gray-50 transition-colors">
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              {post.cover_image ? (
                                <img src={post.cover_image} alt="" className="w-10 h-10 rounded-lg object-cover flex-shrink-0" />
                              ) : (
                                <div className="w-10 h-10 rounded-lg bg-gray-200 flex-shrink-0" />
                              )}
                              <div className="min-w-0">
                                <p className="font-semibold text-sm text-[#333333] truncate max-w-[200px] md:max-w-[300px]">
                                  {post.title}
                                </p>
                                {post.excerpt && (
                                  <p className="text-xs text-[#999999] truncate max-w-[200px] md:max-w-[300px]">
                                    {post.excerpt}
                                  </p>
                                )}
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 hidden md:table-cell">
                            <span className={`inline-flex px-2 py-1 rounded-full text-xs font-semibold ${
                              post.status === 'published' ? 'bg-green-100 text-green-700' :
                              post.status === 'draft' ? 'bg-yellow-100 text-yellow-700' :
                              'bg-gray-100 text-gray-700'
                            }`}>
                              {post.status === 'published' ? 'Publié' : post.status === 'draft' ? 'Brouillon' : 'Archivé'}
                            </span>
                          </td>
                          <td className="px-6 py-4 hidden lg:table-cell">
                            <span className="text-sm text-[#666666]">{formatDateShort(post.published_at || post.created_at)}</span>
                          </td>
                          <td className="px-6 py-4 text-right">
                            <div className="flex items-center justify-end gap-1">
                              {post.status !== 'published' && (
                                <button
                                  onClick={() => handlePublish(post.id)}
                                  className="w-8 h-8 rounded-lg bg-green-50 text-green-600 hover:bg-green-100 flex items-center justify-center transition-colors"
                                  title="Publier"
                                >
                                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                  </svg>
                                </button>
                              )}
                              {post.status === 'published' && (
                                <button
                                  onClick={() => handleArchive(post.id)}
                                  className="w-8 h-8 rounded-lg bg-yellow-50 text-yellow-600 hover:bg-yellow-100 flex items-center justify-center transition-colors"
                                  title="Archiver"
                                >
                                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                                  </svg>
                                </button>
                              )}
                              <button
                                onClick={() => openEditor(post)}
                                className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 flex items-center justify-center transition-colors"
                                title="Modifier"
                              >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                </svg>
                              </button>
                              <button
                                onClick={() => confirmDelete(post)}
                                className="w-8 h-8 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 flex items-center justify-center transition-colors"
                                title="Supprimer"
                              >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modal éditeur */}
      <AnimatePresence>
        {showEditor && (
          <motion.div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <motion.div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto" initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }}>
              <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                <h3 className="font-heading font-bold text-lg text-[#002060]">
                  {editingPost ? 'Modifier l\'article' : 'Nouvel article'}
                </h3>
                <button onClick={closeEditor} className="w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-[#333333] mb-1">Titre *</label>
                  <input type="text" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#008751]" placeholder="Titre de l'article" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-[#333333] mb-1">Extrait</label>
                  <textarea value={formData.excerpt} onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })} rows="2"
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#008751] resize-none" placeholder="Résumé court..." />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-[#333333] mb-1">Contenu</label>
                  <textarea value={formData.content} onChange={(e) => setFormData({ ...formData, content: e.target.value })} rows="8"
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#008751] resize-none" placeholder="Contenu de l'article..." />
                </div>
                <div className="flex gap-4">
                  <div className="flex-1">
                    <label className="block text-sm font-semibold text-[#333333] mb-1">Catégorie</label>
                    <input type="text" value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#008751]" placeholder="Catégorie" />
                  </div>
                  <div className="flex-1">
                    <label className="block text-sm font-semibold text-[#333333] mb-1">Statut</label>
                    <select value={formData.status} onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#008751] bg-white">
                      <option value="draft">Brouillon</option>
                      <option value="published">Publié</option>
                      <option value="archived">Archivé</option>
                    </select>
                  </div>
                </div>
              </div>
              <div className="p-6 border-t border-gray-100 flex justify-end gap-3">
                <button onClick={closeEditor} className="px-5 py-2 border border-gray-300 text-[#333333] rounded-lg text-sm font-semibold hover:bg-gray-50">Annuler</button>
                <button onClick={handleSave} disabled={isSaving || !formData.title.trim()}
                  className="px-5 py-2 bg-[#008751] text-white rounded-lg text-sm font-semibold hover:bg-[#006B41] disabled:opacity-50 flex items-center gap-2">
                  {isSaving ? <Spinner size="sm" color="white" /> : null}
                  {editingPost ? 'Mettre à jour' : 'Publier'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <ConfirmModal isOpen={showDeleteModal} onClose={() => setShowDeleteModal(false)} onConfirm={executeDelete}
        title="Supprimer l'article" message="Êtes-vous sûr de vouloir supprimer cet article ? Cette action est irréversible."
        confirmText="Supprimer" confirmVariant="danger" />
    </>
  );
}

// Sidebar admin (identique à Gallery)
function AdminSidebar({ currentPath, onLogout }) {
  const menuItems = [
    { path: '/admin/dashboard', label: 'Tableau de bord', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
    { path: '/admin/galerie', label: 'Galerie', icon: 'M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z' },
    { path: '/admin/blog', label: 'Articles', icon: 'M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z' },
    { path: '/admin/messages', label: 'Messages', icon: 'M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z' },
    { path: '/admin/dons', label: 'Dons', icon: 'M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z' },
  ];

  return (
    <aside className="fixed top-0 left-0 h-full w-64 bg-[#002060] text-white z-30 hidden lg:block">
      <div className="p-6 border-b border-white/10">
        <Link to="/admin/dashboard" className="flex items-center gap-3">
          <img src={ASSETS.logo} alt={ASSOCIATION.name} className="h-10 w-auto brightness-0 invert" />
          <span className="font-heading font-bold text-sm">Admin JUDCD</span>
        </Link>
      </div>
      <nav className="p-4 space-y-2">
        {menuItems.map((item) => (
          <Link key={item.path} to={item.path}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
              currentPath === item.path ? 'bg-[#008751] text-white' : 'text-white/70 hover:bg-white/10 hover:text-white'
            }`}>
            <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon} />
            </svg>
            {item.label}
          </Link>
        ))}
      </nav>
      <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-white/10">
        <button onClick={onLogout} className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-white/70 hover:bg-white/10 hover:text-white transition-all w-full">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          Déconnexion
        </button>
      </div>
    </aside>
  );
}