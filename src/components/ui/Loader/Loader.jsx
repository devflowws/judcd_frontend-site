import { motion } from 'framer-motion';
import { ASSETS } from '@utils/constants';

// ==========================================
// LOADERS & SKELETONS JUDCD
// ==========================================

// Loader principal avec logo
export function PageLoader() {
  return (
    <div className="fixed inset-0 bg-white z-50 flex flex-col items-center justify-center">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
        className="w-20 h-20 mb-6"
      >
        <svg className="w-full h-full" viewBox="0 0 100 100">
          <circle
            cx="50"
            cy="50"
            r="40"
            fill="none"
            stroke="#008751"
            strokeWidth="6"
            strokeLinecap="round"
            strokeDasharray="200"
            strokeDashoffset="150"
          />
        </svg>
      </motion.div>
      <motion.img
        src={ASSETS.logo}
        alt="JUDCD"
        className="h-12 mb-4"
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 1.5, repeat: Infinity }}
      />
      <p className="text-[#666666] font-medium">Chargement...</p>
    </div>
  );
}

// Loader simple
export function Spinner({ size = 'md', color = '#008751', className = '' }) {
  const sizes = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16',
  };

  return (
    <div className={`flex items-center justify-center ${className}`}>
      <motion.div
        className={`${sizes[size]} border-4 border-gray-200 rounded-full`}
        style={{ borderTopColor: color }}
        animate={{ rotate: 360 }}
        transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
      />
    </div>
  );
}

// Loader avec texte
export function LoadingText({ text = 'Chargement...', className = '' }) {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <Spinner size="sm" />
      <span className="text-[#666666] font-medium">{text}</span>
    </div>
  );
}

// Skeleton pour les cartes
export function CardSkeleton() {
  return (
    <div className="bg-white rounded-xl overflow-hidden shadow-lg animate-pulse">
      <div className="aspect-[4/3] bg-gray-200" />
      <div className="p-5 space-y-3">
        <div className="h-3 bg-gray-200 rounded w-1/4" />
        <div className="h-5 bg-gray-200 rounded w-3/4" />
        <div className="h-4 bg-gray-200 rounded w-full" />
        <div className="h-4 bg-gray-200 rounded w-2/3" />
      </div>
    </div>
  );
}

// Skeleton pour le texte
export function TextSkeleton({ lines = 3, className = '' }) {
  return (
    <div className={`space-y-3 animate-pulse ${className}`}>
      {Array.from({ length: lines }).map((_, i) => (
        <div
          key={i}
          className="h-4 bg-gray-200 rounded"
          style={{ width: `${Math.random() * 40 + 60}%` }}
        />
      ))}
    </div>
  );
}

// Skeleton pour les images
export function ImageSkeleton({ aspectRatio = 'aspect-[4/3]', className = '' }) {
  return (
    <div className={`${aspectRatio} bg-gray-200 rounded-xl animate-pulse ${className}`}>
      <div className="w-full h-full flex items-center justify-center">
        <svg className="w-12 h-12 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      </div>
    </div>
  );
}

// Skeleton pour la section hero
export function HeroSkeleton() {
  return (
    <div className="w-full h-screen bg-gray-200 animate-pulse flex items-center justify-center">
      <div className="text-center space-y-6">
        <div className="h-16 bg-gray-300 rounded w-96 mx-auto" />
        <div className="h-8 bg-gray-300 rounded w-64 mx-auto" />
        <div className="flex gap-4 justify-center">
          <div className="h-12 bg-gray-300 rounded w-40" />
          <div className="h-12 bg-gray-300 rounded w-40" />
        </div>
      </div>
    </div>
  );
}

// Skeleton pour la page admin
export function AdminSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="bg-white rounded-xl p-6 shadow-lg">
            <div className="h-4 bg-gray-200 rounded w-1/2 mb-4" />
            <div className="h-8 bg-gray-200 rounded w-1/3" />
          </div>
        ))}
      </div>
      <div className="bg-white rounded-xl p-6 shadow-lg">
        <div className="h-6 bg-gray-200 rounded w-1/4 mb-4" />
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-12 bg-gray-200 rounded" />
          ))}
        </div>
      </div>
    </div>
  );
}

// Overlay de chargement avec progression
export function ProgressOverlay({ progress = 0, message = 'Telechargement...', isVisible = false }) {
  if (!isVisible) return null;

  return (
    <motion.div
      className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="bg-white rounded-2xl p-8 max-w-sm w-full mx-4 shadow-2xl">
        <p className="text-center font-semibold text-[#333333] mb-4">{message}</p>
        <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-[#008751] rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
        <p className="text-center text-sm text-[#666666] mt-2">{progress}%</p>
      </div>
    </motion.div>
  );
}

// Etat vide
export function EmptyState({
  icon = null,
  title = 'Aucun resultat',
  description = 'Aucune donnee a afficher pour le moment.',
  action = null,
  className = '',
}) {
  return (
    <div className={`text-center py-16 px-4 ${className}`}>
      {icon && <div className="text-5xl mb-4 text-gray-300">{icon}</div>}
      <h3 className="text-xl font-heading font-bold text-[#333333] mb-2">{title}</h3>
      <p className="text-[#666666] mb-6">{description}</p>
      {action}
    </div>
  );
}

// Etat d'erreur
export function ErrorState({
  message = 'Une erreur est survenue.',
  onRetry = null,
  className = '',
}) {
  return (
    <div className={`text-center py-16 px-4 ${className}`}>
      <div className="text-5xl mb-4">!</div>
      <h3 className="text-xl font-heading font-bold text-[#D21034] mb-2">Oups !</h3>
      <p className="text-[#666666] mb-6">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="px-6 py-2 bg-[#008751] text-white rounded-lg hover:bg-[#006B41] transition-colors font-semibold"
        >
          Reessayer
        </button>
      )}
    </div>
  );
}