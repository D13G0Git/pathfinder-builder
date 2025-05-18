"use client"

import { useSearchParams } from "next/navigation"
import { GameScenario } from "@/components/game-scenario"
import { initialScenario } from "@/lib/mockup-data"
import { Suspense } from "react"

export default function GamePage() {
  return (
    <Suspense fallback={<div className="flex justify-center items-center h-screen">Cargando...</div>}>
      <GameContent />
    </Suspense>
  )
}

function GameContent() {
  const searchParams = useSearchParams()
  const characterId = searchParams.get('character')

  return (
    <main className="pb-16">
      <GameScenario initialScenario={initialScenario} />
    </main>
  )
}
