'use client';

import { TopBar } from './TopBar';

export function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <TopBar />
      <main className="flex-1 flex justify-center py-8">
        <div className="w-full max-w-[1400px] px-6 md:px-8">
          {children}
        </div>
      </main>
    </div>
  );
}
