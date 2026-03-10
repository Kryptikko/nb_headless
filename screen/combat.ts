import _ from "lodash"
import { styleText } from "node:util";
import type { Character, COMBAT_EFFECT } from "../types/Character"
import type { WorldState } from "../types/WorldState"
// import damage_indicator from "./components/damage_indicator.ts";
// import cast_bar from "./components/cast_bar.ts";
import character_status from "./components/character_status.ts";
import { dungeon_floor_1 } from "../data/encounters.ts";
import { ability_cast_bar } from "./components/cast_bar.ts";
import combat_effect from "../combat_effect/index.ts";
import { SCHED_RR } from "node:cluster";
import status_bar from "./components/status_bar.ts";

enum COMBAT_RESULT {
  ONGOING,
  ATTACKER_WIN,
  DEFENDER_WIN,
}
type CombatState = {
  last_turn_at: number
  turn: number
  log: Array<string>
  party: Array<Character>
  enemies: Array<Character>
  winner: COMBAT_RESULT
}
let _local_state: CombatState = {
  last_turn_at: 1000,
  turn: 0,
  log: [],
  party: [],
  enemies: [],
  winner: COMBAT_RESULT.ONGOING
}

const _init = (state: WorldState) => {
  _local_state.party = _.chain(state.party)
    .map(id => _.get(state.roster, id))
    .sortBy('ini')
    .reverse()
    .value();
  _local_state.enemies = [...dungeon_floor_1.enemies]
  if (_local_state.winner != COMBAT_RESULT.ONGOING) {
    console.log('COMBAT OVER WINNER IS')
    _local_state.winner == COMBAT_RESULT.ATTACKER_WIN ? console.log('PARTY') : console.log('ENEMIES')
  }
}
const _is_combat_over = (attackers: Array<Character>, defenders: Array<Character>): COMBAT_RESULT => {
  if (!_.find(attackers, att => att.hp_now > 0)) return COMBAT_RESULT.DEFENDER_WIN;
  if (!_.find(defenders, att => att.hp_now > 0)) return COMBAT_RESULT.ATTACKER_WIN;

  return COMBAT_RESULT.ONGOING
}
const _process = (wstate: WorldState, lstate: CombatState) => {
  lstate.party.forEach((member) => {
    member.ability_primary.cooldown_now -= wstate.delta
    if (member.ability_primary.cooldown_now <= 0) {
      // ability lands make calclations
      _(lstate.enemies)
        // TODO: change to - is valid target (check if alive and can be attacked)
        .filter((ch) => ch.hp_now > 0)
        .take(member.ability_primary.target_count)
        .forEach((target: Character) => {
          _.forEach(member.ability_primary.effects, (effect: COMBAT_EFFECT) => {
            // the effet fn applies the changes to the targets
            _local_state.log.push(combat_effect[effect](member, target, member.ability_primary))
          })
        })
      member.ability_primary.cooldown_now = member.ability_primary.cooldown
      lstate.winner = _is_combat_over(lstate.party, lstate.enemies)
    }
  })
  lstate.enemies.forEach((member) => {
    member.ability_primary.cooldown_now -= wstate.delta
    if (member.ability_primary.cooldown_now <= 0) {
      // ability lands make calclations
      _(lstate.party)
        // TODO: change to - is valid target (check if alive and can be attacked)
        .filter((ch) => ch.hp_now > 0)
        .take(member.ability_primary.target_count)
        .forEach((target: Character) => {
          _.forEach(member.ability_primary.effects, (effect: COMBAT_EFFECT) => {
            // the effet fn applies the changes to the targets
            const log = combat_effect[effect](member, target, member.ability_primary)
            _local_state.log.push(log)
          })
        })
      member.ability_primary.cooldown_now = member.ability_primary.cooldown
      lstate.winner = _is_combat_over(lstate.party, lstate.enemies)
    }
  })
}

// combat screen needs to be a function that returns a render ?
const CombatScreen = (state: WorldState) => {
  // TODO: 
  // fetch encounter
  // handle input 
  // run simulation
  // render

  _init(state)
  if (_local_state.winner == COMBAT_RESULT.ONGOING)
    _process(state, _local_state)

  // RENDER
  const header = styleText('gray', '[Start Dungeon Group]')
  const sub_header = `=== ${dungeon_floor_1.display_name} ===`
  const body: Array<string> = [];
  let len = Math.max(_local_state.party.length, _local_state.enemies.length)
  let ch: Character
  for (let index = 0; index < len; index++) {
    let row = ""
    let srow = ""
    ch = _.get(_local_state.party, index)
    if (ch) {
      row += character_status(ch)
      srow += ability_cast_bar(ch.ability_primary)
      srow += _.padStart(status_bar(ch), 20, ' ')
    }
    row = _.padEnd(row, 46, " ")
    srow = _.padEnd(srow, 46, " ")
    ch = _.get(_local_state.enemies, index)
    if (ch) {
      row += character_status(ch)
      srow += ability_cast_bar(ch.ability_primary)
      srow += _.padStart(status_bar(ch), 17, ' ')
    }
    body.push(row)
    body.push(srow)
  }
  const dynamic_width = _.maxBy(body, (line) => line.length)?.length || 0

  console.log(dynamic_width)
  console.log(header);
  console.log(_.pad(sub_header, dynamic_width, ' ') + '\n');
  console.log(body.join('\n'))
  console.log(`

[Turn Log]`);
  _.takeRight(_local_state.log, 3).map(log => console.log(log))
  return state
}
export default CombatScreen;
