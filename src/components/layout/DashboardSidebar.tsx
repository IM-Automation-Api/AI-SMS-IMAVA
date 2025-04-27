
import { LayoutDashboard, Brain, MessageSquare, ClipboardList, Wrench, Phone, Settings } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import Spline from '@splinetool/react-spline';
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
    <Sidebar className="font-inter sidebar-gradient">
      <SidebarHeader className="p-6">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 relative" style={{ background: 'transparent' }}>
            <Spline 
              scene="https://prod.spline.design/020y-uiAuUWrrEpj/scene.splinecode"
              style={{ width: '100%', height: '100%', background: 'transparent' }}
            />
          </div>
          <h2 className="text-2xl font-bold text-white">Im Ava</h2>
        </div>
      </SidebarHeader>
      <SidebarContent className="px-4">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-4"> {/* Added space-y-4 to increase vertical spacing */}
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
