export interface Choice {
  id: string
  text: string
  nextScenarioId: string
}

export interface Scenario {
  id: string
  title: string
  image: string
  description: string
  choices: Choice[]
}

export const initialScenario: Scenario = {
  id: "start",
  title: "The Beginning of Your Journey",
  image: "/placeholder.svg?height=400&width=800&text=The+Beginning",
  description:
    "You stand at the edge of the Whispering Woods, a forest shrouded in mystery and ancient magic. The path before you splits in three directions. To the east, a narrow trail winds deeper into the dense forest. To the west, smoke rises from what appears to be a small settlement. Directly ahead, a stone archway marks the entrance to a well-traveled road. Your quest to find the legendary Amulet of Yendor begins here. The choices you make will shape your destiny in the world of Pathfinder.",
  choices: [
    {
      id: "forest",
      text: "Take the eastern path into the depths of the forest",
      nextScenarioId: "forest",
    },
    {
      id: "village",
      text: "Head west towards the settlement",
      nextScenarioId: "village",
    },
    {
      id: "road",
      text: "Walk through the stone archway onto the main road",
      nextScenarioId: "road",
    },
  ],
}

export const mockCharacters = [
  {
    id: 1,
    name: "Thorne Ironheart",
    class: "Fighter",
    level: 7,
    race: "Dwarf",
    avatar: "/placeholder.svg?height=100&width=100&text=Thorne",
  },
  {
    id: 2,
    name: "Lyra Moonshadow",
    class: "Wizard",
    level: 5,
    race: "Elf",
    avatar: "/placeholder.svg?height=100&width=100&text=Lyra",
  },
  {
    id: 3,
    name: "Grimble Stoutfoot",
    class: "Rogue",
    level: 6,
    race: "Halfling",
    avatar: "/placeholder.svg?height=100&width=100&text=Grimble",
  },
]

export const mockSettings = {
  notifications: true,
  soundEffects: true,
  musicVolume: 70,
  difficulty: "Normal",
  textSize: "Medium",
  darkMode: true,
  autoSave: true,
}
