import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import AgentBuilder from "./pages/AgentBuilder";
import NotFound from "./pages/NotFound";
import { DashboardLayout } from "./components/layout/DashboardLayout";
import MessagesPage from "./pages/MessagesPage";
import Leads from "./pages/Leads";
import AssistantsPage from "./pages/AssistantsPage";
import SettingsPage from "./pages/SettingsPage";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/dashboard" element={<DashboardLayout><Dashboard /></DashboardLayout>} />
          <Route path="/assistants" element={<DashboardLayout><AssistantsPage /></DashboardLayout>} />
          <Route path="/messages" element={<DashboardLayout><MessagesPage /></DashboardLayout>} />
          <Route path="/leads" element={<DashboardLayout><Leads /></DashboardLayout>} />
          <Route path="/agent-builder" element={<DashboardLayout><AgentBuilder /></DashboardLayout>} />
          <Route path="/settings" element={<DashboardLayout><SettingsPage /></DashboardLayout>} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
