"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog"
import { supabase } from "@/lib/supabase"
import { PathfinderCharacter, UserCharacter } from "@/lib/supabase"
import { useToast } from "@/components/ui/use-toast"
import { Download, Save } from "lucide-react"

// Función para generar un personaje de Pathfinder basado en las decisiones
const generatePathfinderCharacter = (
  character: UserCharacter, 
  decisions: any[]
): PathfinderCharacter => {
  // Aquí implementarías la lógica para generar un personaje de Pathfinder
  // basado en las decisiones tomadas durante el juego
  
  // Por ahora, usaremos una plantilla simple
  const defaultCharacter: PathfinderCharacter = {
    success: true,
    build: {
      name: character.name,
      class: character.class,
      dualClass: null,
      level: character.level,
      ancestry: character.race,
      heritage: "Versatile Heritage",
      background: "Gladiator",
      alignment: "N",
      gender: "Not set",
      age: "Not set",
      deity: "Not set",
      size: 2,
      sizeName: "Medium",
      keyability: "str",
      languages: ["Common"],
      rituals: [],
      resistances: [],
      inventorMods: [],
      abilities: {
        str: 16,
        dex: 12,
        con: 14,
        int: 10,
        wis: 12,
        cha: 10,
        breakdown: {
          ancestryFree: ["Str", "Con"],
          ancestryBoosts: [],
          ancestryFlaws: [],
          backgroundBoosts: ["Str", "Con"],
          classBoosts: ["Str"],
          mapLevelledBoosts: {
            "1": ["Str", "Con", "Dex", "Wis"]
          }
        }
      },
      attributes: {
        ancestryhp: 8,
        classhp: 10,
        bonushp: 0,
        bonushpPerLevel: 0,
        speed: 25,
        speedBonus: 5
      },
      proficiencies: {
        classDC: 2,
        perception: 4,
        fortitude: 4,
        reflex: 4,
        will: 2,
        heavy: 2,
        medium: 2,
        light: 2,
        unarmored: 2,
        advanced: 2,
        martial: 4,
        simple: 4,
        unarmed: 4,
        castingArcane: 0,
        castingDivine: 0,
        castingOccult: 0,
        castingPrimal: 0,
        acrobatics: 2,
        arcana: 0,
        athletics: 2,
        crafting: 0,
        deception: 0,
        diplomacy: 0,
        intimidation: 0,
        medicine: 0,
        nature: 0,
        occultism: 0,
        performance: 2,
        religion: 0,
        society: 0,
        stealth: 0,
        survival: 0,
        thievery: 2
      },
      mods: {},
      feats: [
        ["Shield Block", null, "Awarded Feat", 1],
        ["Impressive Performance", null, "Awarded Feat", 1]
      ],
      specials: ["Attack of Opportunity"],
      lores: [["Gladiatorial", 2]],
      equipmentContainers: {
        "container-1": {
          containerName: "Backpack",
          bagOfHolding: false,
          backpack: true
        }
      },
      equipment: [
        ["Backpack", 1, "Invested"],
        ["Bedroll", 1, "container-1", "Invested"],
        ["Rations", 2, "container-1", "Invested"]
      ],
      specificProficiencies: {
        trained: [],
        expert: [],
        master: [],
        legendary: []
      },
      weapons: [
        {
          name: "Greatsword",
          qty: 1,
          prof: "martial",
          die: "d12",
          pot: 0,
          str: "",
          mat: null,
          display: "Greatsword",
          runes: [],
          damageType: "S",
          attack: 9,
          damageBonus: 4,
          extraDamage: [],
          increasedDice: false,
          isInventor: false
        }
      ],
      money: {
        cp: 0,
        sp: 0,
        gp: 100,
        pp: 0
      },
      armor: [
        {
          name: "Breastplate",
          qty: 1,
          prof: "medium",
          pot: 0,
          res: "",
          mat: null,
          display: "Breastplate",
          worn: true,
          runes: []
        }
      ],
      spellCasters: [],
      focusPoints: 0,
      focus: {},
      formula: [],
      acTotal: {
        acProfBonus: 3,
        acAbilityBonus: 1,
        acItemBonus: 4,
        acTotal: 18,
        shieldBonus: "2"
      },
      pets: [],
      familiars: []
    }
  }
  
  // Aquí podrías modificar el personaje según las decisiones tomadas
  // Por ejemplo, otorgar habilidades especiales dependiendo de las elecciones
  
  // Modificar el personaje según las decisiones (simplificado)
  decisions.forEach(decision => {
    if (decision.scenario_id === "forest") {
      // Elección del bosque - mejora la percepción
      if (defaultCharacter.build.proficiencies.perception !== undefined) {
        defaultCharacter.build.proficiencies.perception += 1
      }
    } else if (decision.scenario_id === "village") {
      // Elección de la aldea - mejora la diplomacia
      if (defaultCharacter.build.proficiencies.diplomacy !== undefined) {
        defaultCharacter.build.proficiencies.diplomacy += 1
      }
    } else if (decision.scenario_id === "road") {
      // Elección del camino - mejora la supervivencia
      if (defaultCharacter.build.proficiencies.survival !== undefined) {
        defaultCharacter.build.proficiencies.survival += 1
      }
    }
  })
  
  return defaultCharacter
}

