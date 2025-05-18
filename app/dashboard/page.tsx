import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Shield, Sword, Map, ScrollText } from "lucide-react"
import Link from "next/link"
import { mockCharacters } from "@/lib/mockup-data"

export default function Dashboard() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">Welcome back, Adventurer! Continue your journey.</p>
        </div>
        <Button asChild>
          <Link href="/game">Continue Adventure</Link>
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Quests</CardTitle>
            <ScrollText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
            <p className="text-xs text-muted-foreground">2 main quests, 1 side quest</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Characters</CardTitle>
            <Sword className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockCharacters.length}</div>
            <p className="text-xs text-muted-foreground">{mockCharacters.map((c) => c.name).join(", ")}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Explored Areas</CardTitle>
            <Map className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">7</div>
            <p className="text-xs text-muted-foreground">42% of the world discovered</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Achievements</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">24% of total achievements</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Recent Adventures</CardTitle>
            <CardDescription>Your most recent gameplay sessions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { name: "The Whispering Woods", date: "2 hours ago", progress: "In Progress" },
                { name: "Caves of Mystery", date: "Yesterday", progress: "Completed" },
                { name: "The Ancient Temple", date: "3 days ago", progress: "Completed" },
              ].map((adventure, i) => (
                <div key={i} className="flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="text-sm font-medium leading-none">{adventure.name}</p>
                    <p className="text-sm text-muted-foreground">{adventure.date}</p>
                  </div>
                  <div
                    className={`text-xs ${adventure.progress === "Completed" ? "text-green-500" : "text-amber-500"}`}
                  >
                    {adventure.progress}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Your Characters</CardTitle>
            <CardDescription>Characters in your current party</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockCharacters.map((character) => (
                <div key={character.id} className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center overflow-hidden">
                    <div className="text-xs">{character.name.charAt(0)}</div>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium leading-none">{character.name}</p>
                    <p className="text-xs text-muted-foreground">
                      Level {character.level} {character.race} {character.class}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
