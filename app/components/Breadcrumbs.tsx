'use client'

import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { ChevronRight } from 'lucide-react'

const routeNameMap: Record<string, string> = {
  dashboard: 'Dashboard',
  documents: 'Documents',
  family: 'Family Members',
  contacts: 'Key Contacts',
  profile: 'Profile',
  resources: 'Resources',
  'real-estate': 'Real Estate'
}

export function Breadcrumbs() {
  const pathname = usePathname()
  const segments = pathname?.split('/').filter(Boolean) || []
  if (!pathname) return null;

  if (segments.length === 0) return null

  return (
    <nav className="flex items-center space-x-1 text-sm text-muted-foreground">
      {segments.map((segment, index) => {
        const path = `/${segments.slice(0, index + 1).join('/')}`
        const isLast = index === segments.length - 1
        const name = routeNameMap[segment] || segment

        return (
          <div key={path} className="flex items-center">
            {index > 0 && <ChevronRight className="h-4 w-4 mx-1" />}
            {isLast ? (
              <span className="font-medium text-foreground">{name}</span>
            ) : (
              <Link
                href={path}
                className="hover:text-foreground transition-colors"
              >
                {name}
              </Link>
            )}
          </div>
        )
      })}
    </nav>
  )
}

