import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { ASSETS, ASSOCIATION } from '@utils/constants';
import { useAuth } from '@context/AuthContext';
import { useDonationAdmin } from '@hooks/useDonation';
import { Spinner, EmptyState } from '@components/ui/Loader/Loader';
import { ConfirmModal } from '@components/ui/Modal/Modal';
import { formatDateShort, formatPrice } from '@utils/formatters';

export default function AdminDonations() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const {
    donations,
    isLoading,
    stats,
    fetchDonations,
    handleConfirm,
    handleReject,
  } = useDonationAdmin();

  const [selectedDonation, setSelectedDonation] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [actionDonation, setActionDonation] = useState(null);
  const [filter, setFilter] = useState('all');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    fetchDonations();
  }, []);

  const openDetail = (donation) => {
    setSelectedDonation(donation);
    setShowDetailModal(true);
  };

  const openConfirm = (donation) => {
    setActionDonation(donation);
    setNotes('');
    setShowConfirmModal(true);
  };

  const openReject = (donation) => {
    setActionDonation(donation);
    setNotes('');
    setShowRejectModal(true);
  };

  const executeConfirm = async () => {
    if (actionDonation) {
      await handleConfirm(actionDonation.id, notes);
    }
    setShowConfirmModal(false);
    setActionDonation(null);
  };

  const executeReject = async () => {
    if (actionDonation) {
      await handleReject(actionDonation.id, notes);
    }
    setShowRejectModal(false);
    setActionDonation(null);
  };

  const handleLogout = async () => {
    await logout();
    navigate('/admin/login');
  };

  const filteredDonations = donations.filter(d => {
    if (filter === 'pending') return d.status === 'pending';
    if (filter === 'confirmed') return d.status === 'confirmed';
    if (filter === 'rejected') return d.status === 'rejected';
    return true;
  });

  const filters = [
    { value: 'all', label: 'Tous' },
    { value: 'pending', label: 'En attente' },
    { value: 'confirmed', label: 'Confirmés' },
    { value: 'rejected', label: 'Rejetés' },
  ];

  const statusColors = {
    pending: { bg: 'bg-yellow-100', text: 'text-yellow-700', label: 'En attente' },
    confirmed: { bg: 'bg-green-100', text: 'text-green-700', label: 'Confirmé' },
    rejected: { bg: 'bg-red-100', text: 'text-red-700', label: 'Rejeté' },
  };

  return (
    <>
      <Helmet>
        <title>Dons - Administration JUDCD</title>
      </Helmet>

      <div className="min-h-screen bg-[#F8FAF9]">
        <AdminSidebar currentPath={location.pathname} onLogout={handleLogout} />

        <div className="lg:ml-64">
          <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between sticky top-0 z-20">
            <h1 className="font-heading font-bold text-xl text-[#002060]">Gestion des dons</h1>
            <div className="w-10 h-10 bg-[#008751] rounded-full flex items-center justify-center text-white font-bold">
              A
            </div>
          </header>

          <div className="p-6">
            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              {[
                { label: 'Total dons', value: stats.totalDonations, color: '#002060' },
                { label: 'Montant total', value: formatPrice(stats.totalAmount), color: '#008751' },
                { label: 'Confirmés', value: stats.confirmedCount, color: '#16A34A' },
                { label: 'En attente', value: stats.pendingCount, color: '#FFD100' },
              ].map((stat, index) => (
                <div key={index} className="bg-white rounded-xl p-4 shadow-lg text-center">
                  <p className="font-heading font-extrabold text-2xl" style={{ color: stat.color }}>
                    {stat.value}
                  </p>
                  <p className="text-xs text-[#666666] mt-1">{stat.label}</p>
                </div>
              ))}
            </div>

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
                </button>
              ))}
            </div>

            {/* Liste des dons */}
            {isLoading ? (
              <div className="flex justify-center py-20"><Spinner size="lg" /></div>
            ) : filteredDonations.length === 0 ? (
              <EmptyState
                title="Aucun don"
                description="Aucun don reçu pour le moment."
              />
            ) : (
              <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-200">
                      <tr>
                        <th className="text-left px-6 py-4 text-xs font-semibold text-[#666666] uppercase">Donateur</th>
                        <th className="text-left px-6 py-4 text-xs font-semibold text-[#666666] uppercase">Montant</th>
                        <th className="text-left px-6 py-4 text-xs font-semibold text-[#666666] uppercase hidden md:table-cell">Méthode</th>
                        <th className="text-left px-6 py-4 text-xs font-semibold text-[#666666] uppercase hidden lg:table-cell">Date</th>
                        <th className="text-left px-6 py-4 text-xs font-semibold text-[#666666] uppercase">Statut</th>
                        <th className="text-right px-6 py-4 text-xs font-semibold text-[#666666] uppercase">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {filteredDonations.map((donation) => {
                        const statusStyle = statusColors[donation.status] || statusColors.pending;
                        return (
                          <tr key={donation.id} className="hover:bg-gray-50 transition-colors cursor-pointer" onClick={() => openDetail(donation)}>
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-3">
                                <div className="w-9 h-9 rounded-full bg-[#008751]/10 flex items-center justify-center flex-shrink-0">
                                  <span className="text-[#008751] font-bold text-xs">
                                    {donation.full_name?.charAt(0)?.toUpperCase() || '?'}
                                  </span>
                                </div>
                                <div>
                                  <p className="font-semibold text-sm text-[#333333]">{donation.full_name}</p>
                                  <p className="text-xs text-[#999999]">{donation.email}</p>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <span className="font-heading font-bold text-[#008751]">{formatPrice(donation.amount)}</span>
                            </td>
                            <td className="px-6 py-4 hidden md:table-cell">
                              <span className="text-sm text-[#666666]">
                                {donation.payment_method === 'mobile_money' ? 'Mobile Money' : 'Virement bancaire'}
                              </span>
                            </td>
                            <td className="px-6 py-4 hidden lg:table-cell">
                              <span className="text-sm text-[#666666]">{formatDateShort(donation.created_at)}</span>
                            </td>
                            <td className="px-6 py-4">
                              <span className={`inline-flex px-2 py-1 rounded-full text-xs font-semibold ${statusStyle.bg} ${statusStyle.text}`}>
                                {statusStyle.label}
                              </span>
                            </td>
                            <td className="px-6 py-4 text-right" onClick={(e) => e.stopPropagation()}>
                              {donation.status === 'pending' && (
                                <div className="flex items-center justify-end gap-1">
                                  <button
                                    onClick={() => openConfirm(donation)}
                                    className="w-8 h-8 rounded-lg bg-green-50 text-green-600 hover:bg-green-100 flex items-center justify-center"
                                    title="Confirmer"
                                  >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                  </button>
                                  <button
                                    onClick={() => openReject(donation)}
                                    className="w-8 h-8 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 flex items-center justify-center"
                                    title="Rejeter"
                                  >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                  </button>
                                </div>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modal détail */}
      <AnimatePresence>
        {showDetailModal && selectedDonation && (
          <motion.div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <motion.div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg" initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }}>
              <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                <h3 className="font-heading font-bold text-lg text-[#002060]">Détail du don</h3>
                <button onClick={() => setShowDetailModal(false)} className="w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <div className="p-6 space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div><p className="text-[#999999]">Donateur</p><p className="font-semibold">{selectedDonation.full_name}</p></div>
                  <div><p className="text-[#999999]">Montant</p><p className="font-heading font-bold text-[#008751] text-lg">{formatPrice(selectedDonation.amount)}</p></div>
                  <div><p className="text-[#999999]">Email</p><p className="text-[#333333]">{selectedDonation.email}</p></div>
                  <div><p className="text-[#999999]">Méthode</p><p className="text-[#333333]">{selectedDonation.payment_method === 'mobile_money' ? 'Mobile Money' : 'Virement'}</p></div>
                  <div><p className="text-[#999999]">Date</p><p className="text-[#333333]">{formatDateShort(selectedDonation.created_at)}</p></div>
                  <div><p className="text-[#999999]">Statut</p><span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-semibold ${(statusColors[selectedDonation.status] || statusColors.pending).bg} ${(statusColors[selectedDonation.status] || statusColors.pending).text}`}>{(statusColors[selectedDonation.status] || statusColors.pending).label}</span></div>
                </div>
                {selectedDonation.message && (
                  <div className="bg-gray-50 rounded-xl p-4">
                    <p className="text-xs text-[#999999] mb-1">Message</p>
                    <p className="text-sm text-[#333333]">{selectedDonation.message}</p>
                  </div>
                )}
              </div>
              <div className="p-6 border-t border-gray-100 flex justify-end">
                <button onClick={() => setShowDetailModal(false)} className="px-5 py-2 bg-[#008751] text-white rounded-lg text-sm font-semibold hover:bg-[#006B41]">Fermer</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modal confirmation */}
      <AnimatePresence>
        {showConfirmModal && (
          <motion.div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <motion.div className="bg-white rounded-2xl shadow-2xl w-full max-w-md" initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }}>
              <div className="p-6 border-b border-gray-100">
                <h3 className="font-heading font-bold text-lg text-[#002060]">Confirmer le don</h3>
              </div>
              <div className="p-6">
                <p className="text-sm text-[#666666] mb-4">Confirmer le don de <strong>{formatPrice(actionDonation?.amount)}</strong> de <strong>{actionDonation?.full_name}</strong> ?</p>
                <textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows="2" className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm resize-none" placeholder="Notes (optionnel)" />
              </div>
              <div className="p-6 border-t border-gray-100 flex justify-end gap-3">
                <button onClick={() => setShowConfirmModal(false)} className="px-5 py-2 border border-gray-300 text-[#333333] rounded-lg text-sm">Annuler</button>
                <button onClick={executeConfirm} className="px-5 py-2 bg-green-600 text-white rounded-lg text-sm font-semibold hover:bg-green-700">Confirmer</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modal rejet */}
      <AnimatePresence>
        {showRejectModal && (
          <motion.div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <motion.div className="bg-white rounded-2xl shadow-2xl w-full max-w-md" initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }}>
              <div className="p-6 border-b border-gray-100">
                <h3 className="font-heading font-bold text-lg text-[#002060]">Rejeter le don</h3>
              </div>
              <div className="p-6">
                <p className="text-sm text-[#666666] mb-4">Rejeter le don de <strong>{formatPrice(actionDonation?.amount)}</strong> de <strong>{actionDonation?.full_name}</strong> ?</p>
                <textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows="2" className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm resize-none" placeholder="Raison du rejet (optionnel)" />
              </div>
              <div className="p-6 border-t border-gray-100 flex justify-end gap-3">
                <button onClick={() => setShowRejectModal(false)} className="px-5 py-2 border border-gray-300 text-[#333333] rounded-lg text-sm">Annuler</button>
                <button onClick={executeReject} className="px-5 py-2 bg-red-600 text-white rounded-lg text-sm font-semibold hover:bg-red-700">Rejeter</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
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