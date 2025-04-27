
import React from 'react';
import { SidebarProvider } from '@/components/ui/sidebar';
import { DashboardSidebar } from './DashboardSidebar';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export function DashboardLayout({
  children
}: DashboardLayoutProps) {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <DashboardSidebar />
        <main className="flex-1 overflow-auto bg-gradient-to-br from-background to-background/95 rounded-md px-0">
          <div className="container mx-auto p-6 fade-in">
            {children}
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}
