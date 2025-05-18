"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { supabase } from "@/lib/supabase"
import { UserCharacter, UserDecision } from "@/lib/supabase"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/components/ui/use-toast"

interface CharacterHistoryProps {
  characterId?: string
}

export function CharacterHistory({ characterId }: CharacterHistoryProps) {
  const [user, setUser] = useState<any>(null)
  const [character, setCharacter] = useState<UserCharacter | null>(null)
  const [characters, setCharacters] = useState<UserCharacter[]>([])
  const [decisions, setDecisions] = useState<UserDecision[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  const { toast } = useToast()

  // Comprobar si el usuario está autenticado
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data, error } = await supabase.auth.getUser()
        
        if (error) throw error
        
        if (data?.user) {
          setUser(data.user)
          
          // Cargar los personajes del usuario
          const { data: charactersData, error: charactersError } = await supabase
            .from('characters')
            .select('*')
            .eq('user_id', data.user.id)
          
          if (charactersError) throw charactersError
          
          if (charactersData && charactersData.length > 0) {
            setCharacters(charactersData as UserCharacter[])
            
            // Si se proporciona un ID de personaje, cargamos ese personaje y sus decisiones
            if (characterId) {
              const selectedCharacter = charactersData.find(c => c.id === characterId)
              if (selectedCharacter) {
                setCharacter(selectedCharacter as UserCharacter)
                await loadDecisions(selectedCharacter.id)
              }
            } else if (charactersData.length > 0) {
              // Si no hay ID, cargamos el primer personaje
              setCharacter(charactersData[0] as UserCharacter)
              await loadDecisions(charactersData[0].id)
            }
          }
        } else {
          // Redirigir al login si no hay usuario autenticado
          router.push("/login")
        }
      } catch (error: any) {
        console.error("Error al cargar los datos:", error)
        toast({
          variant: "destructive",
          title: "Error",
          description: error?.message || "No se pudieron cargar los datos del personaje"
        })
        
        // En caso de error de autenticación, redirigir al login
        if (error?.status === 401 || error?.message?.includes("auth")) {
          router.push("/login")
        }
      } finally {
        setIsLoading(false)
      }
    }
    
    checkAuth()
  }, [characterId, router, toast])

  // Cargar las decisiones de un personaje
  const loadDecisions = async (charId: string) => {
    if (!charId) {
      console.warn('Se intentó cargar decisiones sin un ID de personaje válido');
      setDecisions([]);
      return;
    }
    
    try {
      const { data, error } = await supabase
        .from('decisions')
        .select('*')
        .eq('character_id', charId)
        .order('created_at', { ascending: false })
      
      if (error) throw error
      
      setDecisions(data as UserDecision[])
    } catch (error: any) {
      console.error('Error al cargar las decisiones:', error)
      toast({
        variant: "destructive",
        title: "Error",
        description: error?.message || "No se pudieron cargar las decisiones del personaje"
      })
      setDecisions([]);
    }
  }

  // Cambiar el personaje seleccionado
  const handleCharacterChange = async (charId: string) => {
    if (!charId || !characters.length) {
      console.warn('ID de personaje inválido o no hay personajes disponibles');
      return;
    }
    
    const selectedChar = characters.find(c => c.id === charId);
    if (!selectedChar) {
      console.warn(`No se encontró un personaje con ID ${charId}`);
      return;
    }
    
    setCharacter(selectedChar as UserCharacter);
    await loadDecisions(charId);
  }

  if (isLoading) {
    return <div className="flex justify-center items-center h-screen">Cargando...</div>
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-3xl font-bold mb-6">Tu aventura en Pathfinder</h1>
      
      {characters.length === 0 ? (
        <div className="text-center">
          <p className="text-xl mb-4">No tienes personajes creados</p>
          <Button onClick={() => router.push("/character-create")}>
            Crear mi primer personaje
          </Button>
        </div>
      ) : (
        <>
          <Tabs defaultValue={character?.id} onValueChange={handleCharacterChange}>
            <TabsList className="mb-6">
              {characters.map((char) => (
                <TabsTrigger key={char.id} value={char.id}>
                  {char.name}
                </TabsTrigger>
              ))}
            </TabsList>
            
            {characters.map((char) => (
              <TabsContent key={char.id} value={char.id}>
                <div className="grid md:grid-cols-3 gap-6">
                  {/* Tarjeta de personaje */}
                  <Card>
                    <CardHeader>
                      <CardTitle>{char.name}</CardTitle>
                      <CardDescription>
                        {char.race} {char.class} - Nivel {char.level}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="flex justify-center">
                      <div className="relative w-32 h-32 rounded-full overflow-hidden">
                        <Image
                          src={char.avatar || "/placeholder.svg"}
                          alt={char.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button 
                        className="w-full" 
                        onClick={() => router.push("/game?character=" + char.id)}
                      >
                        Continuar Aventura
                      </Button>
                    </CardFooter>
                  </Card>
                  
                  {/* Historial de decisiones */}
                  <Card className="md:col-span-2">
                    <CardHeader>
                      <CardTitle>Historial de Decisiones</CardTitle>
                      <CardDescription>
                        La trayectoria de tus elecciones
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      {decisions.length === 0 ? (
                        <p className="text-center py-6">
                          Este personaje aún no ha tomado decisiones.
                          <br />
                          ¡Comienza tu aventura!
                        </p>
                      ) : (
                        <div className="space-y-4">
                          {decisions.map((decision) => (
                            <div 
                              key={decision.id} 
                              className="p-4 border rounded-md"
                            >
                              <div className="flex justify-between mb-2">
                                <span className="font-medium">Escenario: {decision.scenario_id}</span>
                                <span className="text-sm text-muted-foreground">
                                  {new Date(decision.created_at).toLocaleString()}
                                </span>
                              </div>
                              <p>Elección: {decision.choice_id}</p>
                            </div>
                          ))}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </>
      )}
    </div>
  )
} 