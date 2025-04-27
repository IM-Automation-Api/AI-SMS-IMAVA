
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

export function SystemPromptEditor() {
  const [prompt, setPrompt] = useState("");
  const { toast } = useToast();

  const handleSave = () => {
    toast({
      title: "System prompt saved",
      description: "Your changes have been saved successfully.",
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>System Prompt</CardTitle>
        <CardDescription>
          Customize the default system prompt for your AI assistant
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Enter your system prompt here..."
          className="min-h-[200px]"
        />
        <Button onClick={handleSave}>Save Changes</Button>
      </CardContent>
    </Card>
  );
}
