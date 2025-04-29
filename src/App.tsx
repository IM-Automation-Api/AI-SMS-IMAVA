
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

// Loading component that's smaller and cleaner than the current loading UI
const PageLoader = () => (
  <div className="flex min-h-[80vh] items-center justify-center">
    <div className="flex flex-col items-center space-y-4">
      <div className="w-10 h-10 border-t-2 border-b-2 border-purple-500 rounded-full animate-spin"></div>
    </div>
  </div>
);

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading, isOnboardingCompleted } = useAuth();
  
  if (loading) {
    return <PageLoader />;
  }
  
  if (!user) {
    console.log("Protected route: No user, redirecting to login");
    return <Navigate to="/" replace />;
  }
  
  // If user hasn't completed onboarding, redirect them
  if (!isOnboardingCompleted()) {
    console.log("Protected route: Onboarding not completed, redirecting to onboarding");
    return <Navigate to="/onboarding" replace />;
  }
  
  return <Suspense fallback={<PageLoader />}>{children}</Suspense>;
};

const OnboardingProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading, isOnboardingCompleted } = useAuth();
  
  if (loading) {
    return <PageLoader />;
  }
  
  if (!user) {
    console.log("Onboarding route: No user, redirecting to login");
    return <Navigate to="/" replace />;
  }
  
  // If user has completed onboarding, redirect to dashboard
  if (isOnboardingCompleted()) {
    console.log("Onboarding route: Onboarding already completed, redirecting to dashboard");
    return <Navigate to="/dashboard" replace />;
  }
  
  return <Suspense fallback={<PageLoader />}>{children}</Suspense>;
};

const App = () => {
  const { user, loading } = useAuth();
  const location = useLocation();
  
  // Use effect to scroll to top on route change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);
  
  if (loading) {
    return (
      <TooltipProvider>
        <div className="flex min-h-screen items-center justify-center">
          <div className="flex flex-col items-center space-y-4">
            <div className="w-10 h-10 border-t-2 border-b-2 border-purple-500 rounded-full animate-spin"></div>
          </div>
        </div>
      </TooltipProvider>
    );
  }
  
  return (
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <Routes>
        {/* Public routes - wrapped in Suspense for code splitting benefits */}
        <Route path="/" element={
          <Suspense fallback={<PageLoader />}>
            {user ? <Navigate to="/dashboard" replace /> : <LoginPage />}
          </Suspense>
        } />
        
        <Route path="/signup" element={
          <Suspense fallback={<PageLoader />}>
            {user ? <Navigate to="/dashboard" replace /> : <SignupPage />}
          </Suspense>
        } />
        
        <Route path="/forgot-password" element={
          <Suspense fallback={<PageLoader />}>
            <ForgotPasswordPage />
          </Suspense>
        } />
        
        {/* Onboarding route - protected but doesn't require completed onboarding */}
        <Route path="/onboarding" element={<OnboardingProtectedRoute><OnboardingPage /></OnboardingProtectedRoute>} />
        
        {/* Protected routes - require completed onboarding */}
        <Route path="/dashboard" element={<ProtectedRoute><DashboardLayout><Dashboard /></DashboardLayout></ProtectedRoute>} />
        <Route path="/assistants" element={<ProtectedRoute><DashboardLayout><AssistantsPage /></DashboardLayout></ProtectedRoute>} />
        <Route path="/messages" element={<ProtectedRoute><DashboardLayout><MessagesPage /></DashboardLayout></ProtectedRoute>} />
        <Route path="/leads" element={<ProtectedRoute><DashboardLayout><Leads /></DashboardLayout></ProtectedRoute>} />
        <Route path="/campaigns" element={<ProtectedRoute><DashboardLayout><SMSCampaignPage /></DashboardLayout></ProtectedRoute>} />
        <Route path="/agent-builder" element={<ProtectedRoute><DashboardLayout><AgentBuilder /></DashboardLayout></ProtectedRoute>} />
        <Route path="/settings" element={<ProtectedRoute><SettingsLayout><SettingsPage /></SettingsLayout></ProtectedRoute>} />
        <Route path="/settings/ai-settings" element={<ProtectedRoute><SettingsLayout><AISettingsPage /></SettingsLayout></ProtectedRoute>} />
        
        <Route path="*" element={<NotFound />} />
      </Routes>
    </TooltipProvider>
  );
};

export default App;
