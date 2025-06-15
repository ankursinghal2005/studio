import React from 'react';
import { AppLogoIcon } from '@/components/ledger/icons';

export function Header() {
  return (
    <header className="bg-card border-b border-border shadow-sm sticky top-0 z-40">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <AppLogoIcon className="h-8 w-8 text-primary" />
            <h1 className="ml-3 text-2xl font-headline font-semibold text-foreground">
              Public Ledger Hub
            </h1>
          </div>
        </div>
      </div>
    </header>
  );
}
