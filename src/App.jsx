import { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { ThemeProvider } from '@context/ThemeContext';
import { LanguageProvider } from '@context/LanguageContext';
import { AuthProvider } from '@context/AuthContext';
import Header from '@components/layout/Header/Header';
import Footer from '@components/layout/Footer/Footer';
import ScrollToTop from '@components/ui/ScrollToTop/ScrollToTop';
import { PageLoader } from '@components/ui/Loader/Loader';

const HomePage = lazy(() => import('@pages/Home/HomePage'));
const AboutPage = lazy(() => import('@pages/About/AboutPage'));
const TeamPage = lazy(() => import('@pages/Team/TeamPage'));
const GalleryPage = lazy(() => import('@pages/Gallery/GalleryPage'));
const BlogPage = lazy(() => import('@pages/Blog/BlogPage'));
const ContactPage = lazy(() => import('@pages/Contact/ContactPage'));
const JoinPage = lazy(() => import('@pages/Join/JoinPage'));
const DonatePage = lazy(() => import('@pages/Donate/DonatePage'));

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
                  <Route path="/a-propos" element={<AboutPage />} />
                  <Route path="/equipe" element={<TeamPage />} />
                  <Route path="/galerie" element={<GalleryPage />} />
                  <Route path="/actualites" element={<BlogPage />} />
                  <Route path="/actualites/:slug" element={<BlogPage />} />
                  <Route path="/contact" element={<ContactPage />} />
                  <Route path="/adherer" element={<JoinPage />} />
                  <Route path="/faire-un-don" element={<DonatePage />} />
                  <Route path="*" element={<HomePage />} />
                </Routes>
              </Suspense>
            </main>

            <Footer />
            
            {/* Bouton retour en haut */}
            <ScrollToTop />
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