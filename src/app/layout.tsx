import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { TooltipProvider } from '@/components/ui/tooltip';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: 'Affiliot — AI Operating System untuk TikTok Affiliate',
  description: 'Platform AI Workflow Management yang membantu TikTok Affiliate mengelola seluruh proses pembuatan konten secara terstruktur.',
};

import { AuthProvider } from '@/components/providers/AuthProvider';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className={inter.variable}>
      <body className="antialiased">
        <AuthProvider>
          <TooltipProvider>
            {children}
          </TooltipProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
