
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Label } from "@/components/ui/label";
import Papa from 'papaparse';
import { useLeadActions } from "@/hooks/useLeadActions";
import { useClientData } from "@/hooks/useClientData"; // Import the new hook

interface CSVImportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  // Removed clientId prop, will fetch internally
}

export function CSVImportDialog({ open, onOpenChange }: CSVImportDialogProps) {
  const { clientId, isLoading: isClientLoading, isError: isClientError } = useClientData(); // Use the hook
  const [file, setFile] = useState<File | null>(null);
  const [mapping, setMapping] = useState<Record<string, string>>({});
  const [headers, setHeaders] = useState<string[]>([]);
  const { toast } = useToast();
  const { addLead } = useLeadActions();
  const [isImporting, setIsImporting] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;
    
    setFile(selectedFile); // Set the file state immediately

    Papa.parse(selectedFile, {
      header: true,
      preview: 1,
      complete: (results) => {
        setHeaders(results.meta.fields || []);
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
            client_id: clientId, // Use clientId from the hook
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

  // Disable import if client data is loading or failed, or if already importing
  // Disable import if client data is loading or failed, or if already importing, or if required fields are not mapped
  const requiredFields = ['first_name', 'last_name', 'email', 'phone'];
  const isMappingComplete = requiredFields.every(field => mapping[field]);
  const importDisabled = isClientLoading || !clientId || isImporting || !file || !isMappingComplete;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] glass-panel border-white/10 text-white"> {/* Added glass-panel and text-white */}
        <DialogHeader>
          <DialogTitle className="text-gradient">Import Leads from CSV</DialogTitle> {/* Added text-gradient */}
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div>
            <Label className="text-white/80">Upload CSV File</Label> {/* Adjusted text color */}
            <input
              type="file"
              accept=".csv"
              onChange={handleFileChange}
              className="mt-2 block w-full text-sm file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-primary-foreground hover:file:bg-primary/90 premium-input" // Added premium-input
            />
          </div>
          {headers.length > 0 && (
            <div className="space-y-4">
              <h4 className="font-medium text-white/80">Map CSV columns to lead fields</h4> {/* Adjusted text color */}
              {requiredFields.map((field) => ( // Iterate over requiredFields
                <div key={field} className="flex items-center gap-2">
                  <Label className="w-24 text-white/80">{field}</Label> {/* Adjusted text color */}
                  <select
                    className="flex h-9 w-full rounded-md border border-white/10 bg-black/20 px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-white/40 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 text-white premium-input" // Adjusted styles and added premium-input
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
          {isClientError && <p className="text-sm text-red-500 mt-2">Error loading client data. Cannot import leads.</p>}
          {!isClientLoading && !isClientError && !clientId && (
            <p className="text-sm text-yellow-500 mt-2">Client data not found. Please ensure your client profile is set up to import leads.</p>
          )}
           {!isClientLoading && !isClientError && clientId && file && headers.length > 0 && !isMappingComplete && (
            <p className="text-sm text-yellow-500 mt-2">Please complete the mapping of required fields to enable import.</p>
          )}
        </div>
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)} className="premium-input hover:bg-white/5">Cancel</Button> {/* Adjusted Cancel button style */}
          <Button onClick={handleImport} disabled={importDisabled} className="premium-button"> {/* Added premium-button */}
            {isImporting ? "Importing..." : (isClientLoading ? "Loading Client..." : "Import")}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
