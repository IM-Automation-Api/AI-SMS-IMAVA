import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { StatsCard } from "@/components/analytics/StatsCard";
import { AnalyticsChart } from "@/components/analytics/AnalyticsChart";
import { ActivitiesCard } from "@/components/analytics/ActivitiesCard";
import { CommunicationItem } from "@/components/analytics/CommunicationItem";
import { CircleDot, TrendingUp, MessageSquare, Users, GaugeCircle, Mic } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useMessages } from "@/hooks/useMessages";
import { format } from "date-fns";

export default function Dashboard() {
  const { messages, newMessageCount } = useMessages(4);
  
  return (
    <div className="space-y-6 fade-in">
      <h1 className="text-3xl tracking-[0.12em] font-zag">Dashboard</h1>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard title="Total Messages" value="54,231" icon={<MessageSquare className="h-4 w-4" />} trend="up" trendValue="12%" />
        <StatsCard title="Active Users" value="2,431" icon={<Users className="h-4 w-4" />} trend="up" trendValue="8%" />
        <StatsCard title="Success Rate" value="95%" icon={<TrendingUp className="h-4 w-4" />} trend="up" trendValue="2%" />
        <StatsCard title="Avg. Response Time" value="1.2s" icon={<GaugeCircle className="h-4 w-4" />} trend="down" trendValue="3%" />
      </div>

      <Card className="bg-card/50 border-border backdrop-blur-sm">
        <CardHeader className="pb-2 flex flex-row items-center justify-between">
          <CardTitle className="text-foreground flex items-center text-base">
            <MessageSquare className="mr-2 h-5 w-5 text-primary" />
            Communications Log
          </CardTitle>
          {newMessageCount > 0 && (
            <Badge variant="outline" className="bg-primary/10 text-primary border-primary/50">
              {newMessageCount} New {newMessageCount === 1 ? 'Message' : 'Messages'}
            </Badge>
          )}
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {messages.map((message) => (
              <CommunicationItem
                key={message.id}
                sender={message.direction === 'inbound' ? 'Customer' : 'System'}
                time={format(new Date(message.created_at!), 'HH:mm:ss')}
                message={message.content}
                avatar="/placeholder.svg?height=40&width=40"
                unread
              />
            ))}
          </div>
        </CardContent>
        <CardFooter className="border-t border-border pt-4">
          <div className="flex items-center w-full space-x-2">
            <input type="text" placeholder="Type a message..." className="flex-1 bg-card border-border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary" />
            <Button size="icon" className="bg-primary hover:bg-primary/90">
              <Mic className="h-4 w-4" />
            </Button>
            <Button size="icon" className="bg-primary hover:bg-primary/90">
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
    </div>
  );
}
