"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import type { Scenario } from "@/lib/mockup-data"
import { supabase } from "@/lib/supabase"
import { useToast } from "@/components/ui/use-toast"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { UserCharacter, UserDecision } from "@/lib/supabase"
import { CharacterExport } from "@/components/character-export"

interface GameScenarioProps {
  initialScenario: Scenario
}

export function GameScenario({ initialScenario }: GameScenarioProps) {
  const [currentScenario, setCurrentScenario] = useState<Scenario>(initialScenario)
  const [user, setUser] = useState<any>(null)
  const [characters, setCharacters] = useState<UserCharacter[]>([])
  const [selectedCharacterId, setSelectedCharacterId] = useState<string>("")
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()
  const [gameFinished, setGameFinished] = useState(false)
  const [userDecisions, setUserDecisions] = useState<UserDecision[]>([])

  // Verificar si el usuario está autenticado
  useEffect(() => {
    const checkUser = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        setUser(user)
        
        if (user) {
          // Cargar personajes del usuario
          const { data, error } = await supabase
            .from('characters')
            .select('*')
            .eq('user_id', user.id)
          
          if (error) throw error
          
          if (data && data.length > 0) {
            setCharacters(data as UserCharacter[])
            setSelectedCharacterId(data[0].id) // Seleccionar el primer personaje por defecto
          }
        }
      } catch (error) {
        console.error('Error al cargar el usuario o personajes:', error)
      } finally {
        setIsLoading(false)
      }
    }
    
    checkUser()
  }, [])

  const handleChoiceClick = async (nextScenarioId: string, choiceId: string) => {
    // Guardar la decisión del usuario en Supabase si está autenticado y tiene un personaje seleccionado
    if (user && selectedCharacterId) {
      try {
        // Preparar el objeto de decisión
        const newDecision = {
          user_id: user.id,
          character_id: selectedCharacterId,
          scenario_id: currentScenario.id,
          choice_id: choiceId,
          created_at: new Date().toISOString()
        };
        
        // Insertar con una única llamada
        const { data, error } = await supabase
          .from('decisions')
          .insert(newDecision)
          .select('id, scenario_id, choice_id, created_at');
        
        if (error) throw error;
        
        // Actualizar estado local y mostrar notificación
        if (data && data.length > 0) {
          const newUserDecisions = [...userDecisions, data[0] as UserDecision];
          setUserDecisions(newUserDecisions);
          
          // Actualizar nivel del personaje basado en progreso (cada 3 decisiones sube un nivel)
          const newLevel = Math.min(20, Math.floor(newUserDecisions.length / 3) + 1);
          const { error: updateError } = await supabase
            .from('characters')
            .update({ level: newLevel })
            .eq('id', selectedCharacterId);
            
          if (updateError) console.error('Error al actualizar nivel:', updateError);
        }
        
        toast({
          title: "Decisión guardada",
          description: "Tu elección ha sido registrada en tu aventura.",
        });
      } catch (error: any) {
        console.error('Error al guardar la decisión:', error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "No se pudo guardar tu decisión. " + (error.message || "Inténtalo de nuevo."),
        });
      }
    } else if (!user) {
      toast({
        variant: "destructive",
        title: "No has iniciado sesión",
        description: "Inicia sesión para guardar tu progreso.",
      });
    } else if (!selectedCharacterId) {
      toast({
        variant: "destructive",
        title: "Personaje no seleccionado",
        description: "Selecciona un personaje para continuar la aventura.",
      });
    }

    // En un app real, obtendrías el próximo escenario de una API
    // Para esta simulación, generamos uno
    const mockNextScenario: Scenario = {
      id: nextScenarioId,
      title: `Scenario ${nextScenarioId}`,
      image: `/placeholder.svg?height=400&width=800&text=Scenario+${nextScenarioId}`,
      description: `You've chosen a path that led you to scenario ${nextScenarioId}. The adventure continues as you face new challenges and opportunities in your quest.`,
      choices: [
        {
          id: `${nextScenarioId}-1`,
          text: "Explore the mysterious cave",
          nextScenarioId: `${nextScenarioId}-1`,
        },
        {
          id: `${nextScenarioId}-2`,
          text: "Follow the winding path through the forest",
          nextScenarioId: `${nextScenarioId}-2`,
        },
        {
          id: `${nextScenarioId}-3`,
          text: "Approach the village in the distance",
          nextScenarioId: `${nextScenarioId}-3`,
        },
      ],
    }

    // Comprobar si este es un escenario final (podríamos tener una lógica más compleja aquí)
    // Por ahora, simplemente asumimos que después de 5 decisiones, el juego termina
    if (userDecisions.length >= 4) {
      const finalScenario: Scenario = {
        id: "final",
        title: "El final de tu aventura",
        image: `/placeholder.svg?height=400&width=800&text=Final+Scenario`,
        description: `Has llegado al final de tu aventura. Las decisiones que has tomado han formado a tu personaje y te han traído hasta aquí. Ahora puedes exportar tu personaje para usarlo en futuras aventuras o en Foundry VTT.`,
        choices: [], // Sin más opciones - es el final
      }
      setCurrentScenario(finalScenario)
      setGameFinished(true)
    } else {
      setCurrentScenario(mockNextScenario)
    }

    // Scroll to top when changing scenarios
    window.scrollTo(0, 0)
  }

  // Cargar las decisiones del usuario al iniciar
  useEffect(() => {
    if (user && selectedCharacterId) {
      const loadUserDecisions = async () => {
        try {
          const { data, error } = await supabase
            .from('decisions')
            .select('*')
            .eq('character_id', selectedCharacterId)
            .order('created_at', { ascending: true })
          
          if (error) throw error
          
          if (data) {
            setUserDecisions(data as UserDecision[])
          }
        } catch (error) {
          console.error('Error al cargar las decisiones del usuario:', error)
        }
      }
      
      loadUserDecisions()
    }
  }, [user, selectedCharacterId])

  if (isLoading) {
    return <div className="flex justify-center items-center h-screen">Cargando...</div>
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {user ? (
        <div className="mb-6 p-4 bg-muted rounded-lg">
          <h2 className="text-xl font-semibold mb-2">Tu Aventura</h2>
          {characters.length > 0 ? (
            <div className="space-y-2">
              <p>Selecciona tu personaje:</p>
              <Select 
                value={selectedCharacterId} 
                onValueChange={setSelectedCharacterId}
              >
                <SelectTrigger className="w-full max-w-xs">
                  <SelectValue placeholder="Selecciona un personaje" />
                </SelectTrigger>
                <SelectContent>
                  {characters.map((character) => (
                    <SelectItem key={character.id} value={character.id}>
                      {character.name} - {character.class} {character.race} (Nivel {character.level})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          ) : (
            <div className="text-amber-500">
              <p>No tienes personajes creados.</p>
              <Button variant="outline" className="mt-2" onClick={() => window.location.href = "/character-create"}>
                Crear un personaje
              </Button>
            </div>
          )}
        </div>
      ) : (
        <div className="mb-6 p-4 bg-muted rounded-lg text-amber-500">
          <p>Inicia sesión para guardar tu progreso y tus decisiones.</p>
          <Button variant="outline" className="mt-2" onClick={() => window.location.href = "/login"}>
            Iniciar Sesión
          </Button>
        </div>
      )}

      <h1 className="text-3xl font-bold mb-6">{currentScenario.title}</h1>

      <div className="relative w-full h-[400px] rounded-lg overflow-hidden mb-6">
        <Image
          src={currentScenario.image || "/placeholder.svg"}
          alt={currentScenario.title}
          fill
          className="object-cover"
          priority
        />
      </div>

      <div className="prose dark:prose-invert max-w-none mb-8">
        <p className="text-lg">{currentScenario.description}</p>
      </div>

      {!gameFinished ? (
        <>
          <h2 className="text-xl font-semibold mb-4">¿Qué vas a hacer?</h2>

          <div className="space-y-4">
            {currentScenario.choices.map((choice) => (
              <Card
                key={choice.id}
                className="hover:bg-accent transition-colors cursor-pointer"
                onClick={() => handleChoiceClick(choice.nextScenarioId, choice.id)}
              >
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <span className="text-lg">{choice.text}</span>
                    <Button variant="ghost" size="sm">
                      Elegir
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </>
      ) : (
        <div className="mt-8">
          {user && selectedCharacterId && characters.length > 0 ? (
            <CharacterExport 
              character={characters.find(c => c.id === selectedCharacterId) as UserCharacter} 
              decisions={userDecisions}
            />
          ) : (
            <div className="text-center p-4 border rounded-md bg-amber-50 dark:bg-amber-950">
              <p className="mb-2">Necesitas iniciar sesión y seleccionar un personaje para exportar tu aventura.</p>
              <Button onClick={() => window.location.href = "/login"}>
                Iniciar sesión
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
