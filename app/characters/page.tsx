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
        <CardHeader className="pb-3">
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-lg">{character.name}</CardTitle>
              <CardDescription className="mt-1">
                {character.race} {character.class}
              </CardDescription>
              <div className="text-xs text-muted-foreground mt-1">
                {character.gender}
              </div>
            </div>
            <Badge variant="outline" className="font-normal border-gray-300 dark:border-gray-600">
              Nivel {character.level}
            </Badge>
          </div>
        </CardHeader>
        
        {character.avatar && (
          <div className="px-6 pb-3">
            <div className="relative w-16 h-16 mx-auto rounded-full overflow-hidden border-2 border-gray-200 dark:border-gray-700">
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
        
        <CardContent className="pb-3">
          <div className="text-center">
            {hasAdventureData ? (
              <div className="space-y-1">
                <Badge className="bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 border-gray-300 dark:border-gray-600">
                  Aventura Completada
                </Badge>
                <p className="text-xs text-muted-foreground">
                  Este personaje tiene datos de aventura
                </p>
              </div>
            ) : (
              <div className="space-y-1">
                <Badge variant="outline" className="border-gray-400 dark:border-gray-500 text-gray-600 dark:text-gray-400">
                  Sin Aventura
                </Badge>
                <p className="text-xs text-muted-foreground">
                  Listo para comenzar una nueva aventura
                </p>
              </div>
            )}
          </div>
        </CardContent>
        
        <CardFooter className="flex justify-between pt-3 gap-2">
          <Button 
            variant="outline" 
            size="sm"
            className="border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800"
            onClick={() => router.push(`/characters/${character.id}`)}
          >
            Ver Detalles
          </Button>
          
          <div className="flex gap-2">
            <Button 
              size="sm"
              className="bg-gradient-to-r from-gray-700 to-gray-800 hover:from-gray-800 hover:to-gray-900 text-white"
              onClick={() => router.push(`/game?character=${character.id}`)}
            >
              Seleccionar
            </Button>
            
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button 
                  variant="outline" 
                  size="sm"
                  className="border-gray-400 dark:border-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300"
                  disabled={deletingCharacterId === character.id}
                >
                  {deletingCharacterId === character.id ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Trash2 className="h-4 w-4" />
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
    <Card className="flex flex-col items-center justify-center p-6 border-dashed border-2 border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500 transition-colors">
      <div className="mb-4 rounded-full bg-gray-100 dark:bg-gray-800 p-3">
        <Plus className="h-6 w-6 text-gray-600 dark:text-gray-400" />
      </div>
      <h3 className="text-lg font-medium mb-2">Crear Nuevo Personaje</h3>
      <p className="text-sm text-muted-foreground text-center mb-4">
        Comienza una nueva aventura con un personaje fresco
      </p>
      <Button 
        onClick={() => router.push("/character-create")}
        className="bg-gradient-to-r from-gray-700 to-gray-800 hover:from-gray-800 hover:to-gray-900 text-white"
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
        <main className="flex-1 md:ml-64">
          <div className="p-6 space-y-10">
            <div className="ml-8">
              <h1 className="text-3xl font-bold tracking-tight mb-4">Personajes</h1>
              <p className="text-muted-foreground">Gestiona tus personajes y sus habilidades.</p>
            </div>
            <div className="flex justify-center items-center h-64">
              <div className="text-lg text-muted-foreground">Cargando personajes...</div>
            </div>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 md:ml-64">
        <div className="p-6 space-y-6">
          <div className="m-4">
            <h1 className="text-3xl font-bold tracking-tight mb-2">Personajes</h1>
            <p className="text-muted-foreground">Gestiona tus personajes y sus habilidades.</p>
            {characters.length > 0 && (
              <p className="text-sm text-muted-foreground mt-2">
                Total: {characters.length} personaje{characters.length !== 1 ? 's' : ''}
              </p>
            )}
          </div>

          <Tabs defaultValue="all" className="w-full">
            <TabsList className="m-4">
              <TabsTrigger value="all">
                Todos los Personajes ({characters.length})
              </TabsTrigger>
              <TabsTrigger value="active">
                Grupo Activo ({activeCharacters.length})
              </TabsTrigger>
              <TabsTrigger value="retired">
                Retirados ({retiredCharacters.length})
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="all" className="space-y-4">
              {characters.length === 0 ? (
                <div className="text-center py-12">
                  <div className="m-4 rounded-full bg-gray-100 dark:bg-gray-800 p-4 w-16 h-16 mx-auto flex items-center justify-center">
                    <Plus className="h-8 w-8 text-gray-600 dark:text-gray-400" />
                  </div>
                  <h3 className="text-lg font-medium mb-2">No tienes personajes</h3>
                  <p className="text-muted-foreground mb-6">
                    Crea tu primer personaje para comenzar tu aventura en Pathfinder
                  </p>
                  <Button 
                    onClick={() => router.push("/character-create")}
                    className="bg-gradient-to-r from-gray-700 to-gray-800 hover:from-gray-800 hover:to-gray-900 text-white"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Crear Primer Personaje
                  </Button>
                </div>
              ) : (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {characters.map(renderCharacterCard)}
                  {renderCreateCharacterCard()}
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="active" className="space-y-4">
              {activeCharacters.length === 0 ? (
                <div className="text-center py-12">
                  <h3 className="text-lg font-medium mb-2">No hay personajes activos</h3>
                  <p className="text-muted-foreground">
                    Todos tus personajes están disponibles para aventuras
                  </p>
                </div>
              ) : (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {activeCharacters.map(renderCharacterCard)}
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="retired" className="space-y-4">
              {retiredCharacters.length === 0 ? (
                <div className="text-center py-12">
                  <h3 className="text-lg font-medium mb-2">No hay personajes retirados</h3>
                  <p className="text-muted-foreground">
                    Los personajes retirados aparecerán aquí
                  </p>
                </div>
              ) : (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
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
