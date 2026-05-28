import { useState } from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';
import { ASSETS, ASSOCIATION } from '@utils/constants';
import { useAuth } from '@context/AuthContext';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {  
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Veuillez remplir tous les champs obligatoires.');
      return;
    }

    if (!email.includes('@')) {
      setError('Veuillez entrer une adresse email valide.');
      return;
    }

    if (password.length < 6) {
      setError('Le mot de passe doit contenir au moins 6 caractères.');
      return;
    }

    setIsLoading(true);
    const result = await login(email, password);
    setIsLoading(false);

    if (result.success) {
      navigate('/admin/dashboard');
    } else {
      // Messages d'erreur plus professionnels et spécifiques
      if (result.error?.includes('404') || result.error?.includes('not found')) {
        setError('Service de connexion temporairement indisponible. Veuillez réessayer ultérieurement.');
      } else if (result.error?.includes('401') || result.error?.includes('Unauthorized')) {
        setError('Email ou mot de passe incorrect. Veuillez vérifier vos identifiants.');
      } else if (result.error?.includes('403') || result.error?.includes('Forbidden')) {
        setError('Accès refusé. Vous n\'avez pas les droits d\'accès à cette interface.');
      } else if (result.error?.includes('network') || result.error?.includes('fetch')) {
        setError('Erreur de connexion au serveur. Veuillez vérifier votre connexion internet.');
      } else {
        setError(result.error || 'Une erreur est survenue lors de la connexion. Veuillez réessayer.');
      }
    }
  };

  return (
    <>
      <Helmet>
        <title>Administration - {ASSOCIATION.name}</title>
      </Helmet>

      <div className="min-h-screen relative flex items-center justify-center p-4 overflow-hidden">
        {/* Background avec image et overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#002060]/90 via-[#001540]/90 to-[#008751]/90">
          <img 
            src="/assets/images/youth.jpg" 
            alt="Jeunes africains unis pour le développement" 
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-[#002060]/80 via-[#001540]/80 to-[#008751]/80" />
        </div>
        <motion.div
          className="w-full max-w-md relative z-10"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Logo */}
          <div className="text-center mb-8">
            <img
              src={ASSETS.logo}
              alt={ASSOCIATION.name}
              className="h-20 mx-auto mb-4 brightness-0 invert"
            />
            <h1 className="font-heading font-extrabold text-2xl text-white">
              Administration
            </h1>
            <p className="text-white/60 text-sm mt-1">{ASSOCIATION.name}</p>
          </div>

          {/* Formulaire */}
          <div className="bg-white rounded-2xl p-8 shadow-2xl">
            <h2 className="font-heading font-bold text-xl text-[#002060] mb-6 text-center">
              Connexion
            </h2>

            {error && (
              <motion.div
                className="bg-red-50 border-l-4 border-red-500 rounded-r-xl p-4 mb-6"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0">
                    <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-red-800 mb-1">Erreur de connexion</p>
                    <p className="text-sm text-red-700">{error}</p>
                  </div>
                </div>
              </motion.div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5" method='POST'>
              <div>
                <label htmlFor="email" className="block text-sm font-semibold text-[#333333] mb-2">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#008751] focus:ring-2 focus:ring-green-100 transition-all"
                  placeholder="admin@judcd.tg"
                  autoComplete="email"
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-semibold text-[#333333] mb-2">
                  Mot de passe
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-3 pr-12 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#008751] focus:ring-2 focus:ring-green-100 transition-all"
                    placeholder="••••••••"
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none transition-colors"
                    aria-label={showPassword ? 'Masquer le mot de passe' : 'Afficher le mot de passe'}
                  >
                    {showPassword ? (
                      // Icone oeil barré (masquer)
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                      </svg>
                    ) : (
                      // Icone oeil (afficher)
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full px-6 py-3.5 bg-[#008751] text-white font-bold rounded-xl hover:bg-[#006B41] transition-all shadow-lg shadow-green-500/25 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin w-5 h-5" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Connexion...
                  </>
                ) : (
                  'Se connecter'
                )}
              </button>
            </form>

            <p className="text-center text-xs text-[#999999] mt-6">
              Espace réservé à l'équipe {ASSOCIATION.name}
            </p>
          </div>

          {/* Retour au site */}
          <div className="text-center mt-6">
            <a
              href="/"
              className="text-white/60 hover:text-white text-sm transition-colors"
            >
              Retour au site
            </a>
          </div>
        </motion.div>
      </div>
    </>
  );
}