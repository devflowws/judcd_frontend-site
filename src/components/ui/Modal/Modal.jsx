import { useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// ==========================================
// MODALE REUTILISABLE JUDCD
// ==========================================

export default function Modal({
  isOpen = false,
  onClose,
  children,
  title = '',
  size = 'md',
  closeOnOverlay = true,
  showCloseButton = true,
  footer = null,
  className = '',
  ...props
}) {
  // Tailles disponibles
  const sizes = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    '2xl': 'max-w-2xl',
    '3xl': 'max-w-3xl',
    full: 'max-w-[90vw] max-h-[90vh]',
  };

  // Fermeture avec Escape
  const handleKeyDown = useCallback((e) => {
    if (e.key === 'Escape') {
      onClose?.();
    }
  }, [onClose]);

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, handleKeyDown]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Overlay */}
          <motion.div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={closeOnOverlay ? onClose : undefined}
          />

          {/* Contenu modal */}
          <motion.div
            className={`relative w-full ${sizes[size]} bg-white rounded-2xl shadow-2xl overflow-hidden ${className}`}
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            {...props}
          >
            {/* En-tete */}
            {(title || showCloseButton) && (
              <div className="flex items-center justify-between p-6 border-b border-gray-100">
                {title && (
                  <h3 className="font-heading font-bold text-xl text-[#002060]">
                    {title}
                  </h3>
                )}
                {showCloseButton && (
                  <button
                    onClick={onClose}
                    className="w-10 h-10 rounded-full hover:bg-gray-100 flex items-center justify-center transition-colors ml-auto"
                    aria-label="Fermer"
                  >
                    <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                )}
              </div>
            )}

            {/* Corps */}
            <div className="p-6 overflow-y-auto max-h-[70vh]">
              {children}
            </div>

            {/* Pied */}
            {footer && (
              <div className="p-6 border-t border-gray-100 bg-gray-50">
                {footer}
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

// Modale de confirmation
export function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title = 'Confirmer',
  message = 'Etes-vous sur de vouloir effectuer cette action ?',
  confirmText = 'Confirmer',
  cancelText = 'Annuler',
  confirmVariant = 'danger',
  isLoading = false,
  ...props
}) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} size="sm" title={title} {...props}>
      <p className="text-[#666666] mb-6">{message}</p>
      <div className="flex gap-3 justify-end">
        <button
          onClick={onClose}
          disabled={isLoading}
          className="px-5 py-2.5 border border-gray-300 text-[#333333] rounded-lg hover:bg-gray-50 transition-colors font-semibold disabled:opacity-50"
        >
          {cancelText}
        </button>
        <button
          onClick={onConfirm}
          disabled={isLoading}
          className={`px-5 py-2.5 text-white rounded-lg font-semibold transition-all disabled:opacity-50 flex items-center gap-2 ${
            confirmVariant === 'danger'
              ? 'bg-[#D21034] hover:bg-[#B00D2B]'
              : 'bg-[#008751] hover:bg-[#006B41]'
          }`}
        >
          {isLoading && (
            <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
          )}
          {confirmText}
        </button>
      </div>
    </Modal>
  );
}

// Modale d'image (lightbox)
export function ImageModal({
  isOpen,
  onClose,
  image,
  alt = '',
  title = '',
  description = '',
}) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="full"
      showCloseButton={true}
      className="bg-transparent shadow-none"
    >
      <div className="flex flex-col items-center">
        {image && (
          <img
            src={image}
            alt={alt}
            className="max-w-full max-h-[70vh] object-contain rounded-lg"
          />
        )}
        {title && (
          <h4 className="font-heading font-bold text-lg text-white mt-4">{title}</h4>
        )}
        {description && (
          <p className="text-white/80 text-sm mt-2">{description}</p>
        )}
      </div>
    </Modal>
  );
}