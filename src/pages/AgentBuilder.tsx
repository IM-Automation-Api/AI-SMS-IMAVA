
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { FileText, Globe, HelpCircle, Upload } from "lucide-react";

export default function AgentBuilder() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-primary">Create new agent</h1>
      </div>

      <div className="grid grid-cols-[240px_1fr_300px] gap-6">
        {/* Left Sidebar */}
        <div className="space-y-2">
          <Button variant="ghost" className="w-full justify-start" size="lg">
            <FileText className="mr-2" />
            Files
          </Button>
          <Button variant="ghost" className="w-full justify-start" size="lg">
            <Upload className="mr-2" />
            Text
          </Button>
          <Button variant="ghost" className="w-full justify-start" size="lg">
            <Globe className="mr-2" />
            Website
          </Button>
          <Button variant="ghost" className="w-full justify-start" size="lg">
            <HelpCircle className="mr-2" />
            Q&A
          </Button>
        </div>

        {/* Main Content */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Files</h2>
          <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
            <div className="flex flex-col items-center gap-2">
              <Upload className="w-8 h-8 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">
                Drag & drop files here, or click to select files
              </p>
              <p className="text-xs text-muted-foreground">
                Supported File Types: pdf, doc, docx, txt
              </p>
            </div>
          </div>
          <p className="text-sm text-muted-foreground mt-4">
            If you are uploading a PDF, make sure you can select/highlight the text.
          </p>
        </Card>

        {/* Right Sidebar */}
        <div className="space-y-6">
          <div className="bg-card border border-border p-4 rounded-lg">
            <h3 className="font-semibold mb-4">SOURCES</h3>
            <div className="flex justify-between text-sm">
              <span>Total size:</span>
              <span>0 B / 400 KB</span>
            </div>
            <Button className="w-full mt-4">Create agent</Button>
          </div>
          
          <div className="bg-card border border-border p-4 rounded-lg">
            <h3 className="font-semibold mb-4">API Provider</h3>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="api-key">API Key</Label>
                <Input id="api-key" type="password" placeholder="Enter your API key" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="model">Model</Label>
                <Input id="model" placeholder="Select model" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
