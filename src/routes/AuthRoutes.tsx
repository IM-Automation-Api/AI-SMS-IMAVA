
import React from 'react';
import { Route, Navigate } from 'react-router-dom';
import { useAuth } from '@/lib/supabase/auth/auth-context';
import LoginPage from '@/pages/LoginPage';
import SignupPage from '@/pages/SignupPage';
import ForgotPasswordPage from '@/pages/ForgotPasswordPage';
import { PageLoader } from './PageLoader';

interface AuthRoutesProps {
  loading: boolean;
}

export function AuthRoutes({ loading }: AuthRoutesProps) {
  const { user } = useAuth();
  
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
