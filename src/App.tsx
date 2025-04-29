
import React from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Routes } from "./routes/Routes";

const App = () => {
  return (
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <Routes />
    </TooltipProvider>
  );
};

export default App;
