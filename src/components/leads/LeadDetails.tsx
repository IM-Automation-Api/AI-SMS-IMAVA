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
import { Mail, Phone, Calendar, X } from 'lucide-react';
import { LeadTag } from '@/hooks/useLeadTags';
import { Lead } from '@/hooks/useLeads';

interface LeadDetailsProps {
  lead: Lead | null;
  tags: LeadTag[];
  onClose: () => void;
}

export function LeadDetails({ lead, tags, onClose }: LeadDetailsProps) {
  if (!lead) return null;
  
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
      </HeroCardContent>
    </HeroCard>
  );
}
