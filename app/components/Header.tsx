'use client'

import { useAuth } from '@/lib/AuthContext'
import { usePathname } from 'next/navigation'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Breadcrumbs } from "./Breadcrumbs"

export function Header() {
  const { user } = useAuth()
  const pathname = usePathname()

  return (
    <header className="bg-background border-b px-4 py-2">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <div className="flex items-center gap-4">
          <h1 className="text-lg font-semibold">Life Planning</h1>
          <Breadcrumbs />
        </div>
        <div className="flex items-center space-x-4">
          <span className="text-sm text-muted-foreground">
            Welcome, {user ? user.name : 'Guest'}
          </span>
          <Avatar className="h-8 w-8">
            <AvatarImage src="/placeholder-user.jpg" alt={user ? user.name : 'Guest'} />
            <AvatarFallback>{user ? user.name[0] : 'G'}</AvatarFallback>
          </Avatar>
        </div>
      </div>
    </header>
  )
}

