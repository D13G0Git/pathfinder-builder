import type React from "react"
import { Sidebar } from "@/components/sidebar"
import { Navbar } from "@/components/navbar"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen flex">
      <Sidebar />
      <div className="flex-1 md:ml-64">
        <Navbar />
        <main className="p-4 md:p-6">{children}</main>
      </div>
    </div>
  )
}
