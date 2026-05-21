import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { contactService } from '@services/judcdService';
import AdminLayout from '@components/admin/AdminLayout';

export default function AdminMessages() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadMessages();
  }, []);

  const loadMessages = async () => {
    try {
      setLoading(true);
      const response = await contactService.getMessages();
      if (response.success) {
        setMessages(response.data || []);
      } else {
        setError('Erreur lors du chargement des messages');
      }
    } catch (err) {
      setError('Erreur de connexion au serveur');
    } finally {
      setLoading(false);
    }
  };

  const deleteMessage = async (id) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce message ?')) return;
    
    try {
      const response = await contactService.deleteMessage(id);
      if (response.success) {
        setMessages(messages.filter(msg => msg.id !== id));
      } else {
        setError('Erreur lors de la suppression');
      }
    } catch (err) {
      setError('Erreur de connexion au serveur');
    }
  };

  return (
    <AdminLayout title="Messages de contact">
      <Helmet>
        <title>Messages - Administration JUDCD</title>
      </Helmet>

      <div className="p-4 sm:p-6 lg:p-8">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 rounded-xl p-4 mb-6">
              {error}
            </div>
          )}

          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin w-8 h-8 border-2 border-[#008751] border-t-transparent rounded-full mx-auto"></div>
              <p className="text-[#666666] mt-4">Chargement des messages...</p>
            </div>
          ) : messages.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-xl shadow-lg">
              <div className="text-6xl mb-4">📧</div>
              <h3 className="font-heading font-bold text-lg text-[#002060] mb-2">Aucun message</h3>
              <p className="text-[#666666]">Vous n'avez reçu aucun message pour le moment.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-4 mb-2">
                        <h3 className="font-heading font-bold text-lg text-[#002060]">{message.name}</h3>
                        <span className="text-sm text-[#999999]">{message.date}</span>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-[#666666] mb-3">
                        <span>📧 {message.email}</span>
                        <span>📱 {message.telephone}</span>
                      </div>
                      <div className="mb-3">
                        <span className="inline-block px-3 py-1 bg-[#002060]/10 text-[#002060] rounded-lg text-sm font-medium">
                          {message.sujet}
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={() => deleteMessage(message.id)}
                      className="text-red-500 hover:text-red-700 transition-colors"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-[#333333] whitespace-pre-wrap">{message.message}</p>
                  </div>
                </motion.div>
              ))}
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
