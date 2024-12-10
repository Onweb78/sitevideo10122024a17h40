import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { AdminProvider } from './contexts/AdminContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { InterstitialAd } from './components/InterstitialAd';
import { UserLayout } from './layouts/UserLayout';
import { AdminLayout } from './layouts/AdminLayout';
import { Home } from './pages/Home';
import { Movies } from './pages/Movies';
import { MovieDetails } from './pages/MovieDetails';
import { TVShowDetails } from './pages/TVShowDetails';
import { ActorDetails } from './pages/ActorDetails';
import { TVShows } from './pages/TVShows';
import { Latest } from './pages/Latest';
import { Favorites } from './pages/Favorites';
import { AuthPage } from './pages/auth/AuthPage';
import { Profile } from './pages/Profile';
import { Contact } from './pages/Contact';
import { PasswordPage } from './pages/PasswordPage';
import { AdminLogin } from './pages/admin/AdminLogin';
import { AdminUsers } from './pages/admin/AdminUsers';
import { AdminAdministrators } from './pages/admin/AdminAdministrators';
import { AdminCreateUser } from './pages/admin/AdminCreateUser';
import { AdminPages } from './pages/admin/AdminPages';
import { AdminSynthesis } from './pages/admin/AdminSynthesis';
import { AdminContactCategories } from './pages/admin/contact/AdminContactCategories';
import { AdminEmailConfig } from './pages/admin/contact/AdminEmailConfig';
import { AdminAds } from './pages/admin/AdminAds';
import { UserWelcome } from './pages/UserWelcome';
import { Terms } from './pages/Terms';
import { Privacy } from './pages/Privacy';
import { DynamicPage } from './pages/DynamicPage';

export default function App() {
  return (
    <AuthProvider>
      <AdminProvider>
        <Router>
          <div className="min-h-screen bg-gray-900 flex flex-col">
            <InterstitialAd />
            <Navbar />
            <div className="flex-1">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/movies" element={<Movies />} />
                <Route path="/movie/:id" element={<MovieDetails />} />
                <Route path="/tv/:id" element={<TVShowDetails />} />
                <Route path="/actor/:id" element={<ActorDetails />} />
                <Route path="/series" element={<TVShows />} />
                <Route path="/latest" element={<Latest />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/auth" element={<AuthPage />} />
                <Route path="/terms" element={<Terms />} />
                <Route path="/privacy" element={<Privacy />} />
                <Route path="/:pageId" element={<DynamicPage />} />
                <Route path="/favorites" element={<Favorites />} />

                <Route element={<UserLayout />}>
                  <Route path="/profile" element={<Profile />} />
                  <Route path="/password" element={<PasswordPage />} />
                  <Route path="/" element={<UserWelcome />} />
                </Route>

                <Route element={<AdminLayout />}>
                  <Route path="/admin" element={<AdminSynthesis />} />
                  <Route path="/admin/users" element={<AdminUsers />} />
                  <Route path="/admin/administrators" element={<AdminAdministrators />} />
                  <Route path="/admin/create-user" element={<AdminCreateUser />} />
                  <Route path="/admin/pages" element={<AdminPages />} />
                  <Route path="/admin/ads" element={<AdminAds />} />
                  <Route path="/admin/contact/categories" element={<AdminContactCategories />} />
                  <Route path="/admin/contact/email-config" element={<AdminEmailConfig />} />
                </Route>
              </Routes>
            </div>
            <Footer />
          </div>
        </Router>
      </AdminProvider>
    </AuthProvider>
  );
}