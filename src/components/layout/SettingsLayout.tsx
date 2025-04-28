
import React from 'react';
import { BeamsBackground } from '../ui/beams-background';
import { TopNavigation } from './TopNavigation';

interface SettingsLayoutProps {
  children: React.ReactNode;
}

export function SettingsLayout({ children }: SettingsLayoutProps) {
  return (
    <BeamsBackground intensity="subtle">
      <TopNavigation />
      <div className="container mx-auto py-8 px-4 text-gray-100">
        {children}
      </div>
    </BeamsBackground>
  );
}
