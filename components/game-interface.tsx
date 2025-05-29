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
  }
  onChoose: (choice: "topLeft" | "bottomLeft" | "topRight" | "bottomRight") => void
  progress?: number
  result?: string
  showContinueButton?: boolean
  onContinue?: () => void
}

// Estilos CSS personalizados para efectos 3D exagerados
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
`

export function GameInterface({ character, scenario, onChoose, progress = 33, result, showContinueButton = false, onContinue }: GameInterfaceProps) {
  const [hoverArea, setHoverArea] = useState<"none" | "topLeft" | "bottomLeft" | "topRight" | "bottomRight">("none")
  const [currentOptionText, setCurrentOptionText] = useState("")
  const [typewriterText, setTypewriterText] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const cardRef = useRef<HTMLDivElement>(null)

  // Efecto typewriter mejorado
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
            setTimeout(typeText, 25) // Velocidad más rápida
          } else {
            setIsTyping(false)
          }
        }
      }
      
      const timer = setTimeout(typeText, 50)
      
      return () => {
        clearTimeout(timer)
        setIsTyping(false)
      }
    } else {
      setTypewriterText("")
      setIsTyping(false)
    }
  }, [currentOptionText])

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (cardRef.current && !result) {
      const rect = cardRef.current.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top
      const cardWidth = rect.width
      const cardHeight = rect.height

      let newHoverArea: typeof hoverArea = "none"

      if (x < cardWidth / 2) {
        // Left side
        if (y < cardHeight / 2) {
          newHoverArea = "topLeft"
        } else {
          newHoverArea = "bottomLeft"
        }
      } else {
        // Right side
        if (y < cardHeight / 2) {
          newHoverArea = "topRight"
        } else {
          newHoverArea = "bottomRight"
        }
      }

      setHoverArea(newHoverArea)

      // Actualizar texto de la opción según el área
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
    if (!result) {
      setHoverArea("none")
      setCurrentOptionText("")
    }
  }

  const handleClick = () => {
    if (hoverArea !== "none" && !result) {
      onChoose(hoverArea)
    }
  }

  return (
    <div className="container mx-auto px-4 py-6 max-w-6xl">
      {/* Inyectar estilos CSS personalizados */}
      <style jsx>{styles}</style>
      
      {/* Header con información del personaje y progreso */}
      <div className="flex flex-col lg:flex-row gap-6 mb-6">
        {/* Información del personaje compacta */}
        <Card className="lg:w-80 border-gray-200 dark:border-gray-700">
          <CardContent className="p-4">
            <div className="flex items-center space-x-4 mb-4">
              {character.avatar ? (
                <div className="relative w-16 h-16 rounded-full overflow-hidden border-2 border-gray-200 dark:border-gray-700">
                  <Image
                    src={character.avatar}
                    alt={character.name}
                    fill
                    className="object-cover"
                  />
                </div>
              ) : (
                <div className="w-16 h-16 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                  <span className="text-2xl">⚔️</span>
                </div>
              )}
              <div className="flex-1 min-w-0">
                <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100 truncate">
                  {character.name}
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-400 truncate">
                  {character.title}
                </p>
              </div>
            </div>
            
            {/* Stats compactos */}
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="flex items-center">
                <Star className="h-4 w-4 mr-2 text-amber-500" />
                <span className="text-gray-600 dark:text-gray-400">Nv.</span>
                <span className="ml-1 font-semibold">{character.level}</span>
              </div>
              <div className="flex items-center">
                <Heart className="h-4 w-4 mr-2 text-red-500" />
                <span className="text-gray-600 dark:text-gray-400">HP</span>
                <span className="ml-1 font-semibold">{character.health}</span>
              </div>
              <div className="flex items-center">
                <Coins className="h-4 w-4 mr-2 text-yellow-500" />
                <span className="text-gray-600 dark:text-gray-400">Oro</span>
                <span className="ml-1 font-semibold">{character.gold}</span>
              </div>
              <div className="flex items-center">
                <Sword className="h-4 w-4 mr-2 text-blue-500" />
                <span className="text-gray-600 dark:text-gray-400">Fue.</span>
                <span className="ml-1 font-semibold">{character.strength}</span>
              </div>
            </div>
            
            {/* Experiencia con barra */}
            <div className="mt-3">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs text-gray-600 dark:text-gray-400">XP</span>
                <span className="text-xs font-medium">{character.experience}</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div 
                  className="bg-purple-500 h-2 rounded-full transition-all duration-300" 
                  style={{ width: `${Math.min((character.experience % 100), 100)}%` }}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Progreso de aventura y título */}
        <Card className="flex-1 border-gray-200 dark:border-gray-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-3">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                {scenario.title || "Aventura"}
              </h1>
              <Badge variant="outline" className="flex items-center gap-1">
                <Trophy className="h-3 w-3" />
                {progress}%
              </Badge>
            </div>
            <Progress value={progress} className="h-3 mb-4" />
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              {scenario.question}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Imagen interactiva principal */}
      <Card className="mb-6 overflow-hidden border-gray-200 dark:border-gray-700">
        <div
          ref={cardRef}
          className={cn(
            "relative perspective-container",
            result ? "cursor-default" : "cursor-pointer"
          )}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          onClick={handleClick}
        >
          <div className="relative w-full h-[500px] bg-gray-100 dark:bg-gray-800">
            <Image
              src={scenario.image}
              alt="Escenario"
              fill
              className={cn(
                "object-cover transition-all duration-300 transform-3d",
                !result && hoverArea === "topLeft" && "rotate-3d-tl",
                !result && hoverArea === "bottomLeft" && "rotate-3d-bl",
                !result && hoverArea === "topRight" && "rotate-3d-tr",
                !result && hoverArea === "bottomRight" && "rotate-3d-br",
                result && "opacity-75"
              )}
              priority
            />

            {/* Overlay de resultado completado */}
            {result && (
              <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                <div className="bg-green-600/90 text-white px-6 py-3 rounded-lg font-semibold shadow-lg">
                  ✅ Decisión tomada
                </div>
              </div>
            )}

            {/* Overlays sutiles para indicar áreas interactivas - solo si no hay resultado */}
            {!result && (
              <>
                <div
                  className={cn(
                    "absolute top-0 left-0 w-1/2 h-1/2 transition-all duration-300 flex items-center justify-center",
                    hoverArea === "topLeft" ? "bg-blue-500/20 backdrop-blur-[1px]" : "bg-transparent"
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
                    hoverArea === "bottomLeft" ? "bg-green-500/20 backdrop-blur-[1px]" : "bg-transparent"
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
                    hoverArea === "topRight" ? "bg-purple-500/20 backdrop-blur-[1px]" : "bg-transparent"
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
                    hoverArea === "bottomRight" ? "bg-orange-500/20 backdrop-blur-[1px]" : "bg-transparent"
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

      {/* Área de opciones y resultados */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Opción actual */}
        <Card className="border-gray-200 dark:border-gray-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                {result ? "Opción Seleccionada" : "Opción"}
              </h3>
              {isTyping && (
                <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse mr-2"></div>
                  Escribiendo...
                </div>
              )}
              {result && (
                <div className="flex items-center text-sm text-green-600 dark:text-green-400">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                  Elegida
                </div>
              )}
            </div>
            <div className="min-h-[80px] flex items-center">
              {currentOptionText ? (
                <div className={cn(
                  "w-full",
                  result && "bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg border border-blue-200 dark:border-blue-800"
                )}>
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                    {typewriterText}
                    {isTyping && <span className="animate-pulse text-blue-500">|</span>}
                  </p>
                </div>
              ) : (
                <p className="text-gray-500 dark:text-gray-400 italic text-sm">
                  {result ? "💭 Revisa el resultado de tu decisión" : "🖱️ Pasa el cursor sobre la imagen para ver las opciones disponibles"}
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Resultado */}
        <Card className="border-gray-200 dark:border-gray-700">
          <CardContent className="p-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3">
              Resultado
            </h3>
            <div className="min-h-[80px] flex items-center">
              {result ? (
                <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg border-l-4 border-green-500 w-full">
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-3">
                    {result}
                  </p>
                  {showContinueButton && onContinue && (
                    <div className="mt-4 pt-3 border-t border-gray-200 dark:border-gray-600">
                      <button
                        onClick={onContinue}
                        className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-300 flex items-center justify-center gap-3 shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95"
                      >
                        <span>Continuar Aventura</span>
                        <ArrowRight className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <p className="text-gray-500 dark:text-gray-400 italic text-sm">
                  🎯 Haz clic en una opción para ver las consecuencias
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 