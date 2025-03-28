// components/Navbar.js
'use client'

import Link from 'next/link'
import MobileNav from './MobileNav'
import DesktopNav from './DesktopNav'

const Navbar = () => {
  return (
    <nav className="fixed w-full bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 z-50 border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="text-xl sm:text-2xl font-bold">
              Farman.Khan
            </Link>
          </div>
          <DesktopNav />
        </div>
      </div>
    </nav>
  )
}

export default Navbar