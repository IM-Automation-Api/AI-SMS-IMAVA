
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
        <button className="flex items-center gap-2 rounded-full px-4 py-2 bg-gradient-to-br from-[#2A2A45] to-[#1A1A1A] border border-white/5 shadow-lg hover:shadow-purple-900/20 hover:scale-105 transition-all duration-300">
          <span className="bg-green-500 rounded-full w-2 h-2" />
          <span className="text-gray-200">Online</span>
          <ChevronDown className="h-4 w-4 text-gray-400" />
        </button>
        <button className="text-gray-400 hover:text-white hover:brightness-110 transition-all duration-300">
          <Bell className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
}
