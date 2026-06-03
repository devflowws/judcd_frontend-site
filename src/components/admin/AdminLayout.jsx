import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ASSETS, ASSOCIATION } from '@utils/constants';
import { useAuth } from '@context/AuthContext';
import { get } from '@services/api';
import { API } from '@utils/constants';

export default function AdminLayout({ children, title }) {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile]       = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showNotifPanel, setShowNotifPanel] = useState(false);
  const [recentMessages, setRecentMessages] = useState([]);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
      if (window.innerWidth >= 1024) setSidebarOpen(false);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Polling des notifications toutes les 60 secondes
  const fetchNotifications = useCallback(async () => {
    try {
      const res = await get(API.endpoints.admin.contact);
      const msgs = res?.data?.results || res?.data || [];
      const unread = msgs.filter(m => !m.is_read);
      setUnreadCount(unread.length);
      setRecentMessages(msgs.slice(0, 5));
    } catch { /* silencieux */ }
  }, []);

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 60000);
    return () => clearInterval(interval);
  }, [fetchNotifications]);

  const handleLogout = async () => {
    await logout();
    navigate('/admin/login');
  };

  const I = (d) => <svg className="w-[18px] h-[18px]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d={d} /></svg>;

  const menuGroups = [
    {
      title: 'Principal',
      items: [
        { path: '/admin/dashboard', label: 'Tableau de bord', icon: I('M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6') },
        { path: '/admin/adhesions', label: 'Adhésions', icon: I('M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z') },
      ],
    },
    {
      title: 'Contenu',
      items: [
        { path: '/admin/galerie', label: 'Galerie', icon: I('M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z') },
        { path: '/admin/actions', label: 'Actions', icon: I('M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z') },
        { path: '/admin/blog', label: 'Actualités', icon: I('M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z') },
        { path: '/admin/equipe', label: 'Équipe', icon: I('M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z') },
        { path: '/admin/partenaires', label: 'Partenaires', icon: I('M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z') },
        { path: '/admin/temoignages', label: 'Témoignages', icon: I('M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z') },
      ],
    },
    {
      title: 'Communication',
      items: [
        { path: '/admin/messages', label: 'Messages', badge: unreadCount, icon: I('M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z') },
        { path: '/admin/newsletter', label: 'Newsletter', icon: I('M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z') },
        { path: '/admin/dons', label: 'Dons', icon: I('M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z') },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile sidebar overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <AnimatePresence>
        {(sidebarOpen || !isMobile) && (
          <motion.aside
            initial={isMobile ? { x: -300 } : { x: 0 }}
            animate={{ x: 0 }}
            exit={isMobile ? { x: -300 } : { x: 0 }}
            className={`fixed top-0 left-0 h-full bg-[#001233] text-white z-50 flex flex-col ${
              isMobile ? 'w-72' : 'w-64'
            }`}
            style={{ boxShadow: '4px 0 24px rgba(0,0,0,0.12)' }}
          >
            {/* Halo décoratif */}
            <div className="absolute top-0 right-0 w-40 h-40 bg-[#008751]/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-32 left-0 w-32 h-32 bg-[#FFD100]/5 rounded-full blur-3xl pointer-events-none" />

            {/* Logo */}
            <div className="relative px-5 py-5 border-b border-white/[0.06]">
              <Link to="/admin/dashboard" className="flex items-center gap-3 group">
                <div className="relative">
                  <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-[#008751] to-[#006B41] flex items-center justify-center shadow-lg shadow-green-900/40 overflow-hidden">
                    <img src={ASSETS.logo} alt={ASSOCIATION.name} className="h-7 w-auto brightness-0 invert" />
                  </div>
                  <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-400 rounded-full border-2 border-[#001233]" />
                </div>
                <div>
                  <h1 className="font-heading font-bold text-[15px] tracking-tight">Admin JUDCD</h1>
                  <p className="text-[11px] text-white/40 font-medium">Espace de gestion</p>
                </div>
              </Link>
            </div>

            {/* Navigation groupée */}
            <nav className="relative flex-1 px-3 py-4 space-y-5 overflow-y-auto">
              {menuGroups.map((group) => (
                <div key={group.title}>
                  <p className="px-3 mb-1.5 text-[10px] font-bold text-white/30 uppercase tracking-[0.12em]">{group.title}</p>
                  <div className="space-y-0.5">
                    {group.items.map((item) => {
                      const active = location.pathname === item.path;
                      return (
                        <Link
                          key={item.path}
                          to={item.path}
                          onClick={() => isMobile && setSidebarOpen(false)}
                          className={`group relative flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                            active ? 'text-white' : 'text-white/55 hover:text-white hover:bg-white/[0.04]'
                          }`}
                        >
                          {/* Barre d'accent active */}
                          {active && (
                            <motion.span layoutId="sidebar-active"
                              className="absolute inset-0 rounded-xl bg-gradient-to-r from-[#008751]/90 to-[#006B41]/80 shadow-lg shadow-green-900/30"
                              transition={{ type: 'spring', stiffness: 380, damping: 32 }} />
                          )}
                          {active && <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 bg-[#FFD100] rounded-r-full z-10" />}
                          <span className="relative z-10 flex-shrink-0">{item.icon}</span>
                          <span className="relative z-10 flex-1">{item.label}</span>
                          {item.badge > 0 && (
                            <span className={`relative z-10 min-w-[18px] h-[18px] px-1 flex items-center justify-center rounded-full text-[10px] font-bold ${active ? 'bg-white text-[#008751]' : 'bg-red-500 text-white'}`}>
                              {item.badge > 9 ? '9+' : item.badge}
                            </span>
                          )}
                        </Link>
                      );
                    })}
                  </div>
                </div>
              ))}
            </nav>

            {/* User section */}
            <div className="relative px-3 py-3 border-t border-white/[0.06]">
              <div className="flex items-center gap-3 px-2 py-2 mb-1 rounded-xl">
                <div className="relative flex-shrink-0">
                  <div className="w-9 h-9 bg-gradient-to-br from-[#FFD100] to-[#F5A623] rounded-xl flex items-center justify-center text-[#001233] font-bold text-sm">
                    {(user?.first_name || user?.username || user?.email || 'A').charAt(0).toUpperCase()}
                  </div>
                  <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-green-400 rounded-full border-2 border-[#001233]" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold truncate capitalize">{user?.first_name || user?.username?.split('@')[0] || 'Admin'}</p>
                  <p className="text-[11px] text-white/40 truncate">{user?.email || 'Administrateur'}</p>
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-white/55 hover:bg-red-500/15 hover:text-red-300 transition-all duration-200 group"
              >
                <svg className="w-[18px] h-[18px] group-hover:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                <span>Déconnexion</span>
              </button>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Main content */}
      <div className={`${!isMobile ? 'lg:ml-64' : ''} transition-all duration-300 flex flex-col min-h-screen`}>
        {/* Top bar */}
        <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-30">
          <div className="px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              {/* Left side - Mobile menu button */}
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setSidebarOpen(true)}
                  className="lg:hidden p-2 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                </button>
                
                {/* Page title */}
                <h1 className="font-heading font-bold text-xl text-gray-900 truncate">
                  {title || 'Tableau de bord'}
                </h1>
              </div>

              {/* Right side */}
              <div className="flex items-center gap-3 sm:gap-4">
                {/* Notifications */}
                <div className="relative">
                  <button
                    onClick={() => setShowNotifPanel(v => !v)}
                    className="relative p-2 rounded-lg text-gray-500 hover:text-gray-900 hover:bg-gray-100 transition-colors"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                    </svg>
                    {unreadCount > 0 && (
                      <span className="absolute top-0.5 right-0.5 min-w-[16px] h-4 bg-red-500 rounded-full flex items-center justify-center text-[9px] font-bold text-white px-0.5 leading-none">
                        {unreadCount > 9 ? '9+' : unreadCount}
                      </span>
                    )}
                  </button>

                  {/* Panel notifications */}
                  <AnimatePresence>
                    {showNotifPanel && (
                      <>
                        <div className="fixed inset-0 z-40" onClick={() => setShowNotifPanel(false)} />
                        <motion.div
                          initial={{ opacity: 0, y: -8, scale: 0.97 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: -8, scale: 0.97 }}
                          transition={{ duration: 0.15 }}
                          className="absolute right-0 top-12 w-80 bg-white rounded-2xl shadow-xl border border-gray-100 z-50 overflow-hidden"
                        >
                          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-50">
                            <div className="flex items-center gap-2">
                              <p className="font-semibold text-sm text-gray-900">Messages</p>
                              {unreadCount > 0 && (
                                <span className="px-1.5 py-0.5 bg-red-100 text-red-600 text-[10px] font-bold rounded-full">
                                  {unreadCount} non lu{unreadCount > 1 ? 's' : ''}
                                </span>
                              )}
                            </div>
                            <Link
                              to="/admin/messages"
                              onClick={() => setShowNotifPanel(false)}
                              className="text-xs text-[#008751] font-medium hover:underline"
                            >
                              Voir tout
                            </Link>
                          </div>

                          {recentMessages.length === 0 ? (
                            <div className="py-8 text-center">
                              <p className="text-sm text-gray-400">Aucun message</p>
                            </div>
                          ) : (
                            <div className="divide-y divide-gray-50 max-h-72 overflow-y-auto">
                              {recentMessages.map(msg => (
                                <Link
                                  key={msg.id}
                                  to="/admin/messages"
                                  onClick={() => setShowNotifPanel(false)}
                                  className={`flex gap-3 px-4 py-3 hover:bg-gray-50 transition-colors ${!msg.is_read ? 'bg-blue-50/40' : ''}`}
                                >
                                  <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${!msg.is_read ? 'bg-[#008751]' : 'bg-gray-200'}`} />
                                  <div className="flex-1 min-w-0">
                                    <p className={`text-sm truncate ${!msg.is_read ? 'font-semibold text-gray-900' : 'text-gray-600'}`}>
                                      {msg.name || 'Inconnu'}
                                    </p>
                                    <p className="text-xs text-gray-400 truncate mt-0.5">
                                      {msg.subject || msg.sujet || msg.message?.substring(0, 40)}
                                    </p>
                                  </div>
                                </Link>
                              ))}
                            </div>
                          )}
                        </motion.div>
                      </>
                    )}
                  </AnimatePresence>
                </div>

                {/* User menu */}
                <div className="flex items-center gap-3">
                  <div className="hidden sm:block text-right min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {user?.name || 'Admin'}
                    </p>
                    <p className="text-xs text-gray-500 truncate">
                      {user?.email || 'admin@judcd.tg'}
                    </p>
                  </div>
                  <div className="relative flex-shrink-0">
                    <div className="w-10 h-10 bg-gradient-to-br from-[#008751] to-[#006B41] rounded-full flex items-center justify-center text-white font-bold shadow-lg">
                      {user?.name?.charAt(0) || user?.email?.charAt(0) || 'A'}
                    </div>
                    <div className="absolute -bottom-0 -right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1">
          {children}
        </main>

        {/* Footer */}
        <footer className="bg-white border-t border-gray-200 mt-auto">
          <div className="px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-sm text-gray-600">
                © 2026 {ASSOCIATION.name}. Tous droits réservés.
              </div>
              <div className="flex items-center gap-6 text-sm text-gray-600">
                <a href="#" className="hover:text-[#008751] transition-colors">Documentation</a>
                <a href="#" className="hover:text-[#008751] transition-colors">Support</a>
                <a href="/" className="hover:text-[#008751] transition-colors">Voir le site</a>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
