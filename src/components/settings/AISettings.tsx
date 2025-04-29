
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { ApiProviderSelector } from "./api-provider-selector";
import { SystemPromptEditor } from "./system-prompt-editor";

export function AISettings() {
  const { toast } = useToast();
  
  const handleConfigureAI = () => {
    toast({
      title: "Coming Soon",
      description: "AI settings configuration will be available soon."
    });
  };

  return (
    <div className="bg-gradient-to-br from-[#0a0a0f] via-[#121018] to-[#1b1226] border border-[#4b2a78]/40 shadow-[inset_0_0_0.5px_rgba(255,255,255,0.05),0_4px_30px_rgba(0,0,0,0.4)] backdrop-blur-md rounded-2xl p-6 text-white">
      <div className="mb-4">
        <h2 className="text-white text-xl font-semibold">AI Settings</h2>
        <p className="text-gray-400 text-sm">
          Configure your AI behavior and preferences.
        </p>
      </div>
      <div>
        <p className="mb-4 text-gray-300">
          Customize how your AI assistant interacts with leads and handles conversations.
        </p>
        <div className="space-y-4">
          <Button onClick={handleConfigureAI}>
            Configure AI Settings
          </Button>
        </div>
      </div>
    </div>
  );
}
