import _ from "lodash";
import {
  create_world,
  create_entity,
  add_component,
  query,
  get_component,
  render_system,
  remove_component,
  destroy_entity,
  TagPlayer,
} from "./ecs";
import type {
  Abilities,
  Ability,
  Target,
  TargetStrategy
} from "./ecs"
import { StringDecoder } from "string_decoder";
import type { Entity, World } from "./ecs";
import type { Character } from "../types/Character";
import { embeddedFiles } from "bun";



let world = create_world()
let player: Entity;
let enemy: Entity;


export const fireball_to_entity = (world: World): [World, Entity] => {
  let entity: Entity;
  [world, entity] = create_entity(world);
  world = add_component(world, entity, {
    type: "Effects",
    min: 10,
    max: 20
  })
  world = add_component(world, entity, {
    type: "Critical",
    chance: 0.10,
    power: 1.5
  })
  world = add_component(world, entity, {
    type: "Casttime",
    cooldown_max: 2,
    cooldown_now: 0
  })
  world = add_component(world, entity, {
    type: "TargetStrategy",
    behaviour: "SINGLE",
    number: 1
  })
  return [world, entity]
}

export const character_to_entity = (world: World): [World, Entity] => {
  let entity: Entity;
  let fireball: Entity;
  [world, entity] = create_entity(world);
  [world, fireball] = fireball_to_entity(world);
  world = add_component(world, entity, {
    type: "Attributes",
    health_now: 100,
    health_max: 100,
    str: 1,
    int: 1,
    dex: 1,
  })
  world = add_component(world, entity, {
    type: "Abilities",
    abilities: ['fireball']
  })

  return [world, entity]
}
[world, player] = character_to_entity(world);
[world, enemy] = character_to_entity(world);


const init_system = (world: World, delta: number): World => {
  const entities = query(world, ["TagInitialize"]);
  for (const entity of entities) {
    // initialize
    // init abilities
    // apply modifiers to stats
    destroy_entity(world, entity)
  }
  return world
}
// impulse components vs command components

const targeting_system = (world: World, delta: number): World => {
  let new_world = { ...world }
  const entities = query(world, ["TargetStrategy"]);
  for (const entity of entities) {
    const is_player = get_component<TagPlayer>(world, entity, "TagPlayer");
    // let targets = []
    // if (is_player) 

    // const strategy = get_component<TargetStrategy>(world, entity, "TargetStrategy")!;
    const targets = get_component<Target>(world, entity, "Target")!;
    if (_.isEmpty(targets)) {
      // set entities based on strategy
      new_world = add_component(new_world, entity, {
        type: "Target",
        entities: []
      })
    }
  }
  return new_world
}

const abilty_factory = (world: World, ability_name: string): [World, Entity] => {
  let ability: Entity
  [world, ability] = fireball_to_entity(world)
  return [world, ability]
}

const ability_system = (world: World, delta: number): World => {
  const entities = query(world, ["Abilities"]);
  let new_world = { ...world }
  for (const entity of entities) {
    const abilities = get_component<Abilities>(world, entity, "Abilities")!;
    new_world = add_component(new_world, entity, new_position)
  }
  return new_world;
}

let last_frame = Date.now()
let next_frame = Date.now()
const RENDER_RATE = 1000 / 25
const loop = () => {
  const _delta = Date.now() - last_frame
  world = targeting_system(world, _delta);
  // world = targeting_system(world, _delta);
  world = ability_system(world, _delta);
  render_system(world);
  next_frame = next_frame + RENDER_RATE
  last_frame = Date.now()
  setTimeout(loop, Math.max(0, next_frame - last_frame))
}
loop()

// introduce input
process.stdin.setRawMode(true)
const _decoder = new StringDecoder('utf8');
process.stdin.on('data', (data) => {
  var key = _decoder.write(data)
  if (key == "q") {
    // console.clear()
    console.log("\nBye!");
    process.exit(0)
  }
})


