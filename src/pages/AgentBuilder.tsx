
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { FileText, Globe, HelpCircle, Upload } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { toast } from "@/components/ui/use-toast";

export default function AgentBuilder() {
  const isMobile = useIsMobile();
  const [searchParams] = useSearchParams();
  const assistantId = searchParams.get("id");
  const [isEditMode, setIsEditMode] = useState(false);
  const [agentName, setAgentName] = useState("");
  const [agentRole, setAgentRole] = useState("");
  const [activeTab, setActiveTab] = useState("files");

  useEffect(() => {
    if (assistantId) {
      setIsEditMode(true);
      // Simulate fetching assistant data
      // In a real application, you would fetch this data from your API
      const assistants = [
        {
          id: "1",
          name: "Ava Solar",
          role: "Solar Expert",
        },
        {
          id: "2",
          name: "Ava Roofing",
          role: "Roofing Specialist",
        },
        {
          id: "3",
          name: "Ava Agency",
          role: "Marketing Expert",
        },
        {
          id: "4",
          name: "Ava Construction",
          role: "Construction Specialist",
        }
      ];
      
      const assistant = assistants.find(a => a.id === assistantId);
      if (assistant) {
        setAgentName(assistant.name);
        setAgentRole(assistant.role);
        toast({
          title: "Editing assistant",
          description: `You are now editing ${assistant.name}`,
        });
      }
    }
  }, [assistantId]);

  const renderTabContent = () => {
    switch (activeTab) {
      case "files":
        return (
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
        );
      case "text":
        return (
          <Card className="p-4 md:p-6">
            <h2 className="text-lg md:text-xl font-semibold text-foreground mb-4">Text</h2>
            <Textarea 
              placeholder="Paste or type text knowledge here..." 
              className="min-h-[200px]" 
            />
          </Card>
        );
      case "website":
        return (
          <Card className="p-4 md:p-6">
            <h2 className="text-lg md:text-xl font-semibold text-foreground mb-4">Website</h2>
            <Input placeholder="Enter website URL" className="mb-4" />
            <Button>Scrape Website</Button>
          </Card>
        );
      case "faq":
        return (
          <Card className="p-4 md:p-6">
            <h2 className="text-lg md:text-xl font-semibold text-foreground mb-4">FAQs</h2>
            <div className="space-y-4">
              <div>
                <Label>Question</Label>
                <Input placeholder="Enter a question" className="mb-2" />
                <Label>Answer</Label>
                <Textarea placeholder="Enter the answer" className="min-h-[100px]" />
              </div>
              <Button variant="outline" className="w-full">+ Add Another FAQ</Button>
            </div>
          </Card>
        );
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between items-start">
        <h1 className="text-3xl tracking-[0.12em] font-zag">
          {isEditMode ? `Edit ${agentName}` : "Agent Builder"}
        </h1>
        <p className="text-sm text-muted-foreground mt-2">
          Empower your AI assistant by importing files, text, company FAQs, website content, or custom knowledge to craft a uniquely tailored agent for your business.
        </p>
      </div>

      {/* Agent details fields */}
      <div className="space-y-4">
        <div>
          <Label htmlFor="agentName">Agent Name</Label>
          <Input 
            id="agentName" 
            placeholder="Enter agent name" 
            value={agentName}
            onChange={(e) => setAgentName(e.target.value)}
            className="mt-1"
          />
        </div>
        <div>
          <Label htmlFor="agentRole">Agent Role</Label>
          <Input 
            id="agentRole" 
            placeholder="Enter agent role (e.g., Solar Expert)" 
            value={agentRole}
            onChange={(e) => setAgentRole(e.target.value)}
            className="mt-1"
          />
        </div>
      </div>

      <div className="grid gap-6 grid-cols-1">
        {/* Mobile Tabs Navigation */}
        {isMobile && (
          <div className="flex overflow-x-auto pb-2 gap-2 hide-scrollbar">
            <Button 
              variant={activeTab === "files" ? "default" : "ghost"} 
              className="flex-shrink-0"
              onClick={() => setActiveTab("files")}
            >
              <FileText className="mr-2" />
              Files
            </Button>
            <Button 
              variant={activeTab === "text" ? "default" : "ghost"} 
              className="flex-shrink-0"
              onClick={() => setActiveTab("text")}
            >
              <Upload className="mr-2" />
              Text
            </Button>
            <Button 
              variant={activeTab === "website" ? "default" : "ghost"} 
              className="flex-shrink-0"
              onClick={() => setActiveTab("website")}
            >
              <Globe className="mr-2" />
              Website
            </Button>
            <Button 
              variant={activeTab === "faq" ? "default" : "ghost"} 
              className="flex-shrink-0"
              onClick={() => setActiveTab("faq")}
            >
              <HelpCircle className="mr-2" />
              FAQ
            </Button>
          </div>
        )}

        {/* Desktop Left Sidebar */}
        {!isMobile && (
          <div className="flex flex-col space-y-2 col-span-1">
            <Button 
              variant={activeTab === "files" ? "default" : "ghost"} 
              className="w-full justify-start"
              onClick={() => setActiveTab("files")}
              size="lg"
            >
              <FileText className="mr-2" />
              Files
            </Button>
            <Button 
              variant={activeTab === "text" ? "default" : "ghost"} 
              className="w-full justify-start"
              onClick={() => setActiveTab("text")}
              size="lg"
            >
              <Upload className="mr-2" />
              Text
            </Button>
            <Button 
              variant={activeTab === "website" ? "default" : "ghost"} 
              className="w-full justify-start"
              onClick={() => setActiveTab("website")}
              size="lg"
            >
              <Globe className="mr-2" />
              Website
            </Button>
            <Button 
              variant={activeTab === "faq" ? "default" : "ghost"} 
              className="w-full justify-start"
              onClick={() => setActiveTab("faq")}
              size="lg"
            >
              <HelpCircle className="mr-2" />
              FAQ
            </Button>
          </div>
        )}

        {/* Main Content Area */}
        <div className="col-span-1">
          {renderTabContent()}
        </div>

        {/* Right Panel */}
        <div className="space-y-4 md:space-y-6 col-span-1">
          <div className="bg-card border border-border p-4 rounded-lg">
            <h3 className="font-semibold text-foreground mb-4">SOURCES</h3>
            <div className="flex justify-between text-sm">
              <span>Total size:</span>
              <span>0 B / 400 KB</span>
            </div>
            <Button className="w-full mt-4 bg-primary hover:bg-primary/90">
              {isEditMode ? "Update agent" : "Create agent"}
            </Button>
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
