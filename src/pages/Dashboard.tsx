import React from 'react';
import { StatsSection } from "@/components/dashboard/StatsSection";
import { CommunicationsLogCard } from "@/components/dashboard/CommunicationsLogCard";
import { AnalyticsSection } from "@/components/dashboard/AnalyticsSection";
export default function Dashboard() {
  return <div className="space-y-8 fade-in">
      <h1 className="font-mono tracking-font-warp text-gray-200">
        Dashboard
      </h1>
      
      <StatsSection />
      <CommunicationsLogCard />
      <AnalyticsSection />
    </div>;
}