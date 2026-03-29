import _ from "lodash"
import { styleText } from "node:util";
import type { Character } from "../types/Character"
import { _empty_screen_fn, SCREEN_IDS, type Screen, type WorldState } from "../types/WorldState"
import character_status from "./components/character_status.ts";
import { dungeon_floor_1 } from "../data/encounters.ts";
import { ability_cast_bar } from "./components/cast_bar.ts";
import status_bar from "./components/status_bar.ts";
import { ABILITY, TARGET_TYPE, type CombatAbilityContext, type CombatEffect } from "../types/Ability.ts";
import get_ability from "../data/abilities.ts";
import ability_handler_repo from "../combat_effect/index.ts";
import { render, render_debug } from "../lib/render.ts";
import { bank_add } from "../controller/equipment.ts";
import { open_screen } from "../controller/screen.ts";

enum COMBAT_RESULT {
  ONGOING,
  ATTACKER_WIN,
  DEFENDER_WIN,
}

type CombatState = {
  last_turn_at: number
  turn: number
  log: Array<string>
  stats: Array<Object>
  actors: Record<string, Character>
  attacker: Array<string>
  defender: Array<string>
  winner: COMBAT_RESULT
}

let _local_state: CombatState = {
  last_turn_at: 1000,
  turn: 0,
  log: [],
  stats: [],
  actors: {},
  attacker: [],
  defender: [],
  winner: COMBAT_RESULT.ONGOING
}

const _init = (state: WorldState) => {
  _local_state.actors = _.reduce(state.party,
    (aggr, id: string) => {
      aggr[id] = _.get(state.roster, id)
      return aggr
    }, _local_state.actors)
  _local_state.attacker = _.sortBy(state.party, id => _.get(_local_state.actors, id).ini).reverse()
  _.reduce(dungeon_floor_1.enemies, (aggr, enemy) => {
    _local_state.defender.push(enemy.id)
    // TODO clone deep
    aggr[enemy.id] = _.cloneDeep(enemy);
    return aggr
  }, _local_state.actors)
  _local_state.defender = _.sortBy(_local_state.defender, id => _.get(_local_state.actors, id).ini).reverse()
}

const _is_combat_over = (): COMBAT_RESULT => {
  if (!_.find(_local_state.attacker, id => _.get(_local_state.actors, id).hp_now > 0))
    return COMBAT_RESULT.DEFENDER_WIN;
  if (!_.find(_local_state.defender, id => _.get(_local_state.actors, id).hp_now > 0))
    return COMBAT_RESULT.ATTACKER_WIN;

  return COMBAT_RESULT.ONGOING
}
const _ability_repository: Record<string, CombatAbilityContext> = {}
const _get_ability_context = (caster: Character, ability_id: ABILITY): CombatAbilityContext => {
  const ability = get_ability(ability_id)
  return Object.assign({}, {
    id: [caster.id, ability_id].join('|'),
    ability_id: ability_id,
    source: caster.id,
    target: "",
    // target: string // target id
    cooldown_now: ability.cooldown
  })
}

const _process_cast = (caster: Character, context: CombatAbilityContext) => {

  const ability = get_ability(context.ability_id)
  let targets: Array<string>
  switch (ability.target_type) {
    case TARGET_TYPE.ENEMY:
      targets = _local_state.attacker.includes(caster.id)
        ? _local_state.defender
        : _local_state.attacker
      break;
    case TARGET_TYPE.FRIEND:
      targets = _local_state.attacker.includes(caster.id)
        ? _local_state.attacker
        : _local_state.defender
      break;
  }

  _(targets)
    .map(id => _.get(_local_state.actors, id))
    // TODO: change to - is valid target (check if alive and can be attacked)
    .filter((ch) => ch.hp_now > 0)
    .take(ability.target_count)
    .forEach((target: Character) => {
      _.forEach(ability.effects, (effect: CombatEffect) => {
        var handler = ability_handler_repo[effect.handler]
        handler.apply(caster, target, effect)
        _local_state.log.push(`${caster.display_name} uses ${ability.display_name} on ${target.display_name}`)
        // the effet fn applies the changes to the targets
        // _local_state.log.push(combat_effect[effect](member, target, member.ability_primary))
      })
    })

}

