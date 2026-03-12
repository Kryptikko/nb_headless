import _ from "lodash"
import type { Character, CombatEffectHandler } from '../types/Character.ts'
import cast_bar from "../screen/components/cast_bar.ts"
import { Burning } from "../data/status.ts"
import get_ability from "../data/abilities.ts"
import type { CombatEffect, CombatEffectContext } from "../types/Ability.ts"
import { COMBAT_EFFECT } from "../types/Ability.ts"
import { render } from "../lib/render.ts"
// type CombatEffectHandler = (caster: Character, target: Character, ability: CombatAbility) => string

// const do_physical_damage = (caster: Character, target: Character, ability: CombatAbility) => {
//   const damage = ability.base_power + caster.att
//   target.hp_now -= _.clamp(damage, 0, target.hp_now)
//   return `${caster.display_name} uses ${ability.display_name} on ${target.display_name} for 💥 -${damage}!`
// }
//
// const do_magic_damage = (caster: Character, target: Character, ability: CombatAbility) => {
//   const damage = ability.base_power + caster.mgc
//   target.hp_now -= _.clamp(damage, 0, target.hp_now)
//   return `${caster.display_name} uses ${ability.display_name} on ${target.display_name} for ✨ -${damage}!`
// }
//
// const do_heal = (caster: Character, target: Character, ability: CombatAbility) => {
//   const heal = ability.base_power + caster.mgc
//   target.hp_now = _.clamp(target.hp_now + heal, 0, target.hp_max);
//   return `${caster.display_name} uses ${ability.display_name} on ${target.display_name} for ✨ -${heal}!`
// }
//
// // just do magic damage?
// const do_burn = (caster: Character, target: Character, ability: CombatAbility) => {
//   const burn = ability.base_power + caster.mgc
//   target.hp_now -= _.clamp(burn, 0, target.hp_now)
//   return `${caster.display_name} uses ${ability.display_name} on ${target.display_name} for 🔥 -${burn}!`
// }
//
// const apply_burning = (caster: Character, target: Character, ability: CombatAbility) => {
//   // const burn = ability.base_power + caster.mgc
//   if (!_.find(target.status, { source: caster.id, id: "burning" })) {
//     target.status.push({ ...Burning, source: caster.id })
//     return `${caster.display_name} applies ${ability.display_name} on ${target.display_name}`
//   }
//   return '';
// }

const _noop = (_delta: number, _source: Character, _target: Character, _context: CombatEffect) => { }
const _physical_damage: CombatEffectHandler = {
  apply: (source: Character, target: Character, context: CombatEffect) => {

    const damage = context.base_power + source.att
    //TODO apply armor
    //TODO: submit log
    target.hp_now -= _.clamp(damage, 0, target.hp_now)
    //   return `${source.display_name} uses ${ability.display_name} on ${target.display_name} for 💥 -${damage}!`
  },
  process: _noop,
}
// apply unique per person effect
// stack effect
const _apply_dot: CombatEffectHandler = {
  apply: (source: Character, target: Character, context: CombatEffect) => {
    // check if effect exists
    const existing_effect = _.find(target.active_effect, e => e.handler == context.handler)
    if (existing_effect) {
      existing_effect.duration_now = context.duration
      // can stack
      // existing_effect.stack = _.clamp(existing_effect.stack + 1, 0, context.max_stack)
    } else {
      const ctx = Object.assign({}, context, {
        id: [source.id, target.id, context.handler].join('|'),
        source: source.id,
        target: target.id
      })
      target.active_effect.push(ctx)
    }
    // target.active_effect.push()
    //TODO apply armor
    //TODO: submit log
    //   return `${source.display_name} uses ${ability.display_name} on ${target.display_name} for 💥 -${damage}!`
  },
  process: (delta: number, source: Character, target: Character, context: CombatEffect) => {
    context.duration_now -= delta
    if (context.duration_now < 0) {
      target.hp_now -= _.clamp(context.base_power + source.mgc, 0, target.hp_max)
      context.tick_count--
      if (context.tick_count !== 0) {
        context.duration_now = context.duration
      }
    }
  }
}

const ability_handler_repo: Record<COMBAT_EFFECT, CombatEffectHandler> = {
  [COMBAT_EFFECT.PHYSICAL_DAMAGE]: _physical_damage,
  [COMBAT_EFFECT.MAGIC_DAMAGE]: _physical_damage,
  [COMBAT_EFFECT.HEAL]: _physical_damage,
  [COMBAT_EFFECT.BURN]: _physical_damage,
  [COMBAT_EFFECT.BURNING]: _apply_dot,
}
export default ability_handler_repo;
