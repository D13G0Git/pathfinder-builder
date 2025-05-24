// Constantes de builds de personajes para Foundry VTT
// Organizadas por clase y raza para exportación

export interface FOUNDRY_BUILD {
    success: boolean,
    build: {
        name: string
        class: string
        dualClass: string | null
        level: number
        ancestry: string
        heritage: string
        background: string
        alignment: string
        gender: string
        age: string
        deity: string
        size: number
        sizeName: string
        keyability: string
        languages: string[]
        rituals: any[]
        resistances: any[]
        inventorMods: any[]
        abilities: {
          str: number
          dex: number
          con: number
          int: number
          wis: number
          cha: number
          breakdown: {
            ancestryFree: string[]
            ancestryBoosts: string[]
            ancestryFlaws: string[]
            backgroundBoosts: string[]
            classBoosts: string[]
            mapLevelledBoosts: Record<string, string[]>
          }
        }
        attributes: {
          ancestryhp: number
          classhp: number
          bonushp: number
          bonushpPerLevel: number
          speed: number
          speedBonus: number
        }
        proficiencies: {
          classDC: number
          perception: number
          fortitude: number
          reflex: number
          will: number
          heavy: number
          medium: number
          light: number
          unarmored: number
          advanced: number
          martial: number
          simple: number
          unarmed: number
          castingArcane: number
          castingDivine: number
          castingOccult: number
          castingPrimal: number
          acrobatics: number
          arcana: number
          athletics: number
          crafting: number
          deception: number
          diplomacy: number
          intimidation: number
          medicine: number
          nature: number
          occultism: number
          performance: number
          religion: number
          society: number
          stealth: number
          survival: number
          thievery: number
        }
        mods: Record<string, any>
        feats: Array<[string, string | null, string, number, (string | undefined)?, (string | undefined)?, (string | null | undefined)?]>
        specials: string[]
        lores: Array<[string, number]>
        equipmentContainers: Record<string, {
          containerName: string
          bagOfHolding: boolean
          backpack: boolean
        }>
        equipment: Array<[string, number, string?, string?]>
        specificProficiencies: {
          trained: string[]
          expert: string[]
          master: string[]
          legendary: string[]
        }
        weapons: Array<{
          name: string
          qty: number
          prof: string
          die: string
          pot: number
          str: string
          mat: string | null
          display: string
          runes: any[]
          damageType: string
          attack: number
          damageBonus: number
          extraDamage: any[]
          increasedDice: boolean
          isInventor: boolean
        }>
        money: {
          cp: number
          sp: number
          gp: number
          pp: number
        }
        armor: Array<{
          name: string
          qty: number
          prof: string
          pot: number
          res: string
          mat: string | null
          display: string
          worn: boolean
          runes: any[]
        }>
        spellCasters: any[]
        focusPoints: number
        focus: Record<string, any>
        formula: any[]
        acTotal: {
          acProfBonus: number
          acAbilityBonus: number
          acItemBonus: number
          acTotal: number
          shieldBonus: string
        }
        pets: any[]
        familiars: any[]
    }
  
}

const CHARACTER_BUILDS: Record<string, Record<string, FOUNDRY_BUILD>> = {
  
}

// Función auxiliar para obtener la build de un personaje
export function getCharacterBuild(characterClass: string, race: string): FOUNDRY_BUILD | null {
  const classBuilds = CHARACTER_BUILDS[characterClass]
  if (!classBuilds) return null
  
  const build = classBuilds[race]
  if (!build) {
    // Si no hay build específica para esa raza en esa clase, devolver la build humana como fallback
    return classBuilds["Humano"] || null
  }
  
  return build
} 