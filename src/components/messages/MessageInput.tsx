
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Send, Paperclip, Smile } from 'lucide-react';
import { supabase } from "@/integrations/supabase/client";
import { useToast } from '@/components/ui/use-toast';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useLeads } from '@/hooks/useLeads';

export function MessageInput() {
  const [message, setMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [selectedLeadId, setSelectedLeadId] = useState<string>('');
  const { toast } = useToast();
  const { leads } = useLeads(1, 50);

  const handleSendMessage = async () => {
    if (!message.trim() || !selectedLeadId) {
      toast({
        title: "Missing information",
        description: selectedLeadId ? "Please enter a message" : "Please select a recipient",
        variant: "destructive",
      });
      return;
    }
    
    setIsSending(true);
    try {
      const selectedLead = leads.find(lead => lead.id === selectedLeadId);
      if (!selectedLead) throw new Error("Selected lead not found");
      
      const { error: functionError } = await supabase.functions.invoke('send-manual-sms', {
        body: {
          leadId: selectedLeadId,
          message: message.trim(),
          clientId: selectedLead.client_id
        }
      });

      if (functionError) throw functionError;

      setMessage('');
      toast({
        title: "Message sent",
        description: "Your message has been sent successfully.",
      });
    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSending(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="px-6 pb-6 pt-3 glass-effect">
      <div className="mb-4">
        <Select value={selectedLeadId} onValueChange={setSelectedLeadId}>
          <SelectTrigger className="bg-black/20 border-white/10 focus:ring-2 focus:ring-purple-500/30 hover:border-white/20 transition-all">
            <SelectValue placeholder="Select recipient..." />
          </SelectTrigger>
          <SelectContent className="bg-black/80 backdrop-blur-lg border-white/10">
            {leads.map((lead) => (
              <SelectItem key={lead.id} value={lead.id}>
                {lead.first_name} {lead.last_name} ({lead.phone})
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="flex items-end gap-3 relative">
        <div className="relative flex-1">
          <Textarea 
            placeholder="Type a message..." 
            className="min-h-[60px] max-h-[120px] resize-none py-3 pr-14 bg-black/20 border-white/10 focus:ring-2 focus:ring-purple-500/30 focus:border-white/20 rounded-xl text-gray-100 placeholder-gray-400 shadow-lg shadow-purple-900/10"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={!selectedLeadId}
          />
          <div className="absolute right-3 bottom-3 flex gap-1.5">
            <Button variant="ghost" size="icon" className="h-7 w-7 rounded-full opacity-70 hover:opacity-100 hover:scale-110 transition-all duration-300 text-gray-400 hover:text-white hover:bg-white/10">
              <Paperclip className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" className="h-7 w-7 rounded-full opacity-70 hover:opacity-100 hover:scale-110 transition-all duration-300 text-gray-400 hover:text-white hover:bg-white/10">
              <Smile className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <Button 
          size="icon" 
          className="h-[60px] w-[60px] rounded-full hover:scale-110 transition-all duration-300 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 shadow-lg shadow-purple-900/30 hover:shadow-xl hover:shadow-purple-900/40"
          onClick={handleSendMessage}
          disabled={isSending || !message.trim() || !selectedLeadId}
        >
          <Send className="h-5 w-5" />
        </Button>
      </div>
    </div>
  );
}
