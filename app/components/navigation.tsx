'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  FileText,
  Users,
  PhoneCall,
  UserCircle,
  BookOpen,
  Home,
  LogOut,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';

export function Navigation() {
  const router = useRouter();
  const pathname = usePathname();

  const handleLogout = async () => {
    try {
      const response = await fetch('/api/logout', {
        method: 'POST',
      });
  
      if (response.ok) {
        toast({
          title: 'Success',
          description: "You've been logged out successfully.",
        });
        router.push('/login');
      } else {
        throw new Error('Failed to log out');
      }
    } catch (error) {
      console.error('Logout error:', error); // Log the error to console
      toast({
        title: 'Error',
        description: 'Failed to log out. Please try again.',
        variant: 'destructive',
      });
    }
  };
  

  const navItems = [
    { href: '/', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/documents', label: 'Documents', icon: FileText },
    { href: '/family', label: 'Family Members', icon: Users },
    { href: '/contacts', label: 'Key Contacts', icon: PhoneCall },
    { href: '/profile', label: 'Profile', icon: UserCircle },
    { href: '/resources', label: 'Resources', icon: BookOpen },
    { href: '/real-estate', label: 'Real Estate', icon: Home },
  ];

  return (
    <nav className="w-64 bg-background border-r h-screen">
      <div className="p-4">
        <h1 className="text-2xl font-bold">Life Planning</h1>
      </div>
      <ul className="space-y-2 p-4">
        {navItems.map(({ href, label, icon: Icon }) => (
          <li key={href}>
            <Link
              href={href}
              className={`flex items-center space-x-2 transition-colors ${
                pathname === href
                  ? 'text-foreground font-semibold'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
              aria-current={pathname === href ? 'page' : undefined}
            >
              <Icon size={20} />
              <span>{label}</span>
            </Link>
          </li>
        ))}
      </ul>
      <div className="p-4">
        <Button onClick={handleLogout} variant="outline" className="w-full">
          <LogOut size={20} className="mr-2" />
          Logout
        </Button>
      </div>
    </nav>
  );
}
