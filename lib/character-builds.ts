// Constantes de builds de personajes para Foundry VTT
// Organizadas por clase y raza para exportación

export interface FOUNDRY_BUILD {
  success: boolean
  build: Build
}

export interface Build {
  name: string
  class: string
  dualClass: any
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
  abilities: Abilities
  attributes: Attributes
  proficiencies: Proficiencies
  mods: Mods
  feats: any[][]
  specials: string[]
  lores: [string, number][]
  equipmentContainers: EquipmentContainers
  equipment: any[][]
  specificProficiencies: SpecificProficiencies
  weapons: Weapon[]
  money: Money
  armor: Armor[]
  spellCasters: any[]
  focusPoints: number
  focus: Focus
  formula: any[]
  acTotal: AcTotal
  pets: any[]
  familiars: any[]
}

export interface Abilities {
  str: number
  dex: number
  con: number
  int: number
  wis: number
  cha: number
  breakdown: Breakdown
}

export interface Breakdown {
  ancestryFree: string[]
  ancestryBoosts: any[]
  ancestryFlaws: any[]
  backgroundBoosts: string[]
  classBoosts: string[]
  mapLevelledBoosts: MapLevelledBoosts
}

export interface MapLevelledBoosts {
  "1": string[]
}

export interface Attributes {
  ancestryhp: number
  classhp: number
  bonushp: number
  bonushpPerLevel: number
  speed: number
  speedBonus: number
}

export interface Proficiencies {
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

export interface Mods {}

export interface EquipmentContainers {
  "82b9be15-ce85-4b3e-984b-b3c3e20a068b": N82b9be15Ce854b3e984bB3c3e20a068b
}

export interface N82b9be15Ce854b3e984bB3c3e20a068b {
  containerName: string
  bagOfHolding: boolean
  backpack: boolean
}

export interface SpecificProficiencies {
  trained: any[]
  expert: any[]
  master: any[]
  legendary: any[]
}

export interface Weapon {
  name: string
  qty: number
  prof: string
  die: string
  pot: number
  str: string
  mat: any
  display: string
  runes: any[]
  damageType: string
  attack: number
  damageBonus: number
  extraDamage: any[]
  increasedDice: boolean
  isInventor: boolean
}

export interface Money {
  cp: number
  sp: number
  gp: number
  pp: number
}

export interface Armor {
  name: string
  qty: number
  prof: string
  pot: number
  res: string
  mat: any
  display: string
  worn: boolean
  runes: any[]
}

export interface Focus {}

export interface AcTotal {
  acProfBonus: number
  acAbilityBonus: number
  acItemBonus: number
  acTotal: number
  shieldBonus: string
}



const CHARACTER_BUILDS: Record<string, Record<string, FOUNDRY_BUILD>> = {

  //Alchemist
  //Barbarian
  //Bard
  //Champion
  //Cleric
  //Druid
  //Fighter
  //Gunslinger
  //Inventor
  //Investigator
  //Kineticist
  //Magus
  //Monk
  //Oracle
  //Psychic
  //Ranger
  //Rogue
  //Sorcerer
  //Summoner
  //Swashbuckler
  //Thaumaturge
  //Witch
  //Wizard
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