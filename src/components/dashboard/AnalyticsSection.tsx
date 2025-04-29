
import React from 'react';
import { UserSatisfactionCard } from './UserSatisfactionCard';
import { ConversationLengthCard } from './ConversationLengthCard';
import { ThreadSkeleton } from './ThreadSkeleton';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from "recharts";
import { StatsCard } from '@/components/analytics/StatsCard';
import { MessageCircle, Reply, Share2, BarChart2, Calendar } from 'lucide-react';
import { useMessages } from '@/hooks/useMessages';
import { ChartContainer, ChartTooltipContent, ChartTooltip } from "@/components/ui/chart";

// Components for the new analytics cards
export const TotalMessagesSentCard = () => {
  const { messages } = useMessages(500);
  const outboundMessages = messages.filter(msg => msg.direction === 'outbound');
  const count = outboundMessages.length;
  
  return (
    <StatsCard 
      title="Total Messages Sent"
      value={count.toLocaleString()}
      icon={<MessageCircle size={20} />}
      trendValue="12%"
      trend="up"
    />
  );
};

export const TotalRepliesCard = () => {
  const { messages } = useMessages(500);
  const inboundMessages = messages.filter(msg => msg.direction === 'inbound');
  const outboundMessages = messages.filter(msg => msg.direction === 'outbound');
  const count = inboundMessages.length;
  const responseRate = outboundMessages.length > 0 
    ? Math.round((inboundMessages.length / outboundMessages.length) * 100)
    : 0;
  
  return (
    <StatsCard 
      title="Total Replies Received"
      value={count.toLocaleString()}
      icon={<Reply size={20} />}
      trendValue={`${responseRate}% response rate`}
    />
  );
};

export const ResponseRateCard = () => {
  const { messages } = useMessages(500);
  const inboundMessages = messages.filter(msg => msg.direction === 'inbound');
  const outboundMessages = messages.filter(msg => msg.direction === 'outbound');
  const responseRate = outboundMessages.length > 0 
    ? Math.round((inboundMessages.length / outboundMessages.length) * 100)
    : 0;
  
  return (
    <StatsCard 
      title="Response Rate"
      value={`${responseRate}%`}
      icon={<Share2 size={20} />}
      trend="up"
      trendValue="3.2%"
    />
  );
};

const conversionData = [
  { name: "Leads", value: 1000 },
  { name: "Responses", value: 200 },
  { name: "Appointments", value: 30 },
];

export const ConversionFunnelCard = () => {
  return (
    <Card className="col-span-1">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Conversion Funnel</CardTitle>
        <BarChart2 className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="h-[180px]">
          <ChartContainer
            config={{
              leads: {
                theme: {
                  light: "#4f46e5",
                  dark: "#818cf8"
                },
              },
              responses: {
                theme: {
                  light: "#8b5cf6",
                  dark: "#a78bfa"
                },
              },
              appointments: {
                theme: {
                  light: "#d946ef",
                  dark: "#e879f9"
                },
              }
            }}
          >
            <BarChart data={conversionData}>
              <XAxis
                dataKey="name"
                stroke="#888888"
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                stroke="#888888"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => `${value}`}
              />
              <Bar
                dataKey="value"
                className="fill-[var(--color-leads)]"
                radius={[4, 4, 0, 0]}
                name="Conversion"
              />
              <ChartTooltip
                content={<ChartTooltipContent />}
              />
            </BarChart>
          </ChartContainer>
        </div>
        <div className="text-xs text-muted-foreground text-center mt-2">
          1,000 leads → 200 replies → 30 appointments (3%)
        </div>
      </CardContent>
    </Card>
  );
};

export const AppointmentsBookedCard = () => {
  return (
    <StatsCard 
      title="Appointments Booked"
      value="30"
      icon={<Calendar size={20} />}
      trend="up"
      trendValue="12%"
    />
  );
};

export const MessageActivityCard = () => {
  return (
    <Card className="col-span-1">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Message Activity</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[180px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={messageActivityData}>
              <XAxis
                dataKey="name"
                stroke="#888888"
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                stroke="#888888"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => `${value}`}
              />
              <Bar
                dataKey="total"
                fill="currentColor"
                radius={[4, 4, 0, 0]}
                className="fill-primary"
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export const AnalyticsSection = () => {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold tracking-tight">Analytics</h2>
      <div className="grid gap-4 md:grid-cols-4">
        <TotalMessagesSentCard />
        <TotalRepliesCard />
        <ResponseRateCard />
        <AppointmentsBookedCard />
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <ConversionFunnelCard />
        <MessageActivityCard />
      </div>
    </div>
  );
};
