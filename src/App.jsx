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

// Pages publiques
const HomePage = lazy(() => import('@pages/Home/HomePage'));
const AboutPage = lazy(() => import('@pages/About/AboutPage'));
const TeamPage = lazy(() => import('@pages/Team/TeamPage'));
const GalleryPage = lazy(() => import('@pages/Gallery/GalleryPage'));
const BlogPage = lazy(() => import('@pages/Blog/BlogPage'));
const ContactPage = lazy(() => import('@pages/Contact/ContactPage'));
const JoinPage = lazy(() => import('@pages/Join/JoinPage'));
const DonatePage = lazy(() => import('@pages/Donate/DonatePage'));

// Pages admin
const AdminLogin = lazy(() => import('@pages/Admin/AdminLogin'));
const AdminDashboard = lazy(() => import('@pages/Admin/AdminDashboard'));
const AdminGallery = lazy(() => import('@pages/Admin/Gallery'));
const AdminBlog = lazy(() => import('@pages/Admin/Blog'));
const AdminMessages = lazy(() => import('@pages/Admin/Messages'));
const AdminDonations = lazy(() => import('@pages/Admin/Donations'));

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
                  {/* Pages publiques */}
                  <Route path="/" element={<HomePage />} />
                  <Route path="/a-propos" element={<AboutPage />} />
                  <Route path="/equipe" element={<TeamPage />} />
                  <Route path="/galerie" element={<GalleryPage />} />
                  <Route path="/actualites" element={<BlogPage />} />
                  <Route path="/actualites/:slug" element={<BlogPage />} />
                  <Route path="/contact" element={<ContactPage />} />
                  <Route path="/adherer" element={<JoinPage />} />
                  <Route path="/faire-un-don" element={<DonatePage />} />

                  {/* Pages admin */}
                  <Route path="/admin/login" element={<AdminLogin />} />
                  <Route path="/admin/dashboard" element={<AdminDashboard />} />
                  <Route path="/admin/galerie" element={<AdminGallery />} />
                  <Route path="/admin/blog" element={<AdminBlog />} />
                  <Route path="/admin/messages" element={<AdminMessages />} />
                  <Route path="/admin/dons" element={<AdminDonations />} />

                  {/* Fallback */}
                  <Route path="*" element={<HomePage />} />
                </Routes>
              </Suspense>
            </main>

            <Footer />
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