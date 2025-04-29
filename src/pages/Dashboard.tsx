
import React from 'react';
import { StatsSection } from "@/components/dashboard/StatsSection";
import { CommunicationsLogCard } from "@/components/dashboard/CommunicationsLogCard";
import { AnalyticsSection } from "@/components/dashboard/AnalyticsSection";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Link } from "react-router-dom";

export default function Dashboard() {
  return (
    <div className="space-y-8 fade-in pb-8">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-white via-indigo-200 to-white bg-clip-text text-transparent">Dashboard</h1>
        <Link to="/messages">
          <Button className="button-gradient hover:opacity-90 transition-all duration-300 shadow-md shadow-purple-900/20">
            <Plus className="mr-1 h-4 w-4" />
            View All Messages
          </Button>
        </Link>
      </div>
      
      <div className="grid gap-6">
        <div className="glass-panel p-6 rounded-xl">
          <h2 className="text-xl font-semibold mb-4 text-gradient-primary">Performance Overview</h2>
          <StatsSection />
        </div>
        
        <div className="glass-panel p-6 rounded-xl">
          <h2 className="text-xl font-semibold mb-4 text-gradient-primary">Recent Communications</h2>
          <CommunicationsLogCard />
        </div>
        
        <div className="glass-panel p-6 rounded-xl">
          <h2 className="text-xl font-semibold mb-4 text-gradient-primary">Analytics</h2>
          <AnalyticsSection />
        </div>
      </div>
    </div>
  );
}
