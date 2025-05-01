import React from 'react';
import { format } from "date-fns";
import { Badge } from '@/components/ui/badge';
import { 
  HeroCard, 
  HeroCardHeader, 
  HeroCardTitle, 
  HeroCardContent 
} from '@/components/ui/hero-card';
import { Button } from '@/components/ui/button';
import { Mail, Phone, Calendar, X, MessageSquarePlus, Send } from 'lucide-react'; // Added icons
import { LeadTag } from '@/hooks/useLeadTags';
import { Lead } from '@/hooks/useLeads';
import { useSMSQueue } from '@/hooks/useSMSQueue'; // Added SMS Queue hook
import { toast } from '@/components/ui/use-toast'; // Added toast
import { useNavigate } from 'react-router-dom'; // Added useNavigate

interface LeadDetailsProps {
  lead: Lead | null;
  tags: LeadTag[];
  onClose: () => void;
} // Added missing closing brace

export function LeadDetails({ lead, tags, onClose }: LeadDetailsProps) {
  const navigate = useNavigate();
  // Removed useSMSQueue hook as we navigate instead

  if (!lead) return null;

  // Updated function to navigate to SMS Queue page
  const handleAddToQueue = () => {
    if (!lead) return;
    navigate('/sms-queue', { state: { selectedLead: lead } }); // Pass lead info
    toast({
      title: 'Navigate',
      description: `Navigating to SMS Queue page. Select an assistant to send SMS to ${lead.first_name}.`,
    });
    onClose(); // Optionally close details pane after navigating
  };

  const handleAddToCampaign = () => {
    if (!lead) return;
    // Navigate to campaign page, potentially passing lead info later
    navigate('/sms-campaign', { state: { selectedLeadId: lead.id } });
     toast({
        title: 'Navigate',
        description: `Navigating to SMS Campaign page. Select a campaign to add ${lead.first_name}.`,
      });
     onClose(); // Optionally close details pane after navigating
  };

  return (
    <HeroCard className="relative">
      <Button 
        variant="ghost" 
        size="icon" 
        className="absolute top-4 right-4" 
        onClick={onClose}
      >
        <X className="h-4 w-4" />
      </Button>
      
      <HeroCardHeader>
        <HeroCardTitle>
          {lead.first_name} {lead.last_name}
        </HeroCardTitle>
      </HeroCardHeader>
      
      <HeroCardContent className="space-y-6">
        <div className="space-y-3">
          <h3 className="text-sm font-medium text-gray-400">Contact Information</h3>
          
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-indigo-400" />
              <p className="text-sm">{lead.email || "No email provided"}</p>
            </div>
            
            <div className="flex items-center gap-2">
              <Phone className="h-4 w-4 text-indigo-400" />
              <p className="text-sm">{lead.phone}</p>
            </div>
            
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-indigo-400" />
              <p className="text-sm">
                {lead.last_contacted 
                  ? `Last contacted on ${format(new Date(lead.last_contacted), 'MMMM d, yyyy')}`
                  : "Never contacted"}
              </p>
            </div>
          </div>
        </div>
        
        {lead.notes && (
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-gray-400">Notes</h3>
            <p className="text-sm p-3 bg-white/5 rounded-md">{lead.notes}</p>
          </div>
        )}
        
        <div className="space-y-2">
          <h3 className="text-sm font-medium text-gray-400">Tags</h3>
          {lead.tags && lead.tags.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {lead.tags.map(tagId => {
                const tag = tags.find(t => t.id === tagId);
                if (!tag) return null;
                return (
                  <Badge 
                    key={tag.id} 
                    style={{ backgroundColor: tag.color }} 
                    className="text-white"
                  >
                    {tag.name}
                  </Badge>
                );
              })}
            </div>
          ) : (
            <p className="text-sm text-gray-500">No tags</p>
          )}
        </div>

        {/* Action Buttons */}
        <div className="border-t border-white/10 pt-4 mt-4 space-y-3">
           <h3 className="text-sm font-medium text-gray-400">Actions</h3>
         <div className="flex flex-col sm:flex-row gap-2">
           {/* Updated Button Text and removed disabled state */}
           <Button
             onClick={handleAddToQueue}
             className="flex-1"
             variant="outline"
           >
             <MessageSquarePlus className="mr-2 h-4 w-4" />
             Add to SMS Queue
           </Button>
           <Button
             onClick={handleAddToCampaign}
               className="flex-1"
               variant="outline"
              >
               <Send className="mr-2 h-4 w-4" />
               Add to SMS Campaign
             </Button>
           </div>
        </div>
      </HeroCardContent>
    </HeroCard>
  );
}
