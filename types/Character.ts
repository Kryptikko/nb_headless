export enum COMBAT_EFFECT {
  PHYSICAL_DAMAGE,
  MAGIC_DAMAGE,
  HEAL,
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

export type CombatAbility = {
  id: string
  display_name: string
  // visual_icon: string //texture icon
  target_type: TARGET_TYPE
  target_count: number
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
  base_power: number,
  effects: Array<COMBAT_EFFECT>
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
  ability_primary: CombatAbility
  // combat overhead
  position?: COMBAT_POSITION
  // combat_effects: Array<CombatEffect>
  // ability_passive: CombatAbility
}
