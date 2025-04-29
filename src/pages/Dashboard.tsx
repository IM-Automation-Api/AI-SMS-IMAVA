import React from 'react';
import { StatsSection } from "@/components/dashboard/StatsSection";
import { CommunicationsLogCard } from "@/components/dashboard/CommunicationsLogCard";
import { AnalyticsSection } from "@/components/dashboard/AnalyticsSection";
export default function Dashboard() {
  return <div className="space-y-6 fade-in">
      <h1 className="tracking-[0.12em] font-zag font-semibold text-4xl">Dashboard</h1>
      
      <StatsSection />
      <CommunicationsLogCard />
      <AnalyticsSection />
    </div>;
}