"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Menu, X } from "lucide-react"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const pathname = usePathname()

  const isLoggedIn = false // Replace with actual auth state

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen)

  return (
    <header className="bg-background/80 backdrop-blur-md sticky top-0 z-50 border-b border-border">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center">
            <span className="text-2xl font-bold text-primary">Carbon</span>
            <span className="text-2xl font-bold">Chain</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <NavLink href="/" active={pathname === "/"}>
              Home
            </NavLink>
            <NavLink href="/about" active={pathname === "/about"}>
              About
            </NavLink>
            <NavLink href="/marketplace" active={pathname === "/marketplace"}>
              Marketplace
            </NavLink>

            {isLoggedIn ? (
              <>
                <NavLink href="/dashboard" active={pathname === "/dashboard"}>
                  Dashboard
                </NavLink>
                <Button variant="outline" onClick={() => console.log("Logout")}>
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Button asChild variant="ghost">
                  <Link href="/login">Login</Link>
                </Button>
                <Button asChild>
                  <Link href="/register">Register</Link>
                </Button>
              </>
            )}
          </nav>

          {/* Mobile Menu Button */}
          <button className="md:hidden" onClick={toggleMenu}>
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden bg-background border-b border-border">
          <div className="container mx-auto px-4 py-4 space-y-3">
            <MobileNavLink href="/" onClick={toggleMenu}>
              Home
            </MobileNavLink>
            <MobileNavLink href="/about" onClick={toggleMenu}>
              About
            </MobileNavLink>
            <MobileNavLink href="/marketplace" onClick={toggleMenu}>
              Marketplace
            </MobileNavLink>

            {isLoggedIn ? (
              <>
                <MobileNavLink href="/dashboard" onClick={toggleMenu}>
                  Dashboard
                </MobileNavLink>
                <Button variant="outline" className="w-full" onClick={() => console.log("Logout")}>
                  Logout
                </Button>
              </>
            ) : (
              <div className="grid grid-cols-2 gap-3 pt-3">
                <Button asChild variant="outline">
                  <Link href="/login" onClick={toggleMenu}>
                    Login
                  </Link>
                </Button>
                <Button asChild>
                  <Link href="/register" onClick={toggleMenu}>
                    Register
                  </Link>
                </Button>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  )
}

function NavLink({ href, active, children }: { href: string; active: boolean; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className={cn(
        "text-sm font-medium transition-colors hover:text-primary",
        active ? "text-primary" : "text-foreground",
      )}
    >
      {children}
    </Link>
  )
}

function MobileNavLink({ href, onClick, children }: { href: string; onClick: () => void; children: React.ReactNode }) {
  return (
    <Link href={href} className="block py-2 text-foreground hover:text-primary" onClick={onClick}>
      {children}
    </Link>
  )
}

