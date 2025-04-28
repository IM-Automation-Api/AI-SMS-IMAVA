
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Label } from "@/components/ui/label";
import Papa from 'papaparse';
import { useLeadActions } from "@/hooks/useLeadActions";

interface CSVImportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  clientId: string;
}

export function CSVImportDialog({ open, onOpenChange, clientId }: CSVImportDialogProps) {
  const [file, setFile] = useState<File | null>(null);
  const [mapping, setMapping] = useState<Record<string, string>>({});
  const [headers, setHeaders] = useState<string[]>([]);
  const { toast } = useToast();
  const { addLead } = useLeadActions();
  const [isImporting, setIsImporting] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    Papa.parse(file, {
      header: true,
      preview: 1,
      complete: (results) => {
        setHeaders(results.meta.fields || []);
        setFile(file);
      }
    });
  };

  const handleImport = async () => {
    if (!file) return;
    setIsImporting(true);

    try {
      Papa.parse(file, {
        header: true,
        complete: async (results) => {
          const leads = results.data.map((row: any) => ({
            first_name: row[mapping['first_name']] || '',
            last_name: row[mapping['last_name']] || '',
            email: row[mapping['email']] || '',
            phone: row[mapping['phone']] || '',
            client_id: clientId,
            tags: [],
            notes: ''
          }));

          // Import leads in batches of 10
          for (let i = 0; i < leads.length; i += 10) {
            const batch = leads.slice(i, i + 10);
            await Promise.all(batch.map(lead => addLead(lead)));
          }

          toast({
            title: "Success",
            description: `Imported ${leads.length} leads successfully`
          });
          onOpenChange(false);
        }
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to import leads",
        variant: "destructive"
      });
    } finally {
      setIsImporting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Import Leads from CSV</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div>
            <Label>Upload CSV File</Label>
            <input
              type="file"
              accept=".csv"
              onChange={handleFileChange}
              className="mt-2 block w-full text-sm file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-primary-foreground hover:file:bg-primary/90"
            />
          </div>
          {headers.length > 0 && (
            <div className="space-y-4">
              <h4 className="font-medium">Map CSV columns to lead fields</h4>
              {['first_name', 'last_name', 'email', 'phone'].map((field) => (
                <div key={field} className="flex items-center gap-2">
                  <Label className="w-24">{field}</Label>
                  <select
                    className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                    value={mapping[field] || ''}
                    onChange={(e) => setMapping(prev => ({ ...prev, [field]: e.target.value }))}
                  >
                    <option value="">Select column</option>
                    {headers.map(header => (
                      <option key={header} value={header}>{header}</option>
                    ))}
                  </select>
                </div>
              ))}
            </div>
          )}
        </div>
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={handleImport} disabled={!file || isImporting}>
            {isImporting ? "Importing..." : "Import"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
