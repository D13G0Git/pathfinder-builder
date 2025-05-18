import { GameScenario } from "@/components/game-scenario"
import { initialScenario } from "@/lib/mockup-data"

export default function GamePage() {
  return <GameScenario initialScenario={initialScenario} />
}
