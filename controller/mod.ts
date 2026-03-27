import _, { sum } from "lodash"
import type { Character, CharacterAura, CharacterModifier } from "../types/Character"
import { default_modifier, MODIFIER_TYPE } from "../types/Character"
import character_status from "../screen/components/character_status"

export const apply_modifier = (character: Character, aura: CharacterAura): Character => {
  character.aura.push(aura)
  return calculate_modifiers(character)
}
export const remove_modifier = (character: Character, aura: CharacterAura) => {
  _.remove(character.aura, aura)
  return calculate_modifiers(character)
}

const ATTRIBUTES = ['hp_max', 'att', 'def', 'mgc', 'ini'];

// (base + addative) * multiplicative
export const calculate_modifiers = (character: Character): Character => {
  // reset to base stats
  const sum_mod = { ...default_modifier }
  const mult_mod = {
    hp_max: 1,
    att: 1,
    def: 1,
    mgc: 1,
    ini: 1,
  }
  var equipment_mods = [
    character.equipment_accessory.modifiers,
    character.equipment_weapon.modifiers,
    character.equipment_armor.modifiers
  ]

  _(character.aura)
    .map('modifiers')
    .concat(equipment_mods)
    .forEach((mod: CharacterModifier) => {
      if (mod.type == MODIFIER_TYPE.ADDATIVE) {
        sum_mod.hp_max = sum_mod.hp_max + mod.hp_max;
        sum_mod.att = sum_mod.att + mod.att;
        sum_mod.def = sum_mod.def + mod.def;
        sum_mod.mgc = sum_mod.mgc + mod.mgc;
        sum_mod.ini = sum_mod.ini + mod.ini;
      }
      if (mod.type == MODIFIER_TYPE.MULTIPLICATIVE) {
        mult_mod.hp_max = mult_mod.hp_max + mod.hp_max;
        mult_mod.att = mult_mod.att + mod.att;
        mult_mod.def = mult_mod.def + mod.def;
        mult_mod.mgc = mult_mod.mgc + mod.mgc;
        mult_mod.ini = mult_mod.ini + mod.ini;
      }
    })
  for (let i = 0; i < ATTRIBUTES.length; i++) {
    const element = ATTRIBUTES[i];
    //@ts-ignore
    const value = (_.get(character, `base_${element}`) + sum_mod[element]) * mult_mod[element]
    //@ts-ignore
    _.set(character, element, value)
  }
  return character
}
