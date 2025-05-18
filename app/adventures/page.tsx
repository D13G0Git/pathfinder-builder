import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Scroll, Clock, Trophy, Skull, Swords } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

// Mockup data for adventures
const mockAdventures = [
  {
    id: 1,
    title: "The Whispering Woods",
    description: "A mysterious forest filled with ancient secrets and dangerous creatures.",
    difficulty: "Medium",
    progress: 65,
    status: "In Progress",
    image: "/placeholder.svg?height=200&width=400&text=Whispering+Woods",
    quests: 8,
    completedQuests: 5,
    estimatedTime: "12 hours",
    rewards: "Amulet of Yendor, 500 Gold",
    enemies: "Forest Trolls, Shadow Wolves, Ancient Treants",
  },
  {
    id: 2,
    title: "Caves of Mystery",
    description: "Dark caverns that hold treasures beyond imagination and horrors beyond comprehension.",
    difficulty: "Hard",
    progress: 100,
    status: "Completed",
    image: "/placeholder.svg?height=200&width=400&text=Caves+of+Mystery",
    quests: 10,
    completedQuests: 10,
    estimatedTime: "15 hours",
    rewards: "Staff of Elements, 800 Gold",
    enemies: "Cave Dwellers, Crystal Golems, Underground Dragons",
  },
  {
    id: 3,
    title: "The Ancient Temple",
    description: "A forgotten temple dedicated to gods long dead, filled with traps and guardians.",
    difficulty: "Hard",
    progress: 100,
    status: "Completed",
    image: "/placeholder.svg?height=200&width=400&text=Ancient+Temple",
    quests: 12,
    completedQuests: 12,
    estimatedTime: "20 hours",
    rewards: "Divine Blessing, 1000 Gold",
    enemies: "Temple Guardians, Cultists, Animated Statues",
  },
  {
    id: 4,
    title: "Frozen Peaks",
    description: "Snow-covered mountains where few dare to venture, home to creatures of ice and frost.",
    difficulty: "Very Hard",
    progress: 30,
    status: "In Progress",
    image: "/placeholder.svg?height=200&width=400&text=Frozen+Peaks",
    quests: 15,
    completedQuests: 4,
    estimatedTime: "25 hours",
    rewards: "Frost Giant's Heart, 1200 Gold",
    enemies: "Frost Giants, Ice Elementals, Winter Wolves",
  },
  {
    id: 5,
    title: "The Sunken City",
    description: "A city swallowed by the sea centuries ago, now home to aquatic horrors.",
    difficulty: "Medium",
    progress: 0,
    status: "Not Started",
    image: "/placeholder.svg?height=200&width=400&text=Sunken+City",
    quests: 9,
    completedQuests: 0,
    estimatedTime: "14 hours",
    rewards: "Trident of the Deep, 700 Gold",
    enemies: "Merfolk, Sea Serpents, Drowned Ones",
  },
]

export default function AdventuresPage() {
  return (
    <div className="space-y-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight mb-2">Adventures</h1>
        <p className="text-muted-foreground">Explore quests and journeys across the realm.</p>
      </div>

      <Tabs defaultValue="all" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="all">All Adventures</TabsTrigger>
          <TabsTrigger value="active">In Progress</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-6">
          {mockAdventures.map((adventure) => (
            <Card key={adventure.id} className="overflow-hidden">
              <div className="md:flex">
                <div className="relative h-48 md:h-auto md:w-1/3">
                  <Image
                    src={adventure.image || "/placeholder.svg"}
                    alt={adventure.title}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="flex-1">
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-xl">{adventure.title}</CardTitle>
                      <Badge
                        variant={
                          adventure.status === "Completed"
                            ? "secondary"
                            : adventure.status === "In Progress"
                              ? "default"
                              : "outline"
                        }
                      >
                        {adventure.status}
                      </Badge>
                    </div>
                    <CardDescription>{adventure.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="pb-2">
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between mb-1 text-sm">
                          <span>Progress</span>
                          <span>{adventure.progress}%</span>
                        </div>
                        <Progress value={adventure.progress} className="h-2" />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="flex items-center gap-2">
                          <Scroll className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">
                            {adventure.completedQuests}/{adventure.quests} Quests
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">{adventure.estimatedTime}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Trophy className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">{adventure.rewards}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Skull className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">Difficulty: {adventure.difficulty}</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="pt-2">
                    {adventure.status === "Not Started" ? (
                      <Button asChild>
                        <Link href="/game">Begin Adventure</Link>
                      </Button>
                    ) : adventure.status === "In Progress" ? (
                      <Button asChild>
                        <Link href="/game">Continue</Link>
                      </Button>
                    ) : (
                      <Button variant="outline">View Summary</Button>
                    )}
                  </CardFooter>
                </div>
              </div>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="active" className="space-y-6">
          {mockAdventures
            .filter((a) => a.status === "In Progress")
            .map((adventure) => (
              <Card key={adventure.id} className="overflow-hidden">
                <div className="md:flex">
                  <div className="relative h-48 md:h-auto md:w-1/3">
                    <Image
                      src={adventure.image || "/placeholder.svg"}
                      alt={adventure.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start">
                        <CardTitle className="text-xl">{adventure.title}</CardTitle>
                        <Badge>In Progress</Badge>
                      </div>
                      <CardDescription>{adventure.description}</CardDescription>
                    </CardHeader>
                    <CardContent className="pb-2">
                      <div className="space-y-4">
                        <div>
                          <div className="flex justify-between mb-1 text-sm">
                            <span>Progress</span>
                            <span>{adventure.progress}%</span>
                          </div>
                          <Progress value={adventure.progress} className="h-2" />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="flex items-center gap-2">
                            <Scroll className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm">
                              {adventure.completedQuests}/{adventure.quests} Quests
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm">{adventure.estimatedTime}</span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="pt-2">
                      <Button asChild>
                        <Link href="/game">Continue</Link>
                      </Button>
                    </CardFooter>
                  </div>
                </div>
              </Card>
            ))}
        </TabsContent>

        <TabsContent value="completed" className="space-y-6">
          {mockAdventures
            .filter((a) => a.status === "Completed")
            .map((adventure) => (
              <Card key={adventure.id} className="overflow-hidden">
                <div className="md:flex">
                  <div className="relative h-48 md:h-auto md:w-1/3">
                    <Image
                      src={adventure.image || "/placeholder.svg"}
                      alt={adventure.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start">
                        <CardTitle className="text-xl">{adventure.title}</CardTitle>
                        <Badge variant="secondary">Completed</Badge>
                      </div>
                      <CardDescription>{adventure.description}</CardDescription>
                    </CardHeader>
                    <CardContent className="pb-2">
                      <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div className="flex items-center gap-2">
                            <Trophy className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm">{adventure.rewards}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Swords className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm">Enemies Defeated: 127</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Scroll className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm">{adventure.quests} Quests Completed</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm">Time: 18h 24m</span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="pt-2">
                      <Button variant="outline">View Summary</Button>
                    </CardFooter>
                  </div>
                </div>
              </Card>
            ))}
        </TabsContent>
      </Tabs>
    </div>
  )
}
