
import React from 'react';
import { Route, Navigate } from 'react-router-dom';
import { useAuth } from '@/lib/supabase/auth/auth-context';
import LoginPage from '@/pages/LoginPage';
import SignupPage from '@/pages/SignupPage';
import ForgotPasswordPage from '@/pages/ForgotPasswordPage';
import { PageLoader } from './PageLoader';

// This component is no longer used directly in Routes.tsx
// It's here for reference in case we want to refactor back to a component-based approach
export function AuthRoutes() {
  const { user, loading } = useAuth();
  
  // A component that contains Route elements cannot be used directly as a child of Routes
  // Instead, we need to render the routes individually in the parent Routes component
  return (
    <>
      <Route 
        path="/" 
        element={loading ? <PageLoader /> : user ? <Navigate to="/dashboard" replace /> : <LoginPage />} 
      />
      <Route 
        path="/signup" 
        element={loading ? <PageLoader /> : user ? <Navigate to="/dashboard" replace /> : <SignupPage />} 
      />
      <Route 
        path="/forgot-password" 
        element={<ForgotPasswordPage />} 
      />
    </>
  );
}
