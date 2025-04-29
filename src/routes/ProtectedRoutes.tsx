
import React, { Suspense } from 'react';
import { Route, Navigate } from 'react-router-dom';
import { useAuth } from '@/lib/supabase/auth/auth-context';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { SettingsLayout } from '@/components/layout/SettingsLayout';
import Dashboard from '@/pages/Dashboard';
import AssistantsPage from '@/pages/AssistantsPage';
import MessagesPage from '@/pages/MessagesPage';
import Leads from '@/pages/Leads';
import SMSCampaignPage from '@/pages/SMSCampaignPage';
import AgentBuilder from '@/pages/AgentBuilder';
import SettingsPage from '@/pages/SettingsPage';
import AISettingsPage from '@/pages/AISettingsPage';
import { ContentLoader } from './PageLoader';
import { MessagesSidebar } from '@/components/messages/MessagesSidebar';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

// Authentication guard component
const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return <div className="h-screen flex items-center justify-center"><ContentLoader /></div>;
  }
  
  if (!user) {
    return <Navigate to="/" replace />;
  }
  
  return <>{children}</>;
};

// Mobile message contacts page wrapper
const MessagesContactsPage = () => {
  return (
    <div className="h-[calc(100vh-5rem)]">
      <MessagesSidebar />
    </div>
  );
};

export function ProtectedRoutes() {
  return (
    <>
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <Suspense fallback={<ContentLoader />}>
                <Dashboard />
              </Suspense>
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
      
      <Route
        path="/assistants"
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <Suspense fallback={<ContentLoader />}>
                <AssistantsPage />
              </Suspense>
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
      
      {/* Messages routes - special handling for mobile */}
      <Route
        path="/messages"
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <Suspense fallback={<ContentLoader />}>
                <MessagesPage />
              </Suspense>
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
      
      <Route
        path="/messages/contacts"
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <Suspense fallback={<ContentLoader />}>
                <MessagesContactsPage />
              </Suspense>
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
      
      <Route
        path="/leads"
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <Suspense fallback={<ContentLoader />}>
                <Leads />
              </Suspense>
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
      
      <Route
        path="/campaigns"
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <Suspense fallback={<ContentLoader />}>
                <SMSCampaignPage />
              </Suspense>
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
      
      <Route
        path="/agent-builder"
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <Suspense fallback={<ContentLoader />}>
                <AgentBuilder />
              </Suspense>
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
      
      <Route
        path="/settings"
        element={
          <ProtectedRoute>
            <SettingsLayout>
              <Suspense fallback={<ContentLoader />}>
                <SettingsPage />
              </Suspense>
            </SettingsLayout>
          </ProtectedRoute>
        }
      />
      
      <Route
        path="/settings/ai-settings"
        element={
          <ProtectedRoute>
            <SettingsLayout>
              <Suspense fallback={<ContentLoader />}>
                <AISettingsPage />
              </Suspense>
            </SettingsLayout>
          </ProtectedRoute>
        }
      />
    </>
  );
}
