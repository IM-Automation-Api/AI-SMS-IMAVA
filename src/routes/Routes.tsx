
import React from "react";
import { Routes as ReactRoutes, Route } from "react-router-dom";
import NotFound from "@/pages/NotFound";
import { useAuth } from "@/lib/supabase/auth/auth-context";
import { AuthRoutes } from "./AuthRoutes";
import { ProtectedRoutes } from "./ProtectedRoutes";
import { PageLoader } from "./PageLoader";

export const Routes = () => {
  const { loading } = useAuth();
  
  if (loading) {
    return <PageLoader />;
  }
  
  return (
    <ReactRoutes>
      {/* Public routes */}
      <AuthRoutes />
      
      {/* Protected routes */}
      <ProtectedRoutes />
      
      {/* Catch-all route */}
      <Route path="*" element={<NotFound />} />
    </ReactRoutes>
  );
};
