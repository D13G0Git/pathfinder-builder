import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { mockCharacters } from "@/lib/mockup-data"
import { Badge } from "@/components/ui/badge"
import { Sword, Shield, Wand2, Heart } from "lucide-react"

export default function CharactersPage() {
  return (
    <div className="space-y-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight mb-2">Characters</h1>
        <p className="text-muted-foreground">Manage your characters and their abilities.</p>
      </div>

      <Tabs defaultValue="all" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="all">All Characters</TabsTrigger>
          <TabsTrigger value="active">Active Party</TabsTrigger>
          <TabsTrigger value="retired">Retired</TabsTrigger>
        </TabsList>
        <TabsContent value="all" className="space-y-4">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {mockCharacters.map((character) => (
              <Card key={character.id} className="overflow-hidden">
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start">
                    <CardTitle>{character.name}</CardTitle>
                    <Badge variant="outline" className="font-normal">
                      Level {character.level}
                    </Badge>
                  </div>
                  <CardDescription>
                    {character.race} {character.class}
                  </CardDescription>
                </CardHeader>
                <CardContent className="pb-3">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center gap-2">
                      <Sword className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">Attack: {12 + character.level}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Shield className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">Defense: {10 + Math.floor(character.level / 2)}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Wand2 className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">Magic: {character.class === "Wizard" ? 15 + character.level : 8}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Heart className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">
                        HP: {character.class === "Fighter" ? 20 + character.level * 5 : 15 + character.level * 3}
                      </span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between pt-3">
                  <Button variant="outline" size="sm">
                    View Details
                  </Button>
                  <Button size="sm">Select</Button>
                </CardFooter>
              </Card>
            ))}

            <Card className="flex flex-col items-center justify-center p-6 border-dashed">
              <div className="mb-4 rounded-full bg-primary/10 p-3">
                <Sword className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-lg font-medium mb-2">Create New Character</h3>
              <p className="text-sm text-muted-foreground text-center mb-4">
                Start a new adventure with a fresh character
              </p>
              <Button>Create Character</Button>
            </Card>
          </div>
        </TabsContent>
        <TabsContent value="active">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {mockCharacters.slice(0, 2).map((character) => (
              <Card key={character.id} className="overflow-hidden">
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start">
                    <CardTitle>{character.name}</CardTitle>
                    <Badge variant="outline" className="font-normal">
                      Level {character.level}
                    </Badge>
                  </div>
                  <CardDescription>
                    {character.race} {character.class}
                  </CardDescription>
                </CardHeader>
                <CardContent className="pb-3">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center gap-2">
                      <Sword className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">Attack: {12 + character.level}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Shield className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">Defense: {10 + Math.floor(character.level / 2)}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Wand2 className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">Magic: {character.class === "Wizard" ? 15 + character.level : 8}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Heart className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">
                        HP: {character.class === "Fighter" ? 20 + character.level * 5 : 15 + character.level * 3}
                      </span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between pt-3">
                  <Button variant="outline" size="sm">
                    View Details
                  </Button>
                  <Button size="sm">Select</Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>
        <TabsContent value="retired">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {mockCharacters.slice(2, 3).map((character) => (
              <Card key={character.id} className="overflow-hidden">
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start">
                    <CardTitle>{character.name}</CardTitle>
                    <Badge variant="outline" className="font-normal">
                      Level {character.level}
                    </Badge>
                  </div>
                  <CardDescription>
                    {character.race} {character.class}
                  </CardDescription>
                </CardHeader>
                <CardContent className="pb-3">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center gap-2">
                      <Sword className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">Attack: {12 + character.level}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Shield className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">Defense: {10 + Math.floor(character.level / 2)}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Wand2 className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">Magic: {character.class === "Wizard" ? 15 + character.level : 8}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Heart className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">
                        HP: {character.class === "Fighter" ? 20 + character.level * 5 : 15 + character.level * 3}
                      </span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between pt-3">
                  <Button variant="outline" size="sm">
                    View Details
                  </Button>
                  <Button size="sm" variant="secondary">
                    Reactivate
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
