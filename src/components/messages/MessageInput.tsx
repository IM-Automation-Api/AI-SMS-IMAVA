
import React from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Send, Paperclip, Smile } from 'lucide-react';

export function MessageInput() {
  return (
    <div className="border-t border-border p-6 bg-card/30 backdrop-blur-sm">
      <div className="flex items-end gap-3">
        <div className="relative flex-1">
          <Textarea 
            placeholder="Type a message..." 
            className="min-h-[60px] max-h-[120px] resize-none py-3 pr-12 bg-background/50 border-white/10 focus:border-primary/50 rounded-2xl shadow-soft"
          />
          <div className="absolute right-3 bottom-3 flex gap-1.5">
            <Button variant="ghost" size="icon" className="h-7 w-7 rounded-full opacity-70 hover:opacity-100 button-hover">
              <Paperclip className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" className="h-7 w-7 rounded-full opacity-70 hover:opacity-100 button-hover">
              <Smile className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <Button size="icon" className="h-[60px] rounded-full button-hover bg-gradient-to-r from-primary to-primary/80">
          <Send className="h-5 w-5" />
        </Button>
      </div>
    </div>
  );
}
