import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { donationService } from '@services/judcdService';
import AdminLayout from '@components/admin/AdminLayout';

export default function AdminDonations() {
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [stats, setStats] = useState({ total: 0, amount: 0 });

  useEffect(() => {
    loadDonations();
  }, []);

  const loadDonations = async () => {
    try {
      setLoading(true);
      const response = await donationService.getDonations();
      if (response.success) {
        const donationsData = response.data || [];
        setDonations(donationsData);
        
        // Calculer les statistiques
        const totalAmount = donationsData.reduce((sum, donation) => {
          return sum + parseFloat(donation.montant || 0);
        }, 0);
        
        setStats({
          total: donationsData.length,
          amount: totalAmount
        });
      } else {
        setError('Erreur lors du chargement des dons');
      }
    } catch (err) {
      setError('Erreur de connexion au serveur');
    } finally {
      setLoading(false);
    }
  };

  const deleteDonation = async (id) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce don ?')) return;
    
    try {
      const response = await donationService.deleteDonation(id);
      if (response.success) {
        const updatedDonations = donations.filter(don => don.id !== id);
        setDonations(updatedDonations);
        
        // Recalculer les statistiques
        const totalAmount = updatedDonations.reduce((sum, donation) => {
          return sum + parseFloat(donation.montant || 0);
        }, 0);
        
        setStats({
          total: updatedDonations.length,
          amount: totalAmount
        });
      } else {
        setError('Erreur lors de la suppression');
      }
    } catch (err) {
      setError('Erreur de connexion au serveur');
    }
  };

  return (
    <AdminLayout title="Dons reçus">
      <Helmet>
        <title>Dons - Administration JUDCD</title>
      </Helmet>

      <div className="p-4 sm:p-6 lg:p-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-xl shadow-lg p-6"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-[#666666] font-medium">Total des dons</p>
                  <p className="font-heading font-extrabold text-3xl text-[#008751]">{stats.total}</p>
                </div>
                <div className="w-12 h-12 bg-[#008751]/15 rounded-xl flex items-center justify-center">
                  <svg className="w-6 h-6 text-[#008751]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-xl shadow-lg p-6"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-[#666666] font-medium">Montant total</p>
                  <p className="font-heading font-extrabold text-3xl text-[#002060]">{stats.amount.toLocaleString()} FCFA</p>
                </div>
                <div className="w-12 h-12 bg-[#002060]/15 rounded-xl flex items-center justify-center">
                  <svg className="w-6 h-6 text-[#002060]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
            </motion.div>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 rounded-xl p-4 mb-6">
              {error}
            </div>
          )}

          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin w-8 h-8 border-2 border-[#008751] border-t-transparent rounded-full mx-auto"></div>
              <p className="text-[#666666] mt-4">Chargement des dons...</p>
            </div>
          ) : donations.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-xl shadow-lg">
              <div className="text-6xl mb-4">💝</div>
              <h3 className="font-heading font-bold text-lg text-[#002060] mb-2">Aucun don</h3>
              <p className="text-[#666666]">Vous n'avez reçu aucun don pour le moment.</p>
            </div>
          ) : (
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-[#002060] text-white">
                    <tr>
                      <th className="px-6 py-4 text-left text-sm font-medium">Nom</th>
                      <th className="px-6 py-4 text-left text-sm font-medium">Email</th>
                      <th className="px-6 py-4 text-left text-sm font-medium">Montant</th>
                      <th className="px-6 py-4 text-left text-sm font-medium">Moyen</th>
                      <th className="px-6 py-4 text-left text-sm font-medium">Date</th>
                      <th className="px-6 py-4 text-left text-sm font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {donations.map((donation, index) => (
                      <motion.tr
                        key={donation.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="hover:bg-gray-50"
                      >
                        <td className="px-6 py-4">
                          <div>
                            <p className="font-medium text-[#333333]">{donation.nom}</p>
                            {donation.message && (
                              <p className="text-sm text-[#666666] mt-1 line-clamp-2">{donation.message}</p>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-[#666666]">{donation.email}</td>
                        <td className="px-6 py-4">
                          <span className="font-heading font-bold text-lg text-[#008751]">
                            {parseFloat(donation.montant).toLocaleString()} FCFA
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className="inline-block px-3 py-1 bg-[#002060]/10 text-[#002060] rounded-lg text-sm">
                            {donation.moyen_paiement}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-[#666666]">
                          {new Date(donation.created_at).toLocaleDateString('fr-TG')}
                        </td>
                        <td className="px-6 py-4">
                          <button
                            onClick={() => deleteDonation(donation.id)}
                            className="text-red-500 hover:text-red-700 transition-colors"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
      </div>
    </AdminLayout>
  );
}
