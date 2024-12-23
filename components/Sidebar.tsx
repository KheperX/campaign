'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, Calendar, LogOut } from 'lucide-react'

export default function Sidebar() {
  const pathname = usePathname()

  return (
    <div className="bg-gray-800 text-white w-64 space-y-6 py-7 px-2 absolute inset-y-0 left-0 transform -translate-x-full md:relative md:translate-x-0 transition duration-200 ease-in-out">
      <nav>
        <Link href="/dashboard" className={`block py-2.5 px-4 rounded transition duration-200 ${
          pathname === '/dashboard' ? 'bg-gray-900 text-white' : 'hover:bg-gray-700'
        }`}>
          <Home className="inline-block mr-2" size={16} />
          Dashboard
        </Link>
        <Link href="/campaigns" className={`block py-2.5 px-4 rounded transition duration-200 ${
          pathname.startsWith('/campaigns') ? 'bg-gray-900 text-white' : 'hover:bg-gray-700'
        }`}>
          <Calendar className="inline-block mr-2" size={16} />
          Campaigns
        </Link>
      </nav>
      <div className="absolute bottom-0 w-full">
        <button
          onClick={() => {
            // Implement logout logic here
          }}
          className="block w-full py-2.5 px-4 rounded transition duration-200 hover:bg-gray-700"
        >
          <LogOut className="inline-block mr-2" size={16} />
          Logout
        </button>
      </div>
    </div>
  )
}

