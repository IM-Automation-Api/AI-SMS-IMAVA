import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { useLeads } from "@/hooks/useLeads";
import { useAssistants } from "@/hooks/useAssistants";
import { CSVImportDialog } from "@/components/leads/CSVImportDialog";
import { CheckCircle, ListOrdered, MessageSquarePlus, Upload, UserCircle, X } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
export default function SMSCampaignPage() {
  const {
    leads
  } = useLeads(1, 100); // Get up to 100 leads
  const {
    assistants
  } = useAssistants();
  const [selectedLeads, setSelectedLeads] = useState<string[]>([]);
  const [selectedAssistant, setSelectedAssistant] = useState<string>("");
  const [importDialogOpen, setImportDialogOpen] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const {
    toast
  } = useToast();
  const clientId = leads[0]?.client_id || '';
  const handleLeadToggle = (leadId: string) => {
    setSelectedLeads(prev => prev.includes(leadId) ? prev.filter(id => id !== leadId) : [...prev, leadId]);
  };
  const handleSendMessages = async () => {
    if (!selectedAssistant || selectedLeads.length === 0) {
      toast({
        title: "Missing information",
        description: "Please select an assistant and at least one lead.",
        variant: "destructive"
      });
      return;
    }
    setIsSending(true);
    try {
      const response = await fetch('/api/send-campaign', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          assistantId: selectedAssistant,
          leadIds: selectedLeads
        })
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Failed to send messages');
      toast({
        title: "Campaign started",
        description: `Messages are being sent to ${selectedLeads.length} leads.`
      });

      // Clear selection after successful send
      setSelectedLeads([]);
    } catch (error) {
      console.error('Error sending messages:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to send messages",
        variant: "destructive"
      });
    } finally {
      setIsSending(false);
    }
  };
  const removeFromQueue = (leadId: string) => {
    setSelectedLeads(prev => prev.filter(id => id !== leadId));
  };
  return <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-warp text-gradient">SMS Campaign</h1>
        <Button onClick={() => setImportDialogOpen(true)}>
          <Upload className="mr-2 h-4 w-4" />
          Import Leads
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Lead Selection */}
        <Card className="p-6 col-span-1 md:col-span-2">
          <h2 className="text-xl font-semibold mb-4">Select Leads</h2>
          <div className="space-y-4">
            <Input type="text" placeholder="Search leads..." className="mb-4" />
            <div className="max-h-96 overflow-y-auto space-y-2">
              {leads.map(lead => <div key={lead.id} className="flex items-center justify-between p-3 rounded-md border border-border hover:bg-secondary/20">
                  <div className="flex items-center gap-3">
                    <Checkbox id={`lead-${lead.id}`} checked={selectedLeads.includes(lead.id)} onCheckedChange={() => handleLeadToggle(lead.id)} />
                    <Label htmlFor={`lead-${lead.id}`} className="flex-grow cursor-pointer">
                      <div className="font-medium">
                        {lead.first_name} {lead.last_name}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {lead.phone}
                      </div>
                    </Label>
                  </div>
                </div>)}
            </div>
          </div>
        </Card>

        {/* Queue and Assistant Selection */}
        <div className="space-y-6">
          <Card className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <ListOrdered className="h-5 w-5" />
              <h2 className="text-xl font-semibold">Queue ({selectedLeads.length})</h2>
            </div>
            
            {selectedLeads.length > 0 ? <div className="space-y-2 max-h-48 overflow-y-auto mb-4">
                {selectedLeads.map(leadId => {
              const lead = leads.find(l => l.id === leadId);
              return lead ? <div key={lead.id} className="flex items-center justify-between py-2 px-3 rounded-md bg-secondary/20">
                      <span>{lead.first_name} {lead.last_name}</span>
                      <Button variant="ghost" size="sm" onClick={() => removeFromQueue(lead.id)}>
                        <X className="h-4 w-4" />
                      </Button>
                    </div> : null;
            })}
              </div> : <div className="text-center py-8 text-muted-foreground">
                <p>No leads selected</p>
              </div>}
          </Card>

          <Card className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <UserCircle className="h-5 w-5" />
              <h2 className="text-xl font-semibold">Select Assistant</h2>
            </div>
            
            <Select value={selectedAssistant} onValueChange={setSelectedAssistant}>
              <SelectTrigger>
                <SelectValue placeholder="Choose an assistant" />
              </SelectTrigger>
              <SelectContent>
                {assistants.map(assistant => <SelectItem key={assistant.id} value={assistant.id}>
                    {assistant.name}
                  </SelectItem>)}
              </SelectContent>
            </Select>

            <Button className="w-full mt-4" disabled={selectedLeads.length === 0 || !selectedAssistant || isSending} onClick={handleSendMessages}>
              <MessageSquarePlus className="mr-2 h-4 w-4" />
              {isSending ? "Sending..." : "Send SMS"}
            </Button>
          </Card>
        </div>
      </div>

      <CSVImportDialog open={importDialogOpen} onOpenChange={setImportDialogOpen} clientId={clientId} />
    </div>;
}