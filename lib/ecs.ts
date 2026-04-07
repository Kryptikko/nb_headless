import { render, render_buffer_flush, render_debug } from "./render";

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


export const get_component = <T extends Component>(world: World, entity: Entity, type: string): T | undefined => {
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

// interface TagDirtyAttributes extends Component {
//   type: "TagDirtyAttributes"
// }
export interface Attributes extends Component {
  type: "Attributes";
  health_now: number;
  health_max: number;
  str: number;
  int: number;
  dex: number;
}

export interface Abilities extends Component {
  type: "Abilities"
  abilities: Entity[]
}

export interface Ability extends Component {
  type: "Ability"
  display_name: string
  on_cast_effects: Entity[]
  on_land_effects: Entity[]
}

export interface CastTime extends Component {
  type: "Casttime";
  cooldown: number;
  last_used: number;
}

export interface Source extends Component {
  type: "Source"
  entity_id: Entity
}

export interface TagEnemy extends Component {
  type: "TagEnemy"
}

export interface TagPlayer extends Component {
  type: "TagPlayer"
}

export interface TriggerStrategy extends Component {
  type: "TriggerStrategy";
  behaviour: "ALL" | "SINGLE" | "FRONT" | "BACK";
  number: number;
}

export interface TargetStrategy extends Component {
  type: "TargetStrategy";
  behaviour: "ALL" | "SINGLE" | "FRONT" | "BACK";
  number: number;
}

export interface Target extends Component {
  type: "Target"
  entities: Entity[]
}

export interface Duration extends Component {
  type: "Duration"
  duration: number,
  duration_now: number,
}

export interface DamageEffect extends Component {
  type: "DamageEffect"
  min: number
  max: number
}

export interface Critical extends Component {
  type: "Critical"
  chance: number
  power: number
}

export interface Attributes extends Component {
  type: "Attributes";
  health_now: number;
  health_max: number;
  str: number;
  int: number;
  dex: number;
}

export interface Equipment extends Component {
  type: "Equipment";
  display_name: string;
  display_description: string;
  modifier: Entity
  // slot: 
}

export interface Modifier extends Component {
  type: "Modifier";
  modifier_type: "ADDATIVE" | "MULTIPLICATIVE"
  attribute: string;
  value: number;
}

// export interface Stats extends Component {
//   type: "Stats";
//   health_now: number;
//   health_max: number;
// }

interface Position extends Component {
  type: "Position";
  x: number;
  y: number;
}

interface Velocity extends Component {
  type: "Velocity"
  vx: number;
  vy: number;
}

interface Renderable extends Component {
  type: "Renderable"
  color: string
  size: number
}


// interface DamageEffect extends Component {
//   type: "DamageEffect"
//   min: number
//   max: number
//   critical_chance: number
// }

interface DamageOverTime extends Component {
  type: "DamageOverTime"
  damage_per_tick: number
  tick_rate: number
  remaining_duration: number
  last_tick_time: number
}


const roll_critical = (chance: number): boolean => {
  return Math.random() < chance;
}
const roll_damage = (min: number, max: number): number => {
  // ??
  return Math.floor(Math.random() * (min - max + 1)) + min;
}

export const cast_ability_system = (
  world: World,
  caster: Entity,
  target: Entity,
  ability_name: string,
  current_time: number
): World => {
  const abilities = query(world, ["Ability"]);
  let ability_entity: Entity | null = null
  for (const e in abilities) {
    const element = get_component<Ability>(world, e, "Ability")!;
  }
  return world
}

export const movement_system = (world: World, delta: number): World => {
  const entities = query(world, ["Position", "Velocity"]);
  let new_world = { ...world }
  for (const entity of entities) {
    // wtf is this ! syntax?
    const pos = get_component<Position>(world, entity, "Position")!;
    const vel = get_component<Velocity>(world, entity, "Velocity")!;
    const new_position: Position = {
      type: "Position",
      x: pos.x + vel.vx * delta,
      y: pos.y + vel.vy * delta
    }
    new_world = add_component(new_world, entity, new_position)
  }
  return new_world;
}

export const render_system = (world: World): void => {
  const entities = query(world, ["Position", "Renderable"]);
  for (const entity of entities) {
    const pos = get_component<Position>(world, entity, "Position")!;
    const renderable = get_component<Renderable>(world, entity, "Renderable")!;
    render(
      `Entity ${entity}: pos=(${pos.x.toFixed(1)}, ${pos.y.toFixed(1)}), ` +
      `color=${renderable.color}, size=${renderable.size}`
    )
  }
  process.stdout.write('\x1b[2J\x1b[H'); // ANSI clear + home
  render_buffer_flush()
}
