import React from 'react';
import { StatsSection } from "@/components/dashboard/StatsSection";
import { CommunicationsLogCard } from "@/components/dashboard/CommunicationsLogCard";
import { AnalyticsSection } from "@/components/dashboard/AnalyticsSection";
export default function Dashboard() {
  return <div className="space-y-6 fade-in">
      <h1 className="tracking-[0.12em] font-mono font-semibold text-4xl text-gray-300">Dashboard</h1>
      
      <StatsSection />
      <CommunicationsLogCard />
      <AnalyticsSection />
    </div>;
}