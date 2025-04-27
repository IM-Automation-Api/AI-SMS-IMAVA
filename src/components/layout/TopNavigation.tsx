
import React from 'react';
import { Link } from 'react-router-dom';
import { Bell, ChevronDown, Home } from 'lucide-react';

export function TopNavigation() {
  return (
    <div className="h-16 px-4 bg-card/50 backdrop-blur-sm">
      <div className="h-full flex items-center justify-end space-x-4">
        <Link 
          to="/dashboard" 
          className="text-sm font-medium transition-colors hover:text-primary"
        >
          <Home className="h-5 w-5" />
        </Link>
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
  );
}
