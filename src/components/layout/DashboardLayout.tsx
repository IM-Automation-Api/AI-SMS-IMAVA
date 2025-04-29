
import React, { useState } from 'react';
import { SidebarProvider } from '@/components/ui/sidebar';
import { DashboardSidebar } from './DashboardSidebar';
import { useIsMobile } from '@/hooks/use-mobile';
import { BeamsBackground } from '../ui/beams-background';
import { TopNavigation } from './TopNavigation';
import { 
  Drawer,
  DrawerContent
} from '@/components/ui/drawer';
import { MobileNavigation } from './MobileNavigation';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export function DashboardLayout({
  children
}: DashboardLayoutProps) {
  const isMobile = useIsMobile();
  const [drawerOpen, setDrawerOpen] = useState(false);
  
  const handleCloseDrawer = () => {
    setDrawerOpen(false);
  };
  
  return (
    <BeamsBackground intensity="subtle">
      <SidebarProvider>
        <div className="min-h-screen h-screen flex w-full overflow-hidden">
          {!isMobile && <DashboardSidebar />}
          <main className="flex-1 overflow-auto backdrop-blur-md bg-gradient-to-br from-[#1B1B33]/80 to-[#0F0F0F]/90 rounded-2xl mx-4 my-4 shadow-lg">
            <TopNavigation drawerOpen={drawerOpen} setDrawerOpen={setDrawerOpen} />
            <Drawer open={drawerOpen} onOpenChange={setDrawerOpen}>
              <DrawerContent className="glass-effect">
                <MobileNavigation onNavigate={handleCloseDrawer} />
              </DrawerContent>
            </Drawer>
            <div className="container mx-auto p-6 fade-in text-gray-100">
              {children}
            </div>
          </main>
        </div>
      </SidebarProvider>
    </BeamsBackground>
  );
}
