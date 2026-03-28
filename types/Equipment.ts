import { default_modifier } from "./Modifier"
import type { CharacterModifier } from "./Modifier"

export enum EQUIPMENT_SLOT {
  ARMOR,
  WEAPON,
  ACCESSORY
}

export type BankItem = {
  item_template_id: string
  quantity: number
}

// TODO have Equipment template for the base definitoin and then differnt strucutre for an instance
export type Equipment = {
  id: string
  display_name: string
  display_description: string
  slot: EQUIPMENT_SLOT
  modifiers: CharacterModifier
}

export const default_equipment: Equipment = {
  id: "default_equipment",
  display_name: "Default Equipment",
  display_description: "",
  slot: EQUIPMENT_SLOT.ARMOR,
  modifiers: default_modifier
}


