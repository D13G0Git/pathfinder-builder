"use client"

import { useState, useEffect } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { toast } from "sonner"
import { supabase } from "@/lib/supabase"
import { Suspense } from "react"
import { getCharacterBuild } from "@/lib/character-builds"
import { Sidebar } from "@/components/sidebar"

// Importar componentes del diseño de prueba pero actualizados
import { GameInterface } from "@/components/game-interface"

interface Character {
  id: string
  name: string
  class: string
  race: string
  level: number
  avatar: string | null
  gender: string
}

interface Adventure {
  id: string
  name: string
  description: string
  current_stage: number
  total_stages: number
  status: string
  character_id: string
}

interface GameScenario {
  id: string
  adventure_id: string
  scenario_number: number
  title: string
  description: string
  image_url: string | null
  choice_1: string
  choice_2: string
  choice_3: string | null
  choice_4: string | null
  result_1: string | null
  result_2: string | null
  result_3: string | null
  result_4: string | null
}

interface PlayerProgress {
  current_scenario_number: number
  character_stats: {
    health: number
    gold: number
    experience: number
    strength: number
  }
}

export default function GamePage() {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 md:ml-64">
        <Suspense fallback={<div className="flex justify-center items-center h-screen">Cargando aventura...</div>}>
          <GameContent />
        </Suspense>
      </main>
    </div>
  )
}

function GameContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const characterId = searchParams.get('character')
  const adventureId = searchParams.get('adventure')
  
  const [character, setCharacter] = useState<Character | null>(null)
  const [adventure, setAdventure] = useState<Adventure | null>(null)
  const [currentScenario, setCurrentScenario] = useState<GameScenario | null>(null)
  const [playerProgress, setPlayerProgress] = useState<PlayerProgress | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isAuthenticating, setIsAuthenticating] = useState(true)
  const [result, setResult] = useState<string | null>(null)
  const [user, setUser] = useState<any>(null)
  const [showContinueButton, setShowContinueButton] = useState(false)
  const [pendingNextScenario, setPendingNextScenario] = useState<number | null>(null)
  const [pendingUpdatedStats, setPendingUpdatedStats] = useState<any>(null)

  // Cargar información del usuario autenticado
  useEffect(() => {
    const loadUserData = async () => {
      try {
        const { data, error } = await supabase.auth.getUser()
        
        if (error) throw error
        
        if (data?.user) {
          setUser(data.user)
        } else {
          // Si no hay usuario autenticado, redirigir al login
          toast.error("Error de autenticación", {
            description: "Debes iniciar sesión para jugar",
          })
          router.push("/login")
        }
      } catch (error: any) {
        console.error("Error al cargar el usuario:", error)
        toast.error("Error de autenticación", {
          description: "Debes iniciar sesión para jugar",
        })
        router.push("/login")
      } finally {
        setIsAuthenticating(false)
      }
    }

    loadUserData()
  }, [router])

  useEffect(() => {
    if (isAuthenticating || !user) {
      return // Esperar a que se complete la autenticación
    }

    const initializeGame = async () => {
      try {
        if (adventureId && characterId) {
          await loadExistingAdventure(adventureId, user.id)
        } else if (characterId) {
          await createNewAdventure(characterId, user.id)
        } else {
          toast.error("Error", {
            description: "No se especificó un personaje para el juego",
          })
          router.push("/characters")
        }
      } catch (error: any) {
        console.error("Error inicializando juego:", error)
        toast.error("Error", {
          description: "No se pudo cargar la aventura. Intenta de nuevo."
        })
        router.push("/characters")
      } finally {
        setIsLoading(false)
      }
    }

    initializeGame()
  }, [characterId, adventureId, router, user, isAuthenticating])

  const loadExistingAdventure = async (advId: string, userId: string) => {
    // Cargar aventura existente con progreso
    const { data: advData, error: advError } = await supabase
      .from('adventures')
      .select(`
        *,
        character:characters(*)
      `)
      .eq('id', advId)
      .eq('user_id', userId)
      .single()

    if (advError) throw advError

    setAdventure(advData)
    setCharacter(advData.character)

    // Cargar progreso del jugador
    const { data: progressData, error: progressError } = await supabase
      .from('player_scenario_progress')
      .select('*')
      .eq('adventure_id', advId)
      .eq('user_id', userId)
      .single()

    if (progressError && progressError.code !== 'PGRST116') throw progressError

    if (progressData) {
      setPlayerProgress(progressData)
      await loadScenario(advId, progressData.current_scenario_number, userId)
    } else {
      // Crear nuevo progreso si no existe
      await createPlayerProgress(advId, userId)
    }
  }

  const createNewAdventure = async (charId: string, userId: string) => {
    // Cargar datos del personaje
    const { data: charData, error: charError } = await supabase
      .from('characters')
      .select('*')
      .eq('id', charId)
      .eq('user_id', userId)
      .single()

    if (charError) throw charError

    setCharacter(charData)

    // Crear nueva aventura
    const adventureName = `Aventura de ${charData.name}`
    const adventureDescription = `Una nueva aventura épica con ${charData.name}, el ${charData.race} ${charData.class}`

    const { data: newAdventure, error: adventureError } = await supabase
      .from('adventures')
      .insert({
        user_id: userId,
        character_id: charId,
        name: adventureName,
        description: adventureDescription,
        current_stage: 1,
        total_stages: 5,
        status: 'in_progress'
      })
      .select()
      .single()

    if (adventureError) throw adventureError

    setAdventure(newAdventure)

    // Crear escenarios para esta aventura (mockeados por ahora)
    await createGameScenarios(newAdventure.id, charData)

    // Crear progreso inicial del jugador
    await createPlayerProgress(newAdventure.id, userId)
  }

  const createGameScenarios = async (advId: string, character: Character) => {
    // Escenarios con placeholders que se procesarán dinámicamente
    const scenarios = [
      {
        adventure_id: advId,
        scenario_number: 1,
        title: "El Cruce Hacia Corazondelobo",
        description: `Mientras ${character?.name} se acerca a la bulliciosa ciudad de Corazondelobo, un cruce de caminos se presenta. Una de las sendas parece bien transitada, la otra, cubierta de maleza y misterio. Se rumorea que la senda menos usada lleva a atajos, pero también a peligros inesperados. La vibrante energía de la ciudad llama a ${character?.name}, pero la promesa de un camino inexplorado tienta al aventurero.`,
        image_url: "/scenarios/1-1.png",
        choice_1: "Tomar el camino principal hacia Corazondelobo.",
        choice_2: "Explorar el sendero cubierto de maleza, buscando un atajo.",
        choice_3: "Buscar un mapa o preguntar a los viajeros sobre ambos caminos.",
        choice_4: "Acampar y decidir por la mañana, observando los caminos.",
        result_1: `${character?.name} llega a Corazondelobo sin incidentes. La ciudad es tan grande como se esperaba, ofreciendo muchas oportunidades. Tu carisma aumenta por las interacciones sociales.`,
        result_2: `El sendero oculto lleva a ${character?.name} a una antigua ruina. No es un atajo, pero hay indicios de tesoros. Tu percepción revela un cofre oculto con 30 monedas de oro.`,
        result_3: `${character?.name} consigue un mapa rudimentario y descubre que el sendero es más largo, pero contiene una cueva conocida por sus cristales mágicos. Tu conocimiento arcano aumenta.`,
        result_4: `Durante la noche, ${character?.name} observa que algunas criaturas nocturnas usan el sendero oculto. Tu habilidad de supervivencia te ayuda a evitar un encuentro peligroso. Decides evitar ese camino.`
      },
      {
        adventure_id: advId,
        scenario_number: 2,
        title: "La Agitación de Corazondelobo",
        description: `Tras un viaje sin incidentes, ${character?.name} llega a las puertas de Corazondelobo. La ciudad es un hervidero de actividad, con mercaderes gritando ofertas, guardias patrullando y el constante murmullo de una multitud. Un cartel de búsqueda de 'héroes competentes' llama la atención de ${character?.name} cerca de la plaza central. Tu ambición siente un cosquilleo ante la perspectiva de fama y fortuna, pero tu cautela sugiere investigar primero.`,
        image_url: "/scenarios/1-1-1.png",
        choice_1: "Dirigirse directamente a la taberna 'El Jabalí Gruñón' para escuchar rumores.",
        choice_2: "Investigar el cartel de búsqueda y dirigirse al lugar indicado.",
        choice_3: "Buscar un gremio de aventureros o una figura de autoridad para más información.",
        choice_4: "Explorar los mercados y distritos de la ciudad antes de tomar cualquier decisión.",
        result_1: `${character?.name} escucha a los parroquianos quejarse de goblins en las afueras. Parece una misión sencilla para tu fuerza.`,
        result_2: `La persona que puso el cartel es un noble desesperado por un problema con criaturas en sus tierras. La recompensa es grande. Tu brújula moral debe decidir si es ético.`,
        result_3: `Un capitán de la guardia es reticente a compartir información, pero menciona un misterio en las alcantarillas. Tu intelecto se siente intrigado.`,
        result_4: `${character?.name} descubre un puesto de un mago excéntrico que ofrece un artefacto misterioso a cambio de un favor. Tu curiosidad se despierta.`
      },
      {
        adventure_id: advId,
        scenario_number: 3,
        title: "Susurros en la Taberna",
        description: `${character?.name} empuja la pesada puerta de 'El Jabalí Gruñón'. El lugar está lleno de humo y el estruendo de voces, risas y la música de un laúd desafinado. El aroma a estofado y cerveza llena el aire. En un rincón, un grupo de parroquianos discute acaloradamente sobre extraños avistamientos de goblins en los caminos a las afueras de la ciudad, interrumpiendo el comercio y los viajes. Un anciano de barba cana, con aspecto de cazador, parece saber más que los demás, pero habla en voz baja. Tu curiosidad se enciende, y tu percepción te indica que hay algo más en esta historia.`,
        image_url: "/scenarios/1-1-1-1.png",
        choice_1: "Pedir una bebida y sentarse cerca del grupo para escuchar.",
        choice_2: "Acercarse al anciano y preguntarle directamente sobre los goblins.",
        choice_3: "Ofrecerse a ayudar a los parroquianos a cambio de información detallada.",
        choice_4: "Buscar un tablero de anuncios dentro de la taberna para misiones locales.",
        result_1: `${character?.name} escucha que los goblins son inusualmente organizados y parecen buscar algo específico en el bosque. Tu conocimiento táctico aumenta.`,
        result_2: `El anciano, llamado Borin, revela que los goblins no son la verdadera amenaza, sino algo más grande y oscuro que los está empujando. Tu comprensión se expande.`,
        result_3: `Los parroquianos están agradecidos y comparten todo lo que saben, incluyendo la ubicación de un campamento goblin recién establecido. Tu reputación en la taberna mejora.`,
        result_4: `El tablero de anuncios tiene una misión de 'Recuperación de Suministros Perdidos' cerca del área de los goblins, una forma segura de investigar. Tu astucia se ve recompensada.`
      },
      {
        adventure_id: advId,
        scenario_number: 4,
        title: "Una Advertencia Siniestra",
        description: `${character?.name} se acerca a Borin, el anciano cazador, quien, tras un breve momento de recelo, decide compartir la verdad. 'Los goblins son solo las ratas que huyen de un incendio mayor', susurra Borin. 'Algo se ha despertado en las **Profundidades Quebradas**, una antigua fuerza que ha estado dormida. Los goblins están siendo empujados de sus guaridas habituales por ello, y sus ataques a los caminos son solo un signo de su desesperación y miedo.' Borin le advierte a ${character?.name} que la situación es mucho más grave de lo que la guardia de la ciudad cree. Tu determinación se fortalece ante la magnitud del problema, pero tu prudencia te insta a la cautela.`,
        image_url: "/scenarios/1-1-1-1-1.png",
        choice_1: "Preguntar a Borin cómo se puede encontrar y detener esa 'antigua fuerza'.",
        choice_2: "Ofrecer ayuda a Borin para investigar las Profundidades Quebradas juntos.",
        choice_3: "Reportar la información a la guardia de la ciudad y pedir su ayuda.",
        choice_4: "Decidir que la amenaza es demasiado grande y concentrarse en misiones más seguras.",
        result_1: `Borin da a ${character?.name} una vaga descripción de una entrada oculta a las Profundidades Quebradas, un lugar que pocos conocen. Tu perspicacia te ayuda a entender las pistas.`,
        result_2: `Borin acepta la ayuda de ${character?.name}, pero advierte que el camino será peligroso y requerirá preparación. Ambos planean reunirse al amanecer. Tu coraje se pone a prueba.`,
        result_3: `La guardia de la ciudad es escéptica, pero la persistencia de ${character?.name} convence a un capitán de enviar un pequeño equipo de reconocimiento. Tu influencia aumenta, pero la acción es lenta.`,
        result_4: `${character?.name} decide evitar el peligro inminente y busca un trabajo seguro en la ciudad, perdiéndose la oportunidad de ser un héroe. Tu seguridad está garantizada, pero tu reputación no crecerá.`
      },
      {
        adventure_id: advId,
        scenario_number: 5,
        title: "El Sendero a la Oscuridad",
        description: `Borin, con una expresión de grave preocupación, saca un **trozo de pergamino arrugado y amarillento** de su zurrón. 'Esto no es un mapa completo', explica, 'sino un fragmento que muestra la entrada a las Profundidades Quebradas. Se rumorea que la entrada principal está custodiada por guardianes olvidados y trampas mortales. Sólo los más audaces y con mejores habilidades se atreven a buscarla'. El pergamino muestra extraños símbolos y un laberinto de túneles apenas legibles. Borin advierte a ${character?.name} que la criatura que está despertando es de una era antigua y que el camino será peligroso, pero es la única esperanza para Corazondelobo. Tu valentía es puesta a prueba, pero tu brújula moral te impulsa a la acción.`,
        image_url: "/scenarios/1-1-1-1-1-1.png",
        choice_1: "Prepararse de inmediato para la expedición a las Profundidades Quebradas.",
        choice_2: "Buscar a un experto en runas o cartografía para interpretar el mapa con más detalle.",
        choice_3: "Intentar reclutar a otros aventureros en la taberna antes de partir.",
        choice_4: "Regresar con la guardia para intentar convencerlos con el fragmento del mapa.",
        result_1: `${character?.name} reúne sus provisiones y equipo, sintiendo la adrenalina del desafío. Tu preparación es crucial para lo que se avecina.`,
        result_2: `Un anciano bibliotecario en Corazondelobo puede descifrar una pequeña parte del mapa, revelando una clave para evitar una trampa. Tu conocimiento de lo arcano es un activo.`,
        result_3: `Algunos aventureros expresan interés, pero la mayoría son escépticos o temerosos ante la mención de las Profundidades Quebradas. Tu liderazgo no es suficiente por ahora.`,
        result_4: `La guardia de la ciudad está ligeramente más convencida, pero aún son lentos en actuar. Tu frustración crece, pero tu persistencia podría valer la pena.`
      }
    ]

    for (const scenario of scenarios) {
      const { error } = await supabase
        .from('game_scenarios')
        .insert(scenario)

      if (error) {
        console.error("Error creando escenario:", error)
      }
    }
  }

  const createPlayerProgress = async (advId: string, userId: string) => {
    const initialStats = {
      health: 100,
      gold: 50,
      experience: 0,
      strength: character?.level ? character.level * 2 : 10
    }

    const { data: progressData, error } = await supabase
      .from('player_scenario_progress')
      .insert({
        adventure_id: advId,
        user_id: userId,
        current_scenario_number: 1,
        character_stats: initialStats
      })
      .select()
      .single()

    if (error) throw error

    setPlayerProgress({
      current_scenario_number: 1,
      character_stats: initialStats
    })

    await loadScenario(advId, 1,userId)
  }

  const loadScenario = async (advId: string, scenarioNumber: number, userId: string) => {
    const { data: scenarioData, error } = await supabase
      .from('game_scenarios')
      .select('*')
      .eq('adventure_id', advId)
      .eq('scenario_number', scenarioNumber)
      .single()

    if (error || !scenarioData) {
      console.log("No hay más escenarios disponibles. Completando aventura...")
      // Si no hay más escenarios, completar aventura y exportar personaje
      await completeAdventureAndExport(advId)
      return
    }

    // Aplicar placeholders dinámicamente al cargar el escenario
    if (character && scenarioData) {
      const replacePlaceholders = (text: string) => {
        if (!text) return text
        return text
          .replace(/{character\.nombre}/g, character.name)
          .replace(/{character\.aventura}/g, `${character.name} el aventurero`)
          .replace(/{character\.habilidad_social}/g, 'tu CARISMA')
          .replace(/{character\.percepcion}/g, 'tu PERCEPCION')
          .replace(/{character\.conocimiento_magico}/g, 'tu CONOCIMIENTO ARCANO')
          .replace(/{character\.supervivencia}/g, 'tu HABILIDAD DE SUPERVIVENCIA')
          .replace(/{character\.ambicion}/g, 'tu AMBICION')
          .replace(/{character\.precaucion}/g, 'tu PRECAUCION')
          .replace(/{character\.fuerza}/g, 'tu FUERZA')
          .replace(/{character\.moral}/g, 'tu BRUJULA MORAL')
          .replace(/{character\.intelecto}/g, 'tu INTELIGENCIA')
          .replace(/{character\.curiosidad}/g, 'tu CURIOSIDAD')
          .replace(/{character\.conocimiento_tactico}/g, 'tu CONOCIMIENTO TACTICO')
          .replace(/{character\.comprension}/g, 'tu COMPRENSION')
          .replace(/{character\.reputacion}/g, 'tu REPUTACION')
          .replace(/{character\.astucia}/g, 'tu ASTUCIA')
          .replace(/{character\.determinacion}/g, 'tu DETERMINACION')
          .replace(/{character\.prudencia}/g, 'tu PRUDENCIA')
          .replace(/{character\.perspicacia}/g, 'tu PERSPICACIA')
          .replace(/{character\.coraje}/g, 'tu CORAJE')
          .replace(/{character\.influencia}/g, 'tu INFLUENCIA')
          .replace(/{character\.seguridad}/g, 'tu SEGURIDAD')
          .replace(/{character\.habilidad}/g, 'tus HABILIDADES')
          .replace(/{character\.valentia}/g, 'tu VALENTIA')
          .replace(/{character\.preparacion}/g, 'tu PREPARACION')
          .replace(/{character\.conocimiento_antiguo}/g, 'tu CONOCIMIENTO DE LO ARCANO')
          .replace(/{character\.liderazgo}/g, 'tu LIDERAZGO')
          .replace(/{character\.frustracion}/g, 'tu FRUSTRACION')
          .replace(/{character\.persistencia}/g, 'tu PERSISTENCIA')
      }

      // Aplicar placeholders a todos los textos del escenario
      scenarioData.description = replacePlaceholders(scenarioData.description)
      scenarioData.result_1 = replacePlaceholders(scenarioData.result_1)
      scenarioData.result_2 = replacePlaceholders(scenarioData.result_2)
      scenarioData.result_3 = replacePlaceholders(scenarioData.result_3)
      scenarioData.result_4 = replacePlaceholders(scenarioData.result_4)
    }

    setCurrentScenario(scenarioData)
  }

  const handleChoice = async (choice: "topLeft" | "bottomLeft" | "topRight" | "bottomRight") => {
    if (!currentScenario || !adventure || !playerProgress || !user) return

    const choiceIndex = {
      topLeft: 1,
      bottomLeft: 2,
      topRight: 3,
      bottomRight: 4
    }[choice]

    const resultKey = `result_${choiceIndex}` as keyof GameScenario
    const resultText = currentScenario[resultKey] as string

    // Validar que la opción existe
    if (!resultText) {
      toast.error("Opción no disponible")
      return
    }

    // Mostrar resultado
    setResult(resultText)

    // Actualizar estadísticas del personaje basado en la elección y escenario
    const updatedStats = { ...playerProgress.character_stats }

    // Escenario 1: El Cruce Hacia Corazondelobo
    if (currentScenario.scenario_number === 1) {
      switch (choice) {
        case "topLeft": // Camino principal
          updatedStats.experience += 10
          break
        case "bottomLeft": // Sendero oculto
          updatedStats.gold += 30
          updatedStats.experience += 15
          break
        case "topRight": // Buscar mapa
          updatedStats.experience += 20
          break
        case "bottomRight": // Acampar
          updatedStats.health += 5
          updatedStats.experience += 5
          break
      }
    }
    // Escenario 2: La Agitación de Corazondelobo
    else if (currentScenario.scenario_number === 2) {
      switch (choice) {
        case "topLeft": // Taberna
          updatedStats.experience += 15
          break
        case "bottomLeft": // Cartel de búsqueda
          updatedStats.gold += 25
          updatedStats.experience += 20
          break
        case "topRight": // Gremio/autoridad
          updatedStats.experience += 25
          break
        case "bottomRight": // Explorar mercados
          updatedStats.gold += 10
          updatedStats.experience += 10
          break
      }
    }
    // Escenario 3: Susurros en la Taberna
    else if (currentScenario.scenario_number === 3) {
      switch (choice) {
        case "topLeft": // Escuchar cerca
          updatedStats.experience += 20
          break
        case "bottomLeft": // Hablar con Borin
          updatedStats.experience += 30
          break
        case "topRight": // Ofrecer ayuda
          updatedStats.experience += 25
          updatedStats.gold += 15
          break
        case "bottomRight": // Tablero de anuncios
          updatedStats.experience += 15
          updatedStats.gold += 20
          break
      }
    }
    // Escenario 4: Una Advertencia Siniestra
    else if (currentScenario.scenario_number === 4) {
      switch (choice) {
        case "topLeft": // Preguntar sobre antigua fuerza
          updatedStats.experience += 35
          break
        case "bottomLeft": // Ofrecer ayuda a Borin
          updatedStats.strength += 1
          updatedStats.experience += 40
          break
        case "topRight": // Reportar a la guardia
          updatedStats.experience += 25
          updatedStats.gold += 15
          break
        case "bottomRight": // Misiones más seguras
          updatedStats.gold += 30
          updatedStats.experience += 10
          break
      }
    }
    // Escenario 5: El Sendero a la Oscuridad
    else if (currentScenario.scenario_number === 5) {
      switch (choice) {
        case "topLeft": // Prepararse inmediatamente
          updatedStats.strength += 2
          updatedStats.experience += 50
          break
        case "bottomLeft": // Buscar experto
          updatedStats.experience += 40
          updatedStats.health += 10
          break
        case "topRight": // Reclutar aventureros
          updatedStats.experience += 30
          updatedStats.gold += 20
          break
        case "bottomRight": // Regresar con la guardia
          updatedStats.experience += 20
          updatedStats.gold += 25
          break
      }
    }

    // Actualizar inmediatamente el progreso en la UI
    setPlayerProgress({
      current_scenario_number: playerProgress.current_scenario_number,
      character_stats: updatedStats
    })

    // Guardar decisión (sin mostrar error si falla)
    try {
      await saveDecision(currentScenario.id, choiceIndex, resultText)
    } catch (error) {
      console.warn("No se pudo guardar la decisión:", error)
    }

    // Preparar datos para el siguiente escenario
    const nextScenarioNumber = currentScenario.scenario_number + 1
    setPendingNextScenario(nextScenarioNumber)
    setPendingUpdatedStats(updatedStats)
    
    // Mostrar botón de continuar
    setShowContinueButton(true)
  }

  const handleContinue = async () => {
    if (!adventure || !pendingNextScenario || !pendingUpdatedStats) return

    setShowContinueButton(false)
    setResult(null)

    // Actualizar progreso del jugador en la base de datos
    await updatePlayerProgress(adventure.id, pendingNextScenario, pendingUpdatedStats)
    
    // Cargar siguiente escenario
    await loadScenario(adventure.id, pendingNextScenario, adventure.character_id)
    
    // Limpiar estados pendientes
    setPendingNextScenario(null)
    setPendingUpdatedStats(null)
  }

  const saveDecision = async (scenarioId: string, choiceIndex: number, result: string) => {
    if (!character) return

    try {
      const { error } = await supabase
        .from('decisions')
        .insert({
          character_id: character.id,
          scenario_id: scenarioId,
          choice_id: `choice_${choiceIndex}`,
          result: result
        })

      if (error) {
        console.warn("Error guardando decisión (tabla decisions puede no existir):", error)
      }
    } catch (error) {
      console.warn("Tabla decisions no disponible:", error)
    }
  }

  const updatePlayerProgress = async (advId: string, nextScenario: number, newStats: any) => {
    if (!user) return

    const { error } = await supabase
      .from('player_scenario_progress')
      .update({
        current_scenario_number: nextScenario,
        character_stats: newStats,
        last_played: new Date().toISOString()
      })
      .eq('adventure_id', advId)
      .eq('user_id', user.id)

    if (error) {
      console.error("Error actualizando progreso:", error)
    } else {
      setPlayerProgress({
        current_scenario_number: nextScenario,
        character_stats: newStats
      })

      // Actualizar también el progreso de la aventura
      await supabase
        .from('adventures')
        .update({
          current_stage: nextScenario,
          updated_at: new Date().toISOString()
        })
        .eq('id', advId)
    }
  }

  const generateCharacterJSON = () => {
    if (!character || !playerProgress) return null

    const characterData = {
      version: "1.0",
      exportDate: new Date().toISOString(),
      character: {
        id: character.id,
        name: character.name,
        class: character.class,
        race: character.race,
        level: character.level,
        gender: character.gender,
        avatar: character.avatar
      },
      stats: {
        health: playerProgress.character_stats.health,
        gold: playerProgress.character_stats.gold,
        experience: playerProgress.character_stats.experience,
        strength: playerProgress.character_stats.strength
      },
      adventure: {
        id: adventure?.id,
        name: adventure?.name,
        description: adventure?.description,
        completed: true,
        completedAt: new Date().toISOString(),
        finalStage: playerProgress.current_scenario_number
      }
    }

    return characterData
  }

  const downloadCharacterJSON = () => {
    const characterData = generateCharacterJSON()
    if (!characterData) return

    const jsonString = JSON.stringify(characterData, null, 2)
    const blob = new Blob([jsonString], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    
    const link = document.createElement('a')
    link.href = url
    link.download = `${character?.name}_aventura_completada.json`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  const completeAdventureAndExport = async (advId: string) => {
    if (!character || !playerProgress || !adventure) return

    try {
      // Actualizar aventura como completada
      const { error } = await supabase
        .from('adventures')
        .update({
          status: 'completed',
          current_stage: adventure.total_stages || 5,
          completed_at: new Date().toISOString()
        })
        .eq('id', advId)

      if (error) {
        console.error("Error completando aventura:", error)
      }

      // Mostrar interfaz de exportación
      toast.success("¡Aventura completada!", {
        description: "Tu aventura ha sido completada exitosamente. Descarga tu personaje.",
      })

      // Descargar automáticamente el JSON
      downloadCharacterJSON()

      // Redirigir después de un pequeño delay
      setTimeout(() => {
        router.push("/adventures")
      }, 3000)

    } catch (error) {
      console.error("Error al completar aventura:", error)
      toast.error("Error", {
        description: "Hubo un problema al completar la aventura"
      })
    }
  }

  const completeAdventure = async (advId: string) => {
    await completeAdventureAndExport(advId)
  }

  const calculateProgress = () => {
    if (!adventure || !playerProgress) return 0
    return Math.round((playerProgress.current_scenario_number / adventure.total_stages) * 100)
  }

  if (isAuthenticating) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-lg text-muted-foreground">Verificando autenticación...</div>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-lg text-muted-foreground">Cargando tu aventura...</div>
      </div>
    )
  }

  if (!character || !currentScenario || !playerProgress) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-lg text-muted-foreground">Error cargando la aventura</div>
      </div>
    )
  }

  // Preparar datos para el componente GameInterface
  const gameCharacter = {
    name: character.name,
    title: `${character.race} ${character.class}`,
    level: character.level,
    health: playerProgress.character_stats.health,
    gold: playerProgress.character_stats.gold,
    experience: playerProgress.character_stats.experience,
    strength: playerProgress.character_stats.strength,
    avatar: character.avatar || undefined
  }

  const scenario = {
    title: currentScenario.title,
    question: currentScenario.description,
    topLeftOption: currentScenario.choice_1,
    bottomLeftOption: currentScenario.choice_2,
    topRightOption: currentScenario.choice_3 || "Opción no disponible",
    bottomRightOption: currentScenario.choice_4 || "Opción no disponible",
    image: currentScenario.image_url || character.avatar || "/placeholder.svg?height=500&width=800&text=Escenario"
  }

  return (
    <main className="pb-4">
      <GameInterface
        character={gameCharacter}
        scenario={scenario}
        onChoose={handleChoice}
        progress={calculateProgress()}
        result={result || undefined}
        showContinueButton={showContinueButton}
        onContinue={handleContinue}
      />
    </main>
  )
}
