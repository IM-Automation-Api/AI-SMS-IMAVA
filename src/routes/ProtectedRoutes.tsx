
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

// This component is no longer used directly in Routes.tsx
// It's here for reference in case we want to refactor back to a component-based approach
export function ProtectedRoutes() {
  const { user } = useAuth();
  
  if (!user) {
    return <Navigate to="/" replace />;
  }
  
  // A component that contains Route elements cannot be used directly as a child of Routes
  // Instead, we need to render the routes individually in the parent Routes component
  return (
    <>
      <Route
        path="/dashboard"
        element={
          <DashboardLayout>
            <Suspense fallback={<ContentLoader />}>
              <Dashboard />
            </Suspense>
          </DashboardLayout>
        }
      />
      
      <Route
        path="/assistants"
        element={
          <DashboardLayout>
            <Suspense fallback={<ContentLoader />}>
              <AssistantsPage />
            </Suspense>
          </DashboardLayout>
        }
      />
      
      {/* Messages routes - special handling for mobile */}
      <Route
        path="/messages"
        element={
          <DashboardLayout>
            <Suspense fallback={<ContentLoader />}>
              <MessagesPage />
            </Suspense>
          </DashboardLayout>
        }
      />
      
      <Route
        path="/messages/contacts"
        element={
          <DashboardLayout>
            <Suspense fallback={<ContentLoader />}>
              <div className="h-[calc(100vh-5rem)]">
                <MessagesSidebar />
              </div>
            </Suspense>
          </DashboardLayout>
        }
      />
      
      <Route
        path="/leads"
        element={
          <DashboardLayout>
            <Suspense fallback={<ContentLoader />}>
              <Leads />
            </Suspense>
          </DashboardLayout>
        }
      />
      
      <Route
        path="/campaigns"
        element={
          <DashboardLayout>
            <Suspense fallback={<ContentLoader />}>
              <SMSCampaignPage />
            </Suspense>
          </DashboardLayout>
        }
      />
      
      <Route
        path="/agent-builder"
        element={
          <DashboardLayout>
            <Suspense fallback={<ContentLoader />}>
              <AgentBuilder />
            </Suspense>
          </DashboardLayout>
        }
      />
      
      <Route
        path="/settings"
        element={
          <SettingsLayout>
            <Suspense fallback={<ContentLoader />}>
              <SettingsPage />
            </Suspense>
          </SettingsLayout>
        }
      />
      
      <Route
        path="/settings/ai-settings"
        element={
          <SettingsLayout>
            <Suspense fallback={<ContentLoader />}>
              <AISettingsPage />
            </Suspense>
          </SettingsLayout>
        }
      />
    </>
  );
}
