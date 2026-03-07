import type { CombatAbility } from '../types/Character.ts'
import { TARGET_TYPE, COMBAT_EFFECT } from '../types/Character.ts'

// abilities work by having generic behaviour
export const Blizzard: CombatAbility = {
  id: "blizzard",
  display_name: "Blizzard",
  target_type: TARGET_TYPE.ENEMY,
  target_count: 4,
  base_power: 1,
  effects: [COMBAT_EFFECT.MAGIC_DAMAGE]
}
export const HealingWord: CombatAbility = {
  id: "healing_word",
  display_name: "Healing Word",
  target_type: TARGET_TYPE.FRIEND,
  target_count: 1,
  base_power: 2,
  effects: [COMBAT_EFFECT.HEAL]
}
export const MeleeAttack: CombatAbility = {
  id: "std_melee",
  display_name: "Melee",
  target_type: TARGET_TYPE.ENEMY,
  target_count: 1,
  base_power: 1,
  effects: [COMBAT_EFFECT.PHYSICAL_DAMAGE]
}
export const Cleave: CombatAbility = {
  id: "cleave",
  display_name: "Cleave",
  target_type: TARGET_TYPE.ENEMY,
  target_count: 2,
  base_power: 1,
  effects: [COMBAT_EFFECT.PHYSICAL_DAMAGE]
}
