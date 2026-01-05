import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import MenuPage from './pages/MenuPage';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import AdminCookies from './pages/AdminCookies';
import AdminReviews from './pages/AdminReviews';
import AdminOrders from './pages/AdminOrders';
import AdminAnalytics from './pages/AdminAnalytics';
import ProtectedRoute from './components/ProtectedRoute';

function AppContent() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');

  return (
    <div className="min-h-screen relative">
      {/* Only show decorations on customer pages */}
      {!isAdminRoute && (
        <>
          {/* Chocolate Particles */}
          <div className="fixed inset-0 pointer-events-none z-40 overflow-hidden">
            {[...Array(20)].map((_, i) => (
              <div
                key={i}
                className="absolute bg-amber-900 rounded-full opacity-40"
                style={{
                  width: Math.random() * 8 + 3 + 'px',
                  height: Math.random() * 8 + 3 + 'px',
                  left: Math.random() * 100 + '%',
                  animation: `chocolateFall ${Math.random() * 15 + 10}s linear infinite`,
                  animationDelay: Math.random() * 5 + 's',
                }}
              />
            ))}
          </div>

          <Navbar />
        </>
      )}

      <main>
        <Routes>
          {/* Customer Routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/menu" element={<MenuPage />} />

          {/* Admin Routes */}
          <Route path="/admin" element={<AdminLogin />} />
          <Route path="/admin/dashboard" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
          <Route path="/admin/analytics" element={<ProtectedRoute><AdminAnalytics /></ProtectedRoute>} />
          <Route path="/admin/cookies" element={<ProtectedRoute><AdminCookies /></ProtectedRoute>} />
          <Route path="/admin/reviews" element={<ProtectedRoute><AdminReviews /></ProtectedRoute>} />
          <Route path="/admin/orders" element={<ProtectedRoute><AdminOrders /></ProtectedRoute>} />
        </Routes>
      </main>

      {/* Only show footer on customer pages */}
      {!isAdminRoute && (
        <>
          <Footer />
        </>
      )}

      <style>{`
        @keyframes chocolateFall {
          0% {
            transform: translateY(-10vh) rotate(0deg);
            opacity: 0;
          }
          10% {
            opacity: 0.4;
          }
          90% {
            opacity: 0.4;
          }
          100% {
            transform: translateY(110vh) rotate(360deg);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
