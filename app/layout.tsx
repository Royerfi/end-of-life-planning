import { Inter } from 'next/font/google'
import './globals.css'
import { cn } from '@/lib/utils'
import { Sidebar } from './components/sidebar'
import { AuthProvider } from '@/lib/AuthContext'
import { ThemeProvider } from "@/components/theme-provider"
import { SidebarProvider } from '@/components/ui/sidebar'

const inter = Inter({ subsets: ['latin'] })

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
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            <SidebarProvider>
              <div className="flex min-h-screen">
                <Sidebar />
                <main className="flex-1 overflow-y-auto p-6 ml-[16rem]">
                  {children}
                </main>
              </div>
            </SidebarProvider>
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  )
}

