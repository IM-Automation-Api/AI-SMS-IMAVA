
import React, { useState } from 'react';
import { LayoutDashboard, Brain, MessageSquare, Settings, HelpCircle, ChevronLeft, ChevronRight, MessageSquarePlus, ClipboardList, Wrench } from 'lucide-react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useSidebar } from '@/components/ui/sidebar';
import { cn } from '@/lib/utils';
export function DashboardSidebar() {
  const {
    state,
    toggleSidebar
  } = useSidebar();
  const expanded = state === "expanded";
  const [activeItem, setActiveItem] = useState<string>("dashboard");
  const navigate = useNavigate();
  const handleItemClick = (item: string, route: string) => {
    setActiveItem(item);
    navigate(route);
  };
  return <aside className={cn("sidebar-gradient h-screen flex flex-col transition-all duration-300 ease-in-out relative z-20", expanded ? "w-60" : "w-20")}>
      <div className="flex items-center justify-between p-4 pb-8">
        <div className="bg-transparent rounded-full py-0 mx-[60px] px-0 my-[23px]">
          
        </div>
        
        <button onClick={toggleSidebar} className="text-gray-400 hover:text-white transition-colors">
          {expanded ? <ChevronLeft className="h-5 w-5" /> : <ChevronRight className="h-5 w-5" />}
        </button>
      </div>

      <nav className="flex-grow px-4 flex flex-col space-y-1">
        <NavLink to="/dashboard" className={({
        isActive
      }) => cn("sidebar-item-base", "sidebar-item-hover", isActive && "sidebar-item-active")}>
          <LayoutDashboard className="h-5 w-5" />
          {expanded && <span>Dashboard</span>}
        </NavLink>

        <NavLink to="/assistants" className={({
        isActive
      }) => cn("sidebar-item-base", "sidebar-item-hover", isActive && "sidebar-item-active")}>
          <Brain className="h-5 w-5" />
          {expanded && <span>Assistants</span>}
        </NavLink>

        <NavLink to="/messages" className={({
        isActive
      }) => cn("sidebar-item-base", "sidebar-item-hover", isActive && "sidebar-item-active")}>
          <MessageSquare className="h-5 w-5" />
          {expanded && <span>Messages</span>}
        </NavLink>

        <NavLink to="/campaigns" className={({
        isActive
      }) => cn("sidebar-item-base", "sidebar-item-hover", isActive && "sidebar-item-active")}>
          <MessageSquarePlus className="h-5 w-5" />
          {expanded && <span>SMS Campaign</span>}
        </NavLink>

        <NavLink to="/leads" className={({
        isActive
      }) => cn("sidebar-item-base", "sidebar-item-hover", isActive && "sidebar-item-active")}>
          <ClipboardList className="h-5 w-5" />
          {expanded && <span>Leads</span>}
        </NavLink>

        <NavLink to="/agent-builder" className={({
        isActive
      }) => cn("sidebar-item-base", "sidebar-item-hover", isActive && "sidebar-item-active")}>
          <Wrench className="h-5 w-5" />
          {expanded && <span>Agent Builder</span>}
        </NavLink>
      </nav>

      <div className="mt-auto p-4">
        <NavLink to="/settings" className={({
        isActive
      }) => cn("sidebar-item-base", "sidebar-item-hover", isActive && "sidebar-item-active")}>
          <Settings className="h-5 w-5" />
          {expanded && <span>Settings</span>}
        </NavLink>
        
        <div className="sidebar-item-base sidebar-item-hover">
          <HelpCircle className="h-5 w-5" />
          {expanded && <span>Help</span>}
        </div>
      </div>
    </aside>;
}
