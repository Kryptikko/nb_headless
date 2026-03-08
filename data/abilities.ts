import type { CombatAbility } from '../types/Character.ts'
import { TARGET_TYPE, COMBAT_EFFECT } from '../types/Character.ts'

const _ability_defaults: CombatAbility = {
  id: "!!DEFAULT!!",
  display_name: "!!DEFAULT!!",
  target_type: TARGET_TYPE.ENEMY,
  target_count: 1,
  base_power: 1,
  effects: [],
  cooldown: 0,
  cooldown_now: 0
}
// abilities work by having generic behaviour
export const Blizzard: CombatAbility = {
  ..._ability_defaults,
  id: "blizzard",
  display_name: "Blizzard",
  target_type: TARGET_TYPE.ENEMY,
  target_count: 4,
  base_power: 1,
  effects: [COMBAT_EFFECT.MAGIC_DAMAGE],
  cooldown: 4000
}
export const HealingWord: CombatAbility = {
  ..._ability_defaults,
  id: "healing_word",
  display_name: "Healing Word",
  target_type: TARGET_TYPE.FRIEND,
  target_count: 1,
  base_power: 2,
  effects: [COMBAT_EFFECT.HEAL],
  cooldown: 3000
}
export const MeleeAttack: CombatAbility = {
  ..._ability_defaults,
  id: "std_melee",
  display_name: "Melee",
  target_type: TARGET_TYPE.ENEMY,
  target_count: 1,
  base_power: 1,
  effects: [COMBAT_EFFECT.PHYSICAL_DAMAGE],
  cooldown: 2000
}
export const Cleave: CombatAbility = {
  ..._ability_defaults,
  id: "cleave",
  display_name: "Cleave",
  target_type: TARGET_TYPE.ENEMY,
  target_count: 2,
  base_power: 1,
  effects: [COMBAT_EFFECT.PHYSICAL_DAMAGE],
  cooldown: 3000
}
