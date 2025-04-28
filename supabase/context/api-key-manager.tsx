"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label"; // Ensure this path is correct or update it to the actual location of the Label component.
import { Switch } from "@/components/ui/switch";
import { useApiKeys, ApiKey } from "@/lib/api-key-context";
import { ApiProvider } from "@/lib/api-key-context";
import { Eye, EyeOff, Trash2, Save, Plus } from "lucide-react";

interface ApiKeyWithIsActive extends ApiKey {
  is_active: boolean;
}

export function ApiKeyManager() {
  const { apiKeys, providers, loading, addApiKey, updateApiKey, deleteApiKey } = useApiKeys() as {
    apiKeys: ApiKeyWithIsActive[];
    providers: ApiProvider[];
    loading: boolean;
    addApiKey: (provider: string, apiKey: string) => Promise<void>;
    updateApiKey: (id: string, apiKey: string, isActive: boolean) => Promise<void>;
    deleteApiKey: (id: string) => Promise<void>;
  };
  const [newProvider, setNewProvider] = useState("");
  const [newApiKey, setNewApiKey] = useState("");
  const [showKeys, setShowKeys] = useState<{ [key: string]: boolean }>({});

  const toggleShowKey = (id: string) => {
    setShowKeys((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleAddKey = async () => {
    if (!newProvider || !newApiKey) return;
    await addApiKey(newProvider, newApiKey);
    setNewProvider("");
    setNewApiKey("");
  };

  const handleUpdateKey = async (id: string, apiKey: string, isActive: boolean) => {
    await updateApiKey(id, apiKey, isActive);
  };

  const handleDeleteKey = async (id: string) => {
    if (confirm("Are you sure you want to delete this API key?")) {
      await deleteApiKey(id);
    }
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>API Keys</CardTitle>
          <CardDescription>Loading API keys...</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>API Provider Keys</CardTitle>
        <CardDescription>
          Manage your API keys for different AI providers. These keys will be used for generating SMS responses.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {apiKeys.length > 0 ? (
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Your API Keys</h3>
            {apiKeys.map((key) => (
              <div key={key.id} className="rounded-lg border p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="font-medium capitalize">{key.provider}</div>
                    <div className="rounded-full bg-primary/10 px-2 py-1 text-xs font-medium text-primary">
                      {key.is_active ? "Active" : "Inactive"}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="icon" onClick={() => toggleShowKey(key.id)}>
                      {showKeys[key.id] ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      <span className="sr-only">{showKeys[key.id] ? "Hide" : "Show"} API key</span>
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => handleDeleteKey(key.id)}>
                      <Trash2 className="h-4 w-4" />
                      <span className="sr-only">Delete API key</span>
                    </Button>
                  </div>
                </div>
                <div className="mt-4 space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor={`api-key-${key.id}`}>API Key</Label>
                    <div className="flex gap-2">
                      <Input
                        id={`api-key-${key.id}`}
                        type={showKeys[key.id] ? "text" : "password"}
                        value={key.api_key}
                        onChange={(e) => handleUpdateKey(key.id, e.target.value, key.is_active)}
                        placeholder="Enter API key"
                      />
                      <Button onClick={() => handleUpdateKey(key.id, key.api_key, key.is_active)}>
                        <Save className="mr-2 h-4 w-4" />
                        Save
                      </Button>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor={`api-key-active-${key.id}`}>Active</Label>
                    <Switch
                      id={`api-key-active-${key.id}`}
                      checked={key.is_active}
                      onCheckedChange={(checked) => handleUpdateKey(key.id, key.api_key, checked)}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="rounded-lg border p-4 text-center text-muted-foreground">
            No API keys added yet. Add your first API key below.
          </div>
        )}

        <div className="space-y-4">
          <h3 className="text-lg font-medium">Add New API Key</h3>
          <div className="space-y-4 rounded-lg border p-4">
            <div className="space-y-2">
              <Label htmlFor="provider">Provider</Label>
              <select
                id="provider"
                className="w-full rounded-md border border-input bg-background px-3 py-2"
                value={newProvider}
                onChange={(e) => setNewProvider(e.target.value)}
              >
                <option value="">Select a provider</option>
                {providers.map((provider) => (
                  <option key={provider.id} value={provider.id}>
                    {provider.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="api-key">API Key</Label>
              <Input
                id="api-key"
                type="password"
                value={newApiKey}
                onChange={(e) => setNewApiKey(e.target.value)}
                placeholder="Enter API key"
              />
            </div>
            <Button onClick={handleAddKey} disabled={!newProvider || !newApiKey}>
              <Plus className="mr-2 h-4 w-4" />
              Add API Key
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
