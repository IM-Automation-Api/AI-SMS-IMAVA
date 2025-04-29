
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Bell, ChevronDown, Home, LogOut, Settings } from 'lucide-react';
import { useAuth } from '@/lib/supabase/auth/auth-context';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';

export function TopNavigation() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  
  const handleSettingsClick = () => {
    navigate('/settings');
  };
  
  const handleLogout = async () => {
    await signOut();
  };

  // Display name logic - use profile name, email, or fallback
  const displayName = user?.profile?.full_name || 
                      user?.email?.split('@')[0] || 
                      'Account';

  return (
    <div className="h-16 px-4 backdrop-blur-md">
      <div className="h-full flex items-center justify-between">
        <div className="flex items-center gap-2">
          <img 
            src="/lovable-uploads/5ea85af7-0a44-4b29-bc40-6d45118c8482.png" 
            alt="Company Logo" 
            className="h-8 w-auto"
          />
          <span className="font-warp text-xl">Im Ava</span>
        </div>
        
        <div className="flex items-center justify-end space-x-6">
          <Link 
            to="/dashboard" 
            className="text-gray-400 hover:text-white hover:brightness-110 transition-all duration-300"
          >
            <Home className="h-5 w-5" />
          </Link>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center gap-2 rounded-full px-4 py-2 bg-gradient-to-br from-[#2A2A45] to-[#1A1A1A] border border-white/5 shadow-lg hover:shadow-purple-900/20 hover:scale-105 transition-all duration-300">
                <span className="bg-green-500 rounded-full w-2 h-2" />
                <span className="text-gray-200">{displayName}</span>
                <ChevronDown className="h-4 w-4 text-gray-400" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="bg-[#1B1B33]/95 backdrop-blur-md border border-white/10 text-gray-200 shadow-lg">
              <DropdownMenuItem onClick={handleSettingsClick} className="hover:bg-white/10 cursor-pointer">
                <Settings className="h-4 w-4 mr-2" />
                <span>Account Settings</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator className="bg-white/10" />
              <DropdownMenuItem onClick={handleLogout} className="hover:bg-white/10 cursor-pointer">
                <LogOut className="h-4 w-4 mr-2" />
                <span>Logout</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          
          <button className="text-gray-400 hover:text-white hover:brightness-110 transition-all duration-300">
            <Bell className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
