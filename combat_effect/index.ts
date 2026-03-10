import _ from "lodash"
import { COMBAT_EFFECT } from '../types/Character.ts'
import type { Character, CombatAbility, CombatEffect } from '../types/Character.ts'
import cast_bar from "../screen/components/cast_bar.ts"
import { Burning } from "../data/status.ts"
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

// just do magic damage?
const do_burn = (caster: Character, target: Character, ability: CombatAbility) => {
  const burn = ability.base_power + caster.mgc
  target.hp_now -= _.clamp(burn, 0, target.hp_now)
  return `${caster.display_name} uses ${ability.display_name} on ${target.display_name} for 🔥 -${burn}!`
}

const apply_burning = (caster: Character, target: Character, ability: CombatAbility) => {
  // const burn = ability.base_power + caster.mgc
  if (!_.find(target.status, { source: caster.id, id: "burning" })) {
    target.status.push({ ...Burning, source: caster.id })
    return `${caster.display_name} applies ${ability.display_name} on ${target.display_name}`
  }
  return '';
}
const _noop = () => { }
const _physical_damage: CombatEffect = {
  apply: (source: Character, target: Character) => {
  },
  process: (_source: Character, _target: Character) => _noop
}
const repo: Record<COMBAT_EFFECT, CombatEffect> = {
  [COMBAT_EFFECT.PHYSICAL_DAMAGE]: _physical_damage,
  [COMBAT_EFFECT.MAGIC_DAMAGE]: _physical_damage,
  [COMBAT_EFFECT.HEAL]: _physical_damage,
  [COMBAT_EFFECT.BURN]: _physical_damage,
  [COMBAT_EFFECT.BURNING]: _physical_damage,
}
export default repo;
