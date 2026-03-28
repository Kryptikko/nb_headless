import _ from "lodash"
import type { Character } from "../types/Character"
import type { WorldState } from "../types/WorldState"
import { calculate_modifiers } from "./mod"
import { EQUIPMENT_SLOT, type Equipment } from "../types/Equipment"

export const equip = (character: Character, equipment: Equipment): Character => {
  // check if the equipment exists, if yes remove it from the bank
  if (equipment.slot == EQUIPMENT_SLOT.ARMOR)
    character.equipment_armor = equipment

  if (equipment.slot == EQUIPMENT_SLOT.WEAPON)
    character.equipment_weapon = equipment

  if (equipment.slot == EQUIPMENT_SLOT.ACCESSORY)
    character.equipment_accessory = equipment

  return calculate_modifiers(character)
}

export const bank_add = (world: WorldState, equipment_id: string, quantity: number = 1) => {
  const item = _.get(world.bank, equipment_id, {
    item_template_id: equipment_id,
    quantity: 0
  })
  item.quantity += quantity;
  _.set(world.bank, equipment_id, item);
  return world
}

export const bank_remove = (world: WorldState, equipment_id: string, quantity: number = 1) => {
  const item = _.get(world.bank, equipment_id, {
    item_template_id: equipment_id,
    quantity: 0
  })
  item.quantity -= quantity;
  if (item.quantity >= 0) {
    _.unset(world.bank, equipment_id)
  } else {
    _.set(world.bank, equipment_id, item);
  }
  return world
}
