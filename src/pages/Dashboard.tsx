
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
        <Card className="border-border bg-card rounded-2xl shadow-lg">
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
        
        <Card className="border-border bg-card rounded-2xl shadow-lg">
          <CardHeader>
            <CardTitle className="text-card-foreground">Conversation Length</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-xs text-muted-foreground">0-2 min</span>
                  <span className="text-xs text-primary">45%</span>
                </div>
                <div className="w-full bg-muted rounded-full h-1.5">
                  <div className="bg-primary h-1.5 rounded-full" style={{ width: '45%' }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-xs text-muted-foreground">2-5 min</span>
                  <span className="text-xs text-primary">30%</span>
                </div>
                <div className="w-full bg-muted rounded-full h-1.5">
                  <div className="bg-primary h-1.5 rounded-full" style={{ width: '30%' }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-xs text-muted-foreground">5+ min</span>
                  <span className="text-xs text-primary">25%</span>
                </div>
                <div className="w-full bg-muted rounded-full h-1.5">
                  <div className="bg-primary h-1.5 rounded-full" style={{ width: '25%' }}></div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-border bg-card rounded-2xl shadow-lg">
          <CardHeader>
            <CardTitle className="text-card-foreground">User Satisfaction</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-center items-center h-full">
              <div className="relative w-32 h-32">
                <svg className="w-full h-full" viewBox="0 0 100 100">
                  <circle className="text-muted stroke-current" strokeWidth="10" stroke="currentColor" fill="transparent" r="40" cx="50" cy="50" />
                  <circle className="text-primary stroke-current" strokeWidth="10" strokeDasharray="251.2" strokeDashoffset="25.12" stroke="currentColor" fill="transparent" r="40" cx="50" cy="50" />
                </svg>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-2xl font-bold text-primary">90%</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
