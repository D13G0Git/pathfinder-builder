// Type Definitions
export interface Abilities {
  str: number;
  dex: number;
  con: number;
  int: number;
  wis: number;
  cha: number;
  breakdown: {
    ancestryFree: string[];
    ancestryBoosts: string[];
    ancestryFlaws: string[];
    backgroundBoosts: string[];
    classBoosts: string[];
    mapLevelledBoosts: Record<string, string[]>;
  };
}

export interface Attributes {
  ancestryhp: number;
  classhp: number;
  bonushp: number;
  bonushpPerLevel: number;
  speed: number;
  speedBonus: number;
}

export interface Proficiencies {
  classDC: number;
  perception: number;
  fortitude: number;
  reflex: number;
  will: number;
  heavy: number;
  medium: number;
  light: number;
  unarmored: number;
  advanced: number;
  martial: number;
  simple: number;
  unarmed: number;
  castingArcane: number;
  castingDivine: number;
  castingOccult: number;
  castingPrimal: number;
  acrobatics: number;
  arcana: number;
  athletics: number;
  crafting: number;
  deception: number;
  diplomacy: number;
  intimidation: number;
  medicine: number;
  nature: number;
  occultism: number;
  performance: number;
  religion: number;
  society: number;
  stealth: number;
  survival: number;
  thievery: number;
}

export interface Money {
  cp?: number;
  sp?: number;
  gp?: number;
  pp?: number;
}

export interface SpecificProficiencies {
  trained: string[];
  expert: string[];
  master: string[];
  legendary: string[];
}

export interface Weapon {
  name: string;
  qty: number;
  prof: string;
  die: string;
  pot: number;
  str: string;
  mat: string | null;
  display: string;
  runes: any[];
  damageType: string;
  attack: number;
  damageBonus: number;
  extraDamage: any[];
  increasedDice: boolean;
  isInventor: boolean;
}

export interface Armor {
  name: string;
  qty: number;
  prof: string;
  pot: number;
  res: string;
  mat: string | null;
  display: string;
  worn: boolean;
  runes: any[];
}

export interface AcTotal {
  acProfBonus: number;
  acAbilityBonus: number;
  acItemBonus: number;
  acTotal: number;
  shieldBonus: string;
}

export interface Build {
  name: string;
  class: string;
  dualClass: string | null;
  level: number;
  ancestry: string;
  heritage: string;
  background: string;
  alignment: string;
  gender: string;
  age: string;
  deity: string;
  size: number;
  sizeName: string;
  keyability: string;
  languages: string[];
  rituals: any[];
  resistances: any[];
  inventorMods: any[];
  abilities: Abilities;
  attributes: Attributes;
  proficiencies: Proficiencies;
  mods: Record<string, any>;
  feats: Array<[string, string | null, string, number, (string | undefined)?, (string | undefined)?, (string | null | undefined)?]>;
  specials: string[];
  lores: Array<[string, number]>;
  equipmentContainers: Record<string, {
    containerName: string;
    bagOfHolding: boolean;
    backpack: boolean;
  }>;
  equipment: Array<[string, number, string?, string?]>;
  specificProficiencies: SpecificProficiencies;
  weapons: Weapon[];
  money: Money;
  armor: Armor[];
  spellCasters: any[];
  focusPoints: number;
  focus: Record<string, any>;
  formula: any[];
  acTotal: AcTotal;
  pets: any[];
  familiars: any[];
}

export interface FOUNDRY_BUILD {
  success: boolean;
  build: Build;
}

// --- Sample Build Objects (Minimized) ---

