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
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Veuillez remplir tous les champs.');
      return;
    }

    setIsLoading(true);
    const result = await login(email, password);
    setIsLoading(false);

    if (result.success) {
      navigate('/admin/dashboard');
    } else {
      setError(result.error || 'Identifiants incorrects.');
    }
  };

  return (
    <>
      <Helmet>
        <title>Administration - {ASSOCIATION.name}</title>
      </Helmet>

      <div className="min-h-screen bg-gradient-to-br from-[#002060] via-[#001540] to-[#008751] flex items-center justify-center p-4">
        <motion.div
          className="w-full max-w-md"
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
                className="bg-red-50 border border-red-200 text-red-600 rounded-xl p-4 text-sm mb-6"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                {error}
              </motion.div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
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
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#008751] focus:ring-2 focus:ring-green-100 transition-all"
                  placeholder="••••••••"
                  autoComplete="current-password"
                />
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