import React from 'react';
import { BrowserRouter, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import CustomCursor from './components/layout/CustomCursor';

// Public pages
import Home from './pages/Home';
import GemListing from './pages/GemListing';
import GemDetail from './pages/GemDetail';
import OurWorks from './pages/OurWorks';
import AboutUs from './pages/AboutUs';
import Enquiry from './pages/Enquiry';
import Contact from './pages/Contact';
import Login from './pages/auth/Login';

// Admin pages
import AdminLayout from './pages/admin/AdminLayout';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminEnquiries from './pages/admin/AdminEnquiries';
import AdminOrders from './pages/admin/AdminOrders';

import { useAuthStore } from './stores/authStore';

const NO_LAYOUT = ['/login'];

const pageVariants = {
  initial: { opacity: 0, y: 12 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.25, ease: [0.22, 1, 0.36, 1] },
  },
  exit: {
    opacity: 0,
    y: -6,
    transition: { duration: 0.15, ease: 'easeIn' },
  },
};

function PlaceholderPage({ title }) {
  return (
    <div style={{ minHeight: '100vh', paddingTop: '80px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#EFE5CC' }}>
      <div style={{ textAlign: 'center' }}>
        <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 300, fontSize: '3rem', color: '#1E0E06', marginBottom: '0.5rem' }}>{title}</h1>
        <p style={{ fontFamily: "'EB Garamond', serif", fontSize: '1rem', color: '#6B5548' }}>Coming soon.</p>
      </div>
    </div>
  );
}

// ── Admin guard — redirects to /login if not admin ───────────────────────────
function RequireAdmin({ children }) {
  const { token, user } = useAuthStore();
  if (!token) return <Navigate to="/login" replace />;
  if (!['admin', 'sub_admin'].includes(user?.role)) return <Navigate to="/" replace />;
  return children;
}

// ── Animated App ─────────────────────────────────────────────────────────────
function AnimatedApp() {
  const location = useLocation();

  const isNoLayout = NO_LAYOUT.includes(location.pathname);
  const isAdmin = location.pathname.startsWith('/admin');

  return (
    <>
      <CustomCursor />

      {/* Navbar — hide on auth and admin pages */}
      {!isNoLayout && !isAdmin && <Navbar />}

      <AnimatePresence mode="wait">
        <motion.main
          key={location.pathname}
          variants={pageVariants}
          initial="initial"
          animate="animate"
          exit="exit"
        >
          <Routes location={location}>
            {/* ── Public ── */}
            <Route path="/" element={<Home />} />
            <Route path="/gems" element={<GemListing />} />
            <Route path="/gems/:slug" element={<GemDetail />} />
            <Route path="/works" element={<OurWorks />} />
            <Route path="/about" element={<AboutUs />} />
            <Route path="/enquiry" element={<Enquiry />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/login" element={<Login />} />

            {/* ── Admin (protected) ── */}
            <Route path="/admin" element={<RequireAdmin><AdminLayout /></RequireAdmin>}>
              <Route index element={<AdminDashboard />} />
              <Route path="enquiries" element={<AdminEnquiries />} />
              <Route path="orders" element={<AdminOrders />} />
            </Route>

            <Route path="*" element={<PlaceholderPage title="Page Not Found" />} />
          </Routes>
        </motion.main>
      </AnimatePresence>

      {/* Footer — hide on auth and admin pages */}
      {!isNoLayout && !isAdmin && <Footer />}
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AnimatedApp />
    </BrowserRouter>
  );
}
