import { ABILITY } from "../types/Ability"
import type { Character } from "../types/Character"

const _default_mob: Character = {
  id: '',
  display_name: "",
  hp_max: 10,
  hp_now: 10,
  level: 1,
  xp: 0,
  att: 1,
  def: 1,
  mgc: 1,
  ini: 2,
  ability_primary: ABILITY.MELEE,
  active_effect: []
}
export const Goblin: Character = {
  ..._default_mob,
  display_name: "Golbin",
  hp_max: 20,
  hp_now: 20,
  level: 1,
  xp: 0,
  att: 1,
  def: 1,
  mgc: 1,
  ini: 2,
  ability_primary: ABILITY.MELEE
}
export const Troll: Character = {
  ..._default_mob,
  display_name: "Troll",
  hp_max: 60,
  hp_now: 60,
  level: 2,
  xp: 0,
  att: 2,
  def: 2,
  mgc: 1,
  ini: 2,
  ability_primary: ABILITY.CLEAVE
}
