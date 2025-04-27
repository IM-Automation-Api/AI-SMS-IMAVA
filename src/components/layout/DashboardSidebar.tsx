
import { LayoutDashboard, Users, MessageSquare, Settings, Phone, FileText, UserSquare } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';

const menuItems = [
  {
    icon: LayoutDashboard,
    label: 'Dashboard',
    path: '/dashboard'
  }, 
  {
    icon: Users,
    label: 'Assistants',
    path: '/assistants'
  }, 
  {
    icon: MessageSquare,
    label: 'Messages',
    path: '/messages'
  }, 
  {
    icon: UserSquare,
    label: 'Leads',
    path: '/leads'
  }, 
  {
    icon: FileText,
    label: 'Agent Builder',
    path: '/agent-builder'
  }, 
  {
    icon: Phone,
    label: 'Phone Numbers',
    path: '/phone-numbers'
  }, 
  {
    icon: Settings,
    label: 'Settings',
    path: '/settings'
  }
];

export function DashboardSidebar() {
  const location = useLocation();
  
  return (
    <Sidebar className="font-inter sidebar-gradient">
      <SidebarHeader className="p-6">
        <h2 className="text-lg font-medium text-gradient bg-gradient-to-r from-white to-white/80 bg-clip-text">AI SMS Platform</h2>
      </SidebarHeader>
      <SidebarContent className="mx-0 px-[16px]">
        <SidebarGroup>
          <SidebarGroupLabel className="text-xs text-white/60 font-medium">Menu</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map(item => (
                <SidebarMenuItem key={item.path}>
                  <SidebarMenuButton 
                    className={`sidebar-item-base sidebar-item-hover ${location.pathname === item.path ? 'sidebar-item-active' : ''}`} 
                    asChild
                  >
                    <Link to={item.path}>
                      <item.icon className="w-4 h-4" />
                      <span>{item.label}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
