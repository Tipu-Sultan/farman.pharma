// app/admin/layout.js
'use client' 

import { useState } from 'react'
import { Shield, Menu } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { usePathname, useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'


export default function AdminLayout({ children }) {
    const { data: session, status } = useSession()
    const pathname = usePathname()
    const router = useRouter()
    const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  
    // Loading state
    if (status === 'loading') {
      return <div className="p-8 text-center">Loading...</div>
    }
  
    // Redirect if not authenticated or not an admin
    if (!session || !session.user?.isAdmin) {
      router.push('/login')
      return null
    }
  
    const isSuperadmin = session.user.adminRole === 'superadmin'
  
    // Restrict access to /admin/users for non-superadmins
    if (pathname === '/admin/users' && !isSuperadmin) {
      return (
        <div className="flex min-h-screen items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold">Access Denied</h1>
            <p className="mt-2">Only superadmins can access this page.</p>
            <Button asChild className="mt-4">
              <Link href="/admin">Back to Dashboard</Link>
            </Button>
          </div>
        </div>
      )
    }
  
    const navItems = [
      { name: 'Dashboard', href: '/admin' },
      { name: 'Notes', href: '/admin/notes' },
      { name: 'Resources', href: '/admin/resources' },
      ...(isSuperadmin ? [{ name: 'Users', href: '/admin/users' }] : []), // Show Users link only for superadmins
    ]
  return (
    <div className="flex min-h-screen flex-col">
      {/* Mobile Header */}
      <header className="lg:hidden p-4 flex justify-between items-center border-b">
        <div className="flex items-center gap-2">
          <Shield className="h-6 w-6" />
          <h2 className="text-xl font-bold">Admin Panel</h2>
        </div>
        <Sheet open={isSidebarOpen} onOpenChange={setIsSidebarOpen}>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon">
              <Menu className="h-6 w-6" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-64 p-6">
            <nav className="space-y-4">
            {navItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`block p-3 rounded-lg transition-colors ${
                    pathname === item.href ? 'bg-accent font-semibold' : 'hover:bg-accent'
                  }`}
                  onClick={() => setIsSidebarOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
            </nav>
          </SheetContent>
        </Sheet>
      </header>

      {/* Main Layout */}
      <div className="flex flex-1">
        {/* Sidebar (Desktop) */}
        <aside className="hidden lg:block w-64 shadow-md">
          <div className="p-6">
            <div className="flex items-center gap-2 mb-8">
              <Shield className="h-6 w-6" />
              <h2 className="text-xl font-bold">Admin Panel</h2>
            </div>
            <nav className="space-y-2">
            {navItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`block p-3 rounded-lg transition-colors ${
                    pathname === item.href ? 'bg-accent font-semibold' : 'hover:bg-accent'
                  }`}
                  onClick={() => setIsSidebarOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
            </nav>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-8">
          {children}
        </main>
      </div>
    </div>
  )
}