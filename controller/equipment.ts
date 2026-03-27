import { EQUIPMENT_SLOT } from "../types/Character"
import type { Character, Equipment } from "../types/Character"
import { calculate_modifiers } from "./mod"

export const equip = (character: Character, equipment: Equipment): Character => {
  if (equipment.slot == EQUIPMENT_SLOT.ARMOR)
    character.equipment_armor = equipment

  if (equipment.slot == EQUIPMENT_SLOT.WEAPON)
    character.equipment_weapon = equipment

  if (equipment.slot == EQUIPMENT_SLOT.ACCESSORY)
    character.equipment_accessory = equipment

  return calculate_modifiers(character)
}
