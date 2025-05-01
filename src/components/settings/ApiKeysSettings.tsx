
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/supabase/auth/auth-context";
import { Loader2 } from "lucide-react";

export function ApiKeysSettings() {
  const { toast } = useToast();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [apiKeys, setApiKeys] = useState({
    openai: "",
    groq: "",
    anthropic: "",
  });

  // Fetch existing API keys on component mount
  useEffect(() => {
    const fetchApiKeys = async () => {
      if (!user) return;
      
      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from("api_keys")
          .select("*")
          .eq("user_id", user.id);
        
        if (error) {
          console.error("Error fetching API keys:", error);
        } else if (data && data.length > 0) {
          const keys = {};
          data.forEach(key => {
            keys[key.provider.toLowerCase()] = key.api_key;
          });
          setApiKeys(prevKeys => ({
            ...prevKeys,
            ...keys
          }));
        }
      } catch (error) {
        console.error("Error fetching API keys:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchApiKeys();
  }, [user]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setApiKeys(prev => ({ ...prev, [name]: value }));
  };

  const handleSaveApiKeys = async () => {
    if (!user) {
      toast({
        title: "Error",
        description: "You must be logged in to save API keys.",
        variant: "destructive",
      });
      return;
    }
    
    setIsSaving(true);
    try {
      // Get existing keys
      const { data: existingKeys, error: fetchError } = await supabase
        .from("api_keys")
        .select("provider")
        .eq("user_id", user.id);
      
      if (fetchError) throw fetchError;
      
      const existingProviders = existingKeys?.map(k => k.provider.toLowerCase()) || [];
      
      // Prepare updates and inserts
      const updates = [];
      const inserts = [];
      
      // Process each API key
      Object.entries(apiKeys).forEach(([provider, apiKey]) => {
        if (!apiKey) return; // Skip empty keys
        
        const providerName = provider.toUpperCase();
        
        if (existingProviders.includes(provider.toLowerCase())) {
          // Update existing key
          updates.push(
            supabase
              .from("api_keys")
              .update({
                api_key: apiKey,
                updated_at: new Date().toISOString(),
              })
              .eq("user_id", user.id)
              .eq("provider", providerName)
          );
        } else {
          // Insert new key
          inserts.push(
            supabase
              .from("api_keys")
              .insert({
                user_id: user.id,
                provider: providerName,
                api_key: apiKey,
                is_active: true,
              })
          );
        }
      });
      
      // Execute all updates and inserts
      const results = await Promise.all([...updates, ...inserts]);
      
      // Check for errors
      const errors = results.filter(result => result.error);
      if (errors.length > 0) {
        throw errors[0].error;
      }
      
      toast({
        title: "API keys saved",
        description: "Your API keys have been saved successfully.",
      });
    } catch (error) {
      console.error("Error saving API keys:", error);
      toast({
        title: "Error",
        description: "Failed to save API keys. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
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
        <p className="mb-4 text-sm">
          Configure your API keys for different AI providers to use with your SMS automation.
        </p>
        
        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <span className="ml-2">Loading API keys...</span>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">OpenAI API Key</label>
              <Input
                type="password"
                name="openai"
                value={apiKeys.openai}
                onChange={handleInputChange}
                className="w-full"
                placeholder="sk-..."
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Groq API Key</label>
              <Input
                type="password"
                name="groq"
                value={apiKeys.groq}
                onChange={handleInputChange}
                className="w-full"
                placeholder="gsk_..."
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Anthropic API Key</label>
              <Input
                type="password"
                name="anthropic"
                value={apiKeys.anthropic}
                onChange={handleInputChange}
                className="w-full"
                placeholder="sk-ant-..."
              />
            </div>
            
            <Button 
              onClick={handleSaveApiKeys} 
              className="mt-4"
              disabled={isSaving}
            >
              {isSaving ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                "Save API Keys"
              )}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
