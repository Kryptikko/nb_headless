import { ABILITY, type CombatEffect, type CombatEffectContext } from "./Ability"

export type CombatEffectHandler = {
  apply: (source: Character, target: Character, context: CombatEffect) => void
  process: (delta: number, source: Character, target: Character, context: CombatEffect) => void
}

export enum MODIFIER_TYPE {
  ADDATIVE,
  MULTIPLICATIVE,
  // expand with multiplicate before stat application and adter
}

export type CharacterModifier = {
  type: MODIFIER_TYPE
  hp_max: number
  att: number
  def: number
  mgc: number
  ini: number
}

export type CharacterAura = {
  id: string
  display_name: string
  duration: number
  // source
  modifiers: CharacterModifier
}

export enum EQUIPMENT_SLOT {
  ARMOR,
  WEAPON,
  ACCESSORY
}

// TODO have Equipment template for the base definitoin and then differnt strucutre for an instance
export type Equipment = {
  id: string
  display_name: string
  slot: EQUIPMENT_SLOT
  modifiers: CharacterModifier
}

export type Character = {
  id: string
  display_name: string
  // character
  level: number
  xp: number
  // combat
  hp_now: number
  base_hp_max: number,
  base_att: number
  base_def: number
  base_mgc: number
  base_ini: number
  hp_max: number
  att: number
  def: number
  mgc: number
  ini: number
  ability_primary: ABILITY // move to just an id
  // combat overhead
  // ability_current: CombatEffectContext
  // active_effects: Array<CombatEffectContext>
  aura: Array<CharacterAura>
  //TODO hava a global store and just apply ids
  equipment_armor: Equipment
  equipment_weapon: Equipment
  equipment_accessory: Equipment
}

export const default_modifier: CharacterModifier = {
  type: MODIFIER_TYPE.ADDATIVE,
  hp_max: 0,
  att: 0,
  def: 0,
  mgc: 0,
  ini: 0,
}

export const default_equipment: Equipment = {
  id: "default_equipment",
  display_name: "Default Equipment",
  slot: EQUIPMENT_SLOT.ARMOR,
  modifiers: default_modifier
}

export const default_character: Character = {
  id: '_default',
  display_name: "Default",
  level: 1,
  xp: 100,
  hp_now: 100,
  hp_max: 100,
  att: 1,
  def: 1,
  mgc: 1,
  ini: 1,
  base_hp_max: 100,
  base_att: 1,
  base_def: 1,
  base_mgc: 1,
  base_ini: 1,
  ability_primary: ABILITY.DEFAULT,
  aura: [],
  equipment_accessory: { ...default_equipment, slot: EQUIPMENT_SLOT.ACCESSORY },
  equipment_armor: { ...default_equipment, slot: EQUIPMENT_SLOT.ARMOR },
  equipment_weapon: { ...default_equipment, slot: EQUIPMENT_SLOT.WEAPON }
}
