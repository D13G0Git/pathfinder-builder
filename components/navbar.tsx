"use client"

import { Bell, MessageSquare } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useRouter } from "next/navigation"
import { useLanguage } from "@/contexts/language-context"

export function Navbar() {
  const router = useRouter()
  const { t } = useLanguage()

  const handleLogout = () => {
    router.push("/")
  }

  return (
    <div className="border-b border-border bg-card">
      <div className="flex h-14 sm:h-16 items-center px-3 sm:px-4 md:px-6">
        <div className="ml-auto flex items-center space-x-2 sm:space-x-4">
          {/* Botones de notificaciones - Solo visible en sm+ */}
          <div className="hidden sm:flex items-center space-x-2">
            <Button variant="ghost" size="icon" className="relative h-8 w-8 sm:h-9 sm:w-9">
              <Bell className="h-4 w-4 sm:h-5 sm:w-5" />
              <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-primary"></span>
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8 sm:h-9 sm:w-9">
              <MessageSquare className="h-4 w-4 sm:h-5 sm:w-5" />
            </Button>
          </div>
          
          {/* Dropdown del usuario */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-7 w-7 sm:h-8 sm:w-8 rounded-full">
                <div className="h-7 w-7 sm:h-8 sm:w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary text-xs sm:text-sm">
                  A
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-48 sm:w-56" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">{t('navbar.adventurer')}</p>
                  <p className="text-xs leading-none text-muted-foreground truncate">adventurer@example.com</p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              
              {/* Notificaciones en móvil */}
              <div className="sm:hidden">
                <DropdownMenuItem className="flex items-center">
                  <Bell className="mr-2 h-4 w-4" />
                  {t('navbar.notifications')}
                  <span className="ml-auto h-2 w-2 rounded-full bg-primary"></span>
                </DropdownMenuItem>
                <DropdownMenuItem className="flex items-center">
                  <MessageSquare className="mr-2 h-4 w-4" />
                  {t('navbar.messages')}
                </DropdownMenuItem>
                <DropdownMenuSeparator />
              </div>
              
              <DropdownMenuItem onClick={() => router.push("/profile")}>
                {t('navbar.profile')}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => router.push("/settings")}>
                {t('navbar.settings')}
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout}>
                {t('navbar.logout')}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  )
}
