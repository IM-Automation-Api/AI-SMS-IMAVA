import React, { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Eye, Edit, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { LeadTag } from "@/hooks/useLeadTags";
import { format } from "date-fns";
import { useIsMobile } from '@/hooks/use-mobile';
import { toast } from '@/components/ui/use-toast';
import { Lead } from '@/hooks/useLeads';
import { Checkbox } from "@/components/ui/checkbox";

interface LeadsTableProps {
  leads: Lead[];
  isLoading: boolean;
  tags: LeadTag[];
  onViewLead?: (lead: Lead) => void;
  selectedLeadIds: string[];
  onSelectLeads: (selectedIds: string[]) => void;
}

export function LeadsTable({ leads, isLoading, tags, onViewLead, selectedLeadIds, onSelectLeads }: LeadsTableProps) {
  const isMobile = useIsMobile();

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      onSelectLeads(leads.map(lead => lead.id));
    } else {
      onSelectLeads([]);
    }
  };

  const handleSelectLead = (leadId: string, checked: boolean) => {
    if (checked) {
      onSelectLeads([...selectedLeadIds, leadId]);
    } else {
      onSelectLeads(selectedLeadIds.filter(id => id !== leadId));
    }
  };

  const handleEdit = (lead: Lead) => {
    toast({
      title: "Edit lead",
      description: "Edit lead functionality will be implemented soon.",
    });
  };

  const handleDelete = (lead: Lead) => {
    toast({
      title: "Delete lead",
      description: "Are you sure you want to delete this lead?",
      variant: "destructive",
    });
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-8 h-8 border-t-2 border-b-2 border-purple-500 rounded-full animate-spin"></div>
          <p className="text-sm text-muted-foreground">Loading leads...</p>
        </div>
      </div>
    );
  }

  if (leads.length === 0) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="text-center">
          <p className="text-lg font-medium text-muted-foreground">No leads found</p>
          <p className="text-sm text-muted-foreground">Import leads or add leads manually</p>
        </div>
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[50px]">
            <Checkbox
              checked={selectedLeadIds.length === leads.length && leads.length > 0}
              onCheckedChange={(checked) => handleSelectAll(checked as boolean)}
              disabled={leads.length === 0}
            />
          </TableHead>
          <TableHead className="min-w-[150px]">Name</TableHead>
          <TableHead className="min-w-[150px]">Contact</TableHead>
          {!isMobile && <TableHead className="min-w-[120px]">Tags</TableHead>}
          <TableHead className="min-w-[120px]">Last Contacted</TableHead>
          <TableHead className="text-right min-w-[100px]">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {leads.map(lead => (
          <TableRow key={lead.id}>
            <TableCell>
              <Checkbox
                checked={selectedLeadIds.includes(lead.id)}
                onCheckedChange={(checked) => handleSelectLead(lead.id, checked as boolean)}
              />
            </TableCell>
            <TableCell>
              <div>
                <div className="font-medium">
                  {lead.first_name} {lead.last_name}
                </div>
                {lead.notes && <div className="text-sm text-muted-foreground">{lead.notes}</div>}
              </div>
            </TableCell>
            <TableCell>
              <div>
                <div className="text-sm">{lead.email}</div>
                <div className="text-sm text-muted-foreground">{lead.phone}</div>
              </div>
            </TableCell>
            {!isMobile && (
              <TableCell>
                <div className="flex gap-1 flex-wrap">
                  {(lead.tags as string[])?.map(tagId => {
                    const tag = tags.find(t => t.id === tagId);
                    if (!tag) return null;
                    return (
                      <Badge
                        key={tag.id}
                        style={{
                          backgroundColor: tag.color
                        }}
                        className="text-white"
                      >
                        {tag.name}
                      </Badge>
                    );
                  })}
                </div>
              </TableCell>
            )}
            <TableCell>
              {lead.last_contacted ? format(new Date(lead.last_contacted), 'MMM d, yyyy') :
                <span className="text-muted-foreground">Never</span>}
            </TableCell>
            <TableCell className="text-right">
              <div className="flex justify-end gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onViewLead && onViewLead(lead)}
                >
                  <Eye className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleEdit(lead)}
                >
                  <Edit className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleDelete(lead)}
                >
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
