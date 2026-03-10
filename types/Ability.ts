export enum ABILITY {
  DEFAULT,
  HEALING_WORD,
  CLEAVE,
  BLIZZARD,
  MELEE,
  FIREBOLT,
}

export enum COMBAT_EFFECT {
  PHYSICAL_DAMAGE,
  MAGIC_DAMAGE,
  HEAL,
  BURNING,
  BURN,
}

export enum TARGET_TYPE {
  ENEMY,
  FRIEND,
}

type BaseContext = {
  id: string
  source: string // caster id
  target: string // target id
}
export type CombatAbilityContext = BaseContext & {
  cooldown_now: number
  ability_id: ABILITY // abiity id can be a composition of source+ability+effec
}

type CombatEffectBase = {
  handler: COMBAT_EFFECT,
  base_power: number,
}
type CombatEffectOverTime = {
  duration?: number,
  tick_count?: number,
  max_stack?: number,
}

export type CombatEffect = CombatEffectBase & CombatEffectOverTime
export type CombatEffectContext = BaseContext & CombatEffect

export type CombatAbility = {
  id: ABILITY
  display_name: string
  // visual_icon: string //texture icon
  target_type: TARGET_TYPE
  target_count: number
  cooldown: number,
  effects: Array<CombatEffect>
}
