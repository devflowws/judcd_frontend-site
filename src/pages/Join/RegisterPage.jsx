import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { ASSOCIATION } from '@utils/constants';
import { Spinner } from '@components/ui/Loader/Loader';

export default function RegisterPage() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    nom: '', prenom: '', email: '', telephone: '',
    date_naissance: '', lieu_naissance: '', profession: '', adresse: '',
    motivations: '', competences: '', disponibilites: '', reference_paiement: ''
  });
  const [captureDepot, setCaptureDepot] = useState(null);
  const [capturePreview, setCapturePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => { window.scrollTo(0, 0); }, []);

  const handleInputChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { setError('Fichier trop volumineux (max 5 Mo).'); return; }
      if (!file.type.startsWith('image/')) { setError('Format non supporte (JPG, PNG uniquement).'); return; }
      setCaptureDepot(file);
      setCapturePreview(URL.createObjectURL(file));
      setError('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!formData.nom || !formData.prenom || !formData.email || !formData.telephone || !formData.date_naissance || !formData.lieu_naissance || !formData.profession || !formData.adresse || !formData.motivations || !captureDepot) {
      setError('Veuillez remplir tous les champs obligatoires et telecharger la preuve de paiement.');
      return;
    }
    setLoading(true);
    try {
      const submitData = new FormData();
      // Object.keys(formData).forEach(key => { if (formData[key]) submitData.append(key, formData[key]); });
      // Remplace ton Object.keys(...).forEach par ceci :
      // Object.keys(formData).forEach(key => {
      //   // On envoie la valeur, ou une chaîne vide si elle n'est pas saisie
      //   submitData.append(key, formData[key] !== undefined && formData[key] !== null ? formData[key] : '');
      // });
      submitData.append('capture_depot', captureDepot);
      const apiUrl = 'http://localhost:8000/api/v1';
      const response = await fetch(`${apiUrl}/adhesion/creer/`, { method: 'POST', body: submitData });
      const result = await response.json();
      if (result.success || response.ok) {
        setSuccess(true);
      } else {
        setError(result.error?.detail || 'Erreur lors de la soumission.');
      }
    } catch (err) {
      setError('Erreur de connexion au serveur.');
    } finally {
      setLoading(false);
    }
  };

  const nextStep = () => {
    if (step === 1 && (!formData.nom || !formData.prenom || !formData.email || !formData.telephone)) {
      setError('Veuillez remplir tous les champs obligatoires.'); return;
    }
    if (step === 2 && (!formData.date_naissance || !formData.lieu_naissance || !formData.profession || !formData.adresse || !formData.motivations)) {
      setError('Veuillez remplir tous les champs obligatoires.'); return;
    }
    setError('');
    setStep(prev => Math.min(prev + 1, 3));
  };

  const prevStep = () => { setError(''); setStep(prev => Math.max(prev - 1, 1)); };

  return (
    <>
      <Helmet><title>Inscription - {ASSOCIATION.name}</title></Helmet>
      
      <div className="min-h-screen relative flex items-center justify-center pt-24 pb-12 px-4 sm:px-6 lg:px-8">
        {/* Fond */}
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1529156069898-49953e39b3ac?q=80&w=1932&auto=format&fit=crop"
            alt=""
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-[#002060]/95 via-[#001540]/90 to-[#008751]/90 backdrop-blur-sm" />
        </div>

        {/* Contenu */}
        <div className="relative z-10 w-full max-w-4xl">
          
          {/* Titre - avec padding-top pour ne pas etre cache par le header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center text-white mb-8 sm:mb-10"
          >
            <h1 className="font-heading font-extrabold text-2xl sm:text-3xl md:text-4xl lg:text-5xl mb-3 leading-tight">
              Formulaire <span className="text-[#FFD100]">d'Adhesion</span>
            </h1>
            <p className="text-white/70 text-sm sm:text-base md:text-lg max-w-2xl mx-auto px-4">
              Rejoignez {ASSOCIATION.name} et participez au developpement communautaire durable
            </p>
          </motion.div>

          {/* Succes */}
          {success ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4 }}
              className="bg-white rounded-2xl sm:rounded-3xl p-8 sm:p-10 md:p-14 shadow-2xl text-center"
            >
              <div className="w-20 h-20 sm:w-24 sm:h-24 mx-auto mb-6 rounded-full bg-gradient-to-br from-[#008751] to-[#006B41] flex items-center justify-center shadow-lg shadow-green-500/30">
                <svg className="w-10 h-10 sm:w-12 sm:h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="font-heading font-extrabold text-2xl sm:text-3xl text-[#002060] mb-4">Demande envoyee avec succes !</h2>
              <p className="text-[#666666] text-sm sm:text-base md:text-lg mb-8 max-w-md mx-auto leading-relaxed">
                Votre demande d'adhesion a bien ete recue. Vous recevrez un email de confirmation. Notre equipe examinera votre dossier.
              </p>
              <div className="bg-[#F8FAF9] rounded-2xl p-5 sm:p-6 mb-8 text-left space-y-2">
                <p className="text-sm font-semibold text-[#002060]">Recapitulatif :</p>
                <p className="text-sm text-[#666666]"><strong>Nom :</strong> {formData.prenom} {formData.nom}</p>
                <p className="text-sm text-[#666666]"><strong>Email :</strong> {formData.email}</p>
                <p className="text-sm text-[#666666]"><strong>Telephone :</strong> {formData.telephone}</p>
                <p className="text-sm text-[#666666]"><strong>Cotisation :</strong> 5 000 FCFA</p>
              </div>
              <Link to="/" className="inline-flex items-center justify-center gap-2 px-6 sm:px-8 py-3 sm:py-4 bg-[#008751] text-white font-bold rounded-xl hover:bg-[#006B41] transition-all shadow-lg shadow-green-500/25 text-sm sm:text-base">
                <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Retour a l'accueil
              </Link>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="bg-white rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden"
            >
              
              {/* Barre d'etapes */}
              <div className="bg-gradient-to-r from-[#002060] to-[#008751] p-4 sm:p-6">
                <div className="flex items-center justify-center gap-2 sm:gap-4">
                  {[
                    { num: 1, label: 'Infos' },
                    { num: 2, label: 'Profil' },
                    { num: 3, label: 'Paiement' }
                  ].map((s) => (
                    <div key={s.num} className="flex items-center gap-1.5 sm:gap-2">
                      <div className={`w-7 h-7 sm:w-9 sm:h-9 md:w-10 md:h-10 rounded-full flex items-center justify-center text-xs sm:text-sm font-bold transition-all flex-shrink-0 ${
                        step >= s.num ? 'bg-[#FFD100] text-[#002060]' : 'bg-white/20 text-white'
                      }`}>
                        {step > s.num ? (
                          <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                          </svg>
                        ) : s.num}
                      </div>
                      <span className={`text-[10px] sm:text-xs font-medium transition-colors ${
                        step >= s.num ? 'text-[#FFD100]' : 'text-white/60'
                      }`}>
                        {s.label}
                      </span>
                      {s.num < 3 && (
                        <div className={`w-4 sm:w-8 h-0.5 rounded-full transition-colors ${
                          step > s.num ? 'bg-[#FFD100]' : 'bg-white/20'
                        }`} />
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Erreur */}
              <AnimatePresence>
                {error && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="bg-red-50 border-l-4 border-red-500 p-3 sm:p-4 m-4 sm:m-6 rounded-r-lg"
                  >
                    <div className="flex items-start gap-2">
                      <svg className="w-4 h-4 sm:w-5 sm:h-5 text-red-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <p className="text-red-700 text-xs sm:text-sm">{error}</p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Formulaire */}
              <form onSubmit={handleSubmit} className="p-4 sm:p-6 md:p-8">
                <AnimatePresence mode="wait">
                  {/* Etape 1 */}
                  {step === 1 && (
                    <motion.div
                      key="step1"
                      initial={{ opacity: 0, x: 30 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -30 }}
                      transition={{ duration: 0.3 }}
                    >
                      <h3 className="font-heading font-bold text-lg sm:text-xl text-[#002060] mb-4 sm:mb-6">
                        Informations personnelles
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                        {[
                          { name: 'prenom', label: 'Prenom', required: true },
                          { name: 'nom', label: 'Nom', required: true },
                          { name: 'email', label: 'Email', type: 'email', required: true },
                          { name: 'telephone', label: 'Telephone', required: true, placeholder: '+228 XX XX XX XX' },
                        ].map((f) => (
                          <div key={f.name}>
                            <label className="block text-xs sm:text-sm font-semibold text-[#333333] mb-1 sm:mb-1.5">
                              {f.label} {f.required && <span className="text-red-500">*</span>}
                            </label>
                            <input
                              type={f.type || 'text'}
                              name={f.name}
                              value={formData[f.name]}
                              onChange={handleInputChange}
                              placeholder={f.placeholder || ''}
                              className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:border-[#008751] focus:ring-2 focus:ring-green-100 transition-all"
                              required={f.required}
                            />
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}

                  {/* Etape 2 */}
                  {step === 2 && (
                    <motion.div
                      key="step2"
                      initial={{ opacity: 0, x: 30 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -30 }}
                      transition={{ duration: 0.3 }}
                    >
                      <h3 className="font-heading font-bold text-lg sm:text-xl text-[#002060] mb-4 sm:mb-6">
                        Votre profil
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                        <div>
                          <label className="block text-xs sm:text-sm font-semibold text-[#333333] mb-1 sm:mb-1.5">
                            Date de naissance <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="date"
                            name="date_naissance"
                            value={formData.date_naissance}
                            onChange={handleInputChange}
                            className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:border-[#008751] focus:ring-2 focus:ring-green-100 transition-all"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-xs sm:text-sm font-semibold text-[#333333] mb-1 sm:mb-1.5">
                            Lieu de naissance <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="text"
                            name="lieu_naissance"
                            value={formData.lieu_naissance}
                            onChange={handleInputChange}
                            className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:border-[#008751] focus:ring-2 focus:ring-green-100 transition-all"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-xs sm:text-sm font-semibold text-[#333333] mb-1 sm:mb-1.5">
                            Profession <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="text"
                            name="profession"
                            value={formData.profession}
                            onChange={handleInputChange}
                            className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:border-[#008751] focus:ring-2 focus:ring-green-100 transition-all"
                            required
                          />
                        </div>
                        <div className="md:col-span-2">
                          <label className="block text-xs sm:text-sm font-semibold text-[#333333] mb-1 sm:mb-1.5">
                            Adresse <span className="text-red-500">*</span>
                          </label>
                          <textarea
                            name="adresse"
                            value={formData.adresse}
                            onChange={handleInputChange}
                            rows="2"
                            className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:border-[#008751] focus:ring-2 focus:ring-green-100 transition-all resize-none"
                            required
                          />
                        </div>
                        <div className="md:col-span-2">
                          <label className="block text-xs sm:text-sm font-semibold text-[#333333] mb-1 sm:mb-1.5">
                            Motivations <span className="text-red-500">*</span>
                          </label>
                          <textarea
                            name="motivations"
                            value={formData.motivations}
                            onChange={handleInputChange}
                            rows="3"
                            className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:border-[#008751] focus:ring-2 focus:ring-green-100 transition-all resize-none"
                            placeholder="Pourquoi souhaitez-vous rejoindre JUDCD ?"
                            required
                          />
                        </div>
                        <div className="md:col-span-2">
                          <label className="block text-xs sm:text-sm font-semibold text-[#333333] mb-1 sm:mb-1.5">
                            Competences
                          </label>
                          <textarea
                            name="competences"
                            value={formData.competences}
                            onChange={handleInputChange}
                            rows="2"
                            className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:border-[#008751] focus:ring-2 focus:ring-green-100 transition-all resize-none"
                            placeholder="Vos competences et experiences..."
                          />
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* Etape 3 */}
                  {step === 3 && (
                    <motion.div
                      key="step3"
                      initial={{ opacity: 0, x: 30 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -30 }}
                      transition={{ duration: 0.3 }}
                    >
                      <h3 className="font-heading font-bold text-lg sm:text-xl text-[#002060] mb-4 sm:mb-6">
                        Paiement de la cotisation
                      </h3>
                      
                      <div className="bg-gradient-to-r from-[#FFD100]/10 to-[#FFD100]/5 border border-[#FFD100]/30 rounded-2xl p-4 sm:p-5 mb-5 sm:mb-6">
                        <div className="flex items-start gap-3">
                          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-[#FFD100]/20 rounded-xl flex items-center justify-center flex-shrink-0">
                            <svg className="w-5 h-5 sm:w-6 sm:h-6 text-[#002060]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                          </div>
                          <div>
                            <p className="font-bold text-[#002060] text-sm sm:text-base mb-1">Cotisation annuelle : 5 000 FCFA</p>
                            <p className="text-xs sm:text-sm text-[#666666]">Payez par Mobile Money (Flooz / T-Money) puis telechargez la capture d'ecran du paiement.</p>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-3 sm:space-y-4">
                        <div>
                          <label className="block text-xs sm:text-sm font-semibold text-[#333333] mb-1 sm:mb-1.5">
                            Reference de paiement
                          </label>
                          <input
                            type="text"
                            name="reference_paiement"
                            value={formData.reference_paiement}
                            onChange={handleInputChange}
                            className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:border-[#008751] focus:ring-2 focus:ring-green-100 transition-all"
                            placeholder="Numero de transaction (optionnel)"
                          />
                        </div>

                        <div>
                          <label className="block text-xs sm:text-sm font-semibold text-[#333333] mb-1 sm:mb-1.5">
                            Preuve de paiement <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="file"
                            id="capture_depot"
                            accept="image/*"
                            onChange={handleFileChange}
                            className="hidden"
                          />
                          <label
                            htmlFor="capture_depot"
                            className={`flex flex-col items-center justify-center w-full h-40 sm:h-48 border-2 border-dashed rounded-2xl cursor-pointer transition-all ${
                              capturePreview
                                ? 'border-[#008751] bg-green-50'
                                : 'border-gray-300 hover:border-[#008751] hover:bg-gray-50'
                            }`}
                          >
                            {capturePreview ? (
                              <div className="relative w-full h-full">
                                <img src={capturePreview} alt="Apercu" className="w-full h-full object-contain rounded-2xl p-2" />
                                <button
                                  type="button"
                                  onClick={(e) => { e.preventDefault(); e.stopPropagation(); setCaptureDepot(null); setCapturePreview(null); }}
                                  className="absolute top-2 right-2 w-7 h-7 sm:w-8 sm:h-8 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
                                >
                                  <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                  </svg>
                                </button>
                              </div>
                            ) : (
                              <>
                                <svg className="w-10 h-10 sm:w-12 sm:h-12 text-gray-400 mb-2 sm:mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                                <p className="text-xs sm:text-sm text-[#666666] font-medium">Cliquez pour telecharger</p>
                                <p className="text-[10px] sm:text-xs text-[#999999] mt-1">JPG, PNG (max 5 Mo)</p>
                              </>
                            )}
                          </label>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Navigation */}
                <div className="flex items-center justify-between mt-6 sm:mt-8 pt-5 sm:pt-6 border-t border-gray-100">
                  {step > 1 ? (
                    <button
                      type="button"
                      onClick={prevStep}
                      className="px-4 sm:px-6 py-2.5 sm:py-3 border-2 border-gray-300 text-[#666666] font-semibold rounded-xl hover:bg-gray-50 transition-all text-xs sm:text-sm"
                    >
                      Retour
                    </button>
                  ) : (
                    <div />
                  )}
                  
                  {step < 3 ? (
                    <button
                      type="button"
                      onClick={nextStep}
                      className="px-5 sm:px-6 py-2.5 sm:py-3 bg-[#008751] text-white font-bold rounded-xl hover:bg-[#006B41] transition-all shadow-lg shadow-green-500/25 flex items-center gap-2 text-xs sm:text-sm"
                    >
                      Continuer
                      <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  ) : (
                    <button
                      type="submit"
                      disabled={loading}
                      className="px-5 sm:px-8 py-2.5 sm:py-3 bg-gradient-to-r from-[#008751] to-[#006B41] text-white font-bold rounded-xl hover:from-[#006B41] hover:to-[#005531] transition-all shadow-lg shadow-green-500/25 disabled:opacity-50 flex items-center gap-2 text-xs sm:text-sm"
                    >
                      {loading ? (
                        <>
                          <Spinner size="sm" color="white" />
                          Envoi en cours...
                        </>
                      ) : (
                        <>
                          Valider mon adhesion
                          <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        </>
                      )}
                    </button>
                  )}
                </div>
              </form>
            </motion.div>
          )}
        </div>
      </div>
    </>
  );
}