"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Plus, Loader2, Trash2, Download } from "lucide-react"
import { supabase } from "@/lib/supabase"
import { toast } from "sonner"
import { Sidebar } from "@/components/sidebar"
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
  status: 'in_progress' | 'completed'
  created_at: string
  completed_at: string | null
  result_data: any
  current_stage: number
  total_stages: number
}

export default function CharactersPage() {
  const [characters, setCharacters] = useState<Character[]>([])
  const [adventures, setAdventures] = useState<Adventure[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [user, setUser] = useState<any>(null)
  const [deletingCharacterId, setDeletingCharacterId] = useState<string | null>(null)
  const router = useRouter()

  // Cargar personajes del usuario autenticado
  useEffect(() => {
    const loadCharacters = async () => {
      try {
        // Verificar autenticación
        const { data: userData, error: userError } = await supabase.auth.getUser()
        
        if (userError) throw userError
        
        if (!userData?.user) {
          router.push("/login")
          return
        }

        setUser(userData.user)

        // Cargar personajes del usuario
        const { data: charactersData, error: charactersError } = await supabase
          .from('characters')
          .select('*')
          .eq('user_id', userData.user.id)
          .order('created_at', { ascending: false })

        if (charactersError) throw charactersError

        setCharacters((charactersData as unknown as Character[]) || [])

        // Cargar aventuras del usuario
        const { data: adventuresData, error: adventuresError } = await supabase
          .from('adventures')
          .select('*')
          .eq('user_id', userData.user.id)
          .order('updated_at', { ascending: false })

        if (adventuresError) {
          console.warn("Error al cargar aventuras:", adventuresError)
          // No es error crítico, podemos continuar sin aventuras
        } else {
          setAdventures(adventuresData || [])
        }

      } catch (error: any) {
        console.error("Error al cargar personajes:", error)
        toast.error("Error", {
          description: "No se pudieron cargar los personajes"
        })
      } finally {
        setIsLoading(false)
      }
    }

    loadCharacters()
  }, [router])

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

  // Función para descargar la imagen del avatar
  const handleDownloadAvatar = async (character: Character) => {
    if (!character?.avatar) {
      toast.error("No hay imagen de avatar disponible para descargar")
      return
    }

    try {
      // Crear un canvas para convertir la imagen
      const response = await fetch(character.avatar)
      const blob = await response.blob()
      
      // Crear un URL temporal para la descarga
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      
      // Obtener la extensión del archivo desde la URL o usar png por defecto
      const urlPath = new URL(character.avatar).pathname
      const extension = urlPath.split('.').pop() || 'png'
      link.download = `${character.name.replace(/\s+/g, '_')}_avatar.${extension}`
      
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)

      toast.success("Imagen descargada", {
        description: `La imagen de ${character.name} se ha descargado exitosamente.`
      })
    } catch (error) {
      console.error("Error al descargar la imagen:", error)
      toast.error("Error al descargar", {
        description: "No se pudo descargar la imagen del avatar."
      })
    }
  }

  // Función para borrar personaje
  const handleDeleteCharacter = async (characterToDelete: Character) => {
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

      toast.success("Personaje eliminado", {
        description: `${characterToDelete.name} ha sido eliminado exitosamente.`,
      });

    } catch (error: any) {
      console.error("Error al borrar el personaje:", error);
      toast.error("Error", {
        description: "No se pudo eliminar el personaje. " + (error.message || error),
      });
    } finally {
      setDeletingCharacterId(null);
    }
  };

  // Función para obtener el estado de aventura de un personaje
  const getCharacterAdventureStatus = (characterId: string) => {
    const characterAdventures = adventures.filter(adventure => adventure.character_id === characterId)
    
    if (characterAdventures.length === 0) {
      return {
        hasAdventures: false,
        status: 'none',
        activeAdventures: 0,
        completedAdventures: 0
      }
    }

    const activeAdventures = characterAdventures.filter(adventure => adventure.status === 'in_progress')
    const completedAdventures = characterAdventures.filter(adventure => adventure.status === 'completed')

    return {
      hasAdventures: true,
      status: activeAdventures.length > 0 ? 'active' : 'completed_only',
      activeAdventures: activeAdventures.length,
      completedAdventures: completedAdventures.length,
      totalAdventures: characterAdventures.length
    }
  }

  // Renderizar tarjeta de personaje
  const renderCharacterCard = (character: Character) => {
    const hasAdventureData = character.character_data && typeof character.character_data === 'object' && character.character_data.build;
    const adventureStatus = getCharacterAdventureStatus(character.id);
    
    return (
      <Card key={character.id} className="overflow-hidden hover:shadow-lg transition-shadow">
        <CardHeader className="pb-2 sm:pb-3 p-3 sm:p-6">
          <div className="flex justify-between items-start gap-2">
            <div className="flex-1 min-w-0">
              <CardTitle className="text-base sm:text-lg truncate">{character.name}</CardTitle>
              <CardDescription className="mt-1 text-sm">
                {character.race} {character.class}
              </CardDescription>
              <div className="text-xs text-muted-foreground mt-1">
                {character.gender}
              </div>
            </div>
            <Badge variant="outline" className="font-normal border-gray-300 dark:border-gray-600 text-xs flex-shrink-0">
              Nivel {character.level}
            </Badge>
          </div>
        </CardHeader>
        
        {character.avatar && (
          <div className="px-3 sm:px-6 pb-2 sm:pb-3">
            <div className="relative group mx-auto w-fit">
              <div className="relative w-12 h-12 sm:w-16 sm:h-16 rounded-full overflow-hidden border-2 border-gray-200 dark:border-gray-700">
                <Image
                  src={character.avatar}
                  alt={character.name}
                  width={64}
                  height={64}
                  className="w-full h-full object-cover"
                />
              </div>
              {/* Botón de descarga flotante */}
              <Button
                size="sm"
                variant="outline"
                onClick={(e) => {
                  e.stopPropagation()
                  handleDownloadAvatar(character)
                }}
                className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 shadow-lg text-xs px-1.5 py-0.5 h-6 min-w-0"
                title="Descargar imagen del avatar"
              >
                <Download className="h-3 w-3" />
              </Button>
            </div>
          </div>
        )}
        
        <CardContent className="pb-2 sm:pb-3 p-3 sm:p-6">
          <div className="text-center">
            {adventureStatus.status === 'active' ? (
              <div className="space-y-1">
                <Badge className="bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 border-green-300 dark:border-green-600 text-xs">
                  Aventura Activa
                </Badge>
                <p className="text-xs text-muted-foreground">
                  {adventureStatus.activeAdventures} aventura{adventureStatus.activeAdventures !== 1 ? 's' : ''} en progreso
                </p>
              </div>
            ) : adventureStatus.status === 'completed_only' ? (
              <div className="space-y-1">
                <Badge className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 border-blue-300 dark:border-blue-600 text-xs">
                  Aventuras Completadas
                </Badge>
                <p className="text-xs text-muted-foreground">
                  {adventureStatus.completedAdventures} aventura{adventureStatus.completedAdventures !== 1 ? 's' : ''} completada{adventureStatus.completedAdventures !== 1 ? 's' : ''}
                </p>
              </div>
            ) : hasAdventureData ? (
              <div className="space-y-1">
                <Badge className="bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 border-gray-300 dark:border-gray-600 text-xs">
                  Datos de Personaje
                </Badge>
                <p className="text-xs text-muted-foreground">
                  Este personaje tiene datos completos
                </p>
              </div>
            ) : (
              <div className="space-y-1">
                <Badge variant="outline" className="border-gray-400 dark:border-gray-500 text-gray-600 dark:text-gray-400 text-xs">
                  Sin Aventura
                </Badge>
                <p className="text-xs text-muted-foreground">
                  Listo para comenzar una nueva aventura
                </p>
              </div>
            )}
          </div>
        </CardContent>
        
        <CardFooter className="flex flex-col sm:flex-row justify-between pt-2 sm:pt-3 gap-2 p-3 sm:p-6">
          <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
            <Button 
              variant="outline" 
              size="sm"
              className="border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800 w-full sm:w-auto text-xs sm:text-sm"
              onClick={() => router.push(`/characters/${character.id}`)}
            >
              Ver Detalles
            </Button>
            
            {/* Botón de descarga para móviles */}
            {character.avatar && (
              <Button 
                variant="outline" 
                size="sm"
                className="border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800 w-full sm:hidden text-xs"
                onClick={(e) => {
                  e.stopPropagation()
                  handleDownloadAvatar(character)
                }}
              >
                <Download className="h-3 w-3 mr-1" />
                Descargar Avatar
              </Button>
            )}
          </div>
          
          <div className="flex gap-2 w-full sm:w-auto">
            <Button 
              size="sm"
              className="bg-gradient-to-r from-gray-700 to-gray-800 hover:from-gray-800 hover:to-gray-900 text-white flex-1 sm:flex-initial text-xs sm:text-sm"
              onClick={() => router.push(`/game?character=${character.id}`)}
            >
              Seleccionar
            </Button>
            
            {/* Botón de descarga para desktop */}
            {character.avatar && (
              <Button 
                variant="outline" 
                size="sm"
                className="border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800 hidden sm:flex text-xs sm:text-sm"
                onClick={(e) => {
                  e.stopPropagation()
                  handleDownloadAvatar(character)
                }}
                title="Descargar imagen del avatar"
              >
                <Download className="h-3 w-3 sm:h-4 sm:w-4" />
              </Button>
            )}
            
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button 
                  variant="outline" 
                  size="sm"
                  className="border-gray-400 dark:border-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300 flex-1 sm:flex-initial text-xs sm:text-sm"
                  disabled={deletingCharacterId === character.id}
                >
                  {deletingCharacterId === character.id ? (
                    <Loader2 className="h-3 w-3 sm:h-4 sm:w-4 animate-spin" />
                  ) : (
                    <Trash2 className="h-3 w-3 sm:h-4 sm:w-4" />
                  )}
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Esta acción no se puede deshacer. Se eliminará permanentemente el personaje 
                    <strong> {character.name}</strong>, incluyendo su imagen y todo su historial de decisiones.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel className="border-gray-300 dark:border-gray-600">
                    Cancelar
                  </AlertDialogCancel>
                  <AlertDialogAction 
                    onClick={() => handleDeleteCharacter(character)}
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
    )
  }

  // Renderizar tarjeta de crear personaje
  const renderCreateCharacterCard = () => (
    <Card className="flex flex-col items-center justify-center p-4 sm:p-6 border-dashed border-2 border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500 transition-colors">
      <div className="mb-3 sm:mb-4 rounded-full bg-gray-100 dark:bg-gray-800 p-2 sm:p-3">
        <Plus className="h-5 w-5 sm:h-6 sm:w-6 text-gray-600 dark:text-gray-400" />
      </div>
      <h3 className="text-base sm:text-lg font-medium mb-2 text-center">Crear Nuevo Personaje</h3>
      <p className="text-xs sm:text-sm text-muted-foreground text-center mb-3 sm:mb-4">
        Comienza una nueva aventura con un personaje fresco
      </p>
      <Button 
        onClick={() => router.push("/character-create")}
        className="bg-gradient-to-r from-gray-700 to-gray-800 hover:from-gray-800 hover:to-gray-900 text-white w-full sm:w-auto text-xs sm:text-sm"
      >
        Crear Personaje
      </Button>
    </Card>
  )

  // Filtrar personajes por estado
  const activeCharacters = characters.filter(character => {
    const adventureStatus = getCharacterAdventureStatus(character.id)
    return adventureStatus.status === 'active' || adventureStatus.status === 'none'
  })
  
  const retiredCharacters = characters.filter(character => {
    const adventureStatus = getCharacterAdventureStatus(character.id)
    return adventureStatus.status === 'completed_only'
  })

  if (isLoading) {
    return (
      <div className="flex min-h-screen">
        <Sidebar />
        <main className="flex-1 lg:ml-64">
          <div className="p-4 sm:p-6 lg:p-8 space-y-6 sm:space-y-8 lg:space-y-10">
            <div className="space-y-2 sm:space-y-4">
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight">Personajes</h1>
              <p className="text-sm sm:text-base text-muted-foreground">Gestiona tus personajes y sus habilidades.</p>
            </div>
            <div className="flex justify-center items-center h-48 sm:h-64">
              <div className="text-base sm:text-lg text-muted-foreground">Cargando personajes...</div>
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
        <div className="p-4 sm:p-6 lg:p-8 space-y-4 sm:space-y-6">
          <div className="space-y-2 sm:space-y-4">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight">Personajes</h1>
            <p className="text-sm sm:text-base text-muted-foreground">Gestiona tus personajes y sus habilidades.</p>
            {characters.length > 0 && (
              <p className="text-xs sm:text-sm text-muted-foreground">
                Total: {characters.length} personaje{characters.length !== 1 ? 's' : ''}
              </p>
            )}
          </div>

          <Tabs defaultValue="all" className="w-full">
            <TabsList className="w-full sm:w-auto grid grid-cols-3 sm:flex mb-4 sm:mb-6">
              <TabsTrigger value="all" className="text-xs sm:text-sm">
                <span className="hidden sm:inline">Todos los Personajes</span>
                <span className="sm:hidden">Todos</span>
                <span className="ml-1">({characters.length})</span>
              </TabsTrigger>
              <TabsTrigger value="active" className="text-xs sm:text-sm">
                <span className="hidden sm:inline">Activos y Disponibles</span>
                <span className="sm:hidden">Activos</span>
                <span className="ml-1">({activeCharacters.length})</span>
              </TabsTrigger>
              <TabsTrigger value="retired" className="text-xs sm:text-sm">
                <span className="hidden sm:inline">Solo Completadas</span>
                <span className="sm:hidden">Completadas</span>
                <span className="ml-1">({retiredCharacters.length})</span>
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="all" className="space-y-4 sm:space-y-6">
              {characters.length === 0 ? (
                <div className="text-center py-8 sm:py-12">
                  <div className="rounded-full bg-gray-100 dark:bg-gray-800 p-3 sm:p-4 w-12 h-12 sm:w-16 sm:h-16 mx-auto flex items-center justify-center mb-4 sm:mb-6">
                    <Plus className="h-6 w-6 sm:h-8 sm:w-8 text-gray-600 dark:text-gray-400" />
                  </div>
                  <h3 className="text-base sm:text-lg font-medium mb-2">No tienes personajes</h3>
                  <p className="text-sm sm:text-base text-muted-foreground mb-4 sm:mb-6 max-w-md mx-auto">
                    Crea tu primer personaje para comenzar tu aventura en Pathfinder
                  </p>
                  <Button 
                    onClick={() => router.push("/character-create")}
                    className="bg-gradient-to-r from-gray-700 to-gray-800 hover:from-gray-800 hover:to-gray-900 text-white w-full sm:w-auto"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Crear Primer Personaje
                  </Button>
                </div>
              ) : (
                <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                  {characters.map(renderCharacterCard)}
                  {renderCreateCharacterCard()}
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="active" className="space-y-4 sm:space-y-6">
              {activeCharacters.length === 0 ? (
                <div className="text-center py-8 sm:py-12">
                  <h3 className="text-base sm:text-lg font-medium mb-2">No hay personajes activos</h3>
                  <p className="text-sm sm:text-base text-muted-foreground">
                    Los personajes con aventuras en progreso o disponibles aparecerán aquí
                  </p>
                </div>
              ) : (
                <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                  {activeCharacters.map(renderCharacterCard)}
                  {/* Solo mostrar la tarjeta de crear personaje en la pestaña "Todos" y "Activos" */}
                  {renderCreateCharacterCard()}
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="retired" className="space-y-4 sm:space-y-6">
              {retiredCharacters.length === 0 ? (
                <div className="text-center py-8 sm:py-12">
                  <h3 className="text-base sm:text-lg font-medium mb-2">No hay personajes con aventuras completadas</h3>
                  <p className="text-sm sm:text-base text-muted-foreground">
                    Los personajes que solo tienen aventuras completadas aparecerán aquí
                  </p>
                </div>
              ) : (
                <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                  {retiredCharacters.map(renderCharacterCard)}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  )
}
