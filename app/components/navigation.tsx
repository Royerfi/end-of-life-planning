'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { LayoutDashboard, FileText, Users, PhoneCall, UserCircle, BookOpen, Home, LogOut } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { toast } from "@/components/ui/use-toast"

export function Navigation() {
  const router = useRouter()

  const handleLogout = async () => {
    try {
      const response = await fetch('/api/logout', {
        method: 'POST',
      })

      if (response.ok) {
        toast({
          title: "Success",
          description: "You've been logged out successfully.",
        })
        router.push('/login')
      } else {
        throw new Error('Failed to log out')
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to log out. Please try again.",
        variant: "destructive",
      })
    }
  }

  return (
    <nav className="w-64 bg-background border-r h-screen">
      <div className="p-4">
        <h1 className="text-2xl font-bold">Life Planning</h1>
      </div>
      <ul className="space-y-2 p-4">
        <li>
          <Link 
            href="/" 
            className="flex items-center space-x-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <LayoutDashboard size={20} />
            <span>Dashboard</span>
          </Link>
        </li>
        <li>
          <Link 
            href="/documents" 
            className="flex items-center space-x-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <FileText size={20} />
            <span>Documents</span>
          </Link>
        </li>
        <li>
          <Link 
            href="/family" 
            className="flex items-center space-x-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <Users size={20} />
            <span>Family Members</span>
          </Link>
        </li>
        <li>
          <Link 
            href="/contacts" 
            className="flex items-center space-x-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <PhoneCall size={20} />
            <span>Key Contacts</span>
          </Link>
        </li>
        <li>
          <Link 
            href="/profile" 
            className="flex items-center space-x-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <UserCircle size={20} />
            <span>Profile</span>
          </Link>
        </li>
        <li>
          <Link 
            href="/resources" 
            className="flex items-center space-x-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <BookOpen size={20} />
            <span>Resources</span>
          </Link>
        </li>
        <li>
          <Link 
            href="/real-estate" 
            className="flex items-center space-x-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <Home size={20} />
            <span>Real Estate</span>
          </Link>
        </li>
      </ul>
      <div className="p-4">
        <Button onClick={handleLogout} variant="outline" className="w-full">
          <LogOut size={20} className="mr-2" />
          Logout
        </Button>
      </div>
    </nav>
  )
}

