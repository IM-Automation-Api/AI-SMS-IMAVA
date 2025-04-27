
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatsCard } from "@/components/analytics/StatsCard";
import { AnalyticsChart } from "@/components/analytics/AnalyticsChart";
import { CircleDot, TrendingUp, MessageSquare, Users, GaugeCircle } from "lucide-react";

export default function Dashboard() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-primary">Dashboard</h1>
      
      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Total Messages"
          value="54,231"
          icon={<MessageSquare className="h-4 w-4" />}
          trend="up"
          trendValue="12%"
        />
        <StatsCard
          title="Active Users"
          value="2,431"
          icon={<Users className="h-4 w-4" />}
          trend="up"
          trendValue="8%"
        />
        <StatsCard
          title="Success Rate"
          value="95%"
          icon={<TrendingUp className="h-4 w-4" />}
          trend="up"
          trendValue="2%"
        />
        <StatsCard
          title="Avg. Response Time"
          value="1.2s"
          icon={<GaugeCircle className="h-4 w-4" />}
          trend="down"
          trendValue="3%"
        />
      </div>

      {/* Charts Grid */}
      <div className="grid gap-4 md:grid-cols-2">
        <AnalyticsChart title="Message Volume" />
        <AnalyticsChart title="User Growth" />
      </div>

      {/* Additional Metrics */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="border-border bg-card">
          <CardHeader>
            <CardTitle className="text-card-foreground">Popular Topics</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              <li className="flex items-center justify-between">
                <span className="text-muted-foreground">Support</span>
                <span className="text-primary">42%</span>
              </li>
              <li className="flex items-center justify-between">
                <span className="text-muted-foreground">Sales</span>
                <span className="text-primary">28%</span>
              </li>
              <li className="flex items-center justify-between">
                <span className="text-muted-foreground">Billing</span>
                <span className="text-primary">18%</span>
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
