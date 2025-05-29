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
  "Guerrero": {
    "Humano": {
      success: true,
      build: {
        name: "Guerrero Humano",
        class: "Fighter",
        dualClass: null,
        level: 1,
        ancestry: "Human",
        heritage: "Versatile Human",
        background: "Guardia",
        alignment: "LN",
        gender: "Masculino",
        age: "25",
        deity: "",
        size: 2,
        sizeName: "Medium",
        keyability: "str",
        languages: ["Común", "Orcish"],
        rituals: [],
        resistances: [],
        inventorMods: [],
        abilities: {
          str: 18,
          dex: 14,
          con: 16,
          int: 10,
          wis: 13,
          cha: 12,
          breakdown: {
            ancestryFree: ["str"],
            ancestryBoosts: ["str", "con"],
            ancestryFlaws: [],
            backgroundBoosts: ["str", "cha"],
            classBoosts: ["str", "dex"],
            mapLevelledBoosts: {
              "1": ["str", "con", "dex", "wis"]
            }
          }
        },
        attributes: {
          ancestryhp: 8,
          classhp: 10,
          bonushp: 0,
          bonushpPerLevel: 0,
          speed: 25,
          speedBonus: 0
        },
        proficiencies: {
          classDC: 2,
          perception: 2,
          fortitude: 4,
          reflex: 2,
          will: 2,
          heavy: 0,
          medium: 2,
          light: 2,
          unarmored: 2,
          advanced: 0,
          martial: 2,
          simple: 2,
          unarmed: 2,
          castingArcane: 0,
          castingDivine: 0,
          castingOccult: 0,
          castingPrimal: 0,
          acrobatics: 0,
          arcana: 0,
          athletics: 2,
          crafting: 0,
          deception: 0,
          diplomacy: 0,
          intimidation: 2,
          medicine: 0,
          nature: 0,
          occultism: 0,
          performance: 0,
          religion: 0,
          society: 0,
          stealth: 0,
          survival: 0,
          thievery: 0
        },
        mods: {},
        feats: [["Power Attack"]],
        specials: ["Attack of Opportunity"],
        lores: [["Warfare Lore", 2]],
        equipmentContainers: {
          "82b9be15-ce85-4b3e-984b-b3c3e20a068b": {
            containerName: "Mochila",
            bagOfHolding: false,
            backpack: true
          }
        },
        equipment: [["Rations", 4], ["Rope", 1], ["Torch", 5]],
        specificProficiencies: {
          trained: [],
          expert: [],
          master: [],
          legendary: []
        },
        weapons: [{
          name: "Longsword",
          qty: 1,
          prof: "martial",
          die: "1d8",
          pot: 0,
          str: "",
          mat: null,
          display: "Longsword",
          runes: [],
          damageType: "slashing",
          attack: 7,
          damageBonus: 4,
          extraDamage: [],
          increasedDice: false,
          isInventor: false
        }],
        money: {
          cp: 0,
          sp: 0,
          gp: 150,
          pp: 0
        },
        armor: [{
          name: "Chain Mail",
          qty: 1,
          prof: "medium",
          pot: 0,
          res: "",
          mat: null,
          display: "Chain Mail",
          worn: true,
          runes: []
        }],
        spellCasters: [],
        focusPoints: 0,
        focus: {},
        formula: [],
        acTotal: {
          acProfBonus: 2,
          acAbilityBonus: 2,
          acItemBonus: 5,
          acTotal: 17,
          shieldBonus: ""
        },
        pets: [],
        familiars: []
      }
    },
    "Elfo": {
      success: true,
      build: {
        name: "Arquero Élfico",
        class: "Fighter",
        dualClass: null,
        level: 1,
        ancestry: "Elf",
        heritage: "Ancient Elf",
        background: "Cazador",
        alignment: "CG",
        gender: "Femenino",
        age: "110",
        deity: "",
        size: 2,
        sizeName: "Medium",
        keyability: "dex",
        languages: ["Común", "Élfico", "Céltico"],
        rituals: [],
        resistances: [],
        inventorMods: [],
        abilities: {
          str: 14,
          dex: 18,
          con: 14,
          int: 12,
          wis: 16,
          cha: 10,
          breakdown: {
            ancestryFree: ["dex"],
            ancestryBoosts: ["dex", "int"],
            ancestryFlaws: ["con"],
            backgroundBoosts: ["dex", "wis"],
            classBoosts: ["str", "dex"],
            mapLevelledBoosts: {
              "1": ["dex", "wis", "str", "con"]
            }
          }
        },
        attributes: {
          ancestryhp: 6,
          classhp: 10,
          bonushp: 0,
          bonushpPerLevel: 0,
          speed: 30,
          speedBonus: 0
        },
        proficiencies: {
          classDC: 2,
          perception: 4,
          fortitude: 2,
          reflex: 4,
          will: 2,
          heavy: 0,
          medium: 2,
          light: 2,
          unarmored: 2,
          advanced: 0,
          martial: 2,
          simple: 2,
          unarmed: 2,
          castingArcane: 0,
          castingDivine: 0,
          castingOccult: 0,
          castingPrimal: 0,
          acrobatics: 2,
          arcana: 0,
          athletics: 0,
          crafting: 0,
          deception: 0,
          diplomacy: 0,
          intimidation: 0,
          medicine: 0,
          nature: 2,
          occultism: 0,
          performance: 0,
          religion: 0,
          society: 0,
          stealth: 2,
          survival: 2,
          thievery: 0
        },
        mods: {},
        feats: [["Point-Blank Shot"]],
        specials: ["Attack of Opportunity"],
        lores: [["Forest Lore", 2]],
        equipmentContainers: {
          "82b9be15-ce85-4b3e-984b-b3c3e20a068b": {
            containerName: "Mochila",
            bagOfHolding: false,
            backpack: true
          }
        },
        equipment: [["Rations", 4], ["Rope", 1], ["Arrows", 60]],
        specificProficiencies: {
          trained: [],
          expert: [],
          master: [],
          legendary: []
        },
        weapons: [
          {
            name: "Longbow",
            qty: 1,
            prof: "martial",
            die: "1d8",
            pot: 0,
            str: "",
            mat: null,
            display: "Longbow",
            runes: [],
            damageType: "piercing",
            attack: 7,
            damageBonus: 0,
            extraDamage: [],
            increasedDice: false,
            isInventor: false
          },
          {
            name: "Rapier",
            qty: 1,
            prof: "martial",
            die: "1d6",
            pot: 0,
            str: "",
            mat: null,
            display: "Rapier",
            runes: [],
            damageType: "piercing",
            attack: 7,
            damageBonus: 0,
            extraDamage: [],
            increasedDice: false,
            isInventor: false
          }
        ],
        money: {
          cp: 0,
          sp: 0,
          gp: 150,
          pp: 0
        },
        armor: [{
          name: "Studded Leather",
          qty: 1,
          prof: "light",
          pot: 0,
          res: "",
          mat: null,
          display: "Studded Leather",
          worn: true,
          runes: []
        }],
        spellCasters: [],
        focusPoints: 0,
        focus: {},
        formula: [],
        acTotal: {
          acProfBonus: 2,
          acAbilityBonus: 4,
          acItemBonus: 2,
          acTotal: 16,
          shieldBonus: ""
        },
        pets: [],
        familiars: []
      }
    }
  },
  "Mago": {
    "Humano": {
      success: true,
      build: {
        name: "Mago Humano",
        class: "Wizard",
        dualClass: null,
        level: 1,
        ancestry: "Human",
        heritage: "Skilled Human",
        background: "Erudito",
        alignment: "LN",
        gender: "Masculino",
        age: "30",
        deity: "",
        size: 2,
        sizeName: "Medium",
        keyability: "int",
        languages: ["Común", "Draconic", "Celestial", "Infernal"],
        rituals: [],
        resistances: [],
        inventorMods: [],
        abilities: {
          str: 10,
          dex: 14,
          con: 14,
          int: 18,
          wis: 13,
          cha: 12,
          breakdown: {
            ancestryFree: ["int"],
            ancestryBoosts: ["int", "wis"],
            ancestryFlaws: [],
            backgroundBoosts: ["int", "wis"],
            classBoosts: ["int", "dex"],
            mapLevelledBoosts: {
              "1": ["int", "con", "dex", "cha"]
            }
          }
        },
        attributes: {
          ancestryhp: 8,
          classhp: 6,
          bonushp: 0,
          bonushpPerLevel: 0,
          speed: 25,
          speedBonus: 0
        },
        proficiencies: {
          classDC: 2,
          perception: 2,
          fortitude: 2,
          reflex: 2,
          will: 4,
          heavy: 0,
          medium: 0,
          light: 0,
          unarmored: 2,
          advanced: 0,
          martial: 0,
          simple: 2,
          unarmed: 2,
          castingArcane: 2,
          castingDivine: 0,
          castingOccult: 0,
          castingPrimal: 0,
          acrobatics: 0,
          arcana: 2,
          athletics: 0,
          crafting: 2,
          deception: 0,
          diplomacy: 0,
          intimidation: 0,
          medicine: 0,
          nature: 0,
          occultism: 2,
          performance: 0,
          religion: 0,
          society: 2,
          stealth: 0,
          survival: 0,
          thievery: 0
        },
        mods: {},
        feats: [["Reach Spell"]],
        specials: ["Arcane Spellcasting", "Arcane School"],
        lores: [["Academia Lore", 2]],
        equipmentContainers: {
          "82b9be15-ce85-4b3e-984b-b3c3e20a068b": {
            containerName: "Mochila",
            bagOfHolding: false,
            backpack: true
          }
        },
        equipment: [["Spellbook", 1], ["Material Component Pouch", 1], ["Scroll Case", 1]],
        specificProficiencies: {
          trained: [],
          expert: [],
          master: [],
          legendary: []
        },
        weapons: [{
          name: "Staff",
          qty: 1,
          prof: "simple",
          die: "1d4",
          pot: 0,
          str: "",
          mat: null,
          display: "Staff",
          runes: [],
          damageType: "bludgeoning",
          attack: 4,
          damageBonus: 0,
          extraDamage: [],
          increasedDice: false,
          isInventor: false
        }],
        money: {
          cp: 0,
          sp: 0,
          gp: 150,
          pp: 0
        },
        armor: [],
        spellCasters: [{
          magicTradition: "arcane",
          spellcastingAbility: "int",
          spellAttack: 6,
          spellDC: 16,
          spells: {
            "0": ["Detect Magic", "Light", "Mage Hand"],
            "1": ["Magic Missile", "Burning Hands"]
          }
        }],
        focusPoints: 1,
        focus: {
          "1": ["Force Bolt"]
        },
        formula: [],
        acTotal: {
          acProfBonus: 2,
          acAbilityBonus: 2,
          acItemBonus: 0,
          acTotal: 12,
          shieldBonus: ""
        },
        pets: [],
        familiars: []
      }
    },
    "Gnomo": {
      success: true,
      build: {
        name: "Ilusionista Gnomo",
        class: "Wizard",
        dualClass: null,
        level: 1,
        ancestry: "Gnome",
        heritage: "Fey-Touched Gnome",
        background: "Artista",
        alignment: "CN",
        gender: "Femenino",
        age: "45",
        deity: "",
        size: 1,
        sizeName: "Small",
        keyability: "int",
        languages: ["Común", "Gnómico", "Silvano"],
        rituals: [],
        resistances: [],
        inventorMods: [],
        abilities: {
          str: 8,
          dex: 16,
          con: 14,
          int: 18,
          wis: 12,
          cha: 14,
          breakdown: {
            ancestryFree: ["int"],
            ancestryBoosts: ["con", "cha"],
            ancestryFlaws: ["str"],
            backgroundBoosts: ["dex", "cha"],
            classBoosts: ["int", "dex"],
            mapLevelledBoosts: {
              "1": ["int", "con", "dex", "wis"]
            }
          }
        },
        attributes: {
          ancestryhp: 8,
          classhp: 6,
          bonushp: 0,
          bonushpPerLevel: 0,
          speed: 25,
          speedBonus: 0
        },
        proficiencies: {
          classDC: 2,
          perception: 2,
          fortitude: 2,
          reflex: 2,
          will: 4,
          heavy: 0,
          medium: 0,
          light: 0,
          unarmored: 2,
          advanced: 0,
          martial: 0,
          simple: 2,
          unarmed: 2,
          castingArcane: 2,
          castingDivine: 0,
          castingOccult: 0,
          castingPrimal: 2,
          acrobatics: 0,
          arcana: 2,
          athletics: 0,
          crafting: 0,
          deception: 2,
          diplomacy: 0,
          intimidation: 0,
          medicine: 0,
          nature: 2,
          occultism: 2,
          performance: 2,
          religion: 0,
          society: 0,
          stealth: 2,
          survival: 0,
          thievery: 0
        },
        mods: {},
        feats: [["Cantrip Expansion"]],
        specials: ["Arcane Spellcasting", "Arcane School", "Primal Innate Spells"],
        lores: [["Fey Lore", 2]],
        equipmentContainers: {
          "82b9be15-ce85-4b3e-984b-b3c3e20a068b": {
            containerName: "Mochila",
            bagOfHolding: false,
            backpack: true
          }
        },
        equipment: [["Spellbook", 1], ["Material Component Pouch", 1], ["Artist's Tools", 1]],
        specificProficiencies: {
          trained: [],
          expert: [],
          master: [],
          legendary: []
        },
        weapons: [{
          name: "Dagger",
          qty: 1,
          prof: "simple",
          die: "1d4",
          pot: 0,
          str: "",
          mat: null,
          display: "Dagger",
          runes: [],
          damageType: "piercing",
          attack: 6,
          damageBonus: 0,
          extraDamage: [],
          increasedDice: false,
          isInventor: false
        }],
        money: {
          cp: 0,
          sp: 0,
          gp: 150,
          pp: 0
        },
        armor: [],
        spellCasters: [{
          magicTradition: "arcane",
          spellcastingAbility: "int",
          spellAttack: 6,
          spellDC: 16,
          spells: {
            "0": ["Detect Magic", "Ghost Sound", "Prestidigitation", "Dancing Lights"],
            "1": ["Illusory Object", "Color Spray"]
          }
        }],
        focusPoints: 1,
        focus: {
          "1": ["Warped Terrain"]
        },
        formula: [],
        acTotal: {
          acProfBonus: 2,
          acAbilityBonus: 3,
          acItemBonus: 0,
          acTotal: 13,
          shieldBonus: ""
        },
        pets: [],
        familiars: []
      }
    }
  },
  "Pícaro": {
    "Humano": {
      success: true,
      build: {
        name: "Pícaro Humano",
        class: "Rogue",
        dualClass: null,
        level: 1,
        ancestry: "Human",
        heritage: "Versatile Human",
        background: "Criminal",
        alignment: "CN",
        gender: "Masculino",
        age: "22",
        deity: "",
        size: 2,
        sizeName: "Medium",
        keyability: "dex",
        languages: ["Común", "Halfling"],
        rituals: [],
        resistances: [],
        inventorMods: [],
        abilities: {
          str: 12,
          dex: 18,
          con: 14,
          int: 14,
          wis: 13,
          cha: 12,
          breakdown: {
            ancestryFree: ["dex"],
            ancestryBoosts: ["dex", "int"],
            ancestryFlaws: [],
            backgroundBoosts: ["dex", "int"],
            classBoosts: ["dex", "str"],
            mapLevelledBoosts: {
              "1": ["dex", "con", "wis", "cha"]
            }
          }
        },
        attributes: {
          ancestryhp: 8,
          classhp: 8,
          bonushp: 0,
          bonushpPerLevel: 0,
          speed: 25,
          speedBonus: 0
        },
        proficiencies: {
          classDC: 2,
          perception: 4,
          fortitude: 2,
          reflex: 4,
          will: 2,
          heavy: 0,
          medium: 0,
          light: 2,
          unarmored: 2,
          advanced: 0,
          martial: 0,
          simple: 2,
          unarmed: 2,
          castingArcane: 0,
          castingDivine: 0,
          castingOccult: 0,
          castingPrimal: 0,
          acrobatics: 2,
          arcana: 0,
          athletics: 2,
          crafting: 0,
          deception: 2,
          diplomacy: 0,
          intimidation: 2,
          medicine: 0,
          nature: 0,
          occultism: 0,
          performance: 0,
          religion: 0,
          society: 2,
          stealth: 2,
          survival: 0,
          thievery: 2
        },
        mods: {},
        feats: [["Twin Takedown"]],
        specials: ["Sneak Attack", "Surprise Attack", "Rogues' Racket"],
        lores: [["Underworld Lore", 2]],
        equipmentContainers: {
          "82b9be15-ce85-4b3e-984b-b3c3e20a068b": {
            containerName: "Mochila",
            bagOfHolding: false,
            backpack: true
          }
        },
        equipment: [["Thieves' Tools", 1], ["Rope", 1], ["Caltrops", 10]],
        specificProficiencies: {
          trained: [],
          expert: [],
          master: [],
          legendary: []
        },
        weapons: [
          {
            name: "Shortsword",
            qty: 2,
            prof: "martial",
            die: "1d6",
            pot: 0,
            str: "",
            mat: null,
            display: "Shortsword",
            runes: [],
            damageType: "piercing",
            attack: 7,
            damageBonus: 0,
            extraDamage: [],
            increasedDice: false,
            isInventor: false
          },
          {
            name: "Shortbow",
            qty: 1,
            prof: "martial",
            die: "1d6",
            pot: 0,
            str: "",
            mat: null,
            display: "Shortbow",
            runes: [],
            damageType: "piercing",
            attack: 7,
            damageBonus: 0,
            extraDamage: [],
            increasedDice: false,
            isInventor: false
          }
        ],
        money: {
          cp: 0,
          sp: 0,
          gp: 150,
          pp: 0
        },
        armor: [{
          name: "Studded Leather",
          qty: 1,
          prof: "light",
          pot: 0,
          res: "",
          mat: null,
          display: "Studded Leather",
          worn: true,
          runes: []
        }],
        spellCasters: [],
        focusPoints: 0,
        focus: {},
        formula: [],
        acTotal: {
          acProfBonus: 2,
          acAbilityBonus: 4,
          acItemBonus: 2,
          acTotal: 16,
          shieldBonus: ""
        },
        pets: [],
        familiars: []
      }
    },
    "Halfling": {
      success: true,
      build: {
        name: "Explorador Halfling",
        class: "Rogue",
        dualClass: null,
        level: 1,
        ancestry: "Halfling",
        heritage: "Gutsy Halfling",
        background: "Scout",
        alignment: "NG",
        gender: "Femenino",
        age: "18",
        deity: "",
        size: 1,
        sizeName: "Small",
        keyability: "dex",
        languages: ["Común", "Halfling"],
        rituals: [],
        resistances: [],
        inventorMods: [],
        abilities: {
          str: 10,
          dex: 18,
          con: 14,
          int: 12,
          wis: 16,
          cha: 13,
          breakdown: {
            ancestryFree: ["dex"],
            ancestryBoosts: ["dex", "wis"],
            ancestryFlaws: ["str"],
            backgroundBoosts: ["dex", "wis"],
            classBoosts: ["dex", "wis"],
            mapLevelledBoosts: {
              "1": ["dex", "con", "int", "cha"]
            }
          }
        },
        attributes: {
          ancestryhp: 6,
          classhp: 8,
          bonushp: 0,
          bonushpPerLevel: 0,
          speed: 25,
          speedBonus: 0
        },
        proficiencies: {
          classDC: 2,
          perception: 4,
          fortitude: 2,
          reflex: 4,
          will: 4,
          heavy: 0,
          medium: 0,
          light: 2,
          unarmored: 2,
          advanced: 0,
          martial: 0,
          simple: 2,
          unarmed: 2,
          castingArcane: 0,
          castingDivine: 0,
          castingOccult: 0,
          castingPrimal: 0,
          acrobatics: 2,
          arcana: 0,
          athletics: 0,
          crafting: 0,
          deception: 0,
          diplomacy: 2,
          intimidation: 0,
          medicine: 0,
          nature: 2,
          occultism: 0,
          performance: 0,
          religion: 0,
          society: 0,
          stealth: 2,
          survival: 2,
          thievery: 2
        },
        mods: {},
        feats: [["Nimble Dodge"]],
        specials: ["Sneak Attack", "Surprise Attack", "Rogues' Racket"],
        lores: [["Forest Lore", 2]],
        equipmentContainers: {
          "82b9be15-ce85-4b3e-984b-b3c3e20a068b": {
            containerName: "Mochila",
            bagOfHolding: false,
            backpack: true
          }
        },
        equipment: [["Survival Kit", 1], ["Rope", 1], ["Sling Bullets", 20]],
        specificProficiencies: {
          trained: [],
          expert: [],
          master: [],
          legendary: []
        },
        weapons: [
          {
            name: "Sling",
            qty: 1,
            prof: "simple",
            die: "1d6",
            pot: 0,
            str: "",
            mat: null,
            display: "Sling",
            runes: [],
            damageType: "bludgeoning",
            attack: 7,
            damageBonus: 0,
            extraDamage: [],
            increasedDice: false,
            isInventor: false
          },
          {
            name: "Dagger",
            qty: 2,
            prof: "simple",
            die: "1d4",
            pot: 0,
            str: "",
            mat: null,
            display: "Dagger",
            runes: [],
            damageType: "piercing",
            attack: 7,
            damageBonus: 0,
            extraDamage: [],
            increasedDice: false,
            isInventor: false
          }
        ],
        money: {
          cp: 0,
          sp: 0,
          gp: 150,
          pp: 0
        },
        armor: [{
          name: "Leather Armor",
          qty: 1,
          prof: "light",
          pot: 0,
          res: "",
          mat: null,
          display: "Leather Armor",
          worn: true,
          runes: []
        }],
        spellCasters: [],
        focusPoints: 0,
        focus: {},
        formula: [],
        acTotal: {
          acProfBonus: 2,
          acAbilityBonus: 4,
          acItemBonus: 1,
          acTotal: 15,
          shieldBonus: ""
        },
        pets: [],
        familiars: []
      }
    }
  },
  "Clérigo": {
    "Humano": {
      success: true,
      build: {
        name: "Clérigo Humano",
        class: "Cleric",
        dualClass: null,
        level: 1,
        ancestry: "Human",
        heritage: "Versatile Human",
        background: "Acolito",
        alignment: "LG",
        gender: "Masculino",
        age: "35",
        deity: "Sarenrae",
        size: 2,
        sizeName: "Medium",
        keyability: "wis",
        languages: ["Común", "Celestial"],
        rituals: [],
        resistances: [],
        inventorMods: [],
        abilities: {
          str: 14,
          dex: 12,
          con: 14,
          int: 10,
          wis: 18,
          cha: 15,
          breakdown: {
            ancestryFree: ["wis"],
            ancestryBoosts: ["wis", "cha"],
            ancestryFlaws: [],
            backgroundBoosts: ["int", "wis"],
            classBoosts: ["wis", "cha"],
            mapLevelledBoosts: {
              "1": ["wis", "str", "con", "cha"]
            }
          }
        },
        attributes: {
          ancestryhp: 8,
          classhp: 8,
          bonushp: 0,
          bonushpPerLevel: 0,
          speed: 25,
          speedBonus: 0
        },
        proficiencies: {
          classDC: 2,
          perception: 2,
          fortitude: 4,
          reflex: 2,
          will: 4,
          heavy: 0,
          medium: 2,
          light: 2,
          unarmored: 2,
          advanced: 0,
          martial: 0,
          simple: 2,
          unarmed: 2,
          castingArcane: 0,
          castingDivine: 2,
          castingOccult: 0,
          castingPrimal: 0,
          acrobatics: 0,
          arcana: 0,
          athletics: 0,
          crafting: 0,
          deception: 0,
          diplomacy: 2,
          intimidation: 0,
          medicine: 2,
          nature: 0,
          occultism: 0,
          performance: 0,
          religion: 2,
          society: 0,
          stealth: 0,
          survival: 0,
          thievery: 0
        },
        mods: {},
        feats: [["Deadly Simplicity"]],
        specials: ["Divine Spellcasting", "Divine Font", "Doctrina"],
        lores: [["Scribing Lore", 2]],
        equipmentContainers: {
          "82b9be15-ce85-4b3e-984b-b3c3e20a068b": {
            containerName: "Mochila",
            bagOfHolding: false,
            backpack: true
          }
        },
        equipment: [["Religious Symbol", 1], ["Healer's Kit", 1], ["Holy Water", 2]],
        specificProficiencies: {
          trained: [],
          expert: [],
          master: [],
          legendary: []
        },
        weapons: [{
          name: "Scimitar",
          qty: 1,
          prof: "martial",
          die: "1d6",
          pot: 0,
          str: "",
          mat: null,
          display: "Scimitar",
          runes: [],
          damageType: "slashing",
          attack: 5,
          damageBonus: 2,
          extraDamage: [],
          increasedDice: false,
          isInventor: false
        }],
        money: {
          cp: 0,
          sp: 0,
          gp: 150,
          pp: 0
        },
        armor: [{
          name: "Scale Mail",
          qty: 1,
          prof: "medium",
          pot: 0,
          res: "",
          mat: null,
          display: "Scale Mail",
          worn: true,
          runes: []
        }],
        spellCasters: [{
          magicTradition: "divine",
          spellcastingAbility: "wis",
          spellAttack: 6,
          spellDC: 16,
          spells: {
            "0": ["Detect Magic", "Light", "Guidance"],
            "1": ["Heal", "Bless"]
          }
        }],
        focusPoints: 1,
        focus: {
          "1": ["Fire Ray"]
        },
        formula: [],
        acTotal: {
          acProfBonus: 2,
          acAbilityBonus: 1,
          acItemBonus: 3,
          acTotal: 14,
          shieldBonus: ""
        },
        pets: [],
        familiars: []
      }
    }
  },
  "Explorador": {
    "Humano": {
      success: true,
      build: {
        name: "Explorador Humano",
        class: "Ranger",
        dualClass: null,
        level: 1,
        ancestry: "Human",
        heritage: "Versatile Human",
        background: "Cazador",
        alignment: "N",
        gender: "Femenino",
        age: "28",
        deity: "",
        size: 2,
        sizeName: "Medium",
        keyability: "dex",
        languages: ["Común", "Silvano"],
        rituals: [],
        resistances: [],
        inventorMods: [],
        abilities: {
          str: 14,
          dex: 18,
          con: 14,
          int: 12,
          wis: 16,
          cha: 10,
          breakdown: {
            ancestryFree: ["dex"],
            ancestryBoosts: ["dex", "wis"],
            ancestryFlaws: [],
            backgroundBoosts: ["dex", "wis"],
            classBoosts: ["str", "dex"],
            mapLevelledBoosts: {
              "1": ["dex", "wis", "con", "int"]
            }
          }
        },
        attributes: {
          ancestryhp: 8,
          classhp: 10,
          bonushp: 0,
          bonushpPerLevel: 0,
          speed: 25,
          speedBonus: 0
        },
        proficiencies: {
          classDC: 2,
          perception: 4,
          fortitude: 4,
          reflex: 4,
          will: 2,
          heavy: 0,
          medium: 2,
          light: 2,
          unarmored: 2,
          advanced: 0,
          martial: 2,
          simple: 2,
          unarmed: 2,
          castingArcane: 0,
          castingDivine: 0,
          castingOccult: 0,
          castingPrimal: 0,
          acrobatics: 0,
          arcana: 0,
          athletics: 2,
          crafting: 2,
          deception: 0,
          diplomacy: 0,
          intimidation: 0,
          medicine: 2,
          nature: 2,
          occultism: 0,
          performance: 0,
          religion: 0,
          society: 0,
          stealth: 2,
          survival: 2,
          thievery: 0
        },
        mods: {},
        feats: [["Animal Companion"]],
        specials: ["Hunt Prey", "Hunter's Edge"],
        lores: [["Forest Lore", 2]],
        equipmentContainers: {
          "82b9be15-ce85-4b3e-984b-b3c3e20a068b": {
            containerName: "Mochila",
            bagOfHolding: false,
            backpack: true
          }
        },
        equipment: [["Survival Kit", 1], ["Rope", 1], ["Arrows", 60]],
        specificProficiencies: {
          trained: [],
          expert: [],
          master: [],
          legendary: []
        },
        weapons: [
          {
            name: "Longbow",
            qty: 1,
            prof: "martial",
            die: "1d8",
            pot: 0,
            str: "",
            mat: null,
            display: "Longbow",
            runes: [],
            damageType: "piercing",
            attack: 7,
            damageBonus: 0,
            extraDamage: [],
            increasedDice: false,
            isInventor: false
          },
          {
            name: "Shortsword",
            qty: 1,
            prof: "martial",
            die: "1d6",
            pot: 0,
            str: "",
            mat: null,
            display: "Shortsword",
            runes: [],
            damageType: "piercing",
            attack: 7,
            damageBonus: 2,
            extraDamage: [],
            increasedDice: false,
            isInventor: false
          }
        ],
        money: {
          cp: 0,
          sp: 0,
          gp: 150,
          pp: 0
        },
        armor: [{
          name: "Studded Leather",
          qty: 1,
          prof: "light",
          pot: 0,
          res: "",
          mat: null,
          display: "Studded Leather",
          worn: true,
          runes: []
        }],
        spellCasters: [],
        focusPoints: 0,
        focus: {},
        formula: [],
        acTotal: {
          acProfBonus: 2,
          acAbilityBonus: 4,
          acItemBonus: 2,
          acTotal: 16,
          shieldBonus: ""
        },
        pets: [
          {
            name: "Lobo Compañero",
            type: "Wolf",
            ac: 15,
            hp: 20,
            attack: 5,
            damage: "1d8+2"
          }
        ],
        familiars: []
      }
    }
  }
}

