"use client";

import { useState } from "react";
import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import { usePathname } from "next/navigation"; // To detect active route
import {
  Home,
  Book,
  FileText,
  Mail,
  Menu,
  LogOut,
  X,
  User,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ModeToggle } from "./mode-toggle";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const MobileNav = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { data: session, status } = useSession();
  const pathname = usePathname(); // Get current route

  const navItems = [
    { name: "Home", href: "/", icon: <Home className="h-6 w-6" /> },
    { name: "Notes", href: "/notes", icon: <Book className="h-6 w-6" /> },
    {
      name: "Resources",
      href: "/resources",
      icon: <FileText className="h-6 w-6" />,
    },
    { name: "Contact", href: "/contact", icon: <Mail className="h-6 w-6" /> },
  ];

  const handleSignOut = async () => {
    await signOut({ callbackUrl: "/" });
    setIsOpen(false);
  };

  return (
    <>
      {/* Bottom Navigation Bar for Mobile */}
      <div className="fixed bottom-0 left-0 right-0 md:hidden bg-background/95 backdrop-blur border-t shadow-lg z-50 rounded-t-xl">
        <div className="flex justify-around items-center h-16">
          {navItems.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className={`flex-1 rounded-lg flex justify-center items-center py-2 mx-5 transition-all duration-200 ease-in-out ${
                pathname === item.href
                  ? "text-primary bg-muted"
                  : "hover:bg-muted rounded-lg hover:text-primary hover:scale-110 hover:shadow-sm"
              }`}
              aria-label={item.name}
            >
              {item.icon}
            </Link>
          ))}
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="flex-1 p-3 hover:bg-muted hover:text-primary"
                aria-label="Open menu"
              >
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[320px] sm:w-[420px] p-0">
              <SheetHeader className="flex flex-row items-center justify-between p-4 border-b">
                <SheetTitle className="text-lg font-semibold">Menu</SheetTitle>
                <SheetClose asChild>
                  <Button variant="ghost" size="icon" aria-label="Close menu">
                    <X className="h-5 w-5" />
                  </Button>
                </SheetClose>
              </SheetHeader>
              <div className="p-4 space-y-2">
                {navItems.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`flex items-center gap-3 px-4 py-3 text-base font-medium rounded-lg transition-colors ${
                      pathname === item.href
                        ? "bg-muted text-primary"
                        : "hover:bg-muted hover:text-primary"
                    }`}
                    onClick={() => setIsOpen(false)}
                  >
                    {item.icon}
                    {item.name}
                  </Link>
                ))}
                {status === "authenticated" && session.user.isAdmin && (
                  <Link
                    href="/admin/dashboard"
                    className={`flex items-center gap-3 px-4 py-3 text-base font-medium rounded-lg transition-colors ${
                      pathname === "/admin/dashboard"
                        ? "bg-muted text-primary"
                        : "hover:bg-muted hover:text-primary"
                    }`}
                    onClick={() => setIsOpen(false)}
                  >
                    <FileText className="h-6 w-6" />
                    Admin
                  </Link>
                )}
                {status === "authenticated" ? (
                  <div className="space-y-2 border-t pt-4 mt-4">
                    <div className="flex items-center gap-4 px-4 py-3">
                      <Avatar className="h-12 w-12">
                        <AvatarImage
                          src={session.user.image}
                          alt={session.user.name}
                        />
                        <AvatarFallback>
                          {session.user.name?.charAt(0) ||
                            session.user.email?.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-sm font-semibold">
                          {session.user.name}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {session.user.email}
                        </p>
                      </div>
                    </div>
                    <Link
                      href="/profile"
                      className={`flex items-center gap-3 px-4 py-3 text-base font-medium rounded-lg transition-colors ${
                        pathname === "/profile"
                          ? "bg-muted text-primary"
                          : "hover:bg-muted hover:text-primary"
                      }`}
                      onClick={() => setIsOpen(false)}
                    >
                      <User className="h-6 w-6" />
                      Profile
                    </Link>
                    <Button
                      variant="outline"
                      className="w-full justify-start px-4 py-3 text-base font-medium rounded-lg"
                      onClick={handleSignOut}
                    >
                      <LogOut className="mr-2 h-5 w-5" />
                      Sign Out
                    </Button>
                  </div>
                ) : (
                  <Link
                    href="/login"
                    className={`flex items-center gap-3 px-4 py-3 text-base font-medium rounded-lg transition-colors ${
                      pathname === "/login"
                        ? "bg-muted text-primary"
                        : "hover:bg-muted hover:text-primary"
                    }`}
                    onClick={() => setIsOpen(false)}
                  >
                    <Mail className="h-6 w-6" />
                    Sign In
                  </Link>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </>
  );
};

export default MobileNav;
