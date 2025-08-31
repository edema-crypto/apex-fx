import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Layout from './components/Layout/Layout';
import AdminLayout from './components/Admin/AdminLayout';
import AuthWrapper from './components/Auth/AuthWrapper';
import ProtectedRoute from './components/Routes/ProtectedRoute';
import Dashboard from './components/Home/Dashboard';
import DepositPage from './components/Deposit/DepositPage';
import WithdrawPage from './components/Withdraw/WithdrawPage';
import TransactionsPage from './components/Transactions/TransactionsPage';
import AdminDashboard from './components/Admin/AdminDashboard';
import AdminLogin from './components/Auth/AdminLogin';
import Onboarding from './components/Onboarding/Onboarding';
import AdminUserDetail from './components/Admin/AdminUserDetail';
import AdminUsersList from './components/Admin/AdminUsersList';
import SettingsPage from './components/Settings/SettingsPage';

const AppContent: React.FC = () => {
  const { user, isAuthenticated, isAdminAuthenticated, logout, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-deep-black flex items-center justify-center">
        <div className="text-center">
          <img src="https://otiktpyazqotihijbwhm.supabase.co/storage/v1/object/public/images/ec1e8e78-e8e4-4f4d-a225-181630b1f3cd-ChatGPT_Image_Aug_28__2025__12_07_34_AM-removebg-preview.png" alt="ApexFX" className="h-16 mx-auto mb-4 animate-pulse" />
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-neon-green mx-auto mb-4"></div>
          <p className="text-slate-400">Loading ApexFX...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-deep-black text-slate-100">
        <Routes>
          {/* Admin route is always available: shows login if not admin-authenticated */}
          <Route path="/admin" element={
            isAdminAuthenticated ? (
              <ProtectedRoute requireAdmin>
                <AdminLayout onLogout={logout}>
                  <AdminDashboard />
                </AdminLayout>
              </ProtectedRoute>
            ) : (
              <AdminLogin />
            )
          } />

          <Route path="/admin/users" element={
            isAdminAuthenticated ? (
              <ProtectedRoute requireAdmin>
                <AdminLayout onLogout={logout}>
                  <AdminUsersList />
                </AdminLayout>
              </ProtectedRoute>
            ) : (
              <AdminLogin />
            )
          } />

          <Route path="/admin/users/:id" element={
            isAdminAuthenticated ? (
              <ProtectedRoute requireAdmin>
                <AdminLayout onLogout={logout}>
                  <AdminUserDetail />
                </AdminLayout>
              </ProtectedRoute>
            ) : (
              <AdminLogin />
            )
          } />

          {/* User routes */}
          <Route path="/" element={
            isAuthenticated ? (
              <ProtectedRoute>
                <Layout user={user!} onLogout={logout}>
                  <Dashboard user={user!} transactions={user?.transactions || []} />
                </Layout>
              </ProtectedRoute>
            ) : (
              <AuthWrapper />
            )
          } />

          <Route path="/deposit" element={
            isAuthenticated ? (
              <ProtectedRoute>
                <Layout user={user!} onLogout={logout}>
                  <DepositPage />
                </Layout>
              </ProtectedRoute>
            ) : (
              <Navigate to="/" replace />
            )
          } />

          <Route path="/withdraw" element={
            isAuthenticated ? (
              <ProtectedRoute>
                <Layout user={user!} onLogout={logout}>
                  <WithdrawPage />
                </Layout>
              </ProtectedRoute>
            ) : (
              <Navigate to="/" replace />
            )
          } />

          <Route path="/transactions" element={
            isAuthenticated ? (
              <ProtectedRoute>
                <Layout user={user!} onLogout={logout}>
                  <TransactionsPage />
                </Layout>
              </ProtectedRoute>
            ) : (
              <Navigate to="/" replace />
            )
          } />

          <Route path="/onboarding" element={
            isAuthenticated ? (
              <ProtectedRoute>
                <Layout user={user!} onLogout={logout}>
                  <Onboarding />
                </Layout>
              </ProtectedRoute>
            ) : (
              <Navigate to="/" replace />
            )
          } />

          <Route path="/settings" element={
            isAuthenticated ? (
              <ProtectedRoute>
                <Layout user={user!} onLogout={logout}>
                  <SettingsPage />
                </Layout>
              </ProtectedRoute>
            ) : (
              <Navigate to="/" replace />
            )
          } />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
        <Toaster position="top-right" toastOptions={{
          style: {
            background: '#111111',
            color: '#f1f5f9',
            border: '1px solid #334155'
          }
        }} />
      </Router>
    </AuthProvider>
  );
}

export default App;