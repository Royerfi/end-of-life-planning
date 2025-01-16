'use client';

import '../styles/globals.css';
import type { AppProps } from 'next/app';
import { AuthProvider } from '../lib/AuthContext';

function MyApp({ Component, pageProps }: AppProps) {
  console.log('AuthProvider is wrapping the application'); // Debug statement
  console.log('Initializing _app.tsx'); // Debugging

  return (
    <AuthProvider>
      <Component {...pageProps} />
    </AuthProvider>
  );
}

export default MyApp;
