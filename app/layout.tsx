import './globals.css'
import { Inter } from 'next/font/google'
import { Navigation } from './components/navigation'
import { Header } from './components/Header'
import { AuthProvider } from '@/lib/AuthContext'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Life Planning',
  description: 'Prepare for end of life planning with secure document storage and family management',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          <div className="flex h-screen bg-background">
            <Navigation />
            <div className="flex-1 flex flex-col">
              <Header />
              <main className="flex-1 overflow-y-auto">
                {children}
              </main>
            </div>
          </div>
        </AuthProvider>
      </body>
    </html>
  )
}

