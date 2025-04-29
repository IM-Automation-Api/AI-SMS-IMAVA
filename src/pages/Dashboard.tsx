import React from 'react';
import { StatsSection } from "@/components/dashboard/StatsSection";
import { CommunicationsLogCard } from "@/components/dashboard/CommunicationsLogCard";
import { AnalyticsSection } from "@/components/dashboard/AnalyticsSection";
export default function Dashboard() {
  return <div className="space-y-8 fade-in">
      <h1 className="font-warp flex items-center text-zinc-200 font-normal text-2xl">
        Dashboard
      </h1>
      
      <StatsSection />
      <CommunicationsLogCard />
      <AnalyticsSection />
    </div>;
}