const FighterHumanoBuild: Build = {
  name: "Valiant Human Fighter",
  class: "Fighter",
  dualClass: null,
  level: 1,
  ancestry: "Humano",
  heritage: "Standard Human",
  background: "Warrior",
  alignment: "Lawful Good",
  gender: "Male",
  age: "25",
  deity: "Iomedae",
  size: 2, // Medium
  sizeName: "Medium",
  keyability: "str",
  languages: ["Common"],
  rituals: [],
  resistances: [],
  inventorMods: [],
  abilities: {
    str: 18, dex: 14, con: 16, int: 10, wis: 12, cha: 8,
    breakdown: { ancestryFree: ["str"], ancestryBoosts: ["str", "con"], ancestryFlaws: [], backgroundBoosts: ["str"], classBoosts: ["str"], mapLevelledBoosts: { "1": ["str", "dex", "con", "int"] } }
  },
  attributes: { ancestryhp: 8, classhp: 10, bonushp: 0, bonushpPerLevel: 0, speed: 25, speedBonus: 0 },
  proficiencies: { // Simplified relevant profs
    classDC: 10, perception: 4, fortitude: 6, reflex: 4, will: 3, heavy: 1, medium: 1, light: 1, unarmored: 0, advanced: 1, martial: 1, simple: 1, unarmed: 1, castingArcane: 0, castingDivine: 0, castingOccult: 0, castingPrimal: 0, acrobatics: 0, arcana: 0, athletics: 1, crafting: 0, deception: 0, diplomacy: 0, intimidation: 0, medicine: 0, nature: 0, occultism: 0, performance: 0, religion: 0, society: 0, stealth: 0, survival: 0, thievery: 0
  },
  mods: {},
  feats: [],
  specials: [],
  lores: [],
  equipmentContainers: {},
  equipment: [],
  specificProficiencies: { trained: [], expert: [], master: [], legendary: [] },
  weapons: [],
  money: { gp: 15 },
  armor: [],
  spellCasters: [],
  focusPoints: 0,
  focus: {},
  formula: [],
  acTotal: { acProfBonus: 0, acAbilityBonus: 0, acItemBonus: 0, acTotal: 10, shieldBonus: "" }, // Simplified
  pets: [],
  familiars: []
};

const WizardElfoBuild: Build = {
  name: "Elara Meadowlight",
  class: "Wizard",
  dualClass: null,
  level: 1,
  ancestry: "Elfo",
  heritage: "Ancient Elf",
  background: "Scholar",
  alignment: "Neutral Good",
  gender: "Female",
  age: "120",
  deity: "Nethys",
  size: 2, // Medium
  sizeName: "Medium",
  keyability: "int",
  languages: ["Common", "Elven"],
  rituals: [],
  resistances: [],
  inventorMods: [],
  abilities: {
    str: 8, dex: 14, con: 12, int: 18, wis: 10, cha: 16,
    breakdown: { ancestryFree: ["int"], ancestryBoosts: ["dex", "int"], ancestryFlaws: ["con"], backgroundBoosts: ["int"], classBoosts: ["int"], mapLevelledBoosts: { "1": ["int", "dex", "con", "wis"] } }
  },
  attributes: { ancestryhp: 6, classhp: 6, bonushp: 0, bonushpPerLevel: 0, speed: 30, speedBonus: 0 },
  proficiencies: { // Simplified relevant profs
    classDC: 10, perception: 4, fortitude: 3, reflex: 4, will: 6, heavy: 0, medium: 0, light: 0, unarmored: 0, advanced: 0, martial: 0, simple: 1, unarmed: 1, castingArcane: 1, castingDivine: 0, castingOccult: 0, castingPrimal: 0, acrobatics: 0, arcana: 1, athletics: 0, crafting: 0, deception: 0, diplomacy: 0, intimidation: 0, medicine: 0, nature: 0, occultism: 0, performance: 0, religion: 0, society: 0, stealth: 0, survival: 0, thievery: 0
  },
  mods: {},
  feats: [],
  specials: [],
  lores: [],
  equipmentContainers: {},
  equipment: [],
  specificProficiencies: { trained: [], expert: [], master: [], legendary: [] },
  weapons: [],
  money: { gp: 10 },
  armor: [],
  spellCasters: [],
  focusPoints: 0,
  focus: {},
  formula: [],
  acTotal: { acProfBonus: 0, acAbilityBonus: 0, acItemBonus: 0, acTotal: 10, shieldBonus: "" }, // Simplified
  pets: [],
  familiars: []
};

