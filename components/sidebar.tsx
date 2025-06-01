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
import { useLanguage } from "@/contexts/language-context"

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
  const { t } = useLanguage()
  const [isOpen, setIsOpen] = useState(false)
  const [user, setUser] = useState<UserData | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const toggleSidebar = () => {
    setIsOpen(!isOpen)
  }

  // Cerrar sidebar al hacer clic fuera en móvil
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const sidebar = document.getElementById('mobile-sidebar')
      const button = document.getElementById('sidebar-toggle')
      
      if (isOpen && sidebar && !sidebar.contains(event.target as Node) && 
          button && !button.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
      // Prevenir scroll del body cuando el sidebar está abierto en móvil
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  // Cargar información del usuario autenticado
  useEffect(() => {
    const loadUserData = async () => {
      try {
        const { data, error } = await supabase.auth.getUser()
        
        if (error) throw error
        
        if (data?.user) {
          setUser({
            email: data.user.email || "",
            username: data.user.user_metadata?.username || data.user.email?.split('@')[0] || t('sidebar.user'),
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
      
      toast.success(t('sidebar.sessionClosed'), {
        description: t('sidebar.sessionClosedDesc')
      })
      
      // Redirigir al login
      window.location.href = "/login"
    } catch (error: any) {
      console.error("Error al cerrar sesión:", error)
      toast.error(t('sidebar.error'), {
        description: t('sidebar.couldNotSignOut')
      })
    }
  }

  const routes = [
    {
      label: t('sidebar.panel'),
      icon: Home,
      href: "/dashboard",
      active: pathname === "/dashboard",
    },
    {
      label: t('sidebar.adventures'),
      icon: Map,
      href: "/adventures",
      active: pathname === "/adventures",
    },
    {
      label: t('sidebar.characters'),
      icon: Sword,
      href: "/characters",
      active: pathname === "/characters",
    },
    {
      label: t('sidebar.game'),
      icon: ShieldPlus,
      href: "/game",
      active: pathname === "/game",
    },
    {
      label: t('sidebar.settings'),
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
      {/* Botón toggle para móvil */}
      <Button 
        id="sidebar-toggle"
        variant="ghost" 
        size="icon" 
        className="lg:hidden fixed top-4 left-4 z-50 bg-background/80 backdrop-blur-sm" 
        onClick={toggleSidebar}
      >
        {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </Button>

      {/* Overlay para móvil */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-30 lg:hidden" 
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        id="mobile-sidebar"
        className={cn(
          "fixed inset-y-0 left-0 z-40 w-64 bg-card border-r border-border transition-transform duration-300 ease-in-out lg:translate-x-0",
          isOpen ? "translate-x-0" : "-translate-x-full",
          className,
        )}
      >
        <div className="flex flex-col h-full">
          {/* Header del sidebar */}
          <div className="p-4 sm:p-6">
            <h2 className="text-xl sm:text-2xl font-bold flex items-center">
              <Shield className="mr-2 h-5 w-5 sm:h-6 sm:w-6 flex-shrink-0" />
              <span className="truncate">{t('sidebar.pathbuilder')}</span>
            </h2>
          </div>
          
          {/* Navegación */}
          <div className="flex-1 px-3 sm:px-4 space-y-1 overflow-auto">
            {routes.map((route) => (
              <Link
                key={route.href}
                href={route.href}
                className={cn(
                  "flex items-center py-2.5 sm:py-3 px-3 sm:px-4 text-sm rounded-md transition-colors",
                  route.active
                    ? "bg-primary/10 text-primary font-medium"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground",
                )}
                onClick={() => setIsOpen(false)}
              >
                <route.icon className="mr-3 h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0" />
                <span className="truncate">{route.label}</span>
              </Link>
            ))}
          </div>
          
          {/* Sección del usuario */}
          <div className="p-3 sm:p-4 border-t border-border">
            {isLoading ? (
              <div className="flex items-center">
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-muted animate-pulse flex-shrink-0"></div>
                <div className="ml-3 flex-1 min-w-0">
                  <div className="h-3 sm:h-4 bg-muted rounded animate-pulse mb-1"></div>
                  <div className="h-2 sm:h-3 bg-muted rounded animate-pulse w-16 sm:w-20"></div>
                </div>
              </div>
            ) : user ? (
              <div className="space-y-2">
                <div className="flex items-center">
                  {user.avatar_url ? (
                    <Image 
                      src={user.avatar_url} 
                      alt={user.username || "Usuario"} 
                      width={32}
                      height={32}
                      className="w-8 h-8 sm:w-10 sm:h-10 rounded-full object-cover flex-shrink-0"
                    />
                  ) : (
                    <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-medium text-xs sm:text-sm flex-shrink-0">
                      {getUserInitials(user.username || "U")}
                    </div>
                  )}
                  <div className="ml-3 flex-1 min-w-0">
                    <p className="text-xs sm:text-sm font-medium truncate">
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
                  className="w-full justify-start text-muted-foreground hover:text-foreground text-xs sm:text-sm"
                  onClick={handleSignOut}
                >
                  <LogOut className="mr-2 h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                  <span className="truncate">{t('sidebar.signOut')}</span>
                </Button>
              </div>
            ) : (
              <div className="flex items-center">
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
                  <User className="h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground" />
                </div>
                <div className="ml-3 flex-1 min-w-0">
                  <p className="text-xs sm:text-sm font-medium truncate">{t('sidebar.notAuthenticated')}</p>
                  <p className="text-xs text-muted-foreground truncate">{t('sidebar.signIn')}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  )
}
