import { render, render_buffer_flush, render_debug } from "./render";
import assert from "node:assert";

export type Entity = number;

export interface Component {
  type: string
}

export type World = {
  next_entity_id: number
  entities: Set<Entity>
  components: Map<string, Map<Entity, Component>>
}

export const create_world = (): World => ({
  next_entity_id: 0,
  entities: new Set(),
  components: new Map(),
})


export const create_entity = (world: World): [World, Entity] => {
  const entity = world.next_entity_id;
  const new_world: World = {
    ...world,
    entities: new Set(world.entities).add(entity),
    next_entity_id: entity + 1
  }
  return [new_world, entity]
}

//TODO: maps might not be ideal do a deep dive
export const destroy_entity = (world: World, entity: Entity): World => {
  // eew
  const new_entities = new Set(world.entities);
  new_entities.delete(entity)
  const new_components = new Map(world.components);
  for (const [type, map] of new_components.entries()) {
    const new_map = new Map(map);
    new_map.delete(entity);
    if (new_map.size === 0) {
      new_components.delete(type)
    } else {
      new_components.set(type, new_map)
    }
  }

  return {
    ...world,
    entities: new_entities,
    components: new_components
  }
}

export const add_component = <T extends Component>(world: World, entity: Entity, component: T): World => {
  if (!world.entities.has(entity)) {
    throw new Error(`Entity ${entity} does not exist.`);
  }
  const type = component.type
  const new_components = new Map(world.components);
  let type_map = new_components.get(type)
  if (!type_map) {
    type_map = new Map();
    new_components.set(type, type_map)
  }
  const new_type_map = new Map(type_map);
  new_type_map.set(entity, component);
  new_components.set(type, new_type_map)

  return { ...world, components: new_components }
}

export const remove_component = <T extends Component>(world: World, entity: Entity, type: string): World => {
  const type_map = world.components.get(type);
  if (!type_map || !type_map.has(entity)) return world;

  const new_type_map = new Map(type_map);
  new_type_map.delete(entity)
  const new_components = new Map(world.components);
  if (new_type_map.size === 0) {
    new_components.delete(type)
  } else {
    new_components.set(type, new_type_map)
  }
  return { ...world, components: new_components }
}


export const get_component = <T extends Component>(world: World, entity: Entity, type: string): T => {
  const component = world.components.get(type)?.get(entity) as T
  assert(component, `Entity ${entity} does not have component of type ${type}.`)
  return component
}

export const try_get_component = <T extends Component>(world: World, entity: Entity, type: string): T | undefined => {
  return world.components.get(type)?.get(entity) as T | undefined
}

export const query = (world: World, component_types: string[]): Entity[] => {
  if (component_types.length === 0) {
    return Array.from(world.entities);
  }
  const first_type = component_types[0];
  // @ts-ignore
  let candidates = Array.from(world.components.get(first_type)?.keys() || []);
  for (let i = 1; i < component_types.length; i++) {
    const type = component_types[i];
    // @ts-ignore
    const type_map = world.components.get(type);
    if (!type_map) return [];
    candidates = candidates.filter((entry) => type_map.has(entry));
  }
  return candidates
}

// split between attributes, stats and identity?
export interface Attributes extends Component {
  type: "Attributes";
  health_now: number;
  health_max: number;
  str: number;
  int: number;
  dex: number;
  crit_chance: number;
}

export interface Abilities extends Component {
  type: "Abilities"
  abilities: string[]
}

// export interface Auras extends Component {
//   type: "Auras"
//   auras: Entity[]
// }

export interface NotCasting extends Component {
  type: "NotCasting";
}

export interface TagInitialize extends Component {
  type: "TagInitialize";
}

export interface Aura_PeriodicDamage extends Component {
  type: "Aura_PeriodicDamage";
}

export interface Casting extends Component {
  type: "Casting";
  spell_id: string; // spell id
  target: Entity;
  source: Entity;
  cast_max: number;
  cast_now: number;
}

export interface Cooldown extends Component {
  type: "Cooldown";
  cooldown_max: number;
  cooldown_now: number;
  ability: string;
}

// export interface Source extends Component {
//   type: "Source"
//   entity_id: Entity
// }

export interface TagTargetable extends Component {
  type: "TagTargetable"
  team: "player" | "enemy"
}

export interface TagAlive extends Component {
  type: "TagAlive"
}

export interface TagDead extends Component {
  type: "TagDead"
}

export interface TargetStrategy extends Component {
  type: "TargetStrategy"
  behaviour: "ALL" | "SINGLE" | "FRONT" | "BACK"
  team: "player" | "enemy"
  number: number
}

export interface Target extends Component {
  type: "Target"
  entities: Entity[]
}

export interface PendingDamage extends Component {
  type: "PendingDamage"
  damage: number
  is_crit: boolean
  target: Entity
  source: Entity
}
// export interface PendingSlowEffect extends Component {
//   type: "PendingSlowEffect"
//   target: Entity
//   source: Entity
//   value: number
// }
// export interface PendingDamageEffect extends Component {
//   type: "PendingDamageEffect"
//   damage: [number, number]
//   mod: number // how much does it benefit from the school
//   target: Entity
//   source: Entity
//   school: "Frost" | "Fire" | "Physical"
// }
// interface DamageOverTime extends Component {
//   type: "DamageOverTime"
//   damage_per_tick: number
//   tick_rate: number
//   remaining_duration: number
//   last_tick_time: number
// }


export const roll_critical = (chance: number): boolean => {
  return Math.random() < chance;
}
const roll_damage = (min: number, max: number): number => {
  // ??
  return Math.floor(Math.random() * (min - max + 1)) + min;
}

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
  world.components.forEach(d => console.table(d))
}
