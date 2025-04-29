
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const UserSatisfactionCard = () => {
  return (
    <Card className="border-border bg-card/50 backdrop-blur-sm rounded-xl shadow-card hover:shadow-hover transition-shadow md:col-span-2">
      <CardHeader>
        <CardTitle>User Satisfaction</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex justify-center items-center h-full">
          <div className="relative w-32 h-32">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
              <circle className="text-muted stroke-current" strokeWidth="10" fill="transparent" r="40" cx="50" cy="50" />
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
  );
};
