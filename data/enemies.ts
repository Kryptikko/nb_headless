import { default_character, type Character } from "../types/Character"

export const Goblin: Character = {
  ...default_character,
  display_name: "Golbin",
  hp_max: 20,
  hp_now: 20,
  level: 1,
  xp: 0,
  att: 1,
  def: 1,
  mgc: 1,
  ini: 2,
  ability_primary: 'melee'
}
export const Troll: Character = {
  ...default_character,
  display_name: "Troll",
  hp_max: 60,
  hp_now: 60,
  level: 2,
  xp: 0,
  att: 2,
  def: 2,
  mgc: 1,
  ini: 2,
  ability_primary: 'cleave'
}
