import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { ASSOCIATION } from '@utils/constants';
import { useAuth } from '@context/AuthContext';
import { get } from '@services/api';
import { API } from '@utils/constants';
import AdminLayout from '@components/admin/AdminLayout';
import { formatPrice, formatDateShort } from '@utils/formatters';

const Icon = ({ path, className = 'w-5 h-5', style }) => (
  <svg className={className} style={style} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d={path} />
  </svg>
);

const ICONS = {
  members:  'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z',
  pending:  'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z',
  messages: 'M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z',
  revenue:  'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
  gallery:  'M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z',
  blog:     'M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z',
  actions:  'M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
  team:     'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z',
  partners: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z',
  testimonial: 'M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z',
  newsletter: 'M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z',
  refresh:  'M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15',
  arrow:    'M17 8l4 4m0 0l-4 4m4-4H3',
  check:    'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z',
  trend:    'M13 7h8m0 0v8m0-8l-8 8-4-4-6 6',
};

const asArray = (x) => (Array.isArray(x) ? x : (x?.results || x?.data || []));

export default function AdminDashboard() {
  const { user } = useAuth();
  const [data, setData]       = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState('');
  const [lastUpdated, setLastUpdated] = useState(null);

  useEffect(() => { loadAll(); }, []);

  const loadAll = async () => {
    setLoading(true);
    setError('');
    try {
      const [adhStats, messages, dons, actions, galerie, team, partenaires, temoignages, newsletter, actualites] =
        await Promise.all([
          get(API.endpoints.admin.adhesionStats),
          get(API.endpoints.admin.contact),
          get(API.endpoints.admin.dons),
          get(API.endpoints.admin.actions),
          get(API.endpoints.admin.galerie),
          get(API.endpoints.admin.team),
          get(API.endpoints.admin.partenaires),
          get(API.endpoints.admin.temoignages),
          get(API.endpoints.admin.newsletter),
          get(API.endpoints.admin.actualites),
        ]);

      const msgs   = asArray(messages.data);
      const donsA  = asArray(dons.data);
      const actsA  = asArray(actions.data);
      const galA   = asArray(galerie.data);
      const teamA  = asArray(team.data);
      const partA  = asArray(partenaires.data);
      const temoA  = asArray(temoignages.data);
      const newsA  = asArray(newsletter.data);
      const actuA  = asArray(actualites.data);

      // stats adhésions : {success, data:{...}}
      const adh = adhStats.data?.success ? adhStats.data.data : (adhStats.data || {});

      setData({
        adhesions: {
          total:    adh.total_adhesions || 0,
          attente:  adh.adhesions_en_attente || 0,
          approuvees: adh.adhesions_approuvees || 0,
          valides:  adh.adhesions_valides || 0,
          revenus:  adh.revenus_totaux || 0,
        },
        counts: {
          messages:    msgs.length,
          messagesNonLus: msgs.filter(m => !m.is_read).length,
          dons:        donsA.length,
          donsTotal:   donsA.reduce((s, d) => s + parseFloat(d.montant || 0), 0),
          actions:     actsA.length,
          galerie:     galA.length,
          team:        teamA.length,
          partenaires: partA.length,
          temoignages: temoA.length,
          newsletter:  newsA.length,
          actualites:  actuA.length,
        },
        activity: buildActivity(msgs, donsA, actsA, actuA),
      });
      setLastUpdated(new Date());
    } catch {
      setError('Erreur lors du chargement des données.');
    } finally {
      setLoading(false);
    }
  };

  const buildActivity = (msgs, dons, acts, actus) => [
    ...msgs.slice(0, 4).map(m => ({ label: `Message de ${m.name || m.nom || 'Inconnu'}`, sub: m.subject || m.sujet || m.email || '', date: m.created_at, type: 'message' })),
    ...dons.slice(0, 3).map(d => ({ label: `Don de ${formatPrice(parseFloat(d.montant || 0))}`, sub: d.nom || d.email || '', date: d.created_at, type: 'don' })),
    ...acts.slice(0, 2).map(a => ({ label: a.titre || 'Action communautaire', sub: a.lieu || '', date: a.created_at, type: 'action' })),
    ...actus.slice(0, 2).map(a => ({ label: `Article : ${a.titre || ''}`, sub: a.type_actualite_details?.nom || 'Actualité', date: a.date, type: 'article' })),
  ].filter(a => a.date).sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 6);

  const greeting = () => {
    const h = new Date().getHours();
    return h < 12 ? 'Bonjour' : h < 18 ? 'Bon après-midi' : 'Bonsoir';
  };
  const userName = user?.first_name || user?.username?.split('@')[0] || 'Admin';

  const d = data || { adhesions: {}, counts: {}, activity: [] };

  const statCards = [
    { title: 'Adhésions totales', value: d.adhesions.total || 0,        icon: ICONS.members,  accent: '#002060', bg: '#EEF2FF', link: '/admin/adhesions' },
    { title: 'En attente',        value: d.adhesions.attente || 0,      icon: ICONS.pending,  accent: '#D97706', bg: '#FEF3C7', link: '/admin/adhesions' },
    { title: 'Messages reçus',    value: d.counts.messages || 0,        icon: ICONS.messages, accent: '#008751', bg: '#ECFDF5', link: '/admin/messages', badge: d.counts.messagesNonLus },
    { title: 'Revenus adhésions', value: formatPrice(d.adhesions.revenus || 0), icon: ICONS.revenue, accent: '#DC2626', bg: '#FEF2F2', link: '/admin/dons' },
  ];

  // Synthèse complète du contenu
  const contentModules = [
    { label: 'Photos galerie',  value: d.counts.galerie || 0,     icon: ICONS.gallery,     accent: '#008751', link: '/admin/galerie' },
    { label: 'Actions',         value: d.counts.actions || 0,     icon: ICONS.actions,     accent: '#059669', link: '/admin/actions' },
    { label: 'Actualités',      value: d.counts.actualites || 0,  icon: ICONS.blog,        accent: '#002060', link: '/admin/blog' },
    { label: 'Membres équipe',  value: d.counts.team || 0,        icon: ICONS.team,        accent: '#6D28D9', link: '/admin/equipe' },
    { label: 'Partenaires',     value: d.counts.partenaires || 0, icon: ICONS.partners,    accent: '#0284C7', link: '/admin/partenaires' },
    { label: 'Témoignages',     value: d.counts.temoignages || 0, icon: ICONS.testimonial, accent: '#DB2777', link: '/admin/temoignages' },
    { label: 'Dons reçus',      value: d.counts.dons || 0,        icon: ICONS.revenue,     accent: '#DC2626', link: '/admin/dons' },
    { label: 'Abonnés news.',   value: d.counts.newsletter || 0,  icon: ICONS.newsletter,  accent: '#0891B2', link: '/admin/newsletter' },
  ];

  const activityColors = {
    message: { bg: '#ECFDF5', dot: '#008751', label: 'Message' },
    don:     { bg: '#FEF2F2', dot: '#DC2626', label: 'Don' },
    action:  { bg: '#ECFDF5', dot: '#059669', label: 'Action' },
    article: { bg: '#EEF2FF', dot: '#002060', label: 'Article' },
  };

  return (
    <AdminLayout title="Tableau de bord">
      <Helmet><title>Tableau de bord — {ASSOCIATION.name}</title></Helmet>

      <div className="p-4 sm:p-6 space-y-6">

        {/* Bannière */}
        <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }}
          className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#001540] via-[#002060] to-[#003080] p-6 sm:p-8">
          <div className="absolute -top-12 -right-12 w-48 h-48 bg-[#008751]/20 rounded-full blur-2xl pointer-events-none" />
          <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-[#FFD100]/15 rounded-full blur-xl pointer-events-none" />
          <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <p className="text-white/50 text-sm font-medium mb-1 tracking-wide">{greeting()},</p>
              <h1 className="font-heading font-extrabold text-2xl sm:text-3xl text-white leading-tight capitalize">{userName}</h1>
              <p className="text-white/40 text-sm mt-2">
                {new Date().toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button onClick={loadAll} disabled={loading}
                className="flex items-center gap-2 px-4 py-2.5 bg-white/10 hover:bg-white/20 border border-white/15 text-white text-sm font-medium rounded-xl transition-all backdrop-blur-sm disabled:opacity-50">
                <Icon path={ICONS.refresh} className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                Actualiser
              </button>
              <Link to="/" target="_blank"
                className="flex items-center gap-2 px-4 py-2.5 bg-[#008751] hover:bg-[#006B41] text-white text-sm font-semibold rounded-xl transition-all shadow-lg shadow-green-900/30">
                Voir le site<Icon path={ICONS.arrow} className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </motion.div>

        {error && (
          <div className="flex items-center justify-between bg-red-50 border border-red-100 rounded-xl px-5 py-3.5 text-sm text-red-600">
            <span>{error}</span>
            <button onClick={loadAll} className="font-semibold underline">Réessayer</button>
          </div>
        )}

        {/* Cartes principales */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 animate-pulse">
            {[1,2,3,4].map(i => (
              <div key={i} className="bg-white rounded-2xl p-6 border border-gray-100">
                <div className="h-10 w-10 bg-gray-100 rounded-xl mb-4" /><div className="h-7 bg-gray-100 rounded-lg w-16 mb-2" /><div className="h-3.5 bg-gray-100 rounded w-28" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {statCards.map((card, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}>
                <Link to={card.link} className="flex flex-col p-5 bg-white border border-gray-100 rounded-2xl hover:border-gray-200 hover:shadow-md transition-all group block relative">
                  <div className="flex items-start justify-between mb-5">
                    <div className="w-11 h-11 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110" style={{ backgroundColor: card.bg }}>
                      <Icon path={card.icon} className="w-5 h-5" style={{ color: card.accent }} />
                    </div>
                    {card.badge > 0 && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold text-white" style={{ backgroundColor: card.accent }}>
                        {card.badge} nouveau{card.badge > 1 ? 'x' : ''}
                      </span>
                    )}
                  </div>
                  <p className="font-heading font-extrabold text-2xl text-gray-900 leading-none mb-1.5">{card.value}</p>
                  <p className="text-sm text-gray-400 font-medium">{card.title}</p>
                  <div className="mt-4 pt-4 border-t border-gray-50">
                    <span className="text-xs font-semibold" style={{ color: card.accent }}>Gérer &rarr;</span>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        )}

        {/* Synthèse du contenu */}
        <div>
          <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">Contenu du site</h2>
          {loading ? (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 animate-pulse">
              {[1,2,3,4,5,6,7,8].map(i => <div key={i} className="bg-white rounded-2xl p-5 border border-gray-100 h-24" />)}
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {contentModules.map((m, i) => (
                <motion.div key={m.label} initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2 + i * 0.04 }}>
                  <Link to={m.link} className="flex items-center gap-4 p-4 bg-white border border-gray-100 rounded-2xl hover:border-gray-200 hover:shadow-sm transition-all group">
                    <div className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 transition-transform group-hover:scale-110" style={{ backgroundColor: m.accent + '15' }}>
                      <Icon path={m.icon} className="w-5 h-5" style={{ color: m.accent }} />
                    </div>
                    <div className="min-w-0">
                      <p className="font-heading font-extrabold text-xl text-gray-900 leading-none">{m.value}</p>
                      <p className="text-xs text-gray-400 font-medium mt-1 truncate">{m.label}</p>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          )}
        </div>

        {/* Activité récente */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
          className="bg-white border border-gray-100 rounded-2xl overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-50">
            <div>
              <h2 className="font-heading font-bold text-base text-gray-900">Activité récente</h2>
              {lastUpdated && <p className="text-xs text-gray-400 mt-0.5">Mis à jour à {lastUpdated.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}</p>}
            </div>
            <button onClick={loadAll} className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-[#008751] font-medium transition-colors">
              <Icon path={ICONS.refresh} className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />Actualiser
            </button>
          </div>
          {loading ? (
            <div className="p-6 space-y-3">
              {[1,2,3,4].map(i => (
                <div key={i} className="flex items-center gap-4 animate-pulse">
                  <div className="w-9 h-9 bg-gray-100 rounded-full flex-shrink-0" />
                  <div className="flex-1"><div className="h-3 bg-gray-100 rounded w-48 mb-2" /><div className="h-2.5 bg-gray-100 rounded w-32" /></div>
                </div>
              ))}
            </div>
          ) : d.activity.length === 0 ? (
            <div className="py-16 text-center">
              <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center mx-auto mb-3">
                <Icon path="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" className="w-6 h-6 text-gray-300" />
              </div>
              <p className="text-sm font-medium text-gray-400">Aucune activité récente</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-50">
              {d.activity.map((a, i) => {
                const c = activityColors[a.type] || activityColors.action;
                return (
                  <motion.div key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.45 + i * 0.06 }}
                    className="flex items-center gap-4 px-6 py-4 hover:bg-gray-50/60 transition-colors">
                    <div className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0" style={{ backgroundColor: c.bg }}>
                      <div className="w-2 h-2 rounded-full" style={{ backgroundColor: c.dot }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-gray-800 truncate">{a.label}</p>
                      {a.sub && <p className="text-xs text-gray-400 truncate mt-0.5">{a.sub}</p>}
                    </div>
                    <div className="flex flex-col items-end gap-1 flex-shrink-0">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full" style={{ backgroundColor: c.bg, color: c.dot }}>{c.label}</span>
                      {a.date && <span className="text-[10px] text-gray-300">{formatDateShort(a.date)}</span>}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </motion.div>

      </div>
    </AdminLayout>
  );
}
