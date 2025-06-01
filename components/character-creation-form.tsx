"use client"

// NOTA: Este componente requiere que se configure un bucket en Supabase Storage
// llamado 'character-avatars' con las siguientes configuraciones:
// - Bucket público: true (para poder acceder a las URLs públicas)
// - Allowed MIME types: image/* 
// - Max file size: 5MB

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
import Image from "next/image"
import { Loader2 } from "lucide-react"

// Opciones para la creación de personajes
const classOptions = [
  "Alquimista", "Bárbaro", "Bardo", "Campeón", "Clérigo", "Druida", 
  "Explorador", "Guerrero", "Hechicero", "Mago", "Monje", "Pícaro"
]

const raceOptions = [
  "Humano", "Elfo", "Enano", "Halfling", "Gnomo", "Goblin", 
  "Hobgoblin", "Kobold", "Orco", "Tengu"
]

const genderOptions = [
  "Masculino", "Femenino", "Otro"
]

export function CharacterCreationForm() {
  const [activeTab, setActiveTab] = useState<string>("manual")
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [isGeneratingImage, setIsGeneratingImage] = useState<boolean>(false)
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
    gender: "Masculino",
    level: 1,
    avatar: ""
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

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      
      // Validar tipo de archivo
      if (!file.type.startsWith('image/')) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Por favor selecciona un archivo de imagen válido.",
        });
        return;
      }
      
      // Validar tamaño (5MB máximo)
      if (file.size > 5 * 1024 * 1024) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "El archivo es demasiado grande. Máximo 5MB.",
        });
        return;
      }

      try {
        setIsGeneratingImage(true); // Reutilizar el estado de loading
        
        // Generar un nombre único para el archivo
        const fileExtension = file.name.split('.').pop() || 'png';
        const fileName = `character-${user?.id}-${Date.now()}.${fileExtension}`;
        const filePath = `avatars/${fileName}`;
        
        // Subir la imagen a Supabase Storage
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('character-avatars')
          .upload(filePath, file, {
            contentType: file.type,
            upsert: false
          });

        if (uploadError) {
          throw new Error(`Error al subir imagen: ${uploadError.message}`);
        }

        // Obtener la URL pública de la imagen
        const { data: publicUrlData } = supabase.storage
          .from('character-avatars')
          .getPublicUrl(filePath);

        if (publicUrlData?.publicUrl) {
          setCharacterData(prev => ({
            ...prev,
            avatar: publicUrlData.publicUrl
          }));
          
          toast({
            title: "¡Imagen subida!",
            description: "Tu imagen ha sido subida exitosamente.",
          });
        } else {
          throw new Error('No se pudo obtener la URL pública de la imagen');
        }
      } catch (error: any) {
        console.error("Error al subir la imagen:", error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "No se pudo subir la imagen. " + (error.message || error),
        });
      } finally {
        setIsGeneratingImage(false);
      }
    }
  }

  const generateCharacterImage = async () => {
    setIsGeneratingImage(true);
    
    try {
      // Traducir género al inglés para el prompt
      let genderInEnglish = "male";
      if (characterData.gender === "Femenino") {
        genderInEnglish = "female";
      } else if (characterData.gender === "Otro") {
        genderInEnglish = "undefined";
      }

      // Traducir raza al inglés si es necesario
      let raceInEnglish = characterData.race;
      const raceTranslations: {[key: string]: string} = {
        "Humano": "Human",
        "Elfo": "Elf",
        "Enano": "Dwarf",
        "Halfling": "Halfling",
        "Gnomo": "Gnome",
        "Goblin": "Goblin",
        "Hobgoblin": "Hobgoblin",
        "Kobold": "Kobold",
        "Orco": "Orc",
        "Tengu": "Tengu"
      };
      
      if (raceTranslations[characterData.race]) {
        const translation = raceTranslations[characterData.race];
        if (translation) {
          raceInEnglish = translation;
        }
      }

      // Traducir clase al inglés si es necesario
      let classInEnglish = characterData.class;
      const classTranslations: {[key: string]: string} = {
        "Alquimista": "Alchemist",
        "Bárbaro": "Barbarian",
        "Bardo": "Bard",
        "Campeón": "Champion",
        "Clérigo": "Cleric",
        "Druida": "Druid",
        "Explorador": "Ranger",
        "Guerrero": "Fighter",
        "Hechicero": "Sorcerer",
        "Mago": "Wizard",
        "Monje": "Monk",
        "Pícaro": "Rogue"
      };
      
      if (classTranslations[characterData.class]) {
        const translation = classTranslations[characterData.class];
        if (translation) {
          classInEnglish = translation;
        }
      }

      // Generar el prompt para la API con más detalles para mejorar la calidad
      const prompt = `High quality portrait of a ${genderInEnglish} ${raceInEnglish} ${classInEnglish} character for Pathfinder RPG, detailed fantasy art, professional lighting, 4k`;
      
      // Llamar a nuestra API personalizada
      const response = await fetch('/api/generate-image', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt }),
      });
      
      if (!response.ok) {
        throw new Error('Error al generar la imagen');
      }
      
      const data = await response.json();
      
      if (data.imageUrl) {
        // Obtener la imagen directamente desde la URL de Replicate
        const imageResponse = await fetch(data.imageUrl);
        
        if (!imageResponse.ok) {
          throw new Error('Error al obtener la imagen generada');
        }

        // Obtener el blob de la imagen para subirla a Supabase
        const imageBlob = await imageResponse.blob();
        
        // Generar un nombre único para el archivo
        const fileName = `character-${user?.id}-${Date.now()}.png`;
        const filePath = `avatars/${fileName}`;
        
        // Subir la imagen a Supabase Storage usando la URL de Replicate
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('character-avatars')
          .upload(filePath, imageBlob, {
            contentType: 'image/png',
            upsert: false
          });

        if (uploadError) {
          throw new Error(`Error al subir imagen: ${uploadError.message}`);
        }

        // Obtener la URL pública de la imagen desde Supabase Storage
        const { data: publicUrlData } = supabase.storage
          .from('character-avatars')
          .getPublicUrl(filePath);

        if (publicUrlData?.publicUrl) {
          setCharacterData(prev => ({
            ...prev,
            avatar: publicUrlData.publicUrl
          }));
          
          toast({
            title: "¡Imagen generada!",
            description: "Se ha creado y subido una imagen para tu personaje.",
          });
        } else {
          throw new Error('No se pudo obtener la URL pública de la imagen');
        }
      } else {
        throw new Error('No se recibió URL de imagen');
      }
    } catch (error: any) {
      console.error("Error al generar la imagen:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "No se pudo generar la imagen. " + (error.message || error),
      });
    } finally {
      setIsGeneratingImage(false);
    }
  };

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
          gender: characterData.gender,
          level: characterData.level,
          avatar: characterData.avatar || null,
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
    <div className="flex items-center justify-center min-h-screen bg-background p-4">
      <Card className="w-full max-w-sm sm:max-w-md lg:max-w-xl">
        <CardHeader className="space-y-1 px-4 sm:px-6">
          <CardTitle className="text-xl sm:text-2xl font-bold text-center">Crear Nuevo Personaje</CardTitle>
          <CardDescription className="text-center text-sm">
            Crea tu personaje para comenzar tu aventura en Pathfinder 2e
          </CardDescription>
        </CardHeader>
        <CardContent className="px-4 sm:px-6">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2 h-9 sm:h-10">
              <TabsTrigger value="manual" className="text-xs sm:text-sm">Crear Manualmente</TabsTrigger>
              <TabsTrigger value="import" className="text-xs sm:text-sm">Importar JSON</TabsTrigger>
            </TabsList>
            
            <TabsContent value="manual">
              <form onSubmit={handleSubmit}>
                <div className="grid gap-3 sm:gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="name" className="text-sm">Nombre del Personaje</Label>
                    <Input 
                      id="name" 
                      name="name"
                      placeholder="Nombre de tu personaje" 
                      required 
                      value={characterData.name}
                      onChange={handleInputChange}
                      className="h-9 sm:h-10"
                    />
                  </div>
                  
                  <div className="grid gap-2">
                    <Label htmlFor="race" className="text-sm">Raza</Label>
                    <Select 
                      value={characterData.race} 
                      onValueChange={(value) => handleSelectChange("race", value)}
                    >
                      <SelectTrigger id="race" className="h-9 sm:h-10">
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
                    <Label htmlFor="class" className="text-sm">Clase</Label>
                    <Select 
                      value={characterData.class} 
                      onValueChange={(value) => handleSelectChange("class", value)}
                    >
                      <SelectTrigger id="class" className="h-9 sm:h-10">
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
                    <Label htmlFor="gender" className="text-sm">Género</Label>
                    <Select 
                      value={characterData.gender} 
                      onValueChange={(value) => handleSelectChange("gender", value)}
                    >
                      <SelectTrigger id="gender" className="h-9 sm:h-10">
                        <SelectValue placeholder="Selecciona un género" />
                      </SelectTrigger>
                      <SelectContent>
                        {genderOptions.map((gender) => (
                          <SelectItem key={gender} value={gender}>
                            {gender}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="grid gap-2">
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
                      <Label htmlFor="avatar" className="text-sm">Avatar</Label>
                      <Button 
                        type="button" 
                        variant="outline" 
                        onClick={generateCharacterImage}
                        disabled={isGeneratingImage || !characterData.name}
                        size="sm"
                        className="text-xs sm:text-sm h-8 sm:h-9"
                      >
                        {isGeneratingImage ? (
                          <>
                            <Loader2 className="mr-2 h-3 w-3 sm:h-4 sm:w-4 animate-spin" />
                            Generando...
                          </>
                        ) : "Generar imagen"}
                      </Button>
                    </div>
                    
                    {characterData.avatar ? (
                      <div className="relative w-full h-48 sm:h-64 border rounded-md overflow-hidden">
                        <Image 
                          src={characterData.avatar} 
                          alt="Avatar del personaje"
                          fill
                          style={{ objectFit: 'contain' }}
                        />
                      </div>
                    ) : (
                      <div className="w-full h-48 sm:h-64 border rounded-md flex items-center justify-center bg-muted">
                        <p className="text-muted-foreground text-center px-4 text-sm">
                          {isGeneratingImage 
                            ? "Generando y subiendo imagen..." 
                            : "Genera una imagen para tu personaje o sube una propia"}
                        </p>
                      </div>
                    )}
                    
                    <p className="text-xs text-muted-foreground mt-1">
                      O sube tu propia imagen
                    </p>
                    <Input 
                      id="avatar" 
                      type="file" 
                      accept="image/*"
                      onChange={handleAvatarChange}
                      className="h-9 sm:h-10"
                    />
                  </div>
                  
                  <Button type="submit" className="w-full h-10 sm:h-11 text-sm" disabled={isLoading}>
                    {isLoading ? "Creando personaje..." : "Crear Personaje"}
                  </Button>
                </div>
              </form>
            </TabsContent>
            
            <TabsContent value="import">
              <div className="grid gap-4 sm:gap-6">
                <div className="grid gap-2">
                  <Label htmlFor="jsonFile" className="text-sm">Archivo JSON de Pathfinder</Label>
                  <Input 
                    id="jsonFile" 
                    type="file" 
                    accept=".json"
                    ref={fileInputRef}
                    onChange={handleJsonImport}
                    className="h-9 sm:h-10"
                  />
                  <p className="text-xs text-muted-foreground">
                    Importa un archivo JSON de personaje creado en Pathfinder Builder 2e
                  </p>
                </div>
                
                {jsonError && (
                  <Alert variant="destructive">
                    <AlertDescription className="text-sm">{jsonError}</AlertDescription>
                  </Alert>
                )}
                
                {importedCharacter && (
                  <div className="border p-3 sm:p-4 rounded-md bg-muted">
                    <h3 className="font-semibold mb-2 text-sm sm:text-base">Personaje Detectado:</h3>
                    <div className="text-sm space-y-1">
                      <p><strong>Nombre:</strong> {importedCharacter.build.name}</p>
                      <p><strong>Clase:</strong> {importedCharacter.build.class}</p>
                      <p><strong>Raza:</strong> {importedCharacter.build.ancestry}</p>
                      <p><strong>Nivel:</strong> {importedCharacter.build.level}</p>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-2 mt-4">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={resetJsonImport}
                        className="h-9 sm:h-10 text-sm"
                      >
                        Cancelar
                      </Button>
                      <Button
                        type="button"
                        variant="default"
                        onClick={handleSubmit}
                        disabled={isLoading}
                        className="h-9 sm:h-10 text-sm"
                      >
                        {isLoading ? "Importando..." : "Importar Personaje"}
                      </Button>
                    </div>
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