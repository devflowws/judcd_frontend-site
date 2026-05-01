import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { ASSETS, ASSOCIATION } from '@utils/constants';
import { useAuth } from '@context/AuthContext';
import { useContactAdmin } from '@hooks/useContact';
import { Spinner, EmptyState } from '@components/ui/Loader/Loader';
import { ConfirmModal } from '@components/ui/Modal/Modal';
import { formatDateShort, formatPhoneNumber } from '@utils/formatters';

export default function AdminMessages() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const {
    messages,
    isLoading,
    unreadCount,
    fetchMessages,
    handleMarkAsRead,
    handleDelete,
  } = useContactAdmin();

  const [selectedMessage, setSelectedMessage] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [messageToDelete, setMessageToDelete] = useState(null);
  const [filter, setFilter] = useState('all'); // all, unread, read

  useEffect(() => {
    fetchMessages();
  }, []);

  const openDetail = async (message) => {
    setSelectedMessage(message);
    setShowDetailModal(true);
    if (!message.is_read) {
      await handleMarkAsRead(message.id);
    }
  };

  const confirmDelete = (message) => {
    setMessageToDelete(message);
    setShowDeleteModal(true);
  };

  const executeDelete = async () => {
    if (messageToDelete) {
      await handleDelete(messageToDelete.id);
      if (selectedMessage?.id === messageToDelete.id) {
        setShowDetailModal(false);
        setSelectedMessage(null);
      }
    }
    setShowDeleteModal(false);
    setMessageToDelete(null);
  };

  const handleLogout = async () => {
    await logout();
    navigate('/admin/login');
  };

  const filteredMessages = messages.filter(m => {
    if (filter === 'unread') return !m.is_read;
    if (filter === 'read') return m.is_read;
    return true;
  });

  const filters = [
    { value: 'all', label: 'Tous' },
    { value: 'unread', label: 'Non lus' },
    { value: 'read', label: 'Lus' },
  ];

  return (
    <>
      <Helmet>
        <title>Messages - Administration JUDCD</title>
      </Helmet>

      <div className="min-h-screen bg-[#F8FAF9]">
        <AdminSidebar currentPath={location.pathname} onLogout={handleLogout} />

        <div className="lg:ml-64">
          <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between sticky top-0 z-20">
            <div>
              <h1 className="font-heading font-bold text-xl text-[#002060]">Messages de contact</h1>
              {unreadCount > 0 && (
                <p className="text-sm text-[#666666]">{unreadCount} message(s) non lu(s)</p>
              )}
            </div>
            <div className="w-10 h-10 bg-[#008751] rounded-full flex items-center justify-center text-white font-bold">
              A
            </div>
          </header>

          <div className="p-6">
            {/* Filtres */}
            <div className="flex flex-wrap gap-2 mb-6">
              {filters.map((f) => (
                <button
                  key={f.value}
                  onClick={() => setFilter(f.value)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    filter === f.value
                      ? 'bg-[#008751] text-white'
                      : 'bg-white text-[#666666] hover:bg-gray-100 shadow-sm'
                  }`}
                >
                  {f.label}
                  {f.value === 'unread' && unreadCount > 0 && (
                    <span className="ml-2 bg-red-500 text-white text-xs px-1.5 py-0.5 rounded-full">
                      {unreadCount}
                    </span>
                  )}
                </button>
              ))}
            </div>

            {/* Liste des messages */}
            {isLoading ? (
              <div className="flex justify-center py-20"><Spinner size="lg" /></div>
            ) : filteredMessages.length === 0 ? (
              <EmptyState
                title="Aucun message"
                description={filter === 'unread' ? 'Tous les messages ont été lus.' : 'Aucun message reçu pour le moment.'}
              />
            ) : (
              <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                <div className="divide-y divide-gray-100">
                  {filteredMessages.map((message) => (
                    <motion.div
                      key={message.id}
                      className={`p-4 md:p-6 hover:bg-gray-50 transition-colors cursor-pointer flex items-start gap-4 ${
                        !message.is_read ? 'bg-green-50/50 border-l-4 border-[#008751]' : ''
                      }`}
                      onClick={() => openDetail(message)}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                    >
                      {/* Avatar */}
                      <div className="w-10 h-10 rounded-full bg-[#008751]/10 flex items-center justify-center flex-shrink-0">
                        <span className="text-[#008751] font-bold text-sm">
                          {message.name?.charAt(0)?.toUpperCase() || '?'}
                        </span>
                      </div>

                      {/* Contenu */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <h3 className={`font-semibold text-sm ${!message.is_read ? 'text-[#002060]' : 'text-[#333333]'}`}>
                            {message.name}
                          </h3>
                          <span className="text-xs text-[#999999] flex-shrink-0 ml-2">
                            {formatDateShort(message.created_at)}
                          </span>
                        </div>
                        <p className="text-xs text-[#008751] font-medium mb-1">{message.subject}</p>
                        <p className="text-sm text-[#666666] truncate">{message.message}</p>
                        <div className="flex items-center gap-3 mt-2">
                          {message.email && (
                            <span className="text-xs text-[#999999] flex items-center gap-1">
                              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                              </svg>
                              {message.email}
                            </span>
                          )}
                          {message.phone && (
                            <span className="text-xs text-[#999999]">{formatPhoneNumber(message.phone)}</span>
                          )}
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-1 flex-shrink-0" onClick={(e) => e.stopPropagation()}>
                        {!message.is_read && (
                          <button
                            onClick={() => handleMarkAsRead(message.id)}
                            className="w-8 h-8 rounded-lg bg-green-50 text-green-600 hover:bg-green-100 flex items-center justify-center transition-colors"
                            title="Marquer comme lu"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                          </button>
                        )}
                        <button
                          onClick={() => confirmDelete(message)}
                          className="w-8 h-8 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 flex items-center justify-center transition-colors"
                          title="Supprimer"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modal détail message */}
      <AnimatePresence>
        {showDetailModal && selectedMessage && (
          <motion.div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <motion.div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[80vh] overflow-y-auto" initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }}>
              <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                <h3 className="font-heading font-bold text-lg text-[#002060]">Détail du message</h3>
                <button onClick={() => setShowDetailModal(false)} className="w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <div className="p-6 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-[#008751]/10 flex items-center justify-center">
                    <span className="text-[#008751] font-bold">{selectedMessage.name?.charAt(0)?.toUpperCase()}</span>
                  </div>
                  <div>
                    <p className="font-bold text-[#002060]">{selectedMessage.name}</p>
                    <p className="text-xs text-[#666666]">{formatDateShort(selectedMessage.created_at)}</p>
                  </div>
                </div>
                <div className="bg-gray-50 rounded-xl p-4">
                  <p className="text-xs font-semibold text-[#008751] mb-1">{selectedMessage.subject}</p>
                  <p className="text-sm text-[#333333] whitespace-pre-wrap">{selectedMessage.message}</p>
                </div>
                <div className="space-y-2 text-sm">
                  {selectedMessage.email && (
                    <div className="flex items-center gap-2 text-[#666666]">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                      <a href={`mailto:${selectedMessage.email}`} className="text-[#008751] hover:underline">{selectedMessage.email}</a>
                    </div>
                  )}
                  {selectedMessage.phone && (
                    <div className="flex items-center gap-2 text-[#666666]">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                      <span>{formatPhoneNumber(selectedMessage.phone)}</span>
                    </div>
                  )}
                </div>
              </div>
              <div className="p-6 border-t border-gray-100 flex justify-between">
                <button onClick={() => confirmDelete(selectedMessage)} className="px-4 py-2 text-red-600 text-sm font-medium hover:bg-red-50 rounded-lg transition-colors">
                  Supprimer
                </button>
                <button onClick={() => setShowDetailModal(false)} className="px-5 py-2 bg-[#008751] text-white rounded-lg text-sm font-semibold hover:bg-[#006B41]">
                  Fermer
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <ConfirmModal isOpen={showDeleteModal} onClose={() => setShowDeleteModal(false)} onConfirm={executeDelete}
        title="Supprimer le message" message="Êtes-vous sûr de vouloir supprimer ce message ?"
        confirmText="Supprimer" confirmVariant="danger" />
    </>
  );
}

// Sidebar admin
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