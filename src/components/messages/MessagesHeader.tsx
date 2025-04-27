
import React from 'react';
import { Button } from '@/components/ui/button';
import { BellDot, MoreHorizontal, Download } from 'lucide-react';
import { Avatar } from '@/components/ui/avatar';

export function MessagesHeader() {
  return (
    <div className="border-b border-border py-4 px-6 flex items-center justify-between bg-card/50 backdrop-blur-sm">
      <div className="flex items-center gap-3">
        <Avatar className="h-8 w-8 bg-primary text-primary-foreground">
          <span>JS</span>
        </Avatar>
        <div>
          <h3 className="font-semibold text-foreground">John Smith</h3>
          <span className="text-xs text-muted-foreground">Online</span>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" className="rounded-full">
          <BellDot className="h-5 w-5" />
        </Button>
        <Button variant="ghost" size="icon" className="rounded-full">
          <MoreHorizontal className="h-5 w-5" />
        </Button>
        <Button variant="ghost" size="icon" className="rounded-full">
          <Download className="h-5 w-5" />
        </Button>
      </div>
    </div>
  );
}
