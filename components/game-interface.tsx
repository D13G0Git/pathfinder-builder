"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Heart, Star, Coins, Trophy, Sword, ArrowRight } from "lucide-react"
import { cn } from "@/lib/utils"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import Image from "next/image"

interface GameInterfaceProps {
  character: {
    name: string
    title: string
    level: number
    health: number
    gold: number
    experience: number
    strength: number
    avatar?: string
  }
  scenario: {
    question: string
    title?: string
    topLeftOption: string
    bottomLeftOption: string
    topRightOption: string
    bottomRightOption: string
    image: string
    result?: string
  }
  onChoose: (choice: "topLeft" | "bottomLeft" | "topRight" | "bottomRight") => void
  progress?: number
  showContinueButton?: boolean
  onContinue?: () => void
  choiceDisabled?: boolean
}

// Estilos CSS personalizados para efectos 3D y móvil
const styles = `
  .transform-3d {
    transform-style: preserve-3d;
  }
  
  .rotate-3d-tl {
    transform: rotateX(5deg) rotateY(5deg) scale(1.02);
    box-shadow: -5px -5px 20px rgba(0, 0, 0, 0.2);
  }
  
  .rotate-3d-bl {
    transform: rotateX(-5deg) rotateY(5deg) scale(1.02);
    box-shadow: -5px 5px 20px rgba(0, 0, 0, 0.2);
  }
  
  .rotate-3d-tr {
    transform: rotateX(5deg) rotateY(-5deg) scale(1.02);
    box-shadow: 5px -5px 20px rgba(0, 0, 0, 0.2);
  }
  
  .rotate-3d-br {
    transform: rotateX(-5deg) rotateY(-5deg) scale(1.02);
    box-shadow: 5px 5px 20px rgba(0, 0, 0, 0.2);
  }
  
  .perspective-container {
    perspective: 800px;
    perspective-origin: center center;
  }

  @media (max-width: 768px) {
    .mobile-choice-button {
      min-height: 44px;
      touch-action: manipulation;
    }
    
    .mobile-option-card {
      min-height: 60px;
    }
  }
`

