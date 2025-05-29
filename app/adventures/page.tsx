"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Scroll, Clock, Trophy, Skull, Swords, Loader2, Trash2, Download, Play } from "lucide-react"
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import Image from "next/image"

interface Adventure {
  id: string
  user_id: string
  character_id: string
  name: string
  description: string
  current_stage: number
  total_stages: number
  status: 'in_progress' | 'completed'
  adventure_data: any
  result_data: any
  created_at: string
  updated_at: string
  completed_at: string | null
  character: {
    id: string
    name: string
    class: string
    race: string
    level: number
    avatar: string | null
    gender: string
  }
}

export default function AdventuresPage() {
  const [adventures, setAdventures] = useState<Adventure[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [deletingAdventureId, setDeletingAdventureId] = useState<string | null>(null)
  const [user, setUser] = useState<any>(null)
  const router = useRouter()

  // Cargar aventuras del usuario autenticado
  useEffect(() => {
    const loadAdventures = async () => {
      try {
        // Verificar autenticación
        const { data: userData, error: userError } = await supabase.auth.getUser()
        
        if (userError) throw userError
        
        if (!userData?.user) {
          router.push("/login")
          return
        }

        setUser(userData.user)

        // Cargar aventuras del usuario con información del personaje
        const { data: adventuresData, error: adventuresError } = await supabase
          .from('adventures')
          .select(`
            *,
            character:characters(
              id,
              name,
              class,
              race,
              level,
              avatar,
              gender
            )
          `)
          .eq('user_id', userData.user.id)
          .order('updated_at', { ascending: false })

        if (adventuresError) throw adventuresError

        setAdventures(adventuresData || [])
      } catch (error: any) {
        console.error("Error al cargar aventuras:", error)
        toast.error("Error", {
          description: "No se pudieron cargar las aventuras"
        })
      } finally {
        setIsLoading(false)
      }
    }

    loadAdventures()
  }, [router])

  // Función para borrar aventura
  const handleDeleteAdventure = async (adventure: Adventure) => {
    if (!user || !adventure) return

    setDeletingAdventureId(adventure.id)

    try {
      const { error: deleteError } = await supabase
        .from('adventures')
        .delete()
        .eq('id', adventure.id)
        .eq('user_id', user.id) // Seguridad adicional

      if (deleteError) throw deleteError

      // Actualizar el estado local
      setAdventures(prev => prev.filter(a => a.id !== adventure.id))

      toast.success("Aventura eliminada", {
        description: `La aventura "${adventure.name}" ha sido eliminada exitosamente.`
      })

    } catch (error: any) {
      console.error("Error al borrar la aventura:", error)
      toast.error("Error", {
        description: "No se pudo eliminar la aventura. " + (error.message || error)
      })
    } finally {
      setDeletingAdventureId(null)
    }
  }

  // Función para calcular el progreso
  const calculateProgress = (currentStage: number, totalStages: number): number => {
    if (totalStages === 0) return 0
    return Math.round((currentStage / totalStages) * 100)
  }

  // Función para exportar datos de Foundry
  const handleExportFoundry = (adventure: Adventure) => {
    if (!adventure.result_data) {
      toast.error("No hay datos de resultado disponibles para exportar")
      return
    }

    const dataStr = JSON.stringify(adventure.result_data, null, 2)
    const dataBlob = new Blob([dataStr], { type: 'application/json' })
    const url = URL.createObjectURL(dataBlob)
    
    const link = document.createElement('a')
    link.href = url
    link.download = `${adventure.character.name}_${adventure.name.replace(/\s+/g, '_')}_foundry.json`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)

    toast.success("Archivo exportado", {
      description: "El archivo JSON de Foundry VTT ha sido descargado"
    })
  }

  // Renderizar tarjeta de aventura
  const renderAdventureCard = (adventure: Adventure) => {
    const progress = calculateProgress(adventure.current_stage, adventure.total_stages)
    
    return (
      <Card key={adventure.id} className="overflow-hidden border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow">
        <div className="md:flex">
          {/* Avatar del personaje */}
          <div className="relative h-48 md:h-auto md:w-1/4 flex items-center justify-center bg-gray-50 dark:bg-gray-900">
            {adventure.character.avatar ? (
              <div className="relative w-32 h-32 rounded-full overflow-hidden border-4 border-gray-200 dark:border-gray-700 shadow-lg">
                <Image
                  src={adventure.character.avatar}
                  alt={adventure.character.name}
                  fill
                  className="object-cover"
                />
              </div>
            ) : (
              <div className="w-32 h-32 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                <span className="text-4xl">⚔️</span>
              </div>
            )}
          </div>
          
          <div className="flex-1">
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <CardTitle className="text-xl">{adventure.name}</CardTitle>
                  <CardDescription className="mt-1">{adventure.description}</CardDescription>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-sm text-muted-foreground">
                      Personaje: <span className="font-medium">{adventure.character.name}</span>
                    </span>
                    <Badge variant="outline" className="text-xs border-gray-300 dark:border-gray-600">
                      {adventure.character.race} {adventure.character.class}
                    </Badge>
                  </div>
                </div>
                <Badge
                  className={
                    adventure.status === "completed"
                      ? "bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 border-gray-300 dark:border-gray-600"
                      : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 border-gray-400 dark:border-gray-500"
                  }
                >
                  {adventure.status === "completed" ? "Completada" : "En Progreso"}
                </Badge>
              </div>
            </CardHeader>
            
            <CardContent className="pb-2">
              <div className="space-y-4">
                {/* Barra de progreso */}
                <div>
                  <div className="flex justify-between mb-1 text-sm">
                    <span>Progreso</span>
                    <span>{progress}% ({adventure.current_stage}/{adventure.total_stages} etapas)</span>
                  </div>
                  <Progress value={progress} className="h-2" />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-2">
                    <Scroll className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">
                      Etapa {adventure.current_stage} de {adventure.total_stages}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">
                      {adventure.status === "completed" && adventure.completed_at
                        ? `Completada ${new Date(adventure.completed_at).toLocaleDateString()}`
                        : `Iniciada ${new Date(adventure.created_at).toLocaleDateString()}`
                      }
                    </span>
                  </div>
                  {adventure.status === "completed" && (
                    <div className="flex items-center gap-2">
                      <Trophy className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">Aventura Completada</span>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
            
            <CardFooter className="pt-2 flex gap-2">
              {adventure.status === "completed" ? (
                <>
                  {adventure.result_data ? (
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button 
                          variant="outline"
                          className="border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800"
                        >
                          <Trophy className="h-4 w-4 mr-2" />
                          Ver Resultado
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                        <DialogHeader>
                          <DialogTitle>Resultado de la Aventura</DialogTitle>
                          <DialogDescription>
                            Datos del personaje para exportar a Foundry VTT
                          </DialogDescription>
                        </DialogHeader>
                        <div className="mt-4">
                          <pre className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg text-xs overflow-x-auto">
                            {JSON.stringify(adventure.result_data, null, 2)}
                          </pre>
                          <div className="flex gap-2 mt-4">
                            <Button 
                              onClick={() => handleExportFoundry(adventure)}
                              className="bg-gradient-to-r from-gray-700 to-gray-800 hover:from-gray-800 hover:to-gray-900 text-white"
                            >
                              <Download className="h-4 w-4 mr-2" />
                              Exportar a Foundry VTT
                            </Button>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                  ) : (
                    <Button 
                      variant="outline" 
                      disabled
                      className="border-gray-300 dark:border-gray-600"
                    >
                      Sin datos de resultado
                    </Button>
                  )}
                </>
              ) : (
                <Button 
                  onClick={() => router.push(`/game?adventure=${adventure.id}`)}
                  className="bg-gradient-to-r from-gray-700 to-gray-800 hover:from-gray-800 hover:to-gray-900 text-white"
                >
                  <Play className="h-4 w-4 mr-2" />
                  Continuar Aventura
                </Button>
              )}
              
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button 
                    variant="outline"
                    disabled={deletingAdventureId === adventure.id}
                    className="border-gray-400 dark:border-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300"
                  >
                    {deletingAdventureId === adventure.id ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Trash2 className="h-4 w-4" />
                    )}
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>¿Eliminar aventura?</AlertDialogTitle>
                    <AlertDialogDescription>
                      Esta acción no se puede deshacer. Se eliminará permanentemente la aventura 
                      <strong> "{adventure.name}"</strong> con el personaje <strong>{adventure.character.name}</strong>.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel className="border-gray-300 dark:border-gray-600">
                      Cancelar
                    </AlertDialogCancel>
                    <AlertDialogAction 
                      onClick={() => handleDeleteAdventure(adventure)}
                      className="bg-gray-600 hover:bg-gray-700 dark:bg-gray-500 dark:hover:bg-gray-400"
                    >
                      Eliminar Aventura
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </CardFooter>
          </div>
        </div>
      </Card>
    )
  }

  // Filtrar aventuras
  const inProgressAdventures = adventures.filter(a => a.status === 'in_progress')
  const completedAdventures = adventures.filter(a => a.status === 'completed')

  if (isLoading) {
    return (
      <div className="flex min-h-screen">
        <Sidebar />
        <main className="flex-1 md:ml-64">
          <div className="p-6 space-y-6">
            <div className="m-4">
              <h1 className="text-3xl font-bold tracking-tight mb-2">Aventuras</h1>
              <p className="text-muted-foreground">Explora tus aventuras y viajes por el reino.</p>
            </div>
            <div className="flex justify-center items-center h-64">
              <div className="text-lg text-muted-foreground">Cargando aventuras...</div>
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
            <h1 className="text-3xl font-bold tracking-tight mb-2">Aventuras</h1>
            <p className="text-muted-foreground">Explora tus aventuras y viajes por el reino.</p>
            {adventures.length > 0 && (
              <p className="text-sm text-muted-foreground mt-2">
                Total: {adventures.length} aventura{adventures.length !== 1 ? 's' : ''} • 
                En progreso: {inProgressAdventures.length} • 
                Completadas: {completedAdventures.length}
              </p>
            )}
          </div>

      <Tabs defaultValue="all" className="w-full">
        <TabsList className="m-4">
          <TabsTrigger value="all">
            Todas las Aventuras ({adventures.length})
          </TabsTrigger>
          <TabsTrigger value="active">
            En Progreso ({inProgressAdventures.length})
          </TabsTrigger>
          <TabsTrigger value="completed">
            Completadas ({completedAdventures.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-6">
          {adventures.length === 0 ? (
            <div className="text-center py-12">
              <div className="m-4 rounded-full bg-gray-100 dark:bg-gray-800 p-4 w-16 h-16 mx-auto flex items-center justify-center">
                <Scroll className="h-8 w-8 text-gray-600 dark:text-gray-400" />
              </div>
              <h3 className="text-lg font-medium mb-2">No tienes aventuras</h3>
              <p className="text-muted-foreground mb-6">
                Crea un personaje y comienza tu primera aventura en Pathfinder
              </p>
              <Button 
                onClick={() => router.push("/characters")}
                className="bg-gradient-to-r from-gray-700 to-gray-800 hover:from-gray-800 hover:to-gray-900 text-white"
              >
                <Swords className="h-4 w-4 mr-2" />
                Ver Personajes
              </Button>
            </div>
          ) : (
            <div className="space-y-6">
              {adventures.map(renderAdventureCard)}
            </div>
          )}
        </TabsContent>

        <TabsContent value="active" className="space-y-6">
          {inProgressAdventures.length === 0 ? (
            <div className="text-center py-12">
              <h3 className="text-lg font-medium mb-2">No hay aventuras en progreso</h3>
              <p className="text-muted-foreground">
                Comienza una nueva aventura con uno de tus personajes
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {inProgressAdventures.map(renderAdventureCard)}
            </div>
          )}
        </TabsContent>

        <TabsContent value="completed" className="space-y-6">
          {completedAdventures.length === 0 ? (
            <div className="text-center py-12">
              <h3 className="text-lg font-medium mb-2">No hay aventuras completadas</h3>
              <p className="text-muted-foreground">
                Las aventuras completadas aparecerán aquí
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {completedAdventures.map(renderAdventureCard)}
            </div>
          )}
        </TabsContent>
      </Tabs>
        </div>
        </main>
      </div>
    )
  }
