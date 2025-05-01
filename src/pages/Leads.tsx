
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Upload, Plus, MessageSquarePlus } from "lucide-react"; // Added Plus and MessageSquarePlus icons
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"; // Added Dialog components
import { useLeads, Lead } from "@/hooks/useLeads";
import { useLeadTags } from "@/hooks/useLeadTags";
import { AddLeadForm } from "@/components/leads/AddLeadForm"; // Added AddLeadForm import
import { CSVImportDialog } from "@/components/leads/CSVImportDialog";
import { LeadDetails } from "@/components/leads/LeadDetails";
import { LeadsTable } from "@/components/leads/LeadsTable";
import { HeroCard } from "@/components/ui/hero-card";
// Removed useCampaignQueue import
import { useToast } from "@/hooks/use-toast"; // Import toast hook
import { useNavigate } from "react-router-dom"; // Import useNavigate
import { SendCampaignDialog } from "@/components/leads/SendCampaignDialog"; // Import the new dialog component

export default function Leads() {
  const [importDialogOpen, setImportDialogOpen] = useState(false);
  const [addLeadDialogOpen, setAddLeadDialogOpen] = useState(false); // State for Add Lead dialog
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [selectedLeadIds, setSelectedLeadIds] = useState<string[]>([]); // State for selected lead IDs in the table
  const [sendCampaignDialogOpen, setSendCampaignDialogOpen] = useState(false); // State for Send Campaign dialog
  const [leadsToSend, setLeadsToSend] = useState<Lead[]>([]); // State to hold leads to send

  const {
    leads,
    mutate: mutateLeads, // Get mutate function to refresh leads list
    isLoading
  } = useLeads();

  // Removed useCampaignQueue usage
  const { toast } = useToast();
  const navigate = useNavigate(); // Initialize navigate

  const clientId = leads[0]?.client_id; // Assuming all leads belong to the same client
  const {
    tags
  } = useLeadTags(clientId);

  const handleViewLead = (lead: Lead) => {
    setSelectedLead(lead);
  };

  const handleCloseLead = () => {
    setSelectedLead(null);
  };

  const handleAddToQueue = () => {
    const leadsToQueue = leads.filter(lead => selectedLeadIds.includes(lead.id));
    if (leadsToQueue.length === 0) {
      toast({
        title: "No leads selected",
        description: "Please select leads to add to the queue.",
        variant: "default",
      });
      return;
    }

    setLeadsToSend(leadsToQueue); // Set leads to send
    setSendCampaignDialogOpen(true); // Open the send campaign dialog
    setSelectedLeadIds([]); // Clear selection after adding to queue
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-2"> {/* Added gap */}
        <h1 className="font-warp text-gradient font-medium text-xl text-zinc-100">Leads</h1>
        <div className="flex gap-2"> {/* Wrapper for buttons */}
          {/* Add to Queue Button */}
          <Button
            variant="outline"
            onClick={handleAddToQueue}
            disabled={selectedLeadIds.length === 0}
          >
            <MessageSquarePlus className="mr-2 h-4 w-4" />
            Add to Queue ({selectedLeadIds.length})
          </Button>

          {/* Add New Lead Button and Dialog */}
          <Dialog open={addLeadDialogOpen} onOpenChange={setAddLeadDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <Plus className="mr-2 h-4 w-4" />
                Add New Lead
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Add New Lead</DialogTitle>
                <DialogDescription>
                  Fill in the details below to add a new lead manually.
                </DialogDescription>
              </DialogHeader>
              <AddLeadForm onSuccess={() => {
                setAddLeadDialogOpen(false); // Close dialog on success
                mutateLeads(); // Refresh the leads list
              }} />
            </DialogContent>
          </Dialog>

          {/* Existing Import CSV Button */}
          <Button onClick={() => setImportDialogOpen(true)}>
            <Upload className="mr-2 h-4 w-4" />
            Import CSV
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className={selectedLead ? "md:col-span-2" : "md:col-span-3"}>
          <HeroCard className="overflow-x-auto">
            <LeadsTable
              leads={leads}
              isLoading={isLoading}
              tags={tags}
              onViewLead={handleViewLead}
              selectedLeadIds={selectedLeadIds} // Pass selectedLeadIds
              onSelectLeads={setSelectedLeadIds} // Pass setSelectedLeadIds
            />
          </HeroCard>
        </div>

        {selectedLead && (
          <div className="md:col-span-1">
            <LeadDetails
              lead={selectedLead}
              tags={tags}
              onClose={handleCloseLead}
            />
          </div>
        )}
      </div>

      {/* Removed clientId prop */}
      <CSVImportDialog open={importDialogOpen} onOpenChange={setImportDialogOpen} />

      {/* Send Campaign Dialog */}
      <SendCampaignDialog 
        open={sendCampaignDialogOpen} 
        onOpenChange={setSendCampaignDialogOpen} 
        leadsToSend={leadsToSend} 
      />
    </div>
  );
}
