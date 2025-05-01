
import React from "react";
import { Routes as ReactRoutes, Route } from "react-router-dom";
import NotFound from "@/pages/NotFound";
import { useAuth } from "@/lib/supabase/auth/auth-context";
import LoginPage from "@/pages/LoginPage";
import SignupPage from "@/pages/SignupPage";
import ForgotPasswordPage from "@/pages/ForgotPasswordPage";
import Dashboard from "@/pages/Dashboard";
import AssistantsPage from "@/pages/AssistantsPage";
import MessagesPage from "@/pages/MessagesPage";
import Leads from "@/pages/Leads";
import AgentBuilder from "@/pages/AgentBuilder";
import SettingsPage from "@/pages/SettingsPage";
import AISettingsPage from "@/pages/AISettingsPage";
import { PageLoader, ContentLoader } from "./PageLoader";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { SettingsLayout } from "@/components/layout/SettingsLayout";
import { MessagesSidebar } from "@/components/messages/MessagesSidebar";
import { Navigate } from "react-router-dom";

export const Routes = () => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return <PageLoader />;
  }
  
  return (
    <ReactRoutes>
      {/* Public/Auth routes */}
      <Route 
        path="/" 
        element={user ? <Navigate to="/dashboard" replace /> : <LoginPage />} 
      />
      <Route 
        path="/signup" 
        element={user ? <Navigate to="/dashboard" replace /> : <SignupPage />} 
      />
      <Route 
        path="/forgot-password" 
        element={<ForgotPasswordPage />} 
      />
      
      {/* Protected routes */}
      <Route
        path="/dashboard"
        element={
          user ? (
            <DashboardLayout>
              <Dashboard />
            </DashboardLayout>
          ) : (
            <Navigate to="/" replace />
          )
        }
      />
      
      <Route
        path="/assistants"
        element={
          user ? (
            <DashboardLayout>
              <AssistantsPage />
            </DashboardLayout>
          ) : (
            <Navigate to="/" replace />
          )
        }
      />
      
      <Route
        path="/messages"
        element={
          user ? (
            <DashboardLayout>
              <MessagesPage />
            </DashboardLayout>
          ) : (
            <Navigate to="/" replace />
          )
        }
      />
      
      <Route
        path="/messages/contacts"
        element={
          user ? (
            <DashboardLayout>
              <div className="h-[calc(100vh-5rem)]">
                <MessagesSidebar />
              </div>
            </DashboardLayout>
          ) : (
            <Navigate to="/" replace />
          )
        }
      />
      
      <Route
        path="/leads"
        element={
          user ? (
            <DashboardLayout>
              <Leads />
            </DashboardLayout>
          ) : (
            <Navigate to="/" replace />
          )
        }
      />
      
      <Route
        path="/agent-builder"
        element={
          user ? (
            <DashboardLayout>
              <AgentBuilder />
            </DashboardLayout>
          ) : (
            <Navigate to="/" replace />
          )
        }
      />
      
      <Route
        path="/settings"
        element={
          user ? (
            <SettingsLayout>
              <SettingsPage />
            </SettingsLayout>
          ) : (
            <Navigate to="/" replace />
          )
        }
      />
      
      <Route
        path="/settings/ai-settings"
        element={
          user ? (
            <SettingsLayout>
              <AISettingsPage />
            </SettingsLayout>
          ) : (
            <Navigate to="/" replace />
          )
        }
      />

      {/* Catch-all route */}
      <Route path="*" element={<NotFound />} />
    </ReactRoutes>
  );
};
