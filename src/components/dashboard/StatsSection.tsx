
import React, { memo } from 'react';
import { StatsCard } from "@/components/analytics/StatsCard";
import { MessageSquare, Users, TrendingUp, GaugeCircle } from "lucide-react";

// Memoized component to prevent unnecessary re-renders
export const StatsSection = memo(() => {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
      <StatsCard 
        title="Total Messages" 
        value="54,231" 
        icon={<MessageSquare className="h-4 w-4 text-purple-500" />} 
        trend="up" 
        trendValue="12%" 
        className="tech-glass-panel hover-glow cursor-pointer transition-all duration-300 hover:-translate-y-1"
      />
      <StatsCard 
        title="Active Users" 
        value="2,431" 
        icon={<Users className="h-4 w-4 text-purple-500" />} 
        trend="up" 
        trendValue="8%" 
        className="tech-glass-panel hover-glow cursor-pointer transition-all duration-300 hover:-translate-y-1"
      />
      <StatsCard 
        title="Success Rate" 
        value="95%" 
        icon={<TrendingUp className="h-4 w-4 text-purple-500" />} 
        trend="up" 
        trendValue="2%" 
        className="tech-glass-panel hover-glow cursor-pointer transition-all duration-300 hover:-translate-y-1"
      />
      <StatsCard 
        title="Avg. Response Time" 
        value="1.2s" 
        icon={<GaugeCircle className="h-4 w-4 text-purple-500" />} 
        trend="down" 
        trendValue="3%" 
        className="tech-glass-panel hover-glow cursor-pointer transition-all duration-300 hover:-translate-y-1"
      />
    </div>
  );
});

StatsSection.displayName = 'StatsSection';
