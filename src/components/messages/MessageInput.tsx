
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Send, Paperclip, Smile } from 'lucide-react';
import { supabase } from "@/integrations/supabase/client";
import { useToast } from '@/components/ui/use-toast';

export function MessageInput() {
  const [message, setMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const { toast } = useToast();

  const handleSendMessage = async () => {
    if (!message.trim()) return;
    
    setIsSending(true);
    try {
      const { error: functionError, data } = await supabase.functions.invoke('send-manual-sms', {
        body: {
          leadId: '123', // TODO: Get actual lead ID from context
          message: message.trim(),
          userId: '456' // TODO: Get actual user ID from auth context
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
    <div className="border-t border-white/10 p-6 bg-black/20 backdrop-blur-md">
      <div className="flex items-end gap-3">
        <div className="relative flex-1">
          <Textarea 
            placeholder="Type a message..." 
            className="min-h-[60px] max-h-[120px] resize-none py-3 pr-12 bg-black/20 border-white/10 focus:ring focus:ring-indigo-500/30 focus:outline-none rounded-xl text-gray-100 placeholder-gray-400 shadow-lg shadow-purple-900/10"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <div className="absolute right-3 bottom-3 flex gap-1.5">
            <Button variant="ghost" size="icon" className="h-7 w-7 rounded-full opacity-70 hover:opacity-100 hover:scale-105 transition-all duration-300 text-gray-400 hover:text-white">
              <Paperclip className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" className="h-7 w-7 rounded-full opacity-70 hover:opacity-100 hover:scale-105 transition-all duration-300 text-gray-400 hover:text-white">
              <Smile className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <Button 
          size="icon" 
          className="h-[60px] rounded-full hover:scale-105 transition-all duration-300 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 shadow-lg shadow-purple-900/30"
          onClick={handleSendMessage}
          disabled={isSending || !message.trim()}
        >
          <Send className="h-5 w-5" />
        </Button>
      </div>
    </div>
  );
}
