"use client"

import { useState } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import type { Scenario } from "@/lib/mockup-data"

interface GameScenarioProps {
  initialScenario: Scenario
}

export function GameScenario({ initialScenario }: GameScenarioProps) {
  const [currentScenario, setCurrentScenario] = useState<Scenario>(initialScenario)

  const handleChoiceClick = (nextScenarioId: string) => {
    // In a real app, you would fetch the next scenario from an API
    // For this mockup, we're just simulating the transition
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

    setCurrentScenario(mockNextScenario)

    // Scroll to top when changing scenarios
    window.scrollTo(0, 0)
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
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

      <h2 className="text-xl font-semibold mb-4">What will you do?</h2>

      <div className="space-y-4">
        {currentScenario.choices.map((choice) => (
          <Card
            key={choice.id}
            className="hover:bg-accent transition-colors cursor-pointer"
            onClick={() => handleChoiceClick(choice.nextScenarioId)}
          >
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <span className="text-lg">{choice.text}</span>
                <Button variant="ghost" size="sm">
                  Choose
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
