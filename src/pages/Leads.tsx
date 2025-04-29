
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";
import { useLeads, Lead } from "@/hooks/useLeads";
import { useLeadTags } from "@/hooks/useLeadTags";
import { CSVImportDialog } from "@/components/leads/CSVImportDialog";
import { LeadDetails } from "@/components/leads/LeadDetails";
import { LeadsTable } from "@/components/leads/LeadsTable";
import { HeroCard } from "@/components/ui/hero-card";

export default function Leads() {
  const [importDialogOpen, setImportDialogOpen] = useState(false);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const {
    leads,
    isLoading
  } = useLeads();
  
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

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="font-warp text-gradient font-medium text-xl text-zinc-100">Leads</h1>
        <Button onClick={() => setImportDialogOpen(true)}>
          <Upload className="mr-2 h-4 w-4" />
          Import CSV
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className={selectedLead ? "md:col-span-2" : "md:col-span-3"}>
          <HeroCard className="overflow-x-auto">
            <LeadsTable 
              leads={leads}
              isLoading={isLoading}
              tags={tags}
              onViewLead={handleViewLead}
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

      <CSVImportDialog open={importDialogOpen} onOpenChange={setImportDialogOpen} clientId={clientId || ''} />
    </div>
  );
}
