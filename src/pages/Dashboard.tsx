
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatsCard } from "@/components/analytics/StatsCard";
import { AnalyticsChart } from "@/components/analytics/AnalyticsChart";
import { ActivitiesCard } from "@/components/analytics/ActivitiesCard";
import { CircleDot, TrendingUp, MessageSquare, Users, GaugeCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function Dashboard() {
  return (
    <div className="space-y-6 fade-in">
      <h1 className="text-3xl font-bold tracking-tight text-gradient">Dashboard</h1>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
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

      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-2">
          <div className="grid gap-6 md:grid-cols-2">
            <Card className="border-border bg-card/50 backdrop-blur-sm rounded-xl shadow-card hover:shadow-hover transition-shadow">
              <AnalyticsChart title="Message Volume" />
            </Card>
            <Card className="border-border bg-card/50 backdrop-blur-sm rounded-xl shadow-card hover:shadow-hover transition-shadow">
              <AnalyticsChart title="User Growth" />
            </Card>
          </div>
        </div>
        <Card className="border-border bg-card/50 backdrop-blur-sm rounded-xl shadow-card">
          <ActivitiesCard />
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="border-border bg-card/50 backdrop-blur-sm rounded-xl shadow-card hover:shadow-hover transition-shadow">
          <CardHeader>
            <CardTitle>Popular Topics</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              <li className="flex items-center justify-between">
                <span className="text-muted-foreground">Support</span>
                <Badge variant="outline" className="bg-primary/10 text-primary">42%</Badge>
              </li>
              <li className="flex items-center justify-between">
                <span className="text-muted-foreground">Sales</span>
                <Badge variant="outline" className="bg-primary/10 text-primary">28%</Badge>
              </li>
              <li className="flex items-center justify-between">
                <span className="text-muted-foreground">Billing</span>
                <Badge variant="outline" className="bg-primary/10 text-primary">18%</Badge>
              </li>
            </ul>
          </CardContent>
        </Card>
        
        <Card className="border-border bg-card/50 backdrop-blur-sm rounded-xl shadow-card hover:shadow-hover transition-shadow">
          <CardHeader>
            <CardTitle>Conversation Length</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm text-muted-foreground">0-2 min</span>
                  <Badge variant="outline" className="bg-primary/10 text-primary">45%</Badge>
                </div>
                <div className="w-full bg-muted/50 rounded-full h-1.5">
                  <div className="bg-primary h-1.5 rounded-full" style={{ width: '45%' }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm text-muted-foreground">2-5 min</span>
                  <Badge variant="outline" className="bg-primary/10 text-primary">30%</Badge>
                </div>
                <div className="w-full bg-muted/50 rounded-full h-1.5">
                  <div className="bg-primary h-1.5 rounded-full" style={{ width: '30%' }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm text-muted-foreground">5+ min</span>
                  <Badge variant="outline" className="bg-primary/10 text-primary">25%</Badge>
                </div>
                <div className="w-full bg-muted/50 rounded-full h-1.5">
                  <div className="bg-primary h-1.5 rounded-full" style={{ width: '25%' }}></div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-border bg-card/50 backdrop-blur-sm rounded-xl shadow-card hover:shadow-hover transition-shadow">
          <CardHeader>
            <CardTitle>User Satisfaction</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-center items-center h-full">
              <div className="relative w-32 h-32">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                  <circle 
                    className="text-muted stroke-current" 
                    strokeWidth="10" 
                    fill="transparent" 
                    r="40" 
                    cx="50" 
                    cy="50"
                  />
                  <circle 
                    className="text-primary stroke-current" 
                    strokeWidth="10" 
                    strokeDasharray="251.2" 
                    strokeDashoffset="25.12" 
                    fill="transparent" 
                    r="40" 
                    cx="50" 
                    cy="50"
                  />
                </svg>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-2xl font-bold text-primary">
                  90%
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
