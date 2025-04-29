
import React, { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAssistants } from "@/hooks/useAssistants";
import { Loader2, MessageSquare, Plus } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";

export default function AssistantsPage() {
  const { assistants, isLoading } = useAssistants();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");

  const filteredAssistants = assistants.filter(assistant => 
    assistant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    assistant.role.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAssistantClick = (assistantId: string) => {
    navigate(`/messages?assistant=${assistantId}`);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-mono tracking-[0.12em] font-warp">AI Assistants</h1>
      
      <div className="flex items-center justify-between gap-4 mb-6">
        <div className="relative w-full max-w-md">
          <Input
            className="pr-8 premium-input"
            placeholder="Search assistants..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Button variant="outline" className="premium-button">
          <Plus className="h-4 w-4 mr-2" /> Create Assistant
        </Button>
      </div>
      
      {filteredAssistants.length === 0 ? (
        <Card className="p-12 text-center glass-effect shadow-soft">
          <div className="flex flex-col items-center justify-center space-y-4">
            <div className="p-4 rounded-full bg-purple-500/20">
              <MessageSquare className="h-10 w-10 text-purple-400" />
            </div>
            <h3 className="font-semibold text-xl font-warp">No assistants found</h3>
            <p className="text-muted-foreground max-w-md">
              {searchQuery ? "Try a different search term" : "Create your first AI assistant to get started"}
            </p>
            <Button className="mt-4 premium-button">
              <Plus className="h-4 w-4 mr-2" /> Create Assistant
            </Button>
          </div>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAssistants.map((assistant) => (
            <Card 
              key={assistant.id} 
              className="p-6 space-y-4 glass-effect hover-glow cursor-pointer transition-all duration-300 hover:-translate-y-1"
              onClick={() => handleAssistantClick(assistant.id)}
            >
              <div className="flex items-center space-x-4">
                <Avatar className="h-12 w-12 ring-2 ring-purple-500/30 glow-box">
                  <AvatarImage src={assistant.avatar || undefined} />
                  <AvatarFallback className="bg-gradient-to-br from-purple-500/50 to-indigo-700/30 text-white">
                    {assistant.name?.substring(0, 2) || "AI"}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-semibold font-warp">{assistant.name}</h3>
                  <p className="text-sm text-muted-foreground">{assistant.role}</p>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label className="text-xs text-muted-foreground">Description</Label>
                <p className="text-sm">
                  {assistant.role || 'AI Assistant'}
                </p>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className={`w-2 h-2 rounded-full ${
                    assistant.status === 'active' ? 'bg-green-500' : 'bg-gray-400'
                  }`} />
                  <span className="text-xs text-muted-foreground capitalize">
                    {assistant.status}
                  </span>
                </div>
                <Badge variant="outline" className="bg-black/20 text-xs">
                  AI Assistant
                </Badge>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
