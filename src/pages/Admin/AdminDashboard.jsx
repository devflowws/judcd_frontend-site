import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { ASSOCIATION } from '@utils/constants';
import AdminLayout from '@components/admin/AdminLayout';
import { Spinner } from '@components/ui/Loader/Loader';
import { formatDateShort, formatPrice } from '@utils/formatters';

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [recentActivities, setRecentActivities] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1';
  const token = localStorage.getItem('judcd_access_token');

  useEffect(() => {
    loadAllData();
  }, []);

  const loadAllData = async () => {
    setIsLoading(true);
    setError('');

    try {
      const headers = { 'Authorization': `Bearer ${token}` };

      // Charger toutes les données en parallèle
      const [adhesionStats, messagesRes, donationsRes, actionsRes] = await Promise.allSettled([
        fetch(`${apiUrl}/admin/adhesions/statistiques/`, { headers }),
        fetch(`${apiUrl}/contact/?page_size=5`, { headers }),
        fetch(`${apiUrl}/don/?page_size=5`, { headers }),
        fetch(`${apiUrl}/action/?page_size=5`, { headers }),
      ]);

      let adhesionData = null;
      if (adhesionStats.status === 'fulfilled' && adhesionStats.value.ok) {
        const data = await adhesionStats.value.json();
        if (data.success) adhesionData = data.data;
      }

      // Traiter les messages
      let messages = [];
      if (messagesRes.status === 'fulfilled' && messagesRes.value.ok) {
        const data = await messagesRes.value.json();
        messages = data.results || data.data || [];
      }

      // Traiter les dons
      let donations = [];
      if (donationsRes.status === 'fulfilled' && donationsRes.value.ok) {
        const data = await donationsRes.value.json();
        donations = data.results || data.data || [];
      }

      // Traiter les actions
      let actions = [];
      if (actionsRes.status === 'fulfilled' && actionsRes.value.ok) {
        const data = await actionsRes.value.json();
        actions = data.results || data.data || [];
      }

      // Construire les statistiques
      setStats({
        totalAdhesions: adhesionData?.total_adhesions || 0,
        enAttente: adhesionData?.adhesions_en_attente || 0,
        approuvees: adhesionData?.adhesions_approuvees || 0,
        revenusTotaux: adhesionData?.revenus_totaux || 0,
        messages: messages.length || 0,
        donations: donations.length || 0,
        actions: actions.length || 0,
        totalDonationsAmount: donations.reduce((sum, d) => sum + parseFloat(d.montant || 0), 0),
      });

      // Construire les activités récentes
      const activities = [
        ...messages.slice(0, 3).map(msg => ({
          action: `Nouveau message de ${msg.name || msg.nom || 'Inconnu'}`,
          date: msg.created_at || msg.date_demande,
          type: 'message',
        })),
        ...donations.slice(0, 2).map(don => ({
          action: `Don reçu : ${formatPrice(parseFloat(don.montant || 0))}`,
          date: don.created_at || don.date_demande,
          type: 'don',
        })),
        ...actions.slice(0, 2).map(act => ({
          action: `Action : ${act.titre || act.title || 'Sans titre'}`,
          date: act.created_at || act.date_demande,
          type: 'action',
        })),
      ]
        .sort((a, b) => new Date(b.date) - new Date(a.date))
        .slice(0, 5);

      setRecentActivities(activities);
    } catch (err) {
      setError('Erreur lors du chargement des données.');
    } finally {
      setIsLoading(false);
    }
  };

  const dashboardStats = stats ? [
    {
      title: 'Adhesions totales',
      value: stats.totalAdhesions.toString(),
      icon: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z',
      color: '#002060',
      link: '/admin/adhesions',
    },
    {
      title: 'En attente',
      value: stats.enAttente.toString(),
      icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z',
      color: '#FFD100',
      link: '/admin/adhesions',
    },
    {
      title: 'Messages recus',
      value: stats.messages.toString(),
      icon: 'M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z',
      color: '#008751',
      link: '/admin/messages',
    },
    {
      title: 'Revenus totaux',
      value: formatPrice(stats.revenusTotaux),
      icon: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
      color: '#D21034',
      link: '/admin/dons',
    },
  ] : [];

  const quickLinks = [
    { path: '/admin/galerie', label: 'Galerie', color: '#008751', icon: 'M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z' },
    { path: '/admin/blog', label: 'Blog', color: '#002060', icon: 'M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z' },
    { path: '/admin/messages', label: 'Messages', color: '#FFD100', icon: 'M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z' },
    { path: '/admin/dons', label: 'Dons', color: '#D21034', icon: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z' },
    { path: '/admin/adhesions', label: 'Adhesions', color: '#008751', icon: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z' },
  ];

  return (
    <AdminLayout title="Tableau de bord">
      <Helmet>
        <title>Tableau de bord - Administration {ASSOCIATION.name}</title>
      </Helmet>

      <div className="p-4 sm:p-6">
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-red-50 border border-red-200 text-red-600 rounded-xl p-4 mb-6 text-sm"
          >
            <div className="flex items-center justify-between">
              <span>{error}</span>
              <button onClick={loadAllData} className="ml-4 text-red-700 underline text-sm hover:text-red-800">
                Reessayer
              </button>
            </div>
          </motion.div>
        )}

        {isLoading ? (
          <div className="flex justify-center py-20">
            <Spinner size="lg" />
          </div>
        ) : (
          <>
            {/* Stats principales */}
            {dashboardStats.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
                {dashboardStats.map((stat, index) => (
                  <motion.div
                    key={index}
                    className="bg-white rounded-xl p-5 sm:p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center" style={{ backgroundColor: stat.color + '15' }}>
                        <svg className="w-5 h-5 sm:w-6 sm:h-6" style={{ color: stat.color }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={stat.icon} />
                        </svg>
                      </div>
                      <span className="font-heading font-extrabold text-xl sm:text-2xl lg:text-3xl truncate ml-2" style={{ color: stat.color }}>
                        {stat.value}
                      </span>
                    </div>
                    <p className="text-sm text-[#666666] font-medium">{stat.title}</p>
                    <Link to={stat.link} className="text-xs text-[#008751] hover:underline mt-2 inline-block font-medium">
                      Gerer
                    </Link>
                  </motion.div>
                ))}
              </div>
            )}

            {/* Liens rapides */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4 mb-8">
              {quickLinks.map((link, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + index * 0.05 }}
                >
                  <Link
                    to={link.path}
                    className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 hover:shadow-md transition-all text-center block group"
                  >
                    <div className="w-8 h-8 sm:w-10 sm:h-10 mx-auto mb-2 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform" style={{ backgroundColor: link.color + '15' }}>
                      <svg className="w-4 h-4 sm:w-5 sm:h-5" style={{ color: link.color }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={link.icon} />
                      </svg>
                    </div>
                    <span className="text-xs sm:text-sm font-medium text-[#333333]">{link.label}</span>
                  </Link>
                </motion.div>
              ))}
            </div>

            {/* Activites recentes */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-white rounded-xl shadow-sm border border-gray-100"
            >
              <div className="p-4 sm:p-6 border-b border-gray-100">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <h2 className="font-heading font-bold text-lg text-[#002060]">Activites recentes</h2>
                  <button onClick={loadAllData} className="text-sm text-[#008751] hover:text-[#006B41] font-medium flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    Actualiser
                  </button>
                </div>
              </div>
              <div className="p-4 sm:p-6">
                {recentActivities.length === 0 ? (
                  <div className="text-center py-8">
                    <div className="w-12 h-12 mx-auto mb-3 bg-gray-100 rounded-full flex items-center justify-center">
                      <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                      </svg>
                    </div>
                    <p className="text-[#666666] font-medium">Aucune activite recente</p>
                    <p className="text-sm text-[#999999] mt-2">Les nouvelles activites apparaitront ici</p>
                  </div>
                ) : (
                  <div className="space-y-1">
                    {recentActivities.map((activity, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.6 + index * 0.1 }}
                        className="flex items-center justify-between py-3 px-3 sm:px-4 rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <div className={`w-2 h-2 rounded-full flex-shrink-0 ${
                            activity.type === 'message' ? 'bg-blue-500' :
                            activity.type === 'don' ? 'bg-red-500' :
                            activity.type === 'action' ? 'bg-green-500' : 'bg-yellow-500'
                          }`} />
                          <span className="text-sm text-[#333333] font-medium truncate">{activity.action}</span>
                        </div>
                        <span className="text-xs text-[#999999] flex-shrink-0 ml-2">
                          {formatDateShort(activity.date)}
                        </span>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </div>
    </AdminLayout>
  );
}