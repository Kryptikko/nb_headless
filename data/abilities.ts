import assert from "node:assert";
import type { AbilityDefinition } from "../types/Ability";
import { TARGETTING } from "../types/Ability";

const MeleeDef: AbilityDefinition = {
  id: "melee",
  display_name: "Melee Hit",
  display_description: "",
  targetting: TARGETTING.ENEMY_SINGLE,
  // trigger: "Trigger::Cast", // or tag? Trigger:Passive, Trigger:OnAttack
  cooldown: 1,
  cast_time: 0,
  vfx: "✊",
  effect_on_hit: [
    {
      type: "DamageEffect",
      school: "Physical",
      value: 4,
      mod: 0.123,
      can_crit: true, // use flags instead?
    }]
}

const CleaveDef: AbilityDefinition = {
  id: "cleave",
  display_name: "Cleave Hit",
  display_description: "",
  targetting: TARGETTING.ENEMY_SINGLE,
  // trigger: "Trigger::Cast", // or tag? Trigger:Passive, Trigger:OnAttack
  cooldown: 2,
  cast_time: 0.5,
  vfx: "✊",
  effect_on_hit: [
    {
      type: "DamageEffect",
      school: "Physical",
      value: 10,
      mod: 0.123,
      can_crit: true, // use flags instead?
    }]
}

const FireballDef: AbilityDefinition = {
  id: "fireball",
  display_name: "Fireball",
  display_description: "Big Balls of Fire",
  targetting: TARGETTING.ENEMY_SINGLE,
  // trigger: "Trigger::Cast", // or tag? Trigger:Passive, Trigger:OnAttack
  cooldown: 1,
  cast_time: 2,
  vfx: "🔥",
  effect_on_hit: [
    {
      type: "DamageEffect",
      school: "Fire",
      value: 10,
      mod: 0.123,
      can_crit: true, // use flags instead?
    },
    {
      type: "ApplyAura::PeriodicDamage",
      school: "Fire",
      value: 2,
      mod: 0.01,
      tick_rate: 2,
      can_crit: false
    }, {
      type: "ApplyAura::Stun",
      value: 2,
      chance: 0.1
    }]
}

const repo: Record<string, AbilityDefinition> = Object.freeze({
  'fireball': FireballDef,
  'melee': MeleeDef,
  'cleave': CleaveDef,
})
const get_ability = (id: string): AbilityDefinition => {
  assert(repo[id], 'Ability Definition for id: ' + id + ' does not exist')
  return repo[id]
}
export default get_ability
