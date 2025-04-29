
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
        <div className="min-h-screen h-screen flex w-full overflow-hidden">
          {!isMobile && <DashboardSidebar />}
          <main className="flex-1 overflow-auto backdrop-blur-md bg-gradient-to-br from-[#1B1B33]/80 to-[#0F0F0F]/90 rounded-2xl mx-4 my-4 shadow-lg">
            <TopNavigation />
            {isMobile && (
              <div className="sticky top-0 z-10 px-4 py-3 bg-transparent backdrop-blur-md border-b border-white/5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <img 
                      src="/lovable-uploads/aa250a01-2f1b-4e50-a1c8-f4cd432b282a.png" 
                      alt="Company Logo" 
                      className="h-10 w-auto"
                    />
                    <h2 className="text-xl font-mono tracking-normal">IM AVA</h2>
                  </div>
                  <Drawer>
                    <DrawerTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <Menu />
                        <span className="sr-only">Menu</span>
                      </Button>
                    </DrawerTrigger>
                    <DrawerContent className="glass-effect">
                      <MobileNavigation />
                    </DrawerContent>
                  </Drawer>
                </div>
              </div>
            )}
            <div className="container mx-auto p-6 fade-in text-gray-100">
              {children}
            </div>
          </main>
        </div>
      </SidebarProvider>
    </BeamsBackground>
  );
}
