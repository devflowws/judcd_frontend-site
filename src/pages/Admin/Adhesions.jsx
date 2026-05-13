import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import AdminLayout from '@components/admin/AdminLayout';

export default function Adhesions() {
  const [adhesions, setAdhesions] = useState([]);
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedAdhesion, setSelectedAdhesion] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showActionModal, setShowActionModal] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [filter, setFilter] = useState('TOUT');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      
      // Charger les adhésions et les statistiques
      const [adhesionsRes, statsRes] = await Promise.all([
        fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1'}/admin/adhesions/`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('judcd_access_token')}`
          }
        }),
        fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1'}/admin/adhesions/statistiques/`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('judcd_access_token')}`
          }
        })
      ]);

      const adhesionsData = await adhesionsRes.json();
      const statsData = await statsRes.json();

      if (adhesionsData.success) {
        setAdhesions(adhesionsData.data || []);
      } else {
        setError('Erreur lors du chargement des adhésions');
      }

      if (statsData.success) {
        setStats(statsData.data || {});
      }
    } catch (err) {
      setError('Erreur de connexion au serveur');
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (adhesion, action, commentaires = '') => {
    setActionLoading(true);
    
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1'}/admin/adhesions/${adhesion.id}/action/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('judcd_access_token')}`
        },
        body: JSON.stringify({ action, commentaires })
      });

      const result = await response.json();

      if (result.success) {
        // Mettre à jour les données
        loadData();
        setShowActionModal(false);
        setSelectedAdhesion(null);
        
        // Afficher un message de succès
        alert(`Action "${action}" effectuée avec succès`);
      } else {
        setError(result.error?.detail || 'Erreur lors de l\'action');
      }
    } catch (err) {
      setError('Erreur de connexion au serveur');
    } finally {
      setActionLoading(false);
    }
  };

  const filteredAdhesions = adhesions.filter(adhesion => {
    const matchesFilter = filter === 'TOUT' || adhesion.statut === filter;
    const matchesSearch = searchTerm === '' || 
      adhesion.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
      adhesion.prenom.toLowerCase().includes(searchTerm.toLowerCase()) ||
      adhesion.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesFilter && matchesSearch;
  });

  const getStatColor = (key) => {
    const colors = {
      total_adhesions: 'bg-blue-500',
      adhesions_en_attente: 'bg-yellow-500',
      adhesions_approuvees: 'bg-green-500',
      adhesions_rejetees: 'bg-red-500',
      adhesions_valides: 'bg-purple-500'
    };
    return colors[key] || 'bg-gray-500';
  };

  const getStatusColor = (status) => {
    const colors = {
      'EN_ATTENTE': 'bg-yellow-100 text-yellow-800',
      'APPROUVEE': 'bg-green-100 text-green-800',
      'REJETEE': 'bg-red-100 text-red-800',
      'EXPIREE': 'bg-gray-100 text-gray-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getStatusText = (status) => {
    const texts = {
      'EN_ATTENTE': 'En attente',
      'APPROUVEE': 'Approuvée',
      'REJETEE': 'Rejetée',
      'EXPIREE': 'Expirée'
    };
    return texts[status] || status;
  };

  if (loading) {
    return (
      <AdminLayout title="Gestion des Adhésions">
        <Helmet>
          <title>Gestion des Adhésions - Administration JUDCD</title>
        </Helmet>
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="animate-spin w-10 h-10 border-3 border-[#008751] border-t-transparent rounded-full mx-auto"></div>
            <p className="text-gray-600 mt-4 font-medium">Chargement des adhésions...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Gestion des Adhésions">
      <Helmet>
        <title>Gestion des Adhésions - Administration JUDCD</title>
      </Helmet>

      <div className="p-4 sm:p-6 lg:p-8">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 rounded-xl p-4 mb-6">
            {error}
          </div>
        )}

        {/* Statistiques */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
          {[
            { key: 'total_adhesions', label: 'Total adhésions', value: stats.total_adhesions || 0 },
            { key: 'adhesions_en_attente', label: 'En attente', value: stats.adhesions_en_attente || 0 },
            { key: 'adhesions_approuvees', label: 'Approuvées', value: stats.adhesions_approuvees || 0 },
            { key: 'adhesions_valides', label: 'Valides', value: stats.adhesions_valides || 0 },
            { key: 'revenus_totaux', label: 'Revenus totaux', value: `${stats.revenus_totaux || 0} FCFA` }
          ].map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-xl p-6 shadow-lg border border-gray-100"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">{stat.label}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                </div>
                <div className={`w-12 h-12 ${getStatColor(stat.key)} rounded-full flex items-center justify-center text-white`}>
                  <span className="text-xl font-bold">{stat.value.toString().charAt(0)}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Filtres et recherche */}
        <div className="bg-white rounded-xl p-4 shadow-lg border border-gray-100 mb-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Rechercher par nom, prénom ou email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#008751] focus:border-transparent"
              />
            </div>
            <div className="flex gap-2">
              {['TOUT', 'EN_ATTENTE', 'APPROUVEE', 'REJETEE', 'EXPIREE'].map(status => (
                <button
                  key={status}
                  onClick={() => setFilter(status)}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    filter === status
                      ? 'bg-[#008751] text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {status === 'TOUT' ? 'Tout' : getStatusText(status)}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Tableau des adhésions */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Membre
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Contact
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date de demande
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Statut
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Validité
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredAdhesions.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="px-6 py-12 text-center text-gray-500">
                      <div className="text-5xl mb-4">📋</div>
                      <p className="text-lg font-medium">Aucune adhésion trouvée</p>
                      <p className="text-sm mt-2">
                        {searchTerm || filter !== 'TOUT' 
                          ? 'Essayez de modifier vos filtres de recherche' 
                          : 'Les nouvelles demandes d\'adhésion apparaîtront ici'}
                      </p>
                    </td>
                  </tr>
                ) : (
                  filteredAdhesions.map((adhesion, index) => (
                    <motion.tr
                      key={adhesion.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="hover:bg-gray-50"
                    >
                      <td className="px-6 py-4">
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {adhesion.prenom} {adhesion.nom}
                          </div>
                          <div className="text-sm text-gray-500">
                            {adhesion.profession}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900">{adhesion.email}</div>
                        <div className="text-sm text-gray-500">{adhesion.telephone}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900">
                          {format(new Date(adhesion.date_demande), 'dd MMM yyyy', { locale: fr })}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(adhesion.statut)}`}>
                          {getStatusText(adhesion.statut)}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        {adhesion.date_expiration ? (
                          <div>
                            <div className="text-sm text-gray-900">
                              {format(new Date(adhesion.date_expiration), 'dd MMM yyyy', { locale: fr })}
                            </div>
                            <div className="text-sm text-gray-500">
                              {adhesion.jours_restants > 0 
                                ? `${adhesion.jours_restants} jours restants`
                                : 'Expirée'
                              }
                            </div>
                          </div>
                        ) : (
                          <span className="text-sm text-gray-500">Non définie</span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => {
                              setSelectedAdhesion(adhesion);
                              setShowDetailModal(true);
                            }}
                            className="text-[#008751] hover:text-[#006B41] font-medium text-sm"
                          >
                            Voir
                          </button>
                          {adhesion.statut === 'EN_ATTENTE' && (
                            <>
                              <button
                                onClick={() => {
                                  setSelectedAdhesion(adhesion);
                                  setShowActionModal(true);
                                }}
                                className="text-green-600 hover:text-green-700 font-medium text-sm"
                              >
                                Approuver
                              </button>
                              <button
                                onClick={() => {
                                  if (confirm('Êtes-vous sûr de vouloir rejeter cette adhésion ?')) {
                                    handleAction(adhesion, 'REJETER');
                                  }
                                }}
                                className="text-red-600 hover:text-red-700 font-medium text-sm"
                              >
                                Rejeter
                              </button>
                            </>
                          )}
                          {adhesion.statut === 'APPROUVEE' && adhesion.jours_restants < 30 && (
                            <button
                              onClick={() => {
                                if (confirm('Êtes-vous sûr de vouloir renouveler cette adhésion ?')) {
                                  handleAction(adhesion, 'RENOUVELER');
                                }
                              }}
                              className="text-blue-600 hover:text-blue-700 font-medium text-sm"
                            >
                              Renouveler
                            </button>
                          )}
                        </div>
                      </td>
                    </motion.tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Modal de détails */}
      {showDetailModal && selectedAdhesion && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-6">
                <h3 className="text-xl font-bold text-gray-900">
                  Détails de l'adhésion
                </h3>
                <button
                  onClick={() => setShowDetailModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>
              
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Nom complet</p>
                    <p className="font-medium">{selectedAdhesion.prenom} {selectedAdhesion.nom}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Email</p>
                    <p className="font-medium">{selectedAdhesion.email}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Téléphone</p>
                    <p className="font-medium">{selectedAdhesion.telephone}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Profession</p>
                    <p className="font-medium">{selectedAdhesion.profession}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Date de naissance</p>
                    <p className="font-medium">{selectedAdhesion.date_naissance}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Lieu de naissance</p>
                    <p className="font-medium">{selectedAdhesion.lieu_naissance}</p>
                  </div>
                </div>
                
                <div>
                  <p className="text-sm text-gray-500">Adresse</p>
                  <p className="font-medium">{selectedAdhesion.adresse}</p>
                </div>
                
                <div>
                  <p className="text-sm text-gray-500">Motivations</p>
                  <p className="font-medium">{selectedAdhesion.motivations}</p>
                </div>
                
                {selectedAdhesion.competences && (
                  <div>
                    <p className="text-sm text-gray-500">Compétences</p>
                    <p className="font-medium">{selectedAdhesion.competences}</p>
                  </div>
                )}
                
                <div>
                  <p className="text-sm text-gray-500">Montant payé</p>
                  <p className="font-medium">{selectedAdhesion.montant_paye} FCFA</p>
                </div>
                
                {selectedAdhesion.capture_depot && (
                  <div>
                    <p className="text-sm text-gray-500">Preuve de paiement</p>
                    <img 
                      src={selectedAdhesion.capture_depot} 
                      alt="Preuve de paiement" 
                      className="w-full max-w-xs rounded-lg border"
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal d'action */}
      {showActionModal && selectedAdhesion && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full">
            <div className="p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                Approuver l'adhésion
              </h3>
              <p className="text-gray-600 mb-6">
                Vous allez approuver l'adhésion de {selectedAdhesion.prenom} {selectedAdhesion.nom}.
                Cette action enverra un email de confirmation au membre.
              </p>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Commentaires (optionnel)
                </label>
                <textarea
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#008751] focus:border-transparent"
                  rows="3"
                  placeholder="Ajoutez des commentaires..."
                />
              </div>
              
              <div className="flex gap-3">
                <button
                  onClick={() => setShowActionModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                >
                  Annuler
                </button>
                <button
                  onClick={() => handleAction(selectedAdhesion, 'APPROUVER')}
                  disabled={actionLoading}
                  className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
                >
                  {actionLoading ? 'Traitement...' : 'Approuver'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
