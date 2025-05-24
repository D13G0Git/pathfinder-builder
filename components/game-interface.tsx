"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Heart, Star, Coins } from "lucide-react"
import { cn } from "@/lib/utils"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
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
}

// Estilos CSS personalizados para efectos 3D exagerados
const styles = `
  .transform-3d {
    transform-style: preserve-3d;
  }
  
  .rotate-3d-tl {
    transform: rotateX(10deg) rotateY(10deg) scale(1.05);
    box-shadow: -10px -10px 30px rgba(0, 0, 0, 0.3);
  }
  
  .rotate-3d-bl {
    transform: rotateX(-10deg) rotateY(10deg) scale(1.05);
    box-shadow: -10px 10px 30px rgba(0, 0, 0, 0.3);
  }
  
  .rotate-3d-tr {
    transform: rotateX(10deg) rotateY(-10deg) scale(1.05);
    box-shadow: 10px -10px 30px rgba(0, 0, 0, 0.3);
  }
  
  .rotate-3d-br {
    transform: rotateX(-10deg) rotateY(-10deg) scale(1.05);
    box-shadow: 10px 10px 30px rgba(0, 0, 0, 0.3);
  }
  
  .perspective-container {
    perspective: 800px;
    perspective-origin: center center;
  }
`

export function GameInterface({ character, scenario, onChoose, progress = 33, result }: GameInterfaceProps) {
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
            setTimeout(typeText, 30) // Velocidad más lenta y estable
          } else {
            setIsTyping(false)
          }
        }
      }
      
      // Pequeño delay inicial para suavizar el inicio
      const timer = setTimeout(typeText, 100)
      
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
    if (cardRef.current) {
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
    setHoverArea("none")
    setCurrentOptionText("")
  }

  const handleClick = () => {
    if (hoverArea !== "none") {
      onChoose(hoverArea)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl space-y-8">
      {/* Inyectar estilos CSS personalizados */}
      <style jsx>{styles}</style>
      
      {/* Título del Escenario */}
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-2">
          {scenario.title || "Aventura"}
        </h1>
      </div>

      {/* Descripción del Escenario */}
      <Card className="border-gray-200 dark:border-gray-700">
        <CardContent className="p-6">
          <p className="text-lg leading-relaxed text-gray-700 dark:text-gray-300">
            {scenario.question}
          </p>
        </CardContent>
      </Card>

      {/* Progress bar */}
      <div className="mb-6">
        <div className="flex justify-between mb-2">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Progreso de la Aventura</span>
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{progress}%</span>
        </div>
        <Progress value={progress} className="h-2" />
      </div>

      {/* Character stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <Card className="border-gray-200 dark:border-gray-700">
          <CardContent className="flex items-center justify-between p-4">
            <div className="flex items-center">
              <Star className="h-5 w-5 mr-2 text-gray-600 dark:text-gray-400" />
              <span className="font-medium text-gray-700 dark:text-gray-300">Nivel</span>
            </div>
            <span className="text-lg font-bold text-gray-900 dark:text-gray-100">{character.level}</span>
          </CardContent>
        </Card>

        <Card className="border-gray-200 dark:border-gray-700">
          <CardContent className="flex items-center justify-between p-4">
            <div className="flex items-center">
              <Heart className="h-5 w-5 mr-2 text-gray-600 dark:text-gray-400" />
              <span className="font-medium text-gray-700 dark:text-gray-300">Salud</span>
            </div>
            <span className="text-lg font-bold text-gray-900 dark:text-gray-100">{character.health}</span>
          </CardContent>
        </Card>

        <Card className="border-gray-200 dark:border-gray-700">
          <CardContent className="flex items-center justify-between p-4">
            <div className="flex items-center">
              <Coins className="h-5 w-5 mr-2 text-gray-600 dark:text-gray-400" />
              <span className="font-medium text-gray-700 dark:text-gray-300">Oro</span>
            </div>
            <span className="text-lg font-bold text-gray-900 dark:text-gray-100">{character.gold}</span>
          </CardContent>
        </Card>
      </div>

      {/* Imagen del escenario con overlays interactivos */}
      <Card className="overflow-visible border-gray-200 dark:border-gray-700">
        <div
          ref={cardRef}
          className="relative cursor-pointer perspective-container"
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          onClick={handleClick}
        >
          {/* Imagen del escenario con efectos 3D */}
          <div className="relative w-full h-96 bg-gray-100 dark:bg-gray-800">
            <Image
              src={scenario.image}
              alt="Escenario"
              fill
              className={cn(
                "object-cover transition-all duration-500 transform-3d",
                hoverArea === "topLeft" && "rotate-3d-tl",
                hoverArea === "bottomLeft" && "rotate-3d-bl",
                hoverArea === "topRight" && "rotate-3d-tr",
                hoverArea === "bottomRight" && "rotate-3d-br"
              )}
              priority
            />

            {/* Overlay sutil para indicar áreas interactivas */}
            <div
              className={cn(
                "absolute top-0 left-0 w-1/2 h-1/2 transition-all duration-500",
                hoverArea === "topLeft" ? "bg-white/10 backdrop-blur-[2px]" : "bg-transparent"
              )}
            />
            <div
              className={cn(
                "absolute bottom-0 left-0 w-1/2 h-1/2 transition-all duration-500",
                hoverArea === "bottomLeft" ? "bg-white/10 backdrop-blur-[2px]" : "bg-transparent"
              )}
            />
            <div
              className={cn(
                "absolute top-0 right-0 w-1/2 h-1/2 transition-all duration-500",
                hoverArea === "topRight" ? "bg-white/10 backdrop-blur-[2px]" : "bg-transparent"
              )}
            />
            <div
              className={cn(
                "absolute bottom-0 right-0 w-1/2 h-1/2 transition-all duration-500",
                hoverArea === "bottomRight" ? "bg-white/10 backdrop-blur-[2px]" : "bg-transparent"
              )}
            />
          </div>
        </div>
      </Card>

      {/* Sección de mensaje de opción con efecto typewriter */}
      <Card className="border-gray-200 dark:border-gray-700 min-h-[100px]">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              Opción Seleccionada
            </h3>
            {isTyping && (
              <div className="animate-pulse text-gray-500 dark:text-gray-400">
                Escribiendo...
              </div>
            )}
          </div>
          <div className="min-h-[60px] flex items-center">
            {currentOptionText ? (
              <p className="text-lg text-gray-700 dark:text-gray-300">
                {typewriterText}
                {isTyping && <span className="animate-pulse">|</span>}
              </p>
            ) : (
              <p className="text-gray-500 dark:text-gray-400 italic">
                Pasa el mouse sobre diferentes áreas de la imagen para ver las opciones disponibles
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Sección de consecuencia */}
      <Card className="border-gray-200 dark:border-gray-700 min-h-[120px]">
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
            Resultado de tu Decisión
          </h3>
          <div className="min-h-[60px] flex items-center">
            {result ? (
              <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg border-l-4 border-gray-400 dark:border-gray-500">
                <p className="text-lg text-gray-700 dark:text-gray-300">
                  {result}
                </p>
              </div>
            ) : (
              <p className="text-gray-500 dark:text-gray-400 italic">
                Haz clic en una opción para ver las consecuencias de tu decisión
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Imagen del personaje */}
      <Card className="border-gray-200 dark:border-gray-700">
        <CardContent className="p-6">
          <div className="flex items-center space-x-6">
            {character.avatar ? (
              <div className="relative w-32 h-32 rounded-full overflow-hidden border-4 border-gray-200 dark:border-gray-700 shadow-lg">
                <Image
                  src={character.avatar}
                  alt={character.name}
                  fill
                  className="object-cover"
                />
              </div>
            ) : (
              <div className="w-32 h-32 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                <span className="text-4xl">⚔️</span>
              </div>
            )}
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                {character.name} {character.title}
              </h2>
              <div className="mt-2 grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-500 dark:text-gray-400">Nivel:</span>
                  <span className="ml-2 font-medium text-gray-700 dark:text-gray-300">{character.level}</span>
                </div>
                <div>
                  <span className="text-gray-500 dark:text-gray-400">Experiencia:</span>
                  <span className="ml-2 font-medium text-gray-700 dark:text-gray-300">{character.experience}</span>
                </div>
                <div>
                  <span className="text-gray-500 dark:text-gray-400">Fuerza:</span>
                  <span className="ml-2 font-medium text-gray-700 dark:text-gray-300">{character.strength}</span>
                </div>
                <div>
                  <span className="text-gray-500 dark:text-gray-400">Oro:</span>
                  <span className="ml-2 font-medium text-gray-700 dark:text-gray-300">{character.gold}</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 