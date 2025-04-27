
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";

export function ApiProviderSelector() {
  const [provider, setProvider] = useState("openai");

  return (
    <Card>
      <CardHeader>
        <CardTitle>AI Provider</CardTitle>
        <CardDescription>
          Select which AI provider to use for message processing
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Select value={provider} onValueChange={setProvider}>
          <SelectTrigger className="w-full sm:w-[200px]">
            <SelectValue placeholder="Select provider" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="openai">OpenAI</SelectItem>
            <SelectItem value="anthropic">Anthropic</SelectItem>
            <SelectItem value="perplexity">Perplexity</SelectItem>
          </SelectContent>
        </Select>
      </CardContent>
    </Card>
  );
}
