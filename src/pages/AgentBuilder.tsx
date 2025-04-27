
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { FileText, Globe, HelpCircle, Upload } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

export default function AgentBuilder() {
  const isMobile = useIsMobile();

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between items-start">
        <h1 className="text-2xl md:text-3xl font-bold text-foreground">Create new agent</h1>
        <p className="text-sm text-muted-foreground mt-2">
          Empower your AI assistant by importing files, text, company FAQs, website content, or custom knowledge to craft a uniquely tailored agent for your business.
        </p>
      </div>

      <div className={`grid gap-6 ${isMobile ? 'grid-cols-1' : 'grid-cols-[240px_1fr_300px]'}`}>
        {/* Left Sidebar */}
        <div className={`flex ${isMobile ? 'overflow-x-auto pb-2 gap-2' : 'flex-col space-y-2'}`}>
          <Button variant="ghost" className={`${isMobile ? 'flex-shrink-0' : 'w-full'} justify-start`} size="lg">
            <FileText className="mr-2" />
            Files
          </Button>
          <Button variant="ghost" className={`${isMobile ? 'flex-shrink-0' : 'w-full'} justify-start`} size="lg">
            <Upload className="mr-2" />
            Text
          </Button>
          <Button variant="ghost" className={`${isMobile ? 'flex-shrink-0' : 'w-full'} justify-start`} size="lg">
            <Globe className="mr-2" />
            Website
          </Button>
          <Button variant="ghost" className={`${isMobile ? 'flex-shrink-0' : 'w-full'} justify-start`} size="lg">
            <HelpCircle className="mr-2" />
            FAQ
          </Button>
        </div>

        {/* Main Content */}
        <Card className="p-4 md:p-6">
          <h2 className="text-lg md:text-xl font-semibold text-foreground mb-4">Files</h2>
          <div className="border-2 border-dashed border-border rounded-lg p-4 md:p-8 text-center">
            <div className="flex flex-col items-center gap-2">
              <Upload className="w-8 h-8 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">
                {isMobile ? 'Tap to select files' : 'Drag & drop files here, or click to select files'}
              </p>
              <p className="text-xs text-muted-foreground">
                Supported: pdf, doc, docx, txt
              </p>
            </div>
          </div>
          <p className="text-sm text-muted-foreground mt-4">
            If you are uploading a PDF, make sure you can select/highlight the text.
          </p>
        </Card>

        {/* Right Sidebar */}
        <div className="space-y-4 md:space-y-6">
          <div className="bg-card border border-border p-4 rounded-lg">
            <h3 className="font-semibold text-foreground mb-4">SOURCES</h3>
            <div className="flex justify-between text-sm">
              <span>Total size:</span>
              <span>0 B / 400 KB</span>
            </div>
            <Button className="w-full mt-4 bg-primary hover:bg-primary/90">Create agent</Button>
          </div>
          
          <div className="bg-card border border-border p-4 rounded-lg">
            <h3 className="font-semibold text-foreground mb-4">API Provider</h3>
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
