"use client";

import { createContext, useContext, useState } from "react";

export interface ApiKey {
  id: string;
  provider: string;
  apiKey: string;
  isActive: boolean;
}

interface ApiKeysContext {
  apiKeys: ApiKey[];
  providers: { provider_id: string; displayName: string; description: string }[];
  loading: boolean;
  addApiKey: (provider: string, apiKey: string) => Promise<void>;
  updateApiKey: (id: string, apiKey: string, isActive: boolean) => Promise<void>;
  deleteApiKey: (id: string) => Promise<void>;
  getActiveKeyForProvider: (provider: string) => ApiKey | undefined;
  apiKeysError: string | null;
}

const ApiKeysContext = createContext<ApiKeysContext | undefined>(undefined);

export const ApiKeyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([]);
  const [providers, setProviders] = useState([{ provider_id: "openai", displayName: "OpenAI", description: "OpenAI API" }, { provider_id: "anotherProvider", displayName: "Another Provider", description: "Another Provider API" }]);
  const [loading, setLoading] = useState(false);
  const [apiKeysError, setApiKeysError] = useState<string | null>(null);

  const addApiKey = async (provider: string, apiKey: string) => {
    setLoading(true);
    try {
      // Simulate adding an API key
      setApiKeys([...apiKeys, { id: crypto.randomUUID(), provider, apiKey, isActive: true }]);
    } catch (error) {
      setApiKeysError("Failed to add API key");
      console.error("Error adding API key:", error);
    } finally {
      setLoading(false);
    }
  };

  const updateApiKey = async (id: string, apiKey: string, isActive: boolean) => {
    setLoading(true);
    try {
      // Simulate updating an API key
      setApiKeys(apiKeys.map((key) =>
        key.id === id ? { ...key, apiKey, isActive } : key
      ));
    } catch (error) {
      setApiKeysError("Failed to update API key");
      console.error("Error updating API key:", error);
    } finally {
      setLoading(false);
    }
  };

  const deleteApiKey = async (id: string) => {
    setLoading(true);
    try {
      // Simulate deleting an API key
      setApiKeys(apiKeys.filter((key) => key.id !== id));
    } catch (error) {
      setApiKeysError("Failed to delete API key");
      console.error("Error deleting API key:", error);
    } finally {
      setLoading(false);
    }
  };

  const getActiveKeyForProvider = (provider: string): ApiKey | undefined => {
    return apiKeys.find((key) => key.provider === provider && key.isActive);
  };

  return (
    <ApiKeysContext.Provider value={{ apiKeys, providers, loading, addApiKey, updateApiKey, deleteApiKey, getActiveKeyForProvider, apiKeysError }}>
      {children}
    </ApiKeysContext.Provider>
  );
};

export const useApiKeys = () => {
  const context = useContext(ApiKeysContext);
  if (!context) {
    throw new Error("useApiKeys must be used within an ApiKeyProvider");
  }
  return context;
};
