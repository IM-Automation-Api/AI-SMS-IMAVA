
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import Index from "./pages/Index";
import LoginPage from "./pages/LoginPage";
import Dashboard from "./pages/Dashboard";
import AgentBuilder from "./pages/AgentBuilder";
import NotFound from "./pages/NotFound";
import { DashboardLayout } from "./components/layout/DashboardLayout";
import { SettingsLayout } from "./components/layout/SettingsLayout";
import MessagesPage from "./pages/MessagesPage";
import Leads from "./pages/Leads";
import AssistantsPage from "./pages/AssistantsPage";
import SettingsPage from "./pages/SettingsPage";
import AISettingsPage from "./pages/AISettingsPage";
import SignupPage from "./pages/SignupPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import SMSCampaignPage from "./pages/SMSCampaignPage";
import OnboardingPage from "./pages/OnboardingPage";
import { useAuth } from "./lib/supabase/auth/auth-context";
import { Suspense, lazy, useEffect } from "react";
import { Skeleton } from "./components/ui/skeleton";

// Improved loading component with better visual feedback
const PageLoader = () => (
  <div className="flex min-h-[80vh] items-center justify-center">
    <div className="flex flex-col items-center space-y-4">
      <div className="w-12 h-12 border-t-2 border-b-2 border-purple-500 rounded-full animate-spin"></div>
      <p className="text-sm text-muted-foreground animate-pulse">Loading...</p>
    </div>
  </div>
);

// More granular skeleton loader for content areas
const ContentLoader = () => (
  <div className="space-y-4 w-full max-w-3xl mx-auto">
    <Skeleton className="h-8 w-1/3" />
    <Skeleton className="h-32 w-full" />
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <Skeleton className="h-24" />
      <Skeleton className="h-24" />
    </div>
  </div>
);

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading, isOnboardingCompleted } = useAuth();
  
  if (loading) {
    return <PageLoader />;
  }
  
  if (!user) {
    return <Navigate to="/" replace />;
  }
  
  if (!isOnboardingCompleted()) {
    return <Navigate to="/onboarding" replace />;
  }
  
  return <>{children}</>;
};

const OnboardingProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading, isOnboardingCompleted } = useAuth();
  
  if (loading) {
    return <PageLoader />;
  }
  
  if (!user) {
    return <Navigate to="/" replace />;
  }
  
  if (isOnboardingCompleted()) {
    return <Navigate to="/dashboard" replace />;
  }
  
  return <>{children}</>;
};

const App = () => {
  const { user, loading } = useAuth();
  const location = useLocation();
  
  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);
  
  return (
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <Routes>
        {/* Public routes */}
        <Route path="/" element={
          loading ? <PageLoader /> : (user ? <Navigate to="/dashboard" replace /> : <LoginPage />)
        } />
        
        <Route path="/signup" element={
          loading ? <PageLoader /> : (user ? <Navigate to="/dashboard" replace /> : <SignupPage />)
        } />
        
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        
        {/* Onboarding route - protected but doesn't require completed onboarding */}
        <Route path="/onboarding" element={
          <OnboardingProtectedRoute>
            <OnboardingPage />
          </OnboardingProtectedRoute>
        } />
        
        {/* Protected routes - require completed onboarding */}
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <DashboardLayout>
              <Suspense fallback={<ContentLoader />}>
                <Dashboard />
              </Suspense>
            </DashboardLayout>
          </ProtectedRoute>
        } />
        
        <Route path="/assistants" element={
          <ProtectedRoute>
            <DashboardLayout>
              <Suspense fallback={<ContentLoader />}>
                <AssistantsPage />
              </Suspense>
            </DashboardLayout>
          </ProtectedRoute>
        } />
        
        <Route path="/messages" element={
          <ProtectedRoute>
            <DashboardLayout>
              <MessagesPage />
            </DashboardLayout>
          </ProtectedRoute>
        } />
        
        <Route path="/leads" element={
          <ProtectedRoute>
            <DashboardLayout>
              <Suspense fallback={<ContentLoader />}>
                <Leads />
              </Suspense>
            </DashboardLayout>
          </ProtectedRoute>
        } />
        
        <Route path="/campaigns" element={
          <ProtectedRoute>
            <DashboardLayout>
              <Suspense fallback={<ContentLoader />}>
                <SMSCampaignPage />
              </Suspense>
            </DashboardLayout>
          </ProtectedRoute>
        } />
        
        <Route path="/agent-builder" element={
          <ProtectedRoute>
            <DashboardLayout>
              <Suspense fallback={<ContentLoader />}>
                <AgentBuilder />
              </Suspense>
            </DashboardLayout>
          </ProtectedRoute>
        } />
        
        <Route path="/settings" element={
          <ProtectedRoute>
            <SettingsLayout>
              <Suspense fallback={<ContentLoader />}>
                <SettingsPage />
              </Suspense>
            </SettingsLayout>
          </ProtectedRoute>
        } />
        
        <Route path="/settings/ai-settings" element={
          <ProtectedRoute>
            <SettingsLayout>
              <Suspense fallback={<ContentLoader />}>
                <AISettingsPage />
              </Suspense>
            </SettingsLayout>
          </ProtectedRoute>
        } />
        
        <Route path="*" element={<NotFound />} />
      </Routes>
    </TooltipProvider>
  );
};

export default App;
