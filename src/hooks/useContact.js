import { useState, useCallback } from 'react';
import {
  sendMessage,
  getMessages,
  getMessageById,
  markMessageAsRead,
  deleteMessage,
} from '@services/contactService';
import { validateContactForm } from '@utils/validators';
import toast from 'react-hot-toast';

// ==========================================
// HOOK USECONTACT - Gestion du formulaire
// ==========================================

/**
 * Hook pour le formulaire de contact public
 */
export function useContactForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: 'Renseignements',
    message: '',
  });

  // Mise a jour d'un champ
  const handleChange = useCallback((field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Efface l'erreur du champ modifie
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  }, [errors]);

  // Soumission du formulaire
  const handleSubmit = useCallback(async (e) => {
    if (e) e.preventDefault();

    // Validation
    const validation = validateContactForm(formData);
    if (!validation.valid) {
      setErrors(validation.errors);
      toast.error('Veuillez corriger les erreurs du formulaire.');
      return { success: false, errors: validation.errors };
    }

    setIsSubmitting(true);
    setErrors({});

    try {
      const result = await sendMessage(formData);

      if (result.success) {
        setIsSuccess(true);
        toast.success('Message envoye avec succes ! Nous vous repondrons dans les plus brefs delais.');
        // Reinitialiser le formulaire
        setFormData({
          name: '',
          email: '',
          phone: '',
          subject: 'Renseignements',
          message: '',
        });
        return { success: true };
      } else {
        toast.error(result.error?.detail || 'Erreur lors de l\'envoi du message.');
        setErrors({ submit: result.error?.detail || 'Erreur lors de l\'envoi.' });
        return { success: false };
      }
    } catch (err) {
      toast.error('Erreur reseau. Veuillez reessayer.');
      setErrors({ submit: 'Erreur reseau. Veuillez reessayer.' });
      return { success: false };
    } finally {
      setIsSubmitting(false);
    }
  }, [formData]);

  // Reinitialiser le formulaire
  const resetForm = useCallback(() => {
    setFormData({
      name: '',
      email: '',
      phone: '',
      subject: 'Renseignements',
      message: '',
    });
    setErrors({});
    setIsSuccess(false);
  }, []);

  return {
    formData,
    isSubmitting,
    isSuccess,
    errors,
    handleChange,
    handleSubmit,
    resetForm,
  };
}

/**
 * Hook pour la gestion admin des messages
 */
export function useContactAdmin() {
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [unreadCount, setUnreadCount] = useState(0);

  // Charger tous les messages
  const fetchMessages = useCallback(async (params = {}) => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await getMessages({
        pageSize: params.pageSize || 20,
        ...params,
      });

      if (result.success && result.data) {
        const messagesList = result.data.results || result.data;
        setMessages(messagesList);
        // Calculer les messages non lus
        const unread = messagesList.filter(m => !m.is_read).length;
        setUnreadCount(unread);
        return { success: true, data: result.data };
      } else {
        setError(result.error?.detail || 'Erreur de chargement.');
        return { success: false };
      }
    } catch (err) {
      setError('Erreur de chargement des messages.');
      return { success: false };
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Marquer comme lu
  const handleMarkAsRead = useCallback(async (id) => {
    try {
      const result = await markMessageAsRead(id);
      if (result.success) {
        setMessages(prev =>
          prev.map(m => m.id === id ? { ...m, is_read: true } : m)
        );
        setUnreadCount(prev => Math.max(0, prev - 1));
        toast.success('Message marque comme lu.');
        return { success: true };
      }
      return { success: false };
    } catch (err) {
      toast.error('Erreur lors du marquage.');
      return { success: false };
    }
  }, []);

  // Supprimer un message
  const handleDelete = useCallback(async (id) => {
    try {
      const result = await deleteMessage(id);
      if (result.success) {
        setMessages(prev => prev.filter(m => m.id !== id));
        toast.success('Message supprime.');
        return { success: true };
      }
      return { success: false };
    } catch (err) {
      toast.error('Erreur de suppression.');
      return { success: false };
    }
  }, []);

  // Obtenir le detail d'un message
  const fetchMessageDetail = useCallback(async (id) => {
    try {
      const result = await getMessageById(id);
      if (result.success && result.data) {
        // Marquer comme lu automatiquement
        if (!result.data.is_read) {
          await handleMarkAsRead(id);
        }
        return { success: true, data: result.data };
      }
      return { success: false };
    } catch (err) {
      return { success: false };
    }
  }, [handleMarkAsRead]);

  return {
    messages,
    isLoading,
    error,
    unreadCount,
    fetchMessages,
    fetchMessageDetail,
    handleMarkAsRead,
    handleDelete,
  };
}

export default useContactForm;