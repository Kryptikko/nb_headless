import _, { add } from "lodash";
import {
  create_world,
  create_entity,
  add_component,
  query,
  get_component,
  render_system,
  remove_component,
  destroy_entity,
  roll_critical,
} from "./ecs";
import type {
  Abilities,
  Position,
  Attributes,
  Aura_PeriodicDamage,
  Casting,
  Cooldown,
  PendingDamage,
  TagTargetable,
  Target,
  TargetStrategy
} from "./ecs"
import { StringDecoder } from "string_decoder";
import type { Entity, World } from "./ecs";
import { render, render_debug } from "./render";


const system_log: string[] = []
const game_log: string[] = []

let world = create_world()
let init: Entity;
let player: Entity;
let enemy: Entity;

// example
const mod_damagetaken = {
  type: "ApplyAura:Mod%DamageTaken",
  // school
  value: 2
}
// Apply Area Aura: Damage shield
const mod_cast_time = {
  type: "ApplyAura:ModCastTime",
  // school
  value: -0.1,
  affected_spell: ["id"]
}
const modifier_resistance = {
  type: "ApplyAura::ModifierResistance",
  value: -10,
  school: ["Fire"],
  duration: 10,
}
const modmeleeattack = {
  type: "ApplyAura:ModMeleeAttack",
  value: 2
}

const moddamagedone = {
  type: "ApplyAura:ModDamageDone",
  school: ["Physical"],
  value: 2 //flat amount
}
const trigger_spell = {
  type: "ApplyAura:TriggerSpell",
  chance: 0.1,
  spell: 'id'
}

type DamageEffect = {
  type: "DamageEffect"
  school: string // todo: enum
  value: number
  mod: number
  can_crit: boolean // take crit chance from player
}
type PeriodicDamageEffect = {
  type: "ApplyAura::PeriodicDamage"
  school: string
  value: number
  duration: number
  mod: number
  tick_rate: number
  can_crit: boolean
}
type StunEffect = {
  type: "ApplyAura::Stun"
  value: number
  chance: number
}
type AbilityEffect = DamageEffect | PeriodicDamageEffect | StunEffect
enum TARGETTING {
  ENEMY_SINGLE,
  ENEMY_ALL,
  FRIEND_SINGLE,
  FRIEND_ALL,
}
type AbilityDefinition = {
  id: string
  display_name: string
  display_description: string
  cooldown: number
  cast_time: number
  vfx: string
  targetting: TARGETTING // todo: enum
  // trigger // on hit, on being hit, Passive, Active
  // flags: string[]
  effect_on_hit: AbilityEffect[]
}

const FireBallMagicDamageEffect: DamageEffect = {
  type: "DamageEffect",
  school: "Fire",
  value: 10,
  mod: 0.123,
  can_crit: true, // flag?
}

const FireballDef: AbilityDefinition = {
  id: "fireball",
  display_name: "Fireball",
  display_description: "Big Balls of Fire",
  targetting: TARGETTING.ENEMY_SINGLE,
  // trigger: "Trigger::Cast", // or tag? Trigger:Passive, Trigger:OnAttack
  cooldown: 1,
  cast_time: 1,
  vfx: "🔥",
  // on_cast_effect: [{
  //   type: "ApplyAura::ModifierDamageDone%",
  //   value: 0.2,
  //   school: ["Fire"],
  //   duration: 10,
  // }, {
  //   type: "ApplyAura::ModifierResistance",
  //   value: -10,
  //   school: ["Fire"],
  //   duration: 10,
  // }],
  effect_on_hit: [
    FireBallMagicDamageEffect,
    {
      type: "ApplyAura::PeriodicDamage",
      school: "Fire",
      value: 2,
      mod: 0.01,
      tick_rate: 2,
      can_crit: false
    } as PeriodicDamageEffect, {
      type: "ApplyAura::Stun",
      value: 2,
      chance: 0.1
    } as StunEffect]
}

const get_spell_by_id = (id: string): AbilityDefinition => {
  // assert missing ids
  return FireballDef
}

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

export const init_entity = (world: World): [World, Entity] => {
  let entity: Entity;
  [world, entity] = create_entity(world);
  world = add_component(world, entity, {
    type: "TagInitialize"
  })
  return [world, entity]
}

[world, init] = init_entity(world);
[world, player] = character_to_entity(world, "player");
[world, player] = character_to_entity(world, "player");
[world, enemy] = character_to_entity(world, "enemy");
[world, enemy] = character_to_entity(world, "enemy");


const init_system = (world: World, delta: number): World => {
  let new_world = { ...world }
  const entities = query(world, ["TagInitialize"]);
  const abilities = query(world, ["Abilities"]);
  for (const entity of entities) {
    // initialize
    // init abilities
    // apply modifiers to stats
    new_world = destroy_entity(new_world, entity)
  }

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

export const damage_system = (world: World, delta: number): World => {
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

    if (health_now === 0) {
      // stop current targets casts
      // just remove the entity or just remove the TagTargetable component?
      //TODO: stop incoming casts towards that target
      // and retarget and recast the pending without triggering cooldown
      new_world = add_component(new_world, pd.target, { type: "TagDead" })
      new_world = remove_component(new_world, pd.target, "TagAlive");
      game_log.push(`Character [${pd.source}] has died.`)
    }

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
      const ability_def = get_spell_by_id(ability_name)
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
      const spell_def = get_spell_by_id(spell_cast.spell_id)
      new_world = spell_def.effect_on_hit.reduce(handle_spell_effect(spell_cast), world)

      // use a "state machine like change for this crap"
      new_world = remove_component(new_world, ent, "Casting");
      const fireball_def = get_spell_by_id(spell_cast.spell_id)
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

  //TODO: handle winning and stopping the sim
  if (!teams.enemy) {
    console.log("\n Player Wins!");
    process.exit(0)
  }
  if (!teams.player) {
    console.log("\n Enemy Wins!");
    process.exit(0)
  }
  return new_world
}

let last_frame = Date.now()
let next_frame = Date.now()
const RENDER_RATE = 1000 / 25
const loop = () => {
  const delta = Date.now() - last_frame
  // world = targeting_system(world, delta);
  world = init_system(world, delta)
  world = ability_system(world, delta);
  world = casting_system(world, delta)
  world = cooldown_system(world, delta)
  world = periodic_system(world, delta)
  world = damage_system(world, delta)
  world = gameflow_system(world, delta)
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


