
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
        icon={<MessageSquare className="h-4 w-4" />} 
        trend="up" 
        trendValue="12%" 
        className="hover:scale-105 transition-all duration-300"
      />
      <StatsCard 
        title="Active Users" 
        value="2,431" 
        icon={<Users className="h-4 w-4" />} 
        trend="up" 
        trendValue="8%" 
        className="hover:scale-105 transition-all duration-300"
      />
      <StatsCard 
        title="Success Rate" 
        value="95%" 
        icon={<TrendingUp className="h-4 w-4" />} 
        trend="up" 
        trendValue="2%" 
        className="hover:scale-105 transition-all duration-300"
      />
      <StatsCard 
        title="Avg. Response Time" 
        value="1.2s" 
        icon={<GaugeCircle className="h-4 w-4" />} 
        trend="down" 
        trendValue="3%" 
        className="hover:scale-105 transition-all duration-300"
      />
    </div>
  );
});

StatsSection.displayName = 'StatsSection';
