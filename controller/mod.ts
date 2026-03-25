import _ from "lodash"
import type { Character, CharacterModifier } from "../types/Character"
import character_status from "../screen/components/character_status"

export const apply_mod = (character: Character, mod: CharacterModifier) => {
  character.aura.push(mod)
  if (mod.type == "ADD") {
    character[mod.attribute] += mod.value
  }
  if (mod.type == "MUL") {
    character[mod.attribute] += mod.value
  }
}
export const remove_mod = (character: Character) => {
}

const _calculate_mods = (character: Character): Character => {
  // reset to base stats
  const multi = 0
  const addative = 0
  _(character.aura)
    .keyBy('attribute')
    .forIn((key, value) => {
    })
  return character
}

const _calculate_mod = (character: Character, mod: string): Character => {
  return character
}
