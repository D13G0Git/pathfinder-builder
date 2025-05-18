"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ScrollText, Settings, Home, Map, Sword, Shield, Menu, X } from "lucide-react"
import { cn } from "@/lib/utils"

interface SidebarProps {
  className?: string
}

export function Sidebar({ className }: SidebarProps) {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)

  const toggleSidebar = () => {
    setIsOpen(!isOpen)
  }

  const routes = [
    {
      label: "Dashboard",
      icon: Home,
      href: "/dashboard",
      active: pathname === "/dashboard",
    },
    {
      label: "Adventures",
      icon: Map,
      href: "/adventures",
      active: pathname === "/adventures",
    },
    {
      label: "Characters",
      icon: Sword,
      href: "/characters",
      active: pathname === "/characters",
    },
    {
      label: "Inventory",
      icon: ScrollText,
      href: "/inventory",
      active: pathname === "/inventory",
    },
    {
      label: "Game",
      icon: Shield,
      href: "/game",
      active: pathname === "/game",
    },
    {
      label: "Settings",
      icon: Settings,
      href: "/settings",
      active: pathname === "/settings",
    },
  ]

  return (
    <>
      <Button variant="ghost" size="icon" className="md:hidden fixed top-4 left-4 z-50" onClick={toggleSidebar}>
        {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </Button>

      <div
        className={cn(
          "fixed inset-y-0 left-0 z-40 w-64 bg-card border-r border-border transition-transform duration-300 ease-in-out",
          isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0",
          className,
        )}
      >
        <div className="flex flex-col h-full">
          <div className="p-6">
            <h2 className="text-2xl font-bold flex items-center">
              <Shield className="mr-2 h-6 w-6" />
              Pathfinder
            </h2>
          </div>
          <div className="flex-1 px-4 space-y-1 overflow-auto">
            {routes.map((route) => (
              <Link
                key={route.href}
                href={route.href}
                className={cn(
                  "flex items-center py-3 px-4 text-sm rounded-md transition-colors",
                  route.active
                    ? "bg-primary/10 text-primary font-medium"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground",
                )}
                onClick={() => setIsOpen(false)}
              >
                <route.icon className="mr-3 h-5 w-5" />
                {route.label}
              </Link>
            ))}
          </div>
          <div className="p-4 border-t border-border">
            <div className="flex items-center">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                A
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium">Adventurer</p>
                <p className="text-xs text-muted-foreground">Level 5 Wizard</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
