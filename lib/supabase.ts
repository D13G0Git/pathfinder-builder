import { createClient } from '@supabase/supabase-js'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

// Validar variables de entorno requeridas
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    'Faltan variables de entorno requeridas: NEXT_PUBLIC_SUPABASE_URL y NEXT_PUBLIC_SUPABASE_ANON_KEY'
  )
}

// Cliente de Supabase para componentes del lado del cliente que maneja cookies automáticamente
export const supabase = createClientComponentClient()

// Cliente básico para casos donde se necesite el cliente estándar
export const supabaseClient = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    flowType: 'pkce'
  }
})

// Interfaz para los datos básicos del personaje en la tabla
export interface UserCharacter {
  id: string
  user_id: string
  name: string
  class: string
  level: number
  race: string
  avatar: string
  created_at: string
  // Campos nuevos
  avatar_base64?: string
  character_data?: PathfinderCharacter // JSON completo del personaje
}

// Interfaz para el historial de decisiones del usuario
export interface UserDecision {
  id: string
  user_id: string
  character_id: string
  scenario_id: string
  choice_id: string
  created_at: string
}

// Interfaz completa para un personaje de Pathfinder según el formato JSON proporcionado
export interface PathfinderCharacter {
  success: boolean;
  build: {
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
    abilities: {
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
        mapLevelledBoosts: {
          [key: string]: string[];
        };
      };
    };
    attributes: {
      ancestryhp: number;
      classhp: number;
      bonushp: number;
      bonushpPerLevel: number;
      speed: number;
      speedBonus: number;
    };
    proficiencies: {
      [key: string]: number;
    };
    mods: Record<string, any>;
    feats: Array<any[]>;
    specials: string[];
    lores: Array<[string, number]>;
    equipmentContainers: {
      [key: string]: {
        containerName: string;
        bagOfHolding: boolean;
        backpack: boolean;
      };
    };
    equipment: Array<any[]>;
    specificProficiencies: {
      trained: any[];
      expert: any[];
      master: any[];
      legendary: any[];
    };
    weapons: Array<{
      name: string;
      qty: number;
      prof: string;
      die: string;
      pot: number;
      str: string;
      mat: any;
      display: string;
      runes: any[];
      damageType: string;
      attack: number;
      damageBonus: number;
      extraDamage: any[];
      increasedDice: boolean;
      isInventor: boolean;
    }>;
    money: {
      cp: number;
      sp: number;
      gp: number;
      pp: number;
    };
    armor: Array<{
      name: string;
      qty: number;
      prof: string;
      pot: number;
      res: string;
      mat: any;
      display: string;
      worn: boolean;
      runes: any[];
    }>;
    spellCasters: any[];
    focusPoints: number;
    focus: Record<string, any>;
    formula: any[];
    acTotal: {
      acProfBonus: number;
      acAbilityBonus: number;
      acItemBonus: number;
      acTotal: number;
      shieldBonus: string;
    };
    pets: any[];
    familiars: any[];
  };
}