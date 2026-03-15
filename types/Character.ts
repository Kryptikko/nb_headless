import type { ABILITY, CombatEffect, CombatEffectContext } from "./Ability"

export type CombatEffectHandler = {
  apply: (source: Character, target: Character, context: CombatEffect) => void
  process: (delta: number, source: Character, target: Character, context: CombatEffect) => void
}
export type Character = {
  id: string
  display_name: string // max 10
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
  active_effect: Array<CombatEffectContext>
}
