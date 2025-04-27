
import React from 'react';
import { Link } from 'react-router-dom';
import { Bell, ChevronDown, Check, Ban, MessageSquare } from 'lucide-react';
import { cn } from "@/lib/utils";

export function TopNavigation() {
  return (
    <div className="border-b border-border">
      <div className="flex h-16 items-center px-4 bg-card/50 backdrop-blur-sm">
        <nav className="flex items-center space-x-4 lg:space-x-6 mx-6">
          <Link to="/messages" className="text-sm font-medium transition-colors hover:text-primary">
            Messages
          </Link>
          <Link to="/assistants" className="text-sm font-medium transition-colors hover:text-primary">
            Assistants
          </Link>
          <Link to="/agent-builder" className="text-sm font-medium transition-colors hover:text-primary">
            Agent Builder
          </Link>
          <Link to="/settings" className="text-sm font-medium transition-colors hover:text-primary">
            Settings
          </Link>
        </nav>
        <div className="ml-auto flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <button className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2">
              <span className="bg-primary/10 text-primary rounded-full w-2 h-2 mr-2" />
              Online
              <ChevronDown className="ml-2 h-4 w-4" />
            </button>
            <button className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input hover:bg-accent hover:text-accent-foreground h-10 w-10">
              <Bell className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
      <div className="border-t border-border/50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="px-8 flex h-10 items-center gap-4">
          <div className="flex items-center gap-2 text-sm">
            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10">
              <Check className="h-4 w-4 text-primary" />
            </div>
            <div className="text-muted-foreground">10 agents active</div>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10">
              <Ban className="h-4 w-4 text-primary" />
            </div>
            <div className="text-muted-foreground">2 agents inactive</div>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10">
              <MessageSquare className="h-4 w-4 text-primary" />
            </div>
            <div className="text-muted-foreground">1,234 messages today</div>
          </div>
        </div>
      </div>
    </div>
  );
}
