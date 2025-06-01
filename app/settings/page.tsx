"use client"

import { useState, useEffect, useRef } from "react"
import { useTheme } from "next-themes"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Slider } from "@/components/ui/slider"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { supabase } from "@/lib/supabase"
import { toast } from "sonner"
import { Sidebar } from "@/components/sidebar"
import { Play, Pause, Music, Volume2, Globe, BookOpen, Languages, Palette } from "lucide-react"
import { useLanguage } from "@/contexts/language-context"
import { useTutorial } from "@/components/tutorial-modal"

// Lista de pistas de música ambiente disponibles
const musicTracks = [
  {
    id: "tavern",
    name: "Taberna Medieval",
    url: "/music/02. Geralt Of Rivia.mp3", 
    description: "Ambiente relajante de taberna"
  },
  {
    id: "adventure",
    name: "Música de Aventura",
    url: "/music/12. The Nightingale.mp3", 
    description: "Épica música de fondo para aventuras"
  },
  {
    id: "dungeon",
    name: "Ambiente de Mazmorra",
    url: "/music/21. The Vagabond.mp3", 
    description: "Sonidos misteriosos y sombríos"
  }
]

export default function SettingsPage() {
  const { theme, setTheme } = useTheme()
  const { language, setLanguage, t } = useLanguage()
  const { startTutorial, resetTutorial, TutorialModal } = useTutorial()
  const router = useRouter()
  const [volume, setVolume] = useState(70)
  const [mounted, setMounted] = useState(false)
  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [email, setEmail] = useState("")
  const [user, setUser] = useState<any>(null)
  const [isPasswordDialogOpen, setIsPasswordDialogOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [isChangingPassword, setIsChangingPassword] = useState(false)
  
  // Estados para la música
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTrack, setCurrentTrack] = useState(musicTracks[0]?.id || "tavern")
  const [musicEnabled, setMusicEnabled] = useState(false)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  // Cargar información del usuario autenticado
  useEffect(() => {
    const loadUserData = async () => {
      try {
        const { data, error } = await supabase.auth.getUser()
        
        if (error) throw error
        
        if (data?.user) {
          setUser(data.user)
          setEmail(data.user.email || "")
        } else {
          // Si no hay usuario autenticado, redirigir al login
          router.push("/login")
        }
      } catch (error: any) {
        console.error("Error al cargar el usuario:", error)
        toast.error("Error", {
          description: "No se pudo cargar la información del usuario"
        })
        router.push("/login")
      } finally {
        setIsLoading(false)
      }
    }

    loadUserData()
  }, [router])

  // Evitar hidration mismatch
  useEffect(() => {
    setMounted(true)
    // Cargar configuraciones desde localStorage
    const savedVolume = localStorage.getItem("app-volume")
    const savedMusicEnabled = localStorage.getItem("music-enabled")
    const savedCurrentTrack = localStorage.getItem("current-track")
    
    if (savedVolume) {
      setVolume(parseInt(savedVolume))
    }
    if (savedMusicEnabled) {
      setMusicEnabled(savedMusicEnabled === "true")
    }
    if (savedCurrentTrack) {
      setCurrentTrack(savedCurrentTrack)
    }
  }, [])

  // Efecto para controlar el volumen del audio
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume / 100
    }
  }, [volume])

  // Efecto para cambiar la pista de música
  useEffect(() => {
    if (audioRef.current && musicEnabled) {
      const selectedTrack = musicTracks.find(track => track.id === currentTrack)
      if (selectedTrack) {
        // Pausar y resetear el audio actual antes de cambiar src
        if (!audioRef.current.paused) {
          audioRef.current.pause()
        }
        audioRef.current.currentTime = 0
        
        // Cambiar la fuente
        audioRef.current.src = selectedTrack.url
        
        // Solo reproducir si debería estar reproduciéndose
        if (isPlaying) {
          // Esperar a que esté listo antes de reproducir
          audioRef.current.addEventListener('loadeddata', () => {
            audioRef.current?.play().catch((error) => {
              console.error("Error al reproducir audio:", error)
              setIsPlaying(false)
            })
          }, { once: true })
        }
      }
    }
  }, [currentTrack, musicEnabled])

  // Efecto separado para controlar play/pause sin cambiar la pista
  useEffect(() => {
    if (audioRef.current && musicEnabled) {
      if (isPlaying && audioRef.current.paused) {
        audioRef.current.play().catch((error) => {
          console.error("Error al reproducir audio:", error)
          setIsPlaying(false)
        })
      } else if (!isPlaying && !audioRef.current.paused) {
        audioRef.current.pause()
      }
    }
  }, [isPlaying, musicEnabled])

  // Efecto para configurar los event listeners del audio
  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    const handleLoadStart = () => {
      // Audio está comenzando a cargar
    }

    const handleLoadedData = () => {
      // Audio está listo para reproducirse
    }

    const handleError = (e: Event) => {
      console.error("Error de audio:", e)
      setIsPlaying(false)
    }

    const handleAbort = () => {
      // Manejo silencioso del abort - esto es normal cuando cambiamos de pista
      setIsPlaying(false)
    }

    const handleEnded = () => {
      setIsPlaying(false)
    }

    // Agregar event listeners
    audio.addEventListener('loadstart', handleLoadStart)
    audio.addEventListener('loadeddata', handleLoadedData)
    audio.addEventListener('error', handleError)
    audio.addEventListener('abort', handleAbort)
    audio.addEventListener('ended', handleEnded)

    // Cleanup
    return () => {
      audio.removeEventListener('loadstart', handleLoadStart)
      audio.removeEventListener('loadeddata', handleLoadedData)
      audio.removeEventListener('error', handleError)
      audio.removeEventListener('abort', handleAbort)
      audio.removeEventListener('ended', handleEnded)
    }
  }, [])

  const handleVolumeChange = (value: number[]) => {
    const newVolume = value[0]
    if (newVolume !== undefined) {
      setVolume(newVolume)
      localStorage.setItem("app-volume", newVolume.toString())
    }
  }

  const toggleMusic = () => {
    if (!musicEnabled) {
      toast.info("Música activada", {
        description: "La música de fondo está ahora habilitada"
      })
      setMusicEnabled(true)
      localStorage.setItem("music-enabled", "true")
      return
    }

    if (audioRef.current) {
      if (isPlaying) {
        setIsPlaying(false)
        toast.info("Música pausada")
      } else {
        setIsPlaying(true)
        toast.success("Reproduciendo música")
      }
    }
  }

  const handleTrackChange = (trackId: string) => {
    setCurrentTrack(trackId)
    localStorage.setItem("current-track", trackId)
    
    const selectedTrack = musicTracks.find(track => track.id === trackId)
    if (selectedTrack) {
      toast.info("Pista cambiada", {
        description: `Ahora reproduciendo: ${selectedTrack.name}`
      })
    }
  }

  const toggleMusicEnabled = (enabled: boolean) => {
    setMusicEnabled(enabled)
    localStorage.setItem("music-enabled", enabled.toString())
    
    if (!enabled && isPlaying) {
      audioRef.current?.pause()
      setIsPlaying(false)
      toast.info("Música desactivada")
    } else if (enabled) {
      toast.info("Música activada", {
        description: "Ahora puedes reproducir música de fondo"
      })
    }
  }

  const handlePasswordChange = async () => {
    if (newPassword !== confirmPassword) {
      toast.error("Error", {
        description: "Las contraseñas no coinciden",
      })
      return
    }

    if (newPassword.length < 8) {
      toast.error("Error", {
        description: "La contraseña debe tener al menos 8 caracteres",
      })
      return
    }

    if (!currentPassword) {
      toast.error("Error", {
        description: "Por favor ingresa tu contraseña actual",
      })
      return
    }

    setIsChangingPassword(true)

    try {
      // Verificar la contraseña actual intentando hacer signin
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: user?.email || "",
        password: currentPassword
      })

      if (signInError) {
        toast.error("Error", {
          description: "La contraseña actual es incorrecta",
        })
        return
      }

      // Actualizar la contraseña en Supabase
      const { error: updateError } = await supabase.auth.updateUser({
        password: newPassword
      })

      if (updateError) throw updateError

      toast.success("Contraseña actualizada", {
        description: "Tu contraseña ha sido cambiada exitosamente",
      })
      
      setCurrentPassword("")
      setNewPassword("")
      setConfirmPassword("")
      setIsPasswordDialogOpen(false)

    } catch (error: any) {
      console.error("Error al cambiar la contraseña:", error)
      toast.error("Error", {
        description: error.message || "No se pudo cambiar la contraseña"
      })
    } finally {
      setIsChangingPassword(false)
    }
  }

  const handleEmailChange = async () => {
    try {
      // Aquí iría la lógica real de cambio de email con Supabase
      const { error } = await supabase.auth.updateUser({
        email: email
      })

      if (error) throw error

      toast.success("Email actualizado", {
        description: "Tu dirección de email ha sido actualizada. Revisa tu correo para confirmar el cambio.",
      })
    } catch (error: any) {
      toast.error("Error", {
        description: error.message || "No se pudo actualizar el email"
      })
    }
  }

  const handleDeleteAccount = () => {
    // Aquí iría la lógica real de eliminación de cuenta
    toast.error("Cuenta eliminada", {
      description: "Tu cuenta ha sido eliminada permanentemente",
    })
  }

  const handleSaveSettings = () => {
    toast.success("Ajustes guardados", {
      description: "Tus preferencias han sido actualizadas correctamente.",
    })
  }

  const handleLanguageChange = (newLanguage: 'es' | 'en') => {
    setLanguage(newLanguage)
  }

  const handleStartTutorial = () => {
    resetTutorial()
    startTutorial()
  }

  if (!mounted || isLoading) {
    return (
      <div className="flex min-h-screen">
        <Sidebar />
        <main className="flex-1 lg:ml-64">
          <div className="container mx-auto px-4 py-6 sm:py-8 max-w-2xl">
            <div className="flex justify-center items-center h-48 sm:h-64">
              <div className="text-base sm:text-lg text-muted-foreground">Cargando...</div>
            </div>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 lg:ml-64">
        <div className="container mx-auto px-4 py-6 sm:py-8 max-w-2xl">
      <div className="mb-6 sm:mb-8 space-y-2 sm:space-y-4">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Ajustes</h1>
        <p className="text-sm sm:text-base text-muted-foreground">Personaliza tu experiencia de juego y gestiona tu cuenta.</p>
        {user && (
          <p className="text-xs sm:text-sm text-muted-foreground">
            Sesión iniciada como: <span className="font-medium">{user.email}</span>
          </p>
        )}
      </div>

      <div className="grid gap-4 sm:gap-6">
        {/* Configuraciones Principales */}
        <Card>
          <CardHeader className="p-4 sm:p-6">
            <CardTitle className="flex items-center text-base sm:text-lg">
              <span className="mr-2">⚙️</span>
              Configuración Principal
            </CardTitle>
            <CardDescription className="text-sm">Ajusta los elementos básicos de la aplicación</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 sm:space-y-6 p-4 sm:p-6">
            {/* Cambio de Tema */}
              <div className="flex items-center justify-between">
              <Label htmlFor="theme-toggle" className="flex flex-col gap-1">
                <span className="font-medium text-sm sm:text-base">Tema Oscuro</span>
                  <span className="font-normal text-xs text-muted-foreground">
                  Alterna entre modo claro y oscuro
                  </span>
                </Label>
                <Switch
                id="theme-toggle"
                checked={theme === "dark"}
                onCheckedChange={(checked) => setTheme(checked ? "dark" : "light")}
                />
              </div>

            {/* Control de Volumen */}
            <div className="space-y-2 sm:space-y-3">
              <Label htmlFor="volume" className="flex flex-col gap-1">
                <span className="font-medium text-sm sm:text-base">Volumen de la Aplicación</span>
                  <span className="font-normal text-xs text-muted-foreground">
                  Controla el volumen general de sonidos y música
                  </span>
                </Label>
              <div className="space-y-2">
                <div className="flex justify-between text-xs sm:text-sm text-muted-foreground">
                  <span>🔇 Silencio</span>
                  <span className="font-medium">{volume}%</span>
                  <span>🔊 Alto</span>
                </div>
                <Slider
                  id="volume"
                  min={0}
                  max={100}
                  step={1}
                  value={[volume]}
                  onValueChange={handleVolumeChange}
                  className="w-full"
                />
              </div>
            </div>

            {/* Control de Música */}
            <div className="space-y-2 sm:space-y-3">
              <Label className="flex flex-col gap-1">
                <span className="font-medium flex items-center gap-2 text-sm sm:text-base">
                  <Music className="h-3 w-3 sm:h-4 sm:w-4" />
                  Música de Fondo
                </span>
                <span className="font-normal text-xs text-muted-foreground">
                  Reproduce música ambiente mientras usas la aplicación
                </span>
              </Label>
              
              {/* Switch para habilitar música */}
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <span className="text-sm font-medium">Habilitar Música</span>
                  <p className="text-xs text-muted-foreground">Activa la reproducción de música de fondo</p>
                </div>
                <Switch
                  checked={musicEnabled}
                  onCheckedChange={toggleMusicEnabled}
                />
              </div>

              {/* Controles de música */}
              {musicEnabled && (
                <div className="space-y-3 sm:space-y-4 pt-2 border-t">
                  {/* Selector de pista */}
                  <div className="space-y-2">
                    <Label htmlFor="track-select" className="text-sm font-medium">
                      Seleccionar Pista
                    </Label>
                    <Select value={currentTrack} onValueChange={handleTrackChange}>
                      <SelectTrigger>
                        <SelectValue placeholder="Elige una pista de música" />
                      </SelectTrigger>
                      <SelectContent>
                        {musicTracks.map((track) => (
                          <SelectItem key={track.id} value={track.id}>
                            <div className="flex flex-col">
                              <span className="font-medium text-sm">{track.name}</span>
                              <span className="text-xs text-muted-foreground">{track.description}</span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Controles de reproducción */}
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-3">
                    <Button
                      onClick={toggleMusic}
                      variant="outline"
                      size="sm"
                      className="flex items-center gap-2 w-full sm:w-auto text-xs sm:text-sm"
                    >
                      {isPlaying ? (
                        <>
                          <Pause className="h-3 w-3 sm:h-4 sm:w-4" />
                          Pausar
                        </>
                      ) : (
                        <>
                          <Play className="h-3 w-3 sm:h-4 sm:w-4" />
                          Reproducir
                        </>
                      )}
                    </Button>
                    
                    <div className="flex items-center gap-2 flex-1">
                      <Volume2 className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
                      <span className="text-xs sm:text-sm text-muted-foreground">Volumen: {volume}%</span>
                    </div>
                  </div>

                  {/* Estado actual */}
                  <div className="text-xs text-muted-foreground p-2 bg-muted/50 rounded">
                    {isPlaying ? (
                      <span className="flex items-center gap-1">
                        <div className="w-2 h-2 bg-gray-600 rounded-full animate-pulse"></div>
                        Reproduciendo: {musicTracks.find(t => t.id === currentTrack)?.name}
                      </span>
                    ) : (
                      <span className="flex items-center gap-1">
                        <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                        Música en pausa
                      </span>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Selector de Idioma */}
            <div className="space-y-2 sm:space-y-3">
              <Label className="flex flex-col gap-1">
                <span className="font-medium flex items-center gap-2 text-sm sm:text-base">
                  <Languages className="h-3 w-3 sm:h-4 sm:w-4" />
                  {t('settings.language')}
                </span>
                <span className="font-normal text-xs text-muted-foreground">
                  {t('settings.language.description')}
                </span>
              </Label>
              
              <div className="space-y-2">
                <Select value={language} onValueChange={handleLanguageChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona un idioma" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="es">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">🇪🇸</span>
                        <span>{t('language.spanish')}</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="en">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">🇺🇸</span>
                        <span>{t('language.english')}</span>
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
                
                <p className="text-xs text-muted-foreground">
                  {language === 'es' 
                    ? 'Los cambios se aplicarán inmediatamente'
                    : 'Changes will be applied immediately'
                  }
                </p>
              </div>
            </div>

            {/* Tutorial Interactivo */}
            <div className="space-y-2 sm:space-y-3">
              <Label className="flex flex-col gap-1">
                <span className="font-medium flex items-center gap-2 text-sm sm:text-base">
                  <BookOpen className="h-3 w-3 sm:h-4 sm:w-4" />
                  {t('settings.tutorial')}
                </span>
                <span className="font-normal text-xs text-muted-foreground">
                  {t('settings.tutorial.description')}
                </span>
              </Label>
              
              <div className="space-y-2 sm:space-y-3">
                <Button 
                  onClick={handleStartTutorial}
                  variant="outline" 
                  className="w-full justify-start gap-2 text-xs sm:text-sm"
                >
                  <BookOpen className="h-3 w-3 sm:h-4 sm:w-4" />
                  {t('settings.tutorial.start')}
                </Button>
                
                <div className="text-xs text-muted-foreground p-3 bg-muted/50 rounded-lg">
                  <div className="flex items-start gap-2">
                    <span className="text-blue-500">💡</span>
                    <div>
                      <p className="font-medium mb-1">
                        {language === 'es' 
                          ? 'Recomendado para nuevos usuarios' 
                          : 'Recommended for new users'
                        }
                      </p>
                      <p>
                        {language === 'es'
                          ? 'El tutorial te guiará a través de las funcionalidades principales de la aplicación en unos pocos minutos.'
                          : 'The tutorial will guide you through the main features of the application in just a few minutes.'
                        }
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Información de Cuenta */}
        <Card>
          <CardHeader className="p-4 sm:p-6">
            <CardTitle className="flex items-center text-base sm:text-lg">
              <span className="mr-2">👤</span>
              Información de Cuenta
            </CardTitle>
            <CardDescription className="text-sm">Gestiona tu cuenta y seguridad</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 sm:space-y-6 p-4 sm:p-6">
            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm sm:text-base">Dirección de Email</Label>
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="flex-1 text-sm sm:text-base"
                  placeholder="tu@email.com"
                />
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={handleEmailChange}
                  disabled={!email || email === user?.email}
                  className="w-full sm:w-auto text-xs sm:text-sm"
                >
                  Cambiar
                </Button>
              </div>
              {email && email !== user?.email && (
                <p className="text-xs text-muted-foreground">
                  El cambio de email requiere confirmación por correo electrónico.
                </p>
              )}
            </div>

            {/* Contraseña */}
            <div className="space-y-2">
              <Label className="text-sm sm:text-base">Contraseña</Label>
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                <div className="flex-1 text-sm text-muted-foreground">••••••••••••</div>
                <Dialog open={isPasswordDialogOpen} onOpenChange={setIsPasswordDialogOpen}>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm" className="w-full sm:w-auto text-xs sm:text-sm">
                      Cambiar
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Cambiar Contraseña</DialogTitle>
                      <DialogDescription>
                        Ingresa tu contraseña actual y la nueva contraseña.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="current-password">Contraseña Actual</Label>
                        <Input
                          id="current-password"
                          type="password"
                          value={currentPassword}
                          onChange={(e) => setCurrentPassword(e.target.value)}
                          disabled={isChangingPassword}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="new-password">Nueva Contraseña</Label>
                        <Input
                          id="new-password"
                          type="password"
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          disabled={isChangingPassword}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="confirm-password">Confirmar Nueva Contraseña</Label>
                        <Input
                          id="confirm-password"
                          type="password"
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          disabled={isChangingPassword}
                        />
                      </div>
                      <div className="flex justify-end gap-2">
                        <Button 
                          variant="outline" 
                          onClick={() => setIsPasswordDialogOpen(false)}
                          disabled={isChangingPassword}
                        >
                          Cancelar
                        </Button>
                        <Button 
                          onClick={handlePasswordChange}
                          disabled={isChangingPassword}
                        >
                          {isChangingPassword ? "Actualizando..." : "Actualizar Contraseña"}
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </div>

            {/* Usuario */}
            <div className="space-y-2">
              <Label>Nombre de Usuario</Label>
              <div className="flex items-center gap-2">
                <div className="flex-1 text-sm text-muted-foreground">
                  {user?.user_metadata?.username || user?.email?.split('@')[0] || "Usuario"}
                </div>
                <Button variant="outline" size="sm" disabled>
                  <span className="mr-1">🔒</span>
                  Bloqueado
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">
                El nombre de usuario no se puede cambiar una vez establecido.
              </p>
            </div>

            {/* Zona Peligrosa */}
            <div className="pt-4 border-t">
              <div className="space-y-3">
                <h4 className="text-sm font-medium text-destructive">Zona Peligrosa</h4>
                <p className="text-xs text-muted-foreground">
                  Estas acciones son permanentes e irreversibles.
                </p>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="destructive" size="sm">
                      <span className="mr-1">⚠️</span>
                      Eliminar Cuenta
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>¿Estás seguro?</DialogTitle>
                      <DialogDescription>
                        Esta acción eliminará permanentemente tu cuenta y todos tus personajes.
                        Esta acción no se puede deshacer.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="flex justify-end gap-2">
                      <Button variant="outline">
                        Cancelar
                      </Button>
                      <Button variant="destructive" onClick={handleDeleteAccount}>
                        Sí, Eliminar Cuenta
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Próximamente */}
        <Card className="border-dashed border-2">
          <CardHeader>
            <CardTitle className="flex items-center text-muted-foreground">
              <span className="mr-2">🚧</span>
              Próximamente
            </CardTitle>
            <CardDescription>Más opciones de personalización en desarrollo</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-3">
              <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                <div className="text-lg">🎨</div>
                <div>
                  <div className="font-medium text-sm">Temas Personalizados</div>
                  <div className="text-xs text-muted-foreground">Elige entre diferentes paletas de colores</div>
                </div>
              </div>
              
              <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                <div className="text-lg">🔤</div>
                <div>
                  <div className="font-medium text-sm">Tamaño de Fuente</div>
                  <div className="text-xs text-muted-foreground">Ajusta el tamaño del texto para mejor legibilidad</div>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                <div className="text-lg">🎮</div>
                <div>
                  <div className="font-medium text-sm">Configuración de Juego</div>
                  <div className="text-xs text-muted-foreground">Dificultad, efectos especiales y más</div>
                </div>
              </div>
            </div>

            <div className="pt-2 text-center">
              <p className="text-sm text-muted-foreground">
                Estamos trabajando constantemente para mejorar tu experiencia.
                <br />
                ¡Mantente atento a las actualizaciones!
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Botón de Guardar */}
        <div className="flex justify-end">
          <Button 
            onClick={handleSaveSettings}
            className="bg-gradient-to-r from-gray-900 to-black hover:from-gray-800 hover:to-gray-900 dark:from-gray-100 dark:to-white dark:hover:from-gray-200 dark:hover:to-gray-100 text-white dark:text-black"
          >
            <span className="mr-2">💾</span>
            Guardar Ajustes
          </Button>
        </div>
      </div>
        </div>
        </main>

        {/* Modal del Tutorial */}
        <TutorialModal />

        {/* Elemento de audio oculto para reproducir música */}
        {musicEnabled && (
          <audio
            ref={audioRef}
            loop
            preload="metadata"
            onLoadedData={() => {
              if (audioRef.current) {
                audioRef.current.volume = volume / 100
              }
            }}
            onError={(error) => {
              console.error("Error al cargar audio:", error)
              setIsPlaying(false)
              toast.error("Error de audio", {
                description: "No se pudo cargar la pista de música seleccionada"
              })
            }}
            onAbort={() => {
              // Manejo silencioso del abort - esto es normal cuando cambiamos de pista
              // No mostrar error al usuario
            }}
          />
        )}
      </div>
    )
  }
