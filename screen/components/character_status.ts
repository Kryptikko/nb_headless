import _ from "lodash"
import type { Character } from "../../types/Character"
import health_bar, { entity_health_bar } from "./health_bar"
import { get_component, type Attributes, type Entity, type World } from "../../lib/ecs"

export default (ch: Character) => {
  return _.padEnd(ch.display_name, 20, " ")
    + `HP ${health_bar(ch)}`
    + _.padEnd(` ${ch.hp_now}/${ch.hp_max}`, 10, " ")
}

export const entity_status = (world: World, entity: Entity, character: Character) => {
  const attr = get_component<Attributes>(world, entity, "Attributes")
  return _.padEnd(_.toString(entity), 2, " ")
    + _.padEnd(character.display_name, 20, " ")
    + `HP ${entity_health_bar(attr.health_now, attr.health_max)}`
    + _.padEnd(` ${attr.health_now}/${attr.health_max}`, 10, " ")
}