export function GameInterface({ character, scenario, onChoose, progress = 33, showContinueButton = false, onContinue, choiceDisabled = false }: GameInterfaceProps) {
  const [hoverArea, setHoverArea] = useState<"none" | "topLeft" | "bottomLeft" | "topRight" | "bottomRight">("none")
  const [currentOptionText, setCurrentOptionText] = useState("")
  const [typewriterText, setTypewriterText] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [selectedOption, setSelectedOption] = useState<"none" | "topLeft" | "bottomLeft" | "topRight" | "bottomRight">("none")
  const cardRef = useRef<HTMLDivElement>(null)
  const typingTimer = useRef<number | null>(null)

  // Detectar si estamos en móvil
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  // Efecto typewriter mejorado con limpieza correcta de timeouts
  useEffect(() => {
    if (currentOptionText && currentOptionText.length > 0) {
      setIsTyping(true)
      setTypewriterText("")
      
      let index = 0
      const typeText = () => {
        if (index <= currentOptionText.length) {
          setTypewriterText(currentOptionText.slice(0, index))
          index++
          
          if (index <= currentOptionText.length) {
            typingTimer.current = window.setTimeout(typeText, 25)
          } else {
            setIsTyping(false)
            typingTimer.current = null
          }
        }
      }
      
      typingTimer.current = window.setTimeout(typeText, 50)
      
      return () => {
        if (typingTimer.current !== null) {
          clearTimeout(typingTimer.current)
          typingTimer.current = null
        }
        setIsTyping(false)
      }
    } else {
      setTypewriterText("")
      setIsTyping(false)
    }
  }, [currentOptionText])

  // Función para manejar hover (solo desktop)
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (cardRef.current && !choiceDisabled && !isMobile) {
      const rect = cardRef.current.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top
      const cardWidth = rect.width
      const cardHeight = rect.height

      let newHoverArea: typeof hoverArea = "none"

      if (x < cardWidth / 2) {
        if (y < cardHeight / 2) {
          newHoverArea = "topLeft"
        } else {
          newHoverArea = "bottomLeft"
        }
      } else {
        if (y < cardHeight / 2) {
          newHoverArea = "topRight"
        } else {
          newHoverArea = "bottomRight"
        }
      }

      setHoverArea(newHoverArea)

      const optionTexts = {
        topLeft: scenario.topLeftOption,
        bottomLeft: scenario.bottomLeftOption,
        topRight: scenario.topRightOption,
        bottomRight: scenario.bottomRightOption,
        none: ""
      }

      const newOptionText = optionTexts[newHoverArea]
      if (newOptionText !== currentOptionText) {
        setCurrentOptionText(newOptionText)
      }
    }
  }

  const handleMouseLeave = () => {
    if (!choiceDisabled && !isMobile) {
      setHoverArea("none")
      setCurrentOptionText("")
    }
  }

  // Función para manejar selección de opción en móvil
  const handleMobileOptionSelect = (option: "topLeft" | "bottomLeft" | "topRight" | "bottomRight") => {
    if (choiceDisabled) return
    
    setSelectedOption(option)
    const optionTexts = {
      topLeft: scenario.topLeftOption,
      bottomLeft: scenario.bottomLeftOption,
      topRight: scenario.topRightOption,
      bottomRight: scenario.bottomRightOption
    }
    setCurrentOptionText(optionTexts[option])
  }

  // Función para confirmar elección en móvil
  const handleMobileChoiceConfirm = () => {
    if (selectedOption !== "none" && !choiceDisabled) {
      onChoose(selectedOption)
    }
  }

  // Función para manejar click (desktop)
  const handleClick = () => {
    if (hoverArea !== "none" && !choiceDisabled && !isMobile) {
      onChoose(hoverArea)
    }
  }

  return (
    <div className="h-full w-full">
      {/* Inyectar estilos CSS personalizados */}
      <style jsx>{styles}</style>
      
      {/* Header compacto con información del personaje y progreso */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center gap-3 lg:gap-6 mb-4 lg:mb-6 px-4 lg:px-6">
        {/* Información del personaje ultra compacta */}
        <Card className="w-full lg:w-80 xl:w-96 border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50">
          <CardContent className="p-3 lg:p-4">
            <div className="flex items-center space-x-3 mb-3">
              {character.avatar ? (
                <div className="relative w-10 h-10 lg:w-12 lg:h-12 rounded-full overflow-hidden border-2 border-gray-200 dark:border-gray-700 flex-shrink-0">
                  <Image
                    src={character.avatar}
                    alt={character.name}
                    fill
                    className="object-cover"
                  />
                </div>
              ) : (
                <div className="w-10 h-10 lg:w-12 lg:h-12 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center flex-shrink-0">
                  <span className="text-sm lg:text-lg">⚔️</span>
                </div>
              )}
              <div className="flex-1 min-w-0">
                <h2 className="text-sm lg:text-base font-bold text-gray-900 dark:text-gray-100 truncate">
                  {character.name}
                </h2>
                <p className="text-xs text-gray-600 dark:text-gray-400 truncate">
                  {character.title}
                </p>
              </div>
              <Badge variant="outline" className="flex items-center gap-1 text-xs flex-shrink-0">
                <Trophy className="h-3 w-3" />
                {progress}%
              </Badge>
            </div>
            
            {/* Stats ultra compactos en una sola fila */}
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center">
                <Star className="h-3 w-3 mr-1 text-amber-500" />
                <span>{character.level}</span>
              </div>
              <div className="flex items-center">
                <Heart className="h-3 w-3 mr-1 text-red-500" />
                <span>{character.health}</span>
              </div>
              <div className="flex items-center">
                <Coins className="h-3 w-3 mr-1 text-yellow-500" />
                <span>{character.gold}</span>
              </div>
              <div className="flex items-center">
                <Sword className="h-3 w-3 mr-1 text-gray-400" />
                <span>{character.strength}</span>
              </div>
              <div className="flex items-center">
                <span className="text-gray-600 dark:text-gray-400 mr-1">XP:</span>
                <span>{character.experience}</span>
              </div>
            </div>
            
            {/* Barra de experiencia compacta */}
            <div className="mt-2">
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1">
                <div 
                  className="bg-gray-400 h-1 rounded-full transition-all duration-300" 
                  style={{ width: `${Math.min((character.experience % 100), 100)}%` }}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Título y descripción del escenario */}
        <div className="flex-1 min-w-0">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between mb-3 gap-2">
            <h1 className="text-xl lg:text-2xl xl:text-3xl font-bold text-gray-900 dark:text-gray-100">
              {scenario.title || "Aventura"}
            </h1>
          </div>
          <Progress value={progress} className="h-2 mb-3" />
          <p className="text-sm lg:text-base text-gray-700 dark:text-gray-300 leading-relaxed line-clamp-3">
            {scenario.question}
          </p>
        </div>
      </div>

      {/* Layout principal optimizado para uso de espacio */}
      <div className="flex flex-col xl:flex-row gap-4 lg:gap-6 px-4 lg:px-6 h-[calc(100vh-200px)] lg:h-[calc(100vh-180px)]">
        {/* Imagen principal expandida */}
        <div className="flex-1 min-w-0">
          <Card className="h-full overflow-hidden border-gray-200 dark:border-gray-700">
            <div
              ref={cardRef}
              className={cn(
                "relative h-full",
                !isMobile && "perspective-container",
                !isMobile && (choiceDisabled ? "cursor-not-allowed" : "cursor-pointer")
              )}
              onMouseMove={!isMobile ? handleMouseMove : undefined}
              onMouseLeave={!isMobile ? handleMouseLeave : undefined}
              onClick={!isMobile ? handleClick : undefined}
            >
              <div className="relative w-full h-full bg-gray-100 dark:bg-gray-800">
                <Image
                  src={scenario.image}
                  alt="Escenario"
                  fill
                  className={cn(
                    "object-cover transition-all duration-300",
                    !isMobile && "transform-3d",
                    !isMobile && !choiceDisabled && hoverArea === "topLeft" && "rotate-3d-tl",
                    !isMobile && !choiceDisabled && hoverArea === "bottomLeft" && "rotate-3d-bl",
                    !isMobile && !choiceDisabled && hoverArea === "topRight" && "rotate-3d-tr",
                    !isMobile && !choiceDisabled && hoverArea === "bottomRight" && "rotate-3d-br",
                    choiceDisabled && "opacity-75"
                  )}
                  priority
                />

                {/* Overlay de resultado completado */}
                {choiceDisabled && (
                  <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                    <div className="bg-gray-800/90 text-white px-4 py-2 lg:px-6 lg:py-3 rounded-lg font-semibold shadow-lg text-sm lg:text-base">
                      ✅ Decisión tomada
                    </div>
                  </div>
                )}

                {/* Overlays para desktop hover */}
                {!isMobile && !choiceDisabled && (
                  <>
                    <div
                      className={cn(
                        "absolute top-0 left-0 w-1/2 h-1/2 transition-all duration-300 flex items-center justify-center",
                        hoverArea === "topLeft" ? "bg-gray-500/20 backdrop-blur-[1px]" : "bg-transparent"
                      )}
                    >
                      {hoverArea === "topLeft" && (
                        <div className="bg-black/70 text-white px-3 py-1 rounded-full text-sm font-medium">
                          Opción 1
                        </div>
                      )}
                    </div>
                    <div
                      className={cn(
                        "absolute bottom-0 left-0 w-1/2 h-1/2 transition-all duration-300 flex items-center justify-center",
                        hoverArea === "bottomLeft" ? "bg-gray-500/20 backdrop-blur-[1px]" : "bg-transparent"
                      )}
                    >
                      {hoverArea === "bottomLeft" && (
                        <div className="bg-black/70 text-white px-3 py-1 rounded-full text-sm font-medium">
                          Opción 2
                        </div>
                      )}
                    </div>
                    <div
                      className={cn(
                        "absolute top-0 right-0 w-1/2 h-1/2 transition-all duration-300 flex items-center justify-center",
                        hoverArea === "topRight" ? "bg-gray-500/20 backdrop-blur-[1px]" : "bg-transparent"
                      )}
                    >
                      {hoverArea === "topRight" && (
                        <div className="bg-black/70 text-white px-3 py-1 rounded-full text-sm font-medium">
                          Opción 3
                        </div>
                      )}
                    </div>
                    <div
                      className={cn(
                        "absolute bottom-0 right-0 w-1/2 h-1/2 transition-all duration-300 flex items-center justify-center",
                        hoverArea === "bottomRight" ? "bg-gray-500/20 backdrop-blur-[1px]" : "bg-transparent"
                      )}
                    >
                      {hoverArea === "bottomRight" && (
                        <div className="bg-black/70 text-white px-3 py-1 rounded-full text-sm font-medium">
                          Opción 4
                        </div>
                      )}
                    </div>
                  </>
                )}
              </div>
            </div>
          </Card>
        </div>

        {/* Panel lateral compacto para opciones y resultados */}
        <div className="w-full xl:w-80 2xl:w-96 flex flex-col gap-4">
          {/* Opción actual */}
          <Card className="flex-1 border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50">
            <CardContent className="p-3 lg:p-4 h-full flex flex-col">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm lg:text-base font-semibold text-gray-900 dark:text-gray-100">
                  {choiceDisabled ? "Opción Seleccionada" : "Opción"}
                </h3>
                {isTyping && (
                  <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse mr-2"></div>
                    <span className="hidden lg:inline">Escribiendo...</span>
                  </div>
                )}
                {choiceDisabled && (
                  <div className="flex items-center text-xs text-gray-600 dark:text-gray-400">
                    <div className="w-2 h-2 bg-gray-600 rounded-full mr-2"></div>
                    Elegida
                  </div>
                )}
              </div>
              <div className="flex-1 flex items-center mobile-option-card">
                {currentOptionText ? (
                  <div className={cn(
                    "w-full",
                    choiceDisabled && "bg-gray-100 dark:bg-gray-900/30 p-3 rounded-lg border border-gray-200 dark:border-gray-700"
                  )}>
                    <p className="text-xs lg:text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                      {typewriterText}
                      {isTyping && <span className="animate-pulse text-gray-500">|</span>}
                    </p>
                  </div>
                ) : (
                  <p className="text-gray-500 dark:text-gray-400 italic text-xs lg:text-sm">
                    {choiceDisabled ? "💭 Revisa el resultado de tu decisión" : 
                     isMobile ? "👇 Toca una opción abajo para ver los detalles" : 
                     "🖱️ Pasa el cursor sobre la imagen para ver las opciones disponibles"}
                  </p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Resultado */}
          <Card className="flex-1 border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50">
            <CardContent className="p-3 lg:p-4 h-full flex flex-col">
              <h3 className="text-sm lg:text-base font-semibold text-gray-900 dark:text-gray-100 mb-2">
                Resultado
              </h3>
              <div className="flex-1 flex items-center">
                {scenario.result ? (
                  <div className="bg-gray-100 dark:bg-gray-800 p-3 rounded-lg border-l-4 border-gray-500 w-full">
                    <p className="text-xs lg:text-sm text-gray-700 dark:text-gray-300 leading-relaxed mb-3">
                      {scenario.result}
                    </p>
                    {showContinueButton && onContinue && (
                      <div className="mt-4 pt-3 border-t border-gray-200 dark:border-gray-600">
                        <button
                          onClick={onContinue}
                          className="w-full bg-gradient-to-r from-gray-700 to-gray-900 hover:from-gray-800 hover:to-black text-white px-4 py-2 lg:px-6 lg:py-3 rounded-lg font-semibold transition-all duration-300 flex items-center justify-center gap-2 lg:gap-3 shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95 mobile-choice-button text-xs lg:text-sm"
                        >
                          <span>Continuar Aventura</span>
                          <ArrowRight className="h-3 w-3 lg:h-4 lg:w-4 transition-transform duration-300 group-hover:translate-x-1" />
                        </button>
                      </div>
                    )}
                  </div>
                ) : (
                  <p className="text-gray-500 dark:text-gray-400 italic text-xs lg:text-sm">
                    🎯 {isMobile ? "Toca" : "Haz clic en"} una opción para ver las consecuencias
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Interfaz móvil de opciones */}
      {isMobile && !choiceDisabled && (
        <div className="px-4 mt-4">
          <Card className="border-gray-200 dark:border-gray-700">
            <CardContent className="p-3">
              <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-3">
                ¿Qué vas a hacer?
              </h3>
              <div className="grid grid-cols-1 gap-2 mb-4">
                <button
                  onClick={() => handleMobileOptionSelect("topLeft")}
                  className={cn(
                    "p-3 text-left rounded-lg border-2 transition-all duration-200 mobile-choice-button",
                    selectedOption === "topLeft" 
                      ? "border-gray-500 bg-gray-50 dark:bg-gray-800" 
                      : "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600"
                  )}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-700 dark:text-gray-300 font-medium">
                      1. {scenario.topLeftOption}
                    </span>
                    {selectedOption === "topLeft" && (
                      <div className="w-2 h-2 bg-gray-500 rounded-full"></div>
                    )}
                  </div>
                </button>
                
                <button
                  onClick={() => handleMobileOptionSelect("bottomLeft")}
                  className={cn(
                    "p-3 text-left rounded-lg border-2 transition-all duration-200 mobile-choice-button",
                    selectedOption === "bottomLeft" 
                      ? "border-gray-500 bg-gray-50 dark:bg-gray-800" 
                      : "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600"
                  )}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-700 dark:text-gray-300 font-medium">
                      2. {scenario.bottomLeftOption}
                    </span>
                    {selectedOption === "bottomLeft" && (
                      <div className="w-2 h-2 bg-gray-500 rounded-full"></div>
                    )}
                  </div>
                </button>
                
                {scenario.topRightOption && scenario.topRightOption !== "Opción no disponible" && (
                  <button
                    onClick={() => handleMobileOptionSelect("topRight")}
                    className={cn(
                      "p-3 text-left rounded-lg border-2 transition-all duration-200 mobile-choice-button",
                      selectedOption === "topRight" 
                        ? "border-gray-500 bg-gray-50 dark:bg-gray-800" 
                        : "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600"
                    )}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-700 dark:text-gray-300 font-medium">
                        3. {scenario.topRightOption}
                      </span>
                      {selectedOption === "topRight" && (
                        <div className="w-2 h-2 bg-gray-500 rounded-full"></div>
                      )}
                    </div>
                  </button>
                )}
                
                {scenario.bottomRightOption && scenario.bottomRightOption !== "Opción no disponible" && (
                  <button
                    onClick={() => handleMobileOptionSelect("bottomRight")}
                    className={cn(
                      "p-3 text-left rounded-lg border-2 transition-all duration-200 mobile-choice-button",
                      selectedOption === "bottomRight" 
                        ? "border-gray-500 bg-gray-50 dark:bg-gray-800" 
                        : "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600"
                    )}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-700 dark:text-gray-300 font-medium">
                        4. {scenario.bottomRightOption}
                      </span>
                      {selectedOption === "bottomRight" && (
                        <div className="w-2 h-2 bg-gray-500 rounded-full"></div>
                      )}
                    </div>
                  </button>
                )}
              </div>
              
              {selectedOption !== "none" && (
                <button
                  onClick={handleMobileChoiceConfirm}
                  className="w-full bg-gradient-to-r from-gray-700 to-gray-900 hover:from-gray-800 hover:to-black text-white px-4 py-3 rounded-lg font-semibold transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95 mobile-choice-button text-sm"
                >
                  Confirmar Elección
                </button>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
} 