
import { LayoutDashboard, Brain, MessageSquare, ClipboardList, Wrench, Phone, Settings } from 'lucide-react';

export const menuItems = [
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
