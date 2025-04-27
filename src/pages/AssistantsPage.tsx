import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye, Edit, Trash2 } from "lucide-react";
const assistants = [{
  id: 1,
  name: "Ava Solar",
  role: "Solar Expert",
  status: "active",
  avatar: "AS"
}, {
  id: 2,
  name: "Ava Roofing",
  role: "Roofing Specialist",
  status: "active",
  avatar: "AR"
}, {
  id: 3,
  name: "Ava Agency",
  role: "Marketing Expert",
  status: "active",
  avatar: "AA"
}, {
  id: 4,
  name: "Ava Construction",
  role: "Construction Specialist",
  status: "active",
  avatar: "AC"
}];
export default function AssistantsPage() {
  return <div className="space-y-6">
      <h1 className="text-3xl font-bold text-primary">Assistants</h1>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {assistants.map(assistant => <Card key={assistant.id} className="border-border bg-card rounded-2xl shadow-lg">
            <CardHeader className="flex flex-row items-center gap-4">
              <Avatar className="h-12 w-12">
                <AvatarFallback className="bg-neutral-700 text-neutral-100">
                  {assistant.avatar}
                </AvatarFallback>
              </Avatar>
              <div className="space-y-1">
                <CardTitle>{assistant.name}</CardTitle>
                <Badge variant="outline" className="bg-neutral-700 text-neutral-300">
                  {assistant.role}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex justify-end gap-2">
                <Button variant="ghost" size="icon">
                  <Eye className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon">
                  <Edit className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" className="text-gray-400">
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </div>
            </CardContent>
          </Card>)}
      </div>
    </div>;
}