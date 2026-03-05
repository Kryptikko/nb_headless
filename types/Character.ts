export enum COMBAT_POSITION {
  ATTACKER,
  DEFENDER
}
enum MODIFIER_TYPE {
  ADD,
  MUL
}
export type Modifier = {
  type: MODIFIER_TYPE,
  stat: string,
  value: number
}
export type Ability = {
  caster: {
    hp_max: number,
    hp_now: number,
  },
  target: {
    hp_max: number,
    hp_now: number,
    att: number,
    def: number,
    mgc: number,
    ini: number, // ?
  }
}

export type Character = {
  id: string,
  display_name: string, // max 10
  // character
  level: number,
  xp: number,
  // combat
  hp_max: number,
  hp_now: number,
  // mp_max: number,
  // mp_now: number,
  att: number,
  def: number,
  mgc: number,
  ini: number,
  // combat overhead
  position?: COMBAT_POSITION
}
