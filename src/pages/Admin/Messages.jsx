import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { contactService } from '@services/judcdService';
import AdminLayout from '@components/admin/AdminLayout';
import { formatDateShort } from '@utils/formatters';

const Icon = ({ path, className = 'w-5 h-5' }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d={path} />
  </svg>
);

export default function AdminMessages() {
  const [messages, setMessages]       = useState([]);
  const [loading, setLoading]         = useState(true);
  const [error, setError]             = useState('');
  const [selected, setSelected]       = useState(null);
  const [search, setSearch]           = useState('');
  const [confirmId, setConfirmId]     = useState(null);

  useEffect(() => { load(); }, []);

  const load = async () => {
    setLoading(true);
    const res = await contactService.getMessages();
    if (res.success) {
      const body = res.data;
      setMessages(Array.isArray(body) ? body : (body?.results ?? []));
    } else {
      setError('Impossible de charger les messages.');
    }
    setLoading(false);
  };

  const handleSelect = async (msg) => {
    // Toggle ouverture/fermeture
    if (selected?.id === msg.id) { setSelected(null); return; }
    setSelected(msg);
    // Marquer comme lu si nécessaire (met à jour le badge de notifications)
    if (!msg.is_read) {
      const res = await contactService.markAsRead(msg.id);
      if (res.success) {
        setMessages(prev => prev.map(m => m.id === msg.id ? { ...m, is_read: true } : m));
      }
    }
  };

  const handleDelete = async (id) => {
    const res = await contactService.deleteMessage(id);
    if (res.success) {
      setMessages(prev => prev.filter(m => m.id !== id));
      if (selected?.id === id) setSelected(null);
    }
    setConfirmId(null);
  };

  const filtered = messages.filter(m =>
    !search ||
    (m.name || '').toLowerCase().includes(search.toLowerCase()) ||
    (m.email || '').toLowerCase().includes(search.toLowerCase()) ||
    (m.subject || m.sujet || '').toLowerCase().includes(search.toLowerCase())
  );

  return (
    <AdminLayout title="Messages">
      <Helmet><title>Messages — Administration JUDCD</title></Helmet>

      <div className="p-4 sm:p-6 space-y-5">

        {/* En-tête */}
        <div className="bg-white rounded-2xl border border-gray-100 px-6 py-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="font-heading font-bold text-xl text-gray-900">Messages de contact</h1>
            <p className="text-sm text-gray-400 mt-0.5">
              {messages.length} message{messages.length !== 1 ? 's' : ''} reçu{messages.length !== 1 ? 's' : ''}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative">
              <Icon path="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" className="w-4 h-4 text-gray-300 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Rechercher..."
                className="pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:border-[#008751] focus:ring-2 focus:ring-[#008751]/10 w-48 transition-all"
              />
            </div>
            <button onClick={load} className="flex items-center gap-1.5 px-3 py-2 text-sm text-gray-500 hover:text-[#008751] border border-gray-200 rounded-xl hover:border-[#008751]/30 transition-all">
              <Icon path="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" className="w-4 h-4" />
              Actualiser
            </button>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-100 rounded-xl px-5 py-3.5 text-sm text-red-600 flex items-center justify-between">
            <span>{error}</span>
            <button onClick={load} className="font-semibold underline">Réessayer</button>
          </div>
        )}

        {/* Contenu principal */}
        <div className="flex gap-5">
          {/* Liste */}
          <div className={`bg-white border border-gray-100 rounded-2xl overflow-hidden transition-all ${selected ? 'w-80 flex-shrink-0 hidden lg:block' : 'flex-1'}`}>
            {loading ? (
              <div className="p-5 space-y-3">
                {[1,2,3,4,5].map(i => (
                  <div key={i} className="animate-pulse flex gap-4 p-3">
                    <div className="w-10 h-10 bg-gray-100 rounded-full flex-shrink-0" />
                    <div className="flex-1 space-y-2">
                      <div className="h-3.5 bg-gray-100 rounded w-32" />
                      <div className="h-3 bg-gray-100 rounded w-48" />
                    </div>
                  </div>
                ))}
              </div>
            ) : filtered.length === 0 ? (
              <div className="py-20 text-center">
                <div className="w-14 h-14 bg-gray-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Icon path="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" className="w-6 h-6 text-gray-300" />
                </div>
                <p className="text-sm font-medium text-gray-400">
                  {search ? 'Aucun résultat' : 'Aucun message reçu'}
                </p>
              </div>
            ) : (
              <div className="divide-y divide-gray-50">
                {filtered.map((msg, i) => (
                  <motion.button
                    key={msg.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.04 }}
                    onClick={() => handleSelect(msg)}
                    className={`w-full text-left flex gap-4 px-5 py-4 hover:bg-gray-50 transition-colors ${selected?.id === msg.id ? 'bg-[#EEF2FF]' : ''} ${!msg.is_read ? 'bg-blue-50/30' : ''}`}
                  >
                    <div className="relative flex-shrink-0">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#002060] to-[#008751] flex items-center justify-center text-white font-bold text-sm">
                        {(msg.name || '?').charAt(0).toUpperCase()}
                      </div>
                      {!msg.is_read && (
                        <span className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-[#008751] rounded-full border-2 border-white" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <p className={`text-sm truncate ${!msg.is_read ? 'font-bold text-gray-900' : 'font-semibold text-gray-700'}`}>{msg.name || 'Inconnu'}</p>
                        <span className="text-[10px] text-gray-300 flex-shrink-0">{formatDateShort(msg.created_at)}</span>
                      </div>
                      <p className="text-xs text-gray-400 truncate mt-0.5">{msg.subject || msg.sujet || msg.email || ''}</p>
                      <p className="text-xs text-gray-300 truncate mt-0.5">{msg.message?.substring(0, 60)}...</p>
                    </div>
                  </motion.button>
                ))}
              </div>
            )}
          </div>

          {/* Détail */}
          <AnimatePresence>
            {selected && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="flex-1 bg-white border border-gray-100 rounded-2xl overflow-hidden"
              >
                {/* Header du détail */}
                <div className="px-6 py-5 border-b border-gray-50 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#002060] to-[#008751] flex items-center justify-center text-white font-bold">
                      {(selected.name || '?').charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">{selected.name}</p>
                      <p className="text-xs text-gray-400">{selected.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setConfirmId(selected.id)}
                      className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-red-500 bg-red-50 hover:bg-red-100 rounded-lg transition-colors"
                    >
                      <Icon path="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" className="w-3.5 h-3.5" />
                      Supprimer
                    </button>
                    <button onClick={() => setSelected(null)} className="w-8 h-8 rounded-lg hover:bg-gray-100 flex items-center justify-center text-gray-400">
                      <Icon path="M6 18L18 6M6 6l12 12" className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Corps du message */}
                <div className="p-6">
                  <div className="flex flex-wrap gap-3 mb-6">
                    {(selected.phone || selected.telephone) && (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gray-50 text-xs text-gray-500 rounded-lg">
                        <Icon path="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" className="w-3.5 h-3.5" />
                        {selected.phone || selected.telephone}
                      </span>
                    )}
                    {(selected.subject || selected.sujet) && (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#EEF2FF] text-xs text-[#002060] font-semibold rounded-lg">
                        {selected.subject || selected.sujet}
                      </span>
                    )}
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gray-50 text-xs text-gray-400 rounded-lg">
                      {formatDateShort(selected.created_at)}
                    </span>
                  </div>

                  <div className="bg-gray-50 rounded-xl p-5">
                    <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">{selected.message}</p>
                  </div>

                  <a
                    href={`mailto:${selected.email}`}
                    className="mt-5 inline-flex items-center gap-2 px-5 py-2.5 bg-[#002060] text-white text-sm font-semibold rounded-xl hover:bg-[#001540] transition-all"
                  >
                    <Icon path="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" className="w-4 h-4" />
                    Répondre par email
                  </a>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Modal confirmation suppression */}
      <AnimatePresence>
        {confirmId && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
            onClick={() => setConfirmId(null)}>
            <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }}
              className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-2xl" onClick={e => e.stopPropagation()}>
              <div className="w-12 h-12 bg-red-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Icon path="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" className="w-6 h-6 text-red-500" />
              </div>
              <h3 className="font-bold text-lg text-center text-gray-900 mb-2">Supprimer le message</h3>
              <p className="text-sm text-gray-400 text-center mb-6">Cette action est irréversible.</p>
              <div className="flex gap-3">
                <button onClick={() => setConfirmId(null)} className="flex-1 py-2.5 border border-gray-200 rounded-xl text-sm font-semibold text-gray-600 hover:bg-gray-50">Annuler</button>
                <button onClick={() => handleDelete(confirmId)} className="flex-1 py-2.5 bg-red-500 text-white rounded-xl text-sm font-semibold hover:bg-red-600">Supprimer</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </AdminLayout>
  );
}
