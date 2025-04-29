
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
  const {
    assistants,
    isLoading
  } = useAssistants();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const filteredAssistants = assistants.filter(assistant => assistant.name.toLowerCase().includes(searchQuery.toLowerCase()) || assistant.role.toLowerCase().includes(searchQuery.toLowerCase()));
  const handleAssistantClick = (assistantId: string) => {
    navigate(`/messages?assistant=${assistantId}`);
  };
  if (isLoading) {
    return <div className="flex items-center justify-center h-full">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>;
  }
  return <div className="space-y-6">
      <h1 className="font-warp flex items-center text-zinc-200 font-normal text-xl">AI Assistants</h1>
      
      <div className="flex items-center justify-between gap-4 mb-6">
        <div className="relative w-full max-w-md">
          <Input className="pr-8 premium-input" placeholder="Search assistants..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
        </div>
        <Button variant="outline" className="premium-button">
          <Plus className="h-4 w-4 mr-2" /> Create Assistant
        </Button>
      </div>
      
      {filteredAssistants.length === 0 ? <div className="bg-gradient-to-br from-[#0a0a0f] via-[#121018] to-[#1b1226] border border-[#4b2a78]/40 shadow-[inset_0_0_0.5px_rgba(255,255,255,0.05),0_4px_30px_rgba(0,0,0,0.4)] backdrop-blur-md rounded-2xl p-6 text-white">
          <div className="flex flex-col items-center justify-center space-y-4">
            <div className="p-4 rounded-full bg-purple-500/20">
              <MessageSquare className="h-10 w-10 text-purple-400" />
            </div>
            <h3 className="font-semibold text-xl font-warp text-white">No assistants found</h3>
            <p className="text-gray-400 max-w-md">
              {searchQuery ? "Try a different search term" : "Create your first AI assistant to get started"}
            </p>
            <Button className="mt-4 premium-button">
              <Plus className="h-4 w-4 mr-2" /> Create Assistant
            </Button>
          </div>
        </div> : <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAssistants.map(assistant => <div 
              key={assistant.id} 
              className="bg-gradient-to-br from-[#0a0a0f] via-[#121018] to-[#1b1226] border border-[#4b2a78]/40 shadow-[inset_0_0_0.5px_rgba(255,255,255,0.05),0_4px_30px_rgba(0,0,0,0.4)] backdrop-blur-md rounded-2xl p-6 text-white space-y-4 hover-glow cursor-pointer transition-all duration-300 hover:-translate-y-1" 
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
                  <h3 className="font-semibold font-warp text-white">{assistant.name}</h3>
                  <p className="text-sm text-gray-400">{assistant.role}</p>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label className="text-xs text-gray-400">Description</Label>
                <p className="text-sm text-gray-200">
                  {assistant.role || 'AI Assistant'}
                </p>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className={`w-2 h-2 rounded-full ${assistant.status === 'active' ? 'bg-green-500' : 'bg-gray-400'}`} />
                  <span className="text-xs text-gray-400 capitalize">
                    {assistant.status}
                  </span>
                </div>
                <Badge variant="outline" className="bg-black/20 text-xs">
                  AI Assistant
                </Badge>
              </div>
            </div>)}
        </div>}
    </div>;
}
