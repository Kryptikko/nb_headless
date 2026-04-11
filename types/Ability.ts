export enum TARGETTING {
  ENEMY_SINGLE,
  ENEMY_ALL,
  FRIEND_SINGLE,
  FRIEND_ALL,
}

export type DamageEffect = {
  type: "DamageEffect"
  school: string // todo: enum
  value: number
  mod: number
  can_crit: boolean // take crit chance from player
}
// to be implemented
export type PeriodicDamageEffect = {
  type: "ApplyAura::PeriodicDamage"
  school: string
  value: number
  mod: number
  tick_rate: number
  can_crit: boolean
}
// to be implemented
export type StunEffect = {
  type: "ApplyAura::Stun"
  value: number
  chance: number
}
export type AbilityEffect = DamageEffect | PeriodicDamageEffect | StunEffect

export type AbilityDefinition = {
  id: string
  display_name: string
  display_description: string
  cooldown: number
  cast_time: number
  vfx: string
  targetting: TARGETTING // todo: enum
  // trigger // on hit, on being hit, Passive, Active
  // flags: string[]
  effect_on_hit: AbilityEffect[]
}
