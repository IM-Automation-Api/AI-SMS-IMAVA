import React from 'react';
import { StatsSection } from "@/components/dashboard/StatsSection";
import { CommunicationsLogCard } from "@/components/dashboard/CommunicationsLogCard";
import { AnalyticsSection } from "@/components/dashboard/AnalyticsSection";
export default function Dashboard() {
  return <div className="space-y-8 fade-in">
      <h1 className="font-mono tracking-[0.12em] font-warp bg-gradient-to-r from-indigo-400 via-purple-500 to-black-400 text-transparent bg-clip-text font-light text-2xl">
        Dashboard
      </h1>
      
      <StatsSection />
      <CommunicationsLogCard />
      <AnalyticsSection />
    </div>;
}