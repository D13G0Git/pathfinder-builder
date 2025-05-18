"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card"
import { supabase } from "@/lib/supabase"
import { PathfinderCharacter } from "@/lib/supabase"
import { useToast } from "@/components/ui/use-toast"
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"

// Opciones para la creación de personajes
const classOptions = [
  "Alquimista", "Bárbaro", "Bardo", "Campeón", "Clérigo", "Druida", 
  "Explorador", "Guerrero", "Hechicero", "Mago", "Monje", "Pícaro"
]

const raceOptions = [
  "Humano", "Elfo", "Enano", "Halfling", "Gnomo", "Goblin", 
  "Hobgoblin", "Kobold", "Orco", "Tengu"
]

export function CharacterCreationForm() {
  const [activeTab, setActiveTab] = useState<string>("manual")
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [user, setUser] = useState<any>(null)
  const [jsonError, setJsonError] = useState<string | null>(null)
  const [importedCharacter, setImportedCharacter] = useState<PathfinderCharacter | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()
  const { toast } = useToast()

  // Estado del formulario
  const [characterData, setCharacterData] = useState({
    name: "",
    class: "Guerrero",
    race: "Humano",
    level: 1,
    avatar: "/placeholder.svg?height=100&width=100&text=Avatar",
    avatar_base64: ""
  })

  // Comprobar si el usuario está autenticado
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        if (user) {
          setUser(user)
        } else {
          // Redirigir al login si no hay usuario autenticado
          router.push("/login")
        }
      } catch (error) {
        console.error("Error al verificar la autenticación:", error)
        router.push("/login")
      }
    }

    checkAuth()
  }, [router])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setCharacterData(prev => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setCharacterData(prev => ({ ...prev, [name]: value }))
  }

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      const reader = new FileReader()
      
      reader.onload = (event) => {
        if (event.target?.result) {
          setCharacterData(prev => ({
            ...prev,
            avatar_base64: event.target!.result as string
          }))
        }
      }
      
      reader.readAsDataURL(file)
    }
  }

  const handleJsonImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    setJsonError(null)
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      const reader = new FileReader()
      
      reader.onload = (event) => {
        try {
          if (event.target?.result) {
            const jsonContent = JSON.parse(event.target.result as string)
            
            // Verificar si el JSON tiene la estructura esperada
            if (!jsonContent.build || !jsonContent.build.name) {
              throw new Error("El archivo JSON no tiene el formato esperado de personaje de Pathfinder")
            }
            
            setImportedCharacter(jsonContent)
            setCharacterData(prev => ({
              ...prev,
              name: jsonContent.build.name,
              class: jsonContent.build.class,
              race: jsonContent.build.ancestry,
              level: jsonContent.build.level
            }))
          }
        } catch (error: any) {
          console.error("Error al procesar el JSON:", error)
          setJsonError(error.message)
          setImportedCharacter(null)
        }
      }
      
      reader.readAsText(file)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!user) {
      toast({
        variant: "destructive",
        title: "No has iniciado sesión",
        description: "Necesitas iniciar sesión para crear un personaje",
      })
      return
    }

    setIsLoading(true)

    try {
      // Insertar el nuevo personaje en la base de datos
      const { data, error } = await supabase
        .from('characters')
        .insert({
          user_id: user.id,
          name: characterData.name,
          class: characterData.class,
          race: characterData.race,
          level: characterData.level,
          avatar: characterData.avatar,
          avatar_base64: characterData.avatar_base64 || null,
          character_data: importedCharacter || null
        })
        .select('id')  // Solo necesitamos el ID para confirmar

      if (error) throw error
      
      if (!data || data.length === 0) {
        throw new Error("No se recibió confirmación de la inserción del personaje")
      }

      toast({
        title: "¡Personaje creado!",
        description: "Tu nuevo personaje ha sido creado exitosamente.",
      })

      // Redirigir al dashboard o a la página del personaje
      router.push("/dashboard")
    } catch (error: any) {
      console.error("Error al crear el personaje:", error)
      toast({
        variant: "destructive",
        title: "Error",
        description: "No se pudo crear el personaje. " + (error.message || error),
      })
    } finally {
      setIsLoading(false)
    }
  }

  const resetJsonImport = () => {
    setImportedCharacter(null)
    setJsonError(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <Card className="w-full max-w-xl">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">Crear Nuevo Personaje</CardTitle>
          <CardDescription className="text-center">
            Crea tu personaje para comenzar tu aventura en Pathfinder 2e
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="manual">Crear Manualmente</TabsTrigger>
              <TabsTrigger value="import">Importar JSON</TabsTrigger>
            </TabsList>
            
            <TabsContent value="manual">
              <form onSubmit={handleSubmit}>
                <div className="grid gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="name">Nombre del Personaje</Label>
                    <Input 
                      id="name" 
                      name="name"
                      placeholder="Nombre de tu personaje" 
                      required 
                      value={characterData.name}
                      onChange={handleInputChange}
                    />
                  </div>
                  
                  <div className="grid gap-2">
                    <Label htmlFor="race">Raza</Label>
                    <Select 
                      value={characterData.race} 
                      onValueChange={(value) => handleSelectChange("race", value)}
                    >
                      <SelectTrigger id="race">
                        <SelectValue placeholder="Selecciona una raza" />
                      </SelectTrigger>
                      <SelectContent>
                        {raceOptions.map((race) => (
                          <SelectItem key={race} value={race}>
                            {race}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="grid gap-2">
                    <Label htmlFor="class">Clase</Label>
                    <Select 
                      value={characterData.class} 
                      onValueChange={(value) => handleSelectChange("class", value)}
                    >
                      <SelectTrigger id="class">
                        <SelectValue placeholder="Selecciona una clase" />
                      </SelectTrigger>
                      <SelectContent>
                        {classOptions.map((classOption) => (
                          <SelectItem key={classOption} value={classOption}>
                            {classOption}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="grid gap-2">
                    <Label htmlFor="avatar">Avatar (opcional)</Label>
                    <Input 
                      id="avatar" 
                      type="file" 
                      accept="image/*"
                      onChange={handleAvatarChange}
                    />
                    <p className="text-xs text-muted-foreground">
                      Selecciona una imagen para tu personaje
                    </p>
                  </div>
                  
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? "Creando personaje..." : "Crear Personaje"}
                  </Button>
                </div>
              </form>
            </TabsContent>
            
            <TabsContent value="import">
              <div className="grid gap-6">
                <div className="grid gap-2">
                  <Label htmlFor="jsonFile">Archivo JSON de Pathfinder</Label>
                  <Input 
                    id="jsonFile" 
                    type="file" 
                    accept=".json"
                    ref={fileInputRef}
                    onChange={handleJsonImport}
                  />
                  <p className="text-xs text-muted-foreground">
                    Importa un archivo JSON de personaje creado en Pathfinder Builder 2e
                  </p>
                </div>
                
                {jsonError && (
                  <Alert variant="destructive">
                    <AlertDescription>{jsonError}</AlertDescription>
                  </Alert>
                )}
                
                {importedCharacter && (
                  <div className="border p-4 rounded-md bg-muted">
                    <h3 className="font-semibold mb-2">Personaje Detectado:</h3>
                    <p><strong>Nombre:</strong> {importedCharacter.build.name}</p>
                    <p><strong>Clase:</strong> {importedCharacter.build.class}</p>
                    <p><strong>Raza:</strong> {importedCharacter.build.ancestry}</p>
                    <p><strong>Nivel:</strong> {importedCharacter.build.level}</p>
                    <div className="flex gap-2 mt-4">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={resetJsonImport}
                      >
                        Cancelar
                      </Button>
                      <Button
                        type="button"
                        variant="default"
                        onClick={handleSubmit}
                        disabled={isLoading}
                      >
                        {isLoading ? "Importando..." : "Importar Personaje"}
                      </Button>
                    </div>
                  </div>
                )}
                
                {!importedCharacter && (
                  <div className="border p-4 rounded-md bg-muted">
                    <h3 className="font-semibold mb-2">Instrucciones:</h3>
                    <ol className="list-decimal pl-5 space-y-1">
                      <li>Crea tu personaje en Pathfinder Builder 2e</li>
                      <li>Exporta el personaje como archivo JSON</li>
                      <li>Selecciona el archivo JSON aquí para importarlo</li>
                    </ol>
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
        <CardFooter className="flex flex-col">
          <div className="text-sm text-muted-foreground text-center">
            Tu personaje comenzará en nivel 1 y evolucionará a medida que avances en la historia.
          </div>
        </CardFooter>
      </Card>
    </div>
  )
} 