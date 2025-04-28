
import React, { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Eye, Edit, Trash2, Upload } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useLeads } from "@/hooks/useLeads";
import { useLeadTags } from "@/hooks/useLeadTags";
import { CSVImportDialog } from "@/components/leads/CSVImportDialog";
import { format } from "date-fns";

export default function Leads() {
  const [importDialogOpen, setImportDialogOpen] = useState(false);
  const { leads, isLoading } = useLeads();
  const clientId = leads[0]?.client_id; // Assuming all leads belong to the same client
  const { tags } = useLeadTags(clientId);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl tracking-[0.12em] font-zag">Leads</h1>
        <Button onClick={() => setImportDialogOpen(true)}>
          <Upload className="mr-2 h-4 w-4" />
          Import CSV
        </Button>
      </div>
      
      <div className="rounded-2xl border shadow-lg bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Contact</TableHead>
              <TableHead>Tags</TableHead>
              <TableHead>Last Contacted</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {leads.map((lead) => (
              <TableRow key={lead.id}>
                <TableCell>
                  <div>
                    <div className="font-medium">
                      {lead.first_name} {lead.last_name}
                    </div>
                    {lead.notes && (
                      <div className="text-sm text-muted-foreground">{lead.notes}</div>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <div>
                    <div className="text-sm">{lead.email}</div>
                    <div className="text-sm text-muted-foreground">{lead.phone}</div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex gap-1 flex-wrap">
                    {(lead.tags as string[])?.map((tagId) => {
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
                </TableCell>
                <TableCell>
                  {lead.last_contacted ? (
                    format(new Date(lead.last_contacted), 'MMM d, yyyy')
                  ) : (
                    <span className="text-muted-foreground">Never</span>
                  )}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button variant="ghost" size="icon">
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon">
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <CSVImportDialog 
        open={importDialogOpen} 
        onOpenChange={setImportDialogOpen}
        clientId={clientId || ''}
      />
    </div>
  );
}
