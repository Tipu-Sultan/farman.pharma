'use client'

import { useSession, signOut } from 'next-auth/react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ModeToggle } from './mode-toggle'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { LogOut } from 'lucide-react'

const DesktopNav = () => {
  const { data: session, status } = useSession()

  console.log(session)

  const navItems = [
    { name: 'Home', href: '/' },
    { name: 'Notes', href: '/notes' },
    { name: 'Resources', href: '/resources' },
    { name: 'Contact', href: '/contact' },
  ]

  const handleSignOut = async () => {
    await signOut({ callbackUrl: '/' })
  }

  return (
    <div className="flex items-center space-x-4">
      {/* Navigation Links - Visible only on desktop (lg and above) */}
      <div className="hidden lg:flex items-center space-x-4">
        {navItems.map((item) => (
          <Link
            key={item.name}
            href={item.href}
            className="text-sm hover:text-primary transition-colors"
          >
            {item.name}
          </Link>
        ))}
      </div>

      {/* Admin Button, Theme Toggle, and Profile/Avatar - Always visible */}
      {status === 'authenticated' ? (
        <>
          {session.user.isAdmin && (
            <Button asChild variant="outline" size="sm">
              <Link href="/admin">Admin</Link>
            </Button>
          )}
          <ModeToggle />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="p-0 h-auto">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={session.user.image} alt={session.user.name} />
                  <AvatarFallback>
                    {session.user.name?.charAt(0) || session.user.email?.charAt(0)}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>
                <div className="flex flex-col">
                  <span className="font-medium">{session.user.name}</span>
                  <span className="text-xs text-muted-foreground">{session.user.email}</span>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/profile" className="w-full">
                  Profile
                </Link>
              </DropdownMenuItem>
              {session.user.isAdmin && (
                <DropdownMenuItem asChild>
                  <Link href="/admin" className="w-full">
                    Admin Dashboard
                  </Link>
                </DropdownMenuItem>
              )}
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleSignOut} className="cursor-pointer">
                <LogOut className="mr-2 h-4 w-4" />
                Sign Out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </>
      ) : (
        <>
          <ModeToggle />
          <Button asChild variant="outline" size="sm">
            <Link href="/login">Sign In</Link>
          </Button>
        </>
      )}
    </div>
  )
}

export default DesktopNav