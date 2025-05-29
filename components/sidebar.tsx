"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Settings, Home, Map, Sword, Shield, Menu, X, LogOut, User, LucideShield, ShieldPlus } from "lucide-react"
import { cn } from "@/lib/utils"
import { supabase } from "@/lib/supabase"
import { toast } from "sonner"

interface SidebarProps {
  className?: string
}

interface UserData {
  email: string
  username?: string
  avatar_url?: string
}

export function Sidebar({ className }: SidebarProps) {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)
  const [user, setUser] = useState<UserData | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const toggleSidebar = () => {
    setIsOpen(!isOpen)
  }

  // Cargar información del usuario autenticado
  useEffect(() => {
    const loadUserData = async () => {
      try {
        const { data, error } = await supabase.auth.getUser()
        
        if (error) throw error
        
        if (data?.user) {
          setUser({
            email: data.user.email || "",
            username: data.user.user_metadata?.username || data.user.email?.split('@')[0] || "Usuario",
            avatar_url: data.user.user_metadata?.avatar_url
          })
        }
      } catch (error: any) {
        console.error("Error al cargar el usuario:", error)
      } finally {
        setIsLoading(false)
      }
    }

    loadUserData()
  }, [])

  // Función para cerrar sesión
  const handleSignOut = async () => {
    try {
      const { error } = await supabase.auth.signOut()
      if (error) throw error
      
      toast.success("Sesión cerrada", {
        description: "Has cerrado sesión exitosamente"
      })
      
      // Redirigir al login
      window.location.href = "/login"
    } catch (error: any) {
      console.error("Error al cerrar sesión:", error)
      toast.error("Error", {
        description: "No se pudo cerrar la sesión"
      })
    }
  }

  const routes = [
    {
      label: "Panel",
      icon: Home,
      href: "/dashboard",
      active: pathname === "/dashboard",
    },
    {
      label: "Aventuras",
      icon: Map,
      href: "/adventures",
      active: pathname === "/adventures",
    },
    {
      label: "Personajes",
      icon: Sword,
      href: "/characters",
      active: pathname === "/characters",
    },
    {
      label: "Juego",
      icon: ShieldPlus,
      href: "/game",
      active: pathname === "/game",
    },
    {
      label: "Configuración",
      icon: Settings,
      href: "/settings",
      active: pathname === "/settings",
    },
  ]

  // Función para obtener las iniciales del usuario
  const getUserInitials = (username: string): string => {
    return username
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

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
              Pathbuilder
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
          
          {/* Sección del usuario */}
          <div className="p-4 border-t border-border">
            {isLoading ? (
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-muted animate-pulse"></div>
                <div className="ml-3">
                  <div className="h-4 bg-muted rounded animate-pulse mb-1"></div>
                  <div className="h-3 bg-muted rounded animate-pulse w-20"></div>
                </div>
              </div>
            ) : user ? (
              <div className="space-y-2">
                <div className="flex items-center">
                  {user.avatar_url ? (
                    <Image 
                      src={user.avatar_url} 
                      alt={user.username || "Usuario"} 
                      width={40}
                      height={40}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-medium">
                      {getUserInitials(user.username || "U")}
                    </div>
                  )}
                  <div className="ml-3 flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">
                      {user.username || "Usuario"}
                    </p>
                    <p className="text-xs text-muted-foreground truncate">
                      {user.email}
                    </p>
                  </div>
                </div>
                
                {/* Botón de cerrar sesión */}
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="w-full justify-start text-muted-foreground hover:text-foreground"
                  onClick={handleSignOut}
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Cerrar Sesión
                </Button>
              </div>
            ) : (
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                  <User className="h-5 w-5 text-muted-foreground" />
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium">No autenticado</p>
                  <p className="text-xs text-muted-foreground">Inicia sesión</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  )
}
