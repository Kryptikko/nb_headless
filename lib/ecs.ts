import _ from "lodash";
import assert from "node:assert";
import get_ability from "../data/abilities";
import { TARGETTING, type AbilityDefinition, type AbilityEffect, type DamageEffect, type PeriodicDamageEffect } from "../types/Ability";
import logger from "./logging";
import { render, render_debug } from "./render";

export const game_log: string[] = []
export const damage_log: PendingDamage[] = []

// TODO: Migrate once setteled on a solid set
// enum C {
//   Abilities = "Abilities",
//   Position = "Position",
//   Casting = "Casting",
//   TagAlive = "TagAlive",
//   TagDead = "TagDead",
//   TagTargetable = "TagTargetable",
//   Aura_PeriodicDamage = "Aura_PeriodicDamage"
// }

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

export interface Position extends Component {
  type: "Position"
  index: number
  // board side
  team: "player" | "enemy"
}
// export interface Auras extends Component {
//   type: "Auras"
//   auras: Entity[]
// }

export interface Command_StatusChange extends Component {
  type: "Command_StatusChange"
  value: WORLD_STATE
}

export interface NotCasting extends Component {
  type: "NotCasting";
}

export enum WORLD_STATE {
  INIT,
  RUN,
  PAUSE,
  END
}

export interface S_WorldState extends Component {
  type: "S_SystemState"
  state: WORLD_STATE
  winner: "player" | "enemy" | "ongoing"
}

export interface Aura_PeriodicDamage extends Component {
  type: "Aura_PeriodicDamage";
  remainig: number;
  source: Entity;
  rate: number;
  value: number;
}

export interface Casting extends Component {
  type: "Casting";
  spell_id: string; // spell id
  target: Entity[];
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
  // school: "magic" | "physical"
}

export const roll_critical = (chance: number): boolean => {
  return Math.random() < chance;
}

const roll_damage = (min: number, max: number): number => {
  // ??
  return Math.floor(Math.random() * (min - max + 1)) + min;
}



const init_system = (world: World, delta: number): World => {
  let new_world = { ...world }
  const world_state_entity = query(world, ["S_WorldState"]);
  if (_.isEmpty(world_state_entity)) {
    logger('Starting a combat');
    // init other entities required for the simulation
    let entity: Entity;
    [new_world, entity] = create_entity(new_world);
    new_world = add_component(new_world, entity, {
      type: "S_WorldState",
      state: WORLD_STATE.PAUSE,
      winner: "ongoing"
    })
    return new_world
  }

  const entities = query(world, ["TagTargetable", "TagAlive"]);
  const teams = _(entities)
    .map((ent: Entity) => get_component<TagTargetable>(new_world, ent, 'TagTargetable'))
    .countBy('team')
    .value()

  if (teams.enemy && teams.player)
    return new_world

  world_state_entity.forEach((entity: number) => {
    const world_state = get_component<S_WorldState>(new_world, entity, 'S_WorldState')
    logger('Ending combat winner - ' + teams.player ? "player" : "enemy");
    new_world = add_component(new_world, entity, {
      ...world_state,
      state: WORLD_STATE.END,
      winner: teams.player ? "player" : "enemy"
    })
  })

  return new_world
}

export const cooldown_system = (world: World, delta: number): World => {
  const casters = query(world, ["Cooldown"]);
  let new_world = { ...world };

  for (const caster of casters) {
    const cast = get_component<Cooldown>(world, caster, "Cooldown");
    const cooldown_now = Math.max(0, cast.cooldown_now - delta);
    if (cooldown_now > 0) {
      new_world = add_component(new_world, caster, {
        ...cast,
        cooldown_now: cooldown_now
      });
    } else {
      new_world = remove_component(new_world, caster, "Cooldown")
      new_world = add_component(new_world, caster, { type: "NotCasting" })
    }
  }
  return new_world;
}

