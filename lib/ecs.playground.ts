import _ from "lodash";
import {
  create_world,
  create_entity,
  add_component,
  query,
  get_component,
  combat_system,
  try_get_component,
  game_log,
} from "./ecs";
import type {
  Attributes,
  Casting,
  Cooldown,
} from "./ecs"
import { StringDecoder } from "string_decoder";
import type { Entity, World } from "./ecs";
import { render, render_debug, render_buffer_flush } from "./render";

let world = create_world()
let player: Entity;
let enemy: Entity;

// example to be implemented
// const mod_damagetaken = {
//   type: "ApplyAura:Mod%DamageTaken",
//   // school
//   value: 2
// }
// // Apply Area Aura: Damage shield
// const mod_cast_time = {
//   type: "ApplyAura:ModCastTime",
//   // school
//   value: -0.1,
//   affected_spell: ["id"]
// }
// const modifier_resistance = {
//   type: "ApplyAura::ModifierResistance",
//   value: -10,
//   school: ["Fire"],
//   duration: 10,
// }
// const modmeleeattack = {
//   type: "ApplyAura:ModMeleeAttack",
//   value: 2
// }
//
// const moddamagedone = {
//   type: "ApplyAura:ModDamageDone",
//   school: ["Physical"],
//   value: 2 //flat amount
// }
// const trigger_spell = {
//   type: "ApplyAura:TriggerSpell",
//   chance: 0.1,
//   spell: 'id'
// }

export const character_to_entity = (world: World, team: "player" | "enemy"): [World, Entity] => {
  let entity: Entity;
  [world, entity] = create_entity(world);
  world = add_component(world, entity, {
    type: "Attributes",
    health_now: 100,
    health_max: 100,
    str: 1,
    int: 1,
    dex: 1,
    crit_chance: 0.1
  })
  world = add_component(world, entity, {
    type: "Abilities",
    abilities: ['fireball']
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

[world, player] = character_to_entity(world, "player");
[world, player] = character_to_entity(world, "player");
[world, enemy] = character_to_entity(world, "enemy");
[world, enemy] = character_to_entity(world, "enemy");


export const render_system = (world: World): void => {
  const entities = query(world, ["Attributes"]);
  for (const entity of entities) {
    const attr = get_component<Attributes>(world, entity, "Attributes");

    const health_pct = attr.health_now / attr.health_max;
    const health_bar = "█".repeat(Math.floor(health_pct * 10)) + "░".repeat(10 - Math.floor(health_pct * 10));
    let row = `${entity}: [${health_bar}] ${attr.health_now}/${attr.health_max} HP `

    const cast = try_get_component<Casting>(world, entity, "Casting");
    if (cast) {
      row += `- [${cast.spell_id}] ${cast.cast_now}`
    }
    const cooldown = try_get_component<Cooldown>(world, entity, "Cooldown");
    if (cooldown) {
      row += ` / ${cooldown.cooldown_now}`
    }

    render(row)
  }
  render_buffer_flush()
  // world.components.forEach(d => console.table(d))
}

let last_frame = Date.now()
let next_frame = Date.now()
const RENDER_RATE = 1000 / 25
const loop = () => {
  const delta = Date.now() - last_frame
  // world = targeting_system(world, delta);
  world = combat_system(world, delta)
  render_system(world);
  // combat log
  render(_.takeRight(game_log, 5).map((str, indx) => indx + ": " + str).join('\n'))
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
