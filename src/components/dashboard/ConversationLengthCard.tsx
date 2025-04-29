
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export const ConversationLengthCard = () => {
  return (
    <Card className="modern-glass-card">
      <CardHeader className="p-0 mb-4">
        <CardTitle className="text-white">Conversation Length</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="space-y-4">
          <div>
            <div className="flex justify-between mb-2">
              <span className="text-sm text-gray-400">0-2 min</span>
              <Badge variant="outline" className="bg-primary/10 text-primary">45%</Badge>
            </div>
            <div className="w-full bg-muted/50 rounded-full h-1.5">
              <div className="bg-primary h-1.5 rounded-full" style={{width: '45%'}}></div>
            </div>
          </div>
          <div>
            <div className="flex justify-between mb-2">
              <span className="text-sm text-gray-400">2-5 min</span>
              <Badge variant="outline" className="bg-primary/10 text-primary">30%</Badge>
            </div>
            <div className="w-full bg-muted/50 rounded-full h-1.5">
              <div className="bg-primary h-1.5 rounded-full" style={{width: '30%'}}></div>
            </div>
          </div>
          <div>
            <div className="flex justify-between mb-2">
              <span className="text-sm text-gray-400">5+ min</span>
              <Badge variant="outline" className="bg-primary/10 text-primary">25%</Badge>
            </div>
            <div className="w-full bg-muted/50 rounded-full h-1.5">
              <div className="bg-primary h-1.5 rounded-full" style={{width: '25%'}}></div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