export const damage_system = (world: World, _delta: number): World => {
  const pending = query(world, ["PendingDamage"]);
  let new_world = { ...world };

  for (const entity of pending) {
    const pd = get_component<PendingDamage>(new_world, entity, "PendingDamage");
    // check if targetable?
    const attrs = get_component<Attributes>(new_world, pd.target, "Attributes");
    const health_now = Math.max(0, attrs.health_now - pd.damage);
    new_world = add_component(new_world, pd.target, {
      ...attrs,
      //TODO: apply defenses
      health_now
    } as Attributes);

    let log = `Character [${pd.source}] does ${pd.damage} damage to Character [${pd.target}]${pd.is_crit ? " critical!" : ""}`
    game_log.push(log)
    logger(log);

    if (health_now === 0) {
      // stop current targets casts
      // just remove the entity or just remove the TagTargetable component?
      //TODO: stop incoming casts towards that target
      // and retarget and recast the pending without triggering cooldown
      new_world = add_component(new_world, pd.target, { type: "TagDead" })
      new_world = remove_component(new_world, pd.target, "TagAlive");
      game_log.push(`Character [${pd.source}] has died.`)
    }

    damage_log.push({ ...pd })
    //TODO:  detect death      
    new_world = remove_component(new_world, entity, "PendingDamage");
  }
  return new_world;
}

type PositionTuple = [number, Position]
const get_target = (world: World, ability: AbilityDefinition, caster_team: "player" | "enemy"): Entity[] => {
  let output: Entity[] = []
  const target_positions: PositionTuple[] = _.map(query(world, ["TagTargetable", "TagAlive"]), (e: number): PositionTuple => [e, get_component<Position>(world, e, 'Position')]);
  const teams = _.groupBy(target_positions, (tuple) => tuple[1].team)
  const enemy = caster_team == "player" ? "enemy" : "player"
  switch (ability.targetting) {
    case TARGETTING.ENEMY_SINGLE:
      // @ts-ignore
      const target: PositionTuple = _.first(teams[enemy]);
      output.push(target[0])
      break;
    case TARGETTING.FRIEND_ALL:
      //@ts-ignore
      output = teams[enemy];
      break;

    default:
      break;
  }
  return output
}

const ability_system = (world: World, delta: number): World => {
  let new_world = { ...world }
  const entities = query(world, ["Abilities", "NotCasting", "TagAlive"]);
  // targeting should be a different  system?
  for (const entity of entities) {
    const abilities = get_component<Abilities>(world, entity, "Abilities");
    const caster = get_component<TagTargetable>(world, entity, "TagTargetable");
    const ability_name = _.first(abilities.abilities);
    if (ability_name) {
      const ability_def = get_ability(ability_name)
      new_world = add_component(new_world, entity, {
        type: "Casting",
        spell_id: ability_def.id,
        target: get_target(world, ability_def, caster.team),
        source: entity,
        cast_max: ability_def.cast_time * 1000,
        cast_now: ability_def.cast_time * 1000,
      })
      new_world = remove_component(new_world, entity, "NotCasting")
    }
  }
  return new_world;
}

const handle_spell_effect = (spell_cast: Casting) =>
  (world: World, spell_effect: AbilityEffect) => {
    let new_world = { ...world }
    switch (spell_effect.type) {
      case "DamageEffect":
        spell_effect = spell_effect as DamageEffect
        let damage_instance: Entity
        let is_crit: boolean = false;
        // probably move into the system that handles the effect
        if (spell_effect.can_crit) {
          const attributes = get_component<Attributes>(world, spell_cast.source, "Attributes")
          is_crit = roll_critical(attributes.crit_chance)
        }
        new_world = spell_cast.target.reduce((world: World, target: Entity) => {
          [world, damage_instance] = create_entity(world);
          return add_component(world, damage_instance, {
            type: "PendingDamage",
            damage: is_crit ? spell_effect.value * 2 : spell_effect.value,
            target: target,
            source: spell_cast.source,
            // school
            is_crit
          })
        }, new_world)
        break;
      case "ApplyAura::PeriodicDamage":
        spell_effect = spell_effect as PeriodicDamageEffect
        // let damage_instance: Entity
        // [new_world, damage_instance] = create_entity(new_world);
        // new_world = add_component(new_world, spell_cast.target, {
        //   type: "Aura_PeriodicDamage",
        //   damage_per_tick: spell_effect.value,
        //   tick_rate: 1000,
        //   remaining_duration: 4000,
        //   last_tick_time: 0
        // })
        break;
      // let damage_instance: Entity
      // let is_crit: boolean = false;
      //
      default:
        break;
    }
    return new_world
  }


