
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Routes, Route, Navigate } from "react-router-dom";
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

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading, isOnboardingCompleted } = useAuth();
  
  if (loading) {
    return <div className="flex min-h-screen items-center justify-center">Loading...</div>;
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
  
  return <>{children}</>;
};

const OnboardingProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading, isOnboardingCompleted } = useAuth();
  
  if (loading) {
    return <div className="flex min-h-screen items-center justify-center">Loading...</div>;
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
  
  return <>{children}</>;
};

const App = () => {
  const { user } = useAuth();
  
  return (
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <Routes>
        {/* Public routes */}
        <Route path="/" element={user ? <Navigate to="/dashboard" /> : <LoginPage />} />
        <Route path="/signup" element={user ? <Navigate to="/dashboard" /> : <SignupPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        
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
