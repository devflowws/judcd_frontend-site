import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { ASSETS, ASSOCIATION } from '@utils/constants';
import { useAuth } from '@context/AuthContext';


// Données simulées pour le dashboard
const dashboardStats = [
  {
    title: 'Photos galerie',
    value: '12',
    icon: 'M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z',
    color: '#008751',
    link: '/admin/galerie',
  },
  {
    title: 'Articles blog',
    value: '5',
    icon: 'M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z',
    color: '#002060',
    link: '/admin/blog',
  },
  {
    title: 'Messages reçus',
    value: '8',
    icon: 'M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z',
    color: '#FFD100',
    link: '/admin/messages',
  },
  {
    title: 'Dons reçus',
    value: '3',
    icon: 'M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z',
    color: '#D21034',
    link: '/admin/dons',
  },
];

const recentActivities = [
  { action: 'Nouveau message de contact', date: 'Il y a 2 heures', type: 'message' },
  { action: 'Photo ajoutée à la galerie', date: 'Il y a 5 heures', type: 'photo' },
  { action: 'Article publié', date: 'Il y a 1 jour', type: 'article' },
  { action: 'Don reçu : 25 000 FCFA', date: 'Il y a 2 jours', type: 'don' },
];

export default function AdminDashboard() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/admin/login');
  };

  return (
    <>
      <Helmet>
        <title>Tableau de bord - Administration JUDCD</title>
      </Helmet>

      <div className="min-h-screen bg-[#F8FAF9]">
        {/* Sidebar */}
        <aside className="fixed top-0 left-0 h-full w-64 bg-[#002060] text-white z-30 hidden lg:block">
          <div className="p-6 border-b border-white/10">
            <Link to="/admin/dashboard" className="flex items-center gap-3">
              <img src={ASSETS.logo} alt={ASSOCIATION.name} className="h-10 w-auto brightness-0 invert" />
              <span className="font-heading font-bold text-sm">Admin JUDCD</span>
            </Link>
          </div>

          <nav className="p-4 space-y-2">
            {[
              { path: '/admin/dashboard', label: 'Tableau de bord', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
              { path: '/admin/galerie', label: 'Galerie', icon: 'M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z' },
              { path: '/admin/blog', label: 'Articles', icon: 'M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z' },
              { path: '/admin/messages', label: 'Messages', icon: 'M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z' },
              { path: '/admin/dons', label: 'Dons', icon: 'M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z' },
            ].map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                  location.pathname === item.path
                    ? 'bg-[#008751] text-white'
                    : 'text-white/70 hover:bg-white/10 hover:text-white'
                }`}
              >
                <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon} />
                </svg>
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-white/10">
            <button
              onClick={handleLogout}
              className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-white/70 hover:bg-white/10 hover:text-white transition-all w-full"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              Déconnexion
            </button>
          </div>
        </aside>

        {/* Contenu principal */}
        <div className="lg:ml-64">
          {/* Top bar */}
          <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between sticky top-0 z-20">
            <h1 className="font-heading font-bold text-xl text-[#002060]">Tableau de bord</h1>
            <div className="flex items-center gap-3">
              <span className="text-sm text-[#666666]">{user?.email || 'Admin'}</span>
              <div className="w-10 h-10 bg-[#008751] rounded-full flex items-center justify-center text-white font-bold">
                {user?.name?.charAt(0) || 'A'}
              </div>
            </div>
          </header>

          {/* Stats */}
          <div className="p-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {dashboardStats.map((stat, index) => (
                <motion.div
                  key={index}
                  className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <div className="flex items-center justify-between mb-4">
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center"
                      style={{ backgroundColor: stat.color + '15' }}
                    >
                      <svg className="w-6 h-6" style={{ color: stat.color }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={stat.icon} />
                      </svg>
                    </div>
                    <span className="font-heading font-extrabold text-3xl" style={{ color: stat.color }}>
                      {stat.value}
                    </span>
                  </div>
                  <p className="text-sm text-[#666666] font-medium">{stat.title}</p>
                  <Link
                    to={stat.link}
                    className="text-xs text-[#008751] hover:underline mt-2 inline-block"
                  >
                    Gérer
                  </Link>
                </motion.div>
              ))}
            </div>

            {/* Activités récentes */}
            <div className="bg-white rounded-xl p-6 shadow-lg">
              <h2 className="font-heading font-bold text-lg text-[#002060] mb-4">Activités récentes</h2>
              <div className="space-y-3">
                {recentActivities.map((activity, index) => (
                  <div key={index} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
                    <div className="flex items-center gap-3">
                      <div className={`w-2 h-2 rounded-full ${
                        activity.type === 'message' ? 'bg-blue-500' :
                        activity.type === 'photo' ? 'bg-green-500' :
                        activity.type === 'article' ? 'bg-yellow-500' : 'bg-red-500'
                      }`} />
                      <span className="text-sm text-[#333333]">{activity.action}</span>
                    </div>
                    <span className="text-xs text-[#999999]">{activity.date}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}