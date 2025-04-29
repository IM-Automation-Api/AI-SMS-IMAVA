
import React from 'react';
import { BeamsBackground } from '../ui/beams-background';
import { TopNavigation } from './TopNavigation';
import { Button } from '../ui/button';
import { useNavigate } from 'react-router-dom';
import { useIsMobile } from '@/hooks/use-mobile';
import { Home } from 'lucide-react';

interface SettingsLayoutProps {
  children: React.ReactNode;
}

export function SettingsLayout({ children }: SettingsLayoutProps) {
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  return (
    <BeamsBackground intensity="subtle">
      <TopNavigation />
      <div className="container mx-auto py-8 px-4 text-gray-100">
        {isMobile && (
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => navigate('/dashboard')}
            className="mb-6"
          >
            <Home className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Button>
        )}
        {children}
      </div>
    </BeamsBackground>
  );
}
