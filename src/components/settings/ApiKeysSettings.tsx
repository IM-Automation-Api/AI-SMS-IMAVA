
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

export function ApiKeysSettings() {
  const { toast } = useToast();
  
  const handleManageKeys = () => {
    toast({
      title: "Coming Soon",
      description: "API key management will be available soon."
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>API Keys</CardTitle>
        <CardDescription>
          Manage your API keys for different AI providers.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="mb-4">
          Configure your API keys for different AI providers to use with your SMS automation.
        </p>
        <div className="space-y-4">
          <Button onClick={handleManageKeys}>
            Manage API Keys
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
