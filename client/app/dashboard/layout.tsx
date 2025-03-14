import type { ReactNode } from "react"
import Sidebar from "@/components/dashboard/sidebar"
import DashboardHeader from "@/components/dashboard/header"

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col">
      <DashboardHeader />
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 p-6 overflow-auto">{children}</main>
      </div>
    </div>
  )
}

