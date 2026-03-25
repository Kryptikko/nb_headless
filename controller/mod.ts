import _ from "lodash"
import type { Character, CharacterModifier } from "../types/Character"
import character_status from "../screen/components/character_status"

export const apply_modifier = (character: Character, mod: CharacterModifier) => {
  character.aura.push(mod)
  _calculate_modifiers()
}
export const remove_mod = (character: Character) => {
}

// (base + addative) * multiplicative
const _calculate_modifiers = (character: Character): Character => {
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
