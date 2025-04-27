
import React from 'react';

interface SettingsLayoutProps {
  children: React.ReactNode;
}

export function SettingsLayout({ children }: SettingsLayoutProps) {
  return (
    <div className="container mx-auto py-8 px-4">
      {children}
    </div>
  );
}
