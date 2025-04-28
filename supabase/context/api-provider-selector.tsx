"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { useApiKeys } from "@/lib/api-key-context";
// Ensure the correct path to the module
import { ApiProvider } from "../../../lib/api-provider"; // Adjusted the path to match the correct file location
import { Settings, Info } from "lucide-react";

export function ApiProviderSelector() {
  const { apiKeys, providers, loading, getActiveKeyForProvider } = useApiKeys();
  const [selectedProvider, setSelectedProvider] = useState<string | null>(null);
  const [providerInfo, setProviderInfo] = useState<{
    [key: string]: { description: string; capabilities: string[] };
  }>({
    openai: {
      description: "OpenAI's GPT models are powerful language models that excel at natural conversation and creative content generation.",
      capabilities: [
        "Natural conversation flows",
        "Creative content generation",
        "Strong reasoning capabilities",
        "Broad knowledge base",
      ],
    },
    claude: {
      description: "Anthropic's Claude is designed to be helpful, harmless, and honest, with strong capabilities in understanding context.",
      capabilities: [
        "Excellent at following instructions",
        "Strong contextual understanding",
        "Nuanced responses",
        "Safety-focused design",
      ],
    },
    llama: {
      description: "Meta's Llama is an open-source large language model with strong performance across various tasks.",
      capabilities: [
        "Open-source flexibility",
        "Competitive performance",
        "Customizable for specific use cases",
        "Community-supported development",
      ],
    },
    deepseek: {
      description: "DeepSeek offers advanced AI models specialized in natural language processing with strong technical capabilities.",
      capabilities: [
        "Technical expertise",
        "Efficient processing",
        "Specialized knowledge domains",
        "Emerging capabilities",
      ],
    },
  });

  // Set default provider based on available API keys
  useEffect(() => {
    if (loading) return;

    // Find the first active API key
    for (const provider of ["openai", "claude", "llama", "deepseek"]) {
      const key = getActiveKeyForProvider(provider);
      if (key) {
        setSelectedProvider(provider);
        return;
      }
    }

    // If no active key, set to first provider
    setSelectedProvider("openai");
  }, [loading, apiKeys, getActiveKeyForProvider]);

  if (loading || !selectedProvider) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>AI Provider</CardTitle>
          <CardDescription>Loading providers...</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  const hasActiveKey = (provider: string) => {
    return !!getActiveKeyForProvider(provider);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>AI Provider Selection</CardTitle>
        <CardDescription>
          Select which AI provider to use for generating SMS responses
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Tabs defaultValue={selectedProvider} onValueChange={setSelectedProvider}>
          <TabsList className="grid grid-cols-4 w-full">
            <TabsTrigger value="openai" disabled={!hasActiveKey("openai")}>
              OpenAI
            </TabsTrigger>
            <TabsTrigger value="claude" disabled={!hasActiveKey("claude")}>
              Claude
            </TabsTrigger>
            <TabsTrigger value="llama" disabled={!hasActiveKey("llama")}>
              Llama
            </TabsTrigger>
            <TabsTrigger value="deepseek" disabled={!hasActiveKey("deepseek")}>
              DeepSeek
            </TabsTrigger>
          </TabsList>

          {Object.keys(providerInfo).map((provider) => (
            <TabsContent key={provider} value={provider} className="space-y-4">
              <div className="rounded-lg border p-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium capitalize">{provider}</h3>
                  <div className="flex items-center gap-2">
                    {hasActiveKey(provider) ? (
                      <div className="rounded-full bg-green-500/20 px-2 py-1 text-xs font-medium text-green-500">
                        API Key Configured
                      </div>
                    ) : (
                      <div className="rounded-full bg-red-500/20 px-2 py-1 text-xs font-medium text-red-500">
                        No API Key
                      </div>
                    )}
                  </div>
                </div>

                <p className="mt-2 text-muted-foreground">
                  {providerInfo[provider].description}
                </p>

                <div className="mt-4">
                  <h4 className="text-sm font-medium mb-2">Capabilities:</h4>
                  <ul className="space-y-1">
                    {providerInfo[provider].capabilities.map((capability, index) => (
                      <li key={index} className="flex items-center gap-2 text-sm">
                        <div className="h-1.5 w-1.5 rounded-full bg-primary"></div>
                        {capability}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="flex justify-between">
                <Button variant="outline" size="sm" onClick={() => window.location.href = "/settings/api-keys"}>
                  <Settings className="mr-2 h-4 w-4" />
                  Manage API Keys
                </Button>

                <Button variant="outline" size="sm">
                  <Info className="mr-2 h-4 w-4" />
                  Learn More
                </Button>
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </CardContent>
    </Card>
  );
}
