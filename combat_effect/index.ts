import _ from "lodash"
import { COMBAT_EFFECT } from '../types/Character.ts'
import type { Character, CombatAbility } from '../types/Character.ts'
// type CombatEffectHandler = (caster: Character, target: Character, ability: CombatAbility) => string

const do_physical_damage = (caster: Character, target: Character, ability: CombatAbility) => {
  const damage = ability.base_power + caster.att
  target.hp_now -= _.clamp(damage, 0, target.hp_now)
  return `${caster.display_name} uses ${ability.display_name} on ${target.display_name} for 💥 -${damage}!`
}

const do_magic_damage = (caster: Character, target: Character, ability: CombatAbility) => {
  const damage = ability.base_power + caster.mgc
  target.hp_now -= _.clamp(damage, 0, target.hp_now)
  return `${caster.display_name} uses ${ability.display_name} on ${target.display_name} for ✨ -${damage}!`
}

const do_heal = (caster: Character, target: Character, ability: CombatAbility) => {
  const heal = ability.base_power + caster.mgc
  target.hp_now = _.clamp(target.hp_now + heal, 0, target.hp_max);
  return `${caster.display_name} uses ${ability.display_name} on ${target.display_name} for ✨ -${heal}!`
}

export default {
  [COMBAT_EFFECT.PHYSICAL_DAMAGE]: do_physical_damage,
  [COMBAT_EFFECT.MAGIC_DAMAGE]: do_magic_damage,
  [COMBAT_EFFECT.HEAL]: do_heal,
}
