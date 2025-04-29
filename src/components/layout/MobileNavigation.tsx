
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Brain, MessageSquare, ClipboardList, Wrench, Phone, Settings, MessageSquarePlus } from 'lucide-react';

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

export function MobileNavigation() {
  const location = useLocation();
  
  return (
    <div className="p-4">
      <h2 className="text-lg font-semibold mb-4 font-mono">Navigation</h2>
      <nav>
        <ul className="space-y-2">
          {menuItems.map((item) => (
            <li key={item.path}>
              <Link 
                to={item.path}
                className={`flex items-center gap-3 p-3 rounded-md transition-colors ${
                  location.pathname === item.path
                    ? 'bg-primary/10 text-primary font-medium'
                    : 'hover:bg-secondary/20'
                }`}
              >
                <item.icon className="h-5 w-5" />
                <span>{item.label}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}
