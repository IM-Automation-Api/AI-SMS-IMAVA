
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
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

const App = () => (
  <TooltipProvider>
    <Toaster />
    <Sonner />
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/dashboard" element={<DashboardLayout><Dashboard /></DashboardLayout>} />
        <Route path="/assistants" element={<DashboardLayout><AssistantsPage /></DashboardLayout>} />
        <Route path="/messages" element={<DashboardLayout><MessagesPage /></DashboardLayout>} />
        <Route path="/leads" element={<DashboardLayout><Leads /></DashboardLayout>} />
        <Route path="/campaigns" element={<DashboardLayout><SMSCampaignPage /></DashboardLayout>} />
        <Route path="/agent-builder" element={<DashboardLayout><AgentBuilder /></DashboardLayout>} />
        <Route path="/settings" element={<SettingsLayout><SettingsPage /></SettingsLayout>} />
        <Route path="/settings/ai-settings" element={<SettingsLayout><AISettingsPage /></SettingsLayout>} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  </TooltipProvider>
);

export default App;