const _clear = (world: WorldState) => {
  //TODO: set winner or loser
  _local_state = {
    last_turn_at: 1000,
    turn: 0,
    log: [],
    stats: [],
    actors: {},
    attacker: [],
    defender: [],
    winner: COMBAT_RESULT.ONGOING
  }
}

const _process = (wstate: WorldState, lstate: CombatState) => {
  _.values(_local_state.actors)
    .filter((ch) => ch.hp_now > 0)
    .forEach((member: Character) => {
      //TODO: rework ability effects
      // _.forEach(member.active_effect, (effect) => {
      //   var handler = ability_handler_repo[effect.handler]
      //   handler.process(wstate.delta, _.get(lstate.actors, effect.source), member, effect)
      // });
      // start casting if its not
      let current_cast = _.get(_ability_repository, member.id) || _get_ability_context(member, member.ability_primary)
      current_cast.cooldown_now -= wstate.delta
      if (current_cast.cooldown_now <= 0) {
        _process_cast(member, current_cast)
        // start a new cast when this one is done,
        // alternatily just reset the cooldown_now but this way we're setup to have multiple ability choice
        current_cast = _get_ability_context(member, member.ability_primary)
        lstate.winner = _is_combat_over()
      }
      _.set(_ability_repository, member.id, current_cast)
    })
}
// combat screen needs to be a function that returns a render ?
const CombatScreen = (state: WorldState) => {
  // TODO: 
  // fetch encounter
  // handle input 
  // run simulation
  // render

  if (_local_state.winner != COMBAT_RESULT.ONGOING) {
    _local_state.winner == COMBAT_RESULT.ATTACKER_WIN ? render('PARTY') : render('ENEMIES')
    // render('COMBAT OVER WINNER IS')
    open_screen(state, SCREEN_IDS.combat_reward)
  }
  if (_local_state.winner == COMBAT_RESULT.ONGOING)
    _process(state, _local_state)

  // RENDER
  const header = styleText('gray', '[Start Dungeon Group]')
  const sub_header = `=== ${dungeon_floor_1.display_name} ===`
  const body: Array<string> = [];
  let len = Math.max(_local_state.attacker.length, _local_state.defender.length)
  let ch: Character
  for (let index = 0; index < len; index++) {
    let row = ""
    let srow = ""
    ch = _.get(
      _local_state.actors,
      _.get(_local_state.attacker, index, -1)
    )

    if (ch) {
      row += character_status(ch)
      srow += ability_cast_bar(_.get(_ability_repository, ch.id))
      srow += _.padStart(status_bar(ch), 20, ' ')
    }
    row = _.padEnd(row, 46, " ")
    srow = _.padEnd(srow, 46, " ")

    ch = _.get(
      _local_state.actors,
      _.get(_local_state.defender, index, -1)
    )
    if (ch) {
      row += character_status(ch)
      srow += ability_cast_bar(_.get(_ability_repository, ch.id))
      srow += _.padStart(status_bar(ch), 17, ' ')
    }
    body.push(row)
    body.push(srow)
  }
  const dynamic_width = _.maxBy(body, (line) => line.length)?.length || 0

  render(header);
  render(_.pad(sub_header, dynamic_width, ' ') + '\n');
  render(body.join('\n'))
  render(`

[Turn Log] 3/${_local_state.log.length}`);
  _.takeRight(_local_state.log, 3).map(log => render(log))
  return state
}

const screen: Screen = {
  init: _init,
  process: CombatScreen,
  clear: _clear
}
export default screen;
