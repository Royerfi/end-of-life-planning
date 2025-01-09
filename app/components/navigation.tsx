import Link from 'next/link'
import { LayoutDashboard, FileText, Users, PhoneCall, UserCircle, BookOpen, Home } from 'lucide-react'

export function Navigation() {
  return (
    <nav className="w-64 bg-white shadow-md h-screen">
      <div className="p-4">
        <h1 className="text-2xl font-bold text-gray-800">Life Planning</h1>
      </div>
      <ul className="space-y-2 p-4">
        <li>
          <Link href="/" className="flex items-center space-x-2 text-gray-700 hover:text-blue-500">
            <LayoutDashboard size={20} />
            <span>Dashboard</span>
          </Link>
        </li>
        <li>
          <Link href="/documents" className="flex items-center space-x-2 text-gray-700 hover:text-blue-500">
            <FileText size={20} />
            <span>Documents</span>
          </Link>
        </li>
        <li>
          <Link href="/family" className="flex items-center space-x-2 text-gray-700 hover:text-blue-500">
            <Users size={20} />
            <span>Family Members</span>
          </Link>
        </li>
        <li>
          <Link href="/contacts" className="flex items-center space-x-2 text-gray-700 hover:text-blue-500">
            <PhoneCall size={20} />
            <span>Key Contacts</span>
          </Link>
        </li>
        <li>
          <Link href="/profile" className="flex items-center space-x-2 text-gray-700 hover:text-blue-500">
            <UserCircle size={20} />
            <span>Profile</span>
          </Link>
        </li>
        <li>
          <Link href="/resources" className="flex items-center space-x-2 text-gray-700 hover:text-blue-500">
            <BookOpen size={20} />
            <span>Resources</span>
          </Link>
        </li>
        <li>
          <Link href="/real-estate" className="flex items-center space-x-2 text-gray-700 hover:text-blue-500">
            <Home size={20} />
            <span>Real Estate</span>
          </Link>
        </li>
      </ul>
    </nav>
  )
}

