
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
    <Card>
      <CardHeader>
        <CardTitle>AI Settings</CardTitle>
        <CardDescription>
          Configure your AI behavior and preferences.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="mb-4">
          Customize how your AI assistant interacts with leads and handles conversations.
        </p>
        <div className="space-y-4">
          <Button onClick={handleConfigureAI}>
            Configure AI Settings
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
