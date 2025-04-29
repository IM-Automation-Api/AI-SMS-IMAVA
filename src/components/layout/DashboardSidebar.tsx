
import { LayoutDashboard, Brain, MessageSquare, ClipboardList, Wrench, Phone, Settings, MessageSquarePlus } from 'lucide-react';
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
    icon: MessageSquarePlus,
    label: 'SMS Campaign',
    path: '/campaigns'
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
    <Sidebar className="font-warp glass-effect my-4 ml-4 rounded-2xl shadow-lg">
      <SidebarHeader className="p-8">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 flex items-center justify-center rounded-full bg-gradient-to-br from-purple-500/30 to-purple-700/50 shadow-lg shadow-purple-900/30">
            <div className="text-3xl font-bold text-white">IA</div>
          </div>
          <h2 className="text-[36px] font-warp tracking-[0.12em] text-white whitespace-nowrap logo-text">IM AVA</h2>
        </div>
      </SidebarHeader>
      <SidebarContent className="px-4">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-2">
              {menuItems.map(item => (
                <SidebarMenuItem key={item.path}>
                  <SidebarMenuButton 
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg text-gray-400 transition-all duration-300 hover:bg-white/10 hover:shadow-md hover:shadow-purple-500/20 hover:text-white hover:translate-x-1 ${
                      location.pathname === item.path 
                        ? 'bg-gradient-to-br from-purple-500/20 to-indigo-500/10 text-white shadow-lg shadow-purple-900/20 border-l-2 border-purple-500' 
                        : ''
                    }`} 
                    asChild
                  >
                    <Link to={item.path}>
                      <item.icon className="w-5 h-5" />
                      <span className="font-medium">{item.label}</span>
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
