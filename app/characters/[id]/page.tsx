"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  ArrowLeft, 
  Sword, 
  Shield, 
  Wand2, 
  Heart, 
  User,
  Star,
  Package,
  Scroll,
  Crown,
  MapPin,
  Gamepad2,
  Trash2,
  Loader2
} from "lucide-react"
import { supabase } from "@/lib/supabase"
import { toast } from "sonner"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import Image from "next/image"

interface Character {
  id: string
  user_id: string
  name: string
  class: string
  level: number
  race: string
  avatar: string | null
  character_data: any
  created_at: string
  gender: string
}

interface Adventure {
  id: string
  name: string
  description: string
  character_id: string
  status: string
  created_at: string
}

export default function CharacterDetailsPage() {
  const [character, setCharacter] = useState<Character | null>(null)
  const [adventures, setAdventures] = useState<Adventure[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isDeletingAdventure, setIsDeletingAdventure] = useState<string | null>(null)
  const [user, setUser] = useState<any>(null)
  const router = useRouter()
  const params = useParams()
  const characterId = params.id as string

  useEffect(() => {
    const loadCharacterData = async () => {
      try {
        // Verificar autenticación
        const { data: userData, error: userError } = await supabase.auth.getUser()
        
        if (userError) throw userError
        
        if (!userData?.user) {
          router.push("/login")
          return
        }

        setUser(userData.user)

        // Cargar datos del personaje
        const { data: characterData, error: characterError } = await supabase
          .from('characters')
          .select('*')
          .eq('id', characterId)
          .eq('user_id', userData.user.id)
          .single()

        if (characterError) {
          if (characterError.code === 'PGRST116') {
            toast.error("Personaje no encontrado")
            router.push("/characters")
            return
          }
          throw characterError
        }

        setCharacter(characterData)

        // Por ahora simulamos las aventuras ya que no hay tabla de aventuras
        // En el futuro esto vendría de una tabla real
        const mockAdventures: Adventure[] = []
        setAdventures(mockAdventures)

      } catch (error: any) {
        console.error("Error al cargar datos del personaje:", error)
        toast.error("Error", {
          description: "No se pudieron cargar los datos del personaje"
        })
      } finally {
        setIsLoading(false)
      }
    }

    if (characterId) {
      loadCharacterData()
    }
  }, [characterId, router])

  const handleDeleteAdventure = async (adventureId: string) => {
    setIsDeletingAdventure(adventureId)
    
    try {
      // Simular borrado de aventura
      // En el futuro esto sería una llamada real a la BD
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      setAdventures(prev => prev.filter(a => a.id !== adventureId))
      
      toast.success("Aventura eliminada", {
        description: "La aventura ha sido eliminada exitosamente."
      })
    } catch (error: any) {
      toast.error("Error", {
        description: "No se pudo eliminar la aventura"
      })
    } finally {
      setIsDeletingAdventure(null)
    }
  }

  const renderCharacterStats = (characterData: any) => {
    if (!characterData?.build) return null

    const build = characterData.build
    const abilities = build.abilities || {}
    const attributes = build.attributes || {}
    const proficiencies = build.proficiencies || {}

    return (
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Información Básica */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Información Básica
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Nivel:</span>
              <span className="font-medium">{build.level || 1}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Raza:</span>
              <span className="font-medium">{build.ancestry || 'No definida'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Herencia:</span>
              <span className="font-medium">{build.heritage || 'No definida'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Trasfondo:</span>
              <span className="font-medium">{build.background || 'No definido'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Alineación:</span>
              <span className="font-medium">{build.alignment || 'No definida'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Deidad:</span>
              <span className="font-medium">{build.deity || 'No definida'}</span>
            </div>
          </CardContent>
        </Card>

        {/* Habilidades */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Star className="h-5 w-5" />
              Habilidades
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Fuerza:</span>
              <span className="font-medium">{abilities.str || 10}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Destreza:</span>
              <span className="font-medium">{abilities.dex || 10}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Constitución:</span>
              <span className="font-medium">{abilities.con || 10}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Inteligencia:</span>
              <span className="font-medium">{abilities.int || 10}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Sabiduría:</span>
              <span className="font-medium">{abilities.wis || 10}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Carisma:</span>
              <span className="font-medium">{abilities.cha || 10}</span>
            </div>
          </CardContent>
        </Card>

        {/* Combate */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sword className="h-5 w-5" />
              Estadísticas de Combate
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Puntos de Vida:</span>
              <span className="font-medium">
                {(attributes.ancestryhp || 0) + (attributes.classhp || 0) + (attributes.bonushp || 0)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Velocidad:</span>
              <span className="font-medium">{(attributes.speed || 0) + (attributes.speedBonus || 0)} pies</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Clase de Armadura:</span>
              <span className="font-medium">{build.acTotal?.acTotal || 'No calculada'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Percepción:</span>
              <span className="font-medium">{proficiencies.perception || 0}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Fortaleza:</span>
              <span className="font-medium">{proficiencies.fortitude || 0}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Reflejos:</span>
              <span className="font-medium">{proficiencies.reflex || 0}</span>
            </div>
          </CardContent>
        </Card>

        {/* Armas */}
        {build.weapons && build.weapons.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sword className="h-5 w-5" />
                Armas
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {build.weapons.map((weapon: any, index: number) => (
                  <div key={index} className="border rounded-lg p-3">
                    <div className="font-medium">{weapon.display || weapon.name}</div>
                    <div className="text-sm text-muted-foreground">
                      Ataque: +{weapon.attack || 0} | Daño: {weapon.die} + {weapon.damageBonus || 0}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Armadura */}
        {build.armor && build.armor.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Armadura
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {build.armor.map((armor: any, index: number) => (
                  <div key={index} className="border rounded-lg p-3">
                    <div className="font-medium">{armor.display || armor.name}</div>
                    <div className="text-sm text-muted-foreground">
                      {armor.worn ? "Equipada" : "No equipada"}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Talentos */}
        {build.feats && build.feats.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Crown className="h-5 w-5" />
                Talentos
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {build.feats.map((feat: any, index: number) => (
                  <div key={index} className="flex items-center justify-between">
                    <span className="font-medium">{feat[0]}</span>
                    <Badge variant="outline" className="text-xs border-gray-300 dark:border-gray-600">
                      Nivel {feat[3] || 1}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button 
            variant="outline" 
            onClick={() => router.push("/characters")}
            className="border-gray-300 dark:border-gray-600"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver
          </Button>
          <h1 className="text-3xl font-bold tracking-tight">Cargando...</h1>
        </div>
        <div className="flex justify-center items-center h-64">
          <div className="text-lg text-muted-foreground">Cargando detalles del personaje...</div>
        </div>
      </div>
    )
  }

  if (!character) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button 
            variant="outline" 
            onClick={() => router.push("/characters")}
            className="border-gray-300 dark:border-gray-600"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver
          </Button>
          <h1 className="text-3xl font-bold tracking-tight">Personaje no encontrado</h1>
        </div>
      </div>
    )
  }

  const hasAdventureData = character.character_data && typeof character.character_data === 'object' && character.character_data.build

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button 
          variant="outline" 
          onClick={() => router.push("/characters")}
          className="border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Volver
        </Button>
        <div className="flex-1">
          <h1 className="text-3xl font-bold tracking-tight">{character.name}</h1>
          <p className="text-muted-foreground">
            {character.race} {character.class} - Nivel {character.level}
          </p>
        </div>
      </div>

      {/* Información del Personaje */}
      <Card>
        <CardHeader>
          <div className="flex items-start gap-6">
            {character.avatar && (
              <div className="relative w-24 h-24 rounded-full overflow-hidden border-4 border-gray-200 dark:border-gray-700 shadow-lg">
                <Image
                  src={character.avatar}
                  alt={character.name}
                  fill
                  className="object-cover"
                />
              </div>
            )}
            <div className="flex-1">
              <CardTitle className="text-2xl">{character.name}</CardTitle>
              <CardDescription className="text-lg mt-1">
                {character.race} {character.class}
              </CardDescription>
              <div className="flex gap-2 mt-3">
                <Badge className="bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 border-gray-300 dark:border-gray-600">
                  Nivel {character.level}
                </Badge>
                <Badge variant="outline" className="border-gray-400 dark:border-gray-500">
                  {character.gender}
                </Badge>
                <Badge variant="outline" className="border-gray-400 dark:border-gray-500">
                  Creado {new Date(character.created_at).toLocaleDateString()}
                </Badge>
              </div>
            </div>
          </div>
        </CardHeader>
      </Card>

      <Tabs defaultValue="adventure" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="adventure">Aventura</TabsTrigger>
          {hasAdventureData && <TabsTrigger value="stats">Estadísticas Completas</TabsTrigger>}
        </TabsList>

        <TabsContent value="adventure" className="space-y-6">
          {/* Aventuras */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                Estado de Aventura
              </CardTitle>
              <CardDescription>
                Gestiona las aventuras de este personaje
              </CardDescription>
            </CardHeader>
            <CardContent>
              {adventures.length === 0 ? (
                <div className="text-center py-12 space-y-4">
                  <div className="text-6xl mb-4">🗺️</div>
                  <h3 className="text-lg font-medium">Sin aventuras activas</h3>
                  <p className="text-muted-foreground max-w-md mx-auto">
                    Este personaje no está participando en ninguna aventura actualmente.
                    ¡Es el momento perfecto para comenzar una nueva historia épica!
                  </p>
                  <div className="flex gap-3 justify-center mt-6">
                    <Button 
                      onClick={() => router.push(`/game?character=${character.id}`)}
                      className="bg-gradient-to-r from-gray-700 to-gray-800 hover:from-gray-800 hover:to-gray-900 text-white"
                    >
                      <Gamepad2 className="h-4 w-4 mr-2" />
                      Comenzar Aventura
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  {adventures.map((adventure) => (
                    <Card key={adventure.id} className="border-gray-200 dark:border-gray-700">
                      <CardHeader>
                        <div className="flex justify-between items-start">
                          <div>
                            <CardTitle className="text-lg">{adventure.name}</CardTitle>
                            <CardDescription>{adventure.description}</CardDescription>
                          </div>
                          <Badge className="bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200">
                            {adventure.status}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardFooter className="flex justify-between">
                        <Button 
                          variant="outline"
                          onClick={() => router.push(`/adventures/${adventure.id}`)}
                          className="border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800"
                        >
                          Acceder a Aventura
                        </Button>
                        
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button 
                              variant="outline"
                              disabled={isDeletingAdventure === adventure.id}
                              className="border-gray-400 dark:border-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300"
                            >
                              {isDeletingAdventure === adventure.id ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                              ) : (
                                <>
                                  <Trash2 className="h-4 w-4 mr-2" />
                                  Eliminar Aventura
                                </>
                              )}
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>¿Eliminar aventura?</AlertDialogTitle>
                              <AlertDialogDescription>
                                Esta acción no se puede deshacer. Se eliminará permanentemente la aventura 
                                <strong> {adventure.name}</strong> y todo su progreso.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel className="border-gray-300 dark:border-gray-600">
                                Cancelar
                              </AlertDialogCancel>
                              <AlertDialogAction 
                                onClick={() => handleDeleteAdventure(adventure.id)}
                                className="bg-gray-600 hover:bg-gray-700 dark:bg-gray-500 dark:hover:bg-gray-400"
                              >
                                Eliminar Aventura
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {hasAdventureData && (
          <TabsContent value="stats" className="space-y-6">
            <div className="mb-6">
              <h2 className="text-2xl font-bold mb-2">Estadísticas Completas</h2>
              <p className="text-muted-foreground">
                Información detallada del personaje completado
              </p>
            </div>
            
            {renderCharacterStats(character.character_data)}
          </TabsContent>
        )}
      </Tabs>
    </div>
  )
} 