
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export const ConversationLengthCard = () => {
  return (
    <Card className="neo-blur border-white/5 transition-all duration-300 rounded-xl shadow-glow">
      <CardHeader>
        <CardTitle className="text-gradient-primary">Conversation Length</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <div className="flex justify-between mb-2">
              <span className="text-sm text-muted-foreground">0-2 min</span>
              <Badge variant="outline" className="bg-primary/10 text-primary">45%</Badge>
            </div>
            <div className="w-full bg-muted/50 rounded-full h-1.5">
              <div className="bg-primary h-1.5 rounded-full" style={{width: '45%'}}></div>
            </div>
          </div>
          <div>
            <div className="flex justify-between mb-2">
              <span className="text-sm text-muted-foreground">2-5 min</span>
              <Badge variant="outline" className="bg-primary/10 text-primary">30%</Badge>
            </div>
            <div className="w-full bg-muted/50 rounded-full h-1.5">
              <div className="bg-primary h-1.5 rounded-full" style={{width: '30%'}}></div>
            </div>
          </div>
          <div>
            <div className="flex justify-between mb-2">
              <span className="text-sm text-muted-foreground">5+ min</span>
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
