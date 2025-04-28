
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
import { useAuth } from "./lib/supabase/auth/auth-context";

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return <div className="flex min-h-screen items-center justify-center">Loading...</div>;
  }
  
  if (!user) {
    return <Navigate to="/" replace />;
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
        
        {/* Protected routes */}
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
