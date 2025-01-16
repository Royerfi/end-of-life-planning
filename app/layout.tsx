'use client'


import { Inter } from 'next/font/google'
import './globals.css'
import { cn } from '@/lib/utils'
import { Sidebar } from './components/sidebar'
import { AuthProvider } from '@/lib/AuthContext'

const inter = Inter({subsets: ['latin']})

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={cn(
        "min-h-screen bg-background font-sans antialiased",
        inter.className
      )}>
        <AuthProvider>
          <div className="relative flex min-h-screen">
            <Sidebar />
            <main className="flex-1">{children}</main>
          </div>
        </AuthProvider>
      </body>
    </html>
  )
}