const RogueHumanoBuild: Build = {
  name: "Shadow Quickfoot",
  class: "Rogue",
  dualClass: null,
  level: 1,
  ancestry: "Humano",
  heritage: "Versatile Human",
  background: "Street Urchin",
  alignment: "Chaotic Neutral",
  gender: "Non-binary",
  age: "19",
  deity: "Calistria",
  size: 2, // Medium
  sizeName: "Medium",
  keyability: "dex",
  languages: ["Common"],
  rituals: [],
  resistances: [],
  inventorMods: [],
  abilities: {
    str: 12, dex: 18, con: 14, int: 14, wis: 8, cha: 10,
    breakdown: { ancestryFree: ["dex"], ancestryBoosts: ["dex", "int"], ancestryFlaws: [], backgroundBoosts: ["dex"], classBoosts: ["dex"], mapLevelledBoosts: { "1": ["dex", "con", "int", "str"] } }
  },
  attributes: { ancestryhp: 8, classhp: 8, bonushp: 0, bonushpPerLevel: 0, speed: 25, speedBonus: 0 },
  proficiencies: { // Simplified relevant profs
    classDC: 10, perception: 6, fortitude: 4, reflex: 6, will: 3, heavy: 0, medium: 0, light: 1, unarmored: 0, advanced: 0, martial: 0, simple: 1, unarmed: 1, castingArcane: 0, castingDivine: 0, castingOccult: 0, castingPrimal: 0, acrobatics: 1, arcana: 0, athletics: 0, crafting: 0, deception: 0, diplomacy: 0, intimidation: 0, medicine: 0, nature: 0, occultism: 0, performance: 0, religion: 0, society: 0, stealth: 1, survival: 0, thievery: 1
  },
  mods: {},
  feats: [],
  specials: [],
  lores: [],
  equipmentContainers: {},
  equipment: [],
  specificProficiencies: { trained: [], expert: [], master: [], legendary: [] },
  weapons: [],
  money: { gp: 20 },
  armor: [],
  spellCasters: [],
  focusPoints: 0,
  focus: {},
  formula: [],
  acTotal: { acProfBonus: 0, acAbilityBonus: 0, acItemBonus: 0, acTotal: 10, shieldBonus: "" }, // Simplified
  pets: [],
  familiars: []
};

// --- CHARACTER_BUILDS Constant ---

const CHARACTER_BUILDS: Record<string, Record<string, FOUNDRY_BUILD>> = {
  "Fighter": {
    "Humano": { success: true, build: FighterHumanoBuild }
  },
  "Wizard": {
    "Elfo": { success: true, build: WizardElfoBuild }
  },
  "Rogue": {
    "Humano": { success: true, build: RogueHumanoBuild }
  }
};

// Función auxiliar para obtener la build de un personaje
export function getCharacterBuild(characterClass: string, race: string): FOUNDRY_BUILD | null {
  const classBuilds = CHARACTER_BUILDS[characterClass];
  if (!classBuilds) {
    console.warn(`No builds found for class: ${characterClass}`);
    return null;
  }
  
  const build = classBuilds[race];
  if (!build) {
    // Si no hay build específica para esa raza en esa clase, devolver la build humana como fallback si existe para esa clase
    const fallbackBuild = classBuilds["Humano"];
    if (fallbackBuild) {
      console.warn(`No build found for ${race} in ${characterClass}. Falling back to Humano.`);
      return fallbackBuild;
    }
    console.warn(`No build found for ${race} in ${characterClass}, and no Humano fallback available for this class.`);
    return null;
  }
  
  return build;
}