"use client"

import { useState, useEffect } from "react"

// Array con todas las imágenes disponibles (fuera del componente para evitar recreaciones)
const backgroundImages = [
  "/backimg_1.png",
  "/backimg_2.png", 
  "/backimg_3.png",
  "/backimg_4.png",
  "/backimg_5.png"
]

export function ParallaxBackground() {
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [backgroundImage, setBackgroundImage] = useState("")

  useEffect(() => {
    // Seleccionar una imagen aleatoria al montar el componente
    const randomIndex = Math.floor(Math.random() * backgroundImages.length)
    const selectedImage = backgroundImages[randomIndex]
    if (selectedImage) {
      setBackgroundImage(selectedImage)
    }

    const handleMouseMove = (e: MouseEvent) => {
      // Calculate mouse position as a percentage of the viewport
      const x = e.clientX / window.innerWidth
      const y = e.clientY / window.innerHeight

      // Update position state
      setPosition({ x, y })
    }

    // Add event listener
    window.addEventListener("mousemove", handleMouseMove)

    // Clean up
    return () => {
      window.removeEventListener("mousemove", handleMouseMove)
    }
  }, [])

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: `url('${backgroundImage}')`,
          transform: `translate(${position.x * -20}px, ${position.y * -20}px)`,
          transition: "transform 0.1s ease-out",
        }}
      />
      <div className="absolute inset-0 bg-background/80" />
    </div>
  )
}
