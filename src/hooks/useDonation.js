import { useState, useCallback } from 'react';
import { 
  submitDonation,
  verifyDonation,
  getDonations,
  getDonationById,
  confirmDonation,
  rejectDonation,
  getActiveCampaigns,
  getPaymentMethods,
} from '@services/donationService';
import { validateDonationForm } from '@utils/validators';
import toast from 'react-hot-toast';
import { SuccessModal } from '@components/ui/Modal';

// ==========================================
// HOOK USEDONATION - Gestion des dons
// ==========================================

/**
 * Hook pour le formulaire de don public
 */
export function useDonationForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [donationReference, setDonationReference] = useState(null);
  const [errors, setErrors] = useState({});
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    amount: '',
    paymentMethod: 'mobile_money',
    message: '',
    anonymous: false,
  });

  // Mise a jour d'un champ
  const handleChange = useCallback((field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
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
    const validation = validateDonationForm(formData);
    if (!validation.valid) {
      setErrors(validation.errors);
      toast.error('Veuillez corriger les erreurs du formulaire.');
      return { success: false, errors: validation.errors };
    }

    setIsSubmitting(true);
    setErrors({});

    try {
      const result = await submitDonation(formData);

      if (result.success) {
        setIsSuccess(true);
        setDonationReference(result.data?.reference || result.data?.id);
        setShowSuccessModal(true);
        setFormData({
          fullName: '',
          email: '',
          phone: '',
          amount: '',
          paymentMethod: 'mobile_money',
          message: '',
          anonymous: false,
        });
        return { success: true, data: result.data };
      } else {
        toast.error(result.error?.detail || 'Erreur lors de l\'enregistrement.');
        setErrors({ submit: result.error?.detail || 'Erreur lors de l\'enregistrement.' });
        return { success: false };
      }
    } catch (err) {
      toast.error('Erreur reseau. Veuillez reessayer.');
      return { success: false };
    } finally {
      setIsSubmitting(false);
    }
  }, [formData]);

  // Verifier un don
  const handleVerify = useCallback(async (reference) => {
    try {
      const result = await verifyDonation(reference);
      if (result.success) {
        return { success: true, data: result.data };
      } else {
        toast.error('Don introuvable.');
        return { success: false };
      }
    } catch (err) {
      toast.error('Erreur de verification.');
      return { success: false };
    }
  }, []);

  // Reinitialiser
  const resetForm = useCallback(() => {
    setFormData({
      fullName: '',
      email: '',
      phone: '',
      amount: '',
      paymentMethod: 'mobile_money',
      message: '',
      anonymous: false,
    });
    setErrors({});
    setIsSuccess(false);
    setDonationReference(null);
  }, []);

  return {
    formData,
    isSubmitting,
    isSuccess,
    donationReference,
    errors,
    showSuccessModal,
    setShowSuccessModal,
    handleChange,
    handleSubmit,
    handleVerify,
    resetForm,
  };
}

/**
 * Hook pour la gestion admin des dons
 */
export function useDonationAdmin() {
  const [donations, setDonations] = useState([]);
  const [campaigns, setCampaigns] = useState([]);
  const [paymentMethods, setPaymentMethodsList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({
    totalDonations: 0,
    totalAmount: 0,
    confirmedCount: 0,
    pendingCount: 0,
  });

  // Charger tous les dons
  const fetchDonations = useCallback(async (params = {}) => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await getDonations({
        pageSize: params.pageSize || 20,
        ...params,
      });

      if (result.success && result.data) {
        const donationsList = result.data.results || result.data;
        setDonations(donationsList);

        // Calculer les statistiques
        const total = donationsList.reduce((sum, d) => sum + (Number(d.amount) || 0), 0);
        const confirmed = donationsList.filter(d => d.status === 'confirmed').length;
        const pending = donationsList.filter(d => d.status === 'pending').length;

        setStats({
          totalDonations: donationsList.length,
          totalAmount: total,
          confirmedCount: confirmed,
          pendingCount: pending,
        });

        return { success: true, data: result.data };
      } else {
        setError(result.error?.detail || 'Erreur de chargement.');
        return { success: false };
      }
    } catch (err) {
      setError('Erreur de chargement des dons.');
      return { success: false };
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Confirmer un don
  const handleConfirm = useCallback(async (id, notes = '') => {
    try {
      const result = await confirmDonation(id, notes);
      if (result.success) {
        toast.success('Don confirme avec succes.');
        setDonations(prev =>
          prev.map(d => d.id === id ? { ...d, status: 'confirmed' } : d)
        );
        return { success: true };
      } else {
        toast.error(result.error?.detail || 'Erreur de confirmation.');
        return { success: false };
      }
    } catch (err) {
      toast.error('Erreur de confirmation.');
      return { success: false };
    }
  }, []);

  // Rejeter un don
  const handleReject = useCallback(async (id, reason = '') => {
    try {
      const result = await rejectDonation(id, reason);
      if (result.success) {
        toast.success('Don rejete.');
        setDonations(prev =>
          prev.map(d => d.id === id ? { ...d, status: 'rejected' } : d)
        );
        return { success: true };
      } else {
        toast.error(result.error?.detail || 'Erreur de rejet.');
        return { success: false };
      }
    } catch (err) {
      toast.error('Erreur de rejet.');
      return { success: false };
    }
  }, []);

  // Charger les campagnes et moyens de paiement
  const fetchMetadata = useCallback(async () => {
    try {
      const [campaignsResult, methodsResult] = await Promise.all([
        getActiveCampaigns(),
        getPaymentMethods(),
      ]);

      if (campaignsResult.success) {
        setCampaigns(campaignsResult.data.results || campaignsResult.data || []);
      }
      if (methodsResult.success) {
        setPaymentMethodsList(methodsResult.data || []);
      }
    } catch (err) {
      console.error('Erreur chargement metadonnees:', err);
    }
  }, []);

  return {
    donations,
    campaigns,
    paymentMethods,
    isLoading,
    error,
    stats,
    fetchDonations,
    handleConfirm,
    handleReject,
    fetchMetadata,
  };
}

export default useDonationForm;