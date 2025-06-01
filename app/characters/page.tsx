"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Plus, Loader2, Trash2 } from "lucide-react"
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

export default function CharactersPage() {
  const [characters, setCharacters] = useState<Character[]>([])
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

  // Renderizar tarjeta de personaje
  const renderCharacterCard = (character: Character) => {
    const hasAdventureData = character.character_data && typeof character.character_data === 'object' && character.character_data.build;
    
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
            <div className="relative w-12 h-12 sm:w-16 sm:h-16 mx-auto rounded-full overflow-hidden border-2 border-gray-200 dark:border-gray-700">
              <Image
                src={character.avatar}
                alt={character.name}
                width={64}
                height={64}
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        )}
        
        <CardContent className="pb-2 sm:pb-3 p-3 sm:p-6">
          <div className="text-center">
            {hasAdventureData ? (
              <div className="space-y-1">
                <Badge className="bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 border-gray-300 dark:border-gray-600 text-xs">
                  Aventura Completada
                </Badge>
                <p className="text-xs text-muted-foreground">
                  Este personaje tiene datos de aventura
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
          <Button 
            variant="outline" 
            size="sm"
            className="border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800 w-full sm:w-auto text-xs sm:text-sm"
            onClick={() => router.push(`/characters/${character.id}`)}
          >
            Ver Detalles
          </Button>
          
          <div className="flex gap-2 w-full sm:w-auto">
            <Button 
              size="sm"
              className="bg-gradient-to-r from-gray-700 to-gray-800 hover:from-gray-800 hover:to-gray-900 text-white flex-1 sm:flex-initial text-xs sm:text-sm"
              onClick={() => router.push(`/game?character=${character.id}`)}
            >
              Seleccionar
            </Button>
            
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

  // Filtrar personajes por estado (esto puede expandirse en el futuro)
  const activeCharacters = characters // Por ahora todos son activos
  const retiredCharacters: Character[] = [] // Por ahora no hay retirados

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
                <span className="hidden sm:inline">Grupo Activo</span>
                <span className="sm:hidden">Activos</span>
                <span className="ml-1">({activeCharacters.length})</span>
              </TabsTrigger>
              <TabsTrigger value="retired" className="text-xs sm:text-sm">
                <span className="hidden sm:inline">Retirados</span>
                <span className="sm:hidden">Retirados</span>
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
                    Todos tus personajes están disponibles para aventuras
                  </p>
                </div>
              ) : (
                <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                  {activeCharacters.map(renderCharacterCard)}
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="retired" className="space-y-4 sm:space-y-6">
              {retiredCharacters.length === 0 ? (
                <div className="text-center py-8 sm:py-12">
                  <h3 className="text-base sm:text-lg font-medium mb-2">No hay personajes retirados</h3>
                  <p className="text-sm sm:text-base text-muted-foreground">
                    Los personajes retirados aparecerán aquí
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
