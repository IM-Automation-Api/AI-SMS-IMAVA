
import React from 'react';
import { Link } from 'react-router-dom';
import { Bell, ChevronDown, Home } from 'lucide-react';

export function TopNavigation() {
  return (
    <div className="h-16 px-4 backdrop-blur-md">
      <div className="h-full flex items-center justify-end space-x-6">
        <Link 
          to="/dashboard" 
          className="text-gray-400 hover:text-white hover:brightness-110 transition-all duration-300"
        >
          <Home className="h-5 w-5" />
        </Link>
        <button className="flex items-center text-gray-400 hover:text-white hover:brightness-110 transition-all duration-300">
          <span className="bg-primary/30 text-primary rounded-full w-2 h-2 mr-2" />
          Online
          <ChevronDown className="ml-2 h-4 w-4" />
        </button>
        <button className="text-gray-400 hover:text-white hover:brightness-110 transition-all duration-300">
          <Bell className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
}
