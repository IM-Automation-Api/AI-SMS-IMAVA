import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Lead } from '@/hooks/useLeads'; // Assuming Lead type is exported
import { useAssistants } from '@/hooks/useAssistants'; // Import assistants hook
import { useToast } from '@/hooks/use-toast'; // Import toast hook
import { Loader2, MessageSquarePlus } from 'lucide-react'; // Import icons

interface SendCampaignDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  leadsToSend: Lead[];
}

export function SendCampaignDialog({ open, onOpenChange, leadsToSend }: SendCampaignDialogProps) {
  const { assistants, isLoading: isAssistantsLoading } = useAssistants();
  const [selectedAssistant, setSelectedAssistant] = useState<string>("");
  const [isSending, setIsSending] = useState(false);
  const { toast } = useToast();

  const handleSendMessages = async () => {
    if (!selectedAssistant || leadsToSend.length === 0) {
      toast({
        title: "Missing information",
        description: "Please select an assistant and ensure there are leads to send.",
        variant: "destructive"
      });
      return;
    }
    setIsSending(true);
    try {
      const leadIds = leadsToSend.map(lead => lead.id);

      const response = await fetch('/api/send-campaign', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          assistantId: selectedAssistant,
          leadIds: leadIds
        })
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Failed to send messages');
      toast({
        title: "Campaign started",
        description: `Messages are being sent to ${leadsToSend.length} lead(s).`
      });

      onOpenChange(false); // Close dialog on success
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

  const isSendButtonDisabled = leadsToSend.length === 0 || !selectedAssistant || isSending || isAssistantsLoading;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] glass-panel border-white/10 text-white"> {/* Apply styling */}
        <DialogHeader>
          <DialogTitle className="text-gradient">Send Campaign to Leads</DialogTitle> {/* Apply styling */}
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div>
            <Label className="text-white/80">Leads to Send ({leadsToSend.length})</Label> {/* Apply styling */}
            <div className="max-h-40 overflow-y-auto text-sm text-white/70"> {/* Display selected leads */}
              {leadsToSend.length > 0 ? (
                leadsToSend.map(lead => (
                  <div key={lead.id}>{lead.first_name} {lead.last_name} ({lead.phone})</div>
                ))
              ) : (
                <div>No leads selected.</div>
              )}
            </div>
          </div>

          <div>
            <Label className="text-white/80">Select Assistant</Label> {/* Apply styling */}
            {isAssistantsLoading ? (
              <div className="flex items-center mt-2 text-white/70">
                <Loader2 className="h-4 w-4 animate-spin mr-2" /> Loading assistants...
              </div>
            ) : (
              <Select value={selectedAssistant} onValueChange={setSelectedAssistant} disabled={isAssistantsLoading}>
                <SelectTrigger className="premium-input"> {/* Apply styling */}
                  <SelectValue placeholder="Choose an assistant" />
                </SelectTrigger>
                <SelectContent>
                  {assistants.map(assistant => (
                    <SelectItem key={assistant.id} value={assistant.id}>
                      {assistant.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} className="premium-input hover:bg-white/5">Cancel</Button> {/* Apply styling */}
          <Button onClick={handleSendMessages} disabled={isSendButtonDisabled} className="premium-button"> {/* Apply styling */}
            {isSending ? "Sending..." : "Send SMS"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
