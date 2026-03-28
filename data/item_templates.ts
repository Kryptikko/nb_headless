import _ from "lodash"
import { default_equipment, EQUIPMENT_SLOT, type Equipment } from "../types/Equipment"
import { MODIFIER_TYPE } from "../types/Modifier"

const basic_armor: Equipment = {
  ...default_equipment,
  slot: EQUIPMENT_SLOT.ARMOR,
  id: "basic_armor",
  display_name: "Basic Armor",
  display_description: "",
  modifiers: {
    type: MODIFIER_TYPE.ADDATIVE,
    hp_max: 10,
    att: 0,
    def: 2,
    mgc: 0,
    ini: 0,
  }
}
const basic_axe: Equipment = {
  ...default_equipment,
  id: "basic_axe",
  slot: EQUIPMENT_SLOT.WEAPON,
  display_name: "Basic Axe",
  display_description: "It goes chop chop.",
  modifiers: {
    type: MODIFIER_TYPE.ADDATIVE,
    hp_max: 0,
    att: 1,
    def: 0,
    mgc: 0,
    ini: 0,
  }
}

const repo: Record<string, Equipment> = Object.freeze({
  'basic_armor': basic_armor,
  'basic_axe': basic_axe,
})
const get_equipment = (id: string): Equipment => _.get(repo, id)
export default get_equipment