interface CharacterExportProps {
  character: UserCharacter
  decisions: any[]
  onSave?: (characterData: PathfinderCharacter) => void
}

export function CharacterExport({ character, decisions, onSave }: CharacterExportProps) {
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()
  
  const handleExport = () => {
    try {
      const pathfinderCharacter = generatePathfinderCharacter(character, decisions)
      
      // Crear un blob con el JSON
      const blob = new Blob([JSON.stringify(pathfinderCharacter, null, 2)], {
        type: "application/json"
      })
      
      // Crear un enlace para descargar
      const url = URL.createObjectURL(blob)
      const link = document.createElement("a")
      link.href = url
      link.download = `${character.name.replace(/\s+/g, "_")}.json`
      
      // Simular un clic para descargar el archivo
      document.body.appendChild(link)
      link.click()
      
      // Limpiar
      document.body.removeChild(link)
      URL.revokeObjectURL(url)
      
      toast({
        title: "Personaje exportado",
        description: "El archivo JSON de tu personaje ha sido generado correctamente."
      })
    } catch (error) {
      console.error("Error al exportar el personaje:", error)
      toast({
        variant: "destructive",
        title: "Error",
        description: "No se pudo exportar tu personaje. Inténtalo de nuevo."
      })
    }
  }
  
  const handleSaveToDatabase = async () => {
    if (!character.id) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "No se puede guardar el personaje sin un ID válido."
      })
      return
    }
    
    setIsLoading(true)
    
    try {
      const pathfinderCharacter = generatePathfinderCharacter(character, decisions)
      
      // Actualizar el personaje en la base de datos
      const { error } = await supabase
        .from('characters')
        .update({
          character_data: pathfinderCharacter
        })
        .eq('id', character.id)
      
      if (error) throw error
      
      if (onSave) {
        onSave(pathfinderCharacter)
      }
      
      toast({
        title: "Personaje guardado",
        description: "Tu personaje ha sido guardado exitosamente en la base de datos."
      })
    } catch (error: any) {
      console.error("Error al guardar el personaje:", error)
      toast({
        variant: "destructive",
        title: "Error",
        description: "No se pudo guardar tu personaje. " + error.message
      })
    } finally {
      setIsLoading(false)
    }
  }
  
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="w-full">
          Finalizar y Exportar Personaje
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Exportar personaje</DialogTitle>
          <DialogDescription>
            Tu aventura ha terminado. Ahora puedes exportar tu personaje para usarlo en Foundry VTT o guardarlo para futuras aventuras.
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="bg-muted p-4 rounded-md">
            <h3 className="font-semibold mb-2">{character.name}</h3>
            <p>{character.race} {character.class} de nivel {character.level}</p>
            <p className="text-xs text-muted-foreground mt-2">
              Tu personaje ha sido formado por {decisions.length} decisiones tomadas durante la aventura.
            </p>
          </div>
        </div>
        
        <DialogFooter className="flex flex-col sm:flex-row gap-2">
          <Button 
            variant="outline" 
            onClick={handleExport}
            className="w-full sm:w-auto flex gap-2 items-center"
          >
            <Download size={16} />
            Exportar JSON
          </Button>
          <Button 
            onClick={handleSaveToDatabase}
            className="w-full sm:w-auto flex gap-2 items-center"
            disabled={isLoading}
          >
            <Save size={16} />
            {isLoading ? "Guardando..." : "Guardar en mi Cuenta"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
} 