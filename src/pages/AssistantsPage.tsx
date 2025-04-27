
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye, Edit, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";

const assistants = [
  {
    id: 1,
    name: "Ava Solar",
    role: "Solar Expert",
    status: "active",
    avatar: "AS"
  },
  {
    id: 2,
    name: "Ava Roofing",
    role: "Roofing Specialist",
    status: "active",
    avatar: "AR"
  },
  {
    id: 3,
    name: "Ava Agency",
    role: "Marketing Expert",
    status: "active",
    avatar: "AA"
  },
  {
    id: 4,
    name: "Ava Construction",
    role: "Construction Specialist",
    status: "active",
    avatar: "AC"
  }
];

export default function AssistantsPage() {
  return (
    <div className="space-y-8 slide-in">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-medium bg-gradient-to-r from-white to-white/70 bg-clip-text text-transparent">Assistants</h1>
        <Button className="rounded-full px-5 bg-gradient-to-r from-primary to-primary/80 button-hover shadow-soft" asChild>
          <Link to="/agent-builder">
            New Assistant
          </Link>
        </Button>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {assistants.map(assistant => (
          <Card 
            key={assistant.id} 
            className="border-border bg-card/40 backdrop-blur-sm rounded-2xl shadow-soft card-gradient hover:shadow-lg transition-all duration-200 list-item-hover"
          >
            <CardHeader className="flex flex-row items-center gap-4">
              <Avatar className="h-12 w-12 ring-2 ring-white/10">
                <AvatarFallback className="bg-primary/20 text-primary-foreground">
                  {assistant.avatar}
                </AvatarFallback>
              </Avatar>
              <div className="space-y-2">
                <CardTitle className="text-lg font-medium">{assistant.name}</CardTitle>
                <Badge variant="outline" className="bg-white/5 text-white/80 border-white/10">
                  {assistant.role}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex justify-end gap-2 mt-2">
                <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full button-hover">
                  <Eye className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full button-hover" asChild>
                  <Link to={`/agent-builder?id=${assistant.id}`}>
                    <Edit className="h-4 w-4" />
                  </Link>
                </Button>
                <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full opacity-80 hover:text-destructive button-hover">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
