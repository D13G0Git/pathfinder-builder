"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useAuthGuard } from "@/hooks/useAuthGuard"
import { AuthLoading } from "@/components/auth-loading"
import { supabase } from "@/lib/supabase"
import { toast } from "sonner"
import { Gamepad2, Sword, Users, Star, TrendingUp, Loader2 } from "lucide-react"

interface Character {
  id: string
  name: string
  class: string
  race: string
  level: number
  avatar: string | null
}

interface Adventure {
  id: string
  name: string
  status: 'in_progress' | 'completed'
  current_stage: number
  total_stages: number
}

export default function DashboardPage() {
  const { user, isLoading: authLoading } = useAuthGuard()
  const [characters, setCharacters] = useState<Character[]>([])
  const [adventures, setAdventures] = useState<Adventure[]>([])
  const [dataLoading, setDataLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    // Si el usuario no está autenticado y no está cargando, redirigir
    if (!authLoading && !user) {
      console.log("🚪 [Dashboard] Usuario no autenticado, redirigiendo al login")
      router.push("/login")
      return
    }

    // Si hay usuario, cargar los datos
    if (user && !authLoading) {
      loadDashboardData()
    }
  }, [user, authLoading, router])

  // Hook adicional para verificar autenticación de forma más agresiva
  useEffect(() => {
    const checkAuth = async () => {
      if (!authLoading && !user) {
        console.log("🚪 [Dashboard] Verificación adicional: usuario no autenticado")
        router.replace("/login")
      }
    }

    const timeoutId = setTimeout(checkAuth, 100)
    return () => clearTimeout(timeoutId)
  }, [authLoading, user, router])

  const loadDashboardData = async () => {
    if (!user) return

    try {
      setDataLoading(true)

      // Cargar personajes del usuario
      const { data: charactersData, error: charactersError } = await supabase
        .from('characters')
        .select('id, name, class, race, level, avatar')
        .eq('user_id', user.id)
        .limit(3)
        .returns<Character[]>()

      if (charactersError) {
        console.error("Error cargando personajes:", charactersError)
        toast.error("Error cargando personajes")
      } else {
        setCharacters(charactersData || [])
      }

      // Cargar aventuras del usuario
      const { data: adventuresData, error: adventuresError } = await supabase
        .from('adventures')
        .select('id, name, status, current_stage, total_stages')
        .eq('user_id', user.id)
        .limit(3)
        .returns<Adventure[]>()

      if (adventuresError) {
        console.error("Error cargando aventuras:", adventuresError)
        toast.error("Error cargando aventuras")
      } else {
        setAdventures(adventuresData || [])
      }

    } catch (error) {
      console.error("Error en dashboard:", error)
      toast.error("Error cargando el dashboard")
    } finally {
      setDataLoading(false)
    }
  }

  // Mostrar loading mientras se autentica o se cargan los datos
  if (authLoading) {
    return <AuthLoading message="Verificando autenticación..." />
  }

  if (dataLoading && user) {
    return <AuthLoading message="Cargando tu dashboard..." />
  }

  // Si no hay usuario después de cargar, no mostrar nada (se redirigirá)
  if (!user) {
    return <AuthLoading message="Redirigiendo al login..." />
  }

  return (
    <main className="container mx-auto p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">
          ¡Bienvenido, {user?.email?.split('@')[0]}!
        </h1>
        <p className="text-muted-foreground mt-2">
          Tu portal para aventuras épicas en el mundo de Pathfinder
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Personajes</CardTitle>
            <Sword className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{characters.length}</div>
            <p className="text-xs text-muted-foreground">
              {characters.length === 0 ? "Crea tu primer personaje" : "Héroes creados"}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Aventuras</CardTitle>
            <Gamepad2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{adventures.length}</div>
            <p className="text-xs text-muted-foreground">
              {adventures.filter(a => a.status === 'in_progress').length} en progreso
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Nivel Promedio</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {characters.length > 0 
                ? Math.round(characters.reduce((sum, char) => sum + char.level, 0) / characters.length)
                : 0
              }
            </div>
            <p className="text-xs text-muted-foreground">
              De tus personajes
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Personajes Recientes */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sword className="h-5 w-5" />
              Personajes Recientes
            </CardTitle>
            <CardDescription>
              Tus últimos héroes creados
            </CardDescription>
          </CardHeader>
          <CardContent>
            {characters.length === 0 ? (
              <div className="text-center py-8">
                <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground mb-4">
                  No tienes personajes aún
                </p>
                <Button onClick={() => router.push("/character-create")}>
                  Crear Primer Personaje
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {characters.map((character) => (
                  <div 
                    key={character.id}
                    className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 cursor-pointer transition-colors"
                    onClick={() => router.push(`/characters/${character.id}`)}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                        {character.avatar ? (
                          <img 
                            src={character.avatar} 
                            alt={character.name}
                            className="w-10 h-10 rounded-full object-cover"
                          />
                        ) : (
                          <Sword className="h-5 w-5 text-muted-foreground" />
                        )}
                      </div>
                      <div>
                        <p className="font-medium">{character.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {character.race} {character.class} - Nivel {character.level}
                        </p>
                      </div>
                    </div>
                    <Badge variant="outline">Nivel {character.level}</Badge>
                  </div>
                ))}
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => router.push("/characters")}
                >
                  Ver Todos los Personajes
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Aventuras Activas */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Gamepad2 className="h-5 w-5" />
              Aventuras Activas
            </CardTitle>
            <CardDescription>
              Tus historias en progreso
            </CardDescription>
          </CardHeader>
          <CardContent>
            {adventures.length === 0 ? (
              <div className="text-center py-8">
                <Star className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground mb-4">
                  No tienes aventuras activas
                </p>
                <Button 
                  onClick={() => router.push("/adventures")}
                  disabled={characters.length === 0}
                >
                  {characters.length === 0 ? "Necesitas un personaje primero" : "Comenzar Aventura"}
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {adventures.map((adventure) => (
                  <div 
                    key={adventure.id}
                    className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 cursor-pointer transition-colors"
                    onClick={() => router.push(`/game?adventure=${adventure.id}`)}
                  >
                    <div>
                      <p className="font-medium">{adventure.name}</p>
                      <p className="text-sm text-muted-foreground">
                        Etapa {adventure.current_stage} de {adventure.total_stages}
                      </p>
                    </div>
                    <Badge 
                      variant={adventure.status === 'completed' ? 'default' : 'secondary'}
                    >
                      {adventure.status === 'completed' ? 'Completada' : 'En Progreso'}
                    </Badge>
                  </div>
                ))}
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => router.push("/adventures")}
                >
                  Ver Todas las Aventuras
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Acciones Rápidas</CardTitle>
          <CardDescription>
            Accesos directos a las funciones principales
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button 
              onClick={() => router.push("/character-create")}
              className="h-24 flex flex-col gap-2"
            >
              <Sword className="h-6 w-6" />
              <span>Crear Personaje</span>
            </Button>
            
            <Button 
              variant="outline"
              onClick={() => router.push("/characters")}
              className="h-24 flex flex-col gap-2"
              disabled={characters.length === 0}
            >
              <Users className="h-6 w-6" />
              <span>Mis Personajes</span>
            </Button>
            
            <Button 
              variant="outline"
              onClick={() => router.push("/adventures")}
              className="h-24 flex flex-col gap-2"
              disabled={characters.length === 0}
            >
              <Gamepad2 className="h-6 w-6" />
              <span>Aventuras</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </main>
  )
}
