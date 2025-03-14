"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { BarChart3, FileText, Home, LineChart, RefreshCw, Settings, ShoppingCart } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

export default function Sidebar() {
  const pathname = usePathname()
  const [collapsed, setCollapsed] = useState(false)

  return (
    <div
      className={cn(
        "bg-card border-r border-border h-[calc(100vh-4rem)] transition-all duration-300 hidden md:block",
        collapsed ? "w-[4.5rem]" : "w-64",
      )}
    >
      <div className="p-4">
        <Button variant="outline" size="sm" className="w-full justify-start" onClick={() => setCollapsed(!collapsed)}>
          <RefreshCw className="h-4 w-4 mr-2" />
          {!collapsed && <span>Toggle Sidebar</span>}
        </Button>
      </div>

      <nav className="space-y-1 px-2">
        <NavItem
          href="/dashboard"
          icon={<Home className="h-5 w-5" />}
          label="Dashboard"
          active={pathname === "/dashboard"}
          collapsed={collapsed}
        />
        <NavItem
          href="/dashboard/marketplace"
          icon={<ShoppingCart className="h-5 w-5" />}
          label="Marketplace"
          active={pathname === "/dashboard/marketplace"}
          collapsed={collapsed}
        />
        <NavItem
          href="/dashboard/co2-reports"
          icon={<FileText className="h-5 w-5" />}
          label="CO2 Reports"
          active={pathname === "/dashboard/co2-reports"}
          collapsed={collapsed}
        />
        <NavItem
          href="/dashboard/trade-requests"
          icon={<BarChart3 className="h-5 w-5" />}
          label="Trade Requests"
          active={pathname === "/dashboard/trade-requests"}
          collapsed={collapsed}
        />
        <NavItem
          href="/dashboard/analytics"
          icon={<LineChart className="h-5 w-5" />}
          label="Analytics"
          active={pathname === "/dashboard/analytics"}
          collapsed={collapsed}
        />
        <NavItem
          href="/dashboard/settings"
          icon={<Settings className="h-5 w-5" />}
          label="Settings"
          active={pathname === "/dashboard/settings"}
          collapsed={collapsed}
        />
      </nav>
    </div>
  )
}

function NavItem({
  href,
  icon,
  label,
  active,
  collapsed,
}: {
  href: string
  icon: React.ReactNode
  label: string
  active: boolean
  collapsed: boolean
}) {
  return (
    <Link
      href={href}
      className={cn(
        "flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors",
        active ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-secondary hover:text-foreground",
      )}
    >
      <span className="mr-3">{icon}</span>
      {!collapsed && <span>{label}</span>}
    </Link>
  )
}

