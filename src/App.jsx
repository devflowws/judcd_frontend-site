import { lazy, Suspense } from 'react';
import { Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { ThemeProvider } from '@context/ThemeContext';
import { LanguageProvider } from '@context/LanguageContext';
import { AuthProvider, useAuth } from '@context/AuthContext';
import Header from '@components/layout/Header/Header';
import Footer from '@components/layout/Footer/Footer';
import ScrollToTop from '@components/ui/ScrollToTop/ScrollToTop';
import { PageLoader, Spinner } from '@components/ui/Loader/Loader';

// Admin pages — imports statiques (pas de loader premium)
import AdminLogin from '@pages/Admin/AdminLogin';
import AdminDashboard from '@pages/Admin/AdminDashboard';
import AdminGallery from '@pages/Admin/Gallery';
import AdminBlog from '@pages/Admin/Blog';
import AdminMessages from '@pages/Admin/Messages';
import AdminDonations from '@pages/Admin/Donations';
import AdminAdhesions from '@pages/Admin/Adhesions';
import AdminTeam from '@pages/Admin/Team';
import AdminPartners from '@pages/Admin/Partners';
import AdminTestimonials from '@pages/Admin/Testimonials';
import AdminActions from '@pages/Admin/Actions';
import AdminTypes from '@pages/Admin/Types';
import AdminNewsletter from '@pages/Admin/Newsletter';

// Pages publiques — lazy loading
const HomePage = lazy(() => import('@pages/Home/HomePage'));
const AboutPage = lazy(() => import('@pages/About/AboutPage'));
const TeamPage = lazy(() => import('@pages/Team/TeamPage'));
const GalleryPage = lazy(() => import('@pages/Gallery/GalleryPage'));
const BlogPage       = lazy(() => import('@pages/Blog/BlogPage'));
const ArticleDetail  = lazy(() => import('@pages/Blog/ArticleDetail'));
const ContactPage = lazy(() => import('@pages/Contact/ContactPage'));
const JoinPage = lazy(() => import('@pages/Join/JoinPage'));
const RegisterPage = lazy(() => import('@pages/Join/RegisterPage'));
const DonatePage = lazy(() => import('@pages/Donate/DonatePage'));

function AdminLoader() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <Spinner size="lg" />
    </div>
  );
}

function ProtectedRoute({ children }) {
  const { isAuthenticated, isLoading } = useAuth();
  if (isLoading) return <AdminLoader />;
  if (!isAuthenticated) return <Navigate to="/admin/login" replace />;
  return children;
}

function AppLayout({ children }) {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');

  if (isAdminRoute) {
    return <>{children}</>;
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
      <ScrollToTop />
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <AuthProvider>
          <AppLayout>
            <Suspense fallback={<PageLoader />}>
              <Routes>
                {/* Pages publiques */}
                <Route path="/" element={<HomePage />} />
                <Route path="/a-propos" element={<AboutPage />} />
                <Route path="/equipe" element={<TeamPage />} />
                <Route path="/galerie" element={<GalleryPage />} />
                <Route path="/actualites" element={<BlogPage />} />
                <Route path="/actualites/:slug" element={<ArticleDetail />} />
                <Route path="/contact" element={<ContactPage />} />
                <Route path="/adherer" element={<JoinPage />} />
                <Route path="/inscription" element={<RegisterPage />} />
                <Route path="/faire-un-don" element={<DonatePage />} />

                {/* Login admin — public */}
                <Route path="/admin/login" element={<AdminLogin />} />

                {/* Pages admin — protégées */}
                <Route path="/admin/dashboard" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
                <Route path="/admin/galerie" element={<ProtectedRoute><AdminGallery /></ProtectedRoute>} />
                <Route path="/admin/blog" element={<ProtectedRoute><AdminBlog /></ProtectedRoute>} />
                <Route path="/admin/messages" element={<ProtectedRoute><AdminMessages /></ProtectedRoute>} />
                <Route path="/admin/dons" element={<ProtectedRoute><AdminDonations /></ProtectedRoute>} />
                <Route path="/admin/adhesions" element={<ProtectedRoute><AdminAdhesions /></ProtectedRoute>} />
                <Route path="/admin/equipe" element={<ProtectedRoute><AdminTeam /></ProtectedRoute>} />
                <Route path="/admin/partenaires" element={<ProtectedRoute><AdminPartners /></ProtectedRoute>} />
                <Route path="/admin/temoignages" element={<ProtectedRoute><AdminTestimonials /></ProtectedRoute>} />
                <Route path="/admin/actions" element={<ProtectedRoute><AdminActions /></ProtectedRoute>} />
                <Route path="/admin/newsletter" element={<ProtectedRoute><AdminNewsletter /></ProtectedRoute>} />
                <Route path="/admin/types/:category" element={<ProtectedRoute><AdminTypes /></ProtectedRoute>} />
                <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />

                {/* Fallback */}
                <Route path="*" element={<HomePage />} />
              </Routes>
            </Suspense>
          </AppLayout>

          <Toaster
            position="top-right"
            toastOptions={{
              duration: 5000,
              style: { borderRadius: '12px', padding: '16px', fontFamily: 'Poppins, sans-serif', fontSize: '14px' },
              success: { iconTheme: { primary: '#008751', secondary: '#FFFFFF' } },
              error: { iconTheme: { primary: '#D21034', secondary: '#FFFFFF' } },
            }}
          />
        </AuthProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
}
