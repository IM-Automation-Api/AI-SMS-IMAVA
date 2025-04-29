
import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  Users, 
  BarChart, 
  Settings, 
  HelpCircle, 
  ChevronLeft, 
  ChevronRight,
  Plus,
  MessagesSquare,
  KanbanSquare,
  File,
  Calendar
} from 'lucide-react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useSidebar } from '@/components/ui/sidebar';
import { cn } from '@/lib/utils';

export function DashboardSidebar() {
  const { state, toggleSidebar } = useSidebar();
  const expanded = state === "expanded";
  const [activeItem, setActiveItem] = useState<string>("dashboard");
  const navigate = useNavigate();
  
  const handleItemClick = (item: string, route: string) => {
    setActiveItem(item);
    navigate(route);
  };
  
  return (
    <aside className={cn(
      "sidebar-gradient h-screen flex flex-col transition-all duration-300 ease-in-out relative z-20",
      expanded ? "w-60" : "w-20"
    )}>
      <div className="flex items-center justify-between p-4 pb-8">
        <div className="w-16 h-16 flex items-center justify-center rounded-full bg-gradient-to-br from-purple-500/30 to-purple-700/50 shadow-lg shadow-purple-900/30">
          <img 
            src="/lovable-uploads/aa250a01-2f1b-4e50-a1c8-f4cd432b282a.png" 
            alt="Company Logo" 
            className="h-12 w-auto"
          />
        </div>
        
        <button 
          onClick={toggleSidebar}
          className="text-gray-400 hover:text-white transition-colors"
        >
          {expanded ? <ChevronLeft className="h-5 w-5" /> : <ChevronRight className="h-5 w-5" />}
        </button>
      </div>

      <nav className="flex-grow px-4 flex flex-col space-y-1">
        <NavLink
          to="/dashboard"
          className={({ isActive }) =>
            cn(
              "sidebar-item-base",
              "sidebar-item-hover",
              isActive && "sidebar-item-active"
            )
          }
        >
          <LayoutDashboard className="h-5 w-5" />
          {expanded && <span>Dashboard</span>}
        </NavLink>

        <NavLink
          to="/users"
          className={({ isActive }) =>
            cn(
              "sidebar-item-base",
              "sidebar-item-hover",
              isActive && "sidebar-item-active"
            )
          }
        >
          <Users className="h-5 w-5" />
          {expanded && <span>Users</span>}
        </NavLink>

        <NavLink
          to="/analytics"
          className={({ isActive }) =>
            cn(
              "sidebar-item-base",
              "sidebar-item-hover",
              isActive && "sidebar-item-active"
            )
          }
        >
          <BarChart className="h-5 w-5" />
          {expanded && <span>Analytics</span>}
        </NavLink>

        <NavLink
          to="/projects"
          className={({ isActive }) =>
            cn(
              "sidebar-item-base",
              "sidebar-item-hover",
              isActive && "sidebar-item-active"
            )
          }
        >
          <KanbanSquare className="h-5 w-5" />
          {expanded && <span>Projects</span>}
        </NavLink>

        <NavLink
          to="/documents"
          className={({ isActive }) =>
            cn(
              "sidebar-item-base",
              "sidebar-item-hover",
              isActive && "sidebar-item-active"
            )
          }
        >
          <File className="h-5 w-5" />
          {expanded && <span>Documents</span>}
        </NavLink>

        <NavLink
          to="/calendar"
          className={({ isActive }) =>
            cn(
              "sidebar-item-base",
              "sidebar-item-hover",
              isActive && "sidebar-item-active"
            )
          }
        >
          <Calendar className="h-5 w-5" />
          {expanded && <span>Calendar</span>}
        </NavLink>

        <NavLink
          to="/messages"
          className={({ isActive }) =>
            cn(
              "sidebar-item-base",
              "sidebar-item-hover",
              isActive && "sidebar-item-active"
            )
          }
        >
          <MessagesSquare className="h-5 w-5" />
          {expanded && <span>Messages</span>}
        </NavLink>
      </nav>

      <div className="mt-auto p-4">
        <Link to="/new" className="sidebar-item-base sidebar-item-hover">
          <Plus className="h-5 w-5" />
          {expanded && <span>New Task</span>}
        </Link>
        
        <Link to="/settings" className="sidebar-item-base sidebar-item-hover">
          <Settings className="h-5 w-5" />
          {expanded && <span>Settings</span>}
        </Link>
        
        <Link to="/help" className="sidebar-item-base sidebar-item-hover">
          <HelpCircle className="h-5 w-5" />
          {expanded && <span>Help</span>}
        </Link>
      </div>
    </aside>
  );
}