// Función auxiliar para obtener la build de un personaje
export function getCharacterBuild(characterClass: string, race: string): FOUNDRY_BUILD | null {
  console.log(`[DEBUG] Buscando build para clase: "${characterClass}", raza: "${race}"`)
  
  const classBuilds = CHARACTER_BUILDS[characterClass]
  if (!classBuilds) {
    console.log(`[DEBUG] No se encontró la clase "${characterClass}" en CHARACTER_BUILDS`)
    console.log(`[DEBUG] Clases disponibles:`, Object.keys(CHARACTER_BUILDS))
    return null
  }
  
  const build = classBuilds[race]
  if (!build) {
    console.log(`[DEBUG] No se encontró la raza "${race}" para la clase "${characterClass}"`)
    console.log(`[DEBUG] Razas disponibles para ${characterClass}:`, Object.keys(classBuilds))
    // Si no hay build específica para esa raza en esa clase, devolver la build humana como fallback
    const fallbackBuild = classBuilds["Humano"]
    if (fallbackBuild) {
      console.log(`[DEBUG] Usando build humana como fallback`)
      return fallbackBuild
    }
    return null
  }
  
  console.log(`[DEBUG] Build encontrada exitosamente para ${characterClass} ${race}`)
  return build
}

// Función para obtener todas las combinaciones de clase y raza disponibles
export function getAvailableBuilds(): { class: string; races: string[] }[] {
  return Object.entries(CHARACTER_BUILDS).map(([className, races]) => ({
    class: className,
    races: Object.keys(races)
  }))
}

// Función para verificar si existe una build para una combinación específica
export function hasBuildAvailable(characterClass: string, race: string): boolean {
  const classBuilds = CHARACTER_BUILDS[characterClass]
  if (!classBuilds) return false
  
  return !!(classBuilds[race] || classBuilds["Humano"])
}

// Función para obtener información de resumen de una build
export function getBuildSummary(characterClass: string, race: string): string | null {
  const build = getCharacterBuild(characterClass, race)
  if (!build) return null
  
  const buildData = build.build
  return `${buildData.name} - Nivel ${buildData.level} | AC: ${buildData.acTotal.acTotal} | HP: ${buildData.attributes.ancestryhp + buildData.attributes.classhp} | Oro: ${buildData.money.gp}g`
} 