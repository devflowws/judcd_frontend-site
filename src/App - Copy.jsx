import { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { ThemeProvider } from '@context/ThemeContext';
import { LanguageProvider } from '@context/LanguageContext';
import { AuthProvider } from '@context/AuthContext';
import Header from '@components/layout/Header/Header';
import Footer from '@components/layout/Footer/Footer';
import { PageLoader } from '@components/ui/Loader/Loader';

// Lazy loading - seulement la page d'accueil pour l'instant
const HomePage = lazy(() => import('@pages/Home/HomePage'));

export default function App() {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <AuthProvider>
          <div className="flex flex-col min-h-screen">
            <Header />
            
            <main className="flex-1">
              <Suspense fallback={<PageLoader />}>
                <Routes>
                  <Route path="/" element={<HomePage />} />
                  <Route path="*" element={<HomePage />} />
                </Routes>
              </Suspense>
            </main>

            <Footer />
          </div>

          <Toaster
            position="top-right"
            toastOptions={{
              duration: 5000,
              style: {
                borderRadius: '12px',
                padding: '16px',
                fontFamily: 'Poppins, sans-serif',
                fontSize: '14px',
              },
              success: { iconTheme: { primary: '#008751', secondary: '#FFFFFF' } },
              error: { iconTheme: { primary: '#D21034', secondary: '#FFFFFF' } },
            }}
          />
        </AuthProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
}