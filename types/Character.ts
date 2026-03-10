export enum COMBAT_EFFECT {
  PHYSICAL_DAMAGE,
  MAGIC_DAMAGE,
  HEAL,
  BURNING,
  BURN,
}

export enum COMBAT_POSITION {
  ATTACKER,
  DEFENDER
}
// enum MODIFIER_TYPE {
//   ADD,
//   MUL
// }
// export type Modifier = {
//   type: MODIFIER_TYPE,
//   stat: string,
//   value: number
// }
// export type CombatBuff = {
//   duration: number,
//   stack: number,
//   max_stack: number,
// }

export enum TARGET_TYPE {
  ENEMY,
  FRIEND,
}

export type CombatEffectContext = {
  id: string // ?
  cooldown_now: number,
  effect: COMBAT_EFFECT,
  ability: string,
  source: string, // caster id
  target: string, // target id
  // dots
  duration: number,
  tickCount: number,
}
type CombatLog = {

}
type CombatEffectLog = {

}

export type CombatEffect = {
  apply: (source: Character, target: Character, ability: CombatAbility) => void
  process: (source: Character, target: Character, ability: CombatAbility) => void
  clear: (source: Character, target: Character, ability: CombatAbility) => void
}

export type CombatAbility = {
  id: string
  display_name: string
  //TODO: flags, crit, scaling(scaling should be on effect?), damage type
  // visual_icon: string //texture icon
  target_type: TARGET_TYPE
  target_count: number,
  cooldown: number,
  base_power: number,
  effects: Array<COMBAT_EFFECT>
  // school. physical, magic, fire, water etc
  // flags: 
  // recovery/cooldown
  // casttime
  // cost: {
  //   hp_now: number,
  // },
  // pre_effect
  // post_effect
  // fail_effect
  // gear
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
  ability_primary: CombatAbility // move to just an id
  // combat overhead
  position?: COMBAT_POSITION
  current_ability: CombatEffectContext
  active_effect: Array<CombatEffectContext>
}
