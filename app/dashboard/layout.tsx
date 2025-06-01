import type React from "react"
import { Sidebar } from "@/components/sidebar"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen flex">
      <Sidebar />
      <div className="flex-1 lg:ml-64">
        <main className="pt-16 lg:pt-4 p-0">{children}</main>
      </div>
    </div>
  )
}
