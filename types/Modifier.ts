export enum MODIFIER_TYPE {
  ADDATIVE,
  MULTIPLICATIVE,
  // expand with multiplicate before stat application and adter
}

export type CharacterModifier = {
  type: MODIFIER_TYPE
  hp_max: number
  att: number
  def: number
  mgc: number
  ini: number
}

export const default_modifier: CharacterModifier = {
  type: MODIFIER_TYPE.ADDATIVE,
  hp_max: 0,
  att: 0,
  def: 0,
  mgc: 0,
  ini: 0,
}
