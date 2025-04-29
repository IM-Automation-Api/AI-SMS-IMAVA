
import React from 'react';
import { UserSatisfactionCard } from './UserSatisfactionCard';
import { ConversationLengthCard } from './ConversationLengthCard';
import { ThreadSkeleton } from './ThreadSkeleton';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from "recharts";

const messageActivityData = [
  { name: "Mon", total: 12 },
  { name: "Tue", total: 18 },
  { name: "Wed", total: 5 },
  { name: "Thu", total: 8 },
  { name: "Fri", total: 10 },
  { name: "Sat", total: 3 },
  { name: "Sun", total: 2 },
];

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
    <div className="grid gap-6 md:grid-cols-3">
      <UserSatisfactionCard />
      <ConversationLengthCard />
      <MessageActivityCard />
    </div>
  );
};
