import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";

import HomePage from "./pages/HomePage";
import AuthPage from "./pages/AuthPage";
import PrivacyPage from "./pages/PrivacyPage";
import TermsPage from "./pages/TermsPage";
import ContactPage from "./pages/ContactPage";
import AboutPage from "./pages/About";
import CareersPage from "./pages/Careers";
import PricingPage from "./pages/Pricing";
import SecurityPage from "./pages/Security";
import Dashboard from "./pages/Dashboard";
import AdminLoginPage from "./pages/AdminLogin";
import AdminDashboard from "./pages/Admin/AdminDashboard";
import PublicFilesPage from "./pages/Public_Files";

import { Toaster } from "react-hot-toast";
import type { JSX } from "react";
import "./App.css";

function ProtectedRoute({ children }: { children: JSX.Element }) {
  const { token, loading } = useAuth();

  if (loading) return <div>Loading...</div>;
  if (!token) return <Navigate to="/login" replace />;

  return children;
}

export default function App() {
  return (
    <>
      <Routes>
        {/* Redirect root */}
        <Route path="/" element={<Navigate to="/home" replace />} />

        {/* Public routes */}
        <Route path="/home" element={<HomePage />} />
        <Route path="/login" element={<AuthPage mode="login" />} />
        <Route path="/signup" element={<AuthPage mode="signup" />} />
        <Route path="/privacy" element={<PrivacyPage />} />
        <Route path="/terms" element={<TermsPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/careers" element={<CareersPage />} />
        <Route path="/pricing" element={<PricingPage />} />
        <Route path="/security" element={<SecurityPage />} />
        <Route path="/public" element={<PublicFilesPage />} />
        <Route path="/admin-login" element={<AdminLoginPage />} />

        {/* Protected routes */}
        <Route
          path="/dashboard/*"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin-dashboard/*"
          element={
            <ProtectedRoute>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

        {/* Catch-all */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>

      <Toaster position="top-right" toastOptions={{ duration: 3000 }} />
    </>
  );
}