
import { LayoutDashboard, Brain, MessageSquare, ClipboardList, Wrench, Phone, Settings } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';

const menuItems = [
  {
    icon: LayoutDashboard,
    label: 'Dashboard',
    path: '/dashboard'
  },
  {
    icon: Brain,
    label: 'Assistants',
    path: '/assistants'
  },
  {
    icon: MessageSquare,
    label: 'Messages',
    path: '/messages'
  },
  {
    icon: ClipboardList,
    label: 'Leads',
    path: '/leads'
  },
  {
    icon: Wrench,
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
    <Sidebar className="font-inter bg-black/10 backdrop-blur-md border-r border-white/10">
      <SidebarHeader className="p-8">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 flex items-center justify-center rounded-full bg-gradient-to-br from-purple-500/30 to-purple-700/50 shadow-lg shadow-purple-900/30">
            <div className="text-3xl font-bold text-white">IA</div>
          </div>
          <h2 className="text-[36px] font-zag tracking-[0.12em] text-white whitespace-nowrap">IM AVA</h2>
        </div>
      </SidebarHeader>
      <SidebarContent className="px-4">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-2">
              {menuItems.map(item => (
                <SidebarMenuItem key={item.path}>
                  <SidebarMenuButton 
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg text-gray-400 hover:text-white hover:bg-gradient-to-br from-[#1B1B33] to-[#0F0F0F] hover:shadow-lg hover:shadow-purple-900/20 hover:scale-105 transition-all duration-300 ${
                      location.pathname === item.path 
                        ? 'bg-gradient-to-br from-[#2A2A45] to-[#1A1A1A] text-gray-100 shadow-lg shadow-purple-900/20' 
                        : ''
                    }`} 
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
