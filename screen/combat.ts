import _ from "lodash"
import { styleText } from "node:util";
import type { Character } from "../types/Character"
import { _empty_screen_fn, SCREEN_IDS, type Screen, type WorldState } from "../types/WorldState"
import { entity_status } from "./components/character_status.ts";
import { dungeon_floor_1 } from "../data/encounters.ts";
import { entity_cast_bar } from "./components/cast_bar.ts";
import status_bar from "./components/status_bar.ts";
import { render, render_debug } from "../lib/render.ts";
import { open_screen } from "../controller/screen.ts";
import { game_log, create_world, type Entity, type World, combat_system } from "../lib/ecs.ts";
import { init_entity, character_to_entity } from "../lib/ecs.util.ts";

enum COMBAT_RESULT {
  ONGOING,
  ATTACKER_WIN,
  DEFENDER_WIN,
}

let _combat_state: World
let init: Entity;

type CombatState = {
  winner: COMBAT_RESULT,
  player_cache: Record<Entity, Character>
  enemy_cache: Record<Entity, Character>
}

let _local_state: CombatState = {
  winner: COMBAT_RESULT.ONGOING,
  player_cache: {},
  enemy_cache: {}
}

const _init = (state: WorldState) => {
  _combat_state = create_world();
  [_combat_state, init] = init_entity(_combat_state);
  _combat_state = _.reduce(state.party,
    (combat_world, id: string) => {
      let eid: Entity
      const character = _.get(state.roster, id);
      [combat_world, eid] = character_to_entity(combat_world, character, "player");
      _local_state.player_cache[eid] = character
      return combat_world
    }, _combat_state)

  _combat_state = _.reduce(dungeon_floor_1.enemies,
    (combat_world, enemy) => {
      let eid: Entity
      const character = _.cloneDeep(enemy);
      [combat_world, eid] = character_to_entity(combat_world, character, "enemy");
      _local_state.enemy_cache[eid] = character
      return combat_world;
    }, _combat_state)
}

const _clear = (world: WorldState) => {
  //TODO: set winner or loser in world state
}

const CombatScreen = (state: WorldState) => {
  // TODO: 
  // fetch encounter
  // handle input 
  // run simulation
  // render
  _combat_state = combat_system(_combat_state, state.delta);
  if (_local_state.winner != COMBAT_RESULT.ONGOING) {
    _local_state.winner == COMBAT_RESULT.ATTACKER_WIN ? render('PARTY') : render('ENEMIES')
    // render('COMBAT OVER WINNER IS')
    open_screen(state, SCREEN_IDS.combat_reward)
    return
  }

  // RENDER
  const header = styleText('gray', '[Start Dungeon Group]')
  const sub_header = `=== ${dungeon_floor_1.display_name} ===`
  const body: Array<string> = [];
  // const entities = query(_combat_state, ["Attributes", "TagTargetable"]);
  const len = Math.max(_.size(_local_state.enemy_cache), _.size(_local_state.player_cache))

  // render_debug(_combat_state)
  let entity: Entity
  let ch: Character
  for (let index = 0; index < len; index++) {
    let row = ""
    let srow = ""
    // get_component(_combat_state, entity, 'TagTargetable')
    entity = _.toNumber(_.get(_.keys(_local_state.player_cache), index))
    ch = _.get(_local_state.player_cache, entity)

    if (ch) {
      row += entity_status(_combat_state, entity, ch)
      srow += entity_cast_bar(_combat_state, entity)
      srow += _.padStart(status_bar(ch), 20, ' ')
    }
    row = _.padEnd(row, 46, " ")
    srow = _.padEnd(srow, 46, " ")

    entity = _.toNumber(_.get(_.keys(_local_state.enemy_cache), index))
    ch = _.get(_local_state.enemy_cache, entity)

    if (ch) {
      row += entity_status(_combat_state, entity, ch)
      srow += entity_cast_bar(_combat_state, entity)
      srow += _.padStart(status_bar(ch), 20, ' ')
    }
    body.push(row)
    body.push(srow)
  }
  const dynamic_width = _.maxBy(body, (line) => line.length)?.length || 0

  render(header);
  render(_.pad(sub_header, dynamic_width, ' ') + '\n');
  render(body.join('\n'))
  render(`

[Turn Log] 3/${game_log.length}`);
  _.takeRight(game_log, 4).map(log => render(log))
  return state
}

const screen: Screen = {
  init: _init,
  process: CombatScreen,
  clear: _clear
}
export default screen;
