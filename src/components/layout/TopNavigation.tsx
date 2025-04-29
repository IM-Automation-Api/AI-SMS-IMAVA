
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Bell, ChevronDown, Home, LogOut, Menu, Settings } from 'lucide-react';
import { useAuth } from '@/lib/supabase/auth/auth-context';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { useIsMobile } from '@/hooks/use-mobile';
import { Button } from '../ui/button';
interface TopNavigationProps {
  drawerOpen?: boolean;
  setDrawerOpen?: (open: boolean) => void;
}
export function TopNavigation({
  drawerOpen,
  setDrawerOpen
}: TopNavigationProps) {
  const {
    user,
    signOut
  } = useAuth();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const handleSettingsClick = () => {
    navigate('/settings');
  };
  const handleLogout = async () => {
    await signOut();
  };

  // Updated display name logic to show only first name
  const displayName = user?.profile?.full_name 
    ? user.profile.full_name.split(' ')[0]  // Get only first name
    : user?.email?.split('@')[0] || 'Account';
    
  const toggleDrawer = () => {
    if (setDrawerOpen) {
      setDrawerOpen(!drawerOpen);
    }
  };
  return <div className="h-16 px-4">
      <div className="h-full flex items-center justify-between">
        <div className="flex-1 flex items-center gap-3">
          {!isMobile && <Link to="/dashboard" className="text-gray-400 hover:text-white hover:brightness-110 transition-all duration-300">
              <Home className="h-5 w-5" />
            </Link>}
          {isMobile && <Button variant="ghost" size="icon" onClick={toggleDrawer}>
              <Menu className="h-5 w-5" />
              <span className="sr-only">Menu</span>
            </Button>}
        </div>
        
        <div className="flex-1 flex justify-center items-center">
          <h2 className="font-mono tracking-wider bg-gradient-to-r from-indigo-400 via-purple-500 to-indigo-400 text-transparent bg-clip-text drop-shadow-[0_0_5px_rgba(129,140,248,0.5)] font-medium mx-0 px-0 my-0 py-0 text-3xl">IM AVA</h2>
        </div>
        
        <div className="flex-1 flex items-center justify-end space-x-6">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center gap-1.5 rounded-full px-3 py-1.5 bg-gradient-to-br from-[#0a0a0f] via-[#121018] to-[#1b1226] border border-[#4b2a78]/40 shadow-[inset_0_0_0.5px_rgba(255,255,255,0.05),0_4px_30px_rgba(0,0,0,0.4)] backdrop-blur-md hover:shadow-purple-900/20 hover:scale-105 transition-all duration-300">
                <span className="bg-green-500 rounded-full w-1.75 h-1.75" />
                <span className="text-gray-200 text-sm hidden sm:inline">{displayName}</span>
                <ChevronDown className="h-3.5 w-3.5 text-gray-400" />
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
    </div>;
}
