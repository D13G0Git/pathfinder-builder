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
import { Loader2, Trash2 } from "lucide-react"

interface CharacterHistoryProps {
  characterId?: string
}

export function CharacterHistory({ characterId }: CharacterHistoryProps) {
  const [user, setUser] = useState<any>(null)
  const [character, setCharacter] = useState<UserCharacter | null>(null)
  const [characters, setCharacters] = useState<UserCharacter[]>([])
  const [decisions, setDecisions] = useState<UserDecision[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [deletingCharacterId, setDeletingCharacterId] = useState<string | null>(null)
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

  // Función para extraer el path del storage desde la URL del avatar
  const getStoragePathFromUrl = (avatarUrl: string): string | null => {
    try {
      // La URL del Storage de Supabase tiene formato:
      // https://[proyecto].supabase.co/storage/v1/object/public/character-avatars/avatars/filename.png
      const url = new URL(avatarUrl);
      const pathParts = url.pathname.split('/');
      const bucketIndex = pathParts.findIndex(part => part === 'character-avatars');
      
      if (bucketIndex !== -1 && bucketIndex < pathParts.length - 1) {
        // Obtener todo después del nombre del bucket
        return pathParts.slice(bucketIndex + 1).join('/');
      }
      
      return null;
    } catch (error) {
      console.error('Error al extraer path del storage:', error);
      return null;
    }
  };

  // Función para borrar personaje
  const handleDeleteCharacter = async (characterToDelete: UserCharacter) => {
    if (!user || !characterToDelete) return;

    setDeletingCharacterId(characterToDelete.id);

    try {
      // 1. Borrar imagen del Storage si existe
      if (characterToDelete.avatar) {
        const storagePath = getStoragePathFromUrl(characterToDelete.avatar);
        
        if (storagePath) {
          const { error: storageError } = await supabase.storage
            .from('character-avatars')
            .remove([storagePath]);
          
          if (storageError) {
            console.warn('Error al borrar imagen del storage:', storageError);
            // No lanzamos error aquí para no interrumpir el borrado del registro
          }
        }
      }

      // 2. Borrar decisiones relacionadas al personaje (cascade)
      const { error: decisionsError } = await supabase
        .from('decisions')
        .delete()
        .eq('character_id', characterToDelete.id);

      if (decisionsError) {
        console.warn('Error al borrar decisiones:', decisionsError);
        // Continuamos aunque falle el borrado de decisiones
      }

      // 3. Borrar el registro del personaje de la base de datos
      const { error: deleteError } = await supabase
        .from('characters')
        .delete()
        .eq('id', characterToDelete.id)
        .eq('user_id', user.id); // Seguridad adicional

      if (deleteError) throw deleteError;

      // 4. Actualizar el estado local
      const updatedCharacters = characters.filter(c => c.id !== characterToDelete.id);
      setCharacters(updatedCharacters);

      // 5. Si el personaje borrado era el actualmente seleccionado, cambiar la selección
      if (character?.id === characterToDelete.id) {
        if (updatedCharacters.length > 0) {
          setCharacter(updatedCharacters[0]);
          await loadDecisions(updatedCharacters[0].id);
        } else {
          setCharacter(null);
          setDecisions([]);
        }
      }

      toast({
        title: "Personaje eliminado",
        description: `${characterToDelete.name} ha sido eliminado exitosamente.`,
      });

    } catch (error: any) {
      console.error("Error al borrar el personaje:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "No se pudo eliminar el personaje. " + (error.message || error),
      });
    } finally {
      setDeletingCharacterId(null);
    }
  };

  if (isLoading) {
    return <div className="flex justify-center items-center h-screen">Cargando...</div>
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      
      {characters.length === 0 ? (
        <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-8">
          {/* Hero Section */}
          <div className="text-center space-y-6 max-w-2xl">
            <div className="relative">
              <div className="text-8xl mb-4">⚔️</div>
            </div>
            
            <h2 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-black dark:from-gray-100 dark:to-white bg-clip-text text-transparent mb-4">
              ¡Bienvenido, Aventurero!
            </h2>
            
            <p className="text-xl text-muted-foreground leading-relaxed">
              Tu épica aventura en el mundo de Pathfinder está a punto de comenzar. 
              Crea tu primer personaje y sumérgete en un mundo lleno de magia, 
              peligros y decisiones que darán forma a tu destino.
            </p>
          </div>

          {/* Feature Cards */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 w-full max-w-5xl">
            <Card className="border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow">
              <CardContent className="p-6 text-center">
                <div className="text-4xl mb-4">🎭</div>
                <h3 className="font-semibold mb-2">Crea tu Personaje</h3>
                <p className="text-sm text-muted-foreground">
                  Elige tu raza, clase y personaliza cada aspecto de tu héroe
                </p>
              </CardContent>
            </Card>
            
            <Card className="border-gray-300 dark:border-gray-600 hover:shadow-lg transition-shadow">
              <CardContent className="p-6 text-center">
                <div className="text-4xl mb-4">🗺️</div>
                <h3 className="font-semibold mb-2">Explora Mundos</h3>
                <p className="text-sm text-muted-foreground">
                  Descubre paisajes místicos y ciudades llenas de secretos
                </p>
              </CardContent>
            </Card>
            
            <Card className="border-gray-400 dark:border-gray-500 hover:shadow-lg transition-shadow">
              <CardContent className="p-6 text-center">
                <div className="text-4xl mb-4">⚡</div>
                <h3 className="font-semibold mb-2">Toma Decisiones</h3>
                <p className="text-sm text-muted-foreground">
                  Cada elección influye en tu historia y destino
                </p>
              </CardContent>
            </Card>

            <Card className="border-gray-500 dark:border-gray-400 hover:shadow-lg transition-shadow">
              <CardContent className="p-6 text-center">
                <div className="text-4xl mb-4">🎲</div>
                <h3 className="font-semibold mb-2">Exporta a Foundry VTT</h3>
                <p className="text-sm text-muted-foreground">
                  Lleva tu personaje al entorno virtual de juego de rol más popular
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Call to Action */}
          <div className="space-y-4 text-center">
            <Button 
              size="lg" 
              className="px-8 py-6 text-lg bg-gradient-to-r from-gray-900 to-black hover:from-gray-800 hover:to-gray-900 dark:from-gray-100 dark:to-white dark:hover:from-gray-200 dark:hover:to-gray-100 text-white dark:text-black shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 border border-gray-700 dark:border-gray-300"
              onClick={() => router.push("/character-create")}
            >
              <span className="mr-2">✨</span>
              Crear mi Primer Personaje
              <span className="ml-2">⚔️</span>
            </Button>
            
            <p className="text-sm text-muted-foreground">
              ¡La aventura te espera! Comienza tu legendaria historia ahora.
            </p>
          </div>
        </div>
      ) : (
        <>
          <div className="mb-8 text-center">
            <p className="text-lg text-muted-foreground">
              Bienvenido de vuelta, aventurero. Selecciona tu personaje y continúa tu épica historia.
            </p>
          </div>
          
          <Tabs defaultValue={character?.id} onValueChange={handleCharacterChange}>
            <TabsList className="mb-6 grid w-full h-full" style={{ gridTemplateColumns: `repeat(${characters.length}, 1fr)` }}>
              {characters.map((char) => (
                <TabsTrigger key={char.id} value={char.id} className="flex flex-col p-3">
                  <span className="font-medium">{char.name}</span>
                  <span className="text-xs text-muted-foreground">Nivel {char.level}</span>
                </TabsTrigger>
              ))}
            </TabsList>
            
            {characters.map((char) => (
              <TabsContent key={char.id} value={char.id}>
                <div className="grid md:grid-cols-3 gap-1">
                  {/* Tarjeta de personaje mejorada */}
                  <Card className="hover:shadow-lg transition-shadow">
                    <CardHeader className="text-center">
                      <CardTitle className="text-xl">{char.name}</CardTitle>
                      <CardDescription className="text-base">
                        {char.race} {char.class}
                      </CardDescription>
                      <div className="inline-flex items-center px-3 py-1 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 text-sm font-medium">
                        Nivel {char.level}
                      </div>
                    </CardHeader>
                    <CardContent className="flex justify-center">
                      <div className="relative w-40 h-40 rounded-full overflow-hidden border-4 border-gray-200 dark:border-gray-700 shadow-lg">
                        <Image
                          src={char.avatar || "/placeholder.svg"}
                          alt={char.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                    </CardContent>
                    <CardFooter className="flex flex-col space-y-2">
                      <Button 
                        className="w-full bg-gradient-to-r from-gray-700 to-gray-800 hover:from-gray-800 hover:to-gray-900 text-white" 
                        onClick={() => router.push("/game?character=" + char.id)}
                      >
                        <span className="mr-2">🎮</span>
                        Continuar Aventura
                      </Button>
                      
                      <div className="grid grid-cols-2 gap-2 w-full">
                        <Button 
                          variant="outline" 
                          size="sm"
                          className="border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800"
                          onClick={() => router.push("/character-create")}
                        >
                          <span className="mr-1">➕</span>
                          Nuevo
                        </Button>
                        
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button 
                              variant="outline" 
                              size="sm"
                              className="border-gray-400 dark:border-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300"
                              disabled={deletingCharacterId === char.id}
                            >
                              {deletingCharacterId === char.id ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                              ) : (
                                <>
                                  <Trash2 className="h-4 w-4 mr-1" />
                                  Borrar
                                </>
                              )}
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
                              <AlertDialogDescription>
                                Esta acción no se puede deshacer. Se eliminará permanentemente el personaje 
                                <strong> {char.name}</strong>, incluyendo su imagen y todo su historial de decisiones.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel className="border-gray-300 dark:border-gray-600">
                                Cancelar
                              </AlertDialogCancel>
                              <AlertDialogAction 
                                onClick={() => handleDeleteCharacter(char)}
                                className="bg-gray-600 hover:bg-gray-700 dark:bg-gray-500 dark:hover:bg-gray-400"
                              >
                                Eliminar Personaje
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </CardFooter>
                  </Card>
                  
                  {/* Historial de decisiones mejorado */}
                  <Card className="md:col-span-2 hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <span className="mr-2">📜</span>
                        Historial de Decisiones
                      </CardTitle>
                      <CardDescription>
                        La crónica de tus elecciones y aventuras
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      {decisions.length === 0 ? (
                        <div className="text-center py-12 space-y-4">
                          <div className="text-6xl mb-4">🗺️</div>
                          <p className="text-lg font-medium">
                            Tu historia está por escribirse
                          </p>
                          <p className="text-muted-foreground">
                            Este personaje aún no ha tomado decisiones importantes.
                            <br />
                            ¡Comienza tu aventura y crea recuerdos épicos!
                          </p>
                          <Button 
                            className="mt-4 bg-gradient-to-r from-gray-700 to-gray-800 hover:from-gray-800 hover:to-gray-900 text-white"
                            onClick={() => router.push("/game?character=" + char.id)}
                          >
                            <span className="mr-2">🚀</span>
                            Comenzar Aventura
                          </Button>
                        </div>
                      ) : (
                        <div className="space-y-4 max-h-96 overflow-y-auto">
                          {decisions.map((decision, index) => (
                            <div 
                              key={decision.id} 
                              className="p-4 border rounded-lg bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 hover:shadow-md transition-shadow"
                            >
                              <div className="flex justify-between items-start mb-2">
                                <div className="flex items-center">
                                  <span className="bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 px-2 py-1 rounded-full text-xs font-medium mr-3">
                                    #{decisions.length - index}
                                  </span>
                                  <span className="font-medium">Escenario: {decision.scenario_id}</span>
                                </div>
                                <span className="text-sm text-muted-foreground">
                                  {new Date(decision.created_at).toLocaleString()}
                                </span>
                              </div>
                              <p className="text-sm">
                                <span className="font-medium text-gray-600 dark:text-gray-400">Elección:</span> {decision.choice_id}
                              </p>
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