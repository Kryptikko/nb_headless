import type { ABILITY, CombatEffect, CombatEffectContext } from "./Ability"

export type CombatEffectHandler = {
  apply: (source: Character, target: Character, context: CombatEffect) => void
  process: (delta: number, source: Character, target: Character, context: CombatEffect) => void
}
type CharacterModifiableAttribute = "hp_max" | "hp_now" | "att" | "def" | "mgc" | "ini"

export type CharacterModifier = {
  id: string,
  attribute: CharacterModifiableAttribute
  type: "ADD" | "MUL"
  value: number
}

export type Character = {
  id: string
  display_name: string
  // character
  level: number
  xp: number
  // combat
  hp_max: number
  hp_now: number
  // mp_max: number,
  // mp_now: number,
  att: number
  def: number
  mgc: number
  ini: number
  ability_primary: ABILITY // move to just an id
  // combat overhead
  // ability_current: CombatEffectContext
  // active_effects: Array<CombatEffectContext>
  aura: Array<CharacterModifier>
}
