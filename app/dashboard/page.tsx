"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { supabase } from "@/lib/supabase"
import { toast } from "sonner"
import { Gamepad2, Sword, Users, Star, TrendingUp } from "lucide-react"

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
  const [user, setUser] = useState<any>(null)
  const [characters, setCharacters] = useState<Character[]>([])
  const [adventures, setAdventures] = useState<Adventure[]>([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        // Verificar autenticación
        const { data: { user }, error: userError } = await supabase.auth.getUser()
        
        if (userError || !user) {
          router.push("/login")
          return
        }

        setUser(user)

        // Cargar personajes del usuario
        const { data: charactersData, error: charactersError } = await supabase
          .from('characters')
          .select('id, name, class, race, level, avatar')
          .eq('user_id', user.id)
          .limit(3)

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
        setLoading(false)
      }
    }

    loadDashboardData()
  }, [router])

  if (loading) {
    return (
      <main className="container mx-auto p-6">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-muted rounded w-64"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-48 bg-muted rounded"></div>
            ))}
          </div>
        </div>
      </main>
    )
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
                          <span className="font-medium text-primary">
                            {character.name.charAt(0).toUpperCase()}
                          </span>
                        )}
                      </div>
                      <div>
                        <p className="font-medium">{character.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {character.race} {character.class} - Nivel {character.level}
                        </p>
                      </div>
                    </div>
                    <Badge variant="secondary">Lv.{character.level}</Badge>
                  </div>
                ))}
                <div className="pt-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => router.push("/characters")}
                    className="w-full"
                  >
                    Ver Todos los Personajes
                  </Button>
                </div>
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
              Continúa donde lo dejaste
            </CardDescription>
          </CardHeader>
          <CardContent>
            {adventures.length === 0 ? (
              <div className="text-center py-8">
                <Star className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground mb-4">
                  No tienes aventuras activas
                </p>
                {characters.length > 0 ? (
                  <Button onClick={() => router.push("/game")}>
                    Iniciar Nueva Aventura
                  </Button>
                ) : (
                  <p className="text-sm text-muted-foreground">
                    Crea un personaje primero
                  </p>
                )}
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
                        Progreso: {adventure.current_stage}/{adventure.total_stages}
                      </p>
                    </div>
                    <Badge variant={adventure.status === 'completed' ? 'default' : 'secondary'}>
                      {adventure.status === 'completed' ? 'Completada' : 'En Progreso'}
                    </Badge>
                  </div>
                ))}
                <div className="pt-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => router.push("/adventures")}
                    className="w-full"
                  >
                    Ver Todas las Aventuras
                  </Button>
                </div>
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
            Accesos directos para comenzar tu aventura
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <Button 
              variant="outline" 
              onClick={() => router.push("/character-create")}
              className="h-auto p-4 flex flex-col items-center gap-2"
            >
              <Sword className="h-6 w-6" />
              <span>Crear Personaje</span>
            </Button>
            
            <Button 
              variant="outline" 
              onClick={() => router.push("/characters")}
              className="h-auto p-4 flex flex-col items-center gap-2"
            >
              <Users className="h-6 w-6" />
              <span>Mis Personajes</span>
            </Button>
            
            <Button 
              variant="outline" 
              onClick={() => router.push("/adventures")}
              className="h-auto p-4 flex flex-col items-center gap-2"
            >
              <Star className="h-6 w-6" />
              <span>Mis Aventuras</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </main>
  )
}
