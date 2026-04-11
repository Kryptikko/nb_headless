import type { Character } from "../types/Character";
import { add_component, create_entity, get_component, query, WORLD_STATE, type Entity, type World } from "./ecs";

export const character_to_entity = (world: World, character: Character, team: "player" | "enemy"): [World, Entity] => {
  let entity: Entity;
  [world, entity] = create_entity(world);
  world = add_component(world, entity, {
    type: "Attributes",
    health_now: character.hp_max,
    health_max: character.hp_max,
    str: 1,
    int: 1,
    dex: 1,
    crit_chance: 0.1
  })
  world = add_component(world, entity, {
    type: "Abilities",
    abilities: [character.ability_primary]
  })
  world = add_component(world, entity, {
    type: "TagTargetable",
    team
  })
  world = add_component(world, entity, {
    type: "Position",
    team,
    index: 0
  })

  // state/aka tags
  world = add_component(world, entity, {
    type: "NotCasting",
  })
  world = add_component(world, entity, {
    type: "TagAlive",
  })

  return [world, entity]
}
