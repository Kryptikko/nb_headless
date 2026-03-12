import { ABILITY, COMBAT_EFFECT, TARGET_TYPE, type CombatAbility } from "../types/Ability";

const _ability_defaults: CombatAbility = {
  id: ABILITY.DEFAULT,
  display_name: "!!DEFAULT!!",
  target_type: TARGET_TYPE.ENEMY,
  target_count: 1,
  effects: [],
  cooldown: 0,
}
// abilities work by having generic behaviour
const Blizzard: CombatAbility = Object.freeze({
  ..._ability_defaults,
  id: ABILITY.BLIZZARD,
  display_name: "Blizzard",
  target_type: TARGET_TYPE.ENEMY,
  target_count: 4,
  effects: [{
    handler: COMBAT_EFFECT.MAGIC_DAMAGE,
    base_power: 1,
    tags: [],
    duration: 0,
    duration_now: 0,
    stack: 0,
    max_stack: 0
  }],
  cooldown: 4000
})
// const HealingWord: CombatAbility = Object.freeze({
//   ..._ability_defaults,
//   id: ABILITY.HEALING_WORD,
//   display_name: "Healing Word",
//   target_type: TARGET_TYPE.FRIEND,
//   target_count: 1,
//   effects: [{
//     handler: COMBAT_EFFECT.HEAL,
//     base_power: 1,
//   }],
//   cooldown: 3000
// })
const MeleeAttack: CombatAbility = Object.freeze({
  ..._ability_defaults,
  id: ABILITY.MELEE,
  display_name: "Melee",
  target_type: TARGET_TYPE.ENEMY,
  target_count: 1,
  effects: [{
    handler: COMBAT_EFFECT.PHYSICAL_DAMAGE,
    base_power: 1,
    tags: [],
    duration: 0,
    duration_now: 0,
    stack: 0,
    max_stack: 0
  }],
  cooldown: 2000
})
const Cleave: CombatAbility = Object.freeze({
  ..._ability_defaults,
  id: ABILITY.CLEAVE,
  display_name: "Cleave",
  target_type: TARGET_TYPE.ENEMY,
  target_count: 2,
  effects: [{
    handler: COMBAT_EFFECT.PHYSICAL_DAMAGE,
    base_power: 1,
    tags: [],
    duration: 0,
    duration_now: 0,
    stack: 0,
    max_stack: 0
  }],
  cooldown: 3000
})
const FireBolt: CombatAbility = Object.freeze({
  ..._ability_defaults,
  id: ABILITY.FIREBOLT,
  display_name: "Fire Bolt",
  target_type: TARGET_TYPE.ENEMY,
  target_count: 1,
  effects: [{
    handler: COMBAT_EFFECT.BURN,
    base_power: 2,
    tags: [],
    duration: 0,
    duration_now: 0,
    stack: 0,
    max_stack: 0
  }, {
    handler: COMBAT_EFFECT.BURNING,
    base_power: 1,
    tick_count: 4,
    tags: [],
    duration: 2000,
    duration_now: 0,
    max_stack: 1,
    stack: 0,
    visual: "b"
  }],
  cooldown: 3000
})

const repo: Record<ABILITY, CombatAbility> = Object.freeze({
  [ABILITY.DEFAULT]: _ability_defaults,
  [ABILITY.CLEAVE]: Cleave,
  [ABILITY.HEALING_WORD]: _ability_defaults,
  // [ABILITY.HEALING_WORD]: HealingWord,
  [ABILITY.BLIZZARD]: Blizzard,
  [ABILITY.MELEE]: MeleeAttack,
  [ABILITY.FIREBOLT]: FireBolt
})
const get_ability = (id: ABILITY): CombatAbility => repo[id]
export default get_ability
