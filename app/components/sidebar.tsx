'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { LayoutDashboard, FileText, Users, Phone, UserCircle, BookOpen, Home, LogOut, ChevronUp } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/lib/AuthContext'
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from '@/components/ui/dropdown-menu'
import {
  Sidebar as ShadcnSidebar,
  SidebarContent,
  SidebarHeader,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from '@/components/ui/sidebar'
import { ThemeToggle } from '@/components/theme-toggle'

const routes = [
  {
    label: 'Dashboard',
    icon: LayoutDashboard,
    href: '/dashboard',
    color: 'text-sky-500',
  },
  {
    label: 'Documents',
    icon: FileText,
    href: '/documents',
    color: 'text-yellow-500',
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
  const { user, logout } = useAuth()

  return (
    <ShadcnSidebar className="fixed left-0 top-0 z-40 h-screen w-64 border-r">
      <SidebarHeader className="flex items-center justify-between p-4">
        <Link href="/dashboard" className="flex items-center">
          <h1 className="text-2xl font-bold">Life Planning</h1>
        </Link>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          {routes.map((route) => (
            <SidebarMenuItem key={route.href}>
              <SidebarMenuButton asChild isActive={pathname === route.href}>
                <Link
                  href={route.href}
                  className={cn(
                    "flex items-center w-full",
                    pathname === route.href ? "text-primary" : "text-muted-foreground"
                  )}
                >
                  <route.icon className={cn("h-5 w-5 mr-3", route.color)} />
                  {route.label}
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter className="p-4 space-y-2">
        <ThemeToggle />
      </SidebarFooter>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton>
                  {user?.name || 'User'} 
                  <ChevronUp className="ml-auto" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                side="top"
                className="w-[--radix-popper-anchor-width]"
              >
                <DropdownMenuItem>
                  <Link href="/profile" className="w-full">Account</Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Button variant="ghost" className="w-full justify-start p-0" onClick={logout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    Sign out
                  </Button>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </ShadcnSidebar>
  )
}

