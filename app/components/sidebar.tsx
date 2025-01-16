'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { LayoutDashboard, FileText, Users, Phone, UserCircle, BookOpen, Home, LogOut } from 'lucide-react'
import { Button } from '@/components/ui/button'

const routes = [
  {
    label: 'Dashboard asfasdfasdfasdf',
    icon: LayoutDashboard,
    href: '/dashboard',
    color: 'text-sky-500',
  },
  {
    label: 'Documents',
    icon: FileText,
    href: '/documents',
    color: 'text-violet-500',
  },
  {
    label: 'Family Members',
    icon: Users,
    href: '/family-members',
    color: 'text-pink-700',
  },
  {
    label: 'Key Contacts',
    icon: Phone,
    href: '/key-contacts',
    color: 'text-orange-700',
  },
  {
    label: 'Profile',
    icon: UserCircle,
    href: '/profile',
    color: 'text-emerald-500',
  },
  {
    label: 'Resources',
    icon: BookOpen,
    href: '/resources',
    color: 'text-blue-700',
  },
  {
    label: 'Real Estate',
    icon: Home,
    href: '/real-estate',
    color: 'text-rose-500',
  }
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <div className="space-y-4 py-4 flex flex-col h-full bg-[#111827] text-white">
      <div className="px-3 py-2 flex-1">
        <Link href="/dashboard" className="flex items-center pl-3 mb-14">
          <h1 className="text-2xl font-bold">
            Life Planning
          </h1>
        </Link>
        <div className="space-y-1">
          {routes.map((route) => (
            <Link
              key={route.href}
              href={route.href}
              className={cn(
                "text-sm group flex p-3 w-full justify-start font-medium cursor-pointer hover:text-white hover:bg-white/10 rounded-lg transition",
                pathname === route.href ? "text-white bg-white/10" : "text-zinc-400",
              )}
            >
              <div className="flex items-center flex-1">
                <route.icon className={cn("h-5 w-5 mr-3", route.color)} />
                {route.label}
              </div>
            </Link>
          ))}
        </div>
      </div>
      <div className="px-3 py-2">
        <Button 
          variant="ghost" 
          className="w-full justify-start text-zinc-400 hover:text-white hover:bg-white/10"
          onClick={() => {}}
        >
          <LogOut className="h-5 w-5 mr-3" />
          Logout
        </Button>
      </div>
    </div>
  )
}

