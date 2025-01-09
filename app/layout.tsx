import './globals.css'
import { Inter } from 'next/font/google'
import { Navigation } from './components/navigation'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'End of Life Planning',
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
        <div className="flex h-screen bg-gray-100">
          <Navigation />
          <div className="flex-1 flex flex-col">
            <header className="bg-white shadow-sm p-4">
              <div className="max-w-7xl mx-auto flex justify-between items-center">
                <h1 className="text-2xl font-semibold text-gray-800">End of Life Planning</h1>
                <div className="flex items-center space-x-4">
                  <span className="text-sm text-gray-600">Welcome, User</span>
                  <Avatar className="h-8 w-8">
                    <AvatarImage src="/placeholder-user.jpg" alt="User's profile picture" />
                    <AvatarFallback>U</AvatarFallback>
                  </Avatar>
                </div>
              </div>
            </header>
            <main className="flex-1 overflow-y-auto p-8">
              {children}
            </main>
          </div>
        </div>
      </body>
    </html>
  )
}

