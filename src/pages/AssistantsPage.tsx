
import React from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { useAssistants } from "@/hooks/useAssistants";
import { Loader2 } from "lucide-react";

export default function AssistantsPage() {
  const { assistants, isLoading } = useAssistants();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl tracking-[0.12em]">AI Assistants</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {assistants.map((assistant) => (
          <Card key={assistant.id} className="p-6 space-y-4">
            <div className="flex items-center space-x-4">
              <Avatar className="h-12 w-12">
                <AvatarFallback className="bg-primary text-primary-foreground">
                  {assistant.avatar || assistant.name.substring(0, 2)}
                </AvatarFallback>
              </Avatar>
              <div>
                <h3 className="font-semibold">{assistant.name}</h3>
                <p className="text-sm text-muted-foreground">{assistant.role}</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <div className={`w-2 h-2 rounded-full ${
                assistant.status === 'active' ? 'bg-green-500' : 'bg-gray-400'
              }`} />
              <span className="text-sm text-muted-foreground capitalize">
                {assistant.status}
              </span>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
