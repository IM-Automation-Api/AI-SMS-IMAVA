
import React from 'react';
import { Menu } from 'lucide-react';
import { SidebarProvider } from '@/components/ui/sidebar';
import { DashboardSidebar } from './DashboardSidebar';
import { useIsMobile } from '@/hooks/use-mobile';
import { Button } from '../ui/button';
import { BeamsBackground } from '../ui/beams-background';
import { TopNavigation } from './TopNavigation';
import { 
  Drawer,
  DrawerTrigger,
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
  
  return (
    <BeamsBackground intensity="subtle">
      <SidebarProvider>
        <div className="min-h-screen flex w-full">
          {!isMobile && <DashboardSidebar />}
          <main className="flex-1 overflow-auto bg-gradient-to-br from-background to-background/95 rounded-md px-0">
            <TopNavigation />
            {isMobile && (
              <div className="sticky top-0 z-10 px-4 py-3 bg-background/80 backdrop-blur-md border-b">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bold">Im Ava</h2>
                  <Drawer>
                    <DrawerTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <Menu />
                        <span className="sr-only">Menu</span>
                      </Button>
                    </DrawerTrigger>
                    <DrawerContent>
                      <MobileNavigation />
                    </DrawerContent>
                  </Drawer>
                </div>
              </div>
            )}
            <div className="container mx-auto p-6 fade-in">
              {children}
            </div>
          </main>
        </div>
      </SidebarProvider>
    </BeamsBackground>
  );
}
