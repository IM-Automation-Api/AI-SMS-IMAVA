import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { StatsCard } from "@/components/analytics/StatsCard";
import { AnalyticsChart } from "@/components/analytics/AnalyticsChart";
import { ActivitiesCard } from "@/components/analytics/ActivitiesCard";
import { CommunicationItem } from "@/components/analytics/CommunicationItem";
import { CircleDot, TrendingUp, MessageSquare, Users, GaugeCircle, Mic } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default function Dashboard() {
  return <div className="space-y-6 fade-in">
      <h1 className="text-3xl font-bold tracking-tight text-gradient">Dashboard</h1>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard title="Total Messages" value="54,231" icon={<MessageSquare className="h-4 w-4" />} trend="up" trendValue="12%" />
        <StatsCard title="Active Users" value="2,431" icon={<Users className="h-4 w-4" />} trend="up" trendValue="8%" />
        <StatsCard title="Success Rate" value="95%" icon={<TrendingUp className="h-4 w-4" />} trend="up" trendValue="2%" />
        <StatsCard title="Avg. Response Time" value="1.2s" icon={<GaugeCircle className="h-4 w-4" />} trend="down" trendValue="3%" />
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

      <Card className="bg-slate-900/50 border-slate-700/50 backdrop-blur-sm">
        <CardHeader className="pb-2 flex flex-row items-center justify-between">
          <CardTitle className="text-slate-100 flex items-center text-base">
            <MessageSquare className="mr-2 h-5 w-5 text-blue-500" />
            Communications Log
          </CardTitle>
          <Badge variant="outline" className="bg-slate-800/50 text-blue-400 border-blue-500/50">
            4 New Messages
          </Badge>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <CommunicationItem sender="System Administrator" time="15:42:12" message="Scheduled maintenance will occur at 02:00. All systems will be temporarily offline." avatar="/placeholder.svg?height=40&width=40" unread />
            <CommunicationItem sender="Security Module" time="14:30:45" message="Unusual login attempt blocked from IP 192.168.1.45. Added to watchlist." avatar="/placeholder.svg?height=40&width=40" unread />
            <CommunicationItem sender="Network Control" time="12:15:33" message="Bandwidth allocation adjusted for priority services during peak hours." avatar="/placeholder.svg?height=40&width=40" unread />
            <CommunicationItem sender="Data Center" time="09:05:18" message="Backup verification complete. All data integrity checks passed." avatar="/placeholder.svg?height=40&width=40" unread />
          </div>
        </CardContent>
        <CardFooter className="border-t border-slate-700/50 pt-4">
          <div className="flex items-center w-full space-x-2">
            <input type="text" placeholder="Type a message..." className="flex-1 bg-slate-800/50 border border-slate-700/50 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-cyan-500" />
            <Button size="icon" className="bg-blue-600 hover:bg-blue-700">
              <Mic className="h-4 w-4" />
            </Button>
            <Button size="icon" className="bg-cyan-600 hover:bg-cyan-700">
              <MessageSquare className="h-4 w-4" />
            </Button>
          </div>
        </CardFooter>
      </Card>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="border-border bg-card/50 backdrop-blur-sm rounded-xl shadow-card hover:shadow-hover transition-shadow md:col-span-2">
          <CardHeader>
            <CardTitle>User Satisfaction</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-center items-center h-full">
              <div className="relative w-32 h-32">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                  <circle className="text-muted stroke-current" strokeWidth="10" fill="transparent" r="40" cx="50" cy="50" />
                  <circle className="text-primary stroke-current" strokeWidth="10" strokeDasharray="251.2" strokeDashoffset="25.12" fill="transparent" r="40" cx="50" cy="50" />
                </svg>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-2xl font-bold text-primary">
                  90%
                </div>
              </div>
            </div>
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
                  <div className="bg-primary h-1.5 rounded-full" style={{
                  width: '45%'
                }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm text-muted-foreground">2-5 min</span>
                  <Badge variant="outline" className="bg-primary/10 text-primary">30%</Badge>
                </div>
                <div className="w-full bg-muted/50 rounded-full h-1.5">
                  <div className="bg-primary h-1.5 rounded-full" style={{
                  width: '30%'
                }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm text-muted-foreground">5+ min</span>
                  <Badge variant="outline" className="bg-primary/10 text-primary">25%</Badge>
                </div>
                <div className="w-full bg-muted/50 rounded-full h-1.5">
                  <div className="bg-primary h-1.5 rounded-full" style={{
                  width: '25%'
                }}></div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>;
}
