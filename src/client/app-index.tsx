import React from 'react';
import { AppProps } from 'next/app';
import { ThemeProvider } from '@/components/theme-provider';
import { AuthProvider } from '@/lib/AuthContext';
import { SidebarProvider } from '@/components/ui/sidebar';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <AuthProvider>
        <SidebarProvider>
          <Component {...pageProps} />
        </SidebarProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default MyApp;