const periodic_system = (world: World, delta: number): World => {
  let new_world = { ...world }
  const entities = query(world, ["Aura_PeriodicDamage"]);
  for (const entity of entities) {
    const periodic_damage = get_component<Aura_PeriodicDamage>(world, entity, "Aura_PeriodicDamage");
    const remaining = Math.min(0, periodic_damage.remainig - delta)
    new_world = add_component(new_world, entity, {
      ...periodic_damage,
      remaining
    })
    // todo handle tick rate
    if (delta > 1000) {
      let damage_instance: Entity
      [world, damage_instance] = create_entity(world);
      new_world = add_component(new_world, damage_instance, {
        type: "PendingDamage",
        damage: periodic_damage.value,
        target: entity,
        source: periodic_damage.source,
        // school
      })
    }
    // todo tick
    if (remaining === 0) {
      new_world = remove_component(new_world, entity, "Aura_PeriodicDamage")
    }
  }
  return new_world
}
const casting_system = (world: World, delta: number): World => {
  let new_world = { ...world }
  const entities = query(world, ["Casting"]);
  _.forEach(entities, (ent: Entity) => {
    const spell_cast = get_component<Casting>(world, ent, "Casting")!;
    const cast_now = Math.max(0, spell_cast.cast_now - delta)
    if (cast_now === 0) {
      const spell_def = get_ability(spell_cast.spell_id)
      new_world = spell_def.effect_on_hit.reduce(handle_spell_effect(spell_cast), world)

      // use a "state machine like change for this crap"
      new_world = remove_component(new_world, ent, "Casting");
      const fireball_def = get_ability(spell_cast.spell_id)
      new_world = add_component(new_world, ent, {
        type: "Cooldown",
        abilty_id: spell_cast.spell_id,
        cooldown_max: fireball_def.cooldown * 1000,
        cooldown_now: fireball_def.cooldown * 1000
      });
    } else {
      new_world = add_component(new_world, ent, {
        ...spell_cast,
        cast_now: cast_now,
      })
    }
  })
  return new_world
}

const gameflow_system = (world: World, delta: number): World => {
  let new_world = { ...world }
  // alive tag
  const entities = query(world, ["TagTargetable", "TagAlive"]);
  const teams = _(entities)
    .map((ent: Entity) => get_component<TagTargetable>(new_world, ent, 'TagTargetable'))
    .countBy('team')
    .value()

  if (teams.enemy && teams.player)
    return new_world

  const state_ent = query(world, ["S_WorldState"]);
  assert(_.isEmpty(state_ent), 'The Combat Simulation was not properly initialized')
  state_ent.forEach((entity: number) => {
    const world_state = get_component<S_WorldState>(new_world, entity, 'S_WorldState')
    new_world = add_component(new_world, entity, {
      ...world_state,
      state: WORLD_STATE.END,
      winner: teams.player ? "player" : "enemy"
    })
  })
  return new_world
}

export const pause_system = (world: World, delta: number): World => {
  let new_world = { ...world }
  const entities = query(world, ['Command_StatusChange']);
  const state_entities = query(world, ['S_WorldState']);
  for (const entity of entities) {
    const input = get_component<Command_StatusChange>(world, entity, 'Command_StatusChange');
    new_world = remove_component(new_world, entity, 'Command_StatusChange')

    const state_ent = _.head(state_entities);
    if (!state_ent) return new_world
    const state = get_component<S_WorldState>(new_world, state_ent, 'S_WorldState');
    new_world = add_component(new_world, state_ent, {
      ...state,
      // TODO: Handle the other world states
      state: input.value
    })

  }
  return new_world
}

export const combat_simulation_system = (world: World, delta: number): World => {
  const entities = query(world, ['S_WorldState']);
  const entity = _.head(entities);
  if (!entity) return world;
  const state = get_component<S_WorldState>(world, entity, 'S_WorldState');

  if (state.state === WORLD_STATE.RUN) {
    world = ability_system(world, delta);
    world = casting_system(world, delta)
    world = cooldown_system(world, delta)
    world = periodic_system(world, delta)
    world = damage_system(world, delta)
  }

  return world
}

export const combat_system = (world: World, delta: number): World => {
  world = init_system(world, delta)
  // world = targeting_system(world, delta);
  world = pause_system(world, delta)
  world = combat_simulation_system(world, delta)
  // world = gameflow_system(world, delta)
  return world
}
