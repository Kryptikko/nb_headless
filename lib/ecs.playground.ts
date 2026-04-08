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
  Ability,
  Attributes,
  Aura_PeriodicDamage,
  Casting,
  Component,
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

type AbilityDefinition = {
  id: string
  display_name: string
  display_description: string
  cooldown: number
  cast_time: number
  vfx: string
  targetting: string // todo: enum
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
  targetting: "Enemy::Single",
  // trigger: "Trigger::Cast", // or tag? Trigger:Passive, Trigger:OnAttack
  cooldown: 6,
  cast_time: 3,
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

export const character_to_entity = (world: World): [World, Entity] => {
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
  })
  // state
  world = add_component(world, entity, {
    type: "NotCasting",
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
[world, player] = character_to_entity(world);
[world, enemy] = character_to_entity(world);


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

// impulse components vs command components

// const targeting_system = (world: World, _delta: number): World => {
//   let new_world = { ...world }
//   const entities = query(world, ["TargetStrategy"]);
//   const targets = query(world, ["TagTargetable"]);
//   for (const entity of entities) {
//     const strategy = get_component<TargetStrategy>(world, entity, "TargetStrategy")!;
//     let available_targets = _.filter(targets, (ent: Entity) => {
//       return get_component<TagTargetable>(world, ent, 'TagTargetable')!.team == strategy.team
//     })
//     if (!_.isEmpty(available_targets)) {
//       // set entities based on strategy
//       new_world = add_component(new_world, entity, {
//         type: "Target",
//         entities: _.take(available_targets, strategy.number)
//       })
//     }
//   }
//   return new_world
// }


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
    new_world = add_component(new_world, pd.target, {
      ...attrs,
      //TODO: apply defenses
      health_now: Math.max(0, attrs.health_now - pd.damage),
    } as Attributes);

    let log = `Character [${pd.source}] does ${pd.damage} damage to ${pd.target}${pd.is_crit ? " critical!" : ""}`
    game_log.push(log)

    //TODO:  detect death      
    new_world = remove_component(new_world, entity, "PendingDamage");
  }
  return new_world;
}

const ability_system = (world: World, delta: number): World => {
  let new_world = { ...world }
  const entities = query(world, ["Abilities", "NotCasting"]);
  for (const entity of entities) {
    const abilities = get_component<Abilities>(world, entity, "Abilities");
    const ability_name = _.first(abilities.abilities);
    if (ability_name) {
      const fireball_def = get_spell_by_id(ability_name)
      new_world = add_component(new_world, entity, {
        type: "Casting",
        spell_id: fireball_def.id,
        target: 1,
        source: 1,
        cast_max: fireball_def.cast_time * 1000,
        cast_now: fireball_def.cast_time * 1000,
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
        // TODO: create a damage effect for each spell target
        spell_effect = spell_effect as DamageEffect
        let damage_instance: Entity
        let is_crit: boolean = false;
        // probably move into the system that handles the effect
        [new_world, damage_instance] = create_entity(new_world);
        if (spell_effect.can_crit) {
          const attributes = get_component<Attributes>(world, spell_cast.source, "Attributes")
          is_crit = roll_critical(attributes.crit_chance)
        }
        new_world = add_component(new_world, damage_instance, {
          type: "PendingDamage",
          damage: is_crit ? spell_effect.value * 2 : spell_effect.value,
          target: spell_cast.target,
          source: spell_cast.source,
          // school
          is_crit
        })
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

const death_system = (world: World, delta: number): World => {
  let new_world = { ...world }
  // alive tag
  const entities = query(world, ["TagTargetable"]);
  for (const entity of entities) {
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
  world = damage_system(world, delta)
  // world = death_system(world, delta)
  // render_debug(world.entities)
  render_system(world);
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